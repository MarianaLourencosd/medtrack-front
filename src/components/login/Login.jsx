import React, { useState, useEffect } from "react";
import "./Login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../utils/daltonismo.css";
import loginImg from "../../assets/images/imagem-header-login.svg";

function Login() {
  // Estado para dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Verificar preferência salva no localStorage ao carregar
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "enabled") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  // Função para alternar modo escuro
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

  // Função para voltar para home
  const handleVoltar = () => {
    window.location.href = "/";
  };

  // Função de envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login realizado com sucesso!");
  };

  return (
    <main className="main d-flex align-items-center justify-content-center min-vh-100">
      <section className="container-login d-flex flex-wrap shadow rounded overflow-hidden">
        
        {/* Botão Voltar - ESTILO DO FORMULARIO */}
        <button 
          onClick={handleVoltar} 
          className="login-action-btn login-back-btn"
          aria-label="Voltar"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        
        {/* Botão Modo Escuro/Claro - ESTILO DO FORMULARIO */}
        <button 
          onClick={toggleDarkMode} 
          className="login-action-btn login-theme-btn"
          aria-label="Modo escuro"
        >
          <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
        </button>

        {/* Coluna Imagem */}
        <div className="container-imagem-1 d-flex align-items-center justify-content-center p-3 col-12 col-md-6">
          <img
            src={loginImg}
            alt="Ilustração da página de login Medtrack"
            className="img-fluid rounded"
            title="Página de Login"
          />
        </div>

        {/* Coluna Formulário */}
        <div className="container-form position-relative col-12 col-md-6 p-4">
          
          {/* Título */}
          <h1 className="text-center title-form mt-5">FAÇA SEU LOGIN</h1>
          <p className="texto text-center">Seu espaço para cuidar da saúde.</p>

          {/* Ícones de login via redes sociais */}
          <div className="icons" role="group" aria-label="Login via redes sociais">
            <a href="#" aria-label="Login com Google">
              <i className="fa-brands fa-google" aria-hidden="true"></i>
            </a>
            <a href="#" aria-label="Login com Facebook">
              <i className="fa-brands fa-facebook-f" aria-hidden="true"></i>
            </a>
            <a href="#" aria-label="Login com Instagram">
              <i className="fa-brands fa-instagram" aria-hidden="true"></i>
            </a>
          </div>

          {/* Formulário */}
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            
            <div className="mb-2">
              <label htmlFor="email" className="form-label">
                E-mail: <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="Digite o seu e-mail."
                required
                aria-label="Digite o seu e-mail"
              />
            </div>

            <div className="mb-2">
              <label htmlFor="senha" className="form-label">
                Senha: <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                id="senha"
                name="senha"
                className="form-control"
                placeholder="Digite a sua senha."
                required
                aria-label="Digite a sua senha"
              />
            </div>

            {/* Link esqueceu a senha */}
            <div className="esqueceu-senha text-end mb-2">
              <a href="/recuperar-senha" aria-label="Esqueceu a senha?">
                Esqueceu a senha?
              </a>
            </div>

            {/* Botão enviar */}
            <button type="submit" className="btn w-100" aria-label="Entrar na conta">
              Entrar na Conta
            </button>

            {/* Link cadastro */}
            <div className="esqueceu-senha text-end mt-2">
              <a href="/cadastro" aria-label="Não tem conta? Cadastre-se">
                Não tem conta? Cadastre-se
              </a>
            </div>

          </form>
        </div>
      </section>
    </main>
  );
}

export default Login;