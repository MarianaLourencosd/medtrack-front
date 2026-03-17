import React from "react";
import "./cadastro.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Cadastro() {
  return (
    <main className="d-flex align-items-center justify-content-center min-vh-100">
      <section className="container-login d-flex flex-wrap shadow rounded overflow-hidden">
        <div className="container-imagem position-relative d-flex align-items-center justify-content-center p-3 col-12 col-md-6">
          <img
            src="/fundo-login-cadastro.svg"
            className="position-absolute w-100 h-100 object-fit-contain"
            alt="Fundo"
          />

          <img
            src="/imagem-header-cadastro.svg"
            alt="Imagem da Página de Cadastro"
            className="img-fluid"
          />
        </div>

        <div className="container-form position-relative col-12 col-md-6 p-4">
          <a
            href="/"
            id="dark-mode-toggle"
            className="theme-toggle btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
          >
            <i className="fa-solid fa-moon"></i>
          </a>

          <a
            className="seta btn btn-sm d-flex align-items-center justify-content-center"
            href="/home"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </a>

          <h1 className="text-center title-form mt-5">FAÇA SEU CADASTRO</h1>
          <p className="texto text-center">Seu espaço para cuidar da saúde.</p>

          <form className="login-form">
            <div className="mb-3 input-icon">
              <label htmlFor="nome" className="form-label">
                Nome Completo:
              </label>

              <img src="/user.svg" className="input-img" alt="ícone nome" />

              <input
                type="text"
                id="nome"
                name="nome"
                className="form-control"
                placeholder="Digite o seu nome completo."
                required
              />
            </div>

            <div className="mb-3 input-icon">
              <label htmlFor="cpf" className="form-label">
                CPF:
              </label>

              <img src="/cpf.svg" className="input-img" alt="ícone cpf" />

              <input
                type="text"
                id="cpf"
                name="cpf"
                className="form-control"
                placeholder="Digite o seu CPF."
                required
              />
            </div>

            <div className="mb-3 input-icon">
              <label htmlFor="email" className="form-label">
                E-mail:
              </label>

              <img src="/email.svg" className="input-img" alt="ícone email" />

              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="Digite o seu e-mail."
                required
              />
            </div>

            <div className="mb-3 input-icon">
              <label htmlFor="confirmar-email" className="form-label">
                Repetir E-mail:
              </label>

              <img src="/email.svg" className="input-img" alt="ícone email" />

              <input
                type="email"
                id="confirmar-email"
                name="confirmar-email"
                className="form-control"
                placeholder="Repita o seu e-mail."
                required
              />
            </div>

            <div className="mb-3 input-icon">
              <label htmlFor="senha" className="form-label">
                Senha:
              </label>

              <img src="/senha.svg" className="input-img" alt="ícone senha" />

              <input
                type="password"
                id="senha"
                name="senha"
                className="form-control"
                placeholder="Digite a sua senha."
                required
              />
            </div>

            <div className="mb-3 input-icon">
              <label htmlFor="confirmar-senha" className="form-label">
                Repetir Senha:
              </label>

              <img src="/senha.svg" className="input-img" alt="ícone senha" />

              <input
                type="password"
                id="confirmar-senha"
                name="confirmar-senha"
                className="form-control"
                placeholder="Repita a sua senha."
                required
              />
            </div>

            <div className="esqueceu-senha text-end mb-2">
              <a href="/login">Já tem conta? Entrar</a>
            </div>

            <button type="submit" className="btn w-100">
              Cadastrar
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Cadastro;