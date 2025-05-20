import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { CreateHistorialDto } from './dto/create-historial.dto';
import { UpdateHistorialDto } from './dto/update-historial.dto';
import { Response } from 'express'; // Asegúrate de importar Response


@Controller('paciente')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) { }


  // Coloca el endpoint de exportación ANTES del endpoint con :id
  @Get('export-excel')
  @Auth(ValidRoles.user, ValidRoles.admin)
  async exportToExcel(@Res() res) {
    const buffer = await this.pacienteService.exportToExcel();
    
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="pacientes.xlsx"',
      'Content-Length': buffer.length
    });
    
    res.end(buffer);
  }

  @Post()
  @Auth(ValidRoles.user, ValidRoles.admin)
  create(@Body() createpacienteDto: CreatePacienteDto) {
    return this.pacienteService.create(createpacienteDto);
  }

  @Get()
  @Auth(ValidRoles.user)
  findAll() {
    return this.pacienteService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const paciente = await this.pacienteService.findOne(id);
    const historial = await this.pacienteService.getHistorialCrecimiento(id);
    const pacienteResponse = {
      id: paciente.id,
      nombre: paciente.nombre,
      genero: paciente.genero,
      fecha_nacimiento: paciente.fecha_nacimiento,
      anios: paciente.anios,
      meses: paciente.meses,
      dias: paciente.dias,
      anios_decimal: paciente.decimal,
      historial: historial,
      percentiles: paciente.percentil
    };
    return pacienteResponse;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatepacienteDto: UpdatePacienteDto) {
    return this.pacienteService.update(id, updatepacienteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pacienteService.remove(id);
  }

  @Delete('historial/:id')
  removeHistorial(@Param('id') id: number) {
    return this.pacienteService.removeHistorial(id);
  }

  @Post('historial')
  @Auth(ValidRoles.user, ValidRoles.admin)
  createHistorial(@Body() createHistorialDto: CreateHistorialDto) {
    return this.pacienteService.createHistorial(createHistorialDto);
  }

  @Patch('historial/:id')
  @Auth(ValidRoles.user, ValidRoles.admin)
  updateHistorial(@Param('id') id: number, @Body() updateHistorialDto: UpdateHistorialDto) {
    return this.pacienteService.updateHistorial(id, updateHistorialDto);
  }

  @Get('percentil/:id')
  async imc(@Param('id') id: string) {
    const percentil = await this.pacienteService.percentil(id);
    return percentil;
  }


}

