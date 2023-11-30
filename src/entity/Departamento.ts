import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Empresa } from "./Empresa";
import {Funcionario} from "./Funcionario"
@Entity({ schema: 'pim_folhaup', name: 'departamento' })
export class Departamento {

    @PrimaryGeneratedColumn({ type: 'numeric'})
    codigodepartamento: number;

    @Column({ type: 'numeric', precision: 14, nullable: true })
    cnpj: number;

    @Column({ type: 'varchar', length: 50, nullable: false })
    nome: string;

    @ManyToOne(() => Empresa, empresa => empresa.funcionarios)
    @JoinColumn({ name: 'cnpj' })
    empresa: Empresa;

    @OneToMany(() => Funcionario, funcionario => funcionario.departamento)
    funcionarios: Funcionario[]; // Correção na definição da propriedade
}