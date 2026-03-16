import React from "react";
import axios from "axios";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
const { useState, useEffect, useRef } = React;
const{VITE_API_BASE, VITE_API_PATH}=import.meta.env

import Pagination from "../../components/Pagination";
import ProductModal from "../../components/ProductModal";
import { useMessage } from "../../hooks/useMessage";
import { useNavigate } from "react-router-dom";


const API_BASE = VITE_API_BASE;
const API_PATH = VITE_API_PATH; 

function AdminProducts() {
  const INITIAL_PRODUCT_DATA = { 
      "name": "",
      "title": "",
      "category": "",
      "origin_price": 0,
      "price": 0,
      "unit": "",
      "description": "",
      "content": "",
      "is_enabled": 0,
      "imageUrl": "",
      "imagesUrl": []}

  const [products,setProducts] = useState([]);
  const [pagination,setPagination] = useState({});
  const [templateProduct,setTemplateProduct] = useState(INITIAL_PRODUCT_DATA);
  const productModalRef = useRef(null);
  const [modalType,setModalType] = useState("");
  const {showSuccess, showError} = useMessage();
  const navigate = useNavigate();
  

  const getProducts = async (page=1) => {
    try {
      //改url取頁碼，預設為1
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (err) {
      showError(err.response.data.message);
  }}

  const openModal = (type,product) => {
    setTemplateProduct((pre)=>({...pre,...product}));
    setModalType(type);
    productModalRef.current.show();
  }

  const closeModal = () => {
      productModalRef.current.hide();
  }

  const handleFileChange=async(e)=>{
    const url = `${API_BASE}/api/${API_PATH}/admin/upload`
    const file = e.target.files[0];
    if(!file) return;

    const formData = new FormData();
    formData.append('file-to-upload', file);
    try {
      const response = await axios.post(url, formData);
      const imageUrl = response.data.imageUrl;
      setTemplateProduct((pre)=>({...pre,imageUrl})); 
    } catch (error) {
      showError(error.response.data)
    }finally{
      //清空input的值，讓使用者可以上傳同一張圖片
      e.target.value="";
    }
    
  }

   const logout = async () => {
      try {
        const res = await axios.post(`${API_BASE}/logout`);
        navigate("/");
        showSuccess(res.data.message)
      } catch (error) {
        showError(error.response.data.message);
      }
      
    }

useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;

    productModalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false
    });

     // Modal 關閉時移除焦點
    document
          .querySelector("#productModal")
          .addEventListener("hide.bs.modal", () => {
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }
          });

          getProducts();
  }, []);

  return (
    <>
      
      <div>
          <div className="container">
            <div className="text-end mt-4">
              <button className="btn btn-primary" 
              // data-bs-toggle="modal" data-bs-target="#productModal" 
              onClick={()=>{              
                openModal("create",INITIAL_PRODUCT_DATA);
              }}>建立新的產品</button>
              <button type="button" className="btn btn-danger" onClick={logout}>
                登出
              </button>
            </div>
            <table className="table mt-4">
              <thead>
                <tr>
                  <th width="120">分類</th>
                  <th>產品名稱</th>
                  <th width="120">原價</th>
                  <th width="120">售價</th>
                  <th width="100">是否啟用</th>
                  <th width="120">編輯</th>
                </tr>
              </thead>
              <tbody>
                
                  {products.map((item)=>{
                    return(
                      <tr key={item.id}>
                          <td>{item.category}</td>
                          <td>{item.title}</td>
                          <td className="text-end">{item.origin_price}</td>
                          <td className="text-end">{item.price}</td>
                          <td>
                            {item.is_enabled ?<span className="text-success">啟用</span>:<span>未啟用</span>}
                          </td>
                          <td>
                            <div className="btn-group">
                              <button type="button" className="btn btn-outline-primary btn-sm" 
                              // data-bs-toggle="modal" data-bs-target="#productModal" 
                              onClick={()=>{
                                openModal("edit",item);
                              }}>
                                編輯
                              </button>
                              <button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>{
                                openModal("delete",item);
                              }}>
                                刪除
                              </button>
                            </div>
                          </td>
                        </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
     <ProductModal 
     API_BASE={API_BASE} 
     API_PATH={API_PATH} 
     modalType={modalType} 
     templateProduct={templateProduct} 
     setTemplateProduct={setTemplateProduct} 
     closeModal={closeModal}
     getProducts={getProducts}
     handleFileChange={handleFileChange}
     productModalRef={productModalRef}
     pagination={pagination}
     />
     <Pagination 
     pagination={pagination}
     setPagination={setPagination}
     changePage={getProducts}/>
    </>
  );
}

export default AdminProducts


