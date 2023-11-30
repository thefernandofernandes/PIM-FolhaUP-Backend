import "reflect-metadata";
import myDataSource from "./app-data-source";
import express from "express";
//import {Funcionario } from "./entity/Funcionario";
import { funcionarioRoutes } from './routes/funcionarioRoutes';
import { empresaRoutes } from './routes/empresaRoutes';
import { departamentoRoutes } from './routes/departamentoRoutes';
import { beneficioRoutes } from './routes/beneficioRoutes';
import { descontoRoutes } from "./routes/descontoRoutes";
import { folhapagamentoRoutes } from "./routes/folhapagamentoRoutes";

import cors from 'cors';
import { Request, Response } from 'express';




// estabelecendo conexão com o banco de dados
myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

const app = express();
app.use(express.json());
app.use(cors());

funcionarioRoutes(app);  
empresaRoutes(app);
departamentoRoutes(app);
beneficioRoutes(app);
descontoRoutes(app);
folhapagamentoRoutes(app);

  // start express server
app.listen(3333, () => {
    console.log('Servidor Backend em execução...');
});