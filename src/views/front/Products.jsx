import axios from "axios";
import { useEffect, useState } from "react";
import { useMessage } from "../../hooks/useMessage";
const {VITE_API_BASE, VITE_API_PATH}=import.meta.env
const API_BASE = VITE_API_BASE;
const API_PATH = VITE_API_PATH;

const Products = ({ handleQty, addCartLoadingState, openModal,moreLoadingState})=>{
const [productData,setProductData]=useState([]);
const {shoeSuccess, showError} = useMessage();
const getProducts = async()=>{
        try {
            const res = await axios.get(`${API_BASE}/api/${API_PATH}/products/all`);
            setProductData(res.data?.products);
        } catch (error) {
            showError(error.response.data);
        }
    }

    useEffect(()=>{
        getProducts();
    },[])
    
    
    return(

        <table className="table align-middle">
            <thead>
                <tr>
                <th>圖片</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th></th>
                </tr>
            </thead>
            <tbody>
            {productData.map((item)=>(
                <tr key={item.id}>
                <td style={{ width: "200px" }}>
                    <div
                    style={{
                        height: "100px",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundImage: `url(${item.imageUrl})`,
                    }}
                    ></div>
                </td>
                <td>{item.title}</td>
                <td>
                    <del className="h6">原價：{item.origin_price}</del>
                    <div className="h5">特價：{item.price}</div>
                </td>
                <td>
                    <div className="btn-group btn-group-sm">
                    <button type="button" className="btn btn-outline-secondary"
                    onClick={()=>{openModal(item)}}
                    disabled={moreLoadingState?.includes(item.id)}>
                        {moreLoadingState?.includes(item.id) ? (
                            <i className="fas fa-spinner fa-pulse"></i>
                        ) : (
                            <i className="fas fa-shopping-cart"></i>
                        )}
                        查看更多
                    </button>
                    <button type="button" className="btn btn-outline-danger" onClick={()=>{
                        handleQty(item.id);}}
                        disabled={addCartLoadingState?.includes(item.id)}>
                        {addCartLoadingState?.includes(item.id) ? (
                            <i className="fas fa-spinner fa-pulse"></i>
                        ) : (
                            <i className="fas fa-shopping-cart"></i>
                        )}
                        加到購物車
                    </button>
                    </div>
                </td>
                </tr>
            ))}
            </tbody>
            </table>

)}

export default Products;