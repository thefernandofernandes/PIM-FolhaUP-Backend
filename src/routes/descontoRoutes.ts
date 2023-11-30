import { Express, Request, Response } from 'express';
import myDataSource from '../app-data-source';
import { Desconto } from '../entity/Desconto';
import { FolhaPagamento } from '../entity/FolhaPagamento';

export function descontoRoutes(app: Express) {
  
    app.get("/descontos", async function (req: Request, res: Response) {
        const descontos = await myDataSource.getRepository(Desconto).find();
        res.json(descontos);
    });
    app.get("/descontos/:codigofolha", async function (req: Request, res: Response) {
      const results = await myDataSource.getRepository(Desconto).findOneBy({
          codigofolha:+req.params.codigofolha,
      });
      return res.send(results);
    });

  app.post("/descontos", async function (req: Request, res: Response) {
    const descontos = await myDataSource.getRepository(Desconto).create(req.body);
    const results = await myDataSource.getRepository(Desconto).save(descontos);
    return res.send(results);
  });

  app.put("/descontos/:codigodesconto", async function (req: Request, res: Response) {
    const descontos = await myDataSource.getRepository(Desconto).findOneBy({
        codigodesconto:+req.params.codigodesconto,
    });

    if (descontos) {  
        myDataSource.getRepository(Desconto).merge(descontos, req.body);
        const results = await myDataSource.getRepository(Desconto).save(descontos);
        return res.send(results);
    } else {
        // Tratando o caso em que "desconto" é null.
        res.status(404).send({ message: 'Desconto não encontrada' });
    }
});  

app.delete("/descontos/:codigodesconto", async function (req: Request, res: Response) {
  const results = await myDataSource.getRepository(Desconto).delete(req.params.codigodesconto);
  return res.send(results);
});

app.get('/descontos-cadastrados/:codigofolha', async (req, res) => {

  try {
    // Buscar funcionários pelo CNPJ fornecido
    const descontos = await myDataSource.getRepository(Desconto).findBy({
      codigofolha: +req.params.codigofolha,
    });

    if (!descontos || descontos.length === 0) {
      return res.status(404).json({ error: 'Beneficios não encontrados.' });
    }

    // Retornar os funcionários encontrados
    return res.status(200).json({ descontos });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});


/*app.post("/calculo", async function (req: Request, res: Response) {
  const desconto = await myDataSource.getRepository(Desconto).findOne({ where: { codigofolha: 1 }, relations: ['beneficio', 'desconto'] });

if (desconto) {
  const salarioBase = desconto;
  const descontado = desconto.valor;

  const valorLiquido = salario - descontado ;

  console.log('Valor líquido da folha de pagamento:', valorLiquido);
} else {
  console.log('Folha de pagamento não encontrada');
}
});*/



}