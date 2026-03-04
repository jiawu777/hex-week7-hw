import { NavLink, Outlet } from "react-router-dom"

const AdminLayout = ()=>{
    return(
        <>
            <header>
                <nav className="navbar navbar-expand-lg bg-body-tertiary">
                     <div className="container-fluid">
                        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/admin/products">產品列表</NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
            <Outlet/>
            <footer>2026 Jia Demo</footer>
        </>
    )
}

export default AdminLayout