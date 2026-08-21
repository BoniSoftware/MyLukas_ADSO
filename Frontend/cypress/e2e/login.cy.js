// CPF-LOG-001
describe("Módulo Login - MyLukas", () => {

    it("CPF-LOG-001 - Inicio de sesión exitoso", () => {

        // Interceptar la petición de Login
        cy.intercept(
            "POST",
            "http://localhost:8000/api/users/login"
        ).as("loginRequest");

        // 1. Abrir MyLukas
        cy.visit("http://localhost:3000/login");

        // 2. Ingresar documento
        cy.get('input[name="id"]')
            .should("be.visible")
            .type("80027041");

        // 3. Ingresar contraseña
        cy.get('input[name="password"]')
            .should("be.visible")
            .type("3004");

        // 4. Verificar que el botón esté habilitado
        cy.get('button[type="submit"]')
            .should("not.be.disabled");

        // 5. Iniciar sesión
        cy.get('button[type="submit"]')
            .click();

        // 6. Esperar respuesta del Backend
        cy.wait("@loginRequest")
            .its("response.statusCode")
            .should("eq", 200);

        // 7. Verificar que se generó el JWT
        cy.window()
            .its("localStorage")
            .invoke("getItem", "token")
            .should("exist");

        // 8. Verificar redirección
        cy.url()
            .should("include", "/index");

    });

});

// CPF-LOG-002
describe("Módulo Login - MyLukas", () => {

    beforeEach(() => {
        cy.clearLocalStorage();
    });

    it("CPF-LOG-002 - Inicio de sesión con contraseña incorrecta", () => {

        // Interceptar la petición al backend
        cy.intercept(
            "POST",
            "http://localhost:8000/api/users/login"
        ).as("loginRequest");

        // Abrir MyLukas
        cy.visit("http://localhost:3000/login");

        // Capturar el alert de la aplicación
        cy.window().then((win) => {
            cy.stub(win, "alert").as("alert");
        });

        // Ingresar documento
        cy.get('input[name="id"]')
            .should("be.visible")
            .type("80027041");

        // Ingresar contraseña incorrecta
        cy.get('input[name="password"]')
            .should("be.visible")
            .type("0000");

        // Verificar que el botón esté habilitado
        cy.get('button[type="submit"]')
            .should("not.be.disabled");

        // Hacer clic en Iniciar Sesión
        cy.get('button[type="submit"]')
            .click();

        // Esperar respuesta del backend
        cy.wait("@loginRequest")
            .its("response.statusCode")
            .should("eq", 400);

        // Verificar mensaje de error
        cy.get("@alert")
            .should("have.been.calledWith", "Contraseña incorrecta");

        // Verificar que no se haya generado JWT
        cy.window()
            .its("localStorage")
            .invoke("getItem", "token")
            .should("not.exist");

        // Verificar que no haya redirección
        cy.url()
            .should("include", "/login");

    });

});