import { Express, Request, Response } from 'express';
import myDataSource from '../app-data-source';
import { Departamento } from '../entity/Departamento';
import { Funcionario } from '../entity/Funcionario';
import { FolhaPagamento } from '../entity/FolhaPagamento';
import { Beneficio } from '../entity/Beneficio';
import { Desconto } from '../entity/Desconto';

export function departamentoRoutes(app: Express) {
  
  app.get("/departamento", async function (req: Request, res: Response) {
      const departamento = await myDataSource.getRepository(Departamento).find();
      res.json(departamento);
  });

  app.get("/departamento/:codigodepartamento", async function (req: Request, res: Response) {
    const results = await myDataSource.getRepository(Departamento).findOneBy({
        codigodepartamento: +req.params.codigodepartamento,
    });
    return res.send(results);
  });

  app.post("/departamento", async function (req: Request, res: Response) {
    const departamento = await myDataSource.getRepository(Departamento).create(req.body);
    const results = await myDataSource.getRepository(Departamento).save(departamento);
    return res.send(results);
  });

  app.put("/departamento/:codigodepartamento", async function (req: Request, res: Response) {
    const departamento = await myDataSource.getRepository(Departamento).findOneBy({
        codigodepartamento: +req.params.codigodepartamento,
    });

    if (departamento) {  
        myDataSource.getRepository(Departamento).merge(departamento, req.body);
        const results = await myDataSource.getRepository(Departamento).save(departamento);
        return res.send(results);
    } else {
        // Tratando o caso em que "departamento" é null.
        res.status(404).send({ message: 'Departamento não encontrada' });
    }
});  

  
app.get('/departamentos-cadastrados/:cnpj', async (req, res) => {

  try {
    // Buscar funcionários pelo CNPJ fornecido
    const departamentos = await myDataSource.getRepository(Departamento).findBy({
      cnpj: +req.params.cnpj,
    });

    if (!departamentos || departamentos.length === 0) {
      return res.status(404).json({ error: 'Departamentos não encontrados.' });
    }

    // Retornar os funcionários encontrados
    return res.status(200).json({ departamentos });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});

app.delete("/departamento/:codigodepartamento", async function (req, res) {
  try {
    const codigodepartamento = +req.params.codigodepartamento;

    // Encontre todos os funcionários do departamento
    const funcionariosDepartamento = await myDataSource.getRepository(Funcionario).find({ where: { codigodepartamento: codigodepartamento } });

    for (const funcionario of funcionariosDepartamento) {
      const funcionarioCPF = funcionario.cpf;

      // Encontre as folhas de pagamento associadas ao CPF do funcionário
      const folhasPagamento = await myDataSource.getRepository(FolhaPagamento).find({ where: { cpf: funcionarioCPF } });

      for (const folha of folhasPagamento) {
        // Encontre os descontos associados a esta folha de pagamento
        const descontos = await myDataSource.getRepository(Desconto).find({ where: { codigofolha: folha.codigofolha } });

        for (const desconto of descontos) {
          await myDataSource.getRepository(Desconto).delete(desconto.codigodesconto); // Supondo que "id" seja a chave primária
        }

        // Exclua os benefícios associados a esta folha de pagamento
        const beneficios = await myDataSource.getRepository(Beneficio).find({ where: { codigofolha: folha.codigofolha } });

        for (const beneficio of beneficios) {
          await myDataSource.getRepository(Beneficio).delete(beneficio.codigobeneficio); // Supondo que "id" seja a chave primária
        }
        
        // Agora que os descontos e benefícios foram excluídos, podemos excluir a folha de pagamento
        await myDataSource.getRepository(FolhaPagamento).delete(folha.codigofolha);
      }

      // Finalmente, exclua o próprio funcionário
      await myDataSource.getRepository(Funcionario).delete(funcionario.cpf);
    }

    // Agora que os funcionários foram excluídos, podemos excluir o departamento
    const departamentoExcluido = await myDataSource.getRepository(Departamento).delete({ codigodepartamento: codigodepartamento });

    return res.send({ departamentoExcluido });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao excluir departamento e funcionários associados' });
  }
});

}