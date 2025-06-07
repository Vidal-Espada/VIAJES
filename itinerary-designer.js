// itinerary-designer.js - Lógica para el diseño de itinerarios personalizados

const ITINERARIO_PERSONALIZADO_KEY = 'asistente_viajes_itinerario_personalizado';
let itinerarioActual = []; // Almacena los días del itinerario personalizado

/**
 * Carga el itinerario personalizado desde localStorage.
 */
function cargarItinerario() {
    const itinerarioGuardado = localStorage.getItem(ITINERARIO_PERSONALIZADO_KEY);
    if (itinerarioGuardado) {
        try {
            itinerarioActual = JSON.parse(itinerarioGuardado);
            if (!Array.isArray(itinerarioActual)) { // Asegurarse de que es un array
                itinerarioActual = [];
            }
        } catch (e) {
            console.error("Error al parsear el itinerario guardado:", e);
            itinerarioActual = []; // Resetear si hay error
        }
    } else {
        itinerarioActual = []; // Inicializar vacío si no hay nada guardado
    }
}

/**
 * Guarda el itinerario actual en localStorage.
 */
function guardarItinerario() {
    localStorage.setItem(ITINERARIO_PERSONALIZADO_KEY, JSON.stringify(itinerarioActual));
}

/**
 * Renderiza el itinerario diseñado en la página disenar_itinerario.html.
 */
function renderizarItinerarioDiseñado() {
    const vistaPreviaContenedor = document.getElementById('vista_previa_itinerario_diseñado');
    if (!vistaPreviaContenedor) {
        console.error('Contenedor de vista previa del itinerario no encontrado.');
        return;
    }

    vistaPreviaContenedor.innerHTML = ''; // Limpiar contenido anterior

    if (itinerarioActual.length === 0) {
        vistaPreviaContenedor.innerHTML = '<p>Aún no has añadido ningún día a tu itinerario.</p>';
        return;
    }

    itinerarioActual.forEach((dia, index) => {
        const diaDiv = document.createElement('div');
        diaDiv.className = 'dia-itinerario-diseñado-item'; // Para estilizar cada día
        diaDiv.setAttribute('data-index', index);

        let atraccionesHTML = '';
        if (Array.isArray(dia.atracciones) && dia.atracciones.length > 0) {
            atraccionesHTML = `<h4>Atracciones:</h4><ul>${dia.atracciones.map(atr => `<li>${escapeHTML(atr)}</li>`).join('')}</ul>`;
        } else if (dia.atracciones && typeof dia.atracciones === 'string' && dia.atracciones.trim() !== '') {
            // Caso fallback si atracciones es un string simple
            atraccionesHTML = `<p><strong>Atracciones:</strong> ${escapeHTML(dia.atracciones)}</p>`;
        }


        diaDiv.innerHTML = `
            <h3>${escapeHTML(dia.fecha)} - ${escapeHTML(dia.ciudad)}</h3>
            <p><strong>Descripción:</strong> ${escapeHTML(dia.descripcion)}</p>
            ${atraccionesHTML}
            <div class="botones-dia">
                <button type="button" class="boton-editar-dia" data-index="${index}" aria-label="Editar día ${escapeHTML(dia.fecha || '')}">Editar</button>
                <button type="button" class="boton-eliminar-dia" data-index="${index}" aria-label="Eliminar día ${escapeHTML(dia.fecha || '')}">Eliminar</button>
            </div>
        `;
        vistaPreviaContenedor.appendChild(diaDiv);
    });
}

/**
 * Agrega un nuevo día al itinerario actual.
 * @param {object} datosDia - Objeto con { fecha, ciudad, atracciones, descripcion }.
 */
function agregarDia(datosDia) {
    if (!datosDia || !datosDia.fecha || !datosDia.ciudad) {
        console.error('Datos del día incompletos.', datosDia);
        alert('La fecha y la ciudad son obligatorias para añadir un día.');
        return;
    }
    itinerarioActual.push(datosDia);
    guardarItinerario();
    renderizarItinerarioDiseñado();
}

/**
 * Elimina un día del itinerario. (Implementación básica)
 * @param {number} index - Índice del día a eliminar.
 */
function eliminarDia(index) {
    if (index >= 0 && index < itinerarioActual.length) {
        itinerarioActual.splice(index, 1);
        guardarItinerario();
        renderizarItinerarioDiseñado();
    } else {
        console.error('Índice para eliminar día fuera de rango:', index);
    }
}

/**
 * Edita un día del itinerario. (Placeholder - Implementación futura)
 * @param {number} index - Índice del día a editar.
 * @param {object} nuevosDatosDia - Nuevos datos para el día.
 */
function editarDia(index, nuevosDatosDia) {
    if (index >= 0 && index < itinerarioActual.length) {
        // Lógica de edición más compleja aquí (ej. abrir un modal con los datos)
        // Por ahora, un simple reemplazo o log:
        console.log(`Editando día en índice ${index} con:`, nuevosDatosDia);
        itinerarioActual[index] = { ...itinerarioActual[index], ...nuevosDatosDia }; // Fusión simple
        guardarItinerario();
        renderizarItinerarioDiseñado();
        alert('Funcionalidad de editar día (placeholder) - revisa la consola y el localStorage.');
    } else {
        console.error('Índice para editar día fuera de rango:', index);
    }
}


// Utility function to escape HTML (debería estar en un archivo común si se usa en múltiples sitios)
function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"']/g, function (match) {
        const escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return escapeMap[match];
    });
}


// Carga inicial y renderizado al cargar el script
// Esto asume que el DOM ya está listo si el script está al final del body.
// Si está en <head> con defer, DOMContentLoaded es más seguro.
document.addEventListener('DOMContentLoaded', () => {
    cargarItinerario();
    renderizarItinerarioDiseñado();
});
