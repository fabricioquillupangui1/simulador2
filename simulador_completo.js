// --- VARIABLES GLOBALES ---
let clientes = [
    { cedula: "1712345678", nombre: "Juan", apellido: "Pérez", ingresos: 1200, egresos: 500 },
    { cedula: "1723456789", nombre: "María", apellido: "Gómez", ingresos: 1500, egresos: 600 },
    { cedula: "1734567890", nombre: "Carlos", apellido: "Ramírez", ingresos: 900, egresos: 350 }
];
let creditos = [];

let tasaInteres = 15;
let clienteSeleccionado = null;
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
        // Si NO existe -> Crear nuevo
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
        // Si YA existe -> Actualizar (excepto cédula)
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
        // Uso correcto de strings anidados (comillas simples dentro de dobles para el onclick)
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
        // Opcional: bloquear la cédula para que no se edite en la actualización si se desea
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
    document.getElementById("txtCedula").disabled = false; // Habilitar de nuevo la cédula
    mostrarTextoEnCaja("txtNombre", "");
    mostrarTextoEnCaja("txtApellido", "");
    mostrarTextoEnCaja("txtIngresos", "");
    mostrarTextoEnCaja("txtEgresos", "");
    clienteSeleccionado = null;
}

// Ejecutar pintado inicial al cargar la página si ya hay datos por defecto
window.onload = function() {
    pintarClientes();
    mostrarSeccion('parametros'); // Mostrar sección por defecto
};