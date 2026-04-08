import "bootstrap/dist/css/bootstrap.min.css";
import "./Sobre.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../utils/acessibilidade.css";

// Imagens
import LogoClaro from "../../assets/images/logo-claro.svg";
import ImagemHeaderSobre from "../../assets/images/imagem-header-sobre.svg";
import ImagemInfoSobre from "../../assets/images/imagem-info-sobre.svg";

// Imagens dos desenvolvedores
import DevNicolas from "../../assets/images/dev-nicolas.png";
import DevJoao from "../../assets/images/dev-joao.png";
import DevJose from "../../assets/images/dev-jose.png";
import DevNatalia from "../../assets/images/dev-natalia.jpeg";
import DevSophia from "../../assets/images/dev-sophia.png";
import DevMariana from "../../assets/images/dev-mariana.png";
import DevFernanda from "../../assets/images/dev-fernanda.jpeg";

// Utils
import { initDarkMode, toggleDarkMode } from "../../utils/darkMode";
import { initScrollButtons } from "../../utils/scrollButtons";
import { initNavbarMobile } from "../../utils/navbarMobile";
import { initKeyboardShortcuts } from "../../utils/keyboardShortcuts";
import { initFontSizeControls } from "../../utils/fontSize";
import { initDaltonismo } from "../../utils/daltonismo";
import "../../utils/daltonismo.css";
import VLibras from "../../utils/VLibras";

// Dados dos desenvolvedores
const developers = [
  {
    name: "Nicolas Alves",
    role: "Programador Back End",
    image: DevNicolas,
    alt: "Imagem de Nicolas Alves",
  },
  {
    name: "João Gabriel Ferreira",
    role: "Modelador de Dados",
    image: DevJoao,
    alt: "Imagem de João Gabriel Ferreira",
  },
  {
    name: "José Henrique Bessa",
    role: "Designer de Interfaces",
    image: DevJose,
    alt: "Imagem de José Henrique Bessa",
  },
  {
    name: "Natália Rodrigues",
    role: "Engenheira de Software",
    image: DevNatalia,
    alt: "Imagem de Natália Rodrigues",
  },
  {
    name: "Sophia Cavallaro",
    role: "Programadora Web",
    image: DevSophia,
    alt: "Imagem de Sophia Cavallaro",
  },
  {
    name: "Mariana Lourenço",
    role: "Programadora Web",
    image: DevMariana,
    alt: "Imagem de Mariana Lourenço",
  },
  {
    name: "Fernanda Garcia",
    role: "Engenheira de Software",
    image: DevFernanda,
    alt: "Imagem de Fernanda Garcia",
  },
];

// Dados das diretrizes
const guidelines = [
  {
    icon: "fa-solid fa-chart-simple",
    title: "Visão",
    text: "Ser referência em tecnologia para a saúde digital, contribuindo para um futuro onde a informação salva vidas e o cuidado ultrapassa barreiras físicas.",
  },
  {
    icon: "fa-solid fa-check",
    title: "Missão",
    text: "Desenvolver ferramentas inovadoras que conectem pessoas e profissionais da saúde, promovendo um atendimento mais ágil, humanizado e baseado em informações confiáveis.",
  },
  {
    icon: "fa-solid fa-bars",
    title: "Valores",
    text: "Nossos valores são baseados no cuidado com a vida, na inovação com propósito, na proteção dos dados, na acessibilidade para todos e na colaboração entre pessoas e equipes.",
  },
  {
    icon: "fa-solid fa-lock",
    title: "Privacidade",
    text: "Nossa prioridade é a privacidade. Mantemos os dados protegidos, garantindo transparência, confiança, segurança e integridade.",
  },
];

// Dados da central de emergências
const emergencyItems = [
  {
    title: "1. O Problema Identificado",
    items: [
      "Falta acesso rápido ao histórico do paciente.",
      "Perda de tempo buscando informações críticas.",
      "Riscos aumentados por registros não confiáveis.",
    ],
  },
  {
    title: "2. A Ideia Inicial",
    items: [
      "Prancheta médica digital acessível em qualquer dispositivo.",
      "Dados essenciais disponíveis em segundos.",
      "Integração com SAMU e hospitais para agilidade.",
    ],
  },
  {
    title: "3. O Desenvolvimento",
    items: [
      "Equipe multidisciplinar de desenvolvedores e médicos.",
      "Requisitos focados em situações reais de urgência.",
      "Ajustes para plataforma simples e intuitiva.",
    ],
  },
  {
    title: "4. O Impacto Esperado",
    items: [
      "Salvar vidas com acesso rápido a informações críticas.",
      "Reduzir erros em atendimentos de emergência.",
      "Melhorar o atendimento de emergências médicas no Brasil.",
    ],
  },
];

// Dados do FAQ
const faqItems = [
  {
    question: "O que é a Prancheta Médica Online?",
    answer:
      "Descubra como a plataforma funciona, para que serve e como ela pode ajudar a salvar vidas em situações de emergência.",
  },
  {
    question: "Quais dados eu posso registrar na plataforma?",
    answer:
      "Veja quais informações de saúde você pode armazenar — como pressão arterial, frequência cardíaca, alergias, medicamentos em uso e mais.",
  },
  {
    question: "Como meus dados são compartilhados em caso de emergência?",
    answer:
      "Entenda como o sistema identifica uma emergência e envia automaticamente suas informações médicas para o SAMU ou hospitais próximos.",
  },
  {
    question: "Meus dados estão seguros e protegidos?",
    answer:
      "Saiba quais medidas de segurança e criptografia são utilizadas para garantir a privacidade das suas informações de saúde.",
  },
  {
    question: "Como posso cadastrar ou atualizar meus dados vitais?",
    answer:
      "Aprenda o passo a passo para criar sua conta, preencher seu perfil médico e manter seus dados sempre atualizados.",
  },
];

function Sobre() {
  const [darkMode, setDarkMode] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const navigate = useNavigate();

  // Alternar FAQ
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  useEffect(() => {
    const cleanupNavbar = initNavbarMobile();
    const cleanupScroll = initScrollButtons();
    const cleanupShortcuts = initKeyboardShortcuts(navigate);
    const fontControls = initFontSizeControls();

    document.getElementById("decrease")?.addEventListener("click", fontControls.decrease);
    document.getElementById("increase")?.addEventListener("click", fontControls.increase);
    document.getElementById("reset")?.addEventListener("click", fontControls.reset);

    // Daltonismo
    const daltonismoBtn = document.getElementById("daltonismo-toggle");
    const { toggleDaltonismo } = initDaltonismo();
    const cleanupDaltonismo = toggleDaltonismo(daltonismoBtn);

    // Dark mode inicial
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add("dark-mode");
    }

    return () => {
      cleanupNavbar?.();
      cleanupScroll?.();
      cleanupShortcuts?.();

      document.getElementById("decrease")?.removeEventListener("click", fontControls.decrease);
      document.getElementById("increase")?.removeEventListener("click", fontControls.increase);
      document.getElementById("reset")?.removeEventListener("click", fontControls.reset);

      cleanupDaltonismo?.();
    };
  }, [navigate]);

  // Gerenciar dark mode
  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    
    if (newDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  return (
    <>
      {/* Botões de ajuste de fonte */}
      <div className="font-size-controls">
        <button id="decrease" title="Diminuir fonte">A-</button>
        <button id="reset" title="Restaurar fonte">A</button>
        <button id="increase" title="Aumentar fonte">A+</button>
      </div>

      {/* Botão Voltar ao Topo */}
      <button id="btnTopo" title="Voltar ao topo">
        <i className="fa-solid fa-arrow-up"></i>
      </button>

      {/* Navbar Desktop */}
      <nav className="navbar">
        <div className="logotipo">
          <img className="navbar-logo" src={LogoClaro} alt="LogoTipo da MedTrack" />
          <p>MedTrack</p>
        </div>

        <ul className="navbar-list">
          <li><a className="navbar-item" href="/">Home</a></li>
          <li><a className="navbar-item" href="/sobre">Sobre</a></li>
        </ul>

        <div className="navbar-btn">
          <a className="navbar-btn-item" href="/login">Login</a>
          <a className="navbar-btn-item" href="/cadastro">Cadastro</a>
          <a className="navbar-btn-item" href="/formulario">Formulário</a>

          <button
            id="dark-mode-toggle"
            className="navbar-btn-item"
            onClick={handleToggleDarkMode}
            aria-label="Alternar modo escuro"
          >
            <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
          </button>

          <button
            id="daltonismo-toggle"
            className="navbar-btn-item"
            title="Alternar modo daltonismo"
          >
            🟢 Daltonismo
          </button>

          <a className="navbar-btn-profile" href="/perfil">
            <i className="fa-solid fa-user"></i>
          </a>

          <button className="nav-btn-items" id="nav-btn-toggle" aria-label="Abrir menu">
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </nav>

      {/* Navbar Mobile */}
      <div className="navbar-mobile" id="nav-mobile">
        <ul className="nav-list-mobile">
          <li><a className="nav-items" href="/">Home</a></li>
          <li><a className="nav-items" href="/sobre">Sobre</a></li>
          <li><a className="nav-items" href="/login">Login</a></li>
          <li><a className="nav-items" href="/cadastro">Cadastro</a></li>
          <li><a className="nav-items" href="/formulario">Formulário</a></li>
        </ul>
      </div>

      <main>
        {/* Seção do Cabeçalho */}
        <div className="div-header my-2 mx-1">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold title-header">
                Sobre a empresa <span>Med Track</span>
              </h1>
              <p className="lead text-header">
                Somos uma empresa comprometida com a inovação na área da saúde digital.
                Acreditamos que a tecnologia pode salvar vidas quando usada com propósito e
                responsabilidade. Nossa missão é desenvolver soluções acessíveis, seguras e
                eficientes que conectem pessoas e profissionais da saúde, promovendo bem-estar e
                agilidade no cuidado. Com uma equipe multidisciplinar formada por desenvolvedores,
                designers e especialistas em saúde, trabalhamos para transformar boas ideias em
                ferramentas que realmente fazem a diferença no dia a dia das pessoas.
              </p>

              <div className="d-flex flex-wrap gap-3 mt-4 header-info">
                <div className="text-center header-section-info">
                  <p className="display-5 fw-bold header-number">2025</p>
                  <p className="header-info-text">Ano de fundação</p>
                </div>
                <div className="text-center header-section-info">
                  <p className="display-5 fw-bold header-number">30k+</p>
                  <p className="header-info-text">Pacientes e profissionais unidos</p>
                </div>
                <div className="text-center header-section-info">
                  <p className="display-5 fw-bold header-number">10k+</p>
                  <p className="header-info-text">Pacientes conectados</p>
                </div>
              </div>
            </div>

            <div className="col-lg-6 text-center">
              <img
                className="img-fluid image-header"
                src={ImagemHeaderSobre}
                alt="Imagem de um médico em telechamada"
              />
            </div>
          </div>
        </div>

        {/* Título da Seção e Cards - Diretrizes */}
        <div className="container-fluid my-4 px-4">
          <h2 className="title-card-info">Diretrizes da nossa atuação</h2>

          <div className="row content-info-destaque justify-content-center">
            {guidelines.map((item, index) => (
              <div className="col-md-6 col-lg-3 mb-4" key={index}>
                <section className="card-info-destaque" tabIndex="0">
                  <span className="icon-info-destaque">
                    <i className={item.icon}></i>
                  </span>
                  <p className="title-info-destaque">{item.title}</p>
                  <p className="text-info-destaque">{item.text}</p>
                </section>
              </div>
            ))}
          </div>
        </div>

        {/* Central de Emergências */}
        <div className="container-fluid my-4 px-4">
          <div className="emergency-header" role="region" aria-labelledby="emergency-title">
            <div className="header-layout">
              <section>
                <h1 id="emergency-title" className="title-header">
                  Central de Emergências
                </h1>
                <p className="lead-desc">
                  Informações rápidas e práticas sobre o projeto: problemas, ideias, desenvolvimento e impacto.
                </p>

                <div className="row">
                  {emergencyItems.map((item, index) => (
                    <div className="col-12 col-md-6 mb-3" key={index}>
                      <div className="emergency-card h-100" tabIndex="0">
                        <h3>{item.title}</h3>
                        <ul className="list-unstyled mb-0">
                          {item.items.map((listItem, i) => (
                            <li key={i}>{listItem}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <aside className="image-header-container">
                <img
                  src={ImagemInfoSobre}
                  alt="Imagem ilustrativa de emergência"
                  className="image-header"
                />
              </aside>
            </div>
          </div>
        </div>

        {/* Sobre os Desenvolvedores */}
        <h2 className="title-card-team text-center my-5">Sobre os Desenvolvedores</h2>

        <div className="container my-5 px-2">
          <div className="row justify-content-center g-4">
            {developers.map((dev, index) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center" key={index}>
                <div className="card-team text-center">
                  <div className="card-team-cover"></div>
                  <img className="card-team-image" src={dev.image} alt={dev.alt} />
                  <hr className="team-divider" />
                  <p className="card-team-name">{dev.name}</p>
                  <p className="card-team-text">{dev.role}</p>
                  <div className="team-social-media">
                    <a href="#" className="team-social-link"><i className="fa-brands fa-instagram"></i></a>
                    <a href="#" className="team-social-link"><i className="fa-brands fa-linkedin-in"></i></a>
                    <a href="#" className="team-social-link"><i className="fa-brands fa-x-twitter"></i></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Perguntas Frequentes - FAQ Accordion */}
        <h2 className="title-card-faq">Perguntas Frequentes</h2>

        <section className="section-faq">
          <div className="wrap" id="conteudo">
            <section className="faq" id="faq" aria-label="Perguntas Frequentes">
              {faqItems.map((item, index) => (
                <article className="item" key={index}>
                  <h2>
                    <button
                      className="accordion-trigger"
                      aria-expanded={openFaqIndex === index}
                      aria-controls={`resposta-${index}`}
                      id={`pergunta-${index}`}
                      onClick={() => toggleFaq(index)}
                    >
                      <span className="question">{item.question}</span>
                      <span className="icon" aria-hidden="true">
                        <i className={`fa-solid ${openFaqIndex === index ? "fa-minus" : "fa-plus"} plus`}></i>
                      </span>
                    </button>
                  </h2>

                  <div
                    className={`panel ${openFaqIndex === index ? "active" : ""}`}
                    id={`resposta-${index}`}
                    role="region"
                    aria-labelledby={`pergunta-${index}`}
                    style={{ maxHeight: openFaqIndex === index ? "300px" : "0" }}
                  >
                    <div className="panel-inner">
                      {item.answer}
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="footer">
        <div className="footer-social">
          <a className="footer-social-link" href="#"><i className="fa-brands fa-facebook-f"></i></a>
          <a className="footer-social-link" href="#"><i className="fa-brands fa-instagram"></i></a>
          <a className="footer-social-link" href="#"><i className="fa-brands fa-youtube"></i></a>
          <a className="footer-social-link" href="#"><i className="fa-brands fa-x-twitter"></i></a>
        </div>

        <ul className="footer-menu">
          <li className="footer-item"><a className="footer-link" href="/">Home</a></li>
          <li className="footer-item"><a className="footer-link" href="/sobre">Sobre</a></li>
          <li className="footer-item"><a className="footer-link" href="/login">Login</a></li>
          <li className="footer-item"><a className="footer-link" href="/cadastro">Cadastro</a></li>
          <li className="footer-item"><a className="footer-link" href="/formulario">Formulário</a></li>
          <li className="footer-item"><a className="footer-link" href="/busca-perfil">Busca Perfil</a></li>
          <li className="footer-item"><a className="footer-link" href="/perfil">Perfil</a></li>
        </ul>
      </footer>

      <div className="copyright">
        <p className="text-copyright">
          © 2025 MedTrack — Saúde digital com inteligência. Todos os direitos reservados.
        </p>
      </div>

      <VLibras />

    </>
  );
}

export default Sobre;