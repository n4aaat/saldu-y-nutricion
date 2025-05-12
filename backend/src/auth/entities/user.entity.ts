import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { unique: true })
    email: string

    @Column('text', {select:false})
    password: string

    @Column('text')
    fullName: string

    @Column('boolean', {default: true})
    isActive: boolean

    @Column('varchar', {default: 'user'})
    roles: string

}
