import { Express, Request, Response } from 'express';
import myDataSource from '../app-data-source';
import { Funcionario } from '../entity/Funcionario';
import { FolhaPagamento } from '../entity/FolhaPagamento';
import { Beneficio } from '../entity/Beneficio';
import { Desconto } from '../entity/Desconto';

export function funcionarioRoutes(app: Express) {
  
  app.get("/funcionarios", async function (req: Request, res: Response) {
      const funcionarios = await myDataSource.getRepository(Funcionario).find();
      res.json(funcionarios);
  });

  app.get("/funcionarios/:cpf", async function (req: Request, res: Response) {
    const results = await myDataSource.getRepository(Funcionario).findOneBy({
      cpf: +req.params.cpf,
    });
    return res.send(results);
  });

  app.post("/funcionarios", async function (req: Request, res: Response) {
    const funcionario = await myDataSource.getRepository(Funcionario).create(req.body);
    const results = await myDataSource.getRepository(Funcionario).save(funcionario);
    return res.send(results);
  });

  app.put("/funcionarios/:cpf", async function (req: Request, res: Response) {
    const funcionario = await myDataSource.getRepository(Funcionario).findOneBy({
        cpf: +req.params.cpf,
    });

    if (funcionario) {  
        myDataSource.getRepository(Funcionario).merge(funcionario, req.body);
        const results = await myDataSource.getRepository(Funcionario).save(funcionario);
        return res.send(results);
    } else {
        // Tratando o caso em que "funcionario" é null.
        res.status(404).send({ message: 'Funcionário não encontrado' });
    }
});  
 
  
app.delete("/funcionarios/:cpf", async function (req, res) {
  try {
    const funcionarioCPF = +req.params.cpf;

    // Encontre as folhas de pagamento associadas ao CPF do funcionário
    const folhasPagamento = await myDataSource.getRepository(FolhaPagamento).find({ where: { cpf: funcionarioCPF } });

    // Exclua os benefícios e descontos associados a cada folha de pagamento
    for (const folha of folhasPagamento) {
      // Encontre os descontos associados a esta folha de pagamento
      const descontos = await myDataSource.getRepository(Desconto).find({ where: { codigofolha: folha.codigofolha } });

      // Exclua os descontos associados
      for (const desconto of descontos) {
        await myDataSource.getRepository(Desconto).delete(desconto.codigodesconto); // Supondo que "id" seja a chave primária
      }

      const beneficios = await myDataSource.getRepository(Beneficio).find({ where: { codigofolha: folha.codigofolha } });

      // Exclua os descontos associados
      for (const beneficio of beneficios) {
        await myDataSource.getRepository(Desconto).delete(beneficio.codigobeneficio); // Supondo que "id" seja a chave primária
      } 
    }

    // Agora que os descontos foram excluídos, podemos excluir as folhas de pagamento
    for (const folha of folhasPagamento) {
      await myDataSource.getRepository(FolhaPagamento).delete(folha.codigofolha);
    }

    // Finalmente, exclua o próprio funcionário
    const funcionarioExcluido = await myDataSource.getRepository(Funcionario).delete({ cpf: funcionarioCPF });

    return res.send({ funcionarioExcluido });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao excluir funcionário e folhas de pagamento' });
  }
});

app.get('/funcionarios-cadastrados/:cnpj', async (req, res) => {

  try {
    // Buscar funcionários pelo CNPJ fornecido
    const funcionarios = await myDataSource.getRepository(Funcionario).findBy({
      cnpj: +req.params.cnpj,
    });

    if (!funcionarios || funcionarios.length === 0) {
      return res.status(404).json({ error: 'Funcionários não encontrados.' });
    }

    // Retornar os funcionários encontrados
    return res.status(200).json({ funcionarios });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});
 
app.get("/funcionario-folha/:cpf", async function (req, res) {
  try {
    const funcionario = await myDataSource.getRepository(Funcionario).findOne({
      where: { cpf: +req.params.cpf },
      select: ['nome', 'cargo', 'endereco'], // Incluir informações adicionais, como a data de nascimento
    });

    if (!funcionario) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    return res.status(200).json({nome: funcionario.nome, cargo: funcionario.cargo, endereco: funcionario.endereco});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});

}
