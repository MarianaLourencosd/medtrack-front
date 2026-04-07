import React, { useState, useEffect } from "react";
import "./Cadastro.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../utils/daltonismo.css";
import cadastroImg from "../../assets/images/imagem-header-cadastro.svg";

function Cadastro() {
  // Estado para dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Verificar preferência de modo escuro
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "enabled") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  // Alternar modo escuro
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled");
    }
  };

  // Voltar para home
  const handleVoltar = () => {
    window.location.href = "/";
  };

  // Função de envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Cadastro enviado com sucesso!");
  };

  return (
    <main className="main d-flex align-items-center justify-content-center min-vh-100">
      <section className="container-login d-flex flex-wrap shadow rounded overflow-hidden">
        
        {/* Botão Voltar - ESTILO DO FORMULARIO (quadrado, sem borda redonda) */}
        <button 
          onClick={handleVoltar} 
          className="cadastro-action-btn cadastro-back-btn"
          aria-label="Voltar"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        
        {/* Botão Modo Escuro/Claro - ESTILO DO FORMULARIO (quadrado, sem borda redonda) */}
        <button 
          onClick={toggleDarkMode} 
          className="cadastro-action-btn cadastro-theme-btn"
          aria-label="Modo escuro"
        >
          <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
        </button>

        {/* Coluna Imagem */}
        <div className="container-imagem-1 d-flex align-items-center justify-content-center p-3 col-12 col-md-6">
          <img
            src={cadastroImg}
            alt="Ilustração de cadastro MedTrack"
            className="img-fluid rounded"
          />
        </div>

        {/* Coluna Formulário */}
        <div className="container-form position-relative col-12 col-md-6 p-4">
          {/* Título */}
          <h1 className="title-form mt-4">FAÇA SEU CADASTRO</h1>
          <p className="texto text-center mb-4">Seu espaço para cuidar da saúde.</p>

          {/* Formulário */}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nome" className="form-label">
                Nome Completo: <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                className="form-control"
                placeholder="Digite seu nome completo"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="cpf" className="form-label">
                CPF: <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                className="form-control"
                placeholder="Digite seu CPF"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                E-mail: <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="Digite seu e-mail"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmar-email" className="form-label">
                Repetir E-mail: <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                id="confirmar-email"
                name="confirmar-email"
                className="form-control"
                placeholder="Repita seu e-mail"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="senha" className="form-label">
                Senha: <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                id="senha"
                name="senha"
                className="form-control"
                placeholder="Digite sua senha"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmar-senha" className="form-label">
                Repetir Senha: <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                id="confirmar-senha"
                name="confirmar-senha"
                className="form-control"
                placeholder="Repita sua senha"
                required
              />
            </div>

            {/* Link Login */}
            <div className="text-end mb-3">
              <a href="/login">Já tem conta? Entrar</a>
            </div>

            {/* Botão Enviar */}
            <button type="submit" className="btn w-100 btn-primary">
              Cadastrar
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Cadastro;