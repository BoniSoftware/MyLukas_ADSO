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

  return (
    <div className="containerPagos">

      {/* LOGO */}
      <div className="col">
        <img src={logoPagos} alt="Pagos" className="logoPagos"/>
      </div>

      {/* FORMULARIO */}
      <div className="card">
        <h2>
          {editando
            ? "Actualizar vínculo de pago"
            : "Registrar vínculo de pago"}
        </h2>
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
          {editando && (
            <button
              type="button"
              className="btn-eliminar"
              onClick={cancelarEdicion}
            >Cancelar edición</button>
          )}
        </form>
      </div>

      {/* LISTADO */}
      <div className="pagos-container">
        <h2>Vínculos de pago registrados</h2>
        {pagos.length === 0 ? (
          <p>No hay vínculos de pago registrados.</p>
        ) : (

          pagos.map((pago, index) => (
            <div className="pago-card" key={pago._id}>
              <h3>{index + 1}. {pago.descripcion}</h3>
              <a
                href={pago.vinculo}
                target="_blank"
                rel="noopener noreferrer"
              >{pago.vinculo}</a>

              {/* LISTADO DE PAGOS */}
              <div className="pagos-container">
                <p></p>
                <button
                  className="btn-editar"
                  onClick={() => editarPagos(pagos)}
                  >Editar</button>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarPagos(pagos._id)}
                  >Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Pagos;