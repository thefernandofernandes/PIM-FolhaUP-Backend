import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BaseEntity,
    PrimaryColumn
} from "typeorm";
import { Funcionario } from "./Funcionario";

@Entity('empresa', { schema: 'pim_folhaup' })
export class Empresa extends BaseEntity  {

    @PrimaryColumn({ type: 'numeric' })
    cnpj: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    razaosocial: string;

    @Column({ type: 'varchar', length: 200, nullable: false })
    endereco: string;

    @Column({ type: 'date', nullable: true })
    dataabertura: Date;

    @Column({ type: 'bool', nullable: true })
    situacaocadastral: Boolean;

    @Column({ type: 'varchar', length: 50, nullable: false })
    telefone: string;

    @Column({ type: 'varchar', length: 200, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    senha: string;

    @OneToMany(() => Funcionario, funcionario => funcionario.empresa)
    funcionarios: Funcionario[];
    


}