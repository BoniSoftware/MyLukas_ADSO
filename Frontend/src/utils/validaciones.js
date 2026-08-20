export function validarRegistro(datos) {
    if (!datos.nombre || datos.nombre.trim() === "") {
        return "El nombre es obligatorio";
    }

    if (!datos.documento || datos.documento.trim() === "") {
        return "El documento es obligatorio";
    }

    if (!datos.correo || datos.correo.trim() === "") {
        return "El correo es obligatorio";
    }

    return null;
}