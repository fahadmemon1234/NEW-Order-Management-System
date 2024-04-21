import React, { useEffect, useState } from "react";

// Main Page Connect
// ---------------------------------------------------
import Main from "../../NavBar/Navbar";

import { useLocation } from "react-router-dom";
// ---------------------------------------------------

// Bootstrap Modal
// ---------------------------------------------------
import Button from "react-bootstrap/Button";
import SweetAlert from "react-bootstrap-sweetalert";
import Select from "react-select";
import InputMask from "react-input-mask";
import { useNavigate } from "react-router-dom";
// ---------------------------------------------------

//DataBase
// ---------------------------------------------------
import { ref, get, onValue, update, remove, push } from "firebase/database";
import { db } from "../../Config/firebase";
// ---------------------------------------------------

//Notify
// ---------------------------------------------------
import { toast, ToastContainer } from "react-toastify";
import "../../../assets/Css/Tostify.css";
// ---------------------------------------------------

function Return() {
  const loggedInUID = localStorage.getItem("uid");

  // ----------------Handle Return-------------------

  const [data, setData] = useState("");
  const [saleOrderItemData, setSaleOrderItemData] = useState("");
  const [ProductData, setProductData] = useState("");

  useEffect(() => {
    debugger;
    if (loggedInUID) {
      const SaleOrderRef = ref(db, "SaleOrder");
      const SaleOrderItemRef = ref(db, "SaleOrderItem");
      const ProductRef = ref(db, "Product");

      const fetchSaleOrderData = () => {
        onValue(SaleOrderRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            debugger;
            const dataArray = Object.keys(data)
              .filter((key) => data[key].uid === loggedInUID)
              .map((key) => ({
                id: key,
                ...data[key],
              }));
            setData(dataArray);
          }
        });
      };

      const fetchSaleOrderItemData = () => {
        onValue(SaleOrderItemRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            debugger;
            const dataArray = Object.keys(data)
              .filter((key) => data[key].uid === loggedInUID)
              .map((key) => ({
                id: key,
                ...data[key],
              }));
            setSaleOrderItemData(dataArray);
          }
        });
      };

      const fetchProduct = () => {
        onValue(ProductRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            debugger;
            const dataArray = Object.keys(data)
              .filter((key) => data[key].uid === loggedInUID)
              .map((key) => ({
                id: key,
                ...data[key],
              }));
            setProductData(dataArray);
          }
        });
      };

      fetchProduct();
      fetchSaleOrderData();
      fetchSaleOrderItemData();
    } else {
      console.error("No user is currently logged in.");
    }
  }, [loggedInUID]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ID = searchParams.get("ID");
  const ids = ID;

  const [CustomerNames, setCustomerName] = useState("");
  const [SaleOrderDate, setSaleOrderDate] = useState("");
  const [PaymentMethod, setpaymentMethod] = useState("");

  const [saleItemID, setsaleItemID] = useState("");

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (Array.isArray(data)) {
      const saleIds = data.map((item) => item.id);

      if (saleIds.includes(ID)) {
        const indexCustomerName = saleIds.indexOf(ID);
        const matchingItem = data[indexCustomerName];
        debugger;
        setCustomerName(matchingItem.customer);
        setSaleOrderDate(matchingItem.orderDate);
        setpaymentMethod(matchingItem.paymentMethod);
        setsaleItemID(matchingItem.SaleOrderItemID);

        const saleItemIds = saleOrderItemData.map((item) => item.id);

        if (saleItemIds.includes(saleItemID)) {
          const filteredItems = saleOrderItemData.filter(
            (item) => item.id === saleItemID
          );
          setTableData(filteredItems);
        }
      }
    }
  }, [ID, data, saleOrderItemData, saleItemID]);

  const [rowsToShow, setRowsToShow] = useState(5);

  const handleSelectChange = (event) => {
    setRowsToShow(parseInt(event.target.value, 10));
  };

  const startIndexs = 1;
  // const endIndexs = Math.min(startIndexs + rowsToShow - 1, totalItems);
  const rowCount = tableData.length; // Add this line to get the row count
  const paginationText = `${startIndexs} to ${rowsToShow} of ${rowCount}`;

  const [currentPage, setCurrentPage] = useState(1);

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    const totalPages = Math.ceil(tableData.length / rowsToShow);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const startIndex = (currentPage - 1) * rowsToShow;
  const endIndex = Math.min(startIndex + rowsToShow, tableData.length);
  const visibleItems = tableData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(tableData.length / rowsToShow);

  // ---------------------------------------------------------

  const [quantity, setQuantity] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  const handleInputChange = (event) => {
    const newQuantity = event.target.value;
    setQuantity(newQuantity);

    const lblQuantity = parseInt(
      document.getElementById("lblquantity").innerText
    ); // Parse lblquantity to integer
    if (newQuantity > lblQuantity) {
      // console.log("");

      toast.error("Quantity cannot be greater than available quantity.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setQuantity("");
      setTotalPrice(0);
      return;
    } else {
      const salePrice = document.getElementById("lblsaleprice").innerText;
      const newTotalPrice = salePrice * newQuantity;
      setTotalPrice(newTotalPrice);
    }

    const salePrice = document.getElementById("lblsaleprice").innerText;
    const newTotalPrice = salePrice * newQuantity;
    setTotalPrice(newTotalPrice);
  };

  const [ReturnDate, setReturnDate] = useState("");
  const items = location.state.item;
  const invID = items.id;

  const handleReturn = async (items) => {
    debugger;
    if (ReturnDate) {
      const currentDate = new Date();
      const returnDate = new Date(ReturnDate);
      if (returnDate < currentDate) {
        if (quantity) {
          const saleIds = data.map((items) => items.id);
          if (saleIds.includes(ID)) {
            const index = saleIds.indexOf(ID);
            const matchingItem = data[index];
            const saleOrderItemID = matchingItem.SaleOrderItemID;

            const saleOrderItem = saleOrderItemData.map((items) => items.id);

            if (saleOrderItem.includes(saleOrderItemID)) {
              const indexQuantity = saleOrderItem.indexOf(saleOrderItemID);
              const matchingItem = saleOrderItemData[indexQuantity];
              const Quantity = matchingItem.quantity;
              const ProductID = matchingItem.ProductID;

              const ID = ProductData.map((items) => items.id);

              if (ID.includes(ProductID)) {
                const index = ID.indexOf(ProductID);
                const itemQty = ProductData[index].itemQty;

                var qty = parseInt(Quantity);
                var totalQty = itemQty + qty;

                const updatedProduct = {
                  uid: loggedInUID,
                  itemQty: totalQty,
                };

                const productRef = ref(db, `Product/${ProductID}`);
                await update(productRef, updatedProduct);

                const currentDate = new Date();
                const shortMonthNames = [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ];
                const formattedDate = ` ${currentDate.getDate()} ${
                  shortMonthNames[currentDate.getMonth()]
                } ${currentDate.getFullYear()}`;

                const returnRef = ref(db, "SaleReturn");
                const newReturn = {
                  uid: loggedInUID,
                  date: formattedDate,
                  customerName: CustomerNames,
                  invoiceID: ids,
                  returnAmount: totalPrice,
                  returnDate: ReturnDate,
                };
                push(returnRef, newReturn);




                const dataRef = ref(db, `SaleInvoice/${invID}`);
                await remove(dataRef);
              }
            }
          }
        } else {
          toast.error("Quantity is required", {
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
      } else {
        toast.error(
          "Return date is equal to or greater than the current date.",
          {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
      }
    } else {
      toast.error("Quantity && Return Date is required!", {
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
  };

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

        <div className="card" style={{ border: "1px solid #2c7be5" }}>
          <div className="card-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12 col-lg-12 col-sm-12">
                  <h1>Return Sale Order</h1>
                </div>
              </div>

              <div className="row" style={{ paddingTop: "10px" }}>
                <div className="col-lg-4 col-md-4 col-sm-4">
                  <label className="form-label" htmlFor="ID">
                    Sale Order ID
                  </label>
                  <input
                    type="text"
                    id="txtID"
                    className="form-control"
                    value={ID}
                    readOnly
                  ></input>
                </div>

                <div className="col-lg-4 col-md-4 col-sm-4">
                  <label className="form-label" htmlFor="CustomerName">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    id="txtCustomerName"
                    className="form-control"
                    placeholder="Enter Name"
                    value={CustomerNames}
                    readOnly
                  ></input>
                </div>

                <div className="col-lg-4 col-md-4 col-sm-4">
                  <label className="form-label" htmlFor="SaleOrderDate">
                    Sale Order Date
                  </label>
                  <input
                    type="date"
                    id="txtSaleOrderDate"
                    className="form-control"
                    placeholder="Enter Name"
                    value={SaleOrderDate}
                    readOnly
                  ></input>
                </div>
              </div>

              <div
                className="row"
                style={{
                  paddingTop: "10px",
                  alignItems: "center",
                  paddingBottom: "20px",
                }}
              >
                <div className="col-lg-4 col-md-4 col-sm-4">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      id="rdoCash"
                      type="radio"
                      name="paymentMethod"
                      value="rdoCash"
                      checked={
                        PaymentMethod === "rdoCash" ||
                        PaymentMethod === "rdoCashCredit"
                      }
                      onChange={(e) => setpaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="rdoCash">
                      Cash
                    </label>
                  </div>

                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      id="rdoCredit"
                      type="radio"
                      name="paymentMethod"
                      value="rdoCredit"
                      checked={PaymentMethod === "rdoCredit"}
                      onChange={(e) => setpaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="rdoCredit">
                      Credit
                    </label>
                  </div>
                </div>

                <div className="col-lg-4 col-md-4 col-sm-4">
                  <label className="form-label" htmlFor="ReturnDate">
                    Return Date
                  </label>
                  <input
                    type="date"
                    id="txtReturnDate"
                    className="form-control"
                    value={ReturnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  ></input>
                </div>
              </div>

              <hr />

              <div className="row" style={{ paddingTop: "30px" }}>
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div id="tableExample">
                    <div className="table-responsive scrollbar">
                      <table className="table table-bordered table-striped fs-10 mb-0">
                        <thead className="bg-200">
                          <tr>
                            <th className="text-900 sort" data-sort="ItemName">
                              Item Name
                            </th>
                            <th className="text-900 sort" data-sort="Quantity">
                              Quantity
                            </th>
                            <th
                              className="text-900 sort"
                              data-sort="ReturnQuantity"
                              style={{ width: "25%" }}
                            >
                              Return Quantity
                            </th>
                            <th className="text-900 sort" data-sort="Price">
                              Price
                            </th>
                            <th className="text-900 sort" data-sort="Total">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list">
                          {tableData.map((item, index) => (
                            <tr key={index}>
                              <td className="tdchild">{item.itemName}</td>
                              <td className="tdchild" id="lblquantity">
                                {item.quantity}
                              </td>
                              <td className="tdchild">
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Enter Return Quantity"
                                  value={quantity} // Set input value from state
                                  onChange={handleInputChange} // Handle input change
                                />
                              </td>
                              <td className="tdchild" id="lblsaleprice">
                                {item.salePrice}
                              </td>
                              <td className="tdchild">{totalPrice}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="row mt-3">
                      <div className="pagination d-none"></div>
                      <div className="col-md-9 col-sm-9 col-lg-9">
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
                        <div style={{ paddingTop: "10px" }}>
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
                            style={{
                              backgroundColor: "#2c7be5",
                              color: "white",
                            }}
                            data-list-pagination="next"
                            onClick={handleNextClick}
                            disabled={currentPage === totalPages}
                          >
                            <span>Next</span>
                          </button>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-3 col-lg-3">
                        <>
                          <div
                            className="mb-3"
                            style={{ paddingTop: "10px" }}
                            id="txtPayment"
                          >
                            <label
                              htmlFor="Payment"
                              className="form-label"
                              style={{ color: "black" }}
                            >
                              Purchase Return Amount
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              name="PurchaseReturnAmount"
                              readOnly
                              id="txtPurchaseReturnAmount"
                              value={totalPrice}
                              placeholder="Enter Purchase Return Amount"
                            />
                          </div>

                          <Button
                            variant="primary"
                            style={{ float: "right", marginTop: 10 + "px" }}
                            id="btnSaveClose"
                            onClick={handleReturn}
                          >
                            Return
                          </Button>
                        </>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Main>
    </>
  );
}

export default Return;
