import React, { useEffect, useState } from "react";

// Bootstrap Modal
// ---------------------------------------------------
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import SweetAlert from "react-bootstrap-sweetalert";
import Select from "react-select";
// ---------------------------------------------------

// Main Page Connect
// ---------------------------------------------------
import Main from "../../NavBar/Navbar";
// ---------------------------------------------------

// Add Modal
// ---------------------------------------------------
import AddProduct from "./AddProduct";
// --------------------------------------------------

//DataBase
// ---------------------------------------------------
import { ref, onValue, update, remove, get } from "firebase/database";
import { db } from "../../Config/firebase";
// ---------------------------------------------------

//Modal Css
// ---------------------------------------------------
import "../../../assets/Css/Model.css";
// ----------------------------------------------------

//Notify
// ---------------------------------------------------
import { toast, ToastContainer } from "react-toastify";
import "../../../assets/Css/Tostify.css";
// ---------------------------------------------------

import AddMeasurment from "./AddMeasurment";
import AddBrandCode from "./AddBrandCode";

function Product() {
  const [tableData, setTableData] = useState([]);

  const loggedInUID = localStorage.getItem("uid");

  useEffect(() => {
    if (loggedInUID) {
      // Reference to the 'Product' node in Firebase Realtime Database
      const productRef = ref(db, "Product");

      // Attach an event listener for data changes
      const fetchData = () => {
        onValue(productRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            // Convert the object of products into an array
            const dataArray = Object.keys(data)
              .filter((key) => data[key].uid === loggedInUID) // Filter data based on UID
              .map((key) => ({
                id: key,
                ...data[key],
              }));

            setTableData(dataArray);
          }
        });
      };

      fetchData();
    } else {
      console.error("No user is currently logged in.");
      // Handle the case where no user is logged in, perhaps by redirecting to the login page.
    }
  }, [loggedInUID]);

  const sortedTableData = tableData.sort((a, b) => b.id - a.id);
  const sortedDataDescending = [...sortedTableData].sort((a, b) =>
    b.id.localeCompare(a.id)
  );

  //   RowDropDown Selection

  const [rowsToShow, setRowsToShow] = useState(5);

  const handleSelectChange = (event) => {
    setRowsToShow(parseInt(event.target.value, 10));
  };

  // Rows count and show
  // const totalItems = 8; // Replace with the actual total number of items
  const startIndexs = 1;
  // const endIndexs = Math.min(startIndexs + rowsToShow - 1, totalItems);
  const rowCount = sortedDataDescending.length; // Add this line to get the row count
  const paginationText = `${startIndexs} to ${rowsToShow} of ${rowCount}`;

  const [currentPage, setCurrentPage] = useState(1);

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    const totalPages = Math.ceil(sortedDataDescending.length / rowsToShow);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const startIndex = (currentPage - 1) * rowsToShow;
  const endIndex = Math.min(
    startIndex + rowsToShow,
    sortedDataDescending.length
  );
  const visibleItems = sortedDataDescending.slice(startIndex, endIndex);

  const totalPages = Math.ceil(sortedDataDescending.length / rowsToShow);

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

  //   ---------------------------------Edit Modal and Populate----------------------------------

  const [itemName, setItemName] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [description, setDescription] = useState("");

  const [editedItem, setEditedItem] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = (item) => {
    debugger;
    setEditedItem(item.id);
    setItemName(item.itemName);
    setBrandCode(item.brandCode);
    setSelectedBrandCode(item.brandCode);
    setMeasurement(item.measurement);
    setSelectedMeasurement(item.measurement);
    setSellPrice(item.sellPrice);
    setDescription(item.description);
    setItemCost(item.itemCost);
    setItemQty(item.itemQty);
    setTotalAmount(item.total);

    setShow(true);
  };

  const [SelectedBrandCode, setSelectedBrandCode] = useState("");
  const [SelectedMeasurement, setSelectedMeasurement] = useState("");

  const handleSaveChanges = async () => {
    try {
      debugger;
      console.log(editedItem);

      if (itemName && SelectedBrandCode && itemCost && sellPrice && itemQty) {
        // Implement your save logic here
        console.log("Changes saved!");

        const loggedInUID = localStorage.getItem("uid");
        // Construct the updated product object
        const updatedProduct = {
          uid: loggedInUID,
          itemName: itemName,
          brandCode: SelectedBrandCode,
          measurement: SelectedMeasurement,
          itemCost: itemCost,
          sellPrice: sellPrice,
          itemQty: itemQty,
          total: totalAmount,
          description: description,
          // Add other properties as needed
        };

        // Update the product data in Firebase
        const productRef = ref(db, `Product/${editedItem}`);
        await update(productRef, updatedProduct);

        // Show a success toast if the product is successfully added
        toast.success("Product Edit Successfully", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        // Close the modal
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else if (!itemName) {
        toast.error("Item Name is required", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (!SelectedBrandCode) {
        toast.error("Please select a brand code", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (!itemCost) {
        toast.error("Item Cost is required", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (!sellPrice) {
        toast.error("Sell Price is required", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (!itemQty) {
        toast.error("Item Quantity is required", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error("Unexpected error occurred", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (error) {
      console.log("Error updating data:", error);
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
    }
  };

  // Select2 DropDown Measurement

  const [MeasurementOptions, setMeasurementOptions] = useState([]);
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

  // -------------------------Delete-----------------------------

  const [showAlert, setShowAlert] = useState(false);
  const [showOK, setShowOK] = useState(false);
  const [id, setId] = useState(null);

  const handleDelete = (id) => {
    setId(id);
    setShowAlert(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const dataRef = ref(db, `Product/${id}`);
      await remove(dataRef);

      // Update the data state after deletion
      const updatedData = tableData.filter((item) => item.id !== id);
      setTableData(updatedData);

      setShowAlert(false);
      setShowOK(true);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowAlert(false);
  };

  const handleOK = () => {
    setShowOK(false);
  };

  // Search

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter items based on search query
  const filteredItems = visibleItems.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemQty.toString().includes(searchQuery) ||
      item.brandCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.measurement.toString().includes(searchQuery.toLowerCase())
  );

  

  return (
    <>
      <Main>
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

        <div className="card">
          <div className="card-body">
            {/* Headng and btn */}
            <div
              className="row"
              style={{ paddingTop: "30px", alignItems: "center" }}
            >
              <div className="col-md-6 col-sm-6 col-lg-6">
                <h1>Product List</h1>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6">
                <div style={{ float: "right" }}>
                  <AddProduct />

                  <br />
                  <br />

                  <div className="input-group rounded">
                    <label
                      style={{
                        fontSize: 15,
                        textAlign: "center",
                        margin: "auto",
                        marginRight: 5 + "px",
                      }}
                    >
                      Search:{" "}
                    </label>
                    <input
                      type="search"
                      className="form-control rounded"
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="search-addon"
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ------------------------------------------Table------------------------------------------ */}

            <br />
            <div className="row">
              <div className="col-md-12 col-sm-12">
                <div
                  id="tableExample"
                  data-list='{"valueNames":["name","email","age"],"page":5,"pagination":true}'
                >
                  <div className="table-responsive scrollbar">
                    <table className="table table-bordered table-striped fs-10 mb-0">
                      <thead className="bg-200">
                        <tr>
                          <th className="text-900 sort" data-sort="Action">
                            Action
                          </th>
                          <th className="text-900 sort" data-sort="ItemName">
                            Item Name
                          </th>
                          <th
                            className="text-900 sort"
                            data-sort="ItemQuantity"
                          >
                            Item Quantity
                          </th>
                          <th className="text-900 sort" data-sort="ItemCost">
                            Item Cost
                          </th>
                          <th className="text-900 sort" data-sort="SalePrice">
                            Sale Price
                          </th>
                          <th className="text-900 sort" data-sort="Measurement">
                            Measurement
                          </th>
                          <th className="text-900 sort" data-sort="BrandName">
                            Brand Name
                          </th>
                          <th className="text-900 sort" data-sort="TotalPrice">
                            Total Price
                          </th>
                          <th className="text-900 sort" data-sort="Description">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="list">
                        {filteredItems.slice(0, rowsToShow).map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div style={{ display: "flex" }}>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  style={{ marginRight: "10px" }}
                                  onClick={() => handleShow(item)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                            <td className="tdchild">{item.itemName}</td>
                            <td className="tdchild">{item.itemQty}</td>
                            <td className="tdchild">{item.itemCost}</td>
                            <td className="tdchild">{item.sellPrice}</td>
                            <td className="tdchild">{item.measurement}</td>
                            <td className="tdchild">{item.brandCode}</td>
                            <td className="tdchild">{item.total}</td>
                            <td className="tdchild">{item.description}</td>
                            {/* Add more table data cells as needed */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="row align-items-center mt-3">
                    <div className="pagination d-none"></div>
                    <div className="col">
                      <div
                        className="d-flex align-items-center fs--1"
                        style={{ fontSize: "14px" }}
                      >
                        <p className="mb-0">
                          <span className="d-none d-sm-inline-block me-2">
                            {paginationText}
                          </span>
                        </p>
                        <p className="mb-0 mx-2">Rows per page:</p>
                        <select
                          className="w-auto form-select form-select-sm"
                          defaultValue={rowsToShow}
                          onChange={handleSelectChange}
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="15">15</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-auto d-flex">
                      <button
                        className="btn btn-sm btn-warning"
                        type="button"
                        data-list-pagination="prev"
                        onClick={handlePrevClick}
                        disabled={currentPage === 1}
                      >
                        <span>Previous</span>
                      </button>
                      <button
                        className="btn btn-sm btn-primary px-4 ms-2"
                        type="button"
                        style={{ backgroundColor: "#2c7be5", color: "white" }}
                        data-list-pagination="next"
                        onClick={handleNextClick}
                        disabled={currentPage === totalPages}
                      >
                        <span>Next</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* -----------------------------------Modal--------------------------------------------- */}
        {/* Modal */}
        <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>Edit Product</Modal.Title>
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
                        onChange={(e) => setItemName(e.target.value)}
                        placeholder="Enter Item Name"
                      />
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
                              state.selectProps.menuIsOpen &&
                              BrandCode.length > 5
                                ? "none"
                                : "150px", // Set a maximum height when the menu is open and items are greater than 5
                          }),
                        }}
                        value={
                          Array.isArray(BrandCode)
                            ? BrandCode.find(
                                (option) => option.value === SelectedBrandCode
                              )
                            : null
                        }
                        isSearchable={true}
                        placeholder="Select Brand Code"
                        onChange={handleBrandCodeSelect}
                      />
                      <AddBrandCode />
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
                        value={
                          Array.isArray(Measurement)
                            ? Measurement.find(
                                (option) => option.value === SelectedMeasurement
                              )
                            : null
                        }
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
                        onChange={(e) => setItemCost(e.target.value)}
                      />
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
                        onChange={(e) => setSellPrice(e.target.value)}
                      />
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
                        onChange={(e) => setItemQty(e.target.value)}
                      />
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
            <Button
              variant="primary"
              onClick={() => handleSaveChanges(editedItem)}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        <SweetAlert
          warning
          show={showAlert}
          title="Confirm Deletion"
          showCancel
          confirmBtnText="Yes, delete it!"
          confirmBtnBsStyle="danger"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          focusCancelBtn
        >
          Are you sure you want to delete this item?
        </SweetAlert>

        <SweetAlert show={showOK} success title="Deleted!" onConfirm={handleOK}>
          Your item has been deleted.
        </SweetAlert>
      </Main>
    </>
  );
}

export default Product;
