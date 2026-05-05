export function initKeyboardShortcuts(navigate) {
  const handleKeyDown = (e) => {
    switch (e.key.toLowerCase()) {
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
      default:
        break;
    }
  };

  document.addEventListener("keydown", handleKeyDown);

  const caixa = document.createElement("div");
  caixa.className = "caixa-atalhos";
  caixa.innerHTML = `
    <strong>Atalhos de Teclado</strong>
    <p><strong>H</strong> → Home</p>
    <p><strong>S</strong> → Sobre</p>
    <p><strong>L</strong> → Login</p>
    <p><strong>C</strong> → Cadastro</p>
    <p><strong>F</strong> → Formulário</p>
    <p><strong>P</strong> → Perfil</p>
    <button id="fechar-atalhos">Fechar</button>
  `;
  document.body.appendChild(caixa);

  document.getElementById("fechar-atalhos").addEventListener("click", () => {
    caixa.style.display = "none";
  });

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
    caixa.remove();
  };
}