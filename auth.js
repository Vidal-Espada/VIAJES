// auth.js - Lógica de autenticación y gestión de usuarios

const USUARIOS_KEY = 'asistente_viajes_usuarios';
const USUARIO_ACTUAL_KEY = 'asistente_viajes_usuario_actual';

/**
 * Inicializa la lista de usuarios en localStorage si no existe.
 */
function inicializarUsuarios() {
    if (!localStorage.getItem(USUARIOS_KEY)) {
        const usuariosPorDefecto = [
            { username: 'admin', password: 'admin4321' },
            { username: 'vidal', password: 'vidal4321' },
            { username: 'conchi', password: 'conchi4321' }
        ];
        localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuariosPorDefecto));
        console.log('Usuarios por defecto inicializados.');
    }
}

/**
 * Obtiene todos los usuarios de localStorage.
 * @returns {Array} Array de objetos de usuario.
 */
function getUsuarios() {
    const usuariosString = localStorage.getItem(USUARIOS_KEY);
    if (usuariosString) {
        try {
            const usuarios = JSON.parse(usuariosString);
            return Array.isArray(usuarios) ? usuarios : [];
        } catch (e) {
            console.error("Error al parsear usuarios de localStorage:", e);
            return []; // Devuelve array vacío si hay error de parseo
        }
    }
    return []; // Devuelve array vacío si no hay nada en localStorage
}

/**
 * Guarda la lista de usuarios en localStorage.
 * @param {Array} usuarios Array de objetos de usuario.
 */
function guardarUsuarios(usuarios) {
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
}

/**
 * Inicia sesión de un usuario.
 * @param {string} username
 * @param {string} password
 * @returns {boolean} True si el login es exitoso, false en caso contrario.
 */
function login(username, password) {
    const usuarios = getUsuarios();
    const usuario = usuarios.find(u => u.username === username && u.password === password);
    if (usuario) {
        localStorage.setItem(USUARIO_ACTUAL_KEY, username);
        return true;
    }
    return false;
}

/**
 * Cierra la sesión del usuario actual.
 */
function logout() {
    localStorage.removeItem(USUARIO_ACTUAL_KEY);
    // La redirección se manejará en el script de la página o en el route guard.
    // window.location.href = 'login.html';
}

/**
 * Obtiene el nombre de usuario del usuario actualmente logueado.
 * @returns {string|null} Nombre de usuario o null si no hay nadie logueado.
 */
function getUsuarioActual() {
    return localStorage.getItem(USUARIO_ACTUAL_KEY);
}

/**
 * Verifica si hay un usuario logueado.
 * @returns {boolean} True si hay un usuario logueado, false en caso contrario.
 */
function isLoggedIn() {
    return !!getUsuarioActual();
}

/**
 * Cambia el nombre de usuario.
 * @param {string} currentUsername
 * @param {string} newUsername
 * @param {string} password
 * @returns {{success: boolean, message: string}} Objeto con estado y mensaje.
 */
function cambiarUsername(currentUsername, newUsername, password) {
    const usuarios = getUsuarios();
    const indiceUsuario = usuarios.findIndex(u => u.username === currentUsername);

    if (indiceUsuario === -1) {
        return { success: false, message: 'Usuario actual no encontrado.' };
    }

    if (usuarios[indiceUsuario].password !== password) {
        return { success: false, message: 'Contraseña incorrecta.' };
    }

    if (newUsername === currentUsername) {
        return { success: false, message: 'El nuevo nombre de usuario es igual al actual.' };
    }

    if (usuarios.some(u => u.username === newUsername)) {
        return { success: false, message: 'El nuevo nombre de usuario ya existe.' };
    }

    usuarios[indiceUsuario].username = newUsername;
    guardarUsuarios(usuarios);

    // Si el usuario que cambió su nombre es el usuario actual, actualizar USUARIO_ACTUAL_KEY
    if (getUsuarioActual() === currentUsername) {
        localStorage.setItem(USUARIO_ACTUAL_KEY, newUsername);
    }

    return { success: true, message: 'Nombre de usuario actualizado correctamente.' };
}

/**
 * Cambia la contraseña de un usuario.
 * @param {string} username
 * @param {string} oldPassword
 * @param {string} newPassword
 * @returns {{success: boolean, message: string}} Objeto con estado y mensaje.
 */
function cambiarPassword(username, oldPassword, newPassword) {
    const usuarios = getUsuarios();
    const indiceUsuario = usuarios.findIndex(u => u.username === username);

    if (indiceUsuario === -1) {
        // Esto no debería pasar si el usuario está logueado y cambiando su propia contraseña
        return { success: false, message: 'Usuario no encontrado.' };
    }

    if (usuarios[indiceUsuario].password !== oldPassword) {
        return { success: false, message: 'La contraseña antigua es incorrecta.' };
    }

    if (oldPassword === newPassword) {
        return { success: false, message: 'La nueva contraseña es igual a la antigua.' };
    }

    if (!newPassword || newPassword.length < 6) { // Ejemplo de validación simple
        return { success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres.'};
    }


    usuarios[indiceUsuario].password = newPassword;
    guardarUsuarios(usuarios);

    return { success: true, message: 'Contraseña actualizada correctamente.' };
}

// Inicializar usuarios al cargar el script
inicializarUsuarios();

/**
 * Registra un nuevo usuario.
 * @param {string} username
 * @param {string} password
 * @returns {{exito: boolean, mensaje: string}} Objeto con estado y mensaje.
 */
function registrarUsuario(username, password) {
    const usuarios = getUsuarios();

    if (usuarios.find(u => u.username === username)) {
        return { exito: false, mensaje: 'El nombre de usuario ya existe. Por favor, elige otro.' };
    }

    if (password.length < 6) {
        return { exito: false, mensaje: 'La contraseña debe tener al menos 6 caracteres.' };
    }

    usuarios.push({ username: username, password: password });
    guardarUsuarios(usuarios);

    return { exito: true, mensaje: '¡Registro exitoso! Ahora puedes iniciar sesión.' };
}

/**
 * Obtiene una lista de todos los nombres de usuario registrados.
 * @returns {string[]} Array de nombres de usuario.
 */
function getTodosLosNombresDeUsuarios() {
    const usuarios = getUsuarios();
    return usuarios.map(u => u.username);
}

// Lógica de protección de rutas / redirección
// Se ejecutará en todas las páginas donde auth.js esté vinculado.
(function() {
    const PROTEGER_PAGINAS = ['index.html', 'gastos.html', 'disenar_itinerario.html', 'perfil.html'];
    const paginaActual = window.location.pathname.split('/').pop() || 'index.html'; // Default to index.html if path is '/'

    // Si estamos en una página protegida y no estamos logueados, redirigir a login.html
    if (PROTEGER_PAGINAS.includes(paginaActual) && !isLoggedIn()) {
        window.location.href = 'login.html';
    }
    // Si estamos en login.html y ya estamos logueados, redirigir a index.html
    else if (paginaActual === 'login.html' && isLoggedIn()) {
        window.location.href = 'index.html';
    }
})();

/**
 * Renderiza la barra de navegación dinámicamente.
 */
function renderizarBarraNavegacion() {
    const contenedorNav = document.getElementById('barra-navegacion-contenedor');
    if (!contenedorNav) {
        console.error('El contenedor de la barra de navegación (#barra-navegacion-contenedor) no se encontró.');
        return;
    }

    let navHTML = '<nav class="navbar-principal">';

    if (isLoggedIn()) {
        const usuario = getUsuarioActual();
        navHTML += `<span class="navbar-usuario">Hola, ${escapeHTML(usuario)}</span>`;
        navHTML += `
            <a href="index.html">Itinerario</a>
            <a href="gastos.html">Gastos</a>
            <a href="disenar_itinerario.html">Diseñar Itinerario</a>
            <a href="perfil.html">Perfil</a>
            <button type="button" id="boton_logout_nav" class="navbar-boton-logout" aria-label="Cerrar sesión">Cerrar Sesión</button>
        `;
    } else {
        navHTML += `
            <a href="index.html">Itinerario</a>
            <a href="login.html" aria-label="Iniciar sesión">Iniciar Sesión</a>
        `;
        // Podríamos añadir un enlace a "Registrarse" si existiera esa funcionalidad
    }
    navHTML += '</nav>';
    contenedorNav.innerHTML = navHTML;

    // Añadir event listener para el botón de logout si existe
    if (isLoggedIn()) {
        const botonLogoutNav = document.getElementById('boton_logout_nav');
        if (botonLogoutNav) {
            botonLogoutNav.addEventListener('click', function(e) {
                e.preventDefault();
                logout(); // Función de auth.js
                window.location.href = 'login.html'; // Asegurar redirección tras logout
            });
        }
    }
}

// Renderizar la barra de navegación en cada carga de página
// Debe ser llamado después de que el DOM esté listo si el contenedor está en el body.
// O si el script auth.js está al final del body, se puede llamar directamente.
document.addEventListener('DOMContentLoaded', renderizarBarraNavegacion);
