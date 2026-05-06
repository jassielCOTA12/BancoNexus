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

  res.json({
    cuenta: cuentaData,
    transacciones
  });
});

app.listen(3000, () => {
  console.log(' Backend corriendo en http://localhost:3000');
});