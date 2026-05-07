// src/components/buscaPerfil/BuscaPerfil.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebaseConfig";
import { db } from "../../services/firebaseConfig";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import "./BuscaPerfil.css";

// Importando as imagens de perfil padrão
import perfil1 from "../../assets/images/imagem-perfil1.jpg";
import perfil2 from "../../assets/images/imagem-perfil2.jpg";
import perfil3 from "../../assets/images/imagem-perfil3.jpg";
import perfil4 from "../../assets/images/imagem-perfil4.jpg";

const defaultAvatars = [perfil1, perfil2, perfil3, perfil4];

function BuscaPerfil() {
  const navigate = useNavigate();
  
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);

  // Função para gerar avatar com base no ID
  const getAvatarImage = (userId, index) => {
    if (userId) {
      const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return defaultAvatars[hash % defaultAvatars.length];
    }
    return defaultAvatars[index % defaultAvatars.length];
  };

  // Buscar papel do usuário e dados do Firebase
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        // 1. Verificar papel do usuário
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        let role = "comum";
        
        if (userDoc.exists()) {
          role = userDoc.data().role || "comum";
          setUserRole(role);
          
          const hasAccess = role === "admin" || role === "saude";
          setHasPermission(hasAccess);
          
          if (!hasAccess) {
            setLoading(false);
            return;
          }
        }

        // 2. Buscar todos os formulários do Firestore
        const formulariosRef = collection(db, "formularios");
        const querySnapshot = await getDocs(formulariosRef);
        
        const patientsList = [];
        let avatarIndex = 0;
        
        for (const docSnapshot of querySnapshot.docs) {
          const data = docSnapshot.data();
          
          // Buscar dados do usuário relacionado
          let userId = data.userId;
          
          // Calcular idade baseado na data de nascimento
          let idade = null;
          if (data.dataNascimento) {
            const nascimento = data.dataNascimento.toDate ? data.dataNascimento.toDate() : new Date(data.dataNascimento);
            const hoje = new Date();
            idade = hoje.getFullYear() - nascimento.getFullYear();
            const mes = hoje.getMonth() - nascimento.getMonth();
            if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
              idade--;
            }
          }
          
          // Calcular IMC
          let imc = null;
          let imcClass = "";
          if (data.altura && data.peso) {
            const alturaNum = parseFloat(data.altura);
            const pesoNum = parseFloat(data.peso);
            if (alturaNum > 0 && pesoNum > 0) {
              imc = (pesoNum / (alturaNum * alturaNum)).toFixed(1);
              if (imc < 18.5) imcClass = "abaixo";
              else if (imc >= 18.5 && imc < 25) imcClass = "normal";
              else if (imc >= 25 && imc < 30) imcClass = "sobrepeso";
              else imcClass = "obesidade";
            }
          }
          
          patientsList.push({
            id: docSnapshot.id,
            userId: userId,
            nome: data.nome || "Não informado",
            cpf: data.cpf || "Não informado",
            idade: idade,
            sexo: data.sexo || "Não informado",
            altura: data.altura || "0",
            peso: data.peso || "0",
            imc: imc,
            imcClass: imcClass,
            tipoSanguineo: data.tipoSanguineo || "Não informado",
            telefoneContato: data.telefoneContato || "Não informado",
            nomeContato: data.nomeContato || "Não informado",
            relacionamento: data.relacionamento || "Não informado",
            medicamento: data.medicamento || "Não informado",
            dosagem: data.dosagem || "Não informado",
            frequencia: data.frequencia || "Não informado",
            observacoes: data.observacoes || "Não informado",
            avatarImage: getAvatarImage(userId, avatarIndex),
            createdAt: data.createdAt
          });
          avatarIndex++;
        }
        
        setPatients(patientsList);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  // Modo escuro
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

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Abrir página de visualização do paciente (para profissionais de saúde)
  const openUserProfile = (userId) => {
    if (userId) {
      navigate(`/visualizar-paciente/${userId}`);
    } else {
      console.error("Usuário sem ID");
    }
  };

  // Filtrar pacientes
  const filteredPatients = useMemo(() => {
    if (!searchTerm.trim()) {
      return patients;
    }
    
    const term = searchTerm.toLowerCase().trim();
    return patients.filter(patient => 
      patient.nome.toLowerCase().includes(term) || 
      (patient.idade && patient.idade.toString().includes(term))
    );
  }, [patients, searchTerm]);

  const resultCount = filteredPatients.length;

  // Tela de carregamento
  if (loading) {
    return (
      <main className="busca-main" role="main">
        <div className="busca-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="text-white mt-3">Carregando pacientes...</p>
          </div>
        </div>
      </main>
    );
  }

  // Verificar permissão
  if (!hasPermission) {
    return (
      <main className="busca-main" role="main">
        <div className="busca-container">
          <button 
            onClick={handleVoltar} 
            className="busca-action-btn busca-back-btn"
            aria-label="Voltar"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          
          <button 
            onClick={toggleDarkMode} 
            className="busca-action-btn busca-theme-btn"
            aria-label="Modo escuro"
          >
            <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
          </button>

          <div className="no-results" style={{ marginTop: "100px" }}>
            <div className="no-results-icon">
              <i className="fas fa-ban"></i>
            </div>
            <h3>Acesso Negado</h3>
            <p>Você não tem permissão para acessar esta página.</p>
            <p className="text-muted">Apenas profissionais da saúde e administradores podem buscar perfis.</p>
            <button className="no-results-btn" onClick={handleVoltar}>
              Voltar para Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="busca-main" role="main">
      <div className="busca-container">
        
        <button 
          onClick={handleVoltar} 
          className="busca-action-btn busca-back-btn"
          aria-label="Voltar"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        
        <button 
          onClick={toggleDarkMode} 
          className="busca-action-btn busca-theme-btn"
          aria-label="Modo escuro"
        >
          <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
        </button>

        <section className="filter-section" role="region" aria-label="Busca de pacientes">
          <div className="filter-header">
            <h2 className="filter-title">BUSCAR PACIENTES</h2>
            <p className="filter-subtitle">Encontre rapidamente o perfil do paciente</p>
          </div>
          
          <div className="filter-wrapper">
            <div className="filter-box">
              <i className="fas fa-search filter-icon"></i>
              <input 
                type="text" 
                className="filter-input"
                placeholder="Digite o nome do paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Filtrar por nome do paciente"
              />
              {searchTerm && (
                <button 
                  className="filter-clear"
                  onClick={handleClearSearch}
                  aria-label="Limpar busca"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            
            <div className="filter-stats">
              <span className="result-count">
                {resultCount} {resultCount === 1 ? 'paciente encontrado' : 'pacientes encontrados'}
              </span>
            </div>
          </div>
        </section>

        <section className="cards-section" role="region" aria-label="Lista de pacientes">
          <div className="cards-grid">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient, index) => (
                <article 
                  key={patient.id}
                  className="patient-card" 
                  tabIndex={0} 
                  onClick={() => openUserProfile(patient.userId)}
                  onKeyPress={(e) => e.key === "Enter" && openUserProfile(patient.userId)}
                  role="button"
                  aria-label={`Perfil de ${patient.nome}`} 
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="card-banner"></div>
                  <div className="card-avatar">
                    <img 
                      src={patient.avatarImage} 
                      alt={`Foto de ${patient.nome}`} 
                      className="avatar-img"
                    />
                  </div>
                  <div className="card-body">
                    <h3 className="patient-name">
                      {patient.nome}
                      {patient.idade && (
                        <span className="patient-age">{patient.idade} anos</span>
                      )}
                    </h3>
                    <div className="patient-stats">
                      <div className="stat-item">
                        <span className="stat-value">{patient.altura}m</span>
                        <span className="stat-label">Altura</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">{patient.peso}kg</span>
                        <span className="stat-label">Peso</span>
                      </div>
                      <div className="stat-item">
                        <span className={`stat-value imc-${patient.imcClass}`}>
                          {patient.imc || '?'}
                        </span>
                        <span className="stat-label">IMC</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="no-results">
                <div className="no-results-icon">
                  <i className="fas fa-user-slash"></i>
                </div>
                <h3>Nenhum paciente encontrado</h3>
                <p>Tente buscar por outro nome</p>
                <button className="no-results-btn" onClick={handleClearSearch}>
                  Limpar busca
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* VLibras */}
      <div vw className="enabled">
        <div vw-access-button className="active"></div>
        <div vw-plugin-wrapper>
          <div className="vw-plugin-top-wrapper"></div>
        </div>
      </div>
    </main>
  );
}

export default BuscaPerfil;