const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();

// Configuração do servidor
app.use(express.static(path.join(__dirname)));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexão com o banco de dados
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "senha", // sua senha MySQL
  database: "getrec",
});

// Testando conexão
db.connect((err) => {
  if (err) console.error("Erro ao conectar ao MySQL:", err.message);
  else console.log("Conectado ao MySQL!");
});

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API para obter dados do usuário
app.get("/api/usuario/:id", (req, res) => {
  const userId = req.params.id;

  const sql = "SELECT * FROM usuarios WHERE id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar usuário:", err.message);
      return res.status(500).json({ error: "Erro ao buscar dados do usuário." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const user = results[0];
    res.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      tipo: user.tipo
    });
  });
});

// API para obter todos os usuários
app.get("/api/usuarios", (req, res) => {
  const sql = "SELECT id, nome, email, tipo, empresa FROM usuarios";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar usuários:", err.message);
      return res.status(500).json({ error: "Erro ao buscar usuários." });
    }

    res.json(results);
  });
});

// API para buscar alunos
app.get("/api/alunos", (req, res) => {
  const sql = "SELECT id, nome, email, empresa FROM usuarios WHERE tipo = 'aluno'";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar alunos:", err.message);
      return res.status(500).json({ error: "Erro ao buscar alunos." });
    }

    res.json(results);
  });
});

// API para buscar alunos por nome
app.get("/api/alunos/busca", (req, res) => {
  const { termo } = req.query;

  if (!termo) {
    return res.status(400).json({ error: "Termo de busca não fornecido." });
  }

  const sql = "SELECT id, nome, email, empresa FROM usuarios WHERE tipo = 'aluno' AND nome LIKE ?";

  db.query(sql, [`%${termo}%`], (err, results) => {
    if (err) {
      console.error("Erro ao buscar alunos:", err.message);
      return res.status(500).json({ error: "Erro ao buscar alunos." });
    }

    res.json(results);
  });
});

// API para obter todos os cursos
app.get("/api/cursos", (req, res) => {
  const sql = "SELECT * FROM cursos";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar cursos:", err.message);
      return res.status(500).json({ error: "Erro ao buscar cursos." });
    }

    res.json(results);
  });
});

// Rota para login
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Rota para cadastro
app.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "cadastro.html"));
});

// API para autenticação de usuário
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("Erro ao autenticar:", err.message);
      return res.status(500).json({ error: "Erro ao autenticar usuário." });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Email ou senha incorretos." });
    }

    const user = results[0];
    // Redirecionar com base no tipo de usuário (usando o campo perfil do banco de dados)
    let redirectUrl;

    switch (user.tipo) {
      case "aluno":
        redirectUrl = "/dashboard-aluno.html";
        break;
      case "rh":
        redirectUrl = "/dashboard-rh.html";
        break;
      case "admin":
        redirectUrl = "/dashboard-admin.html";
        break;
      case "instrutor":
        redirectUrl = "/dashboard-admin.html"; // Instrutores usam o mesmo dashboard dos admins
        break;
      default:
        redirectUrl = "/";
    }

    res.json({
      success: true,
      message: "Login realizado com sucesso!",
      redirect: redirectUrl,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo, // Usando o campo perfil do banco de dados
      },
    });
  });
});

// API para cadastro de usuário
app.post("/api/usuarios", (req, res) => {
  const { nome, sobrenome, email, senha, tipo_usuario, empresa } = req.body;

  // Verificar se o email já existe
  db.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Erro ao verificar email:", err.message);
        return res.status(500).json({ error: "Erro ao verificar email." });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: "Este email já está em uso." });
      }

      // Inserir novo usuário

      const nome_completo = `${nome} ${sobrenome}`;
      const sql =
        "INSERT INTO usuarios (nome, email, senha, tipo, empresa) VALUES (?, ?, ?, ?, ?)";

      db.query(
        sql,
        [nome_completo, email, senha, tipo_usuario, empresa || null],
        (err, result) => {
          if (err) {
            console.error("Erro ao cadastrar usuário:", err.message);
            return res
              .status(500)
              .json({ error: "Erro ao cadastrar usuário." });
          }

          res.status(201).json({
            success: true,
            message: "Usuário cadastrado com sucesso!",
            userId: result.insertId,
          });
        }
      );
    }
  );
});

// API para listar cursos
app.get("/api/cursos", (req, res) => {
  const sql = "SELECT * FROM cursos";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar cursos:", err.message);
      return res.status(500).json({ error: "Erro ao buscar cursos." });
    }

    res.json(results);
  });
});

// Rota para cadastrar um novo curso
app.post('/api/cursos', (req, res) => {
  // 1. Desestruturar o req.body com os campos corretos do formulário e do INSERT
  const { titulo, descricao, instrutor, categoria, duracao, preco, nivel, imagem_url } = req.body;

  // 2. Validar todos os campos (campos numéricos 0 são válidos, então checamos por undefined)
  if (!titulo || !descricao || !instrutor || !categoria || duracao === undefined || preco === undefined || !nivel || !imagem_url) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  // 3. Atualizar a query SQL com todas as colunas
  const sql = 'INSERT INTO cursos (titulo, descricao, instrutor, categoria, duracao, preco, nivel, imagem_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

  // 4. Criar o array de valores na ordem correta
  const values = [titulo, descricao, instrutor, categoria, duracao, preco, nivel, imagem_url];

  // 5. Executar a query
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar curso:', err.message);
      return res.status(500).json({ error: 'Erro ao cadastrar curso' });
    }

    res.status(201).json({
      id: result.insertId,
      message: 'Curso cadastrado com sucesso'
    });
  });
});

// API para buscar curso por ID
app.get("/api/cursos/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM cursos WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar curso:", err.message);
      return res.status(500).json({ error: "Erro ao buscar curso." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Curso não encontrado." });
    }

    res.json(results[0]);
  });
});

// API para cadastrar novo curso
app.post("/api/cursos", (req, res) => {
  const { titulo, descricao, instrutor, categoria, duracao, preco, nivel } =
    req.body;

  const sql =
    "INSERT INTO cursos (titulo, descricao, instrutor, categoria, duracao, preco, nivel) VALUES (?, ?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [titulo, descricao, instrutor, categoria, duracao, preco, nivel],
    (err, result) => {
      if (err) {
        console.error("Erro ao cadastrar curso:", err.message);
        return res.status(500).json({ error: "Erro ao cadastrar curso." });
      }

      res.status(201).json({
        success: true,
        message: "Curso cadastrado com sucesso!",
        cursoId: result.insertId,
      });
    }
  );
});

// API para atualizar usuário
app.put("/api/usuarios/:id", (req, res) => {
  const { id } = req.params;
  const { nome, email, tipo, empresa } = req.body;

  const sql = "UPDATE usuarios SET nome = ?, email = ?, tipo = ?, empresa = ? WHERE id = ?";

  db.query(sql, [nome, email, tipo, empresa, id], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar usuário:", err.message);
      return res.status(500).json({ error: "Erro ao atualizar usuário." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json({
      success: true,
      message: "Usuário atualizado com sucesso!"
    });
  });
});

// API para deletar usuário
app.delete("/api/usuarios/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM usuarios WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Erro ao deletar usuário:", err.message);
      return res.status(500).json({ error: "Erro ao deletar usuário." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json({
      success: true,
      message: "Usuário deletado com sucesso!"
    });
  });
});

// API para atualizar curso
app.put("/api/cursos/:id", (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, instrutor, categoria, duracao, preco, nivel } = req.body;

  const sql = "UPDATE cursos SET titulo = ?, descricao = ?, instrutor = ?, categoria = ?, duracao = ?, preco = ?, nivel = ? WHERE id = ?";

  db.query(sql, [titulo, descricao, instrutor, categoria, duracao, preco, nivel, id], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar curso:", err.message);
      return res.status(500).json({ error: "Erro ao atualizar curso." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Curso não encontrado." });
    }

    res.json({
      success: true,
      message: "Curso atualizado com sucesso!"
    });
  });
});

// API para deletar curso
app.delete("/api/cursos/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM cursos WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Erro ao deletar curso:", err.message);
      return res.status(500).json({ error: "Erro ao deletar curso." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Curso não encontrado." });
    }

    res.json({
      success: true,
      message: "Curso deletado com sucesso!"
    });
  });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/`);
});
