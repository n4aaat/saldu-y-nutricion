import { IsDateString, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateHistorialDto{

    @IsString()
    @MinLength(1)
    paciente: string

    @IsDateString()
    fecha_medicion: Date

    @IsPositive()
    @IsNumber()
    altura: number

    @IsPositive()
    @IsNumber()
    peso: number

    @IsPositive()
    @IsNumber()
    imc: number;
    
    @IsPositive()
    @IsNumber()
    @IsOptional()
    percentil?: number;
}