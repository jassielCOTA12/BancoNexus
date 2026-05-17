const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

const registrarTransaccion = async (cuenta, monto, tipo, sucursal) => {

  try {

    await client.connect();

    const db = client.db('banco_nexus');

    const transacciones = db.collection('transacciones');
    const cuentas = db.collection('cuentas');

    const nueva = {
      cuenta,
      monto,
      tipo,
      sucursal,
      fecha: new Date().toISOString()
    };

    await transacciones.insertOne(nueva);

    const operador = tipo === 'deposito' ? 1 : -1;

    await cuentas.updateOne(
      { cuenta },
      { $inc: { saldo: operador * monto } }
    );

    console.log(`Transacción realizada en ${sucursal}`);

  } catch (error) {

    console.error(error);

  } finally {

    await client.close();

  }
};

registrarTransaccion('002', 500, 'retiro', 'GDL');