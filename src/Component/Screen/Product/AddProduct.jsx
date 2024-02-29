import React, { useState, useEffect } from "react";

// Bootstrap Modal
// ---------------------------------------------------
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
// ---------------------------------------------------

//DataBase
// ---------------------------------------------------
import { ref, push, get } from "firebase/database";
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

import AddMeasurment from "./AddMeasurment";
import AddBrandCode from "./AddBrandCode";

function AddProduct() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setItemName("");
    setItemQty("");
    setItemCost("");
    setSellPrice("");
    setSelectedMeasurement(0);
    // setBrandCode("");
    setSelectedBrandCode(0);
    setTotalAmount("");
    setDescription("");
    setShow(true);
  };

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
  const [sellPrice, setSellPrice] = useState("");
  const [SelectedBrandCode, setSelectedBrandCode] = useState("");
  const [SelectedMeasurement, setSelectedMeasurement] = useState("");
  const [description, setDescription] = useState("");

  const handleSaveChanges = () => {
    if (itemName && SelectedBrandCode && itemCost && sellPrice && itemQty) {
      // Implement your save logic here
      console.log("Changes saved!");

      try {
        const loggedInUID = localStorage.getItem("uid");
        const productsRef = ref(db, "Product");
        const newProduct = {
          uid: loggedInUID,
          itemName: itemName,
          brandCode: SelectedBrandCode,
          measurement: SelectedMeasurement,
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
          handleClose();
          setItemName("");
          setSelectedBrandCode(0);
          setSelectedMeasurement(0);
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
    } else {
      handleInputBlur("ItemName", itemName);
      handleInputBlur("BrandCode", SelectedBrandCode);
      handleInputBlur("itemCost", itemCost);
      handleInputBlur("SellPrice", sellPrice);
      handleInputBlur("itemQty", itemQty);
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

  // Select2 DropDown Measurement

  const [MeasurementOptions, setMeasurementOptions] = useState([]);
  const loggedInUID = localStorage.getItem("uid");

  const [Measurement, setMeasurement] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataRef = ref(db, "Measurement");
        const snapshot = await get(dataRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          debugger;
          // Convert the data object into an array of options
          const options = Object.keys(data).map((key) => ({
            Id: key,
            value: data[key].codeValue,
            label: data[key].codeValue,
            IsActive: data[key].isActive,
            uid: data[key].uid,
          }));

          // console.log("All Banks:", options); // Log all banks before filtering

          // Filter options based on loggedInUID
          const userBanks = options.filter(
            (bank) => bank.uid === loggedInUID && bank.IsActive === true
          );
          setMeasurement(userBanks);

          // console.log("User Banks:", userBanks); // Log filtered banks

          if (userBanks.length > 0) {
            // Add the "Select Bank" option to the beginning of the array
            setMeasurementOptions([
              {
                value: "0",
                label: "Select Measurement",
                disabled: true,
                selected: true,
              },
              ...userBanks,
            ]);
          } else {
            console.error(
              "No matching Measurement for loggedInUID:",
              loggedInUID
            );
            // Handle the case where no matching banks are found
          }
        } else {
          console.error("Data doesn't exist in the 'Measurement' node.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 2000); // Fetch data every 60 seconds

    return () => clearInterval(intervalId);
  }, [db, loggedInUID]);

  const handleMeasurementSelect = (selectedOption) => {
    setSelectedMeasurement(selectedOption?.value);
  };

  // Select2 DropDown Brand Code

  const [BrandCodeOptions, setBrandCodeOptions] = useState([]);

  const [BrandCode, setBrandCode] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataRef = ref(db, "BrandCode");
        const snapshot = await get(dataRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          debugger;
          // Convert the data object into an array of options
          const options = Object.keys(data).map((key) => ({
            Id: key,
            value: data[key].codeValue,
            label: data[key].codeValue,
            IsActive: data[key].isActive,
            uid: data[key].uid,
          }));

          // console.log("All Banks:", options); // Log all banks before filtering

          // Filter options based on loggedInUID
          const userBanks = options.filter(
            (bank) => bank.uid === loggedInUID && bank.IsActive === true
          );
          setBrandCode(userBanks);

          // console.log("User Banks:", userBanks); // Log filtered banks

          if (userBanks.length > 0) {
            // Add the "Select Bank" option to the beginning of the array
            setBrandCodeOptions([
              {
                value: "0",
                label: "Select Brand Code",
                disabled: true,
                selected: true,
              },
              ...userBanks,
            ]);
          } else {
            console.error(
              "No matching Brand Code for loggedInUID:",
              loggedInUID
            );
            // Handle the case where no matching banks are found
          }
        } else {
          console.error("Data doesn't exist in the 'Brand Code' node.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 2000); // Fetch data every 60 seconds

    return () => clearInterval(intervalId);
  }, [db, loggedInUID]);

  const handleBrandCodeSelect = (selectedOption) => {
    setSelectedBrandCode(selectedOption?.value);
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
        onClick={handleShow}
        style={{ float: "right" }}
      >
        Add Product
      </button>

      {/* -----------------------------------Modal--------------------------------------------- */}
      {/* Modal */}
      <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <form>
              <div className="row">
                <div className="col-md-12 col-sm-12 col-lg-12">
                  <div className="mb-3">
                    <label
                      htmlFor="ItemName"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      Item Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="ItemName"
                      value={itemName}
                      onBlur={() => handleInputBlur("ItemName", itemName)}
                      onFocus={() => setItemNameError("")}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder="Enter Item Name"
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
                      htmlFor="BrandCode"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      Brand Code <span style={{ color: "red" }}>*</span>
                    </label>

                    <Select
                      id="brandCode"
                      options={BrandCode}
                      styles={{
                        menu: (provided, state) => ({
                          ...provided,
                          overflowY: "auto", // Add scrollbar when needed
                          maxHeight:
                            state.selectProps.menuIsOpen && BrandCode.length > 5
                              ? "none"
                              : "150px", // Set a maximum height when the menu is open and items are greater than 5
                        }),
                      }}
                      isSearchable={true}
                      placeholder="Select Brand Code"
                      onChange={handleBrandCodeSelect}
                      onBlur={() =>
                        handleInputBlur("BrandCode", SelectedBrandCode)
                      }
                      onFocus={() => setBrandCodeError("")}
                    />
                    <AddBrandCode />
                    {BrandCodeError && (
                      <div style={{ color: "red" }}>{BrandCodeError}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="exampleInputPassword1"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      Measurement
                    </label>

                    <Select
                      id="measurement"
                      options={Measurement}
                      styles={{
                        menu: (provided, state) => ({
                          ...provided,
                          overflowY: "auto", // Add scrollbar when needed
                          maxHeight:
                            state.selectProps.menuIsOpen &&
                            Measurement.length > 5
                              ? "none"
                              : "150px", // Set a maximum height when the menu is open and items are greater than 5
                        }),
                      }}
                      isSearchable={true}
                      placeholder="Select Measurement"
                      onChange={handleMeasurementSelect}
                    />

                    <AddMeasurment />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="itemCost"
                      className="form-label"
                      style={{ color: "black" }}
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
                      htmlFor="SellPrice"
                      className="form-label"
                      style={{ color: "black" }}
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
                      htmlFor="itemQty"
                      className="form-label"
                      style={{ color: "black" }}
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
                      htmlFor="openingStockPrice"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      Opening Stock Price
                    </label>
                    <input
                      type="text"
                      readOnly
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
                    htmlFor="exampleInputPassword1"
                    className="form-label"
                    style={{ color: "black" }}
                  >
                    Description{" "}
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter Description"
                  ></textarea>
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddProduct;
