import { IsDateString, IsNumber, IsPositive, IsString, MinLength } from "class-validator"

export class CreatePacienteDto {

    @IsString({message: 'El Nombre debe ser una cadena de texto'})
    @MinLength(1, {message: 'El nombre debe tener al menos 1 caracter'})
    nombre: string

    @IsString()
    @MinLength(1)
    genero: string

    @IsDateString()
    fecha_nacimiento: Date
}
