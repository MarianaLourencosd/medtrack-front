import React from "react";
import "./sobre.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Sobre() {
  return (
    <>
      {/* Botão Voltar ao Topo */}
      <button id="btnTopo" title="Voltar ao topo">
        <i className="fa-solid fa-arrow-up"></i>
      </button>

      {/* Navbar Desktop */}
      <nav className="navbar">
        <div className="logotipo">
          <img className="navbar-logo" src="/logo-claro.svg" alt="Logo MedTrack" />
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

          {/* Ícone modo claro/escuro */}
          <button id="dark-mode-toggle" className="navbar-btn-item">
            <i className="fa-solid fa-moon"></i>
          </button>

          <a className="navbar-btn-profile" href="/perfil">
            <i className="fa-solid fa-user"></i>
          </a>

          {/* Menu Mobile */}
          <button className="nav-btn-items" id="nav-btn-toggle">
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
      {/* HEADER */}
      <div className="div-header my-2 mx-1">
        <div className="row align-items-center">

          {/* TEXTO */}
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

            {/* INDICADORES */}
            <div className="d-flex flex-wrap gap-3 mt-4 header-info">
              <div className="text-center header-section-info">
                <p className="display-5 fw-bold header-number">2025</p>
                <p className="header-info-text">Ano de fundação</p>
              </div>

              <div className="text-center header-section-info">
                <p className="display-5 fw-bold header-number">30k+</p>
                <p className="header-info-text">
                  Pacientes e profissionais unidos
                </p>
              </div>

              <div className="text-center header-section-info">
                <p className="display-5 fw-bold header-number">10k+</p>
                <p className="header-info-text">Pacientes conectados</p>
              </div>
            </div>
          </div>

          {/* IMAGEM */}
          <div className="col-lg-6 text-center">
            <img
              className="img-fluid image-header"
              src="/imagens/imagem-header-sobre.svg"
              alt="Imagem de um médico em telechamada"
            />
          </div>
        </div>
      </div>

      {/* CARDS */}
      <div className="container-fluid my-4 px-4">
        <h2 className="title-card-info">Diretrizes da nossa atuação</h2>

        <div className="row content-info-destaque justify-content-center">

          {/* CARD 1 */}
          <div className="col-md-6 col-lg-3 mb-4">
            <section className="card-info-destaque">
              <span className="icon-info-destaque">
                <i className="fa-solid fa-chart-simple"></i>
              </span>
              <p className="title-info-destaque">Visão</p>
              <p className="text-info-destaque">
                Ser referência em tecnologia para a saúde digital,
                contribuindo para um futuro onde a informação salva vidas e
                o cuidado ultrapassa barreiras físicas.
              </p>
            </section>
          </div>

          {/* CARD 2 */}
          <div className="col-md-6 col-lg-3 mb-4">
            <section className="card-info-destaque">
              <span className="icon-info-destaque">
                <i className="fa-solid fa-check"></i>
              </span>
              <p className="title-info-destaque">Missão</p>
              <p className="text-info-destaque">
                Desenvolver ferramentas inovadoras que conectem pessoas e
                profissionais da saúde, promovendo um atendimento mais ágil,
                humanizado e baseado em informações confiáveis.
              </p>
            </section>
          </div>

          {/* CARD 3 */}
          <div className="col-md-6 col-lg-3 mb-4">
            <section className="card-info-destaque">
              <span className="icon-info-destaque">
                <i className="fa-solid fa-bars"></i>
              </span>
              <p className="title-info-destaque">Valores</p>
              <p className="text-info-destaque">
                Nossos valores são baseados no cuidado com a vida, na inovação com propósito,
                na proteção dos dados, na acessibilidade para todos e na colaboração entre pessoas e equipes.
              </p>
            </section>
          </div>

          {/* CARD 4 */}
          <div className="col-md-6 col-lg-3 mb-4">
            <section className="card-info-destaque">
              <span className="icon-info-destaque">
                <i className="fa-solid fa-lock"></i>
              </span>
              <p className="title-info-destaque">Privacidade</p>
              <p className="text-info-destaque">
                Nossa prioridade é a privacidade. Mantemos os dados protegidos,
                garantindo transparência, confiança, segurança e integridade.
              </p>
            </section>
          </div>

        </div>
      </div>

      {/* EMERGÊNCIA */}
      <div className="container-fluid my-4 px-4">
        <div className="emergency-header" role="region" aria-labelledby="emergency-title">
          <div className="header-layout">

            {/* ESQUERDA */}
            <section>
              <h1 id="emergency-title" className="title-header">
                Central de Emergências
              </h1>

              <p className="lead-desc">
                Informações rápidas e práticas sobre o projeto: problemas, ideias,
                desenvolvimento e impacto.
              </p>

              <div className="row">

                <div className="col-12 col-md-6 mb-3">
                  <div className="emergency-card h-100">
                    <h3>1. O Problema Identificado</h3>
                    <ul className="list-unstyled mb-0">
                      <li>Falta acesso rápido ao histórico do paciente.</li>
                      <li>Perda de tempo buscando informações críticas.</li>
                      <li>Riscos aumentados por registros não confiáveis.</li>
                    </ul>
                  </div>
                </div>

                <div className="col-12 col-md-6 mb-3">
                  <div className="emergency-card h-100">
                    <h3>2. A Ideia Inicial</h3>
                    <ul className="list-unstyled mb-0">
                      <li>Prancheta médica digital acessível em qualquer dispositivo.</li>
                      <li>Dados essenciais disponíveis em segundos.</li>
                      <li>Integração com SAMU e hospitais para agilidade.</li>
                    </ul>
                  </div>
                </div>

                <div className="col-12 col-md-6 mb-3">
                  <div className="emergency-card h-100">
                    <h3>3. O Desenvolvimento</h3>
                    <ul className="list-unstyled mb-0">
                      <li>Equipe multidisciplinar de desenvolvedores e médicos.</li>
                      <li>Requisitos focados em situações reais de urgência.</li>
                      <li>Ajustes para plataforma simples e intuitiva.</li>
                    </ul>
                  </div>
                </div>

                <div className="col-12 col-md-6 mb-3">
                  <div className="emergency-card h-100">
                    <h3>4. O Impacto Esperado</h3>
                    <ul className="list-unstyled mb-0">
                      <li>Salvar vidas com acesso rápido a informações críticas.</li>
                      <li>Reduzir erros em atendimentos de emergência.</li>
                      <li>Melhorar o atendimento de emergências médicas no Brasil.</li>
                    </ul>
                  </div>
                </div>

              </div>
            </section>

            {/* DIREITA */}
            <aside className="image-header-container">
              <img
                src="/imagens/imagem-info-sobre.svg"
                alt="Imagem ilustrativa de emergência"
                className="image-header"
              />
            </aside>

          </div>
        </div>
      </div>


<h2 className="title-card-team text-center my-5">
  Sobre os Desenvolvedores
</h2>

<div className="container my-5 px-2">
  <div className="row justify-content-center g-4">

    {/* Card 1 */}
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
      <div className="card-team text-center">
        <div className="card-team-cover"></div>
        <img className="card-team-image" src="/imagens/dev-nicolas.png" alt="Imagem de Nicolas Alves" />
        <hr className="team-divider" />
        <p className="card-team-name">Nicolas Alves</p>
        <p className="card-team-text">Programador Back End</p>
        <div className="team-social-media">
          <a href="#" className="team-social-link"><i className="fa-brands fa-instagram"></i></a>
          <a href="#" className="team-social-link"><i className="fa-brands fa-linkedin-in"></i></a>
          <a href="#" className="team-social-link"><i className="fa-brands fa-x-twitter"></i></a>
        </div>
      </div>
    </div>

    {/* Card 2 */}
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
      <div className="card-team text-center">
        <div className="card-team-cover"></div>
        <img className="card-team-image" src="/imagens/dev-joao.png" alt="Imagem de João Gabriel Ferreira" />
        <hr className="team-divider" />
        <p className="card-team-name">João Gabriel Ferreira</p>
        <p className="card-team-text">Modelador de Dados</p>
        <div className="team-social-media">
          <a href="#" className="team-social-link"><i className="fa-brands fa-instagram"></i></a>
          <a href="#" className="team-social-link"><i className="fa-brands fa-linkedin-in"></i></a>
          <a href="#" className="team-social-link"><i className="fa-brands fa-x-twitter"></i></a>
        </div>
      </div>
    </div>

    {/* Card 3 */}
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
      <div className="card-team text-center">
        <div className="card-team-cover"></div>
        <img className="card-team-image" src="/imagens/dev-jose.png" alt="Imagem de José Henrique Bessa" />
        <hr className="team-divider" />
        <p className="card-team-name">José Henrique Bessa</p>
        <p className="card-team-text">Designer de Interfaces</p>
        <div className="team-social-media">
          <a href="#" className="team-social-link"><i className="fa-brands fa-instagram"></i></a>
          <a href="#" className="team-social-link"><i className="fa-brands fa-linkedin-in"></i></a>
          <a href="#" className="team-social-link"><i className="fa-brands fa-x-twitter"></i></a>
        </div>
      </div>
    </div>

    {/* Card 4 */}
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
      <div className="card-team text-center">
        <div className="card-team-cover"></div>
        <img className="card-team-image" src="/imagens/dev-natalia.jpeg" alt="Imagem de Natália Rodrigues" />
        <hr className="team-divider" />
        <p className="card-team-name">Natália Rodrigues</p>
        <p className="card-team-text">Engenheira de Software</p>
        <div className="team-social-media">
          <a href="#" className="team-social-link"><i className="fa-brands fa-instagram"></i></a>
          <a href="#" className="team-social-link"><i className="fa-brands fa-linkedin-in"></i></a>
          <a href="#" className="team-social-link"><i className="fa-brands fa-x-twitter"></i></a>
        </div>
      </div>
    </div>

    {/* Card 5 */}
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
      <div className="card-team text-center">
        <div className="card-team-cover"></div>
        <img className="card-team-image" src="/imagens/dev-sophia.png" alt="Imagem de Sophia Cavallaro" />
        <hr className="team-divider" />
        <p className="card-team-name">Sophia Cavallaro</p>
        <p className="card-team-text">Programadora Web</p>
        <div className="team-social-media">
          <a href="#" className="team-social-link"><i className="fa-brands fa-instagram"></i></a>
          <a href="#" className="team-social-link"><i className="fa-brands fa-linkedin-in"></i></a>
          <a href="#" className="team-social-link"><i className="fa-brands fa-x-twitter"></i></a>
        </div>
      </div>
    </div>

    {/* Card 6 */}
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
      <div className="card-team text-center">
        <div className="card-team-cover"></div>
        <img className="card-team-image" src="/imagens/dev-mariana.png" alt="Imagem de Mariana Lourenço" />
        <hr className="team-divider" />
        <p className="card-team-name">Mariana Lourenço</p>
        <p className="card-team-text">Programadora Web</p>
        <div className="team-social-media">
          <a href="#" className="team-social-link"><i className="fa-brands fa-instagram"></i></a>
          <a href="#" className="team-social-link"><i className="fa-brands fa-linkedin-in"></i></a>
          <a href="#" className="team-social-link"><i className="fa-brands fa-x-twitter"></i></a>
        </div>
      </div>
    </div>

    {/* Card 7 */}
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
      <div className="card-team text-center">
        <div className="card-team-cover"></div>
        <img className="card-team-image" src="/imagens/dev-fernanda.jpeg" alt="Imagem de Fernanda Garcia" />
        <hr className="team-divider" />
        <p className="card-team-name">Fernanda Garcia</p>
        <p className="card-team-text">Engenheira de Software</p>
        <div className="team-social-media">
          <a href="#" className="team-social-link"><i className="fa-brands fa-instagram"></i></a>
          <a href="#" className="team-social-link"><i className="fa-brands fa-linkedin-in"></i></a>
          <a href="#" className="team-social-link"><i className="fa-brands fa-x-twitter"></i></a>
        </div>
      </div>
    </div>

  </div>
</div>

</main>


  {/* ================= FOOTER ================= */}

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


export default Sobre;