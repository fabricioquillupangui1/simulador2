// --- VARIABLES GLOBALES ---
let clientes = [
    { cedula: "1712345678", nombre: "Juan", apellido: "Pérez", ingresos: 1200, egresos: 500 },
    { cedula: "1723456789", nombre: "María", apellido: "Gómez", ingresos: 1500, egresos: 600 },
    { cedula: "1734567890", nombre: "Carlos", apellido: "Ramírez", ingresos: 900, egresos: 350 }
];
let creditos = [];

let tasaInteres = 15;
let clienteSeleccionado = null;
let clienteCreditoActual = null; // Variable específica para el cliente en la sección créditos
let cuotaCalculada = 0;
let montoCalculado = 0;
let plazoCalculado = 0;
let creditoAprobado = false;

// ==========================================
// PARTE 1: NAVEGACIÓN ENTRE SECCIONES (SPA)
// ==========================================
function ocultarSecciones() {
    let secciones = document.querySelectorAll("section");
    secciones.forEach(seccion => {
        seccion.classList.remove("activa");
    });
}

function mostrarSeccion(id) {
    ocultarSecciones();
    let seccionActiva = document.getElementById(id);
    if (seccionActiva) {
        seccionActiva.classList.add("activa");
    }
}

// ==========================================
// PARTE 2: CONFIGURAR TASA
// ==========================================
function guardarTasa() {
    let valorTasa = recuperarFloat("tasaInteres");
    
    if (valorTasa >= 10 && valorTasa <= 20) {
        tasaInteres = valorTasa;
        mostrarTexto("mensajeTasa", "Tasa configurada correctamente: " + tasaInteres + "%");
    } else {
        mostrarTexto("mensajeTasa", "La tasa debe estar entre 10% y 20%");
    }
}

// ==========================================
// PARTE 3: ADMINISTRACIÓN DE CLIENTES
// ==========================================

// Buscar cliente por cédula (Retorna el objeto cliente o null)
function buscarCliente(cedula) {
    let clienteEncontrado = null;
    for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].cedula === cedula) {
            clienteEncontrado = clientes[i];
            break;
        }
    }
    return clienteEncontrado;
}

// Guardar o Actualizar cliente
function guardarCliente() {
    let cedula = recuperaraTexto("txtCedula");
    let nombre = recuperaraTexto("txtNombre");
    let apellido = recuperaraTexto("txtApellido");
    let ingresos = recuperarFloat("txtIngresos");
    let egresos = recuperarFloat("txtEgresos");

    // Validación básica de campos vacíos
    if (!cedula || !nombre || !apellido || isNaN(ingresos) || isNaN(egresos)) {
        alert("Por favor complete todos los campos correctamente.");
        return;
    }

    let clienteExistente = buscarCliente(cedula);

    if (clienteExistente == null) {
        let nuevoCliente = {
            cedula: cedula,
            nombre: nombre,
            apellido: apellido,
            ingresos: ingresos,
            egresos: egresos
        };
        clientes.push(nuevoCliente);
        alert("Cliente registrado exitosamente.");
    } else {
        clienteExistente.nombre = nombre;
        clienteExistente.apellido = apellido;
        clienteExistente.ingresos = ingresos;
        clienteExistente.egresos = egresos;
        alert("Cliente actualizado exitosamente.");
    }

    pintarClientes();
    limpiar();
}

// Pintar clientes en la tabla HTML dinámicamente
function pintarClientes() {
    let tbody = document.getElementById("tablaClientes");
    let contenidoTabla = "";

    for (let i = 0; i < clientes.length; i++) {
        let c = clientes[i];
        contenidoTabla += `<tr>
            <td>${c.cedula}</td>
            <td>${c.nombre}</td>
            <td>${c.apellido}</td>
            <td>${c.ingresos}</td>
            <td>${c.egresos}</td>
            <td>
                <button onclick="seleccionarCliente('${c.cedula}')">Actualizar</button>
                <button onclick="eliminarCliente('${c.cedula}')">Eliminar</button>
            </td>
        </tr>`;
    }
    tbody.innerHTML = contenidoTabla;
}

// Seleccionar cliente para pasarlo a los inputs y actualizar
function seleccionarCliente(cedula) {
    let cliente = buscarCliente(cedula);
    if (cliente) {
        clienteSeleccionado = cliente;
        mostrarTextoEnCaja("txtCedula", cliente.cedula);
        document.getElementById("txtCedula").disabled = true; 
        mostrarTextoEnCaja("txtNombre", cliente.nombre);
        mostrarTextoEnCaja("txtApellido", cliente.apellido);
        mostrarTextoEnCaja("txtIngresos", cliente.ingresos);
        mostrarTextoEnCaja("txtEgresos", cliente.egresos);
    }
}

// Eliminar cliente
function eliminarCliente(cedula) {
    let index = -1;
    for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].cedula === cedula) {
            index = i;
            break;
        }
    }
    if (index !== -1) {
        clientes.splice(index, 1);
        pintarClientes();
        alert("Cliente eliminado.");
    }
}

// Función limpiar formulario
function limpiar() {
    mostrarTextoEnCaja("txtCedula", "");
    document.getElementById("txtCedula").disabled = false; 
    mostrarTextoEnCaja("txtNombre", "");
    mostrarTextoEnCaja("txtApellido", "");
    mostrarTextoEnCaja("txtIngresos", "");
    mostrarTextoEnCaja("txtEgresos", "");
    clienteSeleccionado = null;
}

// ==========================================
// PARTE 2 DEL TALLER: SECCIÓN CRÉDITOS
// ==========================================

// Buscar cliente para la sección de créditos y mostrar sus datos dinámicamente
function buscarClienteCredito() {
    let cedulaBuscada = recuperaraTexto("txtCedulaCredito");
    let clienteEncontrado = buscarCliente(cedulaBuscada);
    let contenedorDatos = document.getElementById("datosClienteCredito");

    if (clienteEncontrado != null) {
        clienteCreditoActual = clienteEncontrado;
        contenedorDatos.innerHTML = `
            <h3>Datos del Cliente</h3>
            <p><strong>Cédula:</strong> ${clienteEncontrado.cedula}</p>
            <p><strong>Nombre:</strong> ${clienteEncontrado.nombre}</p>
            <p><strong>Apellido:</strong> ${clienteEncontrado.apellido}</p>
            <p><strong>Ingresos:</strong> ${clienteEncontrado.ingresos}</p>
            <p><strong>Egresos:</strong> ${clienteEncontrado.egresos}</p>
        `;
    } else {
        clienteCreditoActual = null;
        contenedorDatos.innerHTML = `<p style="color: red;">Cliente no encontrado.</p>`;
    }
}

// Calcular crédito, validar capacidad de pago y aplicar estilos de resultado
function calcularCredito() {
    if (clienteCreditoActual == null) {
        alert("Primero debe buscar y seleccionar un cliente válido.");
        return;
    }

    let monto = recuperarFloat("txtMonto");
    let plazo = recuperarInt("txtPlazo");

    if (monto <= 0 || plazo <= 0) {
        alert("Ingrese un monto y un plazo válidos.");
        return;
    }

    // Cálculos financieros
    let capacidadPago = clienteCreditoActual.ingresos - clienteCreditoActual.egresos;
    let interesTotal = (monto * (tasaInteres / 100) * (plazo / 12));
    let totalPagar = monto + interesTotal;
    let cuotaMensual = totalPagar / plazo;

    let resultadoDiv = document.getElementById("resultadoCredito");
    let estadoCredito = "";

    // Regla de aprobación basada en la capacidad de pago
    if (cuotaMensual <= capacidadPago && capacidadPago > 0) {
        creditoAprobado = true;
        estadoCredito = "APROBADO";
        resultadoDiv.className = "aprobado"; // Aplica clase verde del CSS
    } else {
        creditoAprobado = false;
        estadoCredito = "RECHAZADO";
        resultadoDiv.className = "rechazado"; // Aplica clase roja del CSS
    }

    // Mostrar resultados usando la etiqueta <br> como pide la guía
    resultadoDiv.innerHTML = `
        Capacidad de pago: ${capacidadPago.toFixed(2)}<br>
        Total a pagar: ${totalPagar.toFixed(2)}<br>
        Cuota mensual: ${cuotaMensual.toFixed(2)}<br>
        RESULTADO: ${estadoCredito}
    `;
}

// Ejecutar pintado inicial al cargar la página
window.onload = function() {
    pintarClientes();
    mostrarSeccion('parametros'); 
};

// ==========================================
// PARTE 3 DEL TALLER: ASIGNACIÓN Y GESTIÓN DE CRÉDITOS
// ==========================================

// Modificación en calcularCredito para habilitar/deshabilitar el botón "Asignar Crédito"
function calcularCredito() {
    if (clienteCreditoActual == null) {
        alert("Primero debe buscar y seleccionar un cliente válido.");
        return;
    }

    let monto = recuperarFloat("txtMonto");
    let plazo = recuperarInt("txtPlazo");

    if (monto <= 0 || plazo <= 0) {
        alert("Ingrese un monto y un plazo válidos.");
        return;
    }

    // Guardamos temporalmente en variables globales para usarlas al asignar
    montoCalculado = monto;
    plazoCalculado = plazo;

    // Cálculos financieros
    let capacidadPago = clienteCreditoActual.ingresos - clienteCreditoActual.egresos;
    let interesTotal = (monto * (tasaInteres / 100) * (plazo / 12));
    let totalPagar = monto + interesTotal;
    cuotaCalculada = totalPagar / plazo;

    let resultadoDiv = document.getElementById("resultadoCredito");
    let estadoCredito = "";
    let btnAsignar = document.getElementById("btnAsignarCredito");

    // Regla de aprobación basada en la capacidad de pago
    if (cuotaCalculada <= capacidadPago && capacidadPago > 0) {
        creditoAprobado = true;
        estadoCredito = "APROBADO";
        resultadoDiv.className = "aprobado"; 
        
        // Habilitar botón Asignar Crédito si está aprobado
        btnAsignar.disabled = false;
        btnAsignar.style.backgroundColor = "#2563eb";
        btnAsignar.style.cursor = "pointer";
    } else {
        creditoAprobado = false;
        estadoCredito = "RECHAZADO";
        resultadoDiv.className = "rechazado"; 
        
        // Mantener deshabilitado si es rechazado
        btnAsignar.disabled = true;
        btnAsignar.style.backgroundColor = "gray";
        btnAsignar.style.cursor = "not-allowed";
    }

    resultadoDiv.innerHTML = `
        Capacidad de pago: ${capacidadPago.toFixed(2)}<br>
        Total a pagar: ${totalPagar.toFixed(2)}<br>
        Cuota mensual: ${cuotaCalculada.toFixed(2)}<br>
        RESULTADO: ${estadoCredito}
    `;
}

// Función para asignar y registrar el crédito aprobado
function asignarCredito() {
    if (!creditoAprobado || clienteCreditoActual == null) {
        alert("No se puede asignar un crédito que no esté aprobado.");
        return;
    }

    // Estructura exacta solicitada en el PASO 2 del taller
    let credito = {
        cedula: clienteCreditoActual.cedula,
        nombre: clienteCreditoActual.nombre,
        apellido: clienteCreditoActual.apellido,
        monto: montoCalculado,
        tasa: tasaInteres,
        plazo: plazoCalculado,
        cuota: cuotaCalculada
    };

    // Agregamos al arreglo global de créditos
    creditos.push(credito);
    alert("¡Crédito asignado y registrado con éxito!");

    // Limpiar o actualizar vistas
    document.getElementById("btnAsignarCredito").disabled = true;
    document.getElementById("btnAsignarCredito").style.backgroundColor = "gray";
    
    // Opcional: Mostrar el historial actualizado de inmediato
    mostrarSeccion('historialCreditos');
    pintarCreditos(creditos);
}

// Función buscarCreditos por cédula (Retorna un arreglo filtrado)[cite: 7]
function buscarCreditos(cedula) {
    let creditosFiltrados = [];
    for (let i = 0; i < creditos.length; i++) {
        if (creditos[i].cedula === cedula) {
            creditosFiltrados.push(creditos[i]);
        }
    }
    return creditosFiltrados;
}

// Función pintarCreditos (Recibe un arreglo de créditos y los dibuja en la tabla)[cite: 7]
function pintarCreditos(listaCreditos) {
    let tbody = document.getElementById("tablaCreditosRegistrados");
    let contenido = "";

    for (let i = 0; i < listaCreditos.length; i++) {
        let c = listaCreditos[i];
        contenido += `<tr>
            <td>${c.cedula}</td>
            <td>${c.nombre}</td>
            <td>${c.apellido}</td>
            <td>${Number(c.monto).toFixed(2)}</td>
            <td>${c.tasa}%</td>
            <td>${c.plazo} meses</td>
            <td>${Number(c.cuota).toFixed(2)}</td>
        </tr>`;
    }
    tbody.innerHTML = contenido;
}

// Función buscarCreditosCliente (Toma la cédula de la caja de texto y pinta el resultado)
function buscarCreditosCliente() {
    let cedulaBuscada = recuperaraTexto("txtCedulaFiltro");
    if (!cedulaBuscada) {
        alert("Por favor ingrese una cédula para filtrar.");
        return;
    }
    let resultados = buscarCreditos(cedulaBuscada);
    pintarCreditos(resultados);
}