# GETREC - Sistema de Gestão de Treinamento e Capacitação

Sistema web para gestão de treinamentos e capacitações voltado para o interior da Bahia.

## Requisitos

- Node.js (v14+)
- MySQL (v8+)

## Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Configure o banco de dados:

```bash
# Crie o banco de dados e as tabelas
mysql -u root -p < database.sql
```

## Execução

Para iniciar o servidor:

```bash
npm start
```

O servidor estará disponível em http://localhost:3000

## Usuários de teste

- **Aluno**: 
  - Email: joao@example.com
  - Senha: senha123

- **RH**: 
  - Email: ana@example.com
  - Senha: senha123

- **Admin**: 
  - Email: admin@getrec.com
  - Senha: admin123