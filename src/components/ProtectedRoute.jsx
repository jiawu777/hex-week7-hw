import axios from "axios";
import { useMessage } from "../hooks/useMessage";
import { useEffect, useState } from "react";
import { RotatingSquare } from "react-loader-spinner";
import { Navigate } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_BASE;
const ProtectedRoute = ({children}) => {
    const [isAuth, setIsAuth] = useState(null);
    const [loading, setLoading] = useState(true);
    const {showError}=useMessage();
    
    const checkAdmin = async()=>{
        try {
            await axios.post(`${API_BASE}/api/user/check`);
            setIsAuth(true);
        } catch (error) {
            showError(error.response.data.message);
            setIsAuth(false);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
    const token = document.cookie
	    .split("; ")
	    .find((row) => row.startsWith("hexToken="))
	    ?.split("=")[1];

        if(token){
            axios.defaults.headers.common['Authorization'] = token;
        }

        checkAdmin();
    },[])

    if(loading)return <RotatingSquare/>;
    if(!isAuth)return <Navigate to="/login" />;


  return children;
};

export default ProtectedRoute;