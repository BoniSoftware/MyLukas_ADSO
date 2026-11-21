import { useState, useEffect } from "react";
import logoPagos from "../assets/Pagos.jpg";
import InputField from "../components/InputField";
import Button from "../components/Button";
import "../styles/pagos.css";

function Pagos() {

  // ESTADOS
  const [pagos, setPagos] = useState([]);
  const [form, setForm] = useState({
    descripcion: "",
    vinculo: "",
  });

  const [editando, setEditando] = useState(false);
  const [pagoId, setPagoId] = useState(null);

  // OBTENER Y ORDENAR LOS VÍNCULOS
  const obtenerPagos = async () => {
    try {const res = await fetch("http://localhost:8000/api/pagos");
    if (!res.ok) {throw new Error("Error al consultar los pagos");}

      const data = await res.json();

      // Orden cronológico de registro
      const ordenados = [...data].sort(
        (a, b) =>
          new Date(a.createdAt || a.fecha) -
          new Date(b.createdAt || b.fecha)
      );

      setPagos(ordenados);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // CARGAR PAGOS
  useEffect(() => {obtenerPagos();}, []);

  // ACTUALIZAR CAMPOS
  const handleChange = (e) => {setForm({...form,[e.target.name]: e.target.value,
    });
  };

  // REGISTRAR O ACTUALIZAR
  const handleSubmit = async (e) => {e.preventDefault();

    if (!form.descripcion.trim() || !form.vinculo.trim()) {
      alert("Complete todos los campos");
      return;
    }
    try {
      const url = editando
        ? `${"http://localhost:8000/api/pagos"}/${pagoId}`
        : "http://localhost:8000/api/pagos";

      const res = await fetch(url, {
        method: editando ? "PUT" : "POST",
        headers: {"Content-Type": "application/json",
        },
        body: JSON.stringify({
          descripcion: form.descripcion.trim(),
          vinculo: form.vinculo.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al procesar el vínculo");
      }
      alert(
        editando
          ? "Vínculo actualizado correctamente"
          : "Vínculo registrado correctamente"
      );
      setForm({
        descripcion: "",
        vinculo: "",
      });

      setEditando(false);
      setPagoId(null);

      obtenerPagos();

    } catch (error) {
      console.error(error);
      alert(error.message || "Error de conexión con el servidor");
    }
  };

  // EDITAR VÍNCULO
  const editarPagos = (pago) => {
    setForm({
      descripcion: pago.descripcion || "",
      vinculo: pago.vinculo || "",
    });
    setPagoId(pago._id);
    setEditando(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // CANCELAR EDICIÓN
  const cancelarEdicion = () => {
    setForm({
      descripcion: "",
      vinculo: "",
    });
    setEditando(false);
    setPagoId(null);
  };

  // ELIMINAR VÍNCULO
  const eliminarPagos = async (id) => {
    const confirmar = window.confirm(
      "¿Está seguro de eliminar este vínculo de pago?"
    );
    if (!confirmar) return;
    try {const res = await fetch(`${"http://localhost:8000/api/pagos"}/${id}`, {method: "DELETE",
      });
      if (!res.ok) {throw new Error("No se pudo eliminar el vínculo");
      }
      alert("Vínculo eliminado correctamente");
      obtenerPagos();

    } catch (error) {
      console.error(error);
      alert("Error al eliminar el vínculo");
    }
  };

    // AGRUPAR VINCULOS POR FECHA
      const pagosPorFecha = pagos.reduce((grupos, pago) => {
      const fechaRegistro = pago.createdAt || pago.fecha;

      let fecha = "Sin fecha";
        if (fechaRegistro) {
          const fechaValida = new Date(fechaRegistro);
            if (!isNaN(fechaValida.getTime())) {
              fecha = fechaValida.toLocaleDateString("es-CO", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              });
            }
          }
          if (!grupos[fecha]) {grupos[fecha] = [];}
          grupos[fecha].push(pago);
          return grupos;
        }, {});

  return (
    <div className="containerPagos">

      {/* LOGO */}
      <div className="col">
        <img src={logoPagos} alt="Pagos" className="logoPagos"/>
      </div>

      {/* FORMULARIO */}
      <div className="card">
        
        <form onSubmit={handleSubmit}>

          <InputField
            label="Descripción:"
            type="text"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripcion del vinculo"
          />
          <InputField
            label="Vínculo de pago:"
            type="url"
            name="vinculo"
            value={form.vinculo}
            onChange={handleChange}
            placeholder="URL vinculo de pago"
            min="0.01"
            step="1"
          />

        {/* BOTON */}
          <Button
            type="submit"
            text={
              editando
                ? "Actualizar vínculo"
                : "Registrar vínculo"
            }/>
          
        </form>
      </div>

     {/* LISTADO DE ENTRADAS */}
      <div className="pagos-container">
        <h3>
          {Object.keys(pagosPorFecha).length === 0
            ? "No hay Vínculos Registrados"
            : "Vínculos Registrados"}
        </h3>

        {Object.entries(pagosPorFecha).map(([fecha, pagosFecha]) => (
          <div key={fecha} className="grupo-fecha">
            
            {/* TITULO DE LA FECHA */}
            <h4 className="titulo-fecha">
              📅 Fecha: {fecha}
            </h4>

            {/* PAGOS DE ESA FECHA */}
            {pagosFecha.map((pago) => (
              <div className="card-pagos">

                <div className="info-pago">
                  <strong>{pago.descripcion} : </strong>
                  <a
                    href={pago.vinculo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >{pago.vinculo}
                  </a>
                </div>
                <button
                  type="button"
                  className="btn-editar"
                  onClick={() => editarPagos(pago)}
                >Editar
                </button>
                <button
                  type="button"
                  className="btn-eliminar"
                  onClick={() => eliminarPagos(pago._id)}
                >Eliminar
                </button>
              </div>
            ))}
          </div>
        ))}
      </div> 
    </div>
  );
}

export default Pagos;