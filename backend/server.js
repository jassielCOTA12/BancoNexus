const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function conectar() {
  await client.connect();
  console.log(' Conectado a MongoDB');
}
conectar();

const db = client.db('banco_nexus');

// Ruta para consultar cuenta
app.get('/api/cuenta/:cuenta', async (req, res) => {
  const cuenta = req.params.cuenta;

  const cuentaData = await db.collection('cuentas').findOne({ cuenta });

  if (!cuentaData) {
    return res.status(404).json({ error: 'Cuenta no encontrada' });
  }

  const transacciones = await db
    .collection('transacciones')
    .find({ cuenta })
    .toArray();

  const clienteData = await db.collection('clientes').findOne({ curp: cuentaData.cliente });

  res.json({
    cuenta: cuentaData,
    cliente: clienteData,
    transacciones
  });
});

// Ruta para depositar
app.post('/api/deposito', async (req, res) => {
  const { cuenta, monto } = req.body;

  if (!cuenta || monto == null) {
    return res.status(400).json({ error: 'Faltan campos: cuenta y monto son requeridos' });
  }

  if (typeof monto !== 'number' || monto <= 0) {
    return res.status(400).json({ error: 'El monto debe ser un número positivo' });
  }

  const cuentaData = await db.collection('cuentas').findOne({ cuenta });

  if (!cuentaData) {
    return res.status(404).json({ error: 'Cuenta no encontrada' });
  }

  const nuevoSaldo = cuentaData.saldo + monto;

  await db.collection('cuentas').updateOne(
    { cuenta },
    { $set: { saldo: nuevoSaldo } }
  );

  await db.collection('transacciones').insertOne({
    cuenta,
    tipo: 'deposito',
    monto,
    fecha: new Date()
  });

  res.json({ mensaje: 'Depósito exitoso', saldo: nuevoSaldo });
});

// Ruta para retirar
app.post('/api/retiro', async (req, res) => {
  const { cuenta, monto } = req.body;

  if (!cuenta || monto == null) {
    return res.status(400).json({ error: 'Faltan campos: cuenta y monto son requeridos' });
  }

  if (typeof monto !== 'number' || monto <= 0) {
    return res.status(400).json({ error: 'El monto debe ser un número positivo' });
  }

  const cuentaData = await db.collection('cuentas').findOne({ cuenta });

  if (!cuentaData) {
    return res.status(404).json({ error: 'Cuenta no encontrada' });
  }

  if (cuentaData.saldo < monto) {
    return res.status(400).json({ error: 'Saldo insuficiente' });
  }

  const nuevoSaldo = cuentaData.saldo - monto;

  await db.collection('cuentas').updateOne(
    { cuenta },
    { $set: { saldo: nuevoSaldo } }
  );

  await db.collection('transacciones').insertOne({
    cuenta,
    tipo: 'retiro',
    monto,
    fecha: new Date()
  });

  res.json({ mensaje: 'Retiro exitoso', saldo: nuevoSaldo });
});

app.listen(3000, () => {
  console.log(' Backend corriendo en http://localhost:3000');
});