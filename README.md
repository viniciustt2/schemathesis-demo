# Guia Rápido

### Ações Comuns e Comandos

- **Instalar dependências e preparar o ambiente:**
  ```bash
  yarn install
  yarn migrate:local
  yarn seed:local
  ```
  Instala todas as dependências, aplica a primeira migração e popula o banco de dados localmente.

- **Executar o projeto localmente:**
  ```bash
  yarn local
  ```
  Inicia o projeto usando o arquivo de ambiente `.env.local`.

- **Executar todos os testes:**
  ```bash
  yarn test:run
  ```
  Executa todos os testes automatizados.

- **Executar testes de ponta a ponta (E2E):**
  ```bash
  yarn e2e:run
  ```
  Executa testes completos simulando o uso real do sistema.

- **Aplicar migrações e popular o banco de dados local:**
  ```bash
  yarn migrate:local
  yarn seed:local
  ```
  Aplica alterações no banco de dados e insere dados iniciais.

- **Resetar o banco de dados local:**
  ```bash
  yarn migrate:local:reset
  yarn seed:local
  ```
  Remove e recria o banco de dados localmente.

- **Verificar qualidade do código:**
  ```bash
  yarn typecheck
  yarn lint
  yarn style
  ```
  Realiza checagem de tipos, formatação e linting do código.

# FAQ

**Q: Como rodar o projeto localmente?**
- Use `yarn local` para iniciar o projeto usando as variáveis de ambiente locais.

**Q: Como executar testes?**
- Para todos os testes: `yarn test:run`
- Para testes de fumaça (Smoke Tests): `yarn test:smoke`
  - Testes de fumaça verificam se o sistema básico está funcional após mudanças, focando em falhas críticas.
- Para testes unitários: `yarn test:unit`
  - Testes unitários validam partes isoladas do código.
- Para testes de ponta a ponta: `yarn e2e:run`

**Q: Como aplicar migrações no banco de dados?**
- Localmente: `yarn migrate:local`
- Ambiente de teste: `yarn migrate:test`
- Produção: `yarn migrate`

**Q: Como resetar o banco de dados local?**
- Execute `yarn migrate:local:reset` e depois `yarn seed:local`.

**Q: Como verificar problemas de segurança e conformidade?**
- Vazamentos de dados: `yarn leaks`
- Conformidade de licenças: `yarn compliance`

# Explicação dos Comandos

### Gerenciamento do Projeto
- **local:** Executa o projeto localmente com `.env.local`.
- **test:** Executa o projeto no modo de teste com `.env.test`.
- **deploy:** Realiza o deploy em produção usando `.env`.

### Testes
- **test:smoke:** Executa testes de fumaça com `vitest`.
- **test:unit:** Executa testes unitários com `vitest`.
- **test:e2e:** Executa testes de ponta a ponta com `vitest`.
- **test:run:** Executa todos os testes automatizados.
- **test:ui:** Abre a interface gráfica do `vitest`.
- **test:watch:** Executa testes em modo de observação.
- **test:coverage:** Executa testes e gera relatório de cobertura de código.

### Testes de Ponta a Ponta (E2E)
- **e2e:wait:** Aguarda recursos antes de executar os testes.
- **e2e:bru:** Executa testes e2e com `bru`.
- **e2e:run:** Executa testes e2e em paralelo usando `concurrently`.

### Gerenciamento de Banco de Dados
- **migrate:local:** Aplica migrações locais.
- **migrate:test:** Reseta e aplica migrações no banco de testes.
- **migrate:** Aplica migrações em produção.
- **migrate:local:reset:** Reseta o banco de dados local.
- **seed:local:** Popula o banco de dados local com dados iniciais.
- **seed:test:** Popula o banco de testes com dados iniciais.

### Qualidade de Código
- **typecheck:** Verifica os tipos com TypeScript.
- **style:** Formata o código com `biome`.
- **lint:** Verifica o código com `biome`.

### Segurança e Conformidade
- **leaks:** Verifica vazamentos de segurança com `dotenvx`.
- **compliance:** Verifica conformidade de licenças.

### Gerenciamento de Commits
- **commit:** Inicia o processo de commit com `commitizen`.
- **commit:dry:** Executa uma verificação de commit.

### Testes de Carga
- **load:run:** Executa testes de carga com `artillery`.

### Hooks de Instalação
- **preinstall:** Restringe o uso de gerenciadores de pacotes para Yarn.
- **postinstall:** Executa a verificação de conformidade.
- **prepare:** Prepara os hooks do `husky` para o Git.

## Ferramentas

Abaixo é explicado algumas das ferramentas usadas nos comandos:

* **Artillery**: Ferramenta de testes de carga (stress testing) que simula tráfego de usuários para avaliar o desempenho de sistemas e identificar gargalos. O comando load:run executa testes de carga no sistema.
* **Commitizen**: Ferramenta que ajuda a manter convenções de mensagens de commit consistentes. Facilita a criação de mensagens de commit que seguem padrões como o Conventional Commits, o que facilita o versionamento e a automação de releases.
* **Dotenvx**: Variante do dotenv que carrega variáveis de ambiente a partir de arquivos .env. Ele é usado para garantir que o projeto utilize configurações adequadas para diferentes ambientes (local, teste, produção).
* **Biome**: Ferramenta para formatação e linting de código. Ela pode ser configurada para aplicar regras de estilo e verificar a qualidade do código de acordo com as normas definidas no projeto.
* **Husky**: Ferramenta que permite configurar hooks do Git, como pré-commit e pré-push, para automatizar processos como linting, testes ou verificação de qualidade antes de permitir que o código seja commitado ou enviado para o repositório.
* **Concurrently**: Utilizado para rodar múltiplos comandos simultaneamente no terminal. No caso de testes de ponta a ponta, ele permite executar testes em paralelo, otimizando o tempo de execução.
* **Vitest**: Framework de testes para JavaScript e TypeScript que é rápido e de fácil integração, usado para testar unidades, integração e ponta a ponta (E2E) dentro do fluxo de trabalho do projeto.
* **Waiton**: Utilizado para esperar que um recurso esteja disponível antes de executar um comando subsequente. No caso de testes E2E, ele pode ser usado para garantir que todos os serviços ou recursos necessários estejam prontos antes de rodar os testes.