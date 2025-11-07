import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  Min,
  IsEnum,
  IsString,
  IsOptional,
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
  createdAt: Date;
}

export class CashClosingResponseDto {
  id: string;
  expectedBalance: number;
  actualBalance: number;
  difference: number;
  notes?: string;
  closedAt: Date;
}
