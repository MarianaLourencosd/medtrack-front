// src/components/visualizarPaciente/VisualizarPaciente.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, auth } from "../../services/firebaseConfig";
import { doc, getDoc, collection, query, where, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import "./VisualizarPaciente.css";

import perfil1 from "../../assets/images/imagem-perfil1.jpg";
import perfil2 from "../../assets/images/imagem-perfil2.jpg";
import perfil3 from "../../assets/images/imagem-perfil3.jpg";
import perfil4 from "../../assets/images/imagem-perfil4.jpg";

const defaultAvatars = [perfil1, perfil2, perfil3, perfil4];

function VisualizarPaciente() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paciente, setPaciente] = useState(null);
  const [showModalExcluir, setShowModalExcluir] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  const [formularioId, setFormularioId] = useState(null);

  const [editData, setEditData] = useState({
    nome: "",
    cpf: "",
    dataNascimento: "",
    sexo: "",
    altura: "",
    peso: "",
    tipoSanguineo: "",
    sus: "",
    cidade: "",
    observacoes: ""
  });

  const [editContatos, setEditContatos] = useState([]);
  const [editMedicamentos, setEditMedicamentos] = useState([]);

  const getAvatarImage = (id) => {
    if (id) {
      const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return defaultAvatars[hash % defaultAvatars.length];
    }
    return defaultAvatars[0];
  };

  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return null;
    const nascimento = dataNascimento.toDate ? dataNascimento.toDate() : new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const formatarDataParaInput = (data) => {
    if (!data) return "";
    const d = data.toDate ? data.toDate() : new Date(data);
    return d.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchPacienteData = async () => {
      setLoading(true);
      
      if (!userId) {
        navigate("/busca-perfil");
        return;
      }

      try {
        const userDocRef = doc(db, "usuarios", userId);
        const userDoc = await getDoc(userDocRef);
        
        const q = query(collection(db, "formularios"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        
        let formData = null;
        let formId = null;
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[querySnapshot.docs.length - 1];
          formData = docSnap.data();
          formId = docSnap.id;
          setFormularioId(formId);
        }
        
        const idade = formData?.dataNascimento ? calcularIdade(formData.dataNascimento) : null;
        
        let contatosArray = [];
        let medicamentosArray = [];
        
        if (formData) {
          if (formData.contatos && Array.isArray(formData.contatos)) {
            contatosArray = formData.contatos;
          } else if (formData.nomeContato) {
            contatosArray = [{
              nomeContato: formData.nomeContato || "",
              telefoneContato: formData.telefoneContato || "",
              relacionamento: formData.relacionamento || ""
            }];
          }
          
          if (formData.medicamentos && Array.isArray(formData.medicamentos)) {
            medicamentosArray = formData.medicamentos;
          } else if (formData.medicamento) {
            medicamentosArray = [{
              medicamento: formData.medicamento || "",
              dosagem: formData.dosagem || "",
              frequencia: formData.frequencia || ""
            }];
          }
        }
        
        const pacienteData = {
          id: userId,
          email: userDoc.exists() ? userDoc.data().email : "Não informado",
          nome: formData?.nome || userDoc.data()?.nome || "Não informado",
          cpf: formData?.cpf || "Não informado",
          dataNascimento: formData?.dataNascimento || "Não informada",
          idade: idade,
          sexo: formData?.sexo || "Não informado",
          altura: formData?.altura || "Não informado",
          peso: formData?.peso || "Não informado",
          tipoSanguineo: formData?.tipoSanguineo || "Não informado",
          sus: formData?.sus || "Não informado",
          cidade: formData?.cidade || "Não informado",
          observacoes: formData?.observacoes || "Nenhuma observação",
          avatar: getAvatarImage(userId),
          temFormulario: formData !== null,
          contatos: contatosArray,
          medicamentos: medicamentosArray
        };
        
        setPaciente(pacienteData);
        
        setEditData({
          nome: formData?.nome || "",
          cpf: formData?.cpf || "",
          dataNascimento: formatarDataParaInput(formData?.dataNascimento),
          sexo: formData?.sexo || "",
          altura: formData?.altura || "",
          peso: formData?.peso || "",
          tipoSanguineo: formData?.tipoSanguineo || "",
          sus: formData?.sus || "",
          cidade: formData?.cidade || "",
          observacoes: formData?.observacoes || ""
        });
        
        setEditContatos(contatosArray.length ? contatosArray : [{ nomeContato: "", telefoneContato: "", relacionamento: "" }]);
        setEditMedicamentos(medicamentosArray.length ? medicamentosArray : [{ medicamento: "", dosagem: "", frequencia: "" }]);
        
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setMensagem({ texto: "Erro ao carregar dados do paciente", tipo: "error" });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPacienteData();
  }, [userId, navigate]);

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
    navigate("/busca-perfil");
  };

  const handleSalvarEdicao = async () => {
    if (!formularioId) {
      setMensagem({ texto: "Erro: Formulário não encontrado", tipo: "error" });
      return;
    }

    try {
      const formRef = doc(db, "formularios", formularioId);
      
      const updateData = {
        nome: editData.nome,
        cpf: editData.cpf,
        dataNascimento: editData.dataNascimento ? new Date(editData.dataNascimento) : null,
        sexo: editData.sexo,
        altura: editData.altura,
        peso: editData.peso,
        tipoSanguineo: editData.tipoSanguineo,
        sus: editData.sus,
        cidade: editData.cidade,
        observacoes: editData.observacoes,
        contatos: editContatos.filter(c => c.nomeContato || c.telefoneContato || c.relacionamento),
        medicamentos: editMedicamentos.filter(m => m.medicamento || m.dosagem || m.frequencia),
        updatedAt: new Date()
      };
      
      await updateDoc(formRef, updateData);
      
      setMensagem({ texto: "Dados atualizados com sucesso!", tipo: "success" });
      setShowModalEditar(false);
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      setMensagem({ texto: "Erro ao atualizar dados", tipo: "error" });
    }
  };

  const handleExcluir = async () => {
    try {
      if (formularioId) {
        await deleteDoc(doc(db, "formularios", formularioId));
        setMensagem({ 
          texto: "Dados do paciente excluídos com sucesso! O usuário continua com sua conta.", 
          tipo: "success" 
        });
      } else {
        setMensagem({ texto: "Nenhum formulário encontrado para excluir", tipo: "error" });
      }
      
      setShowModalExcluir(false);
      
      setTimeout(() => {
        navigate("/busca-perfil");
      }, 2000);
      
    } catch (error) {
      console.error("Erro ao excluir:", error);
      setMensagem({ texto: "Erro ao excluir dados do paciente", tipo: "error" });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleContatoChange = (index, field, value) => {
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

  const handleMedicamentoChange = (index, field, value) => {
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

  const handleModalClick = (e, setter) => {
    if (e.target === e.currentTarget) {
      setter(false);
    }
  };

  const formatarData = (data) => {
    if (!data || data === "Não informada") return "Não informada";
    if (data.toDate) {
      return data.toDate().toLocaleDateString("pt-BR");
    }
    return new Date(data).toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <main className="visualizar-main">
        <div className="visualizar-container">
          <div className="loading-spinner"></div>
          <p>Carregando dados do paciente...</p>
        </div>
      </main>
    );
  }

  if (!paciente) {
    return (
      <main className="visualizar-main">
        <div className="visualizar-container">
          <p>Paciente não encontrado</p>
          <button onClick={handleVoltar} className="action-btn back-btn">Voltar</button>
        </div>
      </main>
    );
  }

  return (
    <main className="visualizar-main">
      <div className="visualizar-container">
        <button onClick={handleVoltar} className="action-btn back-btn">
          <i className="fas fa-arrow-left"></i>
          Voltar
        </button>
        
        <button onClick={toggleDarkMode} className="action-btn theme-btn">
          <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
        </button>

        {mensagem.texto && (
          <div className={`mensagem ${mensagem.tipo}`}>
            {mensagem.texto}
          </div>
        )}

        <div className="paciente-card">
          <div className="paciente-header">
            <div className="paciente-avatar">
              <img src={paciente.avatar} alt={paciente.nome} />
            </div>
            <div className="paciente-titulo">
              <h1>{paciente.nome}</h1>
              {paciente.idade && <span className="idade">{paciente.idade} anos</span>}
              {paciente.tipoSanguineo !== "Não informado" && (
                <span className="tipo-sangue">{paciente.tipoSanguineo}</span>
              )}
              <div className="email-info">
                <i className="fas fa-envelope"></i>
                <span>{paciente.email}</span>
              </div>
            </div>
          </div>

          <div className="secao">
            <h2><i className="fas fa-user"></i> Dados Pessoais</h2>
            <div className="grid-2-colunas">
              <div className="campo"><label>Nome Completo</label><p>{paciente.nome}</p></div>
              <div className="campo"><label>CPF</label><p>{paciente.cpf}</p></div>
              <div className="campo"><label>Data de Nascimento</label><p>{formatarData(paciente.dataNascimento)}</p></div>
              <div className="campo"><label>Idade</label><p>{paciente.idade ? `${paciente.idade} anos` : "Não informada"}</p></div>
              <div className="campo"><label>Sexo</label><p>{paciente.sexo}</p></div>
              <div className="campo"><label>Tipo Sanguíneo</label><p>{paciente.tipoSanguineo}</p></div>
              <div className="campo"><label>Altura</label><p>{paciente.altura !== "Não informado" ? `${paciente.altura} m` : paciente.altura}</p></div>
              <div className="campo"><label>Peso</label><p>{paciente.peso !== "Não informado" ? `${paciente.peso} kg` : paciente.peso}</p></div>
              <div className="campo"><label>Cartão SUS</label><p>{paciente.sus}</p></div>
              <div className="campo"><label>Cidade</label><p>{paciente.cidade}</p></div>
            </div>
          </div>

          {paciente.contatos && paciente.contatos.length > 0 && paciente.contatos[0]?.nomeContato && (
            <div className="secao">
              <h2><i className="fas fa-phone-alt"></i> Contatos de Emergência</h2>
              {paciente.contatos.map((contato, idx) => (
                <div key={idx} className="grid-2-colunas" style={{ marginBottom: 16 }}>
                  <div className="campo"><label>Nome</label><p>{contato.nomeContato}</p></div>
                  <div className="campo"><label>Telefone</label><p>{contato.telefoneContato}</p></div>
                  <div className="campo"><label>Relacionamento</label><p>{contato.relacionamento}</p></div>
                </div>
              ))}
            </div>
          )}

          {paciente.medicamentos && paciente.medicamentos.length > 0 && paciente.medicamentos[0]?.medicamento && (
            <div className="secao">
              <h2><i className="fas fa-pills"></i> Medicamentos</h2>
              {paciente.medicamentos.map((med, idx) => (
                <div key={idx} className="grid-2-colunas" style={{ marginBottom: 16 }}>
                  <div className="campo"><label>Medicamento</label><p>{med.medicamento}</p></div>
                  <div className="campo"><label>Dosagem</label><p>{med.dosagem}</p></div>
                  <div className="campo"><label>Frequência</label><p>{med.frequencia}</p></div>
                </div>
              ))}
            </div>
          )}

          {paciente.observacoes && paciente.observacoes !== "Nenhuma observação" && (
            <div className="secao">
              <h2><i className="fas fa-sticky-note"></i> Observações</h2>
              <div className="campo"><p className="observacoes-texto">{paciente.observacoes}</p></div>
            </div>
          )}

          <div className="botoes-acao">
            <button className="btn-editar" onClick={() => setShowModalEditar(true)}>
              <i className="fas fa-edit"></i> Editar Dados
            </button>
            <button className="btn-excluir" onClick={() => setShowModalExcluir(true)}>
              <i className="fas fa-trash-alt"></i> Excluir Dados do Paciente
            </button>
          </div>
          
          <div className="aviso-exclusao">
            <i className="fas fa-info-circle"></i>
            <span>A exclusão remove apenas os dados de saúde do paciente. A conta de usuário (email) permanece ativa.</span>
          </div>
        </div>

        {showModalEditar && (
          <div className="modal-overlay" onClick={(e) => handleModalClick(e, setShowModalEditar)}>
            <div className="modal-editar" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <i className="fas fa-edit"></i>
                <h3>Editar Dados do Paciente</h3>
                <button className="modal-close" onClick={() => setShowModalEditar(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group"><label>Nome Completo</label><input type="text" name="nome" value={editData.nome} onChange={handleEditChange} /></div>
                  <div className="form-group"><label>CPF</label><input type="text" name="cpf" value={editData.cpf} onChange={handleEditChange} /></div>
                  <div className="form-group"><label>Data de Nascimento</label><input type="date" name="dataNascimento" value={editData.dataNascimento} onChange={handleEditChange} /></div>
                  <div className="form-group"><label>Sexo</label><select name="sexo" value={editData.sexo} onChange={handleEditChange}><option value="">Selecione</option><option value="Masculino">Masculino</option><option value="Feminino">Feminino</option><option value="Outro">Outro</option></select></div>
                  <div className="form-group"><label>Altura (m)</label><input type="number" step="0.01" name="altura" value={editData.altura} onChange={handleEditChange} /></div>
                  <div className="form-group"><label>Peso (kg)</label><input type="number" step="0.1" name="peso" value={editData.peso} onChange={handleEditChange} /></div>
                  <div className="form-group"><label>Tipo Sanguíneo</label><select name="tipoSanguineo" value={editData.tipoSanguineo} onChange={handleEditChange}><option value="">Selecione</option><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option></select></div>
                  <div className="form-group"><label>Cartão SUS</label><input type="text" name="sus" value={editData.sus} onChange={handleEditChange} /></div>
                  <div className="form-group"><label>Cidade</label><input type="text" name="cidade" value={editData.cidade} onChange={handleEditChange} /></div>
                  <div className="form-group full-width"><label>Observações</label><textarea name="observacoes" rows="3" value={editData.observacoes} onChange={handleEditChange}></textarea></div>
                </div>

                <h4>Contatos de Emergência</h4>
                {editContatos.map((contato, idx) => (
                  <div key={idx} className="form-grid" style={{ border: "1px solid #ddd", padding: 10, marginBottom: 10, borderRadius: 8 }}>
                    <div className="form-group"><label>Nome</label><input type="text" value={contato.nomeContato} onChange={(e) => handleContatoChange(idx, "nomeContato", e.target.value)} /></div>
                    <div className="form-group"><label>Telefone</label><input type="text" value={contato.telefoneContato} onChange={(e) => handleContatoChange(idx, "telefoneContato", e.target.value)} /></div>
                    <div className="form-group"><label>Relacionamento</label><input type="text" value={contato.relacionamento} onChange={(e) => handleContatoChange(idx, "relacionamento", e.target.value)} /></div>
                    {editContatos.length > 1 && <button type="button" onClick={() => removeContato(idx)}>Remover</button>}
                  </div>
                ))}
                <button type="button" onClick={addContato}>+ Adicionar Contato</button>

                <h4>Medicamentos</h4>
                {editMedicamentos.map((med, idx) => (
                  <div key={idx} className="form-grid" style={{ border: "1px solid #ddd", padding: 10, marginBottom: 10, borderRadius: 8 }}>
                    <div className="form-group"><label>Medicamento</label><input type="text" value={med.medicamento} onChange={(e) => handleMedicamentoChange(idx, "medicamento", e.target.value)} /></div>
                    <div className="form-group"><label>Dosagem</label><input type="text" value={med.dosagem} onChange={(e) => handleMedicamentoChange(idx, "dosagem", e.target.value)} /></div>
                    <div className="form-group"><label>Frequência</label><input type="text" value={med.frequencia} onChange={(e) => handleMedicamentoChange(idx, "frequencia", e.target.value)} /></div>
                    {editMedicamentos.length > 1 && <button type="button" onClick={() => removeMedicamento(idx)}>Remover</button>}
                  </div>
                ))}
                <button type="button" onClick={addMedicamento}>+ Adicionar Medicamento</button>
              </div>
              <div className="modal-footer">
                <button className="btn-cancelar" onClick={() => setShowModalEditar(false)}>Cancelar</button>
                <button className="btn-salvar" onClick={handleSalvarEdicao}><i className="fas fa-save"></i> Salvar Alterações</button>
              </div>
            </div>
          </div>
        )}

        {showModalExcluir && (
          <div className="modal-overlay" onClick={(e) => handleModalClick(e, setShowModalExcluir)}>
            <div className="modal-confirmar" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header"><i className="fas fa-exclamation-triangle"></i><h3>Confirmar Exclusão</h3></div>
              <div className="modal-body">
                <p>Tem certeza que deseja excluir os dados de saúde de <strong>{paciente.nome}</strong>?</p>
                <p className="texto-aviso"><i className="fas fa-info-circle"></i> Atenção: A conta de usuário (<strong>{paciente.email}</strong>) NÃO será excluída. Apenas os dados do formulário de saúde serão removidos.</p>
              </div>
              <div className="modal-footer">
                <button className="btn-cancelar" onClick={() => setShowModalExcluir(false)}>Cancelar</button>
                <button className="btn-confirmar" onClick={handleExcluir}><i className="fas fa-trash-alt"></i> Sim, Excluir Dados</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default VisualizarPaciente;