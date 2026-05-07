import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDropdown.css";

function UserDropdown({ user, userName, userRole, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="user-dropdown-container" ref={dropdownRef}>
      <button className="user-trigger-btn" onClick={() => setIsOpen(!isOpen)}>
        <div className="user-avatar-simple">
          <span className="avatar-initial-simple">
            {userName?.charAt(0).toUpperCase() || "U"}
          </span>
        </div>
        <span className="user-name-simple">{userName?.split(" ")[0] || "Usuário"}</span>
        <i className={`fa-solid ${isOpen ? "fa-chevron-up" : "fa-chevron-down"} arrow-icon`}></i>
      </button>

      {isOpen && (
        <div className="dropdown-menu-simple">
          <div className="dropdown-header-simple">
            <div className="dropdown-avatar-simple">
              <span>{userName?.charAt(0).toUpperCase() || "U"}</span>
            </div>
            <div className="dropdown-info-simple">
              <h4>{userName || "Usuário"}</h4>
              <p>{user?.email || "email@exemplo.com"}</p>
              <span className={`role-badge-simple role-${userRole}`}>
                {userRole === "admin" ? "👑 Administrador" : 
                 userRole === "saude" ? "🏥 Saúde" : 
                 "👤 Paciente"}
              </span>
            </div>
          </div>

          <button 
            onClick={() => handleNavigate("/perfil")} 
            className="dropdown-item-simple"
          >
            <i className="fa-solid fa-user"></i> Meu Perfil
          </button>

          <button 
            onClick={onLogout} 
            className="dropdown-logout-simple"
          >
            <i className="fa-solid fa-sign-out-alt"></i> Sair da Conta
          </button>
        </div>
      )}
    </div>
  );
}

export default UserDropdown;