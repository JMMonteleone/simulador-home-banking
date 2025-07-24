# 💻 Home Banking - Proyecto en JavaScript

Este proyecto es una simulación interactiva de un sistema de **Home Banking**, desarrollado con **HTML, CSS y JavaScript puro**, como parte de una práctica educativa para aprender programación web moderna y dinámica.

---

## ✨ Funcionalidades

- 🔐 Inicio de sesión con usuario y contraseña (validación contra usuarios.json).
- 💰 Consulta de saldo en tiempo real.
- ➕ Depósito de dinero (con validación de monto).
- ➖ Retiro de dinero (con validación de monto y fondos).
- 📜 Registro y visualización de todos los movimientos (depósitos, retiros, préstamos, pagos de cuotas).
- 🧠 Uso de función constructora para representar al usuario.
- 💾 Persistencia de datos mediante `localStorage` (el usuario mantiene su estado aunque recargue la página).
- 👨‍💻 Interfaz web dinámica basada en DOM (sin prompts ni alerts tradicionales, todo en la página).
- 🎨 Estilo básico, limpio y responsivo con CSS.
- 🏦 Préstamos personales:
  - Solicitud de préstamo (con validación de monto, plazo y capacidad máxima).
  - Visualización de préstamos activos.
  - Pago de cuotas de préstamo.
  - Cálculo automático de intereses y cuotas.
  - Capacidad máxima de préstamo (3x el saldo actual).
- 🔔 Notificaciones visuales para errores, éxitos y advertencias (usando SweetAlert2).
- 🪟 Modal para solicitud de préstamo.
- 🚪 Cierre de sesión seguro.

---

## 🧪 Tecnologías utilizadas

- **HTML5** – Estructura de la interfaz.
- **CSS3** – Estilización visual.
- **JavaScript (ES6+)** – Lógica, interacción con el usuario, eventos, almacenamiento local y control de estado.
- **pm2** – Gestor de procesos para mantener el servidor activo.
- **Express** – Framework para servidor web en Node.js.
- **SweetAlert2** – Librería externa para notificaciones visuales modernas y personalizables.

---

## 📦 Librería externa utilizada: SweetAlert2

El proyecto utiliza [SweetAlert2](https://sweetalert2.github.io/) para mostrar notificaciones visuales modernas y atractivas en lugar de los tradicionales `alert()` o mensajes personalizados en el DOM.

- Se integra mediante CDN en el archivo `index.html`:
  ```html
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  ```
- Todas las notificaciones de éxito, error o información se muestran usando `Swal.fire(...)` desde JavaScript.
- Esto mejora la experiencia de usuario y cumple con el criterio de uso de librería externa.

---

## 🗂️ Estructura del proyecto

📁 simulador-home-banking/
├── index.html # Página principal
├── style.css # Estilos visuales
├── main.js # Lógica e interactividad (frontend)
├── servidos.js # Servidor Express (backend)
├── usuarios.json # Datos de usuarios
├── package.json # Configuración de Node.js y dependencias
└── README.md # Documentación del proyecto

---

## 🧠 Conceptos aplicados

- ✅ Variables y constantes  
- ✅ Arrays y funciones  
- ✅ Condicionales (`if`, `switch`)  
- ✅ Ciclos (`while`, `forEach`)  
- ✅ Funciones de orden superior  
- ✅ Funciones constructoras  
- ✅ Manipulación del DOM  
- ✅ Eventos (`addEventListener`)  
- ✅ `localStorage` para persistencia  
- ✅ Separación entre estructura (HTML), estilo (CSS) y lógica (JS)

---

## 🚀 Cómo usar el proyecto

### Opción 1: Uso tradicional (solo frontend)
1. Cloná o descargá este repositorio.
2. Abrí el archivo `index.html` en tu navegador.
3. Iniciá sesión con:
   - **Usuario:** `cliente`
   - **Contraseña:** `1234`
4. Usá los botones del menú para realizar operaciones bancarias.

### Opción 2: Usar con servidor Node.js + Express
1. Asegúrate de tener [Node.js](https://nodejs.org/) instalado.
2. Instala las dependencias del proyecto:
   ```
   npm install
   ```
3. Inicia el servidor Express:
   ```
   npm start
   ```
4. Abre tu navegador en [http://localhost:3000](http://localhost:3000)

### Mantener el servidor activo con pm2 (opcional, recomendado)
1. Instala pm2 globalmente (solo la primera vez):
  ```
  npm install -g pm2
  ```
2. Inicia el servidor con pm2:
  ```
  pm2 start servidos.js
  ```
3. El servidor seguirá corriendo aunque cierres la terminal o Visual Studio Code.
4. Comandos útiles de pm2:
  - Ver procesos: `pm2 list`
  - Detener: `pm2 stop servidos`
  - Reiniciar: `pm2 restart servidos`
  - Eliminar: `pm2 delete servidos`

---

## 📦 Dependencias principales

- express
- pm2 (opcional, para producción/desarrollo avanzado)

---

## 🧑‍💻 Autor

Desarrollado por **Jonatan Monteleone** como proyecto educativo para el curso de JavaScript.  
Este simulador busca aplicar conocimientos clave sobre programación web interactiva y estructurada.

---

## 📌 Nota final

Este proyecto es una práctica académica. No representa un sistema bancario real.  
Fue creado para aprender buenas prácticas, lógica de programación y estructura de una SPA básica con JS puro.
