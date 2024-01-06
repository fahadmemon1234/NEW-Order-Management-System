import React from "react";

// Main Page Connect
// ---------------------------------------------------
import Main from "../../NavBar/Navbar";
// ---------------------------------------------------

// Add Modal
// ---------------------------------------------------
import AddProduct from "./AddProduct";
// ---------------------------------------------------

function Product() {
  return (
    <>
      <Main>
        <div className="card">
          <div className="card-body">

<div className="row" style={{paddingTop:'30px', alignItems:'center'}}>
<div className="col-md-6 col-sm-6 col-lg-6">
<h1>Product List</h1>
</div>

<div className="col-md-6 col-sm-6 col-lg-6">
<AddProduct/>
</div>
</div>
            

          </div>
        </div>
      </Main>
    </>
  );
}

export default Product;
