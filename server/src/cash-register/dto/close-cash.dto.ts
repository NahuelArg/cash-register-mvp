import { IsNumber, Min, IsOptional, IsString } from 'class-validator';

export class CloseCashDto {
    @IsNumber()
    @Min(0)
    actualBalance: number;

    @IsString()
    @IsOptional()
    notes?: string;
}