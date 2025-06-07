// script.js para el Asistente de Viajes a Bélgica

// ===== ITINERARIO =====
// Solo ejecutar código del itinerario si el contenedor existe en la página
if (document.getElementById('contenido_itinerario')) {

    const descripcionesSitiosTuristicos = {
        "Grand-Place": "La Grand-Place es la plaza central de Bruselas. Está rodeada por opulentas casas gremiales y es considerada una de las plazas más bellas del mundo.",
        "Atomium": "El Atomium fue construido para la Exposición Universal de 1958. Representa un cristal de hierro ampliado 165 mil millones de veces y ofrece vistas panorámicas de la ciudad.",
        "Manneken Pis": "El Manneken Pis es una famosa estatua de bronce de un niño pequeño orinando en una fuente. Es un símbolo de la irreverencia bruselense.",
        "Mini-Europa": "Mini-Europa es un parque en miniatura situado al pie del Atomium, que presenta reproducciones de los monumentos más famosos de la Unión Europea.",
        "Canales de Brujas": "Los canales de Brujas, a menudo llamada la 'Venecia del Norte', son perfectos para un paseo en barco y admirar la arquitectura medieval de la ciudad.",
        "Plaza Markt (Brujas)": "La Plaza Markt es el corazón de Brujas, dominada por el imponente Campanario (Belfort) y rodeada de coloridas casas gremiales.",
        "Campanario de Brujas (Belfort)": "El Campanario de Brujas, o Belfort, es una torre medieval en el corazón de Brujas. Subir sus 366 escalones recompensa con vistas impresionantes.",
        "Palacio Real": "El Palacio Real de Bruselas es el palacio administrativo del Rey de los Belgas, utilizado para recepciones oficiales. Partes del palacio están abiertas al público en verano.",
        "Parque de Bruselas": "El Parque de Bruselas (Parc de Bruxelles o Warandepark) es el parque urbano más grande del centro de Bruselas, situado frente al Palacio Real.",
        "Museo Magritte": "El Museo Magritte, parte de los Museos Reales de Bellas Artes de Bélgica, alberga la mayor colección del mundo de obras del surrealista René Magritte.",
        "Castillo de Gravensteen": "El Castillo de los Condes de Flandes (Gravensteen) en Gante es un imponente castillo medieval con una rica historia y vistas de la ciudad.",
        "Catedral de San Bavón (Gante)": "La Catedral de San Bavón en Gante es famosa por albergar el Políptico de Gante, 'La Adoración del Cordero Místico' de los hermanos Van Eyck.",
        "Muelle de Graslei y Korenlei": "Los muelles de Graslei y Korenlei en Gante son el corazón histórico del puerto de la ciudad, bordeados por impresionantes casas gremiales.",
        "Centro Belga del Cómic": "El Centro Belga del Cómic celebra la rica historia del cómic en Bélgica, con exposiciones dedicadas a Tintín, los Pitufos y otros personajes famosos.",
        "Tour de Chocolate": "Bélgica es famosa por su chocolate. Un tour de degustación de chocolate en Bruselas es una delicia para los sentidos.",
        "Galerías Reales Saint-Hubert": "Las Galerías Reales Saint-Hubert son unas elegantes galerías comerciales del siglo XIX en Bruselas, llenas de tiendas de lujo, chocolaterías y cafés."
    };

    // Itinerario por defecto (fallback)
    const datosItinerarioPorDefecto = [
        { fecha: "4 de Agosto, 2025", ciudad: "Bruselas", descripcion: "Llegada a Bruselas, check-in en el hotel. Explorar la Grand-Place y el Manneken Pis.", atracciones: ["Grand-Place", "Manneken Pis"] },
        { fecha: "5 de Agosto, 2025", ciudad: "Bruselas", descripcion: "Visita al Atomium y Mini-Europa. Disfrutar de unos gofres belgas.", atracciones: ["Atomium", "Mini-Europa"] },
        { fecha: "6 de Agosto, 2025", ciudad: "Brujas", descripcion: "Excursión de un día a Brujas. Paseo por los canales y visita a la plaza Markt.", atracciones: ["Canales de Brujas", "Plaza Markt (Brujas)", "Campanario de Brujas (Belfort)"] },
        { fecha: "7 de Agosto, 2025", ciudad: "Bruselas", descripcion: "Explorar el Palacio Real y el Parque de Bruselas. Visita a un museo por la tarde.", atracciones: ["Palacio Real", "Parque de Bruselas", "Museo Magritte"] },
        { fecha: "8 de Agosto, 2025", ciudad: "Gante", descripcion: "Excursión de un día a Gante. Visita al castillo de Gravensteen y la Catedral de San Bavón.", atracciones: ["Castillo de Gravensteen", "Catedral de San Bavón", "Muelle de Graslei y Korenlei"] },
        { fecha: "9 de Agosto, 2025", ciudad: "Bruselas", descripcion: "Visita al museo del cómic. Disfrutar de un tour de degustación de chocolate.", atracciones: ["Centro Belga del Cómic", "Tour de Chocolate"] },
        { fecha: "10 de Agosto, 2025", ciudad: "Bruselas", descripcion: "Compras de última hora de souvenirs. Salida de Bruselas.", atracciones: ["Galerías Reales Saint-Hubert"] }
    ];

    // Cargar itinerario personalizado o usar el de por defecto
    const ITINERARIO_PERSONALIZADO_KEY_SCRIPT = 'asistente_viajes_itinerario_personalizado';
    const itinerarioGuardado = localStorage.getItem(ITINERARIO_PERSONALIZADO_KEY_SCRIPT);
    let datosItinerarioFinales = datosItinerarioPorDefecto; // Fallback al por defecto

    if (itinerarioGuardado) {
        try {
            const parsedItinerario = JSON.parse(itinerarioGuardado);
            if (Array.isArray(parsedItinerario) && parsedItinerario.length > 0) {
                datosItinerarioFinales = parsedItinerario;
                console.log("Itinerario personalizado cargado para la vista principal.");
            } else {
                console.log("Itinerario personalizado encontrado pero vacío o inválido, usando el de por defecto.");
            }
        } catch (e) {
            console.error("Error al parsear itinerario personalizado, usando el de por defecto:", e);
            datosItinerarioFinales = datosItinerarioPorDefecto; // Fallback en caso de error
        }
    }

    function mostrarItinerario() {
        const contenedorItinerario = document.getElementById('contenido_itinerario');
        if (!contenedorItinerario) {
            console.error("¡Contenedor del itinerario no encontrado para mostrarItinerario!");
            return;
        }

        contenedorItinerario.innerHTML = '';

        if (!datosItinerarioFinales || datosItinerarioFinales.length === 0) {
            contenedorItinerario.innerHTML = '<p>No hay datos de itinerario disponibles. Intenta diseñar uno.</p>';
            return;
        }

        datosItinerarioFinales.forEach(dia => {
            const articuloDia = document.createElement('article');
            articuloDia.classList.add('itinerary-day');

            const h3Fecha = document.createElement('h3');
            // El objeto 'dia' del itinerario personalizado tiene 'fecha', no 'date'
            h3Fecha.textContent = `Fecha: ${escapeHTML(dia.fecha || dia.date)}`; // Usar dia.fecha o dia.date
            articuloDia.appendChild(h3Fecha);

            const pCiudad = document.createElement('p');
            pCiudad.textContent = `Ciudad: ${escapeHTML(dia.ciudad || dia.city)}`; // Usar dia.ciudad o dia.city
            articuloDia.appendChild(pCiudad);

            const pDescripcion = document.createElement('p');
            pDescripcion.textContent = `Plan: ${escapeHTML(dia.descripcion)}`;
            articuloDia.appendChild(pDescripcion);

            // Mostrar atracciones si existen en el objeto 'dia'
            if (Array.isArray(dia.atracciones) && dia.atracciones.length > 0) {
                const h4Atracciones = document.createElement('h4');
                h4Atracciones.textContent = 'Atracciones destacadas:';
                articuloDia.appendChild(h4Atracciones);
                const ulAtracciones = document.createElement('ul');
                dia.atracciones.forEach(atraccionNombre => {
                    const liAtraccion = document.createElement('li');
                    // Hacer la atracción clickeable
                    const botonAtraccion = document.createElement('button');
                    botonAtraccion.setAttribute('type', 'button'); // Accesibilidad
                    botonAtraccion.classList.add('boton_atraccion');
                    botonAtraccion.dataset.nombreAtraccion = atraccionNombre;
                    botonAtraccion.setAttribute('aria-label', `Ver descripción de ${atraccionNombre}`);
                    botonAtraccion.textContent = escapeHTML(atraccionNombre);
                    liAtraccion.appendChild(botonAtraccion);
                    ulAtracciones.appendChild(liAtraccion);
                });
                articuloDia.appendChild(ulAtracciones);
            }

            contenedorItinerario.appendChild(articuloDia);
        });
    }

    function mostrarModalDescripcion(nombre, descripcion) {
        const modal = document.getElementById('modal_descripcion_sitio');
        const tituloModal = document.getElementById('modal_titulo_sitio');
        const textoModal = document.getElementById('modal_texto_descripcion');
        const botonEscuchar = document.getElementById('boton_escuchar_descripcion');
        const botonCerrar = document.getElementById('boton_cerrar_modal_descripcion');

        if (modal && tituloModal && textoModal && botonEscuchar && botonCerrar) {
            tituloModal.textContent = nombre;
            textoModal.textContent = descripcion;

            // Asegurar type="button" para evitar envíos de formulario si estuvieran en uno
            botonEscuchar.setAttribute('type', 'button');
            botonCerrar.setAttribute('type', 'button');
            botonCerrar.setAttribute('aria-label', 'Cerrar modal');


            // Remover event listener anterior para evitar duplicados si se llama múltiples veces
            const nuevoBotonEscuchar = botonEscuchar.cloneNode(true);
            botonEscuchar.parentNode.replaceChild(nuevoBotonEscuchar, botonEscuchar);
            nuevoBotonEscuchar.addEventListener('click', () => hablarTexto(descripcion));

            const nuevoBotonCerrar = botonCerrar.cloneNode(true);
            botonCerrar.parentNode.replaceChild(nuevoBotonCerrar, botonCerrar);
            nuevoBotonCerrar.addEventListener('click', cerrarModalDescripcion);

            modal.style.display = 'flex';
        } else {
            console.error('Elementos del modal no encontrados.');
        }
    }

    function cerrarModalDescripcion() {
        const modal = document.getElementById('modal_descripcion_sitio');
        if (modal) {
            modal.style.display = 'none';
            window.speechSynthesis.cancel(); // Detener cualquier habla si se cierra el modal
        }
    }

    function hablarTexto(texto) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(texto);
            utterance.lang = 'es-ES'; // Español de España
            // Opcional: configurar voz (puede variar por navegador/SO)
            // const voices = window.speechSynthesis.getVoices();
            // utterance.voice = voices.find(voice => voice.lang === 'es-ES' && voice.name.includes('Spanish') && voice.name.includes('Female'));
            window.speechSynthesis.cancel(); // Cancelar cualquier síntesis previa
            window.speechSynthesis.speak(utterance);
        } else {
            alert('La síntesis de voz no es soportada por tu navegador.');
        }
    }

    // Event listener para clics en atracciones (delegación de eventos)
    const contenedorPrincipalItinerario = document.getElementById('contenido_itinerario');
    if (contenedorPrincipalItinerario) {
        contenedorPrincipalItinerario.addEventListener('click', function(event) {
            const target = event.target.closest('.boton_atraccion');
            if (target && target.dataset.nombreAtraccion) {
                const nombreAtraccion = target.dataset.nombreAtraccion;
                const descripcion = descripcionesSitiosTuristicos[nombreAtraccion] || "Descripción no disponible para este sitio.";
                mostrarModalDescripcion(nombreAtraccion, descripcion);
            }
        });
    }

    mostrarItinerario();
}


// ===== GESTOR DE GASTOS =====
// Solo ejecutar código del gestor de gastos si el formulario existe
if (document.getElementById('gasto_formulario')) {
    const GASTOS_KEY = 'asistente_viajes_gastos';
    let gastos = [];
    let idGastoEditandose = null; // Para rastrear si estamos en modo edición

    // Inputs del formulario y botón
    const formularioGasto = document.getElementById('gasto_formulario');
    const inputDescripcion = document.getElementById('gasto_descripcion');
    const inputCantidad = document.getElementById('gasto_cantidad');
    const inputCategoria = document.getElementById('gasto_categoria');
    const inputPagadoPor = document.getElementById('gasto_pagado_por');
    const botonSubmitFormulario = formularioGasto.querySelector('button[type="submit"]');
    const contenedorParticipantes = document.getElementById('gasto_participantes_contenedor');

    const listaGastos = document.getElementById('lista_gastos');
    const resumenGastos = document.getElementById('resumen_gastos');

    function renderizarSelectorParticipantes(participantesSeleccionados = []) {
        if (!contenedorParticipantes) {
            console.error("Contenedor de participantes no encontrado.");
            return;
        }

        const todosLosUsuarios = getTodosLosNombresDeUsuarios(); // De auth.js
        if (!todosLosUsuarios || todosLosUsuarios.length === 0) {
            contenedorParticipantes.innerHTML = '<p>No hay usuarios registrados para seleccionar.</p>';
            return;
        }

        let checkboxesHTML = '';
        todosLosUsuarios.forEach(username => {
            const isChecked = participantesSeleccionados.includes(username) ? 'checked' : '';
            // Usar el nombre de usuario como ID y valor puede ser problemático si contienen caracteres especiales.
            // Para un ejemplo simple, se mantiene, pero en producción se usaría un ID más robusto.
            const checkboxId = `participante_${username.replace(/\s+/g, '_')}`; // Crear ID más seguro
            checkboxesHTML += `
                <div class="checkbox-item">
                    <input type="checkbox" id="${checkboxId}" name="participantes" value="${escapeHTML(username)}" ${isChecked}>
                    <label for="${checkboxId}">${escapeHTML(username)}</label>
                </div>
            `;
        });
        contenedorParticipantes.innerHTML = checkboxesHTML;
    }


    function cargarGastos() {
        const gastosGuardados = localStorage.getItem(GASTOS_KEY);
        if (gastosGuardados) {
            try {
                gastos = JSON.parse(gastosGuardados);
                if (!Array.isArray(gastos)) gastos = [];
            } catch (e) {
                gastos = [];
                console.error("Error al parsear gastos de localStorage:", e);
            }
        } else {
            gastos = [];
        }
    }

    function guardarGastos() {
        localStorage.setItem(GASTOS_KEY, JSON.stringify(gastos));
    }

    formularioGasto.addEventListener('submit', function(event) {
        event.preventDefault();

        const descripcion = inputDescripcion.value.trim();
        const cantidadString = inputCantidad.value;
        const categoria = inputCategoria.value;
        const pagadoPor = inputPagadoPor.value.trim();
        let cantidad = parseFloat(cantidadString);

        const participantesSeleccionados = [];
        document.querySelectorAll('#gasto_participantes_contenedor input[name="participantes"]:checked').forEach(checkbox => {
            participantesSeleccionados.push(checkbox.value);
        });

        // Limpiar mensajes de error previos de participantes
        const mensajeParticipantesEl = document.getElementById('gasto_mensaje_participantes');
        if (mensajeParticipantesEl) {
            mensajeParticipantesEl.textContent = '';
            mensajeParticipantesEl.style.display = 'none';
        }

        if (!descripcion) {
            alert("Por favor, introduce una descripción para el gasto."); // Se podría cambiar a mensaje inline también
            inputDescripcion.focus();
            return;
        }
        if (isNaN(cantidad) || cantidad <= 0) {
            alert("Por favor, introduce una cantidad numérica positiva para el gasto."); // Se podría cambiar a mensaje inline
            inputCantidad.focus();
            return;
        }
        if (!pagadoPor) {
            alert("Por favor, introduce quién pagó el gasto (el que adelantó el dinero)."); // Se podría cambiar a mensaje inline
            inputPagadoPor.focus();
            return;
        }
        if (participantesSeleccionados.length === 0) {
            if (mensajeParticipantesEl) {
                mensajeParticipantesEl.textContent = 'Por favor, selecciona al menos un participante para el gasto.';
                mensajeParticipantesEl.style.display = 'block';
            } else {
                alert('Por favor, selecciona al menos un participante para el gasto (quiénes deben dividir el coste).');
            }
            return;
        }


        if (idGastoEditandose !== null) {
            const indiceGasto = gastos.findIndex(g => g.id === idGastoEditandose);
            if (indiceGasto !== -1) {
                gastos[indiceGasto] = {
                    ...gastos[indiceGasto],
                    descripcion,
                    cantidad,
                    categoria,
                    pagadoPor,
                    participantes: participantesSeleccionados // Añadir/actualizar participantes
                };
            }
            idGastoEditandose = null;
            botonSubmitFormulario.textContent = 'Añadir Gasto';
        } else {
            const nuevoGasto = {
                id: Date.now(),
                descripcion,
                cantidad,
                categoria,
                pagadoPor,
                participantes: participantesSeleccionados // Añadir participantes
            };
            gastos.push(nuevoGasto);
        }

        guardarGastos();
        renderizarGastos();
        renderizarResumenGastos();
        formularioGasto.reset();
        renderizarSelectorParticipantes(); // Resetear checkboxes de participantes
        inputDescripcion.focus();
    });

    function renderizarGastos() {
        if (!listaGastos) {
            console.error("¡Elemento #lista_gastos no encontrado para renderizar gastos!");
            return;
        }
        listaGastos.innerHTML = '';

        if (gastos.length === 0) {
            listaGastos.innerHTML = '<p>No hay gastos añadidos aún.</p>';
            return;
        }

        const ul = document.createElement('ul');
        ul.className = 'gastos_ul';

        gastos.forEach(gasto => {
            const li = document.createElement('li');
            li.className = 'gasto_item';
            li.setAttribute('data-id', gasto.id);

            const divContenido = document.createElement('div');
            divContenido.classList.add('gasto_item_contenido'); // Para agrupar desc y cuerpo
            divContenido.innerHTML = `
                <div class="gasto_item-cabecera">
                    <div class="descripcion_categoria_gasto">
                        <strong>${escapeHTML(gasto.descripcion)}</strong>
                        <span class="etiqueta_categoria">${escapeHTML(gasto.categoria)}</span>
                    </div>
                </div>
                <div class="gasto_item-cuerpo">
                    <span class="cantidad">Cantidad: &euro;${gasto.cantidad.toFixed(2)}</span>
                    <span class="pagado_por">Pagado por: ${escapeHTML(gasto.pagadoPor)}</span>
                </div>
            `;
             if (gasto.participantes && gasto.participantes.length > 0) {
                const participantesTexto = document.createElement('p');
                participantesTexto.className = 'gasto_item_participantes';
                participantesTexto.innerHTML = `<strong>Participantes:</strong> ${gasto.participantes.map(p => escapeHTML(p)).join(', ')}`;
                divContenido.appendChild(participantesTexto); // Añadir al div de contenido
            }
            li.appendChild(divContenido);

            const divBotones = document.createElement('div');
            divBotones.classList.add('gasto_item_acciones');
            divBotones.innerHTML = `
                <button type="button" class="boton_editar_gasto" data-id="${gasto.id}" aria-label="Editar gasto ${escapeHTML(gasto.descripcion)}">Editar</button>
                <button type="button" class="boton_eliminar_gasto" data-id="${gasto.id}" aria-label="Eliminar gasto ${escapeHTML(gasto.descripcion)}">Eliminar</button>
            `;
            li.appendChild(divBotones);
            ul.appendChild(li);
        });
        listaGastos.appendChild(ul);
    }

    function eliminarGasto(id) {
        const idNum = parseInt(id);
        gastos = gastos.filter(gasto => gasto.id !== idNum);
        guardarGastos();
        renderizarGastos();
        renderizarResumenGastos();
        // Si el gasto eliminado era el que se estaba editando, resetear formulario
        if (idGastoEditandose === idNum) {
            formularioGasto.reset();
            idGastoEditandose = null;
            botonSubmitFormulario.textContent = 'Añadir Gasto';
        }
    }

    function cargarGastoParaEditar(id) {
        const idNum = parseInt(id);
        const gastoAEditar = gastos.find(gasto => gasto.id === idNum);
        if (gastoAEditar) {
            inputDescripcion.value = gastoAEditar.descripcion;
            inputCantidad.value = gastoAEditar.cantidad;
            inputCategoria.value = gastoAEditar.categoria;
            inputPagadoPor.value = gastoAEditar.pagadoPor;

            idGastoEditandose = gastoAEditar.id;
            botonSubmitFormulario.textContent = 'Actualizar Gasto';
            renderizarSelectorParticipantes(gastoAEditar.participantes || []); // Pre-seleccionar
            inputDescripcion.focus();
        }
    }

    if (listaGastos) {
        listaGastos.addEventListener('click', function(event) {
            const target = event.target;
            // El dataset.id estará en el botón, que es el target
            const gastoId = target.dataset.id;

            if (!gastoId) return; // Click fuera de un botón con data-id

            if (target.classList.contains('boton_eliminar_gasto')) {
                if (confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
                    eliminarGasto(gastoId);
                }
            } else if (target.classList.contains('boton_editar_gasto')) {
                cargarGastoParaEditar(gastoId);
            }
        });
    }

    // Helper para formatear moneda
    function formatCurrency(amount) {
        return amount.toFixed(2).replace('.', ',') + '€';
    }

    function renderizarResumenGastos() {
        if (!resumenGastos) {
            console.error("¡Elemento #resumen_gastos no encontrado para renderizar resumen!");
            return;
        }
        resumenGastos.innerHTML = ''; // Limpiar completamente el contenido anterior

        if (gastos.length === 0) {
            resumenGastos.innerHTML = '<p>No hay gastos para resumir.</p>';
            return;
        }

        const pagosPorPersona = {};     // { username: totalPagado }
        const debePagarPorPersona = {}; // { username: totalQueDeberiaHaberPagado }
        let totalGeneralGastado = 0;

        const todosLosUsuariosDelViaje = getTodosLosNombresDeUsuarios(); // De auth.js

        // Inicializar estructuras para todos los usuarios registrados
        todosLosUsuariosDelViaje.forEach(usuario => {
            pagosPorPersona[usuario] = 0;
            debePagarPorPersona[usuario] = 0;
        });

        // Procesar cada gasto
        gastos.forEach(gasto => {
            totalGeneralGastado += gasto.cantidad;

            // Sumar a quién pagó el gasto
            if (pagosPorPersona.hasOwnProperty(gasto.pagadoPor)) {
                pagosPorPersona[gasto.pagadoPor] += gasto.cantidad;
            } else {
                // Esto podría pasar si el pagador ya no es un usuario registrado, o si el nombre tiene un typo.
                // Por ahora, se registra el pago igualmente, pero podría no aparecer en el resumen final si no está en todosLosUsuariosDelViaje.
                // O podríamos añadirlo a todosLosUsuariosDelViaje si no existe.
                // Para este ejercicio, si el pagador no está en la lista de usuarios, se ignora su pago para la liquidación final
                // aunque sí se contabiliza en el total general.
                console.warn(`El pagador '${gasto.pagadoPor}' del gasto '${gasto.descripcion}' no está en la lista general de usuarios. Su pago se cuenta en el total pero no se liquidará individualmente si no es un usuario reconocido.`);
                // Si se quisiera incluir de todas formas:
                // if (!todosLosUsuariosDelViaje.includes(gasto.pagadoPor)) todosLosUsuariosDelViaje.push(gasto.pagadoPor);
                // pagosPorPersona[gasto.pagadoPor] = (pagosPorPersona[gasto.pagadoPor] || 0) + gasto.cantidad;
            }

            // Distribuir el costo entre los participantes
            if (gasto.participantes && gasto.participantes.length > 0) {
                const costePorParticipanteEsteGasto = gasto.cantidad / gasto.participantes.length;
                gasto.participantes.forEach(participante => {
                    if (debePagarPorPersona.hasOwnProperty(participante)) {
                        debePagarPorPersona[participante] += costePorParticipanteEsteGasto;
                    } else {
                        console.warn(`El participante '${participante}' del gasto '${gasto.descripcion}' no está en la lista general de usuarios. El coste no se le asignará individualmente si no es un usuario reconocido.`);
                        // Si se quisiera incluir de todas formas:
                        // if (!todosLosUsuariosDelViaje.includes(participante)) todosLosUsuariosDelViaje.push(participante);
                        // debePagarPorPersona[participante] = (debePagarPorPersona[participante] || 0) + costePorParticipanteEsteGasto;
                    }
                });
            } else {
                // Fallback si no hay participantes: Asignar a todos los usuarios del viaje (o solo al pagador)
                // La validación del formulario ahora exige al menos un participante, así que esto no debería ocurrir.
                console.warn(`Gasto sin participantes: ${gasto.descripcion}. No se puede asignar a la liquidación de forma detallada.`);
                // Opcional: dividir entre todos los usuarios del viaje
                // const costePorParticipanteFallback = gasto.cantidad / todosLosUsuariosDelViaje.length;
                // todosLosUsuariosDelViaje.forEach(usuario => {
                //     debePagarPorPersona[usuario] += costePorParticipanteFallback;
                // });
            }
        });

        // Calcular balances
        const balances = {};
        todosLosUsuariosDelViaje.forEach(usuario => {
            balances[usuario] = (pagosPorPersona[usuario] || 0) - (debePagarPorPersona[usuario] || 0);
        });

        // Determinar quién debe a quién
        const deudores = []; // { nombre: 'user', cantidadDebe: X }
        const acreedores = []; // { nombre: 'user', cantidadSeLeDebe: Y }

        for (const usuario in balances) {
            if (balances[usuario] < -0.005) { // Umbral pequeño para evitar errores de flotantes
                deudores.push({ nombre: usuario, cantidadDebe: Math.abs(balances[usuario]) });
            } else if (balances[usuario] > 0.005) {
                acreedores.push({ nombre: usuario, cantidadSeLeDebe: balances[usuario] });
            }
        }

        // Ordenar para optimizar (opcional pero bueno para consistencia)
        deudores.sort((a, b) => b.cantidadDebe - a.cantidadDebe);
        acreedores.sort((a, b) => b.cantidadSeLeDebe - a.cantidadSeLeDebe);

        const transacciones = [];
        let i = 0, j = 0;
        while (i < deudores.length && j < acreedores.length) {
            const deudor = deudores[i];
            const acreedor = acreedores[j];
            const cantidadTransferir = Math.min(deudor.cantidadDebe, acreedor.cantidadSeLeDebe);

            if (cantidadTransferir > 0.005) { // Solo transferir si es una cantidad significativa
                transacciones.push({ de: deudor.nombre, a: acreedor.nombre, cantidad: cantidadTransferir });
                deudor.cantidadDebe -= cantidadTransferir;
                acreedor.cantidadSeLeDebe -= cantidadTransferir;
            }

            if (deudor.cantidadDebe < 0.01) i++;
            if (acreedor.cantidadSeLeDebe < 0.01) j++;
        }

        // === Display Results ===
        const divContenidoResumen = document.createElement('div');

        const pTotalGeneral = document.createElement('p');
        pTotalGeneral.innerHTML = `<strong>Total General de Gastos: ${formatCurrency(totalGeneralGastado)}</strong>`;
        divContenidoResumen.appendChild(pTotalGeneral);

        const h4Detalles = document.createElement('h4');
        h4Detalles.textContent = 'Detalles por Persona:';
        divContenidoResumen.appendChild(h4Detalles);
        const ulDetalles = document.createElement('ul');
        todosLosUsuariosDelViaje.forEach(usuario => {
            const li = document.createElement('li');
            const pagado = pagosPorPersona[usuario] || 0;
            const deberia = debePagarPorPersona[usuario] || 0;
            const bal = balances[usuario] || 0;
            let claseBalance = '';
            if (bal > 0.01) claseBalance = 'owed-amount';
            if (bal < -0.01) claseBalance = 'owes-amount';

            li.innerHTML = `${escapeHTML(usuario)}: Pagó ${formatCurrency(pagado)}, Gasto asignado ${formatCurrency(deberia)}. <strong class="${claseBalance}">Balance: ${formatCurrency(bal)}</strong>`;
            ulDetalles.appendChild(li);
        });
        divContenidoResumen.appendChild(ulDetalles);

        const h4Liquidacion = document.createElement('h4');
        h4Liquidacion.textContent = 'Liquidación de Cuentas:';
        divContenidoResumen.appendChild(h4Liquidacion);

        if (transacciones.length === 0) {
            const pSaldado = document.createElement('p');
            pSaldado.textContent = 'Todas las cuentas están saldadas o no se requieren transferencias.';
            divContenidoResumen.appendChild(pSaldado);
        } else {
            const ulLiquidacion = document.createElement('ul');
            transacciones.forEach(t => {
                const li = document.createElement('li');
                li.innerHTML = `${escapeHTML(t.de)} debe pagar ${formatCurrency(t.cantidad)} a ${escapeHTML(t.a)}`;
                ulLiquidacion.appendChild(li);
            });
            divContenidoResumen.appendChild(ulLiquidacion);
        }

        resumenGastos.appendChild(divContenidoResumen);
    }

    cargarGastos();
    renderizarSelectorParticipantes(); // Poblar checkboxes de participantes al inicio
    renderizarGastos();
    renderizarResumenGastos();
}


/**
 * Utility function to escape HTML special characters to prevent XSS.
 * This function should be globally available or duplicated if script is split.
 * @param {string} str The string to escape.
 * @returns {string} The escaped string.
 */
function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"']/g, function (match) {
        const escape = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return escape[match];
    });
}

// Remove the general DOMContentLoaded listener that called everything,
// as individual sections now handle their own setup.
// document.addEventListener('DOMContentLoaded', () => {
//    displayItinerary(); // This is now inside its conditional block
//    renderExpenses();   // This is now inside its conditional block
//    renderSummary();    // This is now inside its conditional block
// });
