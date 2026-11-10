# 🍻 Senzalas Bar

Sistema de gestão para bar desenvolvido para atender às necessidades reais do bar da minha família. O projeto foi criado com o objetivo de aplicar conhecimentos de desenvolvimento Full Stack, modelagem de banco de dados, arquitetura de software e construção de aplicações escaláveis.

---

## 🚀 Visão Geral

O Senzalas Bar é uma aplicação de gerenciamento que permite controlar produtos, clientes , fornecedores, compras, vendas e movimentações de estoque de forma organizada e eficiente.

Além de resolver um problema real de negócio, o projeto serve como laboratório para aprofundamento em tecnologias modernas do ecossistema JavaScript e TypeScript.

---

## ✨ Funcionalidades

### 📦 Gestão de Produtos

- Cadastro de produtos
- Controle de preços de custo e venda
- Controle de estoque mínimo
- Ativação e inativação de produtos
- Organização por categorias

### 🏷️ Gestão de Clientes

- Cadastro de clientes
- Associaçao a saldo devedor ao cliente

### 🚚 Gestão de Fornecedores

- Cadastro de fornecedores
- Informações de contato
- Histórico de compras

### 🛒 Gestão de Compras

- Registro de compras
- Associação de fornecedor
- Registro de múltiplos produtos por compra
- Atualização automática do estoque
- Histórico completo de movimentações

### 💰 Gestão de Vendas

- Registro de vendas
- Controle de itens vendidos
- Aplicação de descontos
- Registro da forma de pagamento

### 📊 Dashboard

- Total de produtos cadastrados
- Produtos com estoque baixo
- Total de vendas do dia
- Total de vendas do mês

### 📈 Controle de Estoque

- Movimentações de entrada
- Movimentações de saída
- Ajustes de estoque
- Histórico completo das alterações

---

## 🧠 Tecnologias Utilizadas

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod
- REST API
- JWT token
- Docker

### Frontend

- Next.js
- React
- TypeScript
- TailwindCSS
- Axios
- TanStack Query
- React Hook Form

### Banco de Dados

- PostgreSQL

---

## 🏗️ Arquitetura

O backend segue uma arquitetura organizada por responsabilidades:

```text
src/
├── controllers/
├── database/
├── errors/
├── middlewares/
├── routes/
├── schemas/
├── services/
└── utils/
```

### Principais conceitos aplicados

- Programação Orientada a Objetos (POO)
- Arquitetura em Camadas
- Validação de Dados
- Tratamento Centralizado de Erros
- Transações com Prisma
- Relacionamentos entre entidades
- Boas práticas REST

---

## 🗄️ Modelagem do Sistema

Principais entidades:

- User
- Customer
- Product
- Category
- Supplier
- Purchase
- PurchaseProduct
- Sale
- SaleItem
- StockMovement

Relacionamentos modelados utilizando Prisma ORM e PostgreSQL.

---
## 🐳 Docker

O projeto está totalmente containerizado utilizando Docker Compose.

Os seguintes serviços são iniciados automaticamente:

- Frontend (Next.js)
- Backend (Node.js + Express)
- PostgreSQL

Basta executar:

```bash
docker compose up --build
```

### Segurança da API

O backend aplica cabeçalhos de segurança com Helmet, limita a API a 300 requisições
por IP a cada 15 minutos e limita tentativas malsucedidas de login a 10 no mesmo
período. Em produção com múltiplas instâncias, configure um armazenamento
compartilhado para o rate limiter.

Configure `CORS_ORIGINS` no ambiente do backend como uma lista separada por
vírgulas de origens confiáveis, sem barra final, por exemplo:

```env
CORS_ORIGINS=https://app.exemplo.com,https://delivery.exemplo.com
```

Sem essa variável, somente as origens locais `localhost:3000` e `localhost:3001`
são permitidas. CORS restringe o acesso de navegadores; não substitui autenticação
nem impede clientes que chamem a API diretamente. Os corpos JSON são limitados a
1 MB, e o upload de imagens aceita um arquivo de até 5 MB com limites adicionais
para campos e partes do formulário.

### Testes do backend

Os testes de integração HTTP ficam em `backend/tests/integration` e usam Vitest
com Supertest. Cobrem login e as rotas de vendas, compras, produtos e
fornecedores, incluindo validações, operações de estoque e respostas para
registros inexistentes. O Prisma é mockado, então não é necessário iniciar
PostgreSQL para executá-los.

```bash
cd backend
npm test
npm run test:watch
```


## 🎯 Objetivos do Projeto

- Aplicar conceitos de desenvolvimento Full Stack
- Consolidar conhecimentos em TypeScript
- Praticar modelagem de banco de dados relacional
- Construir APIs REST profissionais
- Desenvolver interfaces modernas com React e Next.js
- Criar uma solução utilizável em um cenário real

---

## 📈 Próximas Implementações

### 📊 
- Controle de mesas
- Pedidos vinculados às mesas
- cliente vinculados à mesa

### 🪑 Gestão de Mesas
- Controle de mesas
- Pedidos vinculados às mesas
- cliente vinculados à mesa

### 📊 Relatórios Avançados

- Produtos mais vendidos
- Faturamento por período
- Compras por fornecedor
- Evolução do estoque

### 📉 Dashboard Avançado

- Gráficos de vendas
- Indicadores financeiros
- Métricas operacionais

### 📱 Responsividade

- Interface otimizada para tablets
- Interface otimizada para dispositivos móveis

---

## 💡 Aprendizados

Este projeto marca um ponto decisivo na minha trajetória como desenvolvedor, reunindo conceitos de backend, frontend, banco de dados e regras de negócio em uma aplicação voltada para resolver problemas reais.

Durante o desenvolvimento, aprofundei meus conhecimentos em arquitetura de software, APIs REST, ORM, bancos de dados relacionais, validação de dados, integração entre frontend e backend e na construção de sistemas escaláveis e robustos.

Para mim, este projeto tem um significado especial: ele evidencia minha evolução. O que antes era apenas uma ideia distante, quando eu ainda aprendia HTML, hoje se transformou em um sistema completo, onde enfrento desafios muito maiores e mais complexos. É uma prova concreta de como dedicação e aprendizado contínuo podem transformar imaginação em realidade.
---

### 👨‍💻 Desenvolvido por

João Victor Belizário
