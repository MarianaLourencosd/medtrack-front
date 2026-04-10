export function initKeyboardShortcuts(navigate) {
  const handleKeyDown = (e) => {
    switch (e.key.toLowerCase()) {
      case "h":
        navigate("/"); // Home
        break;
      case "s":
        navigate("/sobre"); // Sobre
        break;
      case "l":
        navigate("/login"); // Login
        break;
      case "c":
        navigate("/cadastro"); // Cadastro
        break;
      case "f":
        navigate("/formulario"); // Formulário
        break;
      case "p":
        navigate("/perfil"); // Perfil
        break;
      default:
        break;
    }
  };

  // Adiciona o listener de teclado
  document.addEventListener("keydown", handleKeyDown);

  // Cria a caixa de atalhos na tela
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

  // Retorna função de cleanup
  return () => {
    document.removeEventListener("keydown", handleKeyDown);
    caixa.remove();
  };
}