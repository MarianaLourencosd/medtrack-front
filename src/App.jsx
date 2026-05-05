import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VLibras from "./utils/VLibras";

import Login from "./components/login/Login.jsx";
import Cadastro from "./components/cadastro/Cadastro.jsx";
import Perfil from "./components/perfil/Perfil.jsx";
import Formulario from "./components/formulario/Formulario.jsx";
import Home from "./components/home/Home.jsx";
import BuscaPerfil from "./components/buscaPerfil/buscaPerfil.jsx";
import Sobre from "./components/sobre/Sobre.jsx";

function App() {
  return (
    <Router>
      <VLibras /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/busca-perfil" element={<BuscaPerfil />} />
        <Route path="/sobre" element={<Sobre />} />
      </Routes>
    </Router>
  );
}

export default App;