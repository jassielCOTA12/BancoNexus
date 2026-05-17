// crearBaseDeDatos.js

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function crearBD() {
  try {
    await client.connect();

    console.log('Conectado a MongoDB');

    const db = client.db('banco_nexus');

    const clientes = db.collection('clientes');
    const cuentas = db.collection('cuentas');
    const transacciones = db.collection('transacciones');

    // Limpiar colecciones para evitar duplicados
    await clientes.deleteMany({});
    await cuentas.deleteMany({});
    await transacciones.deleteMany({});



    await clientes.insertMany([
      { nombre: 'Ana Ruiz', curp: 'RUAA900101MDFXXX01' },
      { nombre: 'Luis Pérez', curp: 'PELU850203HDFXXX02' },

      { nombre: 'Carlos López', curp: 'LOPC940315HDFRRS03' },
      { nombre: 'María Torres', curp: 'TORM960421MDFRRL04' },
      { nombre: 'Juan García', curp: 'GAJJ880730HDFMNN05' },
      { nombre: 'Sofía Hernández', curp: 'HESF990112MDFRPP06' },
      { nombre: 'Miguel Ramírez', curp: 'RAMM910805HDFTTD07' },
      { nombre: 'Fernanda Castro', curp: 'CAFN970614MDFLRS08' },
      { nombre: 'Ricardo Mendoza', curp: 'MERC930228HDFNVC09' },
      { nombre: 'Valeria Jiménez', curp: 'JIVA950909MDFBXS10' },
      { nombre: 'Daniel Ortega', curp: 'OEDN920501HDFQWE11' },
      { nombre: 'Patricia Navarro', curp: 'NAPT981220MDFGHJ12' },
      { nombre: 'Jorge Salinas', curp: 'SAJJ890411HDFZXC13' },
      { nombre: 'Lucía Moreno', curp: 'MOLU000105MDFJKL14' },
      { nombre: 'Eduardo Vargas', curp: 'VAEE940817HDFUIO15' }
    ]);

    await cuentas.insertMany([
      { cuenta: '001', cliente: 'RUAA900101MDFXXX01', saldo: 5000 },
      { cuenta: '002', cliente: 'PELU850203HDFXXX02', saldo: 8000 },

      { cuenta: '003', cliente: 'LOPC940315HDFRRS03', saldo: 3500 },
      { cuenta: '004', cliente: 'TORM960421MDFRRL04', saldo: 12000 },
      { cuenta: '005', cliente: 'GAJJ880730HDFMNN05', saldo: 4200 },
      { cuenta: '006', cliente: 'HESF990112MDFRPP06', saldo: 9800 },
      { cuenta: '007', cliente: 'RAMM910805HDFTTD07', saldo: 15000 },
      { cuenta: '008', cliente: 'CAFN970614MDFLRS08', saldo: 6400 },
      { cuenta: '009', cliente: 'MERC930228HDFNVC09', saldo: 2750 },
      { cuenta: '010', cliente: 'JIVA950909MDFBXS10', saldo: 8300 },
      { cuenta: '011', cliente: 'OEDN920501HDFQWE11', saldo: 5100 },
      { cuenta: '012', cliente: 'NAPT981220MDFGHJ12', saldo: 7400 },
      { cuenta: '013', cliente: 'SAJJ890411HDFZXC13', saldo: 9200 },
      { cuenta: '014', cliente: 'MOLU000105MDFJKL14', saldo: 3100 },
      { cuenta: '015', cliente: 'VAEE940817HDFUIO15', saldo: 11000 }
    ]);

    await transacciones.insertMany([
      {
        cuenta: '001',
        tipo: 'deposito',
        monto: 1000,
        sucursal: 'CDMX',
        fecha: new Date()
      },
      {
        cuenta: '002',
        tipo: 'retiro',
        monto: 500,
        sucursal: 'GDL',
        fecha: new Date()
      },
      {
        cuenta: '003',
        tipo: 'deposito',
        monto: 700,
        sucursal: 'LPZ',
        fecha: new Date()
      },
      {
        cuenta: '004',
        tipo: 'retiro',
        monto: 1200,
        sucursal: 'MTY',
        fecha: new Date()
      },
      {
        cuenta: '005',
        tipo: 'deposito',
        monto: 300,
        sucursal: 'CUN',
        fecha: new Date()
      },
      {
        cuenta: '006',
        tipo: 'deposito',
        monto: 950,
        sucursal: 'CDMX',
        fecha: new Date()
      },
      {
        cuenta: '007',
        tipo: 'retiro',
        monto: 400,
        sucursal: 'GDL',
        fecha: new Date()
      },
      {
        cuenta: '008',
        tipo: 'deposito',
        monto: 1500,
        sucursal: 'LPZ',
        fecha: new Date()
      },
      {
        cuenta: '009',
        tipo: 'retiro',
        monto: 250,
        sucursal: 'MTY',
        fecha: new Date()
      },
      {
        cuenta: '010',
        tipo: 'deposito',
        monto: 2000,
        sucursal: 'CUN',
        fecha: new Date()
      },
      {
        cuenta: '011',
        tipo: 'retiro',
        monto: 600,
        sucursal: 'CDMX',
        fecha: new Date()
      },
      {
        cuenta: '012',
        tipo: 'deposito',
        monto: 1000,
        sucursal: 'GDL',
        fecha: new Date()
      },
      {
        cuenta: '013',
        tipo: 'retiro',
        monto: 450,
        sucursal: 'LPZ',
        fecha: new Date()
      },
      {
        cuenta: '014',
        tipo: 'deposito',
        monto: 800,
        sucursal: 'MTY',
        fecha: new Date()
      },
      {
        cuenta: '015',
        tipo: 'deposito',
        monto: 5000,
        sucursal: 'CUN',
        fecha: new Date()
      }
    ]);

    console.log('Base de datos Banco Nexus creada correctamente');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Conexión cerrada');
  }
}

crearBD();