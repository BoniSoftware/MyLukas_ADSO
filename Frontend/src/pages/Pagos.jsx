import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoPagos from "../assets/Pagos.jpg";
import InputField from "../components/InputField";
import Button from "../components/Button";
import "../styles/pagos.css";

function Pagos() {

  const navigate = useNavigate();

  // ESTADOS
  const [pagos, setPagos] = useState([]);
  const [form, setForm] = useState({
    descripcion: "",
    vinculo: "",
  });

  const [editando, setEditando] = useState(false);
   const [pagoId, setPagoId] = useState(null);

  // OBTENER PAGOS
  const obtenerPagos = async () => {
    try {const res = await fetch("http://localhost:8000/api/pagos");
      const data = await res.json();
      setPagos(data);
    } catch (error) {console.error(error);}
  };

  // CARGAR PAGOS
  useEffect(() => {obtenerPagos();}, []);

  // ACTUALIZAR INPUTS
  const handleChange = (e) => {setForm({...form, [e.target.name]: e.target.value});
  };

  // ENVIAR FORMULARIO
  const handleSubmit = async (e) => {e.preventDefault();
    
    try {
      let res;
      // DATOS QUE SE ENVIARÁN AL BACKEND
      const datosEnviar = {...form, valor: Number(form.valor), fecha: form.fecha || new Date().toISOString(),};

      // ACTUALIZAR
      if (editando) {res = await fetch(`http://localhost:8000/api/pagos/${pagoId}`,
          {method: "PUT", headers: {"Content-Type": "application/json"},
            body: JSON.stringify(datosEnviar)}
        );
      } else {

        // REGISTRAR
        res = await fetch("http://localhost:8000/api/pagos",
          {method: "POST", headers: {"Content-Type": "application/json"},
            body: JSON.stringify(datosEnviar)}
        );
      }

      const data = await res.json();
      if (res.ok) {alert(data.message ||
          (editando
            ? "Pago actualizado correctamente"
            : "Pago registrado correctamente")
        );

        // LIMPIAR FORMULARIO
        setForm({
          descripcion: "",
          vinculo: "",
        });

        setEditando(false);
        setPagoId(null);

        // RECARGAR PAGOS
        obtenerPagos();

        // REDIRECCION
        setTimeout(() => {
          navigate("/Pagos");
        }, 1500);

      } else {alert(data.error || "Error en el proceso");}

    } catch (error) {
      console.error(error); alert("Error de conexión con el servidor");
    }
  };

  // ELIMINAR PAGO
  const eliminarPagos = async (id) => {
    const confirmar = window.confirm(
      "¿Eliminar vinculo de Pago?"
    );
    if (!confirmar) return;
    try {await fetch(`http://localhost:8000/api/pagos/${id}`,
        {method: "DELETE"}
      );
      obtenerPagos();
    } catch (error) {console.error(error);}
  };

  // EDITAR PAGO
  const editarPagos = (pago) => {
    setForm({
      descripcion: pago.descripcion,
      vinculo: pago.vinculo,
    });

    setPagoId(pago._id);
    setEditando(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="containerPagos">

      {/* IMAGEN */}
      <div className="col">
        <img src={logoPagos} alt="Logo" className="logoPagos"/>
      </div>

      {/* FORMULARIO */}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <InputField
            label="Descripcion :"
            type="text"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripcion del pago"
          />
          <InputField
            label="Vinculo :"
            type="text"
            name="vinculo"
            value={form.vinculo}
            onChange={handleChange}
            placeholder="Ingrese URL para vinculo de pago"
            min="0.01"
            step="1"
          />

          {/* BOTON */}
          <Button
            type="submit"
            text={
              editando
                ? "Actualizar Vinculo de Pago"
                : "Registrar Vinculo de Pago"
            }/>
        </form>
      </div>

      {/* LISTADO DE PAGOS */}
      <div className="pagos-container">

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
    
  );
}

export default Pagos;