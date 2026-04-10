import React, { useState, useEffect } from "react";
import "./Cadastro.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../utils/daltonismo.css";
import cadastroImg from "../../assets/images/imagem-header-cadastro.svg";
import { auth } from "../../services/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../../services/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { register } from "../../services/auth";

import { 
  validarCadastro, 
  formatarCPF, 
  validarCampoEmTempoReal,
  mensagemSucessoCadastro,
  mensagemErroCadastro
} from "../../utils/validacoes";

function Cadastro() {
  // Estado para dark mode
  const [darkMode, setDarkMode] = useState(false);
  
  // Estado para mensagens
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  
  // Estado para os campos do formulário
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    confirmarEmail: "",
    senha: "",
    confirmarSenha: ""
  });
  
  // Estado para erros
  const [errors, setErrors] = useState({});

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

  // Limpar erro de um campo específico
  const limparErro = (campo) => {
    if (errors[campo]) {
      setErrors(prev => ({ ...prev, [campo]: "" }));
    }
  };

  // Mostrar mensagem de sucesso
  const mostrarMensagemSucesso = () => {
    setMensagem({
      texto: mensagemSucessoCadastro(),
      tipo: "success"
    });
    
    // Limpar formulário
    setFormData({
      nome: "",
      cpf: "",
      email: "",
      confirmarEmail: "",
      senha: "",
      confirmarSenha: ""
    });
    
    // Limpar mensagem após 3 segundos
    setTimeout(() => {
      setMensagem({ texto: "", tipo: "" });
    }, 3000);
  };

  // Mostrar mensagem de erro
  const mostrarMensagemErro = () => {
    setMensagem({
      texto: mensagemErroCadastro(),
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
    let formattedValue = value;
    
    // Formatar CPF usando a função importada
    if (id === "cpf") {
      formattedValue = formatarCPF(value);
    }
    
    setFormData(prev => ({ ...prev, [id]: formattedValue }));
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

  // Validação em tempo real para confirmação de email
  const handleConfirmarEmailChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, confirmarEmail: value }));
    
    if (formData.email !== value) {
      setErrors(prev => ({ ...prev, confirmarEmail: "Os e-mails não conferem" }));
    } else {
      limparErro("confirmarEmail");
    }
  };

  // Validação em tempo real para confirmação de senha
  const handleConfirmarSenhaChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, confirmarSenha: value }));
    
    if (formData.senha !== value) {
      setErrors(prev => ({ ...prev, confirmarSenha: "As senhas não conferem" }));
    } else {
      limparErro("confirmarSenha");
    }
  };

  // Validar e enviar formulário
  // const handleSubmit = (e) => {
  //   e.preventDefault();
    
  //   // Usar a função de validação importada do arquivo validacoes.js
  //   const { isValid, errors: validationErrors } = validarCadastro(formData);
    
  //   if (isValid) {
  //     mostrarMensagemSucesso();
  //     console.log("Cadastro válido, enviando dados...", formData);
  //     // Aqui você pode adicionar a chamada para a API
  //   } else {
  //     setErrors(validationErrors);
  //     mostrarMensagemErro();
  //     // Rolar para o topo do formulário
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //   }
  // };

//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   const { isValid, errors: validationErrors } = validarCadastro(formData);

//   if (isValid) {
//     try {
//       // 🔐 Cria usuário no Auth
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         formData.email,
//         formData.senha
//       );

//       const user = userCredential.user;

//       // 💾 Salva dados extras no Firestore
//       await setDoc(doc(db, "usuarios", user.uid), {
//         nome: formData.nome,
//         cpf: formData.cpf,
//         email: formData.email,
//         createdAt: new Date()
//       });

//       mostrarMensagemSucesso();

//     } catch (error) {
//       console.error("Erro no cadastro:", error);
//       mostrarMensagemErro();
//     }

//   } else {
//     setErrors(validationErrors);
//     mostrarMensagemErro();
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }
// };

const handleSubmit = async (e) => {
  e.preventDefault();

  const { isValid, errors: validationErrors } = validarCadastro(formData);

  if (isValid) {
    try {
      const userCredential = await register(
        formData.email,
        formData.senha
      );

      console.log("Usuário criado:", userCredential.user);

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
        
        {/* Botão Voltar */}
        <button 
          onClick={handleVoltar} 
          className="cadastro-action-btn cadastro-back-btn"
          aria-label="Voltar"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        
        {/* Botão Modo Escuro/Claro */}
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

          {/* Mensagem de feedback */}
          {mensagem.texto && (
            <div className={`mensagem-feedback ${mensagem.tipo}`}>
              {mensagem.texto}
            </div>
          )}

          {/* Formulário */}
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            
            {/* Campo Nome */}
            <div className="mb-3">
              <label htmlFor="nome" className="form-label">
                Nome Completo: <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                className={`form-control ${errors.nome ? "is-invalid" : ""}`}
                placeholder="Digite seu nome completo"
                value={formData.nome}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
            </div>

            {/* Campo CPF */}
            <div className="mb-3">
              <label htmlFor="cpf" className="form-label">
                CPF: <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                className={`form-control ${errors.cpf ? "is-invalid" : ""}`}
                placeholder="Digite seu CPF"
                value={formData.cpf}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength="14"
                required
              />
              {errors.cpf && <div className="invalid-feedback">{errors.cpf}</div>}
            </div>

            {/* Campo E-mail */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                E-mail: <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Digite seu e-mail"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            {/* Campo Confirmar E-mail */}
            <div className="mb-3">
              <label htmlFor="confirmarEmail" className="form-label">
                Repetir E-mail: <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                id="confirmarEmail"
                name="confirmarEmail"
                className={`form-control ${errors.confirmarEmail ? "is-invalid" : ""}`}
                placeholder="Repita seu e-mail"
                value={formData.confirmarEmail}
                onChange={handleConfirmarEmailChange}
                onBlur={handleBlur}
                required
              />
              {errors.confirmarEmail && <div className="invalid-feedback">{errors.confirmarEmail}</div>}
            </div>

            {/* Campo Senha */}
            <div className="mb-3">
              <label htmlFor="senha" className="form-label">
                Senha: <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                id="senha"
                name="senha"
                className={`form-control ${errors.senha ? "is-invalid" : ""}`}
                placeholder="Digite sua senha"
                value={formData.senha}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.senha && <div className="invalid-feedback">{errors.senha}</div>}
              <small className="text-muted">Mínimo 6 caracteres, com letras e números</small>
            </div>

            {/* Campo Confirmar Senha */}
            <div className="mb-3">
              <label htmlFor="confirmarSenha" className="form-label">
                Repetir Senha: <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                id="confirmarSenha"
                name="confirmarSenha"
                className={`form-control ${errors.confirmarSenha ? "is-invalid" : ""}`}
                placeholder="Repita sua senha"
                value={formData.confirmarSenha}
                onChange={handleConfirmarSenhaChange}
                onBlur={handleBlur}
                required
              />
              {errors.confirmarSenha && <div className="invalid-feedback">{errors.confirmarSenha}</div>}
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