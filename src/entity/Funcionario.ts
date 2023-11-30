import {
  Entity,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryColumn,
} from "typeorm";
import { Empresa } from "./Empresa";
import { FolhaPagamento } from "./FolhaPagamento";
import { Departamento } from "./Departamento";

  @Entity('funcionario', { schema: 'pim_folhaup' })
  export class Funcionario extends BaseEntity {

  @PrimaryColumn({ type: 'numeric' })
  cpf: number;

  @Column({ type: 'numeric', precision: 3, scale: 0, nullable: true })
  matricula: number;

  @Column({ type: 'numeric', precision: 14, scale: 0, nullable: true })
  cnpj: number;

  @Column({ type: 'numeric', precision: 3, scale: 0, nullable: true })
  codigodepartamento: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nome: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  endereco: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  salario: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  cargo: string;

  @Column({ type: 'date', nullable: true })
  dataadmissao: Date;

  @Column({ type: 'date', nullable: true })
  datanascimento: Date;

  @Column({ type: 'varchar', length: 50, nullable: false })
  telefone: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  email: string;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'cnpj' })
  empresa: Empresa;
  
  @ManyToOne(() => Departamento)
  @JoinColumn({ name: 'codigodepartamento' })
  departamento: Departamento;
  
  @OneToMany(() => FolhaPagamento, folhapagamento => folhapagamento.funcionarios)
  folhapagamento: FolhaPagamento[]; // Correção na definição da propriedade
  


}
