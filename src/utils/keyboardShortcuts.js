export function initKeyboardShortcuts(navigate) {
  let caixa = null;
  let caixaFechadaPermanente = false;

  const atalhosFechados = localStorage.getItem("atalhosFechados");
  if (atalhosFechados === "true") {
    caixaFechadaPermanente = true;
  }


  const criarCaixaAtalhos = () => {
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.bottom = "20px";
    div.style.right = "20px";
    div.style.backgroundColor = "#fff";
    div.style.border = "2px solid #00614C";
    div.style.borderRadius = "10px";
    div.style.padding = "15px";
    div.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    div.style.zIndex = "9999";
    div.style.fontFamily = "Arial, sans-serif";
    div.style.fontSize = "13px";
    div.style.minWidth = "200px";
    div.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <strong>⌨️ Atalhos</strong>
        <button id="fecharAtalhosBtn" style="background:#dc3545;color:white;border:none;border-radius:5px;padding:3px 10px;cursor:pointer;">Fechar</button>
      </div>
      <div><kbd style="background:#f0f0f0;padding:2px 6px;border-radius:4px;">H</kbd> Home</div>
      <div><kbd style="background:#f0f0f0;padding:2px 6px;border-radius:4px;">S</kbd> Sobre</div>
      <div><kbd style="background:#f0f0f0;padding:2px 6px;border-radius:4px;">L</kbd> Login</div>
      <div><kbd style="background:#f0f0f0;padding:2px 6px;border-radius:4px;">C</kbd> Cadastro</div>
      <div><kbd style="background:#f0f0f0;padding:2px 6px;border-radius:4px;">F</kbd> Formulário</div>
      <div><kbd style="background:#f0f0f0;padding:2px 6px;border-radius:4px;">P</kbd> Perfil</div>
      <div style="margin-top:8px;padding-top:8px;border-top:1px solid #ddd;"><kbd style="background:#f0f0f0;padding:2px 6px;border-radius:4px;">?</kbd> Mostrar atalhos</div>
    `;
    return div;
  };

  const handleKeyDown = (e) => {
    const key = e.key.toLowerCase();
    
    switch (key) {
      case "h":
        navigate("/");
        break;
      case "s":
        navigate("/sobre");
        break;
      case "l":
        navigate("/login");
        break;
      case "c":
        navigate("/cadastro");
        break;
      case "f":
        navigate("/formulario");
        break;
      case "p":
        navigate("/perfil");
        break;
      case "?":
      
        if (caixaFechadaPermanente) {
          return;
        }
        
        if (!caixa) {
          caixa = criarCaixaAtalhos();
          document.body.appendChild(caixa);
          
          const fecharBtn = caixa.querySelector("#fecharAtalhosBtn");
          fecharBtn.addEventListener("click", () => {
            caixa.style.display = "none";
            caixaFechadaPermanente = true;
            localStorage.setItem("atalhosFechados", "true"); 
          });
        }
        caixa.style.display = "block";
        break;
      default:
        break;
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