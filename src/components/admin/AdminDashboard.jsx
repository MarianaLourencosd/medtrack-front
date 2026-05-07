import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebaseConfig";
import { doc, getDoc, collection, getDocs, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSaude: 0,
    totalAdmin: 0,
    totalComum: 0
  });
  
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState("");
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    cidade: "",
    role: ""
  });
  const [savingUser, setSavingUser] = useState(false);
  
  // Estado para modal de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [deletingUserLoading, setDeletingUserLoading] = useState(false);

  // Buscar dados do admin
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "usuarios", user.uid));
          if (userDoc.exists()) {
            setAdminName(userDoc.data().nome);
            setAdminEmail(userDoc.data().email);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar admin:", error);
      }
    };
    
    fetchAdminData();
  }, []);

  // Buscar estatísticas e usuários
  const fetchStatsAndUsers = async () => {
    setLoadingUsers(true);
    setError("");
    try {
      const usuariosRef = collection(db, "usuarios");
      const q = query(usuariosRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      let totalUsers = 0;
      let totalSaude = 0;
      let totalAdmin = 0;
      let totalComum = 0;
      const usersList = [];
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        totalUsers++;
        
        switch(userData.role) {
          case "admin":
            totalAdmin++;
            break;
          case "saude":
            totalSaude++;
            break;
          default:
            totalComum++;
        }
        
        // Adicionar à lista de usuários
        usersList.push({
          id: doc.id,
          nome: userData.nome || "Não informado",
          email: userData.email || "Não informado",
          cpf: userData.cpf || "Não informado",
          role: userData.role || "comum",
          createdAt: userData.createdAt,
          cidade: userData.cidade || "Não informada"
        });
      });
      
      setStats({
        totalUsers,
        totalSaude,
        totalAdmin,
        totalComum
      });
      
      setUsers(usersList);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setError("Erro ao carregar usuários. Tente novamente.");
    } finally {
      setLoadingUsers(false);
    }
  };

  // Carregar dados quando a aba mudar
  useEffect(() => {
    if (activeTab === "users" || activeTab === "dashboard") {
      fetchStatsAndUsers();
    }
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
      alert("Erro ao fazer logout");
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  // Formatar data
  const formatarData = (data) => {
    if (!data) return "Não informada";
    if (data.toDate) {
      return data.toDate().toLocaleDateString("pt-BR");
    }
    if (data?.seconds) {
      return new Date(data.seconds * 1000).toLocaleDateString("pt-BR");
    }
    return "Não informada";
  };

  // Função para abrir modal de edição
  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setEditFormData({
      nome: user.nome !== "Não informado" ? user.nome : "",
      email: user.email !== "Não informado" ? user.email : "",
      cpf: user.cpf !== "Não informado" ? user.cpf : "",
      cidade: user.cidade !== "Não informada" ? user.cidade : "",
      role: user.role
    });
    setShowEditModal(true);
  };

  // Função para fechar modal de edição
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditFormData({
      nome: "",
      email: "",
      cpf: "",
      cidade: "",
      role: ""
    });
  };

  // Função para lidar com mudanças no formulário de edição
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para salvar edição do usuário
  const handleSaveEdit = async () => {
    if (!editingUser) return;
    
    // Validação básica
    if (!editFormData.nome.trim()) {
      alert("O nome é obrigatório");
      return;
    }
    if (!editFormData.email.trim()) {
      alert("O email é obrigatório");
      return;
    }
    
    setSavingUser(true);
    try {
      const userRef = doc(db, "usuarios", editingUser.id);
      await updateDoc(userRef, {
        nome: editFormData.nome,
        email: editFormData.email,
        cpf: editFormData.cpf || "",
        cidade: editFormData.cidade || "",
        role: editFormData.role,
        updatedAt: new Date()
      });
      
      // Recarregar dados
      await fetchStatsAndUsers();
      
      alert("Usuário atualizado com sucesso!");
      handleCloseEditModal();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      alert("Erro ao atualizar usuário: " + error.message);
    } finally {
      setSavingUser(false);
    }
  };

  // Função para abrir modal de exclusão
  const handleOpenDeleteModal = (user) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  // Função para fechar modal de exclusão
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingUser(null);
  };

  // Função para excluir usuário
  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    
    // Verificar se não está tentando excluir a si mesmo
    if (deletingUser.id === auth.currentUser?.uid) {
      alert("Você não pode excluir seu próprio usuário!");
      handleCloseDeleteModal();
      return;
    }
    
    setDeletingUserLoading(true);
    try {
      // Excluir do Firestore
      const userRef = doc(db, "usuarios", deletingUser.id);
      await deleteDoc(userRef);
      
      // Recarregar dados
      await fetchStatsAndUsers();
      
      alert("Usuário excluído com sucesso!");
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      alert("Erro ao excluir usuário: " + error.message);
    } finally {
      setDeletingUserLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header Superior */}
      <header className="admin-header">
        <div className="header-left">
          <button className="back-home-btn" onClick={handleBackToHome}>
            <i className="fas fa-arrow-left"></i>
            <span>Voltar para Home</span>
          </button>
          <div className="logo-area">
            <i className="fas fa-heartbeat"></i>
            <span>MedTrack Admin</span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="admin-info">
            <div className="admin-avatar">
              <i className="fas fa-user-shield"></i>
            </div>
            <div className="admin-details">
              <span className="admin-name">{adminName || "Administrador"}</span>
              <span className="admin-email">{adminEmail}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Sair</span>
          </button>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-menu">
            <button
              className={`menu-item ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
              {activeTab === "dashboard" && <span className="active-indicator"></span>}
            </button>
            
            <button
              className={`menu-item ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              <i className="fas fa-users"></i>
              <span>Usuários</span>
              {activeTab === "users" && <span className="active-indicator"></span>}
            </button>
            
            <button
              className={`menu-item ${activeTab === "stats" ? "active" : ""}`}
              onClick={() => setActiveTab("stats")}
            >
              <i className="fas fa-chart-line"></i>
              <span>Estatísticas</span>
              {activeTab === "stats" && <span className="active-indicator"></span>}
            </button>
            
            <button
              className={`menu-item ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <i className="fas fa-cog"></i>
              <span>Configurações</span>
              {activeTab === "settings" && <span className="active-indicator"></span>}
            </button>
          </div>
          
          <div className="sidebar-footer">
            <div className="system-version">
              <i className="fas fa-code-branch"></i>
              <span>Versão 2.0.0</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {/* Dashboard Principal */}
          {activeTab === "dashboard" && (
            <div className="dashboard-content">
              <div className="welcome-section">
                <h1>
                  <i className="fas fa-hand-wave"></i>
                  Olá, {adminName || "Administrador"}!
                </h1>
                <p>Bem-vindo ao painel de controle do MedTrack</p>
              </div>

              {/* Cards de Estatísticas */}
              <div className="stats-grid">
                <div className="stat-card primary">
                  <div className="stat-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stat-info">
                    <h3>Total de Usuários</h3>
                    <p className="stat-number">{stats.totalUsers}</p>
                    <span className="stat-label">Usuários cadastrados</span>
                  </div>
                </div>
                
                <div className="stat-card success">
                  <div className="stat-icon">
                    <i className="fas fa-user-md"></i>
                  </div>
                  <div className="stat-info">
                    <h3>Profissionais Saúde</h3>
                    <p className="stat-number">{stats.totalSaude}</p>
                    <span className="stat-label">Com papel "saude"</span>
                  </div>
                </div>
                
                <div className="stat-card warning">
                  <div className="stat-icon">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <div className="stat-info">
                    <h3>Administradores</h3>
                    <p className="stat-number">{stats.totalAdmin}</p>
                    <span className="stat-label">Com papel "admin"</span>
                  </div>
                </div>
                
                <div className="stat-card info">
                  <div className="stat-icon">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="stat-info">
                    <h3>Usuários Comuns</h3>
                    <p className="stat-number">{stats.totalComum}</p>
                    <span className="stat-label">Com papel "comum"</span>
                  </div>
                </div>
              </div>

              {/* Informações do Sistema */}
              <div className="system-info">
                <div className="info-card">
                  <h3>
                    <i className="fas fa-info-circle"></i>
                    Sobre o Sistema
                  </h3>
                  <p>MedTrack é uma plataforma de gestão de saúde que conecta pacientes e profissionais da saúde.</p>
                  <div className="info-details">
                    <div className="detail-item">
                      <strong>Versão:</strong> 2.0.0
                    </div>
                    <div className="detail-item">
                      <strong>Status:</strong> <span className="status-active">Ativo</span>
                    </div>
                    <div className="detail-item">
                      <strong>Última atualização:</strong> {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Usuários */}
          {activeTab === "users" && (
            <div className="users-content">
              <div className="content-header">
                <h2>
                  <i className="fas fa-users"></i>
                  Gerenciamento de Usuários
                </h2>
                <p>Visualize, edite ou exclua usuários cadastrados no sistema</p>
              </div>
              
              <div className="users-table-container">
                <div className="table-responsive">
                  {loadingUsers ? (
                    <div className="loading-spinner">
                      <i className="fas fa-spinner fa-spin"></i>
                      <p>Carregando usuários...</p>
                    </div>
                  ) : error ? (
                    <div className="error-message">
                      <i className="fas fa-exclamation-triangle"></i>
                      <p>{error}</p>
                      <button onClick={fetchStatsAndUsers} className="retry-btn">
                        <i className="fas fa-redo"></i>
                        Tentar novamente
                      </button>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="no-users">
                      <i className="fas fa-users-slash"></i>
                      <p>Nenhum usuário encontrado</p>
                    </div>
                  ) : (
                    <table className="users-table">
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Email</th>
                          <th>CPF</th>
                          <th>Cidade</th>
                          <th>Papel</th>
                          <th>Data Cadastro</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td>{user.nome}</td>
                            <td>{user.email}</td>
                            <td>{user.cpf}</td>
                            <td>{user.cidade}</td>
                            <td>
                              <span className={`role-badge ${user.role}`}>
                                {user.role === "admin" ? "Administrador" : 
                                 user.role === "saude" ? "Profissional Saúde" : "Usuário Comum"}
                              </span>
                            </td>
                            <td>{formatarData(user.createdAt)}</td>
                            <td className="actions-cell">
                              <button 
                                className="edit-user-btn"
                                onClick={() => handleOpenEditModal(user)}
                                title="Editar usuário"
                              >
                                <i className="fas fa-edit"></i>
                                Editar
                              </button>
                              <button 
                                className="delete-user-btn"
                                onClick={() => handleOpenDeleteModal(user)}
                                title="Excluir usuário"
                                disabled={user.id === auth.currentUser?.uid}
                              >
                                <i className="fas fa-trash-alt"></i>
                                Excluir
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Estatísticas Detalhadas */}
          {activeTab === "stats" && (
            <div className="stats-content">
              <div className="content-header">
                <h2>
                  <i className="fas fa-chart-line"></i>
                  Estatísticas do Sistema
                </h2>
                <p>Análise detalhada da plataforma</p>
              </div>
              
              <div className="stats-detailed">
                <div className="stat-box">
                  <div className="stat-box-header">
                    <i className="fas fa-chart-pie"></i>
                    <h3>Distribuição de Papéis</h3>
                  </div>
                  <div className="stat-box-content">
                    <div className="percentage-bar">
                      <div className="bar-label">
                        <span>Administradores</span>
                        <span>{stats.totalAdmin}</span>
                      </div>
                      <div className="bar">
                        <div className="bar-fill admin" style={{ width: `${stats.totalUsers > 0 ? (stats.totalAdmin / stats.totalUsers) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                    <div className="percentage-bar">
                      <div className="bar-label">
                        <span>Profissionais Saúde</span>
                        <span>{stats.totalSaude}</span>
                      </div>
                      <div className="bar">
                        <div className="bar-fill saude" style={{ width: `${stats.totalUsers > 0 ? (stats.totalSaude / stats.totalUsers) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                    <div className="percentage-bar">
                      <div className="bar-label">
                        <span>Usuários Comuns</span>
                        <span>{stats.totalComum}</span>
                      </div>
                      <div className="bar">
                        <div className="bar-fill comum" style={{ width: `${stats.totalUsers > 0 ? (stats.totalComum / stats.totalUsers) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Configurações */}
          {activeTab === "settings" && (
            <div className="settings-content">
              <div className="content-header">
                <h2>
                  <i className="fas fa-cog"></i>
                  Configurações do Sistema
                </h2>
                <p>Personalize as preferências do sistema</p>
              </div>
              
              <div className="settings-card">
                <div className="setting-group">
                  <label className="setting-label">
                    <i className="fas fa-palette"></i>
                    Tema do Sistema
                  </label>
                  <select className="setting-select">
                    <option>Claro</option>
                    <option>Escuro</option>
                    <option>Sistema</option>
                  </select>
                </div>
                
                <div className="setting-group">
                  <label className="setting-label">
                    <i className="fas fa-bell"></i>
                    Notificações
                  </label>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="setting-group">
                  <label className="setting-label">
                    <i className="fas fa-language"></i>
                    Idioma
                  </label>
                  <select className="setting-select">
                    <option>Português</option>
                    <option>Inglês</option>
                    <option>Espanhol</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal de Edição de Usuário */}
      {showEditModal && editingUser && (
        <div className="modal-overlay" onClick={handleCloseEditModal}>
          <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <i className="fas fa-user-edit"></i>
              <h3>Editar Usuário</h3>
              <button className="modal-close" onClick={handleCloseEditModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form className="edit-user-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label htmlFor="nome">
                    <i className="fas fa-user"></i>
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={editFormData.nome}
                    onChange={handleEditInputChange}
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <i className="fas fa-envelope"></i>
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditInputChange}
                    placeholder="Digite o email"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cpf">
                      <i className="fas fa-id-card"></i>
                      CPF
                    </label>
                    <input
                      type="text"
                      id="cpf"
                      name="cpf"
                      value={editFormData.cpf}
                      onChange={handleEditInputChange}
                      placeholder="000.000.000-00"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cidade">
                      <i className="fas fa-city"></i>
                      Cidade
                    </label>
                    <input
                      type="text"
                      id="cidade"
                      name="cidade"
                      value={editFormData.cidade}
                      onChange={handleEditInputChange}
                      placeholder="Digite a cidade"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="role">
                    <i className="fas fa-tag"></i>
                    Papel do Usuário
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={editFormData.role}
                    onChange={handleEditInputChange}
                  >
                    <option value="comum">Usuário Comum</option>
                    <option value="saude">Profissional de Saúde</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCloseEditModal}>
                Cancelar
              </button>
              <button className="btn-save" onClick={handleSaveEdit} disabled={savingUser}>
                {savingUser ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Salvando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && deletingUser && (
        <div className="modal-overlay" onClick={handleCloseDeleteModal}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <i className="fas fa-exclamation-triangle"></i>
              <h3>Confirmar Exclusão</h3>
            </div>
            <div className="modal-body">
              <p>Tem certeza que deseja excluir o usuário <strong>{deletingUser.nome}</strong>?</p>
              <p className="delete-warning">
                <i className="fas fa-info-circle"></i>
                Esta ação é irreversível e todos os dados do usuário serão removidos permanentemente.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCloseDeleteModal}>
                Cancelar
              </button>
              <button className="btn-confirm-delete" onClick={handleDeleteUser} disabled={deletingUserLoading}>
                {deletingUserLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Excluindo...
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash-alt"></i>
                    Sim, Excluir
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Logout */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <i className="fas fa-question-circle"></i>
              <h3>Confirmar Saída</h3>
            </div>
            <div className="modal-body">
              <p>Tem certeza que deseja sair do painel administrativo?</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>
                Cancelar
              </button>
              <button className="btn-confirm" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;