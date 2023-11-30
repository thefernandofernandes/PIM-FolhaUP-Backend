import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinColumn,
    ManyToOne,
} from "typeorm";
import { Funcionario } from "./Funcionario";
import { Beneficio } from "./Beneficio";
import { Desconto } from "./Desconto";

@Entity({ schema: 'pim_folhaup', name: 'folhadepagamento' })
export class FolhaPagamento {

    @PrimaryGeneratedColumn({ type: 'numeric'})
    codigofolha: number;

    @Column({ type: 'numeric', precision: 11, scale: 0, nullable: true })
    cpf: number;

    @Column({ type: 'numeric', precision: 2, scale: 0, nullable: true })
    mes: number;

    @Column({ type: 'numeric', precision: 4, scale: 0, nullable: true })
    ano: number;

    @Column({ type: 'numeric', precision: 2, scale: 0, nullable: true })
    diastrabalho: number;

    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
    salario: number;

    @OneToMany(() => Beneficio, beneficio => beneficio.folhapagamento)
    beneficios: Beneficio[];

    @OneToMany(() => Desconto, desconto => desconto.folhapagamento)
    descontos: Desconto[];

    
    @ManyToOne(() => Funcionario, funcionario => funcionario.folhapagamento)
    @JoinColumn({ name: 'cpf' })
    funcionarios: Funcionario[]; // Correção na definição da propriedade

}
