import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login/Login";
import Cadastro from "./components/Cadastro/Cadastro";
import Perfil from "./components/Perfil/Perfil";
import Formulario from "./components/Formulario/Formulario";
import Home from "./components/home/Home";
import BuscaPerfil from "./components/BuscaPerfil/BuscaPerfil";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/busca-perfil" element={<BuscaPerfil />} />
      </Routes>
    </Router>
  );
}

export default App;