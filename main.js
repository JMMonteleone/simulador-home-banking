const usuarioCorrecto = "cliente";
const contrasenaCorrecta = "1234";
let continuar = true;
let saldo = 10000;
let movimientos = [];

function iniciarSesion(usuario, contrasena) {
    return usuario === usuarioCorrecto && contrasena === contrasenaCorrecta;
}

function ejecutarInicio() {
    let intentos = 3;
    while (intentos > 0) {
        let usuario = prompt("Ingrese su nombre de usuario:");
        let contrasena = prompt("Ingrese su contraseña:");

        if (iniciarSesion(usuario, contrasena)) {
            alert("¡Bienvenido al Home Banking!");
            menuPrincipal();
            return;
        } else {
            intentos--;
            alert(`Usuario o contraseña incorrectos. Intentos restantes: ${intentos}`);
        }
    }
    alert("Has excedido el número de intentos. Intenta más tarde.");
}

function menuPrincipal() {
    while (continuar) {
        let opcion = prompt("Seleccione una opción:\n 1. Consultar saldo\n 2. Depositar dinero\n 3. Retirar dinero\n 4. Ver últimos movimientos\n 5. Salir");

        switch (opcion) {
            case "1":
                alert(`Tu saldo actual es: $${saldo.toFixed(2)}`);
                break;
            case "2":
                operarSaldo(parseFloat(prompt("Ingrese el monto a depositar:")), "deposito");
                break;
            case "3":
                operarSaldo(parseFloat(prompt("Ingrese el monto a retirar:")), "retiro");
                break;
            case "4":
                mostrarMovimientos();
                break;
            case "5":
                alert("Gracias por usar Home Banking");
                continuar = false;
                break;
            default:
                alert("Opción no válida");
        }
    }
}

function operarSaldo(monto, tipo) {
    if (isNaN(monto) || monto <= 0) {
        return alert("Monto inválido.");
    }

    if (tipo === "deposito") {
        saldo += monto;
        movimientos.push(`+ Depósito: $${monto.toFixed(2)}`);
        alert(`Depositaste $${monto.toFixed(2)}. Nuevo saldo: $${saldo.toFixed(2)}`);
    } else if (tipo === "retiro") {
        if (monto > saldo) {
            return alert("Fondos insuficientes.");
        }
        saldo -= monto;
        movimientos.push(`- Retiro: $${monto.toFixed(2)}`);
        alert(`Retiraste $${monto.toFixed(2)}. Saldo restante: $${saldo.toFixed(2)}`);
    } else {
        alert("Operación no válida.");
    }

    console.log(`${tipo === "deposito" ? "Depositado" : "Retirado"}: $${monto.toFixed(2)}`);
}


function mostrarMovimientos() {
    if (movimientos.length === 0) {
        alert("No hay movimientos aún.");
    } else {
        let historial = "Últimos movimientos:\n";
        for (let i = 0; i < movimientos.length; i++) {
            historial += movimientos[i] + "\n";
        }
        alert(historial);
        console.log("Movimientos:", movimientos);
    }
}
