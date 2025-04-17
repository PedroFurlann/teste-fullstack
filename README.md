### OBS: Na aplicação é permitida realizar uma reserva em sua propria propriedade e também não é realizado o cálculo para validação de cpf para facilitar os testes. Essas regras não se aplicariam em produção.

## 🚀 Tecnologias Utilizadas



### 🖥 Frontend

- **Vite** + **React** + **TypeScript**
- **TailwindCSS** para estilização
- **React Hook Form** para gerenciamento de formulários
- **Framer Motion** para animações
- **React Router DOM** para navegação
- **Axios** para requisições HTTP

### 🔧 Backend

- **NestJS** + **TypeScript**
- **Prisma ORM** para interação com o banco de dados

### 🏗 Infraestrutura

- **Docker** para conteinerização
- **MySQL** como banco de dados

### 📐 Padrões de Arquitetura

- **DDD (Domain-Driven Design)**
- **Clean Architecture**
- **Clean Code**

## 🛠 Como Executar o Projeto

### 🚀 Executando com Docker (Recomendado)

#### AVISO: 1! Lembre-se de liberar as seguintes portas na sua máquina para a aplicação funcionar.
#### 5173 (FRONTEND)
#### 3000 (BACKEND)
#### 3306 (BANCO DE DADOS)

1. Clone o repositório:

```bash
git clone https://github.com/PedroFurlann/teste-fullstack.git
cd teste-fullstack
```

2. Suba os containers Docker:

! Observação: Essa etapa pode demorar alguns minutos (principalmente no pull das imagens e na inicialização do contêiner do banco de dados), então espere até que todos os contêineres sejam inicializados.

```bash
docker compose up
```

3. Acesse **[http://localhost:5173](http://localhost:5173)** no navegador.

### 🛠 Executando Manualmente (Sem Docker)

## AVISO 2! Para a aplicação funcionar sem o Docker será necessário subir um banco de dados MySQL na sua máquina!!!

### OBS: Existe um .env.example na raíz do projeto e na pasta do backend, será necessário criar um .env para cada .env.example em seus respectivos diretórios.


#### 1️⃣ Backend

1. Acesse a pasta do backend:

```bash
cd backend
```

2. Confira o arquivo **.env.example** para seguir instruções de como popular o **.env** e configurar as variáveis de ambiente.
3. Instale as dependências:

```bash
npm install
```

4. Rode as migrations do banco:


```bash
npx prisma migrate dev
```

5. Inicie o servidor:

```bash
npm run start:dev
```

#### 2️⃣ Frontend

1. Acesse a pasta do frontend:

2. Confira o arquivo **.env.example** para seguir instruções de como popular o **.env** e configurar as variáveis de ambiente.

```bash
cd ../frontend
```

3. Instale as dependências:

```bash
npm install
```

4. Inicie o servidor:

```bash
npm run dev
```

5. Acesse **[http://localhost:5173](http://localhost:5173)** no navegador.

## 📌 Funcionalidades

✅ Aplicação completa para gerenciar locações e reservas  
✅ Animações suaves com Framer Motion  
✅ Implementação de técnicas de segurança na aplicação (ex: autenticação
JWT, proteção contra SQL Injection, CORS configurado corretamente, etc.). 

✅ Aplicação Dockerizada  
✅ Coleção do Postman disponibilizada para teste dos endpoints  
✅ Implementação de testes unitários nos use cases  
✅ Layout amigável e responsivo  
✅ Persistência de dados com Prisma ORM e MySQL  
✅ Backend robusto utilizando NestJS  
✅ Arquitetura modular seguindo os princípios do DDD e Clean Architecture  

---
