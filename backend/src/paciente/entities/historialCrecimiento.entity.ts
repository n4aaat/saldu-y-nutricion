import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Paciente } from "./paciente.entity";

@Entity()
export class HistorialCrecimiento{
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Paciente, paciente => paciente.crecimiento)
    paciente: Paciente

    @Column({ type: 'date' })
    fecha_medicion: Date

    @Column({ type: 'decimal', precision: 5, scale:2 })
    altura: number

    @Column({ type: 'decimal', precision: 5, scale:2 })
    peso: number

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    imc: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, default: 0 })
    percentil?: number;
}