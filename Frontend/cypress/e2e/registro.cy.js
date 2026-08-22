
// CPF-REG-001
describe("Módulo Registro - MyLukas", () => {

    it("CPF-REG-001 - Registro exitoso de usuario", () => {

        // Interceptar petición de registro
        cy.intercept(
            "POST",
            "http://localhost:8000/api/users/register"
        ).as("registerRequest");

        // Abrir módulo Registro
        cy.visit("http://localhost:3000/Registro");

        // Capturar mensaje alert
        cy.window().then((win) => {
            cy.stub(win, "alert").as("alert");
        });

        // 1. Nombre
        cy.get('input[name="name"]')
            .should("be.visible")
            .type("Yenny Tatiana");

        // 2. Apellido
        cy.get('input[name="second_name"]')
            .should("be.visible")
            .type("Ramirez");

        // 3. Documento
        cy.get('input[name="id"]')
            .should("be.visible")
            .type("11111");

        // 4. Correo
        cy.get('input[name="email"]')
            .should("be.visible")
            .type("yenny@gmail.com");

        // 5. Contraseña
        cy.get('input[name="password"]')
            .should("be.visible")
            .type("11111");

        // 6. Confirmar contraseña
        cy.get('input[name="confirmPassword"]')
            .should("be.visible")
            .type("11111");

        // 7. Aceptar términos
        cy.get("#terminos")
            .check()
            .should("be.checked");

        // 8. Verificar que el botón esté habilitado
        cy.contains("button", "Registrar Usuario")
            .should("not.be.disabled");

        // 9. Registrar usuario
        cy.contains("button", "Registrar Usuario")
            .click();

        // 10. Esperar respuesta del backend
        cy.wait("@registerRequest")
            .its("response.statusCode")
            .should("be.oneOf", [200, 201]);

        // 11. Verificar mensaje
        cy.get("@alert")
            .should(
                "have.been.calledWith",
                "✅ Usuario registrado correctamente"
            );

    });

});

// CPF-REG-002
describe("Módulo Registro - MyLukas", () => {

    it("CPF-REG-002 - Registro con documento existente", () => {

        // Interceptar registro
        cy.intercept(
            "POST",
            "http://localhost:8000/api/users/register"
        ).as("registerRequest");

        // Abrir MyLukas
        cy.visit("http://localhost:3000/Registro");

        // Capturar alert
        cy.window().then((win) => {
            cy.stub(win, "alert").as("alert");
        });

        // Nombre
        cy.get('input[name="name"]')
            .should("be.visible")
            .type("Yury Milena");

        // Apellido
        cy.get('input[name="second_name"]')
            .should("be.visible")
            .type("Gomez");

        // Documento existente
        cy.get('input[name="id"]')
            .should("be.visible")
            .type("11111");

        // Correo
        cy.get('input[name="email"]')
            .should("be.visible")
            .type("yury@gmail.com");

        // Contraseña
        cy.get('input[name="password"]')
            .should("be.visible")
            .type("y22222");

        // Confirmar contraseña
        cy.get('input[name="confirmPassword"]')
            .should("be.visible")
            .type("y22222");

        // Aceptar términos
        cy.get("#terminos")
            .check()
            .should("be.checked");

        // Verificar botón
        cy.contains("button", "Registrar Usuario")
            .should("not.be.disabled");

        // Registrar
        cy.contains("button", "Registrar Usuario")
            .click();

        // Verificar respuesta del backend
        cy.wait("@registerRequest")
            .then((interception) => {

                expect(interception.response.statusCode)
                    .to.eq(400);

                cy.log(
                    "Respuesta:",
                    JSON.stringify(interception.response.body)
                );

            });

    });

});