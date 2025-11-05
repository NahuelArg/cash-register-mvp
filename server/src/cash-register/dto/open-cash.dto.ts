import { IsNumber, Min } from 'class-validator';

export class OpenCashDto {
    @IsNumber()
    @Min(0, { message: 'Opening balance must be >= 0' })
    openingBalance: number;
}