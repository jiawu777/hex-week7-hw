import axios from "axios";
import { useEffect } from "react";

const {VITE_API_BASE, VITE_API_PATH}=import.meta.env
const API_BASE = VITE_API_BASE;
const API_PATH = VITE_API_PATH;


const Cart=({getCartItems, cart, updateCartQty, setCount,delAllLoadingState,setDelAllLoadingState,delLoadingState,setDelLoadingState}) => {

    const deleteAllCartItems = async()=>{
      setDelAllLoadingState(1);
        try {
            await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
            setCount(1);
            await getCartItems();
        } catch (error) {
            alert("清空購物車失敗:" + error.response.data.message);
        }finally{
            setDelAllLoadingState(0);}
    }


        const deleteCartItem = async(id)=>{

        try {
            setDelLoadingState((prev)=>[...prev,id]);
            await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${id}`);
            setCount(1);
            await getCartItems();
        } catch (error) {
            alert("刪除商品失敗:" + error.response.data.message);
        }finally{
            setDelLoadingState((prev)=>prev.filter((i)=> i !== id));
        }
    }

    useEffect(()=>{
        getCartItems();
    },[])


    return(
        <div className="container">
  <h2>購物車列表</h2>
  <div className="text-end mt-4">
    {cart?.carts?.length > 0 &&
    <button type="button" className="btn btn-outline-danger" onClick={()=>{deleteAllCartItems()}} disabled={delAllLoadingState}>
      {delAllLoadingState? ( <i className="fas fa-spinner fa-pulse"></i>) : (<i className="fas fa-shopping-cart"></i>)}
      清空購物車
    </button>
    }
    
  </div>
  <table className="table">
    <thead>
      <tr>
        <th scope="col"></th>
        <th scope="col">品名</th>
        <th scope="col">數量/單位</th>
        <th scope="col">小計</th>
      </tr>
    </thead>
    <tbody>
{cart?.carts?.map((cartItem)=>{
    return(
        <tr key={cartItem.id}>
        <th scope="row" ></th>
        <td>{cartItem.product.title}</td>
        <td>
            <div className="input-group mb-3">
            <input type="number" className="form-control" 
            aria-label="qty" aria-describedby="basic-addon2" value={cartItem.qty} 
            onChange={(e)=>{if(e.target.value<1 || e.target.value>10)return;
            updateCartQty(cartItem.id,cartItem.product_id,e.target.value)}}/>
            <span className="input-group-text" id="basic-addon2">{cartItem.product.unit}</span>
            </div>
        </td>
        <td>{cartItem.total}</td>
        <td>
          <button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>{
                        deleteCartItem(cartItem.id);}}
                        disabled={delLoadingState.includes(cartItem.id)}>
                        {delLoadingState.includes(cartItem.id) ? (
                            <i className="fas fa-spinner fa-pulse"></i>
                        ) : (
                            <i className="fas fa-shopping-cart"></i>
                        )}
            刪除
          </button>
        </td>
        <td className="text-end"></td>
      </tr>
    )
})}
    </tbody>
    <tfoot>
      <tr>
        <td className="text-end" colSpan="3">
          總計
        </td>
        <td className="text-end">{cart.final_total}</td>
      </tr>
    </tfoot>
  </table>
</div>
    )
}

export default Cart;