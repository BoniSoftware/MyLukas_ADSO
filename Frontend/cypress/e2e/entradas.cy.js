
// CPF-ENT-001
describe("CPF-ENT-001 - Validar que el campo Valor solo acepte números positivos", () => {

  it("Debe rechazar valores negativos, cero y caracteres no numéricos", () => {

    const valoresInvalidos = [
      {
        valor: "-3000000",
        descripcion: "valor negativo"
      },
      {
        valor: "0",
        descripcion: "valor cero"
      },
      {
        valor: "abc",
        descripcion: "caracteres no numéricos"
      }
    ];

    valoresInvalidos.forEach((caso) => {

      cy.log(`Probando: ${caso.descripcion} → ${caso.valor}`);

      cy.intercept(
        "POST",
        "http://localhost:8000/api/entradas"
      ).as("registrarEntrada");

      cy.visit("http://localhost:3000/Entradas");

      cy.get('input[name="entrada"]')
        .type("Salario");

      cy.get('input[name="descripcion"]')
        .type("Pago mensual");

      if (caso.valor === "abc") {

        cy.get('input[name="valor"]')
          .invoke("val", "abc")
          .trigger("input");

      } else {

        cy.get('input[name="valor"]')
          .type(caso.valor);

      }

      cy.on("window:alert", (mensaje) => {

        expect(
          mensaje,
          `Validación para ${caso.descripcion}`
        ).to.equal(
          "El valor debe ser un número positivo mayor que cero."
        );

      });

      cy.contains("button", "Registrar Entrada")
        .click();

      cy.get("@registrarEntrada.all")
        .should(
          "have.length",
          0,
          `No debe enviarse POST para ${caso.descripcion}`
        );
    });
  });
});