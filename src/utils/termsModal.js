// src/utils/termsModal.js

// Função para verificar se os termos já foram aceitos
export const hasAcceptedTerms = () => {
  try {
    const accepted = localStorage.getItem("termsAccepted");
    return accepted === "true";
  } catch (e) {
    return false;
  }
};

// Função para aceitar os termos
export const acceptTerms = () => {
  try {
    localStorage.setItem("termsAccepted", "true");
  } catch (e) {
    console.error("Erro ao salvar termos:", e);
  }
};

// Função para recusar os termos
export const declineTerms = () => {
  try {
    localStorage.setItem("termsAccepted", "false");
  } catch (e) {
    console.error("Erro ao salvar termos:", e);
  }
};

// Função para resetar os termos (útil para testes)
export const resetTerms = () => {
  try {
    localStorage.removeItem("termsAccepted");
    console.log("Termos resetados! O modal aparecerá novamente.");
  } catch (e) {
    console.error("Erro ao resetar termos:", e);
  }
};

// Função para mostrar alerta de recusa
export const showDeclineAlert = () => {
  alert("Você precisa aceitar os termos para acessar o MedTrack.");
};

// HTML do Modal
export const getTermsModalHTML = () => {
  return `
    <div id="terms-overlay" class="terms-overlay">
      <div class="terms-modal">
        <div class="terms-modal-header">
          <h2>📋 Termos de Uso - MedTrack</h2>
        </div>
        
        <div class="terms-modal-content">
          <p>Bem-vindo ao MedTrack. Ao acessar este sistema, você concorda com os termos descritos a seguir.</p>
          
          <p>O MedTrack tem como objetivo auxiliar no acompanhamento de informações médicas de forma prática e segura.</p>
          
          <p>Você se compromete a utilizar a plataforma de maneira responsável, não realizando atividades que possam comprometer sua segurança ou de outros usuários.</p>
          
          <p>Seus dados serão tratados com confidencialidade, respeitando boas práticas de privacidade.</p>
          
          <p>O uso indevido da plataforma poderá resultar em bloqueio de acesso sem aviso prévio.</p>
          
          <p>O MedTrack não se responsabiliza por informações inseridas incorretamente pelos usuários.</p>
          
          <p>Em caso de emergência, sempre procure atendimento médico presencial imediatamente.</p>
          
          <p>Os dados fornecidos são de responsabilidade do usuário, sendo essencial mantê-los sempre atualizados.</p>
          
          <p>O MedTrack pode atualizar estes termos a qualquer momento, notificando os usuários sobre mudanças significativas.</p>
          
          <p><strong>Ao clicar em "Aceitar", você concorda integralmente com estes termos.</strong></p>
        </div>
        
        <div class="terms-buttons">
          <button class="terms-btn accept" id="terms-accept-btn">
            ✅ Aceitar
          </button>
          <button class="terms-btn decline" id="terms-decline-btn">
            ❌ Não aceitar
          </button>
        </div>
      </div>
    </div>
  `;
};

// CSS do Modal (sem conflito com CSS existente)
export const getTermsModalCSS = () => {
  return `
    /* Modal de Termos de Uso - Sem conflito com CSS existente */
    .terms-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 99999;
    }

    .terms-modal {
      background: #ffffff;
      width: 90%;
      max-width: 550px;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
      animation: termsFadeIn 0.2s ease;
    }

    .terms-modal-header {
      background: linear-gradient(135deg, #00614C, #00AD88);
      padding: 16px 20px;
    }

    .terms-modal-header h2 {
      color: white;
      margin: 0;
      font-size: 1.3rem;
      text-align: center;
      font-family: 'Spectral', serif;
    }

    .terms-modal-content {
      padding: 20px;
      max-height: 380px;
      overflow-y: auto;
    }

    .terms-modal-content p {
      font-size: 13px;
      color: #333;
      line-height: 1.5;
      margin-bottom: 12px;
      font-family: 'Karla', sans-serif;
    }

    .terms-modal-content::-webkit-scrollbar {
      width: 5px;
    }

    .terms-modal-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    .terms-modal-content::-webkit-scrollbar-thumb {
      background: #00AD88;
      border-radius: 10px;
    }

    .terms-buttons {
      display: flex;
      gap: 12px;
      padding: 0 20px 20px 20px;
    }

    .terms-btn {
      flex: 1;
      padding: 10px 16px;
      border-radius: 8px;
      border: none;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .terms-btn.accept {
      background: linear-gradient(135deg, #66bb6a, #2e7d32);
      color: white;
    }

    .terms-btn.accept:hover {
      background: linear-gradient(135deg, #4caf50, #1b5e20);
      transform: scale(1.02);
    }

    .terms-btn.decline {
      background: #e53935;
      color: white;
    }

    .terms-btn.decline:hover {
      background: #c62828;
      transform: scale(1.02);
    }

    @keyframes termsFadeIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    /* Modo escuro - compatível com o existente */
    body.dark-mode .terms-modal {
      background: #1a1a2e;
    }

    body.dark-mode .terms-modal-content p {
      color: #e0e0e0;
    }

    body.dark-mode .terms-modal-content::-webkit-scrollbar-track {
      background: #2a2a3a;
    }

    /* Responsividade */
    @media (max-width: 576px) {
      .terms-modal {
        width: 95%;
      }
      
      .terms-modal-header h2 {
        font-size: 1.1rem;
      }
      
      .terms-modal-content {
        padding: 15px;
        max-height: 280px;
      }
      
      .terms-modal-content p {
        font-size: 11px;
      }
      
      .terms-buttons {
        padding: 0 15px 15px 15px;
        gap: 8px;
      }
      
      .terms-btn {
        padding: 8px 12px;
        font-size: 11px;
      }
    }
  `;
};

// Função para inicializar o modal de termos
export const initTermsModal = () => {
  // Verificar se já existe o modal
  if (document.getElementById("terms-overlay")) {
    return;
  }

  // Verificar se os termos já foram aceitos
  if (hasAcceptedTerms()) {
    return;
  }

  // Verificar se o CSS já foi injetado
  if (!document.querySelector("style[data-terms-modal]")) {
    const style = document.createElement("style");
    style.setAttribute("data-terms-modal", "true");
    style.textContent = getTermsModalCSS();
    document.head.appendChild(style);
  }

  // Injetar HTML do modal
  const modalDiv = document.createElement("div");
  modalDiv.innerHTML = getTermsModalHTML();
  document.body.appendChild(modalDiv.firstElementChild);

  // Adicionar eventos
  const overlay = document.getElementById("terms-overlay");
  const acceptBtn = document.getElementById("terms-accept-btn");
  const declineBtn = document.getElementById("terms-decline-btn");

  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      acceptTerms();
      if (overlay) overlay.remove();
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener("click", () => {
      showDeclineAlert();
    });
  }

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        showDeclineAlert();
      }
    });
  }
};

// Função para remover o modal
export const removeTermsModal = () => {
  const overlay = document.getElementById("terms-overlay");
  if (overlay) {
    overlay.remove();
  }
};

// Exportar tudo como objeto padrão
const termsModal = {
  hasAcceptedTerms,
  acceptTerms,
  declineTerms,
  resetTerms,
  showDeclineAlert,
  getTermsModalHTML,
  getTermsModalCSS,
  initTermsModal,
  removeTermsModal
};

export default termsModal;