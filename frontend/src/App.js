import { useState } from 'react';

function App() {
  const [cuenta, setCuenta] = useState('');
  const [monto, setMonto] = useState('');
  const [datos, setDatos] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const mostrarMensaje = (texto, esError = false) => {
    if (esError) {
      setError(texto);
      setMensaje('');
    } else {
      setMensaje(texto);
      setError('');
    }
    setTimeout(() => {
      setMensaje('');
      setError('');
    }, 4000);
  };

  const consultarCuenta = async () => {
    if (!cuenta) {
      mostrarMensaje('Ingresa un número de cuenta', true);
      return;
    }
    try {
      const res = await fetch(`http://localhost:3000/api/cuenta/${cuenta}`);
      const data = await res.json();
      if (!res.ok) {
        mostrarMensaje(data.error || 'Error al consultar', true);
        setDatos(null);
        return;
      }
      setDatos(data);
      mostrarMensaje('Cuenta consultada correctamente');
    } catch (err) {
      mostrarMensaje('No se pudo conectar con el servidor', true);
    }
  };

  const depositar = async () => {
    if (!cuenta || !monto) {
      mostrarMensaje('Ingresa cuenta y monto', true);
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/deposito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cuenta, monto: Number(monto) })
      });
      const data = await res.json();
      if (!res.ok) {
        mostrarMensaje(data.error || 'Error en el depósito', true);
        return;
      }
      mostrarMensaje(`Depósito exitoso. Nuevo saldo: $${data.saldo}`);
      setMonto('');
      consultarCuenta();
    } catch (err) {
      mostrarMensaje('No se pudo conectar con el servidor', true);
    }
  };

  const retirar = async () => {
    if (!cuenta || !monto) {
      mostrarMensaje('Ingresa cuenta y monto', true);
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/retiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cuenta, monto: Number(monto) })
      });
      const data = await res.json();
      if (!res.ok) {
        mostrarMensaje(data.error || 'Error en el retiro', true);
        return;
      }
      mostrarMensaje(`Retiro exitoso. Nuevo saldo: $${data.saldo}`);
      setMonto('');
      consultarCuenta();
    } catch (err) {
      mostrarMensaje('No se pudo conectar con el servidor', true);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Banco Nexus</h2>

      <div style={{ marginBottom: '10px' }}>
        <input
          placeholder="Número de cuenta"
          value={cuenta}
          onChange={(e) => setCuenta(e.target.value)}
          style={{ padding: '8px', width: '200px', marginRight: '10px' }}
        />
        <button onClick={consultarCuenta} style={{ padding: '8px 16px' }}>
          Consultar
        </button>
      </div>

      {mensaje && <div style={{ color: 'green', marginBottom: '10px' }}>{mensaje}</div>}
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      {datos && (
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>Cliente: {datos.cliente?.nombre || 'Desconocido'}</h3>
          <h3>Saldo: ${datos.cuenta.saldo}</h3>

          <h4>Transacciones:</h4>
          <ul>
            {datos.transacciones.map((t, i) => (
              <li key={i}>
                {t.tipo} - ${t.monto} - {new Date(t.fecha).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
        <h4>Operaciones</h4>
        <input
          placeholder="Monto"
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          style={{ padding: '8px', width: '150px', marginRight: '10px' }}
        />
        <button onClick={depositar} style={{ padding: '8px 16px', marginRight: '10px' }}>
          Depositar
        </button>
        <button onClick={retirar} style={{ padding: '8px 16px' }}>
          Retirar
        </button>
      </div>
    </div>
  );
}

export default App;
