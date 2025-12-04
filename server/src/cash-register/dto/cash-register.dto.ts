import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  Min,
  IsEnum,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class OpenCashDto {
  @ApiProperty({ example: 1000, description: 'Monto inicial en caja' })
  @IsNumber()
  @Min(0)
  openingBalance: number;
}

export class CreateMovementDto {
  @ApiProperty({
    enum: ['SALE', 'EXPENSE'],
    example: 'SALE',
    description: 'Tipo de movimiento',
  })
  @IsEnum(['SALE', 'EXPENSE'])
  type: 'SALE' | 'EXPENSE';

  @ApiProperty({ example: 500, description: 'Monto del movimiento' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    enum: ['CASH', 'CARD', 'TRANSFER', 'MIXED'],
    example: 'CASH',
    description: 'Método de pago',
  })
  @IsEnum(['CASH', 'CARD', 'TRANSFER', 'MIXED'])
  paymentMethod: 'CASH' | 'CARD' | 'TRANSFER' | 'MIXED';

  @ApiPropertyOptional({
    example: 'Venta taller',
    description: 'Descripción del movimiento',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'Servicios',
    description: 'Categoría del movimiento',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: 'uuid-del-barbero',
    description: 'ID del barbero (requerido para SALE, opcional para EXPENSE)',
  })
  @IsOptional()
  @IsString()
  barberId?: string;
}

export class CloseCashDto {
  @ApiProperty({
    example: 2500,
    description: 'Monto real contado en la caja',
  })
  @IsNumber()
  @Min(0)
  actualBalance: number;

  @ApiPropertyOptional({
    example: 'Todo cuadra bien',
    description: 'Notas al cerrar',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CashStatusResponseDto {
  id: string;
  balance: number;
  isOpen: boolean;
  openedAt: Date;
  movements: any[];
  summary: {
    totalIncomes: number;
    totalExpenses: number;
    currentBalance: number;
  };
}

export class CashMovementResponseDto {
  id: string;
  type: string;
  amount: number;
  paymentMethod: string;
  description?: string;
  category?: string;
  barberId?: string;
  barber?: {
    id: string;
    name: string;
  };
  createdAt: Date;
}

export class PaymentMethodBreakdown {
  @ApiProperty({ example: 1200, description: 'Total en efectivo' })
  cash: number;

  @ApiProperty({ example: 800, description: 'Total con tarjeta' })
  card: number;

  @ApiProperty({ example: 500, description: 'Total por transferencia' })
  transfer: number;

  @ApiProperty({ example: 300, description: 'Total mixto' })
  mixed: number;
}

export class BarberBreakdownItem {
  @ApiProperty({ example: 'uuid-barbero', description: 'ID del barbero' })
  barberId: string;

  @ApiProperty({ example: 'Barbero 1', description: 'Nombre del barbero' })
  barberName: string;

  @ApiProperty({ example: 1200, description: 'Total de ventas del barbero' })
  totalSales: number;

  @ApiProperty({ example: 8, description: 'Cantidad de ventas del barbero' })
  salesCount: number;

  @ApiPropertyOptional({ description: 'Desglose por método de pago' })
  paymentBreakdown?: PaymentMethodBreakdown;
}

export class CashClosingResponseDto {
  id: string;
  expectedBalance: number;
  actualBalance: number;
  difference: number;
  notes?: string;
  closedAt: Date;

  @ApiPropertyOptional({ description: 'Desglose por método de pago' })
  paymentBreakdown?: PaymentMethodBreakdown;

  @ApiPropertyOptional({ example: 15, description: 'Cantidad de ventas' })
  salesCount?: number;

  @ApiPropertyOptional({ example: 3, description: 'Cantidad de egresos' })
  expensesCount?: number;

  @ApiPropertyOptional({ example: 2800, description: 'Total de ventas' })
  totalSales?: number;

  @ApiPropertyOptional({ example: 300, description: 'Total de egresos' })
  totalExpenses?: number;

  @ApiPropertyOptional({ description: 'Desglose por barbero', type: [BarberBreakdownItem] })
  barberBreakdown?: BarberBreakdownItem[];

  @ApiPropertyOptional({ description: 'Usuario que cerró la caja' })
  closedBy?: {
    id: string;
    name: string;
    email: string;
  };

  @ApiPropertyOptional({ description: 'Información de la caja registradora' })
  cashRegister?: {
    id: string;
    openedAt: Date;
    closedAt?: Date;
  };
}

export class GetHistoryQueryDto {
  @ApiPropertyOptional({
    example: '2025-01-01',
    description: 'Fecha de inicio (formato ISO 8601)',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2025-12-31',
    description: 'Fecha de fin (formato ISO 8601)',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    enum: ['day', 'month', 'year'],
    example: 'month',
    description: 'Filtro rápido por período',
  })
  @IsOptional()
  @IsEnum(['day', 'month', 'year'])
  period?: 'day' | 'month' | 'year';

  @ApiPropertyOptional({
    example: 10,
    description: 'Límite de resultados',
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;
}
