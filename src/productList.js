import React, { useState, useEffect } from "react";
import './productList.css';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
// import 'bootstrap/dist/css/bootstrap.min.css';

function ProductList() {
  // holds products for display
  const [form, setForm] = useState([])   

  // holds checked products that are about to get deleted
  const [isChecked, setisChecked]= useState([]);

  useEffect(() => {
    getFormData()
  }, [])

  // recieves products from database
  const getFormData = () => {
    axios.get('http://localhost/react_ScandiProject/src/PHP/index.php').then(function(res) {
    console.log(res.data)
    setForm(res.data)
  })
  }

  const handlecheckbox = (e)=>{
    const {value, checked}= e.target;
    console.log(value);
    if(checked)
    {
      setisChecked([...isChecked, Number(value)]);
    } else{
      setisChecked(isChecked.filter( (e)=>e!== Number(value)));
    }
}


  // sends products to backend to get deleted
  const deleteProducts = (event) => {
    event.preventDefault();
    
    axios.delete('http://localhost/react_ScandiProject/src/PHP/index.php', {
      data: isChecked
    }).then(response => {
      if (response.ok) {
        setForm(form => form.filter(product => !isChecked.includes(product.sku)));
        setisChecked([]);
      }
    });
  }

  // page routing
  const navigate = useNavigate() 
  function handleClick() {
    navigate("ProductPage")
  }

    return (
        <>
  <div className="margin-for-page" id="pageContent">
    <form method="post" action="">
      {/* add and delete buttons  */}
      <h2 className="heading">Product List</h2>
      <div className="product__buttons">
        <button type="button" className="btn btn-primary btn-sm add_product" onClick={handleClick}> ADD</button>

        <button
          id="delete-product-btn"
          type="submit"
          name="please_delete"
          className="btn btn-primary btn-sm"
          // disabled={selectedProducts.length === 0}
          onClick={() => deleteProducts()}
          >MASS DELETE
        </button>
      </div>
      <hr size="2,5" width="95%" color="black" className="header__line" />

      <div className="form-container">
        {form.map((value, index) =>
        <div key={index} className="card-box-order-mine">
        <input className="delete-checkbox" type="checkbox" name="delete[]"
        value={value.sku}
        checked={ value.isChecked}
          onChange={(e)=>handlecheckbox(e)}/>
          {/* logic for differencing product types */}
            <div className="card-box-values">
                <p>{value.sku}</p>
                <p>{value.name}</p>
                <p>{value.price}.00 $</p>
                {value.height ? (
                <p>Dimension: {value.height}x{value.width}x{value.length}</p>
                ) : value.size ? (
                    <p>Size: {value.size}</p>
                ) : value.weight ? (
                    <p>Weight: {value.weight}</p>
                ) : (
                    <p></p>
                )
                }
                
                </div>
            </div>  
        )}

        <footer className="footer">
          <hr size="4,5" width="95%" color="black" className="footer__line" />
          <p className="footer__p">Scandiweb Test assignment</p>
        </footer>
      </div>
    </form>
  </div>
</>
    )
}

export default ProductList