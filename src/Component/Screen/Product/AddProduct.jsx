import React, { useState, useEffect } from "react";

//DataBase
// ---------------------------------------------------
import { ref, push } from "firebase/database";
import { db } from "../../Config/firebase";
// ---------------------------------------------------

//Notify
// ---------------------------------------------------
import { toast, ToastContainer } from "react-toastify";
import "../../../assets/Css/Tostify.css";
// ---------------------------------------------------

//Modal Css
// ---------------------------------------------------
import "../../../assets/Css/Model.css";
// ---------------------------------------------------

function AddProduct() {
  // Multiply
  const [itemCost, setItemCost] = useState("");
  const [itemQty, setItemQty] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  useEffect(() => {
    const cost = parseFloat(itemCost);
    const quantity = parseFloat(itemQty);

    if (!isNaN(cost) && !isNaN(quantity)) {
      const total = cost * quantity;
      setTotalAmount(total);
    } else {
      setTotalAmount("");
    }
  }, [itemCost, itemQty]);

  // Insert
  const [itemName, setItemName] = useState("");
  const [brandCode, setBrandCode] = useState("");
  const [measurement, setMeasurement] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [description, setDescription] = useState("");

  const handleSaveChanges = () => {
    handleInputBlur("ItemName", itemName);
    handleInputBlur("BrandCode", brandCode);
    handleInputBlur("itemCost", itemCost);
    handleInputBlur("SellPrice", sellPrice);
    handleInputBlur("itemQty", itemQty);

    if (itemName && brandCode && itemCost && sellPrice && itemQty) {
      // Implement your save logic here
      console.log("Changes saved!");

      try {
        const productsRef = ref(db, "Product");
        const newProduct = {
          itemName: itemName,
          brandCode: brandCode,
          measurement: measurement,
          itemCost: itemCost,
          sellPrice: sellPrice,
          itemQty: itemQty,
          total: totalAmount,
          description: description,
        };
        push(productsRef, newProduct);

        // Show a success toast if the product is successfully added
        toast.success("Product Added Successfully", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        setTimeout(() => {
          setItemName("");
          setBrandCode("");
          setMeasurement("");
          setItemCost("");
          setSellPrice("");
          setItemQty("");
          setTotalAmount("");
          setDescription("");
        }, 2000);

        // handleClose(); // Close the modal after successful insert
      } catch (error) {
        toast.error("Error adding product: " + error.message, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        console.log("Error adding product:", error);
      }
    }
  };

  // Validation
  const [ItemNameError, setItemNameError] = useState("");
  const [BrandCodeError, setBrandCodeError] = useState("");
  const [itemCostError, setItemCostError] = useState("");
  const [SellPriceError, setSellPriceError] = useState("");
  const [itemQtyError, setItemQtyError] = useState("");

  const handleInputBlur = (field, value) => {
    switch (field) {
      case "ItemName":
        if (value.trim() === "") {
          setItemNameError("Item Name is required");
          // toast.error('Item Name is required', {
          //   position: 'top-right',
          //   autoClose: 2000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: false,
          //   draggable: true,
          //   progress: undefined,
          //   theme: 'light',
          // });
        } else {
          setItemNameError("");
        }
        break;
      case "BrandCode":
        if (value === "") {
          setBrandCodeError("Brand Code is required");
          // toast.error('Brand Code is required', {
          //   position: 'top-right',
          //   autoClose: 2000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: false,
          //   draggable: true,
          //   progress: undefined,
          //   theme: 'light',
          // });
        } else {
          setBrandCodeError("");
        }
        break;
      case "itemCost":
        if (value.trim() === "") {
          setItemCostError("Item Cost is required");
          // toast.error('Item Cost is required', {
          //   position: 'top-right',
          //   autoClose: 2000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: false,
          //   draggable: true,
          //   progress: undefined,
          //   theme: 'light',
          // });
        } else {
          setItemCostError("");
        }
        break;
      case "SellPrice":
        if (value.trim() === "") {
          setSellPriceError("Sell Price is required");
          // toast.error('Sell Price is required', {
          //   position: 'top-right',
          //   autoClose: 2000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: false,
          //   draggable: true,
          //   progress: undefined,
          //   theme: 'light',
          // });
        } else {
          setSellPriceError("");
        }
        break;
      case "itemQty":
        if (value.trim() === "") {
          setItemQtyError("Item Quantity is required");
          // toast.error('Item Quantity is required', {
          //   position: 'top-right',
          //   autoClose: 2000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: false,
          //   draggable: true,
          //   progress: undefined,
          //   theme: 'light',
          // });
        } else {
          setItemQtyError("");
        }
        break;
      default:
        break;
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <button
        className="btn btn-primary"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#error-modal"
        style={{float:'right'}}
      >
        Add Product
      </button>

      {/* Modal */}
      {/* 
<div className="modal fade" id="error-modal" tabindex="-1" style={{display: 'none'}} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                      <div className="modal-content position-relative">
                        <div className="position-absolute top-0 end-0 mt-2 me-2 z-1">
                          <button className="btn-close btn btn-sm btn-circle d-flex flex-center transition-base" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-0">
                          <div className="rounded-top-3 py-3 ps-4 pe-6 bg-body-tertiary">
                            <h4 className="mb-1" id="modalExampleDemoLabel">Add a new illustration </h4>
                          </div>
                          <div className="p-4 pb-0">
                            <form>
                              <div className="mb-3">
                                <label className="col-form-label" htmlFor="recipient-name">Recipient:</label>
                                <input className="form-control" id="recipient-name" type="text" />
                              </div>
                              <div className="mb-3">
                                <label className="col-form-label" htmlFor="message-text">Message:</label>
                                <textarea className="form-control" id="message-text"></textarea>
                              </div>
                            </form>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button className="btn btn-secondary" type="button" data-bs-dismiss="modal">Close</button>
                          <button className="btn btn-primary" type="button">Understood </button>
                        </div>
                      </div>
                    </div>
                  </div> */}

      <div
        className="modal fade"
        id="error-modal"
        tabindex="-1"
        style={{ display: "none" }}
        aria-hidden="true"
      >
        <div className="modal-dialog custom-modal">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title h4">Add Product</div>
              <button
                type="button"
                className="btn-close btn btn-sm d-flex flex-center transition-base"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <div className="container">
                <form>
                  <div className="row">
                    <div className="col-md-12 col-sm-12 col-lg-12">
                      <div className="mb-3">
                        <label
                          for="ItemName"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Item Name
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="ItemName"
                          placeholder="Enter Item Name"
                          value={itemName}
                          onBlur={() => handleInputBlur("ItemName", itemName)}
                          onFocus={() => setItemNameError("")}
                          onChange={(e) => setItemName(e.target.value)}
                        />
                        {ItemNameError && (
                          <div style={{ color: "red" }}>{ItemNameError}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 col-sm-6 col-lg-6">
                      <div className="mb-3">
                        <label
                          for="BrandCode"
                          className="form-label"
                          style={{ color: "block" }}
                        >
                          Brand Code
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                          className="form-select"
                          value={brandCode}
                          onBlur={() => handleInputBlur("BrandCode", brandCode)}
                          onFocus={() => setBrandCodeError("")}
                          onChange={(e) => setBrandCode(e.target.value)}
                        >
                          <option value="" disabled="">
                            Select One
                          </option>
                          <option value="Qarshi">Qarshi</option>
                          <option value="Ajmal">Ajmal</option>
                          <option value="Hamdard">Hamdard</option>
                        </select>
                        {BrandCodeError && (
                          <div style={{ color: "red" }}>{BrandCodeError}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-6 col-lg-6">
                      <div className="mb-3">
                        <label
                          for="exampleInputPassword1"
                          className="form-label"
                          style={{ color: "block" }}
                        >
                          Measurement
                        </label>
                        <select
                          className="form-select"
                          value={measurement}
                          onChange={(e) => setMeasurement(e.target.value)}
                        >
                          <option value="" disabled="">
                            Select One
                          </option>
                          <option value="kg">kg</option>
                          <option value="gm">gm</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 col-sm-6 col-lg-6">
                      <div className="mb-3">
                        <label
                          for="itemCost"
                          className="form-label"
                          style={{ color: "block" }}
                        >
                          Item Cost <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="itemCost"
                          placeholder="Enter Item Cost"
                          value={itemCost}
                          onBlur={() => handleInputBlur("itemCost", itemCost)}
                          onFocus={() => setItemCostError("")}
                          onChange={(e) => setItemCost(e.target.value)}
                        />
                        {itemCostError && (
                          <div style={{ color: "red" }}>{itemCostError}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-6 col-lg-6">
                      <div className="mb-3">
                        <label
                          for="SellPrice"
                          className="form-label"
                          style={{ color: "block" }}
                        >
                          Sell Price <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="SellPrice"
                          placeholder="Enter Sell Price"
                          value={sellPrice}
                          onBlur={() => handleInputBlur("SellPrice", sellPrice)}
                          onFocus={() => setSellPriceError("")}
                          onChange={(e) => setSellPrice(e.target.value)}
                        />
                        {SellPriceError && (
                          <div style={{ color: "red" }}>{SellPriceError}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 col-sm-6 col-lg-6">
                      <div className="mb-3">
                        <label
                          for="itemQty"
                          className="form-label"
                          style={{ color: "block" }}
                        >
                          Item Qty <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="itemQty"
                          placeholder="Enter Quantity"
                          value={itemQty}
                          onBlur={() => handleInputBlur("itemQty", itemQty)}
                          onFocus={() => setItemQtyError("")}
                          onChange={(e) => setItemQty(e.target.value)}
                        />
                        {itemQtyError && (
                          <div style={{ color: "red" }}>{itemQtyError}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-6 col-lg-6">
                      <div className="mb-3">
                        <label
                          for="openingStockPrice"
                          className="form-label"
                          style={{ color: "block" }}
                        >
                          Opening Stock Price
                        </label>
                        <input
                          type="text"
                          readonly=""
                          className="form-control"
                          id="openingStockPrice"
                          value={totalAmount}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 col-sm-12 col-lg-12">
                      <label
                        for="exampleInputPassword1"
                        className="form-label"
                        style={{ color: "block" }}
                      >
                        Description{" "}
                      </label>
                      <textarea
                        type="text"
                        className="form-control"
                        placeholder="Enter Description"
                        data-gramma-genius-id="18bfead0-7f41-4cb4-a383-671a47d5d315"
                        spellcheck="false"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="modal-footer">
            <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddProduct;
