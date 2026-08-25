describe("CPF-SAL-001 - Generación automática de fecha", () => {

  it("Debe generar automáticamente la fecha al registrar una salida", () => {

    const fechaEsperada = new Date().toLocaleDateString("es-CO");

    cy.intercept(
      "GET",
      "http://localhost:8000/api/salidas"
    ).as("obtenerSalidas");

    cy.intercept(
      "POST",
      "http://localhost:8000/api/salidas"
    ).as("registrarSalida");

    cy.visit("/Salidas");

    cy.wait("@obtenerSalidas");

    // Datos de la salida
    cy.get('input[name="salida"]')
      .type("Alimentación");

    cy.get('input[name="descripcion"]')
      .type("Mercado");

    cy.get('input[name="valor"]')
      .type("250000");

    // Registrar
    cy.contains("button", "Registrar Salida")
      .click();

    // Verificar respuesta del servidor
    cy.wait("@registrarSalida").then((interception) => {

      expect(interception.response.statusCode)
        .to.be.oneOf([200, 201]);

      // Verificar que la fecha fue enviada
      // o generada por el backend
      const salida = interception.request.body;

      expect(salida).to.have.property("fecha");

      expect(salida.fecha)
        .to.not.be.null;

      expect(salida.fecha)
        .to.not.be.undefined;

    });

    // Consultar nuevamente las salidas
    cy.reload();

    cy.wait("@obtenerSalidas");

    // Verificar fecha visible
    cy.contains(`📅 Fecha: ${fechaEsperada}`)
      .should("be.visible");

  });

});