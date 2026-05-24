import { useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';

function App() {
  const [cuenta, setCuenta] = useState('');
  const [montoOperacion, setMontoOperacion] = useState('');
  const [datosCuenta, setDatosCuenta] = useState(null);
  const [datosGrafica, setDatosGrafica] = useState([]); 
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [alertaRed, setAlertaRed] = useState(''); 

  // Función interceptora para detectar latencia o caídas de BD
  const fetchConTimeout = async (url, opciones = {}, tiempoLimite = 1000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), tiempoLimite);
    
    try {
      const response = await fetch(url, { ...opciones, signal: controller.signal });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      if (error.name === 'AbortError') {
        throw new Error('Alerta de Latencia: El servidor está tardando demasiado.');
      }
      throw new Error('Error de conexión de red. El servidor backend o la base de datos están caídos.');
    }
  };

  // Función para Consultar
  const consultarCuenta = async (numeroCuenta = cuenta) => {
    try {
      setError('');
      setMensajeExito('');
      setAlertaRed(''); 
      
      const resCuenta = await fetchConTimeout(`http://localhost:3000/api/cuenta/${numeroCuenta}`);
      if (!resCuenta.ok) throw new Error('No se encontró la cuenta.');
      const dataCuenta = await resCuenta.json();
      setDatosCuenta(dataCuenta);

      const resHistorial = await fetchConTimeout(`http://localhost:3000/api/historial/${numeroCuenta}`);
      const dataHistorial = await resHistorial.json();
      const formateado = dataHistorial.map(t => {
        const fechaObj = new Date(t.fecha);
        return {
          fecha: fechaObj.toLocaleString(), 
          saldo: t.saldo
        };
      });
      
      setDatosGrafica(formateado);
      
    } catch (err) {
      if (err.message.includes('Latencia') || err.message.includes('conexión')) {
        setAlertaRed(err.message);
      } else {
        setError(err.message);
      }
      setDatosCuenta(null);
      setDatosGrafica([]);
    }
  };

  // Función para Depositar o Retirar
  const realizarOperacion = async (tipoOperacion) => {
    try {
      setError('');
      setMensajeExito('');
      setAlertaRed('');
      
      const monto = parseFloat(montoOperacion);
      if (!monto || monto <= 0) throw new Error('Ingresa un monto válido mayor a 0');

      const res = await fetchConTimeout(`http://localhost:3000/api/${tipoOperacion}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cuenta: datosCuenta.cuenta.cuenta, 
          monto: monto 
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      const data = await res.json();
      setMensajeExito(data.mensaje);
      setMontoOperacion('');
      
      consultarCuenta(datosCuenta.cuenta.cuenta);

    } catch (err) {
      if (err.message.includes('Latencia') || err.message.includes('conexión')) {
        setAlertaRed(err.message);
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="banco-container">
      <header className="banco-header">
        <h1>Banco Nexus</h1>
        <p>Tu portal financiero seguro</p>
      </header>

      <main className="banco-main">
        {/* BANNER DE ALERTA DE SISTEMA DISTRIBUIDO */}
        {alertaRed && (
          <div className="alerta-red">
            <strong>⚠️ FALLO DE RED DISTRIBUIDA:</strong> <br/>
            {alertaRed}
          </div>
        )}

        <section className="panel-consulta">
          <h2>Consulta de Cuenta</h2>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Número de cuenta (Ej. 001)" 
              value={cuenta}
              onChange={(e) => setCuenta(e.target.value)}
            />
            <button onClick={() => consultarCuenta(cuenta)}>Buscar</button>
          </div>

          {error && <p className="mensaje-error">{error}</p>}
          {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
        </section>

        {datosCuenta && (
          <>
            <div className="resultados-consulta">
              <div className="info-cliente">
                <p><strong>Titular:</strong> {datosCuenta.cliente.nombre}</p>
                <p><strong>CURP:</strong> {datosCuenta.cliente.curp}</p>
              </div>
              <div className="info-saldo">
                <p>Saldo Actual</p>
                <h3>${datosCuenta.cuenta.saldo}</h3>
              </div>
            </div>

            <section className="panel-operaciones">
              <h2>Realizar Movimiento</h2>
              <div className="input-group">
                <input 
                  type="number" 
                  placeholder="Monto a operar ($)" 
                  value={montoOperacion}
                  onChange={(e) => setMontoOperacion(e.target.value)}
                />
                <button className="btn-deposito" onClick={() => realizarOperacion('deposito')}>Depositar</button>
                <button className="btn-retiro" onClick={() => realizarOperacion('retiro')}>Retirar</button>
              </div>
            </section>

            <section className="panel-grafica">
              <h2>Evolución de Saldo</h2>
              <div style={{ width: '100%', height: 250, marginTop: '20px' }}>
                <ResponsiveContainer>
                  <LineChart data={datosGrafica}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" style={{ fontSize: '12px' }}/>
                    <YAxis style={{ fontSize: '12px' }} domain={['dataMin - 1000', 'dataMax + 1000']}/>
                    <Tooltip />
                    <Line type="monotone" dataKey="saldo" stroke="#1e3a8a" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;