import { BrowserRouter, Routes, Route } from "react-router-dom"

import { AuthProvider } from "./context/AuthProvider"

import { MainLayout }      from "./layout/MainLayout"
import { DashboardLayout } from "./layout/DashboardLayout"

import { Home }          from "./pages/Home"
import Login             from "./pages/Login"
import { Register }      from "./pages/Register"
import { NotFound }      from "./pages/NotFound"
import { Menu }          from "./pages/Menu"
import { Bebidas }       from "./pages/Bebidas"
import { Tradicionales } from "./pages/Tradicionales"
import { Comidas }       from "./pages/Comidas"
import { Heladeria }     from "./pages/Heladeria"
import { ConfirmEmail }  from "./pages/ConfirmEmail"

import DashboardPage          from "./pages/admin/DashboardPage"
import MenuManagerPage        from "./pages/admin/MenuManagerPage"
import VentaPage              from "./pages/admin/VentaPage"
import SeleccionProductosPage from "./pages/admin/SeleccionProductosPage"
import GestionPedidosPage     from "./pages/admin/GestionPedidosPage"

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>

                    <Route element={<MainLayout />}>
                        <Route path="/"             element={<Home />}          />
                        <Route path="/menu"          element={<Menu />}          />
                        <Route path="/bebidas"       element={<Bebidas />}       />
                        <Route path="/tradicionales" element={<Tradicionales />} />
                        <Route path="/comidas"       element={<Comidas />}       />
                        <Route path="/heladeria"     element={<Heladeria />}     />
                    </Route>

                    <Route path="/login"            element={<Login />}        />
                    <Route path="/register"         element={<Register />}     />
                    <Route path="/confirmar/:token" element={<ConfirmEmail />} />

                    <Route path="/admin" element={<DashboardLayout />}>
                        <Route path="dashboard"       element={<DashboardPage />}          />
                        <Route path="menu"            element={<MenuManagerPage />}        />
                        <Route path="venta"           element={<VentaPage />}             />
                        <Route path="venta/productos" element={<SeleccionProductosPage />} />
                        <Route path="pedidos"         element={<GestionPedidosPage />}    />
                        {/* Próximas páginas:
                        <Route path="analiticas" element={<AnaliticasPage />} />
                        <Route path="perfil"     element={<PerfilPage />}     /> */}
                    </Route>

                    <Route path="*" element={<NotFound />} />

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App