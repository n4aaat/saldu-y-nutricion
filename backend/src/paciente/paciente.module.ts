import { Module } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { PacienteController } from './paciente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity';
import { HistorialCrecimiento } from './entities/historialCrecimiento.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Paciente, HistorialCrecimiento]),
    AuthModule
  ],
  controllers: [PacienteController],
  providers: [PacienteService],
})
export class PacienteModule {}
