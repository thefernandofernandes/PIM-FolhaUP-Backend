import { Express, Request, Response } from 'express';
import myDataSource from '../app-data-source';
import { Beneficio } from '../entity/\Beneficio';
import { FolhaPagamento } from '../entity/FolhaPagamento';

export function beneficioRoutes(app: Express) {
  
  app.get("/beneficio", async function (req: Request, res: Response) {
      const beneficio = await myDataSource.getRepository(Beneficio).find();
      res.json(beneficio);
  });


  app.post("/beneficio", async function (req: Request, res: Response) {
    const beneficio = await myDataSource.getRepository(Beneficio).create(req.body);
    const results = await myDataSource.getRepository(Beneficio).save(beneficio);
    return res.send(results);
  });

  app.put("/beneficio/:codigobeneficio", async function (req: Request, res: Response) {
    const beneficio = await myDataSource.getRepository(Beneficio).findOneBy({
        codigobeneficio: +req.params. codigobeneficio,
    });

    if (beneficio) {  
        myDataSource.getRepository(Beneficio).merge(beneficio, req.body);
        const results = await myDataSource.getRepository(Beneficio).save(beneficio);
        return res.send(results);
    } else {
        // Tratando o caso em que "departamento" é null.
        res.status(404).send({ message: 'Beneficio não encontrada' });
    }
});  

app.delete("/beneficio/:codigobeneficio", async function (req: Request, res: Response) {
  const results = await myDataSource.getRepository(Beneficio).delete(req.params. codigobeneficio);
  return res.send(results);
});

app.get('/beneficios-cadastrados/:codigofolha', async (req, res) => {

  try {
    // Buscar funcionários pelo CNPJ fornecido
    const beneficios = await myDataSource.getRepository(Beneficio).findBy({
      codigofolha: +req.params.codigofolha,
    });

    if (!beneficios || beneficios.length === 0) {
      return res.status(404).json({ error: 'Beneficios não encontrados.' });
    }

    // Retornar os funcionários encontrados
    return res.status(200).json({ beneficios });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});
  
}