# 💸PagCore

## Descrição
O **PagCore** é uma aplicação robusta e segura para transferências financeiras entre usuários, desenvolvida com **Go** no backend e **React** no frontend. A aplicação permite que usuários autenticados realizem transações peer-to-peer, consultem históricos de transações, gerem QR Codes para facilitar pagamentos e sejam implantados com facilidade utilizando **Docker**. Com autenticação baseada em **JWT** (JSON Web Tokens), o sistema garante segurança e escalabilidade, ideal para soluções financeiras modernas.

O projeto foi desenhado para oferecer uma experiência fluida e intuitiva, com uma interface amigável no frontend e uma API eficiente no backend, integrando tecnologias modernas para atender a cenários reais de transferência financeira.

## Funcionalidades

- **Autenticação Segura**:
  - Login e registro de usuários com autenticação via JWT.
  - Tokens com expiração para maior segurança.
  - Proteção contra acesso não autorizado a endpoints sensíveis.

- **Transferências P2P**:
  - Transferências instantâneas entre contas de usuários autenticados.
  - Validação de saldo antes de processar transações.
  - Suporte a valores fracionários (e.g., centavos) com precisão.

- **Histórico de Transações**:
  - Registro completo de transações (enviadas e recebidas) com data, valor, remetente e destinatário.
  - Filtros para consulta por período ou usuário.
  - Interface no frontend para visualização clara e organizada.

- **Geração de QR Code**:
  - Criação de QR Codes para facilitar pagamentos (e.g., escaneie para transferir um valor específico).
  - QR Codes contêm informações seguras do destinatário e valor.
  - Integração com bibliotecas modernas para geração dinâmica.

- **Implantação com Docker**:
  - Containers para backend (Go), frontend (React) e banco de dados.
  - Configuração via `docker-compose` para inicialização com um único comando.
  - Suporte a ambientes de desenvolvimento e produção.

- **Backend Robusto**:
  - API RESTful desenvolvida em Go, com rotas otimizadas e respostas JSON.
  - Gerenciamento de erros detalhado e logging para monitoramento.
  - Integração com banco de dados relacional (e.g., PostgreSQL) para persistência.

- **Frontend Intuitivo**:
  - Interface React com componentes reutilizáveis e design responsivo.
  - Fluxo de usuário otimizado para cadastro, login, transferências e consulta de histórico.
  - Feedback visual em tempo real para ações do usuário.

## Requisitos

- **Backend**:
  - Go 1.18 ou superior.
  - Banco de dados relacional (recomendado: PostgreSQL).
  - Docker e Docker Compose (para implantação containerizada).

- **Frontend**:
  - Node.js 16 ou superior.
  - npm ou yarn para gerenciamento de dependências.

- **Outros**:
  - Conexão à internet para implantação e testes.
  - Git para clonar o repositório.

## Conceitos Implementados

- **Segurança**:
  - Autenticação JWT com verificação de tokens em cada requisição.
  - Hashing de senhas (e.g., bcrypt) para armazenamento seguro.
  - Validação de entrada para prevenir injeções ou erros.

- **Escalabilidade**:
  - API stateless (Go) para fácil escalonamento horizontal.
  - Banco de dados relacional com transações ACID para consistência.
  - Containers Docker para implantação em ambientes variados.

- **Usabilidade**:
  - Interface React com feedback em tempo real (e.g., notificações de erro/sucesso).
  - QR Codes para pagamentos rápidos e intuitivos.
  - Histórico de transações com filtros para melhor experiência.

## Testes Realizados

- **Autenticação**: Registro, login e validação de tokens testados com sucesso.
- **Transferências**: Validações de saldo, transferências fracionárias e concorrentes processadas corretamente.
- **Histórico**: Consultas por usuário e período retornam resultados precisos.
- **QR Code**: Geração e leitura de QR Codes validadas em dispositivos móveis.
- **Docker**: Implantação via `docker-compose` testada em ambientes Linux e Windows.
- **Erros**: Casos de erro (e.g., saldo insuficiente, token inválido) retornam mensagens claras.
