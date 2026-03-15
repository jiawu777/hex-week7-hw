import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.js';
import validation  from '../../utils/validation';
import Products from './Products';
import Cart from './Cart';
import SingleProductModal from './SingleProductModal';
import { useMessage } from '../../hooks/useMessage';

const {VITE_API_BASE, VITE_API_PATH}=import.meta.env
const API_BASE = VITE_API_BASE;
const API_PATH = VITE_API_PATH;

const Checkout = () => {
    const [cart,setCart]=useState({carts:[]});
    const [addCartLoadingState,setAddCartLoadingState]=useState([]);
    const [moreLoadingState,setMoreLoadingState]=useState([]);
    const [delAllLoadingState,setDelAllLoadingState]=useState(0);   
    const [delLoadingState,setDelLoadingState]=useState([]);   
    const productModalRef = useRef(null);
    const [productData,setProductData]=useState({});
    const {register, handleSubmit,formState:{errors,isValid},reset} = useForm({mode:"onChange",})
    const [ count, setCount ] = useState(1);
    const {showSuccess, showError} = useMessage();
    

     const getCartItems = async()=>{
        try {
            const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
            setCart(res.data.data);
            return res.data.data;
        } catch (error) {
            showError(error.response.data);
        }
    }

    const addNewCartItem = async(id,qty=1)=>{
            const data = {
                    product_id:id,
                    qty:Number(qty)
            }

            try {
                await axios.post(`${API_BASE}/api/${API_PATH}/cart`,{data});
                await getCartItems();
            } catch (error) {
                showError(error.response.data);
            }
        }

    const updateCartQty = async(cartId,productId,qty)=>{
            const data = {
                    product_id:productId,
                    qty:Number(qty)
            }
            try {
                await axios.put(`${API_BASE}/api/${API_PATH}/cart/${cartId}`,{data});
                setCount(1);
                await getCartItems();
            } catch (error) {
                showError(error.response.data);
            }
        }

    const handleQty = async(id,targetQty=null)=>{
        setAddCartLoadingState((prevState)=>([...prevState,id]));
        const cartItem = cart.carts.find((cartItem)=> cartItem.product_id === id);
       
            try {
                if(cartItem){
                     const finalQty = targetQty ? targetQty :cartItem.qty + 1;
                    // 有 3 個地方可以改變數量：
                    // 1. Products產品列表：直接點擊加入購物車按鈕，預設增加 1 個
                    // 2. SingleProductModal查看更多：數量輸入框、+ - 按鈕
                    // 3. Cart購物車：數量輸入框、上下按鈕
                    if(finalQty < 1 || finalQty > 10){
                        alert("購買數量必須在 1 到 10 之間");
                        return;
                    }
                    await updateCartQty(cartItem.id,id,finalQty);
                 
                }else{
                    await addNewCartItem(id,targetQty || 1)
                }
            } catch (error) {
                showError(error.response.data);
            }finally{
                setCount(1);
                setAddCartLoadingState((prev)=>{
                    return prev.filter((i)=> i !== id)
                })}
                closeModal();

    }

    const onSubmitOrders = async(data) =>{

        const dataToSend = {
                user: {
                name: data.name,
                email: data.email,
                tel: data.tel,
                address: data.address
                },
                message: data.message
                }

                if(cart.carts.length<= 0){
                    return showError("購物車無內容，請添加後再送出訂單");
                }
                    try {
                        const res = await axios.post(`${API_BASE}/api/${API_PATH}/order`,{data:dataToSend});
                        showSuccess(res.data.message)
                            reset({
                                name: '',
                                email: '',
                                tel: '',
                                address: '',
                                message: ''
                            }
                        );
                        getCartItems();
                    } catch (error) {
                        showError(error.response.data);
                    }
                
            
    }

    useEffect(()=>{
        getCartItems();
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
    },[])

    const openModal = async(product)=>{
        try {
            setMoreLoadingState((prevState)=>([...prevState,product.id]));
            setProductData(product);
            const cartItem = cart?.carts?.find((cartItem)=> cartItem.product_id === product.id);
            setCount(cartItem ? cartItem.qty : 1);
            await getSingleProduct(product.id);
            productModalRef.current.show();
        } catch (error) {
            showError(error.response.data);
        }finally{
            setMoreLoadingState((prev)=>{
                return prev.filter((i)=> i !== product.id)
            })}
        }
        
    

    const closeModal = ()=>{
        productModalRef.current.hide();
    }

     const getSingleProduct = async(id)=>{
        try {
            await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
        } catch (error) {
            showError(error.response.data);
        }
    }

    return (
        <> 
        <SingleProductModal productData={productData} closeModal={closeModal} handleQty={handleQty} count={count} setCount={setCount} addCartLoadingState={addCartLoadingState}/>
        <Products openModal={openModal} handleQty={handleQty} addCartLoadingState={addCartLoadingState} moreLoadingState={moreLoadingState} />
        < br/>
        <Cart getCartItems={getCartItems} cart={cart} updateCartQty={updateCartQty} count={count} setCount={setCount} delAllLoadingState={delAllLoadingState} setDelAllLoadingState={setDelAllLoadingState} delLoadingState={delLoadingState} setDelLoadingState={setDelLoadingState}/>
        <div className="container" style={{width: "600px"}}>
            <div className="my-5 row justify-content-center">
                <form className="col-lg-6" onSubmit={handleSubmit(onSubmitOrders)}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-control"
                            placeholder="請輸入 Email"
                            {...register("email",validation.email)}
                        />
                        <p className="text-danger">{errors.email?.message}</p>
                    </div>

                    <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        收件人姓名
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        className="form-control"
                        placeholder="請輸入姓名"
                        {...register("name",validation.name)}
                    />
                    <p className='text-danger'>{errors.name?.message}</p>
                    </div>

                    <div className="mb-3">
                    <label htmlFor="tel" className="form-label">
                        收件人電話
                    </label>
                    <input
                        id="tel"
                        name="tel"
                        type="tel"
                        className="form-control"
                        placeholder="請輸入電話"
                        {...register("tel",validation.tel)}
                    />
                    <p className='text-danger'>{errors.tel?.message}</p>
                    </div>

                    <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                        收件人地址
                    </label>
                    <input
                        id="address"
                        name="address"
                        type="text"
                        className="form-control"
                        placeholder="請輸入地址"
                        {...register("address",validation.address)}
                    />
                    <p className='text-danger'>{errors.address?.message}</p>
                    </div>

                    <div className="mb-3">
                    <label htmlFor="message" className="form-label">
                        留言
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        className="form-control"
                        cols="30"
                        rows="10"
                        {...register("message")}
                    ></textarea>
                    </div>
                    <div className="text-end">
                    <button type="submit" className="btn btn-danger" disabled={!isValid}>
                        送出訂單
                    </button>
                    </div>
                </form>
            </div>
        </div>
        </>
        )
};

export default Checkout;