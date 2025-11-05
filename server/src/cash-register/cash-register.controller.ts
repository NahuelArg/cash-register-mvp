import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CashRegisterService } from './cash-register.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  OpenCashDto,
  CreateMovementDto,
  CloseCashDto,
  CashStatusResponseDto,
  CashClosingResponseDto,
  CashMovementResponseDto,
} from './dto/cash-register.dto';

@ApiTags('Cash Register')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cash-register')
export class CashRegisterController {
  constructor(private readonly service: CashRegisterService) {}

  @Post('open')
  @ApiOperation({ summary: 'Abrir caja registradora' })
  @ApiResponse({ status: 201, description: 'Caja abierta exitosamente' })
  async openCash(
    @CurrentUser() user: { userId: string; email: string },
    @Body() dto: OpenCashDto,
  ) {
    return this.service.openCash(user.userId, dto);
  }

  @Get('status')
  @ApiOperation({ summary: 'Obtener estado actual de la caja' })
  @ApiResponse({ status: 200, type: CashStatusResponseDto })
  async getStatus(@CurrentUser() user: { userId: string; email: string }) {
    const status = await this.service.getCashStatus(user.userId);
    if (!status) {
      throw new BadRequestException('No hay caja abierta');
    }
    return status;
  }

  @Post('movement')
  @ApiOperation({ summary: 'Registrar movimiento (ingreso/egreso)' })
  @ApiResponse({ status: 201, description: 'Movimiento registrado' })
  async addMovement(
    @CurrentUser() user: { userId: string; email: string },
    @Body() dto: CreateMovementDto & { cashId: string },
  ) {
    if (!dto.cashId) {
      throw new BadRequestException('cashId es requerido');
    }
    return this.service.createMovement(user.userId, dto.cashId, dto);
  }

  @Post('close/:cashId')
  @ApiOperation({ summary: 'Cerrar caja y generar arqueo' })
  @ApiResponse({ status: 200, type: CashClosingResponseDto })
  async closeCash(
    @CurrentUser() user: { userId: string; email: string },
    @Param('cashId') cashId: string,
    @Body() dto: CloseCashDto,
  ) {
    return this.service.closeCash(user.userId, cashId, dto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Obtener historial de cierres' })
  @ApiResponse({
    status: 200,
    type: [CashClosingResponseDto],
  })
  async getHistory(@CurrentUser() user: { userId: string; email: string }) {
    return this.service.getClosingsHistory(user.userId);
  }

  @Get('movements/:cashId')
  @ApiOperation({ summary: 'Obtener todos los movimientos de una caja' })
  @ApiResponse({ status: 200, type: [CashMovementResponseDto] })
  async getMovements(
    @CurrentUser() user: { userId: string; email: string },
    @Param('cashId') cashId: string,
  ) {
    return this.service.getAllMovements(user.userId, cashId);
  }
}