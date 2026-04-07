import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Perfil.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../utils/daltonismo.css";

function Perfil() {
  const navigate = useNavigate();
  
  // Estado para dark mode
  const [darkMode, setDarkMode] = useState(false);
  
  // Estado para modais
  const [showDadosModal, setShowDadosModal] = useState(false);
  const [showContatosModal, setShowContatosModal] = useState(false);
  const [showRemediosModal, setShowRemediosModal] = useState(false);
  const [showAlergiasModal, setShowAlergiasModal] = useState(false);
  
  // Estado para dados do perfil
  const [perfilData, setPerfilData] = useState({
    nome: "João da Silva",
    cpf: "123.456.789-00",
    dataNascimento: "15/03/1990",
    peso: "70",
    sexo: "Masculino",
    altura: "1.75",
    tipoSanguineo: "O+",
    sus: "012.3456.7898.7654"
  });

  // Estado para nome editável
  const [nomeEditavel, setNomeEditavel] = useState(perfilData.nome);

  // Dados de exemplo
  const [contatos] = useState([
    { nome: "João", telefone: "11111-1111", relacionamento: "Tio" },
    { nome: "Nicolas", telefone: "22222-2222", relacionamento: "Primo" },
    { nome: "José", telefone: "33333-3333", relacionamento: "Irmão" },
    { nome: "Gustavo", telefone: "44444-4444", relacionamento: "Tio" },
    { nome: "Mariana", telefone: "55555-5555", relacionamento: "Irmã" },
    { nome: "Sophia", telefone: "77777-7777", relacionamento: "Prima" }
  ]);

  const [remedios] = useState([
    { nome: "Losartana", dosagem: "50 mg", frequencia: "Uma vez ao dia" },
    { nome: "Levotiroxina", dosagem: "75 mcg", frequencia: "Uma vez ao dia, em jejum" },
    { nome: "Metformina", dosagem: "850 mg", frequencia: "2 vezes ao dia" },
    { nome: "Sinvastatina", dosagem: "20 mg", frequencia: "Uma vez ao dia, à noite" }
  ]);

  const [alergias] = useState([
    { remedios: "Penicilina", comida: "Leite", material: "Látex", reacao: "Erupção cutânea, dificuldade para respirar" },
    { remedios: "Ibuprofeno", comida: "Amendoim", material: "Níquel", reacao: "Inchaço, coceira, choque anafilático" },
    { remedios: "Aspirina", comida: "Frutos do mar", material: "Poeira", reacao: "Urticária, problemas respiratórios" },
    { remedios: "Dipirona", comida: "Morango", material: "Mofo", reacao: "Náusea, dor abdominal, irritação na pele" },
    { remedios: "Cetirizina", comida: "Ovo", material: "Produtos químicos", reacao: "Espirros, olhos lacrimejando, dermatite" }
  ]);

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
    navigate("/");
  };

  // Salvar nome editado
  const handleNomeChange = (e) => {
    setNomeEditavel(e.target.value);
  };

  const handleNomeBlur = () => {
    setPerfilData({ ...perfilData, nome: nomeEditavel });
  };

  // Fechar modais ao clicar fora
  const handleModalClick = (e, modalSetter) => {
    if (e.target === e.currentTarget) {
      modalSetter(false);
    }
  };

  return (
    <main className="perfil-main">
      <div className="perfil-container">
        
        {/* Botão Voltar - ESTILO DO FORMULARIO */}
        <button 
          onClick={handleVoltar} 
          className="perfil-action-btn perfil-back-btn"
          aria-label="Voltar"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        
        {/* Botão Modo Escuro/Claro - ESTILO DO FORMULARIO */}
        <button 
          onClick={toggleDarkMode} 
          className="perfil-action-btn perfil-theme-btn"
          aria-label="Modo escuro"
        >
          <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
        </button>

        {/* Card de Perfil - Fundo Branco */}
        <div className="perfil-card-container">
          {/* Header do Perfil */}
          <div className="perfil-header">
            <div className="perfil-avatar">
              <div className="avatar-placeholder">
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="avatar-edit">
                <button className="edit-avatar-btn" aria-label="Editar foto">
                  <i className="fas fa-camera"></i>
                </button>
              </div>
            </div>
            <div className="perfil-nome">
              <input 
                type="text" 
                className="nome-input"
                value={nomeEditavel}
                onChange={handleNomeChange}
                onBlur={handleNomeBlur}
                placeholder="Nome e sobrenome"
              />
            </div>
          </div>

          {/* Botões do Perfil */}
          <div className="perfil-botoes">
            <button className="perfil-btn" onClick={() => setShowDadosModal(true)}>
              <i className="fas fa-id-card"></i> Dados
            </button>
            <button className="perfil-btn" onClick={() => setShowContatosModal(true)}>
              <i className="fas fa-phone-alt"></i> Contatos de emergência
            </button>
            <button className="perfil-btn" onClick={() => setShowRemediosModal(true)}>
              <i className="fas fa-pills"></i> Remédios
            </button>
            <button className="perfil-btn" onClick={() => setShowAlergiasModal(true)}>
              <i className="fas fa-allergies"></i> Alergias
            </button>
          </div>
        </div>

        {/* MODAL DADOS */}
        {showDadosModal && (
          <div className="modal-overlay" onClick={(e) => handleModalClick(e, setShowDadosModal)}>
            <div className="modal-container modal-dados">
              <div className="modal-header">
                <h2>Dados Pessoais</h2>
                <button className="modal-close" onClick={() => setShowDadosModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="dados-grid">
                  <div className="dado-item">
                    <span className="dado-label">Nome:</span>
                    <span className="dado-value">{perfilData.nome}</span>
                  </div>
                  <div className="dado-item">
                    <span className="dado-label">CPF:</span>
                    <span className="dado-value">{perfilData.cpf}</span>
                  </div>
                  <div className="dado-item">
                    <span className="dado-label">Data Nasc.:</span>
                    <span className="dado-value">{perfilData.dataNascimento}</span>
                  </div>
                  <div className="dado-item">
                    <span className="dado-label">Sexo:</span>
                    <span className="dado-value">{perfilData.sexo}</span>
                  </div>
                  <div className="dado-item">
                    <span className="dado-label">Altura:</span>
                    <span className="dado-value">{perfilData.altura}m</span>
                  </div>
                  <div className="dado-item">
                    <span className="dado-label">Peso:</span>
                    <span className="dado-value">{perfilData.peso}kg</span>
                  </div>
                  <div className="dado-item">
                    <span className="dado-label">Tipo Sanguíneo:</span>
                    <span className="dado-value">{perfilData.tipoSanguineo}</span>
                  </div>
                  <div className="dado-item">
                    <span className="dado-label">S.U.S:</span>
                    <span className="dado-value">{perfilData.sus}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL CONTATOS */}
        {showContatosModal && (
          <div className="modal-overlay" onClick={(e) => handleModalClick(e, setShowContatosModal)}>
            <div className="modal-container modal-contatos">
              <div className="modal-header">
                <h2>Contatos de Emergência</h2>
                <button className="modal-close" onClick={() => setShowContatosModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <table className="perfil-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Telefone</th>
                      <th>Relacionamento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contatos.map((contato, index) => (
                      <tr key={index}>
                        <td>{contato.nome}</td>
                        <td>{contato.telefone}</td>
                        <td>{contato.relacionamento}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODAL REMÉDIOS */}
        {showRemediosModal && (
          <div className="modal-overlay" onClick={(e) => handleModalClick(e, setShowRemediosModal)}>
            <div className="modal-container modal-remedios">
              <div className="modal-header">
                <h2>Remédios</h2>
                <button className="modal-close" onClick={() => setShowRemediosModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <table className="perfil-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Dosagem</th>
                      <th>Frequência</th>
                    </tr>
                  </thead>
                  <tbody>
                    {remedios.map((remedio, index) => (
                      <tr key={index}>
                        <td>{remedio.nome}</td>
                        <td>{remedio.dosagem}</td>
                        <td>{remedio.frequencia}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODAL ALERGIAS */}
        {showAlergiasModal && (
          <div className="modal-overlay" onClick={(e) => handleModalClick(e, setShowAlergiasModal)}>
            <div className="modal-container modal-alergias">
              <div className="modal-header">
                <h2>Alergias</h2>
                <button className="modal-close" onClick={() => setShowAlergiasModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <table className="perfil-table">
                  <thead>
                    <tr>
                      <th>Remédios</th>
                      <th>Comida</th>
                      <th>Material</th>
                      <th>Reação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alergias.map((alergia, index) => (
                      <tr key={index}>
                        <td>{alergia.remedios}</td>
                        <td>{alergia.comida}</td>
                        <td>{alergia.material}</td>
                        <td>{alergia.reacao}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Perfil;