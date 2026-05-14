import React, { useState, useEffect, useRef } from "react";
import "./Formulario.css";
import { db, auth } from "../../services/firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

import {
  formatarCPF,
  formatarTelefone,
  formatarAltura,
  validarCampoEmTempoReal,
} from "../../utils/validacoes";

const contatoVazio = () => ({ nomeContato: "", telefoneContato: "", relacionamento: "" });
const medicamentoVazio = () => ({ medicamento: "", dosagem: "", frequencia: "" });

function Formulario() {
  const [darkMode, setDarkMode] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    dataNascimento: "",
    sexo: "",
    altura: "",
    peso: "",
    tipoSanguineo: "",
    sus: "",
    observacoes: "",
  });

  const [contatos, setContatos] = useState([contatoVazio()]);
  const [medicamentos, setMedicamentos] = useState([medicamentoVazio()]);
  const [errors, setErrors] = useState({});

  const [openSections, setOpenSections] = useState({
    dadosPessoais: true,
    contatoEmergencia: false,
    medicamentos: false,
  });

  // Autocomplete
  const [historicoMedicamentos, setHistoricoMedicamentos] = useState([]);
  const [sugestoes, setSugestoes] = useState({});
  const [sugestaoAberta, setSugestaoAberta] = useState(null);
  const autocompleteRefs = useRef({});

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "enabled") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  // Carregar histórico de medicamentos já cadastrados pelo usuário
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;
      try {
        const q = query(collection(db, "formularios"), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        const nomes = new Set();
        snap.docs.forEach((doc) => {
          const data = doc.data();
          // Suporte ao formato novo (array) e antigo (string única)
          if (Array.isArray(data.medicamentos)) {
            data.medicamentos.forEach((m) => m.medicamento && nomes.add(m.medicamento.trim()));
          } else if (data.medicamento) {
            nomes.add(data.medicamento.trim());
          }
        });
        setHistoricoMedicamentos([...nomes].sort());
      } catch (err) {
        console.error("Erro ao carregar histórico de medicamentos:", err);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickouDentro = Object.values(autocompleteRefs.current).some(
        (ref) => ref && ref.contains(e.target)
      );
      if (!clickouDentro) setSugestaoAberta(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle("dark-mode", newDarkMode);
    localStorage.setItem("darkMode", newDarkMode ? "enabled" : "disabled");
  };

  const handleVoltar = () => { window.location.href = "/"; };

  // ── Dados pessoais ──
  const handleChange = (e) => {
    const { id, value } = e.target;
    let v = value;
    if (id === "cpf") v = formatarCPF(value);
    else if (id === "altura") v = formatarAltura(value);
    setFormData((prev) => ({ ...prev, [id]: v }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    const erro = validarCampoEmTempoReal(id, value, formData);
    if (erro) setErrors((prev) => ({ ...prev, [id]: erro }));
    else setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  // ── Contatos ──
  const handleContatoChange = (index, field, value) => {
    let v = value;
    if (field === "telefoneContato") v = formatarTelefone(value);
    setContatos((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: v };
      return updated;
    });
    setErrors((prev) => ({ ...prev, [`contato_${index}_${field}`]: "" }));
  };

  const adicionarContato = () => setContatos((prev) => [...prev, contatoVazio()]);
  const removerContato = (index) => {
    if (contatos.length === 1) return;
    setContatos((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Medicamentos ──
  const handleMedicamentoChange = (index, field, value) => {
    setMedicamentos((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setErrors((prev) => ({ ...prev, [`med_${index}_${field}`]: "" }));

    if (field === "medicamento") {
      const termo = value.trim().toLowerCase();
      if (termo.length >= 2) {
        const filtradas = historicoMedicamentos.filter((m) =>
          m.toLowerCase().includes(termo)
        );
        setSugestoes((prev) => ({ ...prev, [index]: filtradas }));
        setSugestaoAberta(filtradas.length > 0 ? index : null);
      } else {
        setSugestoes((prev) => ({ ...prev, [index]: [] }));
        setSugestaoAberta(null);
      }
    }
  };

  const selecionarSugestao = (index, nome) => {
    setMedicamentos((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], medicamento: nome };
      return updated;
    });
    setSugestaoAberta(null);
    setSugestoes((prev) => ({ ...prev, [index]: [] }));
  };

  const adicionarMedicamento = () => setMedicamentos((prev) => [...prev, medicamentoVazio()]);
  const removerMedicamento = (index) => {
    if (medicamentos.length === 1) return;
    setMedicamentos((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Validação ──
  const validarFormularioCompleto = () => {
    const newErrors = {};
    if (!formData.nome?.trim()) newErrors.nome = "Nome completo é obrigatório";
    if (!formData.cpf) newErrors.cpf = "CPF é obrigatório";
    if (!formData.dataNascimento) newErrors.dataNascimento = "Data de nascimento é obrigatória";
    if (!formData.sexo) newErrors.sexo = "Sexo é obrigatório";
    if (!formData.altura) newErrors.altura = "Altura é obrigatória";
    if (!formData.peso) newErrors.peso = "Peso é obrigatório";
    if (!formData.tipoSanguineo) newErrors.tipoSanguineo = "Tipo sanguíneo é obrigatório";
    if (!formData.sus) newErrors.sus = "Cartão SUS é obrigatório";
    if (!formData.observacoes?.trim()) newErrors.observacoes = "Observações são obrigatórias";

    contatos.forEach((c, i) => {
      if (!c.nomeContato?.trim()) newErrors[`contato_${i}_nomeContato`] = "Nome é obrigatório";
      if (!c.telefoneContato) newErrors[`contato_${i}_telefoneContato`] = "Telefone é obrigatório";
      if (!c.relacionamento?.trim()) newErrors[`contato_${i}_relacionamento`] = "Relacionamento é obrigatório";
    });

    medicamentos.forEach((m, i) => {
      if (!m.medicamento?.trim()) newErrors[`med_${i}_medicamento`] = "Nome do medicamento é obrigatório";
      if (!m.dosagem?.trim()) newErrors[`med_${i}_dosagem`] = "Dosagem é obrigatória";
      if (!m.frequencia?.trim()) newErrors[`med_${i}_frequencia`] = "Frequência é obrigatória";
    });

    return newErrors;
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validarFormularioCompleto();

    if (Object.keys(validationErrors).length === 0) {
      try {
        const user = auth.currentUser;
        if (!user) {
          setMensagem({ texto: "Usuário não está logado! Faça login novamente.", tipo: "error" });
          return;
        }

        await addDoc(collection(db, "formularios"), {
          userId: user.uid,
          ...formData,
          contatos,
          medicamentos,
          createdAt: new Date(),
        });

        setMensagem({
          texto: "✅ Formulário salvo com sucesso! Redirecionando para o perfil...",
          tipo: "success",
        });
        setTimeout(() => { window.location.href = "/perfil"; }, 2000);
      } catch (error) {
        console.error("ERRO AO SALVAR:", error);
        setMensagem({ texto: "❌ Erro ao salvar o formulário! Tente novamente.", tipo: "error" });
        setTimeout(() => setMensagem({ texto: "", tipo: "" }), 3000);
      }
    } else {
      setErrors(validationErrors);
      setMensagem({ texto: "❌ Por favor, corrija os campos destacados.", tipo: "error" });
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setMensagem({ texto: "", tipo: "" }), 3000);
    }
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="formulario-wrapper">
      <div className="formulario-card">
        <div className="formulario-content">

          <button onClick={handleVoltar} className="formulario-action-btn formulario-back-btn" aria-label="Voltar">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <button onClick={toggleDarkMode} className="formulario-action-btn formulario-theme-btn" aria-label="Modo escuro">
            <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
          </button>

          <h1 className="formulario-title">Preencha o Formulário</h1>
          <p className="formulario-subtitle">Seu espaço para cuidar da saúde.</p>

          {mensagem.texto && (
            <div className={`formulario-feedback ${mensagem.tipo}`}>{mensagem.texto}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* ── DADOS PESSOAIS ── */}
            <details className="formulario-section" open={openSections.dadosPessoais}>
              <summary onClick={(e) => { e.preventDefault(); toggleSection("dadosPessoais"); }}>
                Dados Pessoais
              </summary>
              <div className="formulario-section-content">
                <div className="formulario-grid">

                  <div className="formulario-field formulario-field-full">
                    <label className="formulario-label">Nome Completo <span className="formulario-label-required">*</span></label>
                    <input type="text" id="nome" className={`formulario-input formulario-input-nome ${errors.nome ? "formulario-input-error" : ""}`}
                      placeholder="Digite seu nome completo" value={formData.nome} onChange={handleChange} onBlur={handleBlur} />
                    {errors.nome && <div className="formulario-error-msg">{errors.nome}</div>}
                  </div>

                  <div className="formulario-field">
                    <label className="formulario-label">CPF <span className="formulario-label-required">*</span></label>
                    <input type="text" id="cpf" className={`formulario-input formulario-input-cpf ${errors.cpf ? "formulario-input-error" : ""}`}
                      placeholder="Digite seu CPF" value={formData.cpf} onChange={handleChange} onBlur={handleBlur} maxLength="14" />
                    {errors.cpf && <div className="formulario-error-msg">{errors.cpf}</div>}
                  </div>

                  <div className="formulario-field">
                    <label className="formulario-label">Data de Nascimento <span className="formulario-label-required">*</span></label>
                    <input type="date" id="dataNascimento" className={`formulario-input formulario-input-data ${errors.dataNascimento ? "formulario-input-error" : ""}`}
                      value={formData.dataNascimento} onChange={handleChange} onBlur={handleBlur} />
                    {errors.dataNascimento && <div className="formulario-error-msg">{errors.dataNascimento}</div>}
                  </div>

                  <div className="formulario-field">
                    <label className="formulario-label">Sexo <span className="formulario-label-required">*</span></label>
                    <select id="sexo" className={`formulario-select formulario-select-sexo ${errors.sexo ? "formulario-input-error" : ""}`}
                      value={formData.sexo} onChange={handleChange} onBlur={handleBlur}>
                      <option value="">Selecione</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Outro">Outro</option>
                    </select>
                    {errors.sexo && <div className="formulario-error-msg">{errors.sexo}</div>}
                  </div>

                  <div className="formulario-field">
                    <label className="formulario-label">Altura (m) <span className="formulario-label-required">*</span></label>
                    <input type="text" id="altura" className={`formulario-input formulario-input-altura ${errors.altura ? "formulario-input-error" : ""}`}
                      placeholder="Ex: 1.75" value={formData.altura} onChange={handleChange} onBlur={handleBlur} />
                    {errors.altura && <div className="formulario-error-msg">{errors.altura}</div>}
                  </div>

                  <div className="formulario-field">
                    <label className="formulario-label">Peso (kg) <span className="formulario-label-required">*</span></label>
                    <input type="text" id="peso" className={`formulario-input formulario-input-peso ${errors.peso ? "formulario-input-error" : ""}`}
                      placeholder="Ex: 70" value={formData.peso} onChange={handleChange} onBlur={handleBlur} />
                    {errors.peso && <div className="formulario-error-msg">{errors.peso}</div>}
                  </div>

                  <div className="formulario-field">
                    <label className="formulario-label">Tipo Sanguíneo <span className="formulario-label-required">*</span></label>
                    <select id="tipoSanguineo" className={`formulario-select formulario-select-tipoSanguineo ${errors.tipoSanguineo ? "formulario-input-error" : ""}`}
                      value={formData.tipoSanguineo} onChange={handleChange} onBlur={handleBlur}>
                      <option value="">Selecione</option>
                      <option value="A+">A+</option><option value="A-">A-</option>
                      <option value="B+">B+</option><option value="B-">B-</option>
                      <option value="AB+">AB+</option><option value="AB-">AB-</option>
                      <option value="O+">O+</option><option value="O-">O-</option>
                    </select>
                    {errors.tipoSanguineo && <div className="formulario-error-msg">{errors.tipoSanguineo}</div>}
                  </div>

                  <div className="formulario-field formulario-field-full">
                    <label className="formulario-label">Cartão SUS <span className="formulario-label-required">*</span></label>
                    <input type="text" id="sus" className={`formulario-input formulario-input-sus ${errors.sus ? "formulario-input-error" : ""}`}
                      placeholder="Digite o número do cartão SUS" value={formData.sus} onChange={handleChange} onBlur={handleBlur} />
                    {errors.sus && <div className="formulario-error-msg">{errors.sus}</div>}
                  </div>

                </div>
              </div>
            </details>

            {/* ── CONTATOS DE EMERGÊNCIA ── */}
            <details className="formulario-section" open={openSections.contatoEmergencia}>
              <summary onClick={(e) => { e.preventDefault(); toggleSection("contatoEmergencia"); }}>
                Contatos de Emergência
              </summary>
              <div className="formulario-section-content">

                {contatos.map((contato, index) => (
                  <div key={index} className="lista-item-card">
                    <div className="lista-item-header">
                      <span className="lista-item-titulo">
                        <i className="fa-solid fa-phone"></i> Contato {index + 1}
                      </span>
                      {contatos.length > 1 && (
                        <button type="button" className="lista-item-remover" onClick={() => removerContato(index)} title="Remover contato">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      )}
                    </div>

                    <div className="formulario-grid">
                      <div className="formulario-field formulario-field-full">
                        <label className="formulario-label">Nome <span className="formulario-label-required">*</span></label>
                        <input type="text" className={`formulario-input formulario-input-nomeContato ${errors[`contato_${index}_nomeContato`] ? "formulario-input-error" : ""}`}
                          placeholder="Digite o nome do contato" value={contato.nomeContato}
                          onChange={(e) => handleContatoChange(index, "nomeContato", e.target.value)} />
                        {errors[`contato_${index}_nomeContato`] && <div className="formulario-error-msg">{errors[`contato_${index}_nomeContato`]}</div>}
                      </div>

                      <div className="formulario-field">
                        <label className="formulario-label">Telefone <span className="formulario-label-required">*</span></label>
                        <input type="tel" className={`formulario-input formulario-input-telefone ${errors[`contato_${index}_telefoneContato`] ? "formulario-input-error" : ""}`}
                          placeholder="(00) 00000-0000" value={contato.telefoneContato} maxLength="15"
                          onChange={(e) => handleContatoChange(index, "telefoneContato", e.target.value)} />
                        {errors[`contato_${index}_telefoneContato`] && <div className="formulario-error-msg">{errors[`contato_${index}_telefoneContato`]}</div>}
                      </div>

                      <div className="formulario-field">
                        <label className="formulario-label">Relacionamento <span className="formulario-label-required">*</span></label>
                        <input type="text" className={`formulario-input formulario-input-relacionamento ${errors[`contato_${index}_relacionamento`] ? "formulario-input-error" : ""}`}
                          placeholder="Ex: Mãe, Pai, Irmão" value={contato.relacionamento}
                          onChange={(e) => handleContatoChange(index, "relacionamento", e.target.value)} />
                        {errors[`contato_${index}_relacionamento`] && <div className="formulario-error-msg">{errors[`contato_${index}_relacionamento`]}</div>}
                      </div>
                    </div>
                  </div>
                ))}

                <button type="button" className="lista-adicionar-btn" onClick={adicionarContato}>
                  <i className="fa-solid fa-plus"></i> Adicionar contato
                </button>
              </div>
            </details>

            {/* ── MEDICAMENTOS ── */}
            <details className="formulario-section" open={openSections.medicamentos}>
              <summary onClick={(e) => { e.preventDefault(); toggleSection("medicamentos"); }}>
                Medicamentos <span className="formulario-label-required">*</span>
              </summary>
              <div className="formulario-section-content">

                {medicamentos.map((med, index) => (
                  <div key={index} className="lista-item-card">
                    <div className="lista-item-header">
                      <span className="lista-item-titulo">
                        <i className="fa-solid fa-pills"></i> Medicamento {index + 1}
                      </span>
                      {medicamentos.length > 1 && (
                        <button type="button" className="lista-item-remover" onClick={() => removerMedicamento(index)} title="Remover medicamento">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      )}
                    </div>

                    <div className="formulario-grid">

                      {/* Campo com autocomplete */}
                      <div
                        className="formulario-field autocomplete-wrapper"
                        ref={(el) => (autocompleteRefs.current[index] = el)}
                      >
                        <label className="formulario-label">
                          Nome do Medicamento <span className="formulario-label-required">*</span>
                          {historicoMedicamentos.length > 0 && (
                            <span className="autocomplete-hint">
                              <i className="fa-solid fa-clock-rotate-left"></i> Histórico disponível
                            </span>
                          )}
                        </label>
                        <input
                          type="text"
                          className={`formulario-input formulario-input-medicamento ${errors[`med_${index}_medicamento`] ? "formulario-input-error" : ""}`}
                          placeholder="Ex: Paracetamol"
                          value={med.medicamento}
                          autoComplete="off"
                          onChange={(e) => handleMedicamentoChange(index, "medicamento", e.target.value)}
                          onFocus={() => {
                            const termo = med.medicamento.trim().toLowerCase();
                            if (termo.length >= 2) {
                              const filtradas = historicoMedicamentos.filter((m) =>
                                m.toLowerCase().includes(termo)
                              );
                              if (filtradas.length > 0) {
                                setSugestoes((prev) => ({ ...prev, [index]: filtradas }));
                                setSugestaoAberta(index);
                              }
                            }
                          }}
                        />
                        {errors[`med_${index}_medicamento`] && (
                          <div className="formulario-error-msg">{errors[`med_${index}_medicamento`]}</div>
                        )}

                        {/* Dropdown de sugestões */}
                        {sugestaoAberta === index && sugestoes[index]?.length > 0 && (
                          <ul className="autocomplete-dropdown">
                            <li className="autocomplete-header">
                              <i className="fa-solid fa-clock-rotate-left"></i> Usados anteriormente
                            </li>
                            {sugestoes[index].map((sugestao, si) => (
                              <li key={si} className="autocomplete-item" onMouseDown={() => selecionarSugestao(index, sugestao)}>
                                {sugestao}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="formulario-field">
                        <label className="formulario-label">Dosagem <span className="formulario-label-required">*</span></label>
                        <input type="text" className={`formulario-input formulario-input-dosagem ${errors[`med_${index}_dosagem`] ? "formulario-input-error" : ""}`}
                          placeholder="Ex: 500mg" value={med.dosagem}
                          onChange={(e) => handleMedicamentoChange(index, "dosagem", e.target.value)} />
                        {errors[`med_${index}_dosagem`] && <div className="formulario-error-msg">{errors[`med_${index}_dosagem`]}</div>}
                      </div>

                      <div className="formulario-field">
                        <label className="formulario-label">Frequência <span className="formulario-label-required">*</span></label>
                        <input type="text" className={`formulario-input formulario-input-frequencia ${errors[`med_${index}_frequencia`] ? "formulario-input-error" : ""}`}
                          placeholder="Ex: 2x/dia" value={med.frequencia}
                          onChange={(e) => handleMedicamentoChange(index, "frequencia", e.target.value)} />
                        {errors[`med_${index}_frequencia`] && <div className="formulario-error-msg">{errors[`med_${index}_frequencia`]}</div>}
                      </div>

                    </div>
                  </div>
                ))}

                <button type="button" className="lista-adicionar-btn" onClick={adicionarMedicamento}>
                  <i className="fa-solid fa-plus"></i> Adicionar medicamento
                </button>
              </div>
            </details>

            {/* ── OBSERVAÇÕES ── */}
            <div className="formulario-field">
              <label className="formulario-label">
                Observações <span className="formulario-label-required">*</span>
              </label>
              <textarea id="observacoes"
                className={`formulario-textarea formulario-textarea-obs ${errors.observacoes ? "formulario-input-error" : ""}`}
                rows="4" placeholder="Ex: alergias, restrições ou informações importantes"
                value={formData.observacoes} onChange={handleChange} onBlur={handleBlur}>
              </textarea>
              {errors.observacoes && <div className="formulario-error-msg">{errors.observacoes}</div>}
            </div>

            <button type="submit" className="formulario-submit-btn">Cadastrar</button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Formulario;
