// src/components/VLibras/VLibras.jsx
import { useEffect } from 'react';

const VLibras = () => {
  useEffect(() => {
    // Função para carregar o VLibras
    const loadVLibras = () => {
      // Verifica se já existe
      if (document.querySelector('.vw-plugin-top-wrapper')) {
        return;
      }

      // Cria o elemento div se não existir
      if (!document.querySelector('[vw]')) {
        const vwDiv = document.createElement('div');
        vwDiv.setAttribute('vw', 'true');
        vwDiv.className = 'enabled';
        vwDiv.innerHTML = `
          <div vw-access-button class="active"></div>
          <div vw-plugin-wrapper>
            <div class="vw-plugin-top-wrapper"></div>
          </div>
        `;
        document.body.appendChild(vwDiv);
      }

      // Carrega o script
      if (!document.querySelector('script[src="https://vlibras.gov.br/app/vlibras-plugin.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
        script.async = true;
        script.onload = () => {
          if (window.VLibras) {
            new window.VLibras.Widget('https://vlibras.gov.br/app');
          }
        };
        document.body.appendChild(script);
      } else if (window.VLibras) {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      }
    };

    loadVLibras();
  }, []);

  return null; // Não renderiza nada visual, apenas carrega o script
};

export default VLibras;