import { BrowserRouter, Routes, Route } from "react-router-dom"

import { MainLayout } from "./layout/MainLayout.jsx"

import { Home } from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"
import { Register } from "./pages/Register.jsx"
import { NotFound } from "./pages/NotFound.jsx"
import { Menu } from "./pages/Menu.jsx"
import { Bebidas } from "./pages/Bebidas.jsx"
import { Tradicionales } from "./pages/Tradicionales.jsx"
import { Comidas } from "./pages/Comidas.jsx"
import { Heladeria } from "./pages/Heladeria.jsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Páginas CON header y footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/bebidas" element={<Bebidas />} />
          <Route path="/tradicionales" element={<Tradicionales />} />
          <Route path="/comidas" element={<Comidas />} />
          <Route path="/heladeria" element={<Heladeria />} />
        </Route>

        {/* Páginas SIN header y footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App