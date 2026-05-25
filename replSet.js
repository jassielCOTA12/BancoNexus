/*
rs.initiate({
  _id: "rsBanco",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" }
  ]
})
*/

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017,localhost:27018,localhost:27019/banco_nexus?replicaSet=rsBanco', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado a la réplica de MongoDB');
}).catch(err => {
  console.error('Error de conexion:', err);
});
