import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { HistorialCrecimiento } from "./historialCrecimiento.entity";

@Entity()
export class Paciente {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    nombre: string

    @Column('text')
    genero: string

    @Column('date')
    fecha_nacimiento: Date

    @Column({ type: 'timestamp' })
    fecha_registro: Date;

    @OneToMany(() => HistorialCrecimiento, historial => historial.paciente)
    crecimiento: HistorialCrecimiento[]

    @BeforeInsert()
    setFechaMedicion() {
        this.fecha_registro = new Date(); // Establece la fecha actual al momento de insertar
    }

}
