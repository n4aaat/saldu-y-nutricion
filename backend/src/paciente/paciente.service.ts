import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from './entities/paciente.entity';
import { CreateHistorialDto } from './dto/create-historial.dto';
import { HistorialCrecimiento } from './entities/historialCrecimiento.entity';
import { percentiles } from './constants/data';
import { UpdateHistorialDto } from './dto/update-historial.dto';

@Injectable()
export class PacienteService {

  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
    @InjectRepository(HistorialCrecimiento)
    private readonly historialRepository: Repository<HistorialCrecimiento>
  ) { }

  async create(createpacienteDto: CreatePacienteDto) {
    const paciente = this.pacienteRepository.create(createpacienteDto)
    await this.pacienteRepository.save(paciente)
    return paciente;
  }

  findAll() {
    return this.pacienteRepository.find({
      relations: ['crecimiento'],
      select: ['id', 'nombre', 'genero', 'fecha_nacimiento'],
      order: { nombre: 'ASC' },
    }).then((pacientes) => {
      return pacientes.map((paciente) => {

        const historialOrdenado = paciente.crecimiento.sort((a, b) => {
          return new Date(b.fecha_medicion).getTime() - new Date(a.fecha_medicion).getTime();
        });
        const historialActual = historialOrdenado.length > 0 ? historialOrdenado[0] : null;

        const pesoActual = historialActual ? historialActual.peso : 0;
        const alturaActual = historialActual ? historialActual.altura : 0;

        const edadActual = this.calcularEdad(new Date(paciente.fecha_nacimiento));

        return {
          id: paciente.id,
          nombre: paciente.nombre,
          genero: paciente.genero,
          fecha_nacimiento: paciente.fecha_nacimiento,
          peso_actual: pesoActual,
          altura_actual: alturaActual,
          edad_actual: edadActual // Agregar la edad actual al objeto de retorno
        };
      });
    });
  }

  async findOne(id: string) {
    const paciente = await this.pacienteRepository.findOneBy({ id })
    if (!paciente)
      throw new NotFoundException(`DDDEl paciente con el id ${id} no se encuentra.`)
    let result = this.calcularEdad(new Date(paciente.fecha_nacimiento))
    let percentil = {
      peso: (paciente.genero === "hombre") ? percentiles.peso.boy : percentiles.peso.girl,
      estatura: (paciente.genero === "hombre") ? percentiles.estatura.boy : percentiles.estatura.girl,
      imc: (paciente.genero === "hombre") ? percentiles.imc.boy : percentiles.imc.girl
    }
    return ({ ...paciente, ...result, percentil: { ...percentil } })
  }

  private calcularEdad(fechaNacimiento: Date, fechaActual: Date = new Date()) {
    const diaActual = fechaActual.getDate();
    const mesActual = fechaActual.getMonth() + 1; // Los meses se indexan desde 0

    const diaNacimiento = fechaNacimiento.getDate();
    const mesNacimiento = fechaNacimiento.getMonth() + 1;
    const anioNacimiento = fechaNacimiento.getFullYear();

    let edadAnios = fechaActual.getFullYear() - anioNacimiento;
    let edadMeses = mesActual - mesNacimiento;
    let edadDias = diaActual - diaNacimiento;

    // Ajustar la edad si los meses o los días aún no se han alcanzado en el año actual
    if (edadMeses < 0 || (edadMeses === 0 && edadDias < 0)) {
      edadAnios--;
      edadMeses += 12;
    }

    if (edadDias < 0) {
      const ultimoDiaMesAnterior = new Date(anioNacimiento, mesNacimiento - 1, 0).getDate();
      edadDias += ultimoDiaMesAnterior;
      edadMeses--;
    }

    // Calcular la edad en decimales
    const diasEnAnioActual = (new Date(anioNacimiento, 11, 31).getTime() - new Date(anioNacimiento, 0, 1).getTime()) / (1000 * 60 * 60 * 24);
    let edadDecimal = (edadDias + (edadMeses * 30) + (edadAnios * diasEnAnioActual)) / diasEnAnioActual;

    return {
      anios: edadAnios,
      meses: edadMeses,
      dias: edadDias,
      decimal: edadDecimal.toFixed(2)
    };
  }

  async update(id: string, updatePacienteDto: UpdatePacienteDto) {
    const paciente = await this.pacienteRepository.findOne({ where: { id } });
    if (!paciente) {
      throw new NotFoundException(`El paciente con el id ${id} no se encuentra.`);
    }
    Object.assign(paciente, updatePacienteDto);
    await this.pacienteRepository.save(paciente);
    return paciente;
  }

  async remove(id: string) {
    const paciente = await this.pacienteRepository.findOne({ where: { id } });
    if (!paciente) {
      throw new NotFoundException(`El paciente con el id ${id} no se encuentra.`);
    }
    await this.pacienteRepository.remove(paciente);
    return { message: `Paciente con id ${id} eliminado exitosamente.` };
  }

  async createHistorial(createHistoriaDto: CreateHistorialDto) {
    const { paciente, ...historialDto } = createHistoriaDto
    const pacienteobj = await this.pacienteRepository.findOneBy({ id: paciente })
    if (!pacienteobj)
      throw new NotFoundException(`El paciente aaa ${pacienteobj} no se encuentra.`);
    const historial = this.historialRepository.create({
      paciente: pacienteobj,
      ...historialDto,
    });
    await this.historialRepository.save(historial);
    return historial
  }

  async getHistorialCrecimiento(id: string) {
    const paciente = await this.pacienteRepository.findOne({ where: { id }, relations: ['crecimiento'] });
    if (!paciente) {
      throw new NotFoundException(`bbbEl paciente con el id ${id} no se encuentra.`);
    }
    const historialConEdad = paciente.crecimiento.map((h) => ({
      id: h.id,
      fecha_medicion: h.fecha_medicion,
      altura: h.altura,
      peso: h.peso,
      imc: h.imc,
      edad_decimal: this.calcularEdad(new Date(paciente.fecha_nacimiento), new Date(h.fecha_medicion)).decimal // Calcula la edad decimal
    }));
    return historialConEdad;
  }

  async updateHistorial(id: number, updateHistorialDto: UpdateHistorialDto) {
    const historial = await this.historialRepository.findOne({ where: { id } });
    if (!historial) {
      throw new NotFoundException(`CCCEl historial con el id ${id} no se encuentra.`);
    }
    Object.assign(historial, updateHistorialDto);
    await this.historialRepository.save(historial);
    return historial;
  }

  async removeHistorial(id: number) {
    const historial = await this.historialRepository.findOne({ where: { id } });
    if (!historial) {
      throw new NotFoundException(`El historial con el id ${id} no se encuentra.`);
    }
    await this.historialRepository.remove(historial);
    return { message: `Historial con id ${id} eliminado exitosamente.` };
  }

  percentil(id: string) {
    if (id === "imc") {
      return percentiles.imc;
    } else if (id === "peso") {
      return percentiles.peso;
    } else if (id === "altura") {
      return percentiles.estatura;
    } else {
      throw new Error("Parámetro inválido");
    }
  }
}
