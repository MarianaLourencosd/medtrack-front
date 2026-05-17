// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./perfil.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../../utils/daltonismo.css";
// import { db, auth } from "../../services/firebaseConfig";
// import { collection, getDocs, query, where } from "firebase/firestore";

// function Perfil() {
//   const navigate = useNavigate();
  
//   // Estado para dark mode
//   const [darkMode, setDarkMode] = useState(false);
  
//   // Estado para modais
//   const [showDadosModal, setShowDadosModal] = useState(false);
//   const [showContatosModal, setShowContatosModal] = useState(false);
//   const [showRemediosModal, setShowRemediosModal] = useState(false);
//   const [showAlergiasModal, setShowAlergiasModal] = useState(false);
  
//   // Estado para dados do perfil
//   const [perfilData, setPerfilData] = useState({
//     nome: "João da Silva",
//     cpf: "123.456.789-00",
//     dataNascimento: "15/03/1990",
//     peso: "70",
//     sexo: "Masculino",
//     altura: "1.75",
//     tipoSanguineo: "O+",
//     sus: "012.3456.7898.7654"
//   });

//   // Estado para nome editável
//   const [nomeEditavel, setNomeEditavel] = useState(perfilData.nome);

//   // Dados de exemplo
//   const [contatos, setContatos] = useState([]);
//   const [remedios, setRemedios] = useState([]);
//   const [alergias, setAlergias] = useState([]);

//   // Verificar preferência de modo escuro
//   useEffect(() => {
//     const savedMode = localStorage.getItem("darkMode");
//     if (savedMode === "enabled") {
//       setDarkMode(true);
//       document.body.classList.add("dark-mode");
//     }
//   }, []);

//   // Alternar modo escuro
//   const toggleDarkMode = () => {
//     const newDarkMode = !darkMode;
//     setDarkMode(newDarkMode);
//     if (newDarkMode) {
//       document.body.classList.add("dark-mode");
//       localStorage.setItem("darkMode", "enabled");
//     } else {
//       document.body.classList.remove("dark-mode");
//       localStorage.setItem("darkMode", "disabled");
//     }
//   };

//   // Voltar para home
//   const handleVoltar = () => {
//     navigate("/");
//   };

//   // Salvar nome editado
//   const handleNomeChange = (e) => {
//     setNomeEditavel(e.target.value);
//   };

//   const handleNomeBlur = () => {
//     setPerfilData({ ...perfilData, nome: nomeEditavel });
//   };

//   // Fechar modais ao clicar fora
//   const handleModalClick = (e, modalSetter) => {
//     if (e.target === e.currentTarget) {
//       modalSetter(false);
//     }
//   };

//   return (
//     <main className="perfil-main">
//       <div className="perfil-container">
        
//         <button 
//           onClick={handleVoltar} 
//           className="perfil-action-btn perfil-back-btn"
//           aria-label="Voltar"
//         >
//           <i className="fa-solid fa-arrow-left"></i>
//         </button>
        
//         <button 
//           onClick={toggleDarkMode} 
//           className="perfil-action-btn perfil-theme-btn"
//           aria-label="Modo escuro"
//         >
//           <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
//         </button>

//         <div className="perfil-card-container">

//           <div className="perfil-header">
//             <div className="perfil-avatar">
//               <div className="avatar-placeholder">
//                 <i className="fas fa-user-circle"></i>
//               </div>
//               <div className="avatar-edit">
//                 <button className="edit-avatar-btn" aria-label="Editar foto">
//                   <i className="fas fa-camera"></i>
//                 </button>
//               </div>
//             </div>
//             <div className="perfil-nome">
//               <input 
//                 type="text" 
//                 className="nome-input"
//                 value={nomeEditavel}
//                 onChange={handleNomeChange}
//                 onBlur={handleNomeBlur}
//                 placeholder="Nome e sobrenome"
//               />
//             </div>
//           </div>

//           <div className="perfil-botoes">
//             <button className="perfil-btn" onClick={() => setShowDadosModal(true)}>
//               <i className="fas fa-id-card"></i> Dados
//             </button>
//             <button className="perfil-btn" onClick={() => setShowContatosModal(true)}>
//               <i className="fas fa-phone-alt"></i> Contatos de emergência
//             </button>
//             <button className="perfil-btn" onClick={() => setShowRemediosModal(true)}>
//               <i className="fas fa-pills"></i> Remédios
//             </button>
//             <button className="perfil-btn" onClick={() => setShowAlergiasModal(true)}>
//               <i className="fas fa-allergies"></i> Alergias
//             </button>
//           </div>
//         </div>

//         {showDadosModal && (
//           <div className="modal-overlay" onClick={(e) => handleModalClick(e, setShowDadosModal)}>
//             <div className="modal-container modal-dados">
//               <div className="modal-header">
//                 <h2>Dados Pessoais</h2>
//                 <button className="modal-close" onClick={() => setShowDadosModal(false)}>
//                   <i className="fas fa-times"></i>
//                 </button>
//               </div>
//               <div className="modal-body">
//                 <div className="dados-grid">
//                   <div className="dado-item">
//                     <span className="dado-label">Nome:</span>
//                     <span className="dado-value">{perfilData.nome}</span>
//                   </div>
//                   <div className="dado-item">
//                     <span className="dado-label">CPF:</span>
//                     <span className="dado-value">{perfilData.cpf}</span>
//                   </div>
//                   <div className="dado-item">
//                     <span className="dado-label">Data Nasc.:</span>
//                     <span className="dado-value">{perfilData.dataNascimento}</span>
//                   </div>
//                   <div className="dado-item">
//                     <span className="dado-label">Sexo:</span>
//                     <span className="dado-value">{perfilData.sexo}</span>
//                   </div>
//                   <div className="dado-item">
//                     <span className="dado-label">Altura:</span>
//                     <span className="dado-value">{perfilData.altura}m</span>
//                   </div>
//                   <div className="dado-item">
//                     <span className="dado-label">Peso:</span>
//                     <span className="dado-value">{perfilData.peso}kg</span>
//                   </div>
//                   <div className="dado-item">
//                     <span className="dado-label">Tipo Sanguíneo:</span>
//                     <span className="dado-value">{perfilData.tipoSanguineo}</span>
//                   </div>
//                   <div className="dado-item">
//                     <span className="dado-label">S.U.S:</span>
//                     <span className="dado-value">{perfilData.sus}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {showContatosModal && (
//           <div className="modal-overlay" onClick={(e) => handleModalClick(e, setShowContatosModal)}>
//             <div className="modal-container modal-contatos">
//               <div className="modal-header">
//                 <h2>Contatos de Emergência</h2>
//                 <button className="modal-close" onClick={() => setShowContatosModal(false)}>
//                   <i className="fas fa-times"></i>
//                 </button>
//               </div>
//               <div className="modal-body">
//                 <table className="perfil-table">
//                   <thead>
//                     <tr>
//                       <th>Nome</th>
//                       <th>Telefone</th>
//                       <th>Relacionamento</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {contatos.map((contato, index) => (
//                       <tr key={index}>
//                         <td>{contato.nome}</td>
//                         <td>{contato.telefone}</td>
//                         <td>{contato.relacionamento}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}

//         {showRemediosModal && (
//           <div className="modal-overlay" onClick={(e) => handleModalClick(e, setShowRemediosModal)}>
//             <div className="modal-container modal-remedios">
//               <div className="modal-header">
//                 <h2>Remédios</h2>
//                 <button className="modal-close" onClick={() => setShowRemediosModal(false)}>
//                   <i className="fas fa-times"></i>
//                 </button>
//               </div>
//               <div className="modal-body">
//                 <table className="perfil-table">
//                   <thead>
//                     <tr>
//                       <th>Nome</th>
//                       <th>Dosagem</th>
//                       <th>Frequência</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {remedios.map((remedio, index) => (
//                       <tr key={index}>
//                         <td>{remedio.nome}</td>
//                         <td>{remedio.dosagem}</td>
//                         <td>{remedio.frequencia}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}

//
//         {showAlergiasModal && (
//           <div className="modal-overlay" onClick={(e) => handleModalClick(e, setShowAlergiasModal)}>
//             <div className="modal-container modal-alergias">
//               <div className="modal-header">
//                 <h2>Alergias</h2>
//                 <button className="modal-close" onClick={() => setShowAlergiasModal(false)}>
//                   <i className="fas fa-times"></i>
//                 </button>
//               </div>
//               <div className="modal-body">
//                 <table className="perfil-table">
//                   <thead>
//                     <tr>
//                       <th>Remédios</th>
//                       <th>Comida</th>
//                       <th>Material</th>
//                       <th>Reação</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {alergias.map((alergia, index) => (
//                       <tr key={index}>
//                         <td>{alergia.remedios}</td>
//                         <td>{alergia.comida}</td>
//                         <td>{alergia.material}</td>
//                         <td>{alergia.reacao}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Perfil.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../utils/daltonismo.css";

import { db, auth } from "../../services/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function Perfil() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState(null);

  const [showDadosModal, setShowDadosModal] = useState(false);
  const [showContatosModal, setShowContatosModal] = useState(false);
  const [showRemediosModal, setShowRemediosModal] = useState(false);

  const [perfilData, setPerfilData] = useState({});
  const [nomeEditavel, setNomeEditavel] = useState("");

  const [contatos, setContatos] = useState([]);
  const [remedios, setRemedios] = useState([]);

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

  const handleNomeChange = (e) => {
    setNomeEditavel(e.target.value);
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

  const handleNomeBlur = () => {
    setPerfilData({ ...perfilData, nome: nomeEditavel });
  };

  const handleModalClick = (e, setter) => {
    if (e.target === e.currentTarget) {
      setter(false);
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

      console.log("RESULTADO:", querySnapshot.size);

      if (!querySnapshot.empty) {
        const docData =
          querySnapshot.docs[querySnapshot.docs.length - 1].data();

        console.log("DADOS:", docData);

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

        setNomeEditavel(docData.nome);

        if (Array.isArray(docData.contatos) && docData.contatos.length > 0) {
          setContatos(docData.contatos.map((c) => ({
            nome: c.nomeContato || "",
            telefone: c.telefoneContato || "",
            relacionamento: c.relacionamento || "",
          })));
        } else if (docData.nomeContato) {
          setContatos([{
            nome: docData.nomeContato,
            telefone: docData.telefoneContato,
            relacionamento: docData.relacionamento,
          }]);
        }

        if (Array.isArray(docData.medicamentos) && docData.medicamentos.length > 0) {
          setRemedios(docData.medicamentos.map((m) => ({
            nome: m.medicamento || "",
            dosagem: m.dosagem || "",
            frequencia: m.frequencia || "",
          })));
        } else if (docData.medicamento) {
          setRemedios([{
            nome: docData.medicamento,
            dosagem: docData.dosagem,
            frequencia: docData.frequencia,
          }]);
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
                  title="Clique para adicionar ou alterar foto"
                >
                  <i className="fas fa-camera"></i>
                </button>
              </div>
              
              <input
                id="foto-input"
                type="file"
                accept="image/*"
                onChange={handleFotoUpload}
              />
            </div>

            <div className="perfil-nome">
              <input
                type="text"
                className="nome-input"
                value={nomeEditavel}
                onChange={handleNomeChange}
                onBlur={handleNomeBlur}
                placeholder="Nome do paciente"
              />

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
                    <span>{perfilData.dataNascimento}</span>
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
            <button
              className="perfil-btn"
              onClick={() => setShowDadosModal(true)}
              title="Ver todos os dados pessoais"
            >
              <i className="fas fa-id-card"></i>
              Dados Completos
            </button>
            <button
              className="perfil-btn"
              onClick={() => setShowContatosModal(true)}
              title="Ver contatos de emergência"
            >
              <i className="fas fa-phone-alt"></i>
              Contatos
            </button>
            <button
              className="perfil-btn"
              onClick={() => setShowRemediosModal(true)}
              title="Ver medicamentos"
            >
              <i className="fas fa-pills"></i>
              Medicamentos
            </button>
          </div>
        </div>

        {showDadosModal && (
          <div
            className="modal-overlay"
            onClick={(e) => handleModalClick(e, setShowDadosModal)}
          >
            <div className="modal-container modal-dados">
              <div className="modal-header">
                <h2>
                  <i className="fas fa-id-card"></i> Dados Pessoais Completos
                </h2>
                <button
                  className="modal-close"
                  onClick={() => setShowDadosModal(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="dados-grid">
                  {perfilData.nome && (
                    <div className="dado-item">
                      <span className="dado-label">Nome Completo</span>
                      <span className="dado-value">{perfilData.nome}</span>
                    </div>
                  )}
                  {perfilData.cpf && (
                    <div className="dado-item">
                      <span className="dado-label">CPF</span>
                      <span className="dado-value">{perfilData.cpf}</span>
                    </div>
                  )}
                  {perfilData.dataNascimento && (
                    <div className="dado-item">
                      <span className="dado-label">Data de Nascimento</span>
                      <span className="dado-value">{perfilData.dataNascimento}</span>
                    </div>
                  )}
                  {perfilData.sexo && (
                    <div className="dado-item">
                      <span className="dado-label">Sexo</span>
                      <span className="dado-value">{perfilData.sexo}</span>
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
                  {perfilData.tipoSanguineo && (
                    <div className="dado-item">
                      <span className="dado-label">Tipo Sanguíneo</span>
                      <span className="dado-value">{perfilData.tipoSanguineo}</span>
                    </div>
                  )}
                  {perfilData.sus && (
                    <div className="dado-item">
                      <span className="dado-label">Cartão SUS</span>
                      <span className="dado-value">{perfilData.sus}</span>
                    </div>
                  )}
                </div>
                {perfilData.observacoes && (
                  <div style={{ marginTop: "1.5rem" }}>
                    <h4 style={{ color: "var(--cor-primaria)", marginBottom: "1rem" }}>
                      Observações
                    </h4>
                    <p style={{ color: "var(--cor-texto)", lineHeight: "1.6" }}>
                      {perfilData.observacoes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showContatosModal && (
          <div
            className="modal-overlay"
            onClick={(e) => handleModalClick(e, setShowContatosModal)}
          >
            <div className="modal-container modal-contatos">
              <div className="modal-header">
                <h2>
                  <i className="fas fa-phone-alt"></i> Contatos de Emergência
                </h2>
                <button
                  className="modal-close"
                  onClick={() => setShowContatosModal(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                {contatos.length > 0 ? (
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
                ) : (
                  <p style={{ textAlign: "center", color: "var(--cor-cinza)" }}>
                    Nenhum contato de emergência registrado
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {showRemediosModal && (
          <div
            className="modal-overlay"
            onClick={(e) => handleModalClick(e, setShowRemediosModal)}
          >
            <div className="modal-container modal-remedios">
              <div className="modal-header">
                <h2>
                  <i className="fas fa-pills"></i> Medicamentos
                </h2>
                <button
                  className="modal-close"
                  onClick={() => setShowRemediosModal(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                {remedios.length > 0 ? (
                  <table className="perfil-table">
                    <thead>
                      <tr>
                        <th>Medicamento</th>
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
                ) : (
                  <p style={{ textAlign: "center", color: "var(--cor-cinza)" }}>
                    Nenhum medicamento registrado
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Perfil;