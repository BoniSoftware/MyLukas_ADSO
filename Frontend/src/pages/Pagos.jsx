import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoSalidas from "../assets/Pagos.jpg";
import InputField from "../components/InputField";
import Button from "../components/Button";
import "../styles/pagos.css";

function Salidas() {

  const navigate = useNavigate();

  // ESTADOS
  const [salidas, setSalidas] = useState([]);
  const [form, setForm] = useState({
    salida: "",
    descripcion: "",
    valor: "",
    fecha: "",
  });

  const [editando, setEditando] = useState(false);
   const [salidaId, setSalidaId] = useState(null);

  // OBTENER SALIDAS
  const obtenerSalidas = async () => {
    try {const res = await fetch("http://localhost:8000/api/salidas");
      const data = await res.json();
      setSalidas(data);
    } catch (error) {console.error(error);}
  };

  // CARGAR SALIDAS
  useEffect(() => {obtenerSalidas();}, []);

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
      if (editando) {res = await fetch(`http://localhost:8000/api/salidas/${salidaId}`,
          {method: "PUT", headers: {"Content-Type": "application/json"},
            body: JSON.stringify(datosEnviar)}
        );
      } else {

        // REGISTRAR
        res = await fetch("http://localhost:8000/api/salidas",
          {method: "POST", headers: {"Content-Type": "application/json"},
            body: JSON.stringify(datosEnviar)}
        );
      }

      const data = await res.json();
      if (res.ok) {alert(data.message ||
          (editando
            ? "Salida actualizada correctamente"
            : "Salida registrada correctamente")
        );

        // LIMPIAR FORMULARIO
        setForm({
          salida: "",
          descripcion: "",
          valor: "",
          fecha: "",
        });

        setEditando(false);
        setSalidaId(null);

        // RECARGAR USUARIOS
        obtenerSalidas();

        // REDIRECCION
        setTimeout(() => {
          navigate("/Salidas");
        }, 1500);

      } else {alert(data.error || "Error en el proceso");}

    } catch (error) {
      console.error(error); alert("Error de conexión con el servidor");
    }
  };

  // ELIMINAR SALIDA
  const eliminarSalidas = async (id) => {
    const confirmar = window.confirm(
      "¿Eliminar salida?"
    );
    if (!confirmar) return;
    try {await fetch(`http://localhost:8000/api/salidas/${id}`,
        {method: "DELETE"}
      );
      obtenerSalidas();
    } catch (error) {console.error(error);}
  };

  // EDITAR SALIDA
  const editarSalidas = (salida) => {
    setForm({
      salida: salida.salida,
      descripcion: salida.descripcion,
      valor: salida.valor,
      fecha: salida.fecha || "",
    });

    setSalidaId(salida._id);
    setEditando(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // SUMATORIA DE SALIDAS
  const totalSalidas = salidas.reduce((acc, item) => {
    return acc + Number(item.valor);
  }, 0);

// AGRUPAR ENTRADAS POR FECHA
  const salidasPorFecha = salidas.reduce((grupos, salida) => {
    const fecha = salida.fecha
      ? new Date(salida.fecha).toLocaleDateString("es-CO")
      : "Sin fecha";

    if (!grupos[fecha]) {grupos[fecha] = [];}
    grupos[fecha].push(salida);
    return grupos;
  }, {});

  return (
    <div className="containerSalidas">

      {/* IMAGEN */}
      <div className="col">
        <img src={logoSalidas} alt="Logo" className="logoSalidas"/>
      </div>

      {/* FORMULARIO */}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <InputField
            label="Salida :"
            type="text"
            name="salida"
            value={form.salida}
            onChange={handleChange}
            placeholder="Ingrese nombre salida"
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
                ? "Actualizar Salida"
                : "Registrar Salida"
            }/>
        </form>
      </div>

      {/* LISTADO DE SALIDAS */}
      <div className="salidas-container">
        <h3>Salidas Registradas: $ {totalSalidas.toLocaleString("es-CO")}</h3>
        {Object.entries(salidasPorFecha).map(([fecha, salidasFecha]) => (
          <div key={fecha} className="grupo-fecha">
            
            {/* TITULO DE LA FECHA */}
            <h4 className="titulo-fecha">
              📅 Fecha: {fecha}
            </h4>

            {/* SALIDAS DE ESA FECHA */}
            {salidasFecha.map((salida) => (
              <div key={salida._id} className="card-salidas">
                <div>
                  <strong>{salida.salida}</strong>{" - "}
                  {salida.descripcion}{" - "}
                  $ {Number(salida.valor).toLocaleString("es-CO")}
                </div>
                <button
                  className="btn-editar"
                  onClick={() => editarSalidas(salida)}
                  >Editar</button>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarSalidas(salida._id)}
                  >Eliminar</button>
              </div>
            ))}
          </div>
        ))}
      </div> 
    </div>
  );
}

export default Salidas;