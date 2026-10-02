import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RutaProtegida from './routes/RutaProtegida';
import Login from './pages/auth/Login';
import Registro from './pages/auth/Registro';
import Dashboard from './pages/Dashboard';
import CursosDisponibles from './pages/estudiante/CursosDisponibles';
import MisCursos from './pages/estudiante/MisCursos';
import Retos from './pages/estudiante/Retos';
import MiProgreso from './pages/estudiante/MiProgreso';
import RutaPorRol from './routes/RutaPorRol';
import PanelProfesor from './pages/profesor/PanelProfesor';
import PanelAdmin from './pages/admin/PanelAdmin';
import Ajustes from './pages/ajustes/Ajustes';
import DetalleModulo from './pages/estudiante/DetalleModulo';
import VerLeccion from './pages/estudiante/VerLeccion';
import AtaquesReales from './pages/estudiante/AtaquesReales';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route
            path="/dashboard"
            element={
              <RutaProtegida>
                <Dashboard />
              </RutaProtegida>
            }
          />
          <Route
            path="/cursos-disponibles"
            element={
              <RutaProtegida>
                <CursosDisponibles />
              </RutaProtegida>
            }
          />
          <Route
            path="/mis-cursos"
            element={
              <RutaProtegida>
                <MisCursos />
              </RutaProtegida>
            }
          />
          <Route
            path="/retos"
            element={
              <RutaProtegida>
                <Retos />
              </RutaProtegida>
            }
          />
	<Route
            path="/profesor"
            element={
              <RutaPorRol rolesPermitidos={['profesor']}>
                <PanelProfesor />
              </RutaPorRol>
            }
          />
         <Route
            path="/admin"
            element={
              <RutaPorRol rolesPermitidos={['admin']}>
                <PanelAdmin />
              </RutaPorRol>
            }
          />
	<Route
            path="/ajustes"
            element={
              <RutaProtegida>
                <Ajustes />
              </RutaProtegida>
            }
          />

          <Route
            path="/progreso"
            element={
              <RutaProtegida>
                <MiProgreso />
              </RutaProtegida>
            }
          />
	<Route
            path="/modulos/:moduloId"
            element={
              <RutaProtegida>
                <DetalleModulo />
              </RutaProtegida>
            }
          />
          <Route
            path="/lecciones/:leccionId"
            element={
              <RutaProtegida>
                <VerLeccion />
              </RutaProtegida>
            }
          />
          <Route
            path="/ataques"
            element={
              <RutaProtegida>
                <AtaquesReales />
              </RutaProtegida>
            }
          />
          <Route path="/" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
