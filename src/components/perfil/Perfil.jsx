import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Perfil.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../utils/daltonismo.css";

import { db, auth } from "../../services/firebaseConfig";
import { collection, getDocs, query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function Perfil() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState(null);

  const [showDadosModal, setShowDadosModal] = useState(false);
  const [showContatosModal, setShowContatosModal] = useState(false);
  const [showRemediosModal, setShowRemediosModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [perfilData, setPerfilData] = useState({});
  const [formularioId, setFormularioId] = useState(null);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

  const [contatos, setContatos] = useState([]);
  const [remedios, setRemedios] = useState([]);

  const [editContatos, setEditContatos] = useState([]);
  const [editMedicamentos, setEditMedicamentos] = useState([]);

  const [editData, setEditData] = useState({
    nome: "",
    cpf: "",
    dataNascimento: "",
    sexo: "",
    altura: "",
    peso: "",
    tipoSanguineo: "",
    sus: "",
    observacoes: ""
  });

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
    navigate("/");
  };

  const handleFotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setFotoPerfil(base64);
        const currentUser = auth.currentUser;
        if (currentUser) {
          localStorage.setItem(`fotoPerfil_${currentUser.uid}`, base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClickFoto = () => {
    document.getElementById("foto-input").click();
  };

  const handleModalClick = (e, setter) => {
    if (e.target === e.currentTarget) {
      setter(false);
    }
  };

  const formatarDataParaInput = (data) => {
    if (!data) return "";
    if (data.toDate) {
      const d = data.toDate();
      return d.toISOString().split('T')[0];
    }
    if (typeof data === 'string') {
      return data;
    }
    return "";
  };

  const formatarDataParaExibicao = (data) => {
    if (!data) return "";
    if (data.toDate) {
      return data.toDate().toLocaleDateString("pt-BR");
    }
    if (typeof data === 'string') {
      const partes = data.split('-');
      if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
      }
      return data;
    }
    return "";
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditContatoChange = (index, field, value) => {
    const updated = [...editContatos];
    updated[index] = { ...updated[index], [field]: value };
    setEditContatos(updated);
  };

  const addContato = () => {
    setEditContatos([...editContatos, { nomeContato: "", telefoneContato: "", relacionamento: "" }]);
  };

  const removeContato = (index) => {
    if (editContatos.length > 1) {
      setEditContatos(editContatos.filter((_, i) => i !== index));
    }
  };

  const handleEditMedicamentoChange = (index, field, value) => {
    const updated = [...editMedicamentos];
    updated[index] = { ...updated[index], [field]: value };
    setEditMedicamentos(updated);
  };

  const addMedicamento = () => {
    setEditMedicamentos([...editMedicamentos, { medicamento: "", dosagem: "", frequencia: "" }]);
  };

  const removeMedicamento = (index) => {
    if (editMedicamentos.length > 1) {
      setEditMedicamentos(editMedicamentos.filter((_, i) => i !== index));
    }
  };

  const handleSalvarEdicao = async () => {
    if (!formularioId) {
      setMensagem({ texto: "Erro: Formulário não encontrado", tipo: "error" });
      setTimeout(() => setMensagem({ texto: "", tipo: "" }), 3000);
      return;
    }

    try {
      const formRef = doc(db, "formularios", formularioId);

      await updateDoc(formRef, {
        nome: editData.nome,
        cpf: editData.cpf,
        dataNascimento: editData.dataNascimento ? new Date(editData.dataNascimento) : null,
        sexo: editData.sexo,
        altura: editData.altura,
        peso: editData.peso,
        tipoSanguineo: editData.tipoSanguineo,
        sus: editData.sus,
        observacoes: editData.observacoes,
        contatos: editContatos,
        medicamentos: editMedicamentos,
        updatedAt: new Date()
      });

      setMensagem({ texto: "✅ Dados atualizados com sucesso!", tipo: "success" });
      setShowEditModal(false);

      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error("Erro ao atualizar:", error);
      setMensagem({ texto: "❌ Erro ao atualizar dados", tipo: "error" });
      setTimeout(() => setMensagem({ texto: "", tipo: "" }), 3000);
    }
  };

  const handleExcluirDados = async () => {
    if (!formularioId) {
      setMensagem({ texto: "Erro: Nenhum formulário encontrado", tipo: "error" });
      setTimeout(() => setMensagem({ texto: "", tipo: "" }), 3000);
      return;
    }

    try {
      await deleteDoc(doc(db, "formularios", formularioId));
      setMensagem({ texto: "✅ Dados excluídos com sucesso!", tipo: "success" });
      setShowDeleteModal(false);

      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error("Erro ao excluir:", error);
      setMensagem({ texto: "❌ Erro ao excluir dados", tipo: "error" });
      setTimeout(() => setMensagem({ texto: "", tipo: "" }), 3000);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("Usuário não logado");
        return;
      }

      const savedFoto = localStorage.getItem(`fotoPerfil_${user.uid}`);
      if (savedFoto) {
        setFotoPerfil(savedFoto);
      } else {
        setFotoPerfil(null);
      }

      try {
        const q = query(
          collection(db, "formularios"),
          where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[querySnapshot.docs.length - 1];
          const docData = docSnap.data();
          const docId = docSnap.id;
          setFormularioId(docId);

          setPerfilData({
            nome: docData.nome,
            cpf: docData.cpf,
            dataNascimento: docData.dataNascimento,
            peso: docData.peso,
            sexo: docData.sexo,
            altura: docData.altura,
            tipoSanguineo: docData.tipoSanguineo,
            sus: docData.sus,
            observacoes: docData.observacoes
          });

          setEditData({
            nome: docData.nome || "",
            cpf: docData.cpf || "",
            dataNascimento: formatarDataParaInput(docData.dataNascimento),
            sexo: docData.sexo || "",
            altura: docData.altura || "",
            peso: docData.peso || "",
            tipoSanguineo: docData.tipoSanguineo || "",
            sus: docData.sus || "",
            observacoes: docData.observacoes || ""
          });

          if (Array.isArray(docData.contatos) && docData.contatos.length > 0) {
            setContatos(docData.contatos);
            setEditContatos(docData.contatos.map(c => ({
              nomeContato: c.nomeContato || "",
              telefoneContato: c.telefoneContato || "",
              relacionamento: c.relacionamento || "",
            })));
          } else if (docData.nomeContato) {
            const contatoUnico = [{
              nomeContato: docData.nomeContato,
              telefoneContato: docData.telefoneContato,
              relacionamento: docData.relacionamento,
            }];
            setContatos(contatoUnico);
            setEditContatos(contatoUnico);
          } else {
            setContatos([]);
            setEditContatos([{ nomeContato: "", telefoneContato: "", relacionamento: "" }]);
          }

          if (Array.isArray(docData.medicamentos) && docData.medicamentos.length > 0) {
            setRemedios(docData.medicamentos);
            setEditMedicamentos(docData.medicamentos.map(m => ({
              medicamento: m.medicamento || "",
              dosagem: m.dosagem || "",
              frequencia: m.frequencia || "",
            })));
          } else if (docData.medicamento) {
            const remedioUnico = [{
              medicamento: docData.medicamento,
              dosagem: docData.dosagem,
              frequencia: docData.frequencia,
            }];
            setRemedios(remedioUnico);
            setEditMedicamentos(remedioUnico);
          } else {
            setRemedios([]);
            setEditMedicamentos([{ medicamento: "", dosagem: "", frequencia: "" }]);
          }
        }

      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="perfil-main">
      <div className="perfil-container">

        <button
          onClick={handleVoltar}
          className="perfil-action-btn perfil-back-btn"
          aria-label="Voltar"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>

        <button
          onClick={toggleDarkMode}
          className="perfil-action-btn perfil-theme-btn"
          aria-label="Alternar modo escuro"
        >
          <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
        </button>

        {mensagem.texto && (
          <div className={`mensagem-flutuante ${mensagem.tipo}`}>
            {mensagem.texto}
          </div>
        )}

        <div className="perfil-card-container">

          <div className="perfil-header">

            <div className="perfil-avatar">
              <div className={`avatar-placeholder ${fotoPerfil ? "has-image" : ""}`}>
                {fotoPerfil ? (
                  <img src={fotoPerfil} alt="Foto de perfil" />
                ) : (
                  <i className="fas fa-user-circle"></i>
                )}
              </div>
              <div className="avatar-edit">
                <button
                  className="edit-avatar-btn"
                  onClick={handleClickFoto}
                  aria-label="Editar foto de perfil"
                >
                  <i className="fas fa-camera"></i>
                </button>
              </div>
              <input id="foto-input" type="file" accept="image/*" onChange={handleFotoUpload} />
            </div>

            <div className="perfil-nome">
              <h2 className="nome-paciente">{perfilData.nome || "Carregando..."}</h2>
              <div className="perfil-info-header">
                {perfilData.tipoSanguineo && (
                  <div className="info-item">
                    <i className="fas fa-droplet"></i>
                    <span>{perfilData.tipoSanguineo}</span>
                  </div>
                )}
                {perfilData.sexo && (
                  <div className="info-item">
                    <i className={`fas fa-${perfilData.sexo === "Feminino" ? "venus" : "mars"}`}></i>
                    <span>{perfilData.sexo}</span>
                  </div>
                )}
                {perfilData.dataNascimento && (
                  <div className="info-item">
                    <i className="fas fa-calendar"></i>
                    <span>{formatarDataParaExibicao(perfilData.dataNascimento)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {Object.keys(perfilData).length > 0 && (
            <div className="perfil-dados-section">
              <div className="dados-title">
                <i className="fas fa-id-card"></i>
                Informações do Paciente
              </div>
              <div className="dados-grid">
                {perfilData.cpf && (
                  <div className="dado-item">
                    <span className="dado-label">CPF</span>
                    <span className="dado-value">{perfilData.cpf}</span>
                  </div>
                )}
                {perfilData.altura && (
                  <div className="dado-item">
                    <span className="dado-label">Altura</span>
                    <span className="dado-value">{perfilData.altura} m</span>
                  </div>
                )}
                {perfilData.peso && (
                  <div className="dado-item">
                    <span className="dado-label">Peso</span>
                    <span className="dado-value">{perfilData.peso} kg</span>
                  </div>
                )}
                {perfilData.sus && (
                  <div className="dado-item">
                    <span className="dado-label">Cartão SUS</span>
                    <span className="dado-value">{perfilData.sus}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="perfil-botoes">
            <button className="perfil-btn" onClick={() => setShowDadosModal(true)}>
              <i className="fas fa-id-card"></i> Dados Completos
            </button>
            <button className="perfil-btn" onClick={() => setShowContatosModal(true)}>
              <i className="fas fa-phone-alt"></i> Contatos
            </button>
            <button className="perfil-btn" onClick={() => setShowRemediosModal(true)}>
              <i className="fas fa-pills"></i> Medicamentos
            </button>
          </div>

          <div className="perfil-acoes">
            <button className="acao-link acao-editar" onClick={() => setShowEditModal(true)}>
              <i className="fas fa-edit"></i> Editar dados
            </button>
            <span className="separador">|</span>
            <button className="acao-link acao-excluir" onClick={() => setShowDeleteModal(true)}>
              <i className="fas fa-trash-alt"></i> Excluir dados
            </button>
          </div>
        </div>

        {showDadosModal && (
          <div className="modal-overlay" onClick={(e) => handleModalClick(e, setShowDadosModal)}>
            <div className="modal-container modal-dados">
              <div className="modal-header">
                <h2><i className="fas fa-id-card"></i> Dados Pessoais Completos</h2>
                <button className="modal-close" onClick={() => setShowDadosModal(false)}><i className="fas fa-times"></i></button>
              </div>
              <div className="modal-body">
                <div className="dados-grid">
                  <div className="dado-item"><span className="dado-label">Nome Completo</span><span className="dado-value">{perfilData.nome || "Não informado"}</span></div>
                  <div className="dado-item"><span className="dado-label">CPF</span><span className="dado-value">{perfilData.cpf || "Não informado"}</span></div>
                  <div className="dado-item"><span className="dado-label">Data de Nascimento</span><span className="dado-value">{formatarDataParaExibicao(perfilData.dataNascimento) || "Não informado"}</span></div>
                  <div className="dado-item"><span className="dado-label">Sexo</span><span className="dado-value">{perfilData.sexo || "Não informado"}</span></div>
                  <div className="dado-item"><span className="dado-label">Altura</span><span className="dado-value">{perfilData.altura ? `${perfilData.altura} m` : "Não informado"}</span></div>
                  <div className="dado-item"><span className="dado-label">Peso</span><span className="dado-value">{perfilData.peso ? `${perfilData.peso} kg` : "Não informado"}</span></div>
                  <div className="dado-item"><span className="dado-label">Tipo Sanguíneo</span><span className="dado-value">{perfilData.tipoSanguineo || "Não informado"}</span></div>
                  <div className="dado-item"><span className="dado-label">Cartão SUS</span><span className="dado-value">{perfilData.sus || "Não informado"}</span></div>
                </div>
                {perfilData.observacoes && (
                  <div style={{ marginTop: "1.5rem" }}>
                    <h4 style={{ color: "var(--cor-primaria)" }}>Observações</h4>
                    <p>{perfilData.observacoes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showContatosModal && (
          <div className="modal-overlay" onClick={(e) => handleModalClick(e, setShowContatosModal)}>
            <div className="modal-container modal-contatos">
              <div className="modal-header">
                <h2><i className="fas fa-phone-alt"></i> Contatos de Emergência</h2>
                <button className="modal-close" onClick={() => setShowContatosModal(false)}><i className="fas fa-times"></i></button>
              </div>
              <div className="modal-body">
                {contatos.length > 0 ? (
                  <table className="perfil-table">
                    <thead><tr><th>Nome</th><th>Telefone</th><th>Relacionamento</th></tr></thead>
                    <tbody>
                      {contatos.map((contato, index) => (
                        <tr key={index}>
                          <td>{contato.nomeContato || contato.nome}</td>
                          <td>{contato.telefoneContato || contato.telefone}</td>
                          <td>{contato.relacionamento || contato.relacionamento}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ textAlign: "center", color: "var(--cor-cinza)" }}>Nenhum contato de emergência registrado</p>
                )}
              </div>
            </div>
          </div>
        )}

        {showRemediosModal && (
          <div className="modal-overlay" onClick={(e) => handleModalClick(e, setShowRemediosModal)}>
            <div className="modal-container modal-remedios">
              <div className="modal-header">
                <h2><i className="fas fa-pills"></i> Medicamentos</h2>
                <button className="modal-close" onClick={() => setShowRemediosModal(false)}><i className="fas fa-times"></i></button>
              </div>
              <div className="modal-body">
                {remedios.length > 0 ? (
                  <table className="perfil-table">
                    <thead><tr><th>Medicamento</th><th>Dosagem</th><th>Frequência</th></tr></thead>
                    <tbody>
                      {remedios.map((remedio, index) => (
                        <tr key={index}>
                          <td>{remedio.medicamento || remedio.nome}</td>
                          <td>{remedio.dosagem || remedio.dosagem}</td>
                          <td>{remedio.frequencia || remedio.frequencia}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ textAlign: "center", color: "var(--cor-cinza)" }}>Nenhum medicamento registrado</p>
                )}
              </div>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="modal-overlay" onClick={(e) => handleModalClick(e, setShowEditModal)}>
            <div className="modal-container modal-editar">
              <div className="modal-header">
                <h2><i className="fas fa-edit"></i> Editar Dados Pessoais</h2>
                <button className="modal-close" onClick={() => setShowEditModal(false)}><i className="fas fa-times"></i></button>
              </div>
              <div className="modal-body">
                <h3 className="section-title">Dados Pessoais</h3>
                <div className="edit-form">
                  <div className="edit-field">
                    <label>Nome Completo</label>
                    <input type="text" name="nome" value={editData.nome} onChange={handleEditChange} />
                  </div>
                  <div className="edit-field">
                    <label>CPF</label>
                    <input type="text" name="cpf" value={editData.cpf} onChange={handleEditChange} />
                  </div>
                  <div className="edit-field">
                    <label>Data de Nascimento</label>
                    <input type="date" name="dataNascimento" value={editData.dataNascimento} onChange={handleEditChange} />
                  </div>
                  <div className="edit-field">
                    <label>Sexo</label>
                    <select name="sexo" value={editData.sexo} onChange={handleEditChange}>
                      <option value="">Selecione</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div className="edit-field">
                    <label>Altura (m)</label>
                    <input type="number" step="0.01" name="altura" value={editData.altura} onChange={handleEditChange} />
                  </div>
                  <div className="edit-field">
                    <label>Peso (kg)</label>
                    <input type="number" step="0.1" name="peso" value={editData.peso} onChange={handleEditChange} />
                  </div>
                  <div className="edit-field">
                    <label>Tipo Sanguíneo</label>
                    <select name="tipoSanguineo" value={editData.tipoSanguineo} onChange={handleEditChange}>
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
                  </div>
                  <div className="edit-field">
                    <label>Cartão SUS</label>
                    <input type="text" name="sus" value={editData.sus} onChange={handleEditChange} />
                  </div>
                  <div className="edit-field full-width">
                    <label>Observações</label>
                    <textarea name="observacoes" rows="3" value={editData.observacoes} onChange={handleEditChange} placeholder="Nenhuma observação"></textarea>
                  </div>
                </div>

                <h3 className="section-title">Contatos de Emergência</h3>
                {editContatos.map((contato, idx) => (
                  <div key={idx} className="edit-contato-card">
                    <div className="edit-contato-header">
                      <span>Contato {idx + 1}</span>
                      {editContatos.length > 1 && (
                        <button type="button" className="remove-btn" onClick={() => removeContato(idx)}>
                          <i className="fas fa-trash"></i> Remover
                        </button>
                      )}
                    </div>
                    <div className="edit-form">
                      <div className="edit-field">
                        <label>Nome</label>
                        <input type="text" value={contato.nomeContato} onChange={(e) => handleEditContatoChange(idx, "nomeContato", e.target.value)} />
                      </div>
                      <div className="edit-field">
                        <label>Telefone</label>
                        <input type="text" value={contato.telefoneContato} onChange={(e) => handleEditContatoChange(idx, "telefoneContato", e.target.value)} />
                      </div>
                      <div className="edit-field">
                        <label>Relacionamento</label>
                        <input type="text" value={contato.relacionamento} onChange={(e) => handleEditContatoChange(idx, "relacionamento", e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" className="add-btn" onClick={addContato}>
                  <i className="fas fa-plus"></i> Adicionar Contato
                </button>

                <h3 className="section-title">Medicamentos</h3>
                {editMedicamentos.map((med, idx) => (
                  <div key={idx} className="edit-medicamento-card">
                    <div className="edit-medicamento-header">
                      <span>Medicamento {idx + 1}</span>
                      {editMedicamentos.length > 1 && (
                        <button type="button" className="remove-btn" onClick={() => removeMedicamento(idx)}>
                          <i className="fas fa-trash"></i> Remover
                        </button>
                      )}
                    </div>
                    <div className="edit-form">
                      <div className="edit-field">
                        <label>Medicamento</label>
                        <input type="text" value={med.medicamento} onChange={(e) => handleEditMedicamentoChange(idx, "medicamento", e.target.value)} />
                      </div>
                      <div className="edit-field">
                        <label>Dosagem</label>
                        <input type="text" value={med.dosagem} onChange={(e) => handleEditMedicamentoChange(idx, "dosagem", e.target.value)} />
                      </div>
                      <div className="edit-field">
                        <label>Frequência</label>
                        <input type="text" value={med.frequencia} onChange={(e) => handleEditMedicamentoChange(idx, "frequencia", e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" className="add-btn" onClick={addMedicamento}>
                  <i className="fas fa-plus"></i> Adicionar Medicamento
                </button>
              </div>
              <div className="modal-footer">
                <button className="btn-cancelar" onClick={() => setShowEditModal(false)}>Cancelar</button>
                <button className="btn-salvar" onClick={handleSalvarEdicao}>Salvar Alterações</button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="modal-overlay" onClick={(e) => handleModalClick(e, setShowDeleteModal)}>
            <div className="modal-container modal-confirmar">
              <div className="modal-header">
                <h2><i className="fas fa-exclamation-triangle"></i> Confirmar Exclusão</h2>
                <button className="modal-close" onClick={() => setShowDeleteModal(false)}><i className="fas fa-times"></i></button>
              </div>
              <div className="modal-body">
                <p>Tem certeza que deseja excluir <strong>TODOS os seus dados de saúde</strong>?</p>
                <p className="aviso-exclusao">⚠️ Esta ação não pode ser desfeita!</p>
              </div>
              <div className="modal-footer">
                <button className="btn-cancelar" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                <button className="btn-confirmar" onClick={handleExcluirDados}>Sim, Excluir</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Perfil;