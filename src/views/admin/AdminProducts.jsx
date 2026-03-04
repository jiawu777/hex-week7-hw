import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
import '../../assets/styles.css';
const AdminProducts = () => {

    const [tempProduct, setTempProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const getProducts = async()=>{
        try{
            const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`);
            setProducts(res.data.products);
        }catch(error){
            alert("無法取得商品清單：" + error.response.data.message);
            navigate("/login");
        }
    }

    const logout = async () => {
      try {
        await axios.post(`${API_BASE}/logout`);
        navigate("/");
        alert("已成功登出");
      } catch (error) {
        alert("登出失敗: " + error.response.data.message);
      }
      
    }

    const checkLogin = async()=>{
    // 從 cookie 中取得 token
    const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,"$1",);

      if(token){
          // 修改實體建立時所指派的預設配置
          axios.defaults.headers.common['Authorization'] = token;

          try{
                const res = await axios.post(`${API_BASE}/api/user/check`);
                if(res.data.success){
                  alert("登入驗證成功");
                  navigate("/admin/products");
                }
          }catch(error){
                alert("登入驗證失敗:" + error.response.data.message);
                navigate("/login");
          }

      }else{
        alert("尚未登入，請先登入");
      }
}

    useEffect(()=>{
      checkLogin();
      getProducts();
    },[]);

  return (
   <div className="container">
    <button type="button">
            <span className="btn btn-danger" onClick={logout}>登出</span>
    </button>
          <div className="row mt-5">
            <div className="col-md-6">
              <h2>產品列表</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr key={item.id}>
                      <td>{item.title}</td>
                      <td>{item.origin_price}</td>
                      <td>{item.price}</td>
                      <td>
                        {item.is_enabled?'已啟用':'尚未啟用'}
                      </td>
                      <td>
                        <button className="btn btn-primary" onClick={()=>{
                           setTempProduct(item);}}>查看細節</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <h2>單一產品細節</h2>
              {tempProduct ? (
                <div className="card mb-3">
                  <img src={tempProduct.imageUrl||"#"} className="card-img-top primary-image" alt="主圖" />
                  <div className="card-body">
                    <h5 className="card-title">
                      <span className="badge bg-primary ms-2">{tempProduct?.title}</span>
                    </h5>
                    <p className="card-text">商品描述：{tempProduct?.description}</p>
                    <p className="card-text">商品內容：{tempProduct.content}</p>
                    <div className="d-flex">
                      <p className="card-text text-secondary"><del>{tempProduct?.origin_price}</del></p>
                      元 / {tempProduct?.price} 元
                    </div>
                    <h5 className="mt-3">更多圖片：</h5>
                    <div className="d-flex flex-wrap">
                      {tempProduct?.imagesUrl.map((imgUrl,index) => 
                      (<img src={imgUrl} key={index}className="card-img-top secondary-image" alt="更多圖片" />)
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-secondary">請選擇一個商品查看</p>
              )}
            </div>
          </div>
        </div>
  );
};

export default AdminProducts;