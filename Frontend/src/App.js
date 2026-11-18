import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Index from "./pages/Index";
import Entradas from "./pages/Entradas";
import Salidas from "./pages/Salidas";
import Pagos from "./pages/Pagos";
import Calendario from "./pages/Calendario";


function App() {
  return (
    <BrowserRouter>
       <Body/>
       <Navbar/>
          <Routes>
            <Route path="/home" element={<Home />} />  
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/index" element={<Index />} />
            <Route path="/entradas" element={<Entradas />} />
            <Route path="/salidas" element={<Salidas />} />
            <Route path="/pagos" element={<Pagos />} />
            <Route path="/calendario" element={<Calendario />} />
          </Routes>
        <Footer/>
    </BrowserRouter>
  );
}

export default App;
