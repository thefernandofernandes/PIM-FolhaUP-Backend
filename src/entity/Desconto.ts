import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,

} from "typeorm";
import { FolhaPagamento } from "./FolhaPagamento";

@Entity({ schema: 'pim_folhaup', name: 'desconto' })
export class Desconto {

    @PrimaryGeneratedColumn({ type: 'numeric'})
    codigodesconto: number;

    @Column({ type: 'numeric', precision: 3, scale: 0, nullable: true })
    codigofolha: number;

    @Column({ type: 'varchar', length: 50, nullable: false })
    nome: string;

    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
    valor: number;

    @ManyToOne(() => FolhaPagamento)
    @JoinColumn({ name: 'codigofolha' })
    folhapagamento: FolhaPagamento;


   
}