// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute"; // ← VERIFIQUE este caminho

import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Cadastro from "./components/cadastro/Cadastro";
import Perfil from "./components/perfil/Perfil";
import Formulario from "./components/formulario/Formulario";
import BuscaPerfil from "./components/buscaPerfil/BuscaPerfil";
import Sobre from "./components/sobre/Sobre";
import AdminDashboard from "./components/admin/AdminDashboard";
import VisualizarPaciente from "./components/visualizarPaciente/VisualizarPaciente";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/sobre" element={<Sobre />} />

        <Route
          path="/formulario"
          element={
            <ProtectedRoute requiredRole="comum" redirectTo="/login">
              <Formulario />
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute requiredRole="comum" redirectTo="/login">
              <Perfil />
            </ProtectedRoute>
          }
        />

        <Route
          path="/busca-perfil"
          element={
            <ProtectedRoute requiredRole="saude" redirectTo="/">
              <BuscaPerfil />
            </ProtectedRoute>
          }
        />

        <Route
          path="/visualizar-paciente/:userId"
          element={
            <ProtectedRoute requiredRole="saude" redirectTo="/login">
              <VisualizarPaciente />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin" redirectTo="/">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;