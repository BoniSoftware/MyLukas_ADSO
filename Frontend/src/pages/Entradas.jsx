import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoEntradas from "../assets/Entradas.jpg";
import InputField from "../components/InputField";
import Button from "../components/Button";
import "../styles/entradas.css";

function Entradas() {

  const navigate = useNavigate();

  // ESTADOS
  const [entradas, setEntradas] = useState([]);
  const [form, setForm] = useState({
    entrada: "",
    descripcion: "",
    valor: "",
    fecha: "",
  });

  const [editando, setEditando] = useState(false);
   const [entradaId, setEntradaId] = useState(null);

  // OBTENER ENTRADAS
  const obtenerEntradas = async () => {
    try {const res = await fetch("http://localhost:8000/api/entradas");
      const data = await res.json();
      setEntradas(data);
    } catch (error) {console.error(error);}
  };

  // CARGAR ENTRADAS
  useEffect(() => {obtenerEntradas();}, []);

  // ACTUALIZAR INPUTS
  const handleChange = (e) => {setForm({...form, [e.target.name]: e.target.value});
  };

  // ENVIAR FORMULARIO
  const handleSubmit = async (e) => {e.preventDefault();

  // VALIDAR EL CAMPO VALOR
    const valor = Number(form.valor);
      if (
        form.valor === "" ||
        !Number.isFinite(valor) ||
        valor <= 0
      ) {
        alert("El valor debe ser un número positivo mayor que cero.");
        return;
      }

    try {
      let res;

      // DATOS QUE SE ENVIARÁN AL BACKEND
      const datosEnviar = {...form, valor: Number(form.valor), fecha: form.fecha || new Date().toISOString(),};

      // ACTUALIZAR
      if (editando) {res = await fetch(`http://localhost:8000/api/entradas/${entradaId}`,
          {method: "PUT", headers: {"Content-Type": "application/json"},
            body: JSON.stringify(datosEnviar)}
        );
      } else {

        // REGISTRAR
        res = await fetch("http://localhost:8000/api/entradas",
          {method: "POST", headers: {"Content-Type": "application/json"},
            body: JSON.stringify(datosEnviar)}
        );
      }

      const data = await res.json();
      if (res.ok) {alert(data.message ||
          (editando
            ? "Entrada actualizada correctamente"
            : "Entrada registrada correctamente")
        );

        // LIMPIAR FORMULARIO
        setForm({
          entrada: "",
          descripcion: "",
          valor: "",
          fecha: "",
          });

        setEditando(false);
        setEntradaId(null);

        // RECARGAR USUARIOS
        obtenerEntradas();

        // REDIRECCION
        setTimeout(() => {
          navigate("/Entradas");
        }, 1500);

      } else {alert(data.error || "Error en el proceso");}

    } catch (error) {
      console.error(error); alert("Error de conexión con el servidor");
    }
  };

  // ELIMINAR ENTRADA
  const eliminarEntradas = async (id) => {
    const confirmar = window.confirm(
      "¿Eliminar entrada?"
    );
    if (!confirmar) return;
    try {await fetch(`http://localhost:8000/api/entradas/${id}`,
        {method: "DELETE"}
      );
      obtenerEntradas();
    } catch (error) {console.error(error);}
  };

  // EDITAR ENTRADA
  const editarEntradas = (entrada) => {
    setForm({
      entrada: entrada.entrada,
      descripcion: entrada.descripcion,
      valor: entrada.valor,
      fecha: entrada.fecha || "",
    });

    setEntradaId(entrada._id);
    setEditando(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // SUMATORIA DE ENTRADAS
  const totalEntradas = entradas.reduce((acc, item) => {
    return acc + Number(item.valor);
  }, 0);

  // AGRUPAR ENTRADAS POR FECHA
  const entradasPorFecha = entradas.reduce((grupos, entrada) => {
    const fecha = entrada.fecha
      ? new Date(entrada.fecha).toLocaleDateString("es-CO")
      : "Sin fecha";

    if (!grupos[fecha]) {grupos[fecha] = [];}
    grupos[fecha].push(entrada);
    return grupos;
  }, {});

  return (
    <div className="containerEntradas">

      {/* IMAGEN */}
      <div className="col">
        <img src={logoEntradas} alt="Logo" className="logoEntradas"/>
      </div>

      {/* FORMULARIO */}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <InputField
            label="Entrada :"
            type="text"
            name="entrada"
            value={form.entrada}
            onChange={handleChange}
            placeholder="Ingrese nombre entrada"
          />
          <InputField
            label="Descripcion :"
            type="text"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripcion corta"
          />
          <InputField
            label="Valor :"
            type="number"
            name="valor"
            value={form.valor}
            onChange={handleChange}
            placeholder="Ingrese valores positivos"
            min="0.01"
            step="1"
          />

          {/* BOTON */}
          <Button
            type="submit"
            text={
              editando
                ? "Actualizar Entrada"
                : "Registrar Entrada"
            }/>
        </form>
      </div>

      {/* LISTADO DE ENTRADAS */}
      <div className="entradas-container">
        <h3>Entradas Registradas: $ {totalEntradas.toLocaleString("es-CO")}</h3>
        {Object.entries(entradasPorFecha).map(([fecha, entradasFecha]) => (
          <div key={fecha} className="grupo-fecha">
            
            {/* TITULO DE LA FECHA */}
            <h4 className="titulo-fecha">
              📅 Fecha: {fecha}
            </h4>

            {/* ENTRADAS DE ESA FECHA */}
            {entradasFecha.map((entrada) => (
              <div key={entrada._id} className="card-entradas">
                <div>
                  <strong>{entrada.entrada}</strong>{" - "}
                  {entrada.descripcion}{" - "}
                  $ {Number(entrada.valor).toLocaleString("es-CO")}
                </div>
                <button
                  className="btn-editar"
                  onClick={() => editarEntradas(entrada)}
                  >Editar</button>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarEntradas(entrada._id)}
                  >Eliminar</button>
              </div>
            ))}
          </div>
        ))}
      </div> 
    </div>
  );
}

export default Entradas;