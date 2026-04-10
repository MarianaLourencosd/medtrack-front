import React, { useState, useEffect } from "react";
import "./Formulario.css";
import { db } from "../../services/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "../../services/firebaseConfig";

import { 
  formatarCPF,
  formatarTelefone,
  formatarAltura,
  validarCampoEmTempoReal,
  mensagemSucessoFormulario,
  mensagemErroFormulario
} from "../../utils/validacoes";

function Formulario() {
  // Estado para dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Estado para mensagem de feedback
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

  // Estado do formulário
  const [formData, setFormData] = useState({
    // Dados Pessoais
    nome: "",
    cpf: "",
    dataNascimento: "",
    sexo: "",
    altura: "",
    peso: "",
    tipoSanguineo: "",
    sus: "",
    // Contato de Emergência
    nomeContato: "",
    telefoneContato: "",
    relacionamento: "",
    // Medicamentos
    medicamento: "",
    dosagem: "",
    frequencia: "",
    // Observações
    observacoes: ""
  });

  // Estado para erros
  const [errors, setErrors] = useState({});
  
  // Estado para controlar seções abertas
  const [openSections, setOpenSections] = useState({
    dadosPessoais: true,
    contatoEmergencia: false,
    medicamentos: false
  });

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
      texto: mensagemSucessoFormulario(),
      tipo: "success"
    });
    
    // Limpar formulário após 3 segundos
    setTimeout(() => {
      setFormData({
        nome: "", cpf: "", dataNascimento: "", sexo: "",
        altura: "", peso: "", tipoSanguineo: "", sus: "",
        nomeContato: "", telefoneContato: "", relacionamento: "",
        medicamento: "", dosagem: "", frequencia: "", observacoes: ""
      });
      setMensagem({ texto: "", tipo: "" });
    }, 3000);
  };

  // Mostrar mensagem de erro
  const mostrarMensagemErro = () => {
    setMensagem({
      texto: mensagemErroFormulario(),
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
    
    if (id === "cpf") {
      formattedValue = formatarCPF(value);
    } else if (id === "telefoneContato") {
      formattedValue = formatarTelefone(value);
    } else if (id === "altura") {
      formattedValue = formatarAltura(value);
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

  // Validar formulário completo
  const validarFormularioCompleto = () => {
    const newErrors = {};
    
    // Dados Pessoais
    if (!formData.nome?.trim()) newErrors.nome = "Nome completo é obrigatório";
    if (!formData.cpf) newErrors.cpf = "CPF é obrigatório";
    if (!formData.dataNascimento) newErrors.dataNascimento = "Data de nascimento é obrigatória";
    if (!formData.sexo) newErrors.sexo = "Sexo é obrigatório";
    if (!formData.altura) newErrors.altura = "Altura é obrigatória";
    if (!formData.peso) newErrors.peso = "Peso é obrigatório";
    if (!formData.tipoSanguineo) newErrors.tipoSanguineo = "Tipo sanguíneo é obrigatório";
    if (!formData.sus) newErrors.sus = "Cartão SUS é obrigatório";
    
    // Contato de Emergência
    if (!formData.nomeContato?.trim()) newErrors.nomeContato = "Nome do contato é obrigatório";
    if (!formData.telefoneContato) newErrors.telefoneContato = "Telefone é obrigatório";
    if (!formData.relacionamento?.trim()) newErrors.relacionamento = "Relacionamento é obrigatório";
    
    // Medicamentos
    if (!formData.medicamento?.trim()) newErrors.medicamento = "Nome do medicamento é obrigatório";
    if (!formData.dosagem?.trim()) newErrors.dosagem = "Dosagem é obrigatória";
    if (!formData.frequencia?.trim()) newErrors.frequencia = "Frequência é obrigatória";
    
    // Observações
    if (!formData.observacoes?.trim()) newErrors.observacoes = "Observações são obrigatórias";
    
    return newErrors;
  };

  // Enviar formulário
  // const handleSubmit = (e) => {
  //   e.preventDefault();
    
  //   const validationErrors = validarFormularioCompleto();
    
  //   if (Object.keys(validationErrors).length === 0) {
  //     // Salvar no localStorage
  //     const existingData = localStorage.getItem("formularios");
  //     const formularios = existingData ? JSON.parse(existingData) : [];
      
  //     const novoRegistro = {
  //       id: Date.now(),
  //       ...formData,
  //       dataEnvio: new Date().toLocaleString()
  //     };
      
  //     formularios.push(novoRegistro);
  //     localStorage.setItem("formularios", JSON.stringify(formularios));
      
  //     mostrarMensagemSucesso();
  //     console.log("Formulário válido, enviando dados...", formData);
  //   } else {
  //     setErrors(validationErrors);
  //     mostrarMensagemErro();
  //     // Rolar para o topo do formulário
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validarFormularioCompleto();

  if (Object.keys(validationErrors).length === 0) {
    try {
      const user = auth.currentUser;

      if (!user) {
        alert("Usuário não está logado!");
        return;
      }

      // 🔥 Salvar no Firestore
      await addDoc(collection(db, "formularios"), {
        userId: user.uid, // vincula ao usuário logado
        ...formData,
        createdAt: new Date()
      });

      console.log("SALVO NO FIREBASE:", formData);

      mostrarMensagemSucesso();

    } catch (error) {
      console.error("ERRO AO SALVAR:", error);
      alert("Erro ao salvar dados");
      mostrarMensagemErro();
    }

  } else {
    setErrors(validationErrors);
    mostrarMensagemErro();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

  // Alternar seções
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="formulario-wrapper">
      <div className="formulario-card">
        <div className="formulario-content">
          
          {/* Botões */}
          <button 
            onClick={handleVoltar} 
            className="formulario-action-btn formulario-back-btn"
            aria-label="Voltar"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          
          <button 
            onClick={toggleDarkMode} 
            className="formulario-action-btn formulario-theme-btn"
            aria-label="Modo escuro"
          >
            <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
          </button>

          {/* Títulos */}
          <h1 className="formulario-title">Preencha o Formulário</h1>
          <p className="formulario-subtitle">Seu espaço para cuidar da saúde.</p>

          {/* Mensagem de feedback */}
          {mensagem.texto && (
            <div className={`formulario-feedback ${mensagem.tipo}`}>
              {mensagem.texto}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} noValidate>
            
            {/* Seção Dados Pessoais */}
            <details className="formulario-section" open={openSections.dadosPessoais}>
              <summary onClick={(e) => {
                e.preventDefault();
                toggleSection("dadosPessoais");
              }}>
                Dados Pessoais
              </summary>
              <div className="formulario-section-content">
                <div className="formulario-grid">
                  
                  <div className="formulario-field formulario-field-full">
                    <label className="formulario-label">
                      Nome Completo <span className="formulario-label-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="nome"
                      className={`formulario-input formulario-input-nome ${errors.nome ? "formulario-input-error" : ""}`}
                      placeholder="Digite seu nome completo"
                      value={formData.nome}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.nome && <div className="formulario-error-msg">{errors.nome}</div>}
                  </div>

                  <div className="formulario-field">
                    <label className="formulario-label">
                      CPF <span className="formulario-label-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="cpf"
                      className={`formulario-input formulario-input-cpf ${errors.cpf ? "formulario-input-error" : ""}`}
                      placeholder="Digite seu CPF"
                      value={formData.cpf}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength="14"
                    />
                    {errors.cpf && <div className="formulario-error-msg">{errors.cpf}</div>}
                  </div>

                  <div className="formulario-field">
                    <label className="formulario-label">
                      Data de Nascimento <span className="formulario-label-required">*</span>
                    </label>
                    <input
                      type="date"
                      id="dataNascimento"
                      className={`formulario-input formulario-input-data ${errors.dataNascimento ? "formulario-input-error" : ""}`}
                      value={formData.dataNascimento}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.dataNascimento && <div className="formulario-error-msg">{errors.dataNascimento}</div>}
                  </div>

                  <div className="formulario-field">
                    <label className="formulario-label">
                      Sexo <span className="formulario-label-required">*</span>
                    </label>
                    <select
                      id="sexo"
                      className={`formulario-select formulario-select-sexo ${errors.sexo ? "formulario-input-error" : ""}`}
                      value={formData.sexo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Selecione</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Outro">Outro</option>
                    </select>
                    {errors.sexo && <div className="formulario-error-msg">{errors.sexo}</div>}
                  </div>

                  <div className="formulario-field">
                    <label className="formulario-label">
                      Altura (m) <span className="formulario-label-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="altura"
                      className={`formulario-input formulario-input-altura ${errors.altura ? "formulario-input-error" : ""}`}
                      placeholder="Ex: 1.75"
                      value={formData.altura}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.altura && <div className="formulario-error-msg">{errors.altura}</div>}
                  </div>

                  <div className="formulario-field">
                    <label className="formulario-label">
                      Peso (kg) <span className="formulario-label-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="peso"
                      className={`formulario-input formulario-input-peso ${errors.peso ? "formulario-input-error" : ""}`}
                      placeholder="Ex: 70"
                      value={formData.peso}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.peso && <div className="formulario-error-msg">{errors.peso}</div>}
                  </div>

                  <div className="formulario-field">
                    <label className="formulario-label">
                      Tipo Sanguíneo <span className="formulario-label-required">*</span>
                    </label>
                    <select
                      id="tipoSanguineo"
                      className={`formulario-select formulario-select-tipoSanguineo ${errors.tipoSanguineo ? "formulario-input-error" : ""}`}
                      value={formData.tipoSanguineo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Selecione</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                    {errors.tipoSanguineo && <div className="formulario-error-msg">{errors.tipoSanguineo}</div>}
                  </div>

                  <div className="formulario-field formulario-field-full">
                    <label className="formulario-label">
                      Cartão SUS <span className="formulario-label-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="sus"
                      className={`formulario-input formulario-input-sus ${errors.sus ? "formulario-input-error" : ""}`}
                      placeholder="Digite o número do cartão SUS"
                      value={formData.sus}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.sus && <div className="formulario-error-msg">{errors.sus}</div>}
                  </div>

                </div>
              </div>
            </details>

            {/* Seção Contato de Emergência */}
            <details className="formulario-section" open={openSections.contatoEmergencia}>
              <summary onClick={(e) => {
                e.preventDefault();
                toggleSection("contatoEmergencia");
              }}>
                Contato de Emergência
              </summary>
              <div className="formulario-section-content">
                <div className="formulario-grid">
                  
                  <div className="formulario-field formulario-field-full">
                    <label className="formulario-label">
                      Nome <span className="formulario-label-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="nomeContato"
                      className={`formulario-input formulario-input-nomeContato ${errors.nomeContato ? "formulario-input-error" : ""}`}
                      placeholder="Digite o nome do contato"
                      value={formData.nomeContato}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.nomeContato && <div className="formulario-error-msg">{errors.nomeContato}</div>}
                  </div>

                  <div className="formulario-field">
                    <label className="formulario-label">
                      Telefone <span className="formulario-label-required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="telefoneContato"
                      className={`formulario-input formulario-input-telefone ${errors.telefoneContato ? "formulario-input-error" : ""}`}
                      placeholder="(00) 00000-0000"
                      value={formData.telefoneContato}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength="15"
                    />
                    {errors.telefoneContato && <div className="formulario-error-msg">{errors.telefoneContato}</div>}
                  </div>

                  <div className="formulario-field">
                    <label className="formulario-label">
                      Relacionamento <span className="formulario-label-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="relacionamento"
                      className={`formulario-input formulario-input-relacionamento ${errors.relacionamento ? "formulario-input-error" : ""}`}
                      placeholder="Ex: Mãe, Pai, Irmão"
                      value={formData.relacionamento}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.relacionamento && <div className="formulario-error-msg">{errors.relacionamento}</div>}
                  </div>

                </div>
              </div>
            </details>

            {/* Seção Medicamentos */}
            <details className="formulario-section" open={openSections.medicamentos}>
              <summary onClick={(e) => {
                e.preventDefault();
                toggleSection("medicamentos");
              }}>
                Medicamentos <span className="formulario-label-required">*</span>
              </summary>
              <div className="formulario-section-content">
                <div className="formulario-grid">
                  
                  <div className="formulario-field">
                    <label className="formulario-label">
                      Nome do Medicamento <span className="formulario-label-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="medicamento"
                      className={`formulario-input formulario-input-medicamento ${errors.medicamento ? "formulario-input-error" : ""}`}
                      placeholder="Ex: Paracetamol"
                      value={formData.medicamento}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.medicamento && <div className="formulario-error-msg">{errors.medicamento}</div>}
                  </div>

                  <div className="formulario-field">
                    <label className="formulario-label">
                      Dosagem <span className="formulario-label-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="dosagem"
                      className={`formulario-input formulario-input-dosagem ${errors.dosagem ? "formulario-input-error" : ""}`}
                      placeholder="Ex: 500mg"
                      value={formData.dosagem}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.dosagem && <div className="formulario-error-msg">{errors.dosagem}</div>}
                  </div>

                  <div className="formulario-field">
                    <label className="formulario-label">
                      Frequência <span className="formulario-label-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="frequencia"
                      className={`formulario-input formulario-input-frequencia ${errors.frequencia ? "formulario-input-error" : ""}`}
                      placeholder="Ex: 2x/dia"
                      value={formData.frequencia}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.frequencia && <div className="formulario-error-msg">{errors.frequencia}</div>}
                  </div>

                </div>
              </div>
            </details>

            {/* Observações */}
            <div className="formulario-field">
              <label className="formulario-label">
                Observações <span className="formulario-label-required">*</span>
              </label>
              <textarea
                id="observacoes"
                className={`formulario-textarea formulario-textarea-obs ${errors.observacoes ? "formulario-input-error" : ""}`}
                rows="4"
                placeholder="Ex: alergias, restrições ou informações importantes"
                value={formData.observacoes}
                onChange={handleChange}
                onBlur={handleBlur}
              ></textarea>
              {errors.observacoes && <div className="formulario-error-msg">{errors.observacoes}</div>}
            </div>

            {/* Botão submit */}
            <button type="submit" className="formulario-submit-btn">
              Cadastrar
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Formulario;