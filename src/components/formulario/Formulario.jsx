import React, { useState, useEffect } from "react";
import "./Formulario.css";

function Formulario() {
  // Estado para dark mode
  const [darkMode, setDarkMode] = useState(false);

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
  
  // Estado para mensagem de sucesso
  const [successMessage, setSuccessMessage] = useState("");
  
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

  // Formatar CPF
  const formatCPF = (value) => {
    const cpf = value.replace(/\D/g, "");
    if (cpf.length <= 3) return cpf;
    if (cpf.length <= 6) return cpf.replace(/(\d{3})(\d+)/, "$1.$2");
    if (cpf.length <= 9) return cpf.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, "$1.$2.$3-$4");
  };

  // Formatar telefone
  const formatTelefone = (value) => {
    const telefone = value.replace(/\D/g, "");
    if (telefone.length <= 2) return telefone;
    if (telefone.length <= 6) return telefone.replace(/(\d{2})(\d+)/, "($1) $2");
    if (telefone.length <= 10) return telefone.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
    return telefone.replace(/(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
  };

  // Formatar altura
  const formatAltura = (value) => {
    let altura = value.replace(/[^\d]/g, "");
    if (altura.length === 0) return "";
    if (altura.length === 1) return altura;
    if (altura.length === 2) return `${altura.charAt(0)}.${altura.charAt(1)}`;
    return `${altura.substring(0, altura.length - 2)}.${altura.substring(altura.length - 2)}`;
  };

  // Lidar com mudanças nos inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    let formattedValue = value;
    
    if (id === "cpf") {
      formattedValue = formatCPF(value);
    } else if (id === "telefoneContato") {
      formattedValue = formatTelefone(value);
    } else if (id === "altura") {
      formattedValue = formatAltura(value);
    }
    
    setFormData(prev => ({ ...prev, [id]: formattedValue }));
    
    // Limpar erro do campo
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: "" }));
    }
  };

  // Validar CPF
  const validateCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]/g, "");
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    return digit === parseInt(cpf.charAt(10));
  };

  // Validar formulário
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nome) newErrors.nome = "Nome completo é obrigatório";
    if (!formData.cpf) newErrors.cpf = "CPF é obrigatório";
    else if (!validateCPF(formData.cpf)) newErrors.cpf = "CPF inválido";
    
    if (!formData.dataNascimento) newErrors.dataNascimento = "Data de nascimento é obrigatória";
    if (!formData.sexo) newErrors.sexo = "Sexo é obrigatório";
    if (!formData.altura) newErrors.altura = "Altura é obrigatória";
    if (!formData.peso) newErrors.peso = "Peso é obrigatório";
    if (!formData.tipoSanguineo) newErrors.tipoSanguineo = "Tipo sanguíneo é obrigatório";
    if (!formData.sus) newErrors.sus = "Cartão SUS é obrigatório";
    
    if (!formData.nomeContato) newErrors.nomeContato = "Nome do contato é obrigatório";
    if (!formData.telefoneContato) newErrors.telefoneContato = "Telefone é obrigatório";
    if (!formData.relacionamento) newErrors.relacionamento = "Relacionamento é obrigatório";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("Por favor, preencha todos os campos obrigatórios corretamente.");
      return;
    }
    
    // Salvar no localStorage
    const existingData = localStorage.getItem("formularios");
    const formularios = existingData ? JSON.parse(existingData) : [];
    
    const novoRegistro = {
      id: Date.now(),
      ...formData,
      dataEnvio: new Date().toLocaleString()
    };
    
    formularios.push(novoRegistro);
    localStorage.setItem("formularios", JSON.stringify(formularios));
    
    setSuccessMessage("Formulário enviado com sucesso!");
    
    // Limpar formulário após 2 segundos
    setTimeout(() => {
      setFormData({
        nome: "", cpf: "", dataNascimento: "", sexo: "",
        altura: "", peso: "", tipoSanguineo: "", sus: "",
        nomeContato: "", telefoneContato: "", relacionamento: "",
        medicamento: "", dosagem: "", frequencia: "", observacoes: ""
      });
      setSuccessMessage("");
    }, 2000);
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

          {/* Mensagem de sucesso */}
          {successMessage && (
            <div className="formulario-success-msg">
              {successMessage}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            
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
                Medicamentos
              </summary>
              <div className="formulario-section-content">
                <div className="formulario-grid">
                  
                  <div className="formulario-field">
                    <label className="formulario-label">Nome do Medicamento</label>
                    <input
                      type="text"
                      id="medicamento"
                      className="formulario-input formulario-input-medicamento"
                      placeholder="Ex: Paracetamol"
                      value={formData.medicamento}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="formulario-field">
                    <label className="formulario-label">Dosagem</label>
                    <input
                      type="text"
                      id="dosagem"
                      className="formulario-input formulario-input-dosagem"
                      placeholder="Ex: 500mg"
                      value={formData.dosagem}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="formulario-field">
                    <label className="formulario-label">Frequência</label>
                    <input
                      type="text"
                      id="frequencia"
                      className="formulario-input formulario-input-frequencia"
                      placeholder="Ex: 2x/dia"
                      value={formData.frequencia}
                      onChange={handleChange}
                    />
                  </div>

                </div>
              </div>
            </details>

            {/* Observações */}
            <div className="formulario-field">
              <label className="formulario-label">Observações</label>
              <textarea
                id="observacoes"
                className="formulario-textarea formulario-textarea-obs"
                rows="4"
                placeholder="Ex: alergias, restrições ou informações importantes"
                value={formData.observacoes}
                onChange={handleChange}
              ></textarea>
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