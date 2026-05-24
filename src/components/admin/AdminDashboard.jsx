import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebaseConfig";
import { doc, getDoc, collection, getDocs, updateDoc, deleteDoc, query, orderBy, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    nome: "",
    email: "",
    role: ""
  });
  const [savingUser, setSavingUser] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [deletingUserLoading, setDeletingUserLoading] = useState(false);

  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    nome: "",
    email: "",
    role: "comum",
    senha: ""
  });
  const [creatingUser, setCreatingUser] = useState(false);

  const [systemLogs, setSystemLogs] = useState([]);
  const versao = "2.0.0";
  const ultimaAtualizacao = "24/05/2026";

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
    loadSystemLogs();
  }, []);

  const loadSystemLogs = () => {
    const logs = localStorage.getItem("systemLogs");
    if (logs) {
      setSystemLogs(JSON.parse(logs));
    } else {
      const dataAtual = new Date().toLocaleString();
      setSystemLogs([
        { id: 1, action: "Sistema iniciado", date: dataAtual, user: "Sistema" }
      ]);
      localStorage.setItem("systemLogs", JSON.stringify([
        { id: 1, action: "Sistema iniciado", date: dataAtual, user: "Sistema" }
      ]));
    }
  };

  const addLog = (action) => {
    const newLog = {
      id: Date.now(),
      action: action,
      date: new Date().toLocaleString(),
      user: adminName || "Administrador"
    };
    const updatedLogs = [newLog, ...systemLogs.slice(0, 49)];
    setSystemLogs(updatedLogs);
    localStorage.setItem("systemLogs", JSON.stringify(updatedLogs));
  };

  const limparLogs = () => {
    if (window.confirm("Tem certeza que deseja limpar todos os logs?")) {
      const dataAtual = new Date().toLocaleString();
      const logsLimpos = [
        { id: Date.now(), action: "Logs foram limpos", date: dataAtual, user: adminName || "Administrador" }
      ];
      setSystemLogs(logsLimpos);
      localStorage.setItem("systemLogs", JSON.stringify(logsLimpos));
      alert("Logs limpos com sucesso!");
    }
  };

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

        switch (userData.role) {
          case "admin":
            totalAdmin++;
            break;
          case "saude":
            totalSaude++;
            break;
          default:
            totalComum++;
        }

        usersList.push({
          id: doc.id,
          nome: userData.nome || "Não informado",
          email: userData.email || "Não informado",
          role: userData.role || "comum",
          createdAt: userData.createdAt
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

  useEffect(() => {
    fetchStatsAndUsers();
  }, [activeTab]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "todos" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleLogout = async () => {
    try {
      addLog("Admin fez logout");
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

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setEditFormData({
      nome: user.nome !== "Não informado" ? user.nome : "",
      email: user.email !== "Não informado" ? user.email : "",
      role: user.role
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditFormData({
      nome: "",
      email: "",
      role: ""
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

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
        role: editFormData.role,
        updatedAt: new Date()
      });

      addLog(`Editou usuário: ${editFormData.nome}`);
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

  const handleOpenDeleteModal = (user) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingUser(null);
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    if (deletingUser.id === auth.currentUser?.uid) {
      alert("Você não pode excluir seu próprio usuário!");
      handleCloseDeleteModal();
      return;
    }

    setDeletingUserLoading(true);
    try {
      const userRef = doc(db, "usuarios", deletingUser.id);
      await deleteDoc(userRef);

      addLog(`Excluiu usuário: ${deletingUser.nome}`);
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

  const handleOpenCreateUserModal = () => {
    setShowCreateUserModal(true);
    setNewUserData({
      nome: "",
      email: "",
      role: "comum",
      senha: ""
    });
  };

  const handleCreateUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateUser = async () => {
    if (!newUserData.nome.trim()) {
      alert("Nome é obrigatório");
      return;
    }
    if (!newUserData.email.trim()) {
      alert("Email é obrigatório");
      return;
    }
    if (!newUserData.senha.trim()) {
      alert("Senha é obrigatória");
      return;
    }
    if (newUserData.senha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setCreatingUser(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUserData.email,
        newUserData.senha
      );

      const user = userCredential.user;

      const userRef = doc(db, "usuarios", user.uid);
      await setDoc(userRef, {
        nome: newUserData.nome,
        email: newUserData.email,
        role: newUserData.role,
        createdAt: new Date()
      });

      addLog(`Criou novo usuário: ${newUserData.nome}`);
      await fetchStatsAndUsers();
      alert("Usuário criado com sucesso!");
      setShowCreateUserModal(false);
      setNewUserData({
        nome: "",
        email: "",
        role: "comum",
        senha: ""
      });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      if (error.code === "auth/email-already-in-use") {
        alert("Este email já está em uso!");
      } else if (error.code === "auth/weak-password") {
        alert("A senha deve ter pelo menos 6 caracteres!");
      } else {
        alert("Erro ao criar usuário: " + error.message);
      }
    } finally {
      setCreatingUser(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-left">
          <button className="back-home-btn" onClick={handleBackToHome}>
            <i className="fas fa-arrow-left"></i>
            <span>Voltar</span>
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
        <aside className="dashboard-sidebar">
          <div className="sidebar-menu">
            <button
              className={`menu-item ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </button>

            <button
              className={`menu-item ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              <i className="fas fa-users"></i>
              <span>Usuários</span>
            </button>

            <button
              className={`menu-item ${activeTab === "logs" ? "active" : ""}`}
              onClick={() => setActiveTab("logs")}
            >
              <i className="fas fa-history"></i>
              <span>Logs</span>
            </button>

            <button
              className={`menu-item ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <i className="fas fa-cog"></i>
              <span>Configurações</span>
            </button>
          </div>

          <div className="sidebar-footer">
            <div className="system-version">
              <i className="fas fa-code-branch"></i>
              <span>Versão {versao}</span>
            </div>
            <div className="system-update">
              <i className="fas fa-calendar-alt"></i>
              <span>Atualizado: {ultimaAtualizacao}</span>
            </div>
          </div>
        </aside>

        <main className="dashboard-main">
          {activeTab === "dashboard" && (
            <div className="dashboard-content">
              <div className="welcome-section">
                <h1>
                  <i className="fas fa-hand-wave"></i>
                  Olá, {adminName || "Administrador"}!
                </h1>
                <p>Bem-vindo ao painel de controle do MedTrack</p>
              </div>

              <div className="stats-grid">
                <div className="stat-card primary">
                  <div className="stat-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stat-info">
                    <h3>Total de Usuários</h3>
                    <p className="stat-number">{stats.totalUsers}</p>
                  </div>
                </div>

                <div className="stat-card success">
                  <div className="stat-icon">
                    <i className="fas fa-user-md"></i>
                  </div>
                  <div className="stat-info">
                    <h3>Profissionais Saúde</h3>
                    <p className="stat-number">{stats.totalSaude}</p>
                  </div>
                </div>

                <div className="stat-card warning">
                  <div className="stat-icon">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <div className="stat-info">
                    <h3>Administradores</h3>
                    <p className="stat-number">{stats.totalAdmin}</p>
                  </div>
                </div>

                <div className="stat-card info">
                  <div className="stat-icon">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="stat-info">
                    <h3>Usuários Comuns</h3>
                    <p className="stat-number">{stats.totalComum}</p>
                  </div>
                </div>
              </div>

              <div className="quick-actions">
                <h3>
                  <i className="fas fa-bolt"></i>
                  Ações Rápidas
                </h3>
                <div className="actions-grid">
                  <button className="action-card" onClick={handleOpenCreateUserModal}>
                    <i className="fas fa-user-plus"></i>
                    <span>Criar Usuário</span>
                  </button>
                  <button className="action-card" onClick={() => setActiveTab("users")}>
                    <i className="fas fa-users"></i>
                    <span>Gerenciar Usuários</span>
                  </button>
                  <button className="action-card" onClick={() => setActiveTab("logs")}>
                    <i className="fas fa-history"></i>
                    <span>Ver Logs</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="users-content">
              <div className="content-header">
                <h2>
                  <i className="fas fa-users"></i>
                  Gerenciamento de Usuários
                </h2>
                <p>Visualize, edite ou exclua usuários cadastrados</p>
              </div>

              <div className="users-controls">
                <div className="search-filter">
                  <div className="search-box">
                    <i className="fas fa-search"></i>
                    <input
                      type="text"
                      placeholder="Buscar por nome ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="filter-box">
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                      <option value="todos">Todos os papéis</option>
                      <option value="comum">Usuários Comuns</option>
                      <option value="saude">Profissionais Saúde</option>
                      <option value="admin">Administradores</option>
                    </select>
                  </div>
                  <button className="create-user-btn" onClick={handleOpenCreateUserModal}>
                    <i className="fas fa-user-plus"></i>
                    Novo Usuário
                  </button>
                </div>
              </div>

              <div className="users-table-container">
                <div className="table-responsive">
                  {loadingUsers ? (
                    <div className="loading-spinner">
                      <i className="fas fa-spinner fa-spin"></i>
                      <p>Carregando...</p>
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
                  ) : filteredUsers.length === 0 ? (
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
                          <th>Papel</th>
                          <th>Data Cadastro</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td>{user.nome}</td>
                            <td>{user.email}</td>
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
                                title="Editar"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="delete-user-btn"
                                onClick={() => handleOpenDeleteModal(user)}
                                title="Excluir"
                                disabled={user.id === auth.currentUser?.uid}
                              >
                                <i className="fas fa-trash-alt"></i>
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

          {activeTab === "logs" && (
            <div className="logs-content">
              <div className="content-header">
                <h2>
                  <i className="fas fa-history"></i>
                  Logs do Sistema
                </h2>
                <p>Registro de ações dos administradores</p>
              </div>

              <div className="logs-container">
                {systemLogs.length === 0 ? (
                  <div className="no-logs">
                    <i className="fas fa-inbox"></i>
                    <p>Nenhum log registrado</p>
                  </div>
                ) : (
                  <div className="logs-list">
                    {systemLogs.map((log) => (
                      <div key={log.id} className="log-item">
                        <div className="log-icon">
                          <i className="fas fa-clipboard-list"></i>
                        </div>
                        <div className="log-details">
                          <p className="log-action">{log.action}</p>
                          <div className="log-meta">
                            <span className="log-user">
                              <i className="fas fa-user"></i> {log.user}
                            </span>
                            <span className="log-date">
                              <i className="fas fa-calendar"></i> {log.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="settings-content">
              <div className="content-header">
                <h2>
                  <i className="fas fa-cog"></i>
                  Configurações
                </h2>
                <p>Personalize as preferências do sistema</p>
              </div>

              <div className="settings-card">
                <div className="setting-group">
                  <div className="setting-label">
                    <i className="fas fa-code-branch"></i>
                    <span>Versão do Sistema</span>
                  </div>
                  <span className="setting-value">{versao}</span>
                </div>

                <div className="setting-group">
                  <div className="setting-label">
                    <i className="fas fa-calendar-alt"></i>
                    <span>Última Atualização</span>
                  </div>
                  <span className="setting-value">{ultimaAtualizacao}</span>
                </div>

                <div className="setting-group">
                  <div className="setting-label">
                    <i className="fas fa-database"></i>
                    <span>Limpar Logs do Sistema</span>
                  </div>
                  <button className="danger-btn" onClick={limparLogs}>
                    <i className="fas fa-trash-alt"></i>
                    Limpar Histórico
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

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
              <form className="edit-user-form">
                <div className="form-group">
                  <label>Nome Completo *</label>
                  <input type="text" name="nome" value={editFormData.nome} onChange={handleEditInputChange} />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" name="email" value={editFormData.email} onChange={handleEditInputChange} />
                </div>
                <div className="form-group">
                  <label>Papel</label>
                  <select name="role" value={editFormData.role} onChange={handleEditInputChange}>
                    <option value="comum">Usuário Comum</option>
                    <option value="saude">Profissional de Saúde</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCloseEditModal}>Cancelar</button>
              <button className="btn-save" onClick={handleSaveEdit} disabled={savingUser}>
                {savingUser ? <><i className="fas fa-spinner fa-spin"></i> Salvando...</> : <><i className="fas fa-save"></i> Salvar</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateUserModal && (
        <div className="modal-overlay" onClick={() => setShowCreateUserModal(false)}>
          <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <i className="fas fa-user-plus"></i>
              <h3>Criar Usuário</h3>
              <button className="modal-close" onClick={() => setShowCreateUserModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form className="edit-user-form">
                <div className="form-group">
                  <label>Nome Completo *</label>
                  <input type="text" name="nome" value={newUserData.nome} onChange={handleCreateUserInputChange} />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" name="email" value={newUserData.email} onChange={handleCreateUserInputChange} />
                </div>
                <div className="form-group">
                  <label>Senha *</label>
                  <input type="password" name="senha" value={newUserData.senha} onChange={handleCreateUserInputChange} />
                </div>
                <div className="form-group">
                  <label>Papel</label>
                  <select name="role" value={newUserData.role} onChange={handleCreateUserInputChange}>
                    <option value="comum">Usuário Comum</option>
                    <option value="saude">Profissional de Saúde</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowCreateUserModal(false)}>Cancelar</button>
              <button className="btn-save" onClick={handleCreateUser} disabled={creatingUser}>
                {creatingUser ? <><i className="fas fa-spinner fa-spin"></i> Criando...</> : <><i className="fas fa-save"></i> Criar</>}
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
              <p>Excluir <strong>{deletingUser.nome}</strong>?</p>
              <p className="delete-warning">⚠️ Esta ação não pode ser desfeita!</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCloseDeleteModal}>Cancelar</button>
              <button className="btn-confirm-delete" onClick={handleDeleteUser} disabled={deletingUserLoading}>
                {deletingUserLoading ? <><i className="fas fa-spinner fa-spin"></i> Excluindo...</> : <>Sim, Excluir</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <i className="fas fa-question-circle"></i>
              <h3>Sair</h3>
            </div>
            <div className="modal-body">
              <p>Tem certeza que deseja sair?</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>Cancelar</button>
              <button className="btn-confirm" onClick={handleLogout}>Sair</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;