
const { exec } = require('child_process');

function lanzarSucursal(archivo) {
  return new Promise((resolve, reject) => {
    exec(`node scripts/${archivo}`, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

async function orquestarBancoNexus() {
  console.log('================================================================');
  console.log('Lanzando transacciones concurrentes simultáneas - Banco Nexus');
  console.log('================================================================\n');

  const tiempoInicio = Date.now();

  try {
    const resultados = await Promise.all([
      lanzarSucursal('operacionSucursalCDMX.js'),
      lanzarSucursal('operacionSucursalCUN.js'),
      lanzarSucursal('operacionSucursalGDL.js'),
      lanzarSucursal('operacionSucursalLPZ.js'),
      lanzarSucursal('operacionSucursalMTY.js')
    ]);

    const tiempoFin = Date.now();

    resultados.forEach(res => console.log(res));

    console.log('\n================================================================');
    console.log(`Simulación paralela resuelta exitosamente en: ${tiempoFin - tiempoInicio} ms`);
    console.log('================================================================');

  } catch (error) {
    console.error('Fallo crítico de concurrencia en la red distribuida:', error);
  }
}

orquestarBancoNexus();