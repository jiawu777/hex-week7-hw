
const SingleProductModal = ({productData, closeModal,handleQty, count, setCount, addCartLoadingState})=>{

    return (
   <div className="modal" id="productModal">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">產品名稱：{productData.title}</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={()=>closeModal()}
          ></button>
        </div>
        <div className="modal-body">
          <img className="w-100" src={productData.imageUrl||"#"} alt={productData.title} />
          <p className="mt-3">產品內容：{productData.content}</p>
          <p>產品描述：{productData.description}</p>
          <p>
            價錢：<del>原價 ${productData.origin_price}</del>，特價：${productData.price}
          </p>
          <div className="d-flex align-items-center">
            <label style={{ width: "150px" }}>購買數量：{productData.qty}</label>
            <button
              className="btn btn-danger"
              type="button"
              id="button-addon1"
              aria-label="Decrease quantity"
              onClick={()=>{count > 1 && setCount(prevCount => prevCount - 1)}}
            >
              <i className="fa-solid fa-minus"></i>
            </button>
            <input
              className="form-control"
              type="number"
              min="1"
              max="10"
              value={count}
              onChange={(e)=>{setCount(Number(e.target.value))}}
            />
            <button
              className="btn btn-primary"
              type="button"
              id="button-addon2"
              aria-label="Increase quantity"
              onClick={()=>{count < 10 && setCount(prevCount => prevCount + 1)}}
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" 
                        onClick={()=>{
                        handleQty(productData.id,count);}}
                        disabled={addCartLoadingState.includes(productData.id)}>
                        {addCartLoadingState.includes(productData.id) ? (
                            <i className="fas fa-spinner fa-pulse"></i>
                        ) : (
                            <i className="fas fa-shopping-cart"></i>
                        )}

            加入購物車
          </button>
        </div>
      </div>
    </div>
</div>
  );
}

export default SingleProductModal;