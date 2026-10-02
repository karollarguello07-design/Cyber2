import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import HeroInicio from '../components/dashboard/HeroInicio';
import ModulosAprendizaje from '../components/dashboard/ModulosAprendizaje';
import PanelAtaques from '../components/honeypot/PanelAtaques';
import UltimosIntentos from '../components/honeypot/UltimosIntentos';
import SimulacionInteractiva from '../components/retos_puntuacion/SimulacionInteractiva';
import PerfilProgreso from '../components/retos_puntuacion/PerfilProgreso';

function Dashboard() {
  const { usuario } = useAuth();

  return (
    <Layout>
      <HeroInicio />
      <ModulosAprendizaje />
      <PanelAtaques />
      <UltimosIntentos />
      <SimulacionInteractiva />
      <PerfilProgreso usuario={usuario} />
    </Layout>
  );
}

export default Dashboard;
