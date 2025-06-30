// Función constructora
function Usuario(nombre, saldoInicial) {
  this.nombre = nombre;
  this.saldo = saldoInicial;
  this.movimientos = [];

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

  this.guardarEnStorage = function() {
    localStorage.setItem("usuarioActivo", JSON.stringify(this));
  };

  this.cargarDeStorage = function() {
    const datos = localStorage.getItem("usuarioActivo");
    if (datos) {
      const obj = JSON.parse(datos);
      this.saldo = obj.saldo;
      this.movimientos = obj.movimientos;
    }
  };
}

// Variables globales
const usuarioCorrecto = "cliente";
const contrasenaCorrecta = "1234";
let usuarioActivo = null;

// Elementos DOM
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
const btnMovimientos = document.getElementById("btnMovimientos");
const btnSalir = document.getElementById("btnSalir");
const movimientosDiv = document.getElementById("movimientos");

// Funciones

function iniciarSesion(usuario, contrasena) {
  return usuario === usuarioCorrecto && contrasena === contrasenaCorrecta;
}

function mostrarSaldo() {
  saldoP.textContent = `Saldo: $${usuarioActivo.saldo.toFixed(2)}`;
}

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

// Eventos

btnLogin.addEventListener("click", () => {
  const usuario = usuarioInput.value.trim();
  const contrasena = contrasenaInput.value.trim();

  if (iniciarSesion(usuario, contrasena)) {
    usuarioActivo = new Usuario(usuario, 10000);
    usuarioActivo.cargarDeStorage();
    mensajeLogin.textContent = "";
    loginDiv.style.display = "none";
    menuDiv.style.display = "block";
    mostrarSaldo();
    movimientosDiv.textContent = "";
  } else {
    mensajeLogin.textContent = "Usuario o contraseña incorrectos";
  }
});

btnDepositar.addEventListener("click", () => {
  const monto = parseFloat(montoInput.value);
  if (isNaN(monto) || monto <= 0) {
    alert("Ingrese un monto válido para depositar");
    return;
  }
  usuarioActivo.depositar(monto);
  mostrarSaldo();
  movimientosDiv.textContent = "";
  montoInput.value = "";
});

btnRetirar.addEventListener("click", () => {
  const monto = parseFloat(montoInput.value);
  if (isNaN(monto) || monto <= 0) {
    alert("Ingrese un monto válido para retirar");
    return;
  }
  if (!usuarioActivo.retirar(monto)) {
    alert("Fondos insuficientes");
    return;
  }
  mostrarSaldo();
  movimientosDiv.textContent = "";
  montoInput.value = "";
});

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
  mensajeLogin.textContent = "";
  montoInput.value = "";
  mostrarSaldo();
});
