import { DataSource } from "typeorm"
import { Funcionario } from "./entity/Funcionario";
import { Beneficio } from "./entity/Beneficio";
import { Departamento } from "./entity/Departamento";
import { Desconto } from "./entity/Desconto";
import { FolhaPagamento } from "./entity/FolhaPagamento";
import { Empresa } from "./entity/Empresa";

const myDataSource = new DataSource({
    type: "postgres",
    "host": "berry.db.elephantsql.com",
    port: 5432,
    username: "fazovfha",
    "password": "4I2IfDewtbUkw9y7P7W2lol-D3B9vxW6",
    database: "fazovfha",    
    entities: [Beneficio, Funcionario, Departamento, Desconto, FolhaPagamento, Empresa],    
    logging: true,
    synchronize: false,
})

export default myDataSource;