---

# MedTrack

Sistema web desenvolvido com React e Vite para gerenciamento de informações pessoais e de saúde dos usuários, com integração ao Firebase para autenticação e armazenamento de dados. O projeto tem como foco a organização de dados, validação de informações e melhoria da experiência do usuário por meio de uma interface estruturada e funcional.

---

## Sobre o Projeto

O MedTrack foi concebido com o objetivo de oferecer uma solução digital para registro e acompanhamento de informações de saúde de forma centralizada. A aplicação permite que o usuário cadastre seus dados, realize autenticação segura e preencha formulários com informações pessoais e médicas relevantes.

O sistema foi desenvolvido utilizando uma arquitetura baseada em componentes, promovendo reutilização de código, organização e escalabilidade. Além disso, foram aplicadas boas práticas de desenvolvimento, como separação de responsabilidades, validações robustas e navegação estruturada.

---

## Objetivos do Sistema

* Centralizar informações pessoais e de saúde dos usuários
* Garantir a integridade dos dados por meio de validações eficientes
* Oferecer uma interface simples, intuitiva e funcional
* Permitir autenticação segura de usuários
* Facilitar a manutenção e evolução do sistema

---

## Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias:

* **React**: Biblioteca para construção da interface de usuário baseada em componentes
* **Vite**: Ferramenta de build rápida para desenvolvimento moderno
* **Firebase**:

  * Authentication (autenticação de usuários)
  * Banco de dados (armazenamento de informações)
* **JavaScript**: Linguagem principal da aplicação
* **CSS**: Estilização da interface

---

## Funcionalidades

O sistema permite cadastro e login de usuários com validações completas (e-mail, senha e CPF), preenchimento de formulário de saúde, visualização e busca de perfis, além de navegação entre páginas de forma dinâmica utilizando React Router.

---

## Estrutura do Projeto

A aplicação segue uma organização modular, facilitando a manutenção e entendimento:

```bash
MEDTRACK-FRONT/
├── src/
│   ├── assets/         
│   ├── components/     
│   │   ├── buscaPerfil/
│   │   ├── cadastro/
│   │   ├── formulario/
│   │   ├── home/
│   │   ├── login/
│   │   ├── perfil/
│   │   └── sobre/
│   ├── services/   
│   ├── utils/       
│   ├── App.jsx         
│   └── main.jsx        
├── public/       
├── index.html  
└── package.json 
```
---

## Como Executar o Projeto

Para rodar o projeto localmente, siga os passos:

```bash
# Clonar o repositório
git clone <url-do-repositorio>

# Entrar na pasta do projeto
cd MEDTRACK-FRONT

# Instalar dependências
npm install

# Executar o projeto
npm run dev
```

Após a execução, o sistema estará disponível no navegador no endereço informado pelo terminal.

---

## Status do Projeto

Projeto em desenvolvimento para fins acadêmicos.

---

