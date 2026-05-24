export function initKeyboardShortcuts(navigate) {
  let caixa = null;
  let caixaFechadaPermanente = false;

  const atalhosFechados = localStorage.getItem("atalhosFechados");
  if (atalhosFechados === "true") {
    caixaFechadaPermanente = true;
  }

  const criarCaixaAtalhos = () => {
    const div = document.createElement("div");
    div.id = "atalhos-caixa";
    div.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      border: 2px solid #00614C;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      font-family: Arial, sans-serif;
      font-size: 13px;
      min-width: 220px;
      overflow: hidden;
    `;
    
    div.innerHTML = `
      <div style="background: #00614C; padding: 10px 12px; display: flex; justify-content: space-between; align-items: center;">
        <strong style="color: white;">⌨️ Atalhos</strong>
        <button id="fecharAtalhosBtn" style="background: #dc3545; color: white; border: none; border-radius: 5px; padding: 2px 10px; cursor: pointer;">X</button>
      </div>
      <div style="padding: 10px 12px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span><kbd style="background: #00614C; color: white; padding: 2px 8px; border-radius: 4px;">H</kbd> Home</span>
          <span>🏠</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span><kbd style="background: #00614C; color: white; padding: 2px 8px; border-radius: 4px;">S</kbd> Sobre</span>
          <span>ℹ️</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span><kbd style="background: #00614C; color: white; padding: 2px 8px; border-radius: 4px;">L</kbd> Login</span>
          <span>🔐</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span><kbd style="background: #00614C; color: white; padding: 2px 8px; border-radius: 4px;">C</kbd> Cadastro</span>
          <span>📝</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span><kbd style="background: #00614C; color: white; padding: 2px 8px; border-radius: 4px;">F</kbd> Formulário</span>
          <span>📋</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span><kbd style="background: #00614C; color: white; padding: 2px 8px; border-radius: 4px;">P</kbd> Perfil</span>
          <span>👤</span>
        </div>
      </div>
      <div style="background: #f5f5f5; padding: 8px 12px; border-top: 1px solid #ddd; display: flex; justify-content: space-between;">
        <span><kbd style="background: #00614C; color: white; padding: 2px 6px; border-radius: 4px;">'</kbd> ou <kbd style="background: #00614C; color: white; padding: 2px 6px; border-radius: 4px;">?</kbd></span>
        <span style="color: #666;">Abrir/Fechar</span>
      </div>
    `;
    
    return div;
  };

  const mostrarCaixa = () => {
    if (caixaFechadaPermanente) return;
    
    if (!caixa) {
      caixa = criarCaixaAtalhos();
      document.body.appendChild(caixa);
      
      const fecharBtn = caixa.querySelector("#fecharAtalhosBtn");
      if (fecharBtn) {
        fecharBtn.addEventListener("click", () => {
          caixa.style.display = "none";
          caixaFechadaPermanente = true;
          localStorage.setItem("atalhosFechados", "true");
        });
      }
    }
    
    if (caixa.style.display === "none" || !caixa.style.display) {
      caixa.style.display = "block";
    } else {
      caixa.style.display = "none";
    }
  };

  const handleKeyDown = (e) => {
    const key = e.key;
    const keyLower = key.toLowerCase();
    
    switch (keyLower) {
      case "h": navigate("/"); break;
      case "s": navigate("/sobre"); break;
      case "l": navigate("/login"); break;
      case "c": navigate("/cadastro"); break;
      case "f": navigate("/formulario"); break;
      case "p": navigate("/perfil"); break;
      default: break;
    }
    
    if (key === "'" || key === "?" || key === "/") {
      e.preventDefault();
      mostrarCaixa();
    }
  };

  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
    if (caixa && caixa.remove) {
      caixa.remove();
    }
  };
}