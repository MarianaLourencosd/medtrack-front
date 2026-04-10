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
  // Estado para dark mode
  const [darkMode, setDarkMode] = useState(false);
  
  // Estado para mensagens
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  
  // Estado para os campos do formulário
  const [formData, setFormData] = useState({
    email: "",
    senha: ""
  });
  
  // Estado para erros
  const [errors, setErrors] = useState({});

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

  // Limpar erro de um campo específico
  const limparErro = (campo) => {
    if (errors[campo]) {
      setErrors(prev => ({ ...prev, [campo]: "" }));
    }
  };

  // Mostrar mensagem de sucesso
  const mostrarMensagemSucesso = () => {
    setMensagem({
      texto: mensagemSucessoLogin(),
      tipo: "success"
    });
    
    // Limpar formulário
    setFormData({
      email: "",
      senha: ""
    });
    
    // Redirecionar após 2 segundos
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  // Mostrar mensagem de erro
  const mostrarMensagemErro = () => {
    setMensagem({
      texto: mensagemErroLogin(),
      tipo: "error"
    });
    
    // Limpar mensagem após 3 segundos
    setTimeout(() => {
      setMensagem({ texto: "", tipo: "" });
    }, 3000);
  };

  // Lidar com mudanças nos inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    limparErro(id);
  };

  // Validação em tempo real ao perder o foco
  const handleBlur = (e) => {
    const { id, value } = e.target;
    const erro = validarCampoEmTempoReal(id, value, formData);
    
    if (erro) {
      setErrors(prev => ({ ...prev, [id]: erro }));
    } else {
      limparErro(id);
    }
  };

  // Validar e enviar formulário
  // const handleSubmit = (e) => {
  //   e.preventDefault();
    
  //   // Usar a função de validação importada do arquivo validacoes.js
  //   const { isValid, errors: validationErrors } = validarLogin(formData.email, formData.senha);
    
  //   if (isValid) {
  //     mostrarMensagemSucesso();
  //     console.log("Login válido, enviando dados...", formData);
  //     // Aqui você pode adicionar a chamada para a API
  //   } else {
  //     setErrors(validationErrors);
  //     mostrarMensagemErro();
  //     // Rolar para o topo do formulário
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //   }
  // };

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const { isValid, errors: validationErrors } = validarLogin(
//     formData.email,
//     formData.senha
//   );

//   if (isValid) {
//     try {
//       // 🔐 Login com Firebase
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         formData.email,
//         formData.senha
//       );

//       console.log("Usuário logado:", userCredential.user);

//       mostrarMensagemSucesso();

//     } catch (error) {
//       console.error("Erro no login:", error);

//       // Mensagens mais amigáveis 👇
//       if (error.code === "auth/user-not-found") {
//         setErrors({ email: "Usuário não encontrado" });
//       } else if (error.code === "auth/wrong-password") {
//         setErrors({ senha: "Senha incorreta" });
//       } else if (error.code === "auth/invalid-email") {
//         setErrors({ email: "E-mail inválido" });
//       } else {
//         mostrarMensagemErro();
//       }

//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }

//   } else {
//     setErrors(validationErrors);
//     mostrarMensagemErro();
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }
// };

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

      mostrarMensagemSucesso();

    } catch (error) {
      console.error("ERRO:", error);
      alert(error.message);
    }

  } else {
    setErrors(validationErrors);
    mostrarMensagemErro();
  }
};

  return (
    <main className="main d-flex align-items-center justify-content-center min-vh-100">
      <section className="container-login d-flex flex-wrap shadow rounded overflow-hidden position-relative">
        
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

          {/* Mensagem de feedback */}
          {mensagem.texto && (
            <div className={`mensagem-feedback-login ${mensagem.tipo}`}>
              {mensagem.texto}
            </div>
          )}

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