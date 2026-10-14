import Layout from '../../components/layout/Layout';
import './AtaquesReales.css';

function AtaquesReales() {
  const urlSocDashboard = `http://${window.location.hostname}:5000`;

  return (
    <Layout>
      <div className="ataques-reales-pagina">
        <h1> Ataques Reales — Panel SOC</h1>
        <p className="ataques-reales-subtitulo">
          Monitoreo en tiempo real del honeypot Cowrie
        </p>

        <div className="ataques-reales-iframe-contenedor">
          <iframe
            src={urlSocDashboard}
            title="SOC Dashboard - Honeypot Cowrie"
            className="ataques-reales-iframe"
          />
        </div>
      </div>
    </Layout>
  );
}

export default AtaquesReales;
