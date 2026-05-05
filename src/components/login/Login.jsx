import React, { useState, useEffect } from "react";
import "./Login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../utils/daltonismo.css";
import loginImg from "../../assets/images/imagem-header-login.svg";
import { auth } from "../../services/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { login } from "../../services/auth";

import { 
  validarLogin, 
  validarCampoEmTempoReal,
  mensagemSucessoLogin,
  mensagemErroLogin
} from "../../utils/validacoes";

function Login() {

  const [darkMode, setDarkMode] = useState(false);
  
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  
  const [formData, setFormData] = useState({
    email: "",
    senha: ""
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "enabled") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

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

  const handleVoltar = () => {
    window.location.href = "/";
  };

  const limparErro = (campo) => {
    if (errors[campo]) {
      setErrors(prev => ({ ...prev, [campo]: "" }));
    }
  };

  const mostrarMensagemSucesso = () => {
    setMensagem({
      texto: mensagemSucessoLogin(),
      tipo: "success"
    });

    setFormData({
      email: "",
      senha: ""
    });
    
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  const mostrarMensagemErro = () => {
    setMensagem({
      texto: mensagemErroLogin(),
      tipo: "error"
    });
    
    setTimeout(() => {
      setMensagem({ texto: "", tipo: "" });
    }, 3000);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    limparErro(id);
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    const erro = validarCampoEmTempoReal(id, value, formData);
    
    if (erro) {
      setErrors(prev => ({ ...prev, [id]: erro }));
    } else {
      limparErro(id);
    }
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  const { isValid, errors: validationErrors } = validarLogin(
    formData.email,
    formData.senha
  );

  if (isValid) {
    try {
      const userCredential = await login(
        formData.email,
        formData.senha
      );

      console.log("Logado:", userCredential.user);
      
      setMensagem({
        texto: "✅ Login realizado com sucesso! Redirecionando para o formulário...",
        tipo: "success"
      });
      
      setTimeout(() => {
        window.location.href = "/formulario";
      }, 2000);

    } catch (error) {
      console.error("ERRO:", error);
      
      if (error.code === "auth/user-not-found") {
        setMensagem({
          texto: "❌ Usuário não encontrado! Verifique seu e-mail.",
          tipo: "error"
        });
      } else if (error.code === "auth/wrong-password") {
        setMensagem({
          texto: "❌ Senha incorreta! Tente novamente.",
          tipo: "error"
        });
      } else if (error.code === "auth/invalid-email") {
        setMensagem({
          texto: "❌ E-mail inválido! Digite um e-mail válido.",
          tipo: "error"
        });
      } else {
        setMensagem({
          texto: "❌ Erro no login! Tente novamente.",
          tipo: "error"
        });
      }
    }

  } else {
    setErrors(validationErrors);
    setMensagem({
      texto: "❌ Por favor, corrija os campos destacados.",
      tipo: "error"
    });
  }
};

  return (
    <main className="main d-flex align-items-center justify-content-center min-vh-100">
      <section className="container-login d-flex flex-wrap shadow rounded overflow-hidden position-relative">
        
        <button 
          onClick={handleVoltar} 
          className="login-action-btn login-back-btn"
          aria-label="Voltar"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        
        <button 
          onClick={toggleDarkMode} 
          className="login-action-btn login-theme-btn"
          aria-label="Modo escuro"
        >
          <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
        </button>

        <div className="container-imagem-1 d-flex align-items-center justify-content-center p-3 col-12 col-md-6">
          <img
            src={loginImg}
            alt="Ilustração da página de login Medtrack"
            className="img-fluid rounded"
            title="Página de Login"
          />
        </div>

        <div className="container-form position-relative col-12 col-md-6 p-4">
          
          <h1 className="text-center title-form mt-5">FAÇA SEU LOGIN</h1>
          <p className="texto text-center">Seu espaço para cuidar da saúde.</p>

          {mensagem.texto && (
            <div className={`mensagem-feedback-login ${mensagem.tipo}`}>
              {mensagem.texto}
            </div>
          )}

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

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            
            <div className="mb-2">
              <label htmlFor="email" className="form-label">
                E-mail: <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Digite o seu e-mail."
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                aria-label="Digite o seu e-mail"
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="mb-2">
              <label htmlFor="senha" className="form-label">
                Senha: <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                id="senha"
                name="senha"
                className={`form-control ${errors.senha ? "is-invalid" : ""}`}
                placeholder="Digite a sua senha."
                value={formData.senha}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                aria-label="Digite a sua senha"
              />
              {errors.senha && <div className="invalid-feedback">{errors.senha}</div>}
            </div>

            <div className="esqueceu-senha text-end mb-2">
              <a href="/recuperar-senha" aria-label="Esqueceu a senha?">
                Esqueceu a senha?
              </a>
            </div>

            <button type="submit" className="btn w-100" aria-label="Entrar na conta">
              Entrar na Conta
            </button>

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