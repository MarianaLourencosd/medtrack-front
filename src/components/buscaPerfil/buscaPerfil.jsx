import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./buscaPerfil.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../utils/daltonismo.css";

// Imagens dos perfis
import perfil1 from "../../assets/images/imagem-perfil1.jpg";
import perfil2 from "../../assets/images/imagem-perfil2.jpg";
import perfil3 from "../../assets/images/imagem-perfil3.jpg";
import perfil4 from "../../assets/images/imagem-perfil4.jpg";

function BuscaPerfil() {
  const navigate = useNavigate();
  
  // Estado para dark mode
  const [darkMode, setDarkMode] = useState(false);
  
  // Estado para busca
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dados dos pacientes
  const patients = useMemo(() => [
    {
      id: 1,
      nome: "Lucas Fernandes",
      idade: 23,
      cidade: "Matão",
      altura: "1.78",
      peso: "72",
      imc: "22.7",
      imagem: perfil1,
      alt: "Foto de perfil de Lucas Fernandes, 23 anos"
    },
    {
      id: 2,
      nome: "Camila Sato",
      idade: 29,
      cidade: "Matão",
      altura: "1.65",
      peso: "58",
      imc: "21.3",
      imagem: perfil2,
      alt: "Foto de perfil de Camila Sato, 29 anos"
    },
    {
      id: 3,
      nome: "Antônio Ribeiro",
      idade: 70,
      cidade: "Matão",
      altura: "1.72",
      peso: "75",
      imc: "25.3",
      imagem: perfil3,
      alt: "Foto de perfil de Antônio Ribeiro, 70 anos"
    },
    {
      id: 4,
      nome: "Júlia Martins",
      idade: 26,
      cidade: "Matão",
      altura: "1.63",
      peso: "60",
      imc: "22.6",
      imagem: perfil4,
      alt: "Foto de perfil de Júlia Martins, 26 anos"
    }
  ], []);

  // Filtro em tempo real - MELHORADO
  const filteredPatients = useMemo(() => {
    if (!searchTerm.trim()) {
      return patients;
    }
    
    const term = searchTerm.toLowerCase().trim();
    return patients.filter(patient => 
      patient.nome.toLowerCase().includes(term) || 
      patient.idade.toString().includes(term) ||
      patient.cidade.toLowerCase().includes(term)
    );
  }, [patients, searchTerm]);

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

  // Limpar busca
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Abrir perfil do paciente
  const openPatientProfile = (patientId) => {
    navigate(`/perfil?id=${patientId}`);
  };

  // Contador de resultados
  const resultCount = filteredPatients.length;

  return (
    <main className="busca-main" role="main">
      <div className="busca-container">
        
        {/* Botão Voltar */}
        <button 
          onClick={handleVoltar} 
          className="busca-action-btn busca-back-btn"
          aria-label="Voltar"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        
        {/* Botão Modo Escuro/Claro */}
        <button 
          onClick={toggleDarkMode} 
          className="busca-action-btn busca-theme-btn"
          aria-label="Modo escuro"
        >
          <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
        </button>

        {/* Seção de Filtro/Busca */}
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
                placeholder="Digite nome, idade ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Filtrar por nome, idade ou cidade do paciente"
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

        {/* Cards dos Pacientes */}
        <section className="cards-section" role="region" aria-label="Lista de pacientes">
          <div className="cards-grid">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <article 
                  key={patient.id}
                  className="patient-card" 
                  tabIndex={0} 
                  onClick={() => openPatientProfile(patient.id)}
                  onKeyPress={(e) => e.key === "Enter" && openPatientProfile(patient.id)}
                  role="button"
                  aria-label={`Perfil de ${patient.nome}, ${patient.idade} anos`} 
                >
                  <div className="card-banner"></div>
                  <div className="card-avatar">
                    <img 
                      src={patient.imagem} 
                      alt={patient.alt} 
                      className="avatar-img"
                    />
                  </div>
                  <div className="card-body">
                    <h3 className="patient-name">
                      {patient.nome}
                      <span className="patient-age">{patient.idade} anos</span>
                    </h3>
                    <p className="patient-city">
                      <i className="fas fa-map-marker-alt"></i> {patient.cidade}
                    </p>
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
                        <span className="stat-value">{patient.imc}</span>
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
                <p>Tente buscar por outro nome, idade ou cidade</p>
                <button className="no-results-btn" onClick={handleClearSearch}>
                  Limpar busca
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Seção do VLibras */}
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