import { Express, Request, Response } from 'express';
import myDataSource from '../app-data-source';
import { Empresa } from '../entity/Empresa';

export function empresaRoutes(app: Express) {
  
  app.get("/empresas", async function (req: Request, res: Response) {
      const empresas = await myDataSource.getRepository(Empresa).find();
      res.json(empresas);
  });

  app.get("/empresas/:cnpj", async function (req: Request, res: Response) {
    const results = await myDataSource.getRepository(Empresa).findOneBy({
      cnpj: +req.params.cnpj,
    });
    return res.send(results);
  });

  app.post("/empresas", async function (req: Request, res: Response) {
    const empresa = await myDataSource.getRepository(Empresa).create(req.body);
    const results = await myDataSource.getRepository(Empresa).save(empresa);
    return res.send(results);
  });

  app.put("/empresas/:cnpj", async function (req: Request, res: Response) {
    const empresa = await myDataSource.getRepository(Empresa).findOneBy({
        cnpj: +req.params.cnpj,
    });

    if (empresa) {  
        myDataSource.getRepository(Empresa).merge(empresa, req.body);
        const results = await myDataSource.getRepository(Empresa).save(empresa);
        return res.send(results);
    } else {
        // Tratando o caso em que "empresa" é null.
        res.status(404).send({ message: 'Empresa não encontrada' });
    }
});  

app.delete("/empresas/:cnpj", async function (req: Request, res: Response) {
  const results = await myDataSource.getRepository(Empresa).delete(req.params.cnpj);
  return res.send(results);
});
  

app.get("/quantidadeempresas", async (req, res) => {
  try {
    const empresaRepository = myDataSource.getRepository(Empresa);
    const quantidade = await empresaRepository.count();
    return res.json(quantidade);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao obter a quantidade de empresas" });
  }
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Buscar empresa pelo email e senha fornecidos
    const empresa = await myDataSource.getRepository(Empresa).findOne({
      where: { email, senha },
      select: ['email', 'senha', 'cnpj'], // Seleciona os campos necessários, incluindo o CNPJ
    });

    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    // Comparar a senha fornecida com a senha armazenada no banco de dados
    if (email === empresa.email && senha === empresa.senha) {
      // Senha e email correspondem - Autenticação bem-sucedida
      return res.status(200).json({ email, senha, cnpj: empresa.cnpj }); // Retornando também o CNPJ
    } else {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});

app.get("/dados-empresa/:cnpj", async function (req, res) {
  try {
    const empresa = await myDataSource.getRepository(Empresa).findOneBy({
      cnpj: +req.params.cnpj,
    });

    if (!empresa) {
      return res.status(404).send("Empresa não encontrada");
    }

    // Organize os atributos da empresa conforme desejado
    const { cnpj, razaosocial, endereco, dataabertura, situacaocadastral, telefone, email, senha } = empresa;

    // Crie um objeto com os atributos desejados
    const dadosEmpresa = {
      cnpj: cnpj,
      razaosocial: razaosocial,
      endereco: endereco,
      dataabertura: dataabertura,
      situacaocadastral: situacaocadastral,
      telefone: telefone,
      email: email,
      senha: senha,
    };

    return res.send(dadosEmpresa);
  } catch (error) {
    return res.status(500).send("Erro ao buscar empresa");
  }
});

}
