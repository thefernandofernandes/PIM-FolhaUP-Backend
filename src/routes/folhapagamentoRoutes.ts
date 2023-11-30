import { Express, Request, Response } from 'express';
import myDataSource from '../app-data-source';
import { FolhaPagamento } from '../entity/\FolhaPagamento';
import { Funcionario } from '../entity/Funcionario';
import { Beneficio } from '../entity/Beneficio';
import { Desconto } from '../entity/Desconto';

export function folhapagamentoRoutes(app: Express) {
  
  app.get("/folhadepagamento", async function (req: Request, res: Response) {
      const folhadepagamento = await myDataSource.getRepository(FolhaPagamento).find();
      res.json(folhadepagamento);
  });

  app.get("/folhadepagamento/:codigofolha", async function (req: Request, res: Response) {
    const results = await myDataSource.getRepository(FolhaPagamento).findOneBy({
        codigofolha:+req.params.codigofolha,
    });
    return res.send(results);
  });

  app.post("/folhadepagamento", async function (req: Request, res: Response) {
    const folhadepagamento = await myDataSource.getRepository(FolhaPagamento).create(req.body);
    const results = await myDataSource.getRepository(FolhaPagamento).save(folhadepagamento);
    return res.send(results);
  });

  app.put("/folhadepagamento/:codigofolha", async function (req: Request, res: Response) {
    const folhadepagamento = await myDataSource.getRepository(FolhaPagamento).findOneBy({
        codigofolha:+req.params.codigofolha,
    });

    if (folhadepagamento) {  
        myDataSource.getRepository(FolhaPagamento).merge(folhadepagamento, req.body);
        const results = await myDataSource.getRepository(FolhaPagamento).save(folhadepagamento);
        return res.send(results);
    } else {
        // Tratando o caso em que "folhapagamento" é null.
        res.status(404).send({ message: 'FolhaPagamento não encontrada' });
    }
});  

app.delete("/folhadepagamento/:codigofolha", async function (req: Request, res: Response) {
  const results = await myDataSource.getRepository(FolhaPagamento).delete(req.params. codigofolha);
  return res.send(results);
});
  
app.get('/folhas-pagamento-cadastradas/:cpf', async (req, res) => {

  try {
    // Buscar funcionários pelo CNPJ fornecido
    const folha = await myDataSource.getRepository(FolhaPagamento).findBy({
      cpf: +req.params.cpf,
    });

    if (!folha || folha.length === 0) {
      return res.status(404).json({ error: 'Folhas de Pagamento não encontradas.' });
    }

    // Retornar os funcionários encontrados
    return res.status(200).json({ folha });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});

app.get('/calcular-folha/:codigofolha', async (req, res) => {
  try {
    const beneficiosSoma = await myDataSource.getRepository(FolhaPagamento)
      .createQueryBuilder('folha')
      .leftJoin('folha.beneficios', 'beneficio')
      .select('SUM(beneficio.valor)', 'somaBeneficios')
      .where('folha.codigofolha = :codigofolha', { codigofolha: +req.params.codigofolha })
      .getRawOne();

    const descontosSoma = await myDataSource.getRepository(FolhaPagamento)
      .createQueryBuilder('folha')
      .leftJoin('folha.descontos', 'desconto')
      .select('SUM(desconto.valor)', 'somaDescontos')
      .where('folha.codigofolha = :codigofolha', { codigofolha: +req.params.codigofolha })
      .getRawOne();

    const totalBeneficios = beneficiosSoma.somaBeneficios || 0;
    const totalDescontos = descontosSoma.somaDescontos || 0;

    return res.status(200).json({
      totalDescontos,
      totalBeneficios,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao calcular a folha de pagamento.' });
  }
});






}