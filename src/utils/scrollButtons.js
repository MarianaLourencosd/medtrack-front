export function initScrollButtons() {
    const botoesTopo = [
      ["btnTopo", 0],
      ["btnMeio", 500],
      ["btnFim", document.body.scrollHeight]
    ];
  
    const handleScroll = () => {
      botoesTopo.forEach(([idBotao]) => {
        const btn = document.getElementById(idBotao);
        if (!btn) return;
  
        if (window.scrollY > 200) {
          btn.style.display = "block";
        } else {
          btn.style.display = "none";
        }
      });
    };
  
    window.addEventListener("scroll", handleScroll);
  
    botoesTopo.forEach(([idBotao, posicao]) => {
      const btn = document.getElementById(idBotao);
      if (!btn) return;
  
      btn.onclick = () => {
        window.scrollTo({
          top: posicao,
          behavior: "smooth"
        });
      };
    });
  
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }