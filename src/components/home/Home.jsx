import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import LogoClaro from "../../assets/images/logo-claro.svg";
import ImagemHeader from "../../assets/images/imagem-header-home.svg";
import ImagemInfo from "../../assets/images/imagem-info-home.svg";
import Testemunha1 from "../../assets/images/imagem-testemunha-1.jpg";
import Testemunha2 from "../../assets/images/imagem-testemunha-2.jpg";
import Testemunha3 from "../../assets/images/imagem-testemunha-3.jpg";
import Testemunha4 from "../../assets/images/imagem-testemunha-4.jpg";
import Testemunha5 from "../../assets/images/imagem-testemunha-5.jpg";
import Testemunha6 from "../../assets/images/imagem-testemunha-6.jpg";
import Testemunha7 from "../../assets/images/imagem-testemunha-7.jpg";
import Testemunha8 from "../../assets/images/imagem-testemunha-8.jpg";

import { initDarkMode, toggleDarkMode } from "../../utils/darkMode";
import { initScrollButtons } from "../../utils/scrollButtons";
import { initNavbarMobile } from "../../utils/navbarMobile";
import { initKeyboardShortcuts } from "../../utils/keyboardShortcuts";
import { initFontSizeControls } from "../../utils/fontSize";

function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // === Inicializações ===
    initDarkMode(setDarkMode);
    const cleanupNavbar = initNavbarMobile();
    const cleanupScroll = initScrollButtons();
    const cleanupShortcuts = initKeyboardShortcuts(navigate);

    // === Fonte ===
    const fontControls = initFontSizeControls();
    document.getElementById("decrease")?.addEventListener("click", fontControls.decrease);
    document.getElementById("increase")?.addEventListener("click", fontControls.increase);
    document.getElementById("reset")?.addEventListener("click", fontControls.reset);

    // === Cleanup ===
    return () => {
      if (cleanupNavbar) cleanupNavbar();
      if (cleanupScroll) cleanupScroll();
      if (cleanupShortcuts) cleanupShortcuts();
      document.getElementById("decrease")?.removeEventListener("click", fontControls.decrease);
      document.getElementById("increase")?.removeEventListener("click", fontControls.increase);
      document.getElementById("reset")?.removeEventListener("click", fontControls.reset);
    };
  }, [navigate]);

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
          <img className="navbar-logo" src={LogoClaro} alt="Logo MedTrack" />
          <p>MedTrack</p>
        </div>

        {/* Links do menu */}
        <ul className="navbar-list">
          <li><a className="navbar-item" href="/">Home</a></li>
          <li><a className="navbar-item" href="/sobre">Sobre</a></li>
        </ul>

        {/* Botões do menu */}
        <div className="navbar-btn">
          <a className="navbar-btn-item" href="/login">Login</a>
          <a className="navbar-btn-item" href="/cadastro">Cadastro</a>
          <a className="navbar-btn-item" href="/formulario">Formulário</a>

           {/* Botão dark mode */}
      <button
            id="dark-mode-toggle"
            className="navbar-btn-item"
            onClick={() => toggleDarkMode(darkMode, setDarkMode)}
          >
            <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
          </button>

          <a className="navbar-btn-profile" href="/perfil">
            <i className="fa-solid fa-user"></i>
          </a>

          {/* Botão menu mobile */}
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

      {/* Header */}
      <main>
        <div className="div-header my-2 mx-1">
          <div className="row align-items-center">
            {/* Texto do Header */}
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold title-header">
                Sua Vida Organizada para <span>Emergências</span>
              </h1>
              <p className="text-header">
                Em momentos críticos, cada segundo conta. Nossa planilha de 
                emergência foi criada para reunir todas
                as informações essenciais de forma clara e acessível,
                ajudando você e seus entes queridos a agirem rápido quando mais importa.
                Com campos personalizados para contatos, histórico médico, alergias e orientações,
                garantimos que dados importantes estejam sempre à mão,
                facilitando o atendimento e salvando vidas.
              </p>

              {/* Indicadores de Impacto */}
              <div className="d-flex flex-wrap gap-3 mt-4 header-info">
                <div className="text-center header-section-info">
                  <p className="display-5 fw-bold header-number">700+</p>
                  <p className="header-info-text">Vidas salvas em emergências</p>
                </div>
                <div className="text-center header-section-info">
                  <p className="display-5 fw-bold header-number">3s</p>
                  <p className="header-info-text">Acesso rápido a dados</p>
                </div>
                <div className="text-center header-section-info">
                  <p className="display-5 fw-bold header-number">98%</p>
                  <p className="header-info-text">Sucesso em emergências</p>
                </div>
              </div>
            </div>

            <div className="col-lg-6 text-center">
               <img
        className="img-fluid image-header"
        src={ImagemHeader}
        alt="Imagem de um médico com uma prancheta"
      />
      
            </div>
          </div>
        </div>

        
<div className="container-fluid my-4 px-4">

<h2 className="title-card-info">Porque somos os melhores</h2>

<div className="row content-info-destaque justify-content-center">

<div className="col-md-6 col-lg-3 mb-4">
<section className="card-info-destaque">
<span className="icon-info-destaque">
<i className="fa-solid fa-house-chimney-medical"></i>
</span>
<p className="title-info-destaque">Acesso Rápido</p>
<p className="text-info-destaque">
Nosso sistema fornece dados de emergência em tempo real, garantindo agilidade e precisão quando cada segundo importa.
</p>
</section>
</div>

<div className="col-md-6 col-lg-3 mb-4">
<section className="card-info-destaque">
<span className="icon-info-destaque">
<i className="fa-solid fa-laptop-medical"></i>
</span>
<p className="title-info-destaque">Tecnologia Segura e Confiável</p>
<p className="text-info-destaque">
Usamos plataformas seguras que protegem seus dados e garantem total privacidade, para você confiar.
</p>
</section>
</div>

<div className="col-md-6 col-lg-3 mb-4">
<section className="card-info-destaque">
<span className="icon-info-destaque">
<i className="fa-solid fa-heart-pulse"></i>
</span>
<p className="title-info-destaque">Equipe Multidisciplinar</p>
<p className="text-info-destaque">
Profissionais experientes em saúde e tecnologia oferecem soluções focadas no cuidado e na segurança do paciente.
</p>
</section>
</div>

<div className="col-md-6 col-lg-3 mb-4">
<section className="card-info-destaque">
<span className="icon-info-destaque">
<i className="fa-solid fa-briefcase-medical"></i>
</span>
<p className="title-info-destaque">Emergências</p>
<p className="text-info-destaque">
Acesso rápido e seguro ao histórico médico para decisões ágeis em emergências.
</p>
</section>
</div>
</div>
</div>

<h2 className="title-card-testimonial text-center mb-4">
  Testemunhos reais com nossa solução
</h2>

<div
  id="carouselTestemunhos"
  className="carousel slide carousel-fade container-fluid my-5 px-2"
  data-bs-ride="carousel"
  data-bs-interval="4000"
  data-bs-pause="false"
>
  <div className="carousel-inner">

   {/* ----------------- SLIDE 1 ----------------- */}
<div className="carousel-item active">
  <div className="row g-5 justify-content-center">

    {/* 1 */}
    <div className="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
      <section className="card-testimonial">
        <i className="card-quote-testimonial fa-solid fa-quote-left"></i>
              <img src={Testemunha1} alt="Renato Souza" className="card-image-testimonial"/>

        <hr className="team-divider-testimonial" />
        <p className="card-name-testimonial">Renato Souza</p>
        <div className="testimonial-start">
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
        </div>
        <p className="card-text-testimonial">
          "Melhorou muito nossa comunicação com pacientes."
        </p>
      </section>
    </div>

    {/* 2 */}
    <div className="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
      <section className="card-testimonial">
        <i className="card-quote-testimonial fa-solid fa-quote-left"></i>
              <img src={Testemunha2} alt="Camila Duarte" className="card-image-testimonial"/>

        <hr className="team-divider-testimonial" />
        <p className="card-name-testimonial">Camila Duarte</p>
        <div className="testimonial-start">
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
        </div>
        <p className="card-text-testimonial">
          "Atendimento rápido e informações confiáveis."
        </p>
      </section>
    </div>

    {/* 3 */}
    <div className="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
      <section className="card-testimonial">
        <i className="card-quote-testimonial fa-solid fa-quote-left"></i>
              <img src={Testemunha3} alt="Lucas Almeida" className="card-image-testimonial"/>

        <hr className="team-divider-testimonial" />
        <p className="card-name-testimonial">Lucas Almeida</p>
        <div className="testimonial-start">
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
        </div>
        <p className="card-text-testimonial">
          "Tecnologia aplicada com responsabilidade."
        </p>
      </section>
    </div>

    {/* 4 */}
    <div className="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
      <section className="card-testimonial">
        <i className="card-quote-testimonial fa-solid fa-quote-left"></i>
                <img src={Testemunha4} alt="Juliana Alves" className="card-image-testimonial"/>

        <hr className="team-divider-testimonial" />
        <p className="card-name-testimonial">Juliana Alves</p>
        <div className="testimonial-start">
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
        </div>
        <p className="card-text-testimonial">
          "Em emergências, fez toda diferença!"
        </p>
      </section>
    </div>

  </div>
</div>

    {/* ----------------- SLIDE 2 ----------------- */}
    <div className="carousel-item">
      <div className="row g-5 justify-content-center">

        {/* 5 */}
        <div className="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
          <section className="card-testimonial">
            <i className="card-quote-testimonial fa-solid fa-quote-left"></i>
              <img src={Testemunha5} alt="Yasmin Costa" className="card-image-testimonial"/>

            <hr className="team-divider-testimonial" />
            <p className="card-name-testimonial">Yasmin Costa</p>
            <div className="testimonial-start">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
            </div>
            <p className="card-text-testimonial">
              "Sistema intuitivo e muito eficiente."
            </p>
          </section>
        </div>

        {/* 6 */}
        <div className="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
          <section className="card-testimonial">
            <i className="card-quote-testimonial fa-solid fa-quote-left"></i>
               <img src={Testemunha6} alt="Eduardo Lima" className="card-image-testimonial"/>

            <hr className="team-divider-testimonial" />
            <p className="card-name-testimonial">Eduardo Lima</p>
            <div className="testimonial-start">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
            </div>
            <p className="card-text-testimonial">
              "Muito mais organização no atendimento."
            </p>
          </section>
        </div>

        {/* 7 */}
        <div className="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
          <section className="card-testimonial">
            <i className="card-quote-testimonial fa-solid fa-quote-left"></i>
            <img src={Testemunha7} alt="Helena Rocha" className="card-image-testimonial"/>

            <hr className="team-divider-testimonial" />
            <p className="card-name-testimonial">Helena Rocha</p>
            <div className="testimonial-start">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
            </div>
            <p className="card-text-testimonial">
              "Plataforma segura e confiável."
            </p>
          </section>
        </div>

        {/* 8 */}
        <div className="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
          <section className="card-testimonial">
            <i className="card-quote-testimonial fa-solid fa-quote-left"></i>
          <img src={Testemunha8} alt="Ricardo Martins" className="card-image-testimonial"/>

            <hr className="team-divider-testimonial"/>
            <p className="card-name-testimonial">Ricardo Martins </p>
            <div className="testimonial-start">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
            </div>
            <p className="card-text-testimonial">
              "Recomendo totalmente para clínicas e hospitais."
            </p>
          </section>
        </div>

      </div>
    </div>

  </div>
</div>

  <div className="container-fluid my-4 px-4">
    <div className="emergency-header" role="region" aria-labelledby="emergency-title">

      <div className="header-layout">

        {/* Coluna esquerda */}
        <section>
          <h1 id="emergency-title" className="title-header">
            Central de Emergências
          </h1>

          <p className="lead-desc">
            Informações rápidas e práticas: contatos, primeiros socorros, kit e hospitais próximos.
          </p>

          <div className="row">

            <div className="col-12 col-md-6 mb-3">
              <div className="emergency-card h-100">
                <h3>Contatos de Emergência</h3>
                <ul className="list-unstyled mb-0">
                  <li>SAMU - 192</li>
                  <li>Bombeiros - 193</li>
                  <li>Polícia - 190</li>
                </ul>
              </div>
            </div>

            <div className="col-12 col-md-6 mb-3">
              <div className="emergency-card h-100">
                <h3>Dicas de Primeiros Socorros</h3>
                <ul className="list-unstyled mb-0">
                  <li>Parar hemorragias com compressão direta</li>
                  <li>Colocar vítima inconsciente de lado</li>
                  <li>Não mover vítimas com fraturas graves</li>
                </ul>
              </div>
            </div>

            <div className="col-12 col-md-6 mb-3">
              <div className="emergency-card h-100">
                <h3>Kit de Primeiros Socorros</h3>
                <ul className="list-unstyled mb-0">
                  <li>Curativos</li>
                  <li>Gaze</li>
                  <li>Antisséptico</li>
                  <li>Esparadrapo</li>
                  <li>Tesoura</li>
                </ul>
              </div>
            </div>

            <div className="col-12 col-md-6 mb-3">
              <div className="emergency-card h-100">
                <h3>Hospitais Próximos</h3>
                <ul className="list-unstyled mb-0">
                  <li>Hospital Central - Rua Principal, 123</li>
                  <li>Hospital São João - Av. Saúde, 456</li>
                  <li>Pronto Socorro Regional - Rua Emergência, 789</li>
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* Coluna direita */}
        <aside className="image-header-container">
          <img src={ImagemInfo} alt="Imagem ilustrativa de emergência" className="image-header" />
        </aside>

      </div>
    </div>
  </div>

  {/* ----------------- FOOTER ----------------- */}

  <footer className="footer">

    <div className="footer-social">
      <a className="footer-social-link" href="/"><i className="fa-brands fa-facebook-f"></i></a>
      <a className="footer-social-link" href="/"><i className="fa-brands fa-instagram"></i></a>
      <a className="footer-social-link" href="/"><i className="fa-brands fa-youtube"></i></a>
      <a className="footer-social-link" href="/"><i className="fa-brands fa-x-twitter"></i></a>
    </div>

    <ul className="footer-menu">
      <li className="footer-item">
        <a className="footer-link" href="/">Home</a>
      </li>

      <li className="footer-item">
        <a className="footer-link" href="/sobre">Sobre</a>
      </li>

      <li className="footer-item">
        <a className="footer-link" href="/login">Login</a>
      </li>

      <li className="footer-item">
        <a className="footer-link" href="/cadastro">Cadastro</a>
      </li>

      <li className="footer-item">
        <a className="footer-link" href="/formulario">Formulário</a>
      </li>

      <li className="footer-item">
        <a className="footer-link" href="/busca-perfil">Busca Perfil</a>
      </li>

      <li className="footer-item">
        <a className="footer-link" href="/perfil">Perfil</a>
      </li>
    </ul>
  </footer>

  <div className="copyright">
    <p className="text-copyright">
      © 2025 MedTrack — Saúde digital com inteligência. Todos os direitos reservados.
    </p>
  </div>

      </main>
    </>
  );
}

export default Home;