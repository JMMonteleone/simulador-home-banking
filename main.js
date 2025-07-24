function Usuario(nombre, saldoInicial) {
  this.nombre = nombre;
  this.saldo = saldoInicial;
  this.movimientos = [];
  this.prestamos = [];

  this.depositar = function(monto) {
    this.saldo += monto;
    this.movimientos.push(`+ Depósito: $${monto.toFixed(2)}`);
    this.guardarEnStorage();
  };

  this.retirar = function(monto) {
    if (monto > this.saldo) {
      return false;
    }
    this.saldo -= monto;
    this.movimientos.push(`- Retiro: $${monto.toFixed(2)}`);
    this.guardarEnStorage();
    return true;
  };

  this.solicitarPrestamo = function(monto, plazoMeses) {
    if (monto < 1000 || monto > 50000) {
      return { exito: false, mensaje: "El monto debe estar entre $1,000 y $50,000" };
    }

    if (plazoMeses < 6 || plazoMeses > 60) {
      return { exito: false, mensaje: "El plazo debe estar entre 6 y 60 meses" };
    }

    const capacidadMaxima = this.saldo * 3;
    if (monto > capacidadMaxima) {
      return { exito: false, mensaje: `Monto excede la capacidad máxima de $${capacidadMaxima.toFixed(2)}` };
    }

    const tasaInteres = 0.05;
    const interesAnual = monto * tasaInteres;
    const interesTotal = interesAnual * (plazoMeses / 12);
    const montoTotal = monto + interesTotal;
    const cuotaMensual = montoTotal / plazoMeses;

    const prestamo = {
      id: Date.now(),
      monto: monto,
      plazoMeses: plazoMeses,
      tasaInteres: tasaInteres,
      interesTotal: interesTotal,
      montoTotal: montoTotal,
      cuotaMensual: cuotaMensual,
      fechaSolicitud: new Date().toLocaleDateString(),
      cuotasPagadas: 0,
      saldoPendiente: montoTotal,
      activo: true
    };

    this.prestamos.push(prestamo);
    this.saldo += monto; 
    this.movimientos.push(`+ Préstamo aprobado: $${monto.toFixed(2)} (${plazoMeses} meses)`);
    this.guardarEnStorage();

    return { 
      exito: true, 
      prestamo: prestamo,
      mensaje: `Préstamo aprobado por $${monto.toFixed(2)}`
    };
  };

  this.pagarCuota = function(prestamoId) {
    const prestamo = this.prestamos.find(p => p.id === prestamoId && p.activo);
    if (!prestamo) {
      return { exito: false, mensaje: "Préstamo no encontrado" };
    }

    if (this.saldo < prestamo.cuotaMensual) {
      return { exito: false, mensaje: "Saldo insuficiente para pagar la cuota" };
    }

    this.saldo -= prestamo.cuotaMensual;
    prestamo.cuotasPagadas++;
    prestamo.saldoPendiente -= prestamo.cuotaMensual;

    this.movimientos.push(`- Pago cuota préstamo: $${prestamo.cuotaMensual.toFixed(2)}`);

    if (prestamo.cuotasPagadas >= prestamo.plazoMeses) {
      prestamo.activo = false;
      this.movimientos.push(`✓ Préstamo finalizado: $${prestamo.monto.toFixed(2)}`);
    }

    this.guardarEnStorage();
    return { 
      exito: true, 
      mensaje: `Cuota pagada: $${prestamo.cuotaMensual.toFixed(2)}`,
      prestamo: prestamo
    };
  };

  this.getPrestamosActivos = function() {
    return this.prestamos.filter(p => p.activo);
  };

  this.getCapacidadPrestamo = function() {
    return this.saldo * 3;
  };

  this.guardarEnStorage = function() {
    localStorage.setItem("usuarioActivo", JSON.stringify(this));
  };

  this.cargarDeStorage = function() {
    const datos = localStorage.getItem("usuarioActivo");
    if (datos) {
      const obj = JSON.parse(datos);
      this.saldo = obj.saldo;
      this.movimientos = obj.movimientos;
      this.prestamos = obj.prestamos || [];
    }
  };
}


function mostrarNotificacion(mensaje, tipo = 'info') {
  let icon = 'info';
  if (tipo === 'exito') icon = 'success';
  else if (tipo === 'error') icon = 'error';
  Swal.fire({
    icon: icon,
    title: tipo === 'exito' ? 'Éxito' : tipo === 'error' ? 'Error' : 'Info',
    text: mensaje,
    timer: 2000,
    showConfirmButton: false
  });
}

// Variables globales y elementos DOM
let usuarios = [];
let usuarioActivo = null;

const loginDiv = document.getElementById("loginDiv");
const menuDiv = document.getElementById("menuDiv");

const usuarioInput = document.getElementById("usuarioInput");
const contrasenaInput = document.getElementById("contrasenaInput");
const mensajeLogin = document.getElementById("mensajeLogin");
const btnLogin = document.getElementById("btnLogin");

const saldoP = document.getElementById("saldo");
const montoInput = document.getElementById("montoInput");
const btnDepositar = document.getElementById("btnDepositar");
const btnRetirar = document.getElementById("btnRetirar");
const btnPrestamo = document.getElementById("btnPrestamo");
const btnMovimientos = document.getElementById("btnMovimientos");
const btnSalir = document.getElementById("btnSalir");
const movimientosDiv = document.getElementById("movimientos");
const prestamosInfoDiv = document.getElementById("prestamosInfo");
const listaPrestamos = document.getElementById("listaPrestamos");
const capacidadPrestamoP = document.getElementById("capacidadPrestamo");

const prestamoModal = document.getElementById("prestamoModal");
const cerrarModal = document.getElementById("cerrarModal");
const formPrestamo = document.getElementById("formPrestamo");
const montoPrestamo = document.getElementById("montoPrestamo");
const plazoPrestamo = document.getElementById("plazoPrestamo");
const btnCancelarPrestamo = document.getElementById("btnCancelarPrestamo");


function cargarUsuarios() {
  return fetch('usuarios.json')
    .then(response => response.json())
    .then(data => {
      usuarios = data;
    })
    .catch(error => {
      console.error('Error cargando usuarios:', error);
    });
}

async function iniciarSesion(usuario, contrasena) {
  if (usuarios.length === 0) {
    await cargarUsuarios();
  }

  const usuarioEncontrado = usuarios.find(u => u.nombre === usuario && u.contrasena === contrasena);
  if (usuarioEncontrado) {
    usuarioActivo = new Usuario(usuarioEncontrado.nombre, usuarioEncontrado.saldo);
    usuarioActivo.movimientos = usuarioEncontrado.movimientos || [];
    usuarioActivo.prestamos = usuarioEncontrado.prestamos || [];
    usuarioActivo.guardarEnStorage();
    return true;
  }
  return false;
}

// Mostrar saldo
function mostrarSaldo() {
  saldoP.textContent = `Saldo: $${usuarioActivo.saldo.toFixed(2)}`;
}

// Mostrar movimientos
function mostrarMovimientos() {
  movimientosDiv.innerHTML = "";
  if (usuarioActivo.movimientos.length === 0) {
    movimientosDiv.textContent = "No hay movimientos aún.";
    return;
  }
  const ul = document.createElement("ul");
  usuarioActivo.movimientos.forEach((mov) => {
    const li = document.createElement("li");
    li.textContent = mov;
    ul.appendChild(li);
  });
  movimientosDiv.appendChild(ul);
}

// Mostrar préstamos activos
function mostrarPrestamos() {
  const prestamosActivos = usuarioActivo.getPrestamosActivos();
  const capacidad = usuarioActivo.getCapacidadPrestamo();
  listaPrestamos.innerHTML = "";
  if (prestamosActivos.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No tienes préstamos activos.";
    listaPrestamos.appendChild(li);
  } else {
    prestamosActivos.forEach((prestamo, index) => {
      const li = document.createElement("li");
      li.className = "prestamo-item";
      const info = document.createElement("div");
      info.className = "prestamo-info";
      info.innerHTML =
        `<b>Préstamo #${index + 1}</b><br>` +
        `Monto: $${prestamo.monto.toFixed(2)}<br>` +
        `Cuota mensual: $${prestamo.cuotaMensual.toFixed(2)}<br>` +
        `Cuotas pagadas: ${prestamo.cuotasPagadas}/${prestamo.plazoMeses}<br>` +
        `Saldo pendiente: $${prestamo.saldoPendiente.toFixed(2)}<br>` +
        `Fecha: ${prestamo.fechaSolicitud}`;
      li.appendChild(info);
    
      const btnPagar = document.createElement("button");
      btnPagar.textContent = "Pagar cuota";
      btnPagar.className = "btnPagarCuota";
      btnPagar.onclick = function() {
        const resultado = usuarioActivo.pagarCuota(prestamo.id);
        if (resultado.exito) {
          mostrarNotificacion(resultado.mensaje, "exito");
          mostrarSaldo();
          mostrarPrestamos();
        } else {
          mostrarNotificacion(resultado.mensaje, "error");
        }
      };

      if (prestamo.activo && prestamo.cuotasPagadas < prestamo.plazoMeses) {
        li.appendChild(btnPagar);
      }
      listaPrestamos.appendChild(li);
    });
  }
  capacidadPrestamoP.textContent = `Capacidad máxima de préstamo: $${capacidad.toFixed(2)}`;
  prestamosInfoDiv.style.display = "block";
}


btnLogin.addEventListener("click", async () => {
  const usuario = usuarioInput.value.trim();
  const contrasena = contrasenaInput.value.trim();

  const exito = await iniciarSesion(usuario, contrasena);
  if (exito) {
    mensajeLogin.textContent = "";
    loginDiv.style.display = "none";
    menuDiv.style.display = "block";
    mostrarSaldo();
    movimientosDiv.textContent = "";
    prestamosInfoDiv.style.display = "none";
    mostrarNotificacion("¡Bienvenido! Sesión iniciada correctamente", "exito");
  } else {
    mensajeLogin.textContent = "Usuario o contraseña incorrectos";
    mostrarNotificacion("Usuario o contraseña incorrectos", "error");
  }
});

btnDepositar.addEventListener("click", () => {
  const monto = parseFloat(montoInput.value);
  if (isNaN(monto) || monto <= 0) {
    mostrarNotificacion("Ingrese un monto válido para depositar", "error");
    return;
  }
  usuarioActivo.depositar(monto);
  mostrarSaldo();
  movimientosDiv.textContent = "";
  montoInput.value = "";
  mostrarNotificacion(`Depósito exitoso: $${monto.toFixed(2)}`, "exito");
});

btnRetirar.addEventListener("click", () => {
  const monto = parseFloat(montoInput.value);
  if (isNaN(monto) || monto <= 0) {
    mostrarNotificacion("Ingrese un monto válido para retirar", "error");
    return;
  }
  if (!usuarioActivo.retirar(monto)) {
    mostrarNotificacion("Fondos insuficientes", "error");
    return;
  }
  mostrarSaldo();
  movimientosDiv.textContent = "";
  montoInput.value = "";
  mostrarNotificacion(`Retiro exitoso: $${monto.toFixed(2)}`, "exito");
});

btnPrestamo.addEventListener("click", () => {
  montoPrestamo.value = "";
  plazoPrestamo.value = "";
  prestamoModal.style.display = "flex";
  montoPrestamo.focus();
});

cerrarModal.onclick = btnCancelarPrestamo.onclick = function() {
  prestamoModal.style.display = "none";
};
window.onclick = function(event) {
  if (event.target === prestamoModal) {
    prestamoModal.style.display = "none";
  }
};

formPrestamo.onsubmit = function(e) {
  e.preventDefault();
  const monto = parseFloat(montoPrestamo.value);
  const plazo = parseInt(plazoPrestamo.value);
  if (isNaN(monto) || isNaN(plazo)) {
    mostrarNotificacion("Complete todos los campos", "error");
    return;
  }
  const resultado = usuarioActivo.solicitarPrestamo(monto, plazo);
  if (resultado.exito) {
    mostrarNotificacion(resultado.mensaje, "exito");
    mostrarSaldo();
    mostrarPrestamos();
    prestamoModal.style.display = "none";
  } else {
    mostrarNotificacion(resultado.mensaje, "error");
  }
};

btnMovimientos.addEventListener("click", () => {
  mostrarMovimientos();
});

btnSalir.addEventListener("click", () => {
  usuarioActivo = null;
  localStorage.removeItem("usuarioActivo");
  menuDiv.style.display = "none";
  loginDiv.style.display = "block";
  usuarioInput.value = "";
  contrasenaInput.value = "";
  movimientosDiv.textContent = "";
  prestamosInfoDiv.style.display = "none";
  mensajeLogin.textContent = "";
  montoInput.value = "";
  mostrarSaldo();
  mostrarNotificacion("Sesión cerrada correctamente", "info");
});
