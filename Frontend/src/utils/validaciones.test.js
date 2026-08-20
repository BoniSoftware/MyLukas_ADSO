import { validarRegistro } from "./validaciones";

describe("Validación del formulario de Registro", () => {

    test("Debe mostrar error cuando el documento está vacío", () => {

        const datos = {
            nombre: "Carlos",
            documento: "",
            correo: "carlos@gmail.com"
        };

        const resultado = validarRegistro(datos);

        expect(resultado).toBe("El documento es obligatorio");

    });

});