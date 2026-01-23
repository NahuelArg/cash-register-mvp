import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  OpenCashDto,
  CreateMovementDto,
  CloseCashDto,
} from './dto/cash-register.dto';

@Injectable()
export class CashRegisterService {
  constructor(private prisma: PrismaService) {}

  async openCash(userId: string, dto: OpenCashDto) {
    // Verificar que no haya caja abierta
    const openCash = await this.prisma.cashRegister.findFirst({
      where: {
        userId,
        status: 'OPEN',
      },
    });

    if (openCash) {
      throw new BadRequestException('Ya hay una caja abierta');
    }

    // Crear caja y movimiento de apertura
    return this.prisma.$transaction(async (tx) => {
      const cash = await tx.cashRegister.create({
        data: {
          userId,
          status: 'OPEN',
          balance: dto.openingBalance,
          openedAt: new Date(),
        },
      });

      await tx.cashMovement.create({
        data: {
          cashRegisterId: cash.id,
          type: 'OPENING',
          amount: dto.openingBalance,
          paymentMethod: 'CASH',
          description: 'Apertura de caja',
          createdById: userId,
        },
      });

      return cash;
    });
  }

  async createMovement(
    userId: string,
    cashId: string,
    dto: CreateMovementDto,
  ) {
    // Verificar caja existe y está abierta
    const cash = await this.prisma.cashRegister.findFirst({
      where: {
        id: cashId,
        userId,
        status: 'OPEN',
      },
    });

    if (!cash) {
      throw new NotFoundException('Caja no encontrada o cerrada');
    }

    // Validar barberId es requerido para SALE
    if (dto.type === 'SALE' && !dto.barberId) {
      throw new BadRequestException('El barbero es requerido para ventas');
    }

    // Validar que el barbero existe y está activo si se proporciona barberId
    if (dto.barberId) {
      const barber = await this.prisma.barber.findFirst({
        where: {
          id: dto.barberId,
          isActive: true,
        },
      });

      if (!barber) {
        throw new NotFoundException('Barbero no encontrado o inactivo');
      }
    }

    // Calcular nuevo balance
    const amount = dto.type === 'SALE' ? dto.amount : -dto.amount;
    const newBalance = cash.balance + amount;

    // Registrar movimiento y actualizar balance
    return this.prisma.$transaction(async (tx) => {
      const movement = await tx.cashMovement.create({
        data: {
          cashRegisterId: cashId,
          type: dto.type === 'SALE' ? 'SALE' : 'EXPENSE',
          amount: dto.amount,
          paymentMethod: dto.paymentMethod,
          description: dto.description,
          category: dto.category,
          barberId: dto.barberId,
          createdById: userId,
        },
      });

      await tx.cashRegister.update({
        where: { id: cashId },
        data: { balance: newBalance },
      });

      return { movement, newBalance };
    });
  }

  async getCashStatus(userId: string) {
    const cash = await this.prisma.cashRegister.findFirst({
      where: { userId, status: 'OPEN' },
      include: {
        movements: {
          include: {
            barber: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!cash) {
      return null;
    }

    const totalIncomes = cash.movements
      .filter((m) => m.type === 'SALE')
      .reduce((sum, m) => sum + m.amount, 0);

    const totalExpenses = cash.movements
      .filter((m) => m.type === 'EXPENSE')
      .reduce((sum, m) => sum + m.amount, 0);

    return {
      id: cash.id,
      balance: cash.balance,
      isOpen: cash.status === 'OPEN',
      openedAt: cash.openedAt,
      movements: cash.movements,
      summary: {
        totalIncomes,
        totalExpenses,
        currentBalance: cash.balance,
      },
    };
  }

  private async calculatePaymentBreakdown(cashId: string) {
    const movements = await this.prisma.cashMovement.findMany({
      where: {
        cashRegisterId: cashId,
        type: 'SALE',
      },
    });

    const breakdown = {
      totalCash: 0,
      totalCard: 0,
      totalTransfer: 0,
      totalMixed: 0,
      salesCount: 0,
      totalSales: 0,
    };

    movements.forEach((movement) => {
      breakdown.salesCount++;
      breakdown.totalSales += movement.amount;

      switch (movement.paymentMethod) {
        case 'CASH':
          breakdown.totalCash += movement.amount;
          break;
        case 'CARD':
          breakdown.totalCard += movement.amount;
          break;
        case 'TRANSFER':
          breakdown.totalTransfer += movement.amount;
          break;
        case 'MIXED':
          breakdown.totalMixed += movement.amount;
          break;
      }
    });

    return breakdown;
  }

  private async calculateExpensesStats(cashId: string) {
    const expenses = await this.prisma.cashMovement.findMany({
      where: {
        cashRegisterId: cashId,
        type: 'EXPENSE',
      },
    });

    return {
      expensesCount: expenses.length,
      totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
    };
  }

  private async calculateBarberBreakdown(cashId: string) {
    const movements = await this.prisma.cashMovement.findMany({
      where: {
        cashRegisterId: cashId,
        type: 'SALE',
        barberId: { not: null },
      },
      include: {
        barber: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Agrupar por barbero
    const barberMap = new Map<string, any>();

    movements.forEach((movement) => {
      if (!movement.barber) return;

      const barberId = movement.barber.id;
      if (!barberMap.has(barberId)) {
        barberMap.set(barberId, {
          barberId: movement.barber.id,
          barberName: movement.barber.name,
          totalSales: 0,
          salesCount: 0,
          paymentBreakdown: {
            cash: 0,
            card: 0,
            transfer: 0,
            mixed: 0,
          },
        });
      }

      const barberData = barberMap.get(barberId);
      barberData.totalSales += movement.amount;
      barberData.salesCount++;

      // Desglose por método de pago
      switch (movement.paymentMethod) {
        case 'CASH':
          barberData.paymentBreakdown.cash += movement.amount;
          break;
        case 'CARD':
          barberData.paymentBreakdown.card += movement.amount;
          break;
        case 'TRANSFER':
          barberData.paymentBreakdown.transfer += movement.amount;
          break;
        case 'MIXED':
          barberData.paymentBreakdown.mixed += movement.amount;
          break;
      }
    });

    return Array.from(barberMap.values());
  }

  async closeCash(userId: string, cashId: string, dto: CloseCashDto) {
    const cash = await this.prisma.cashRegister.findFirst({
      where: { id: cashId, userId, status: 'OPEN' },
    });

    if (!cash) {
      throw new NotFoundException('Caja no encontrada');
    }

    const difference = dto.actualBalance - cash.balance;

    // Calcular estadísticas
    const paymentBreakdown = await this.calculatePaymentBreakdown(cashId);
    const expensesStats = await this.calculateExpensesStats(cashId);
    const barberBreakdown = await this.calculateBarberBreakdown(cashId);

    return this.prisma.$transaction(async (tx) => {
      const closing = await tx.cashClosing.create({
        data: {
          cashRegisterId: cashId,
          expectedBalance: cash.balance,
          actualBalance: dto.actualBalance,
          difference,
          notes: dto.notes,
          closedById: userId,
          closedAt: new Date(),
          // Payment method breakdown
          totalCash: paymentBreakdown.totalCash,
          totalCard: paymentBreakdown.totalCard,
          totalTransfer: paymentBreakdown.totalTransfer,
          totalMixed: paymentBreakdown.totalMixed,
          // Statistics
          salesCount: paymentBreakdown.salesCount,
          totalSales: paymentBreakdown.totalSales,
          expensesCount: expensesStats.expensesCount,
          totalExpenses: expensesStats.totalExpenses,
          // Barber breakdown
          barberBreakdown: barberBreakdown.length > 0 ? barberBreakdown : undefined,
        },
        include: {
          closedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          cashRegister: {
            select: {
              id: true,
              openedAt: true,
              closedAt: true,
            },
          },
        },
      });

      await tx.cashRegister.update({
        where: { id: cashId },
        data: {
          status: 'CLOSED',
          closedAt: new Date(),
        },
      });

      return closing;
    });
  }

  async getClosingsHistory(
    userId: string,
    filters?: {
      startDate?: string;
      endDate?: string;
      period?: 'day' | 'month' | 'year';
      limit?: number;
    },
  ) {
    const limit = filters?.limit || 10;
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    // Calcular fechas según el período
    if (filters?.period) {
      const now = new Date();
      switch (filters.period) {
        case 'day':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          endDate = new Date(now.setHours(23, 59, 59, 999));
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
          break;
      }
    } else if (filters?.startDate || filters?.endDate) {
      // Usar fechas personalizadas
      if (filters.startDate) {
        startDate = new Date(filters.startDate);
      }
      if (filters.endDate) {
        endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
      }
    }

    // Construir el where clause
    const where: any = {
      cashRegister: { userId },
    };

    if (startDate || endDate) {
      where.closedAt = {};
      if (startDate) {
        where.closedAt.gte = startDate;
      }
      if (endDate) {
        where.closedAt.lte = endDate;
      }
    }

    return this.prisma.cashClosing.findMany({
      where,
      include: {
        closedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        cashRegister: {
          select: {
            id: true,
            openedAt: true,
            closedAt: true,
          },
        },
      },
      orderBy: { closedAt: 'desc' },
      take: limit,
    });
  }

  async getAllMovements(userId: string, cashId: string) {
    const cash = await this.prisma.cashRegister.findFirst({
      where: { id: cashId, userId },
    });

    if (!cash) {
      throw new NotFoundException('Caja no encontrada');
    }

    return this.prisma.cashMovement.findMany({
      where: { cashRegisterId: cashId },
      include: {
        barber: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllBarbers() {
    return this.prisma.barber.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }
}