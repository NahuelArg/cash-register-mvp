import { IsNumber, IsEnum, IsString, IsOptional, Min } from 'class-validator';

export class CreateMovementDto {
    @IsEnum(['INCOME', 'EXPENSE'])
    type: 'INCOME' | 'EXPENSE';

    @IsNumber()
    @Min(0.01)
    amount: number;

    @IsEnum(['CASH', 'CARD', 'TRANSFER'])
    paymentMethod: 'CASH' | 'CARD' | 'TRANSFER';

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    category?: string;
}