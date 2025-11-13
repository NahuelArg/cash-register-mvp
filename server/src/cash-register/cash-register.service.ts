import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

  async closeCash(userId: string, cashId: string, dto: CloseCashDto) {
    const cash = await this.prisma.cashRegister.findFirst({
      where: { id: cashId, userId, status: 'OPEN' },
    });

    if (!cash) {
      throw new NotFoundException('Caja no encontrada');
    }

    const difference = dto.actualBalance - cash.balance;

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

  async getClosingsHistory(userId: string, limit = 10) {
    return this.prisma.cashClosing.findMany({
      where: {
        cashRegister: { userId },
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
      orderBy: { createdAt: 'desc' },
    });
  }
}