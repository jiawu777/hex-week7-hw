import { NavLink } from "react-router-dom";

const Notfound = ()=>{
    return(
        <div className="text-center my-5">
            <h1>找不到404頁面</h1>
            <NavLink to="/" className="btn btn-primary mt-3">返回首頁</NavLink>
        </div>
    )
}

export default Notfound;