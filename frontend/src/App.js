import { useState } from 'react';

function App() {
  const [cuenta, setCuenta] = useState('');
  const [datos, setDatos] = useState(null);

  const consultarCuenta = async () => {
    const res = await fetch(`http://localhost:3000/api/cuenta/${cuenta}`);
    const data = await res.json();
    setDatos(data);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Banco Nexus</h2>

      <input
        placeholder="Número de cuenta"
        value={cuenta}
        onChange={(e) => setCuenta(e.target.value)}
      />

      <button onClick={consultarCuenta}>
        Consultar
      </button>

      {datos && (
        <div>
          <h3>Saldo: ${datos.cuenta.saldo}</h3>

          <h4>Transacciones:</h4>
          <ul>
            {datos.transacciones.map((t, i) => (
              <li key={i}>
                {t.tipo} - ${t.monto}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  ); 
}

export default App;


