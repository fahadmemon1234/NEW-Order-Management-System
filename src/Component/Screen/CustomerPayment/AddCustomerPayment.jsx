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

function AddCustomerPayment() {
  const [show, setShow] = useState(false);
  const loggedInUID = localStorage.getItem("uid");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const [paymentMode, setPaymentMode] = useState(null);

  const options = [
    { value: "Cash", label: "Cash" },
    { value: "Bank", label: "Bank" },
    { value: "Cheque", label: "Cheque" },
  ];

  const handleChange = (selectedOption) => {
    setPaymentMode(selectedOption);
    console.log(`Option selected:`, selectedOption);
  };

  //   const checkExistingItem = async () => {
  //     const productsRef = ref(db, "Bank");
  //     const snapshot = await get(productsRef);
  //     const existingProducts = snapshot.val();
  //     for (const key in existingProducts) {
  //       if (existingProducts[key].bankName === BankName) {
  //         return true; // Item with the same name already exists
  //       }
  //     }
  //     return false; // Item with the same name does not exist
  //   };

  //   const handleSaveChanges = async () => {
  //     try {
  //       if (BankName && OpeningBalance && OpeningBalanceDate) {
  //         const itemExists = await checkExistingItem();
  //         if (itemExists) {
  //           toast.error("Bank already exists.", {
  //             position: "top-right",
  //             autoClose: 1000,
  //             hideProgressBar: false,
  //             closeOnClick: true,
  //             pauseOnHover: false,
  //             draggable: true,
  //             progress: undefined,
  //             theme: "colored",
  //           });
  //         } else {
  //           const loggedInUID = localStorage.getItem("uid");
  //           const openingBalanceNumeric = parseFloat(OpeningBalance);

  //           const BankRef = ref(db, "Bank");
  //           const newAutoId = generateId();
  //           const newBank = {
  //             uid: loggedInUID,
  //             bankId: newAutoId,
  //             bankName: BankName,
  //             bankTitle: BankTitle,
  //             openingBalance: openingBalanceNumeric,
  //             openingBalanceDate: OpeningBalanceDate,
  //             bankAccountNumber: BankAccountNo,
  //             bankAddress: BankAddress,
  //             branchName: BranchName,
  //           };
  //           push(BankRef, newBank);

  //           // Show a success toast if the product is successfully added
  //           toast.success("Bank Added Successfully", {
  //             position: "top-right",
  //             autoClose: 1000,
  //             hideProgressBar: false,
  //             closeOnClick: true,
  //             pauseOnHover: false,
  //             draggable: true,
  //             progress: undefined,
  //             theme: "colored",
  //           });

  //           setTimeout(() => {
  //             handleClose();

  //             setBankName("");
  //             setBankTitle("");
  //             setOpeningBalance("");
  //             setOpeningBalanceDate("");
  //             setBankAddress("");
  //             setBankAccountNo("");
  //             setBranchName("");
  //           }, 2000);
  //         }
  //         // handleClose(); // Close the modal after successful insert
  //       } else if (!BankName) {
  //         toast.error("Bank Name is required", {
  //           position: "top-right",
  //           autoClose: 2000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: false,
  //           draggable: true,
  //           progress: undefined,
  //           theme: "colored",
  //         });
  //       } else if (!OpeningBalance) {
  //         toast.error("Opening Balance is required", {
  //           position: "top-right",
  //           autoClose: 2000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: false,
  //           draggable: true,
  //           progress: undefined,
  //           theme: "colored",
  //         });
  //       } else if (!OpeningBalanceDate) {
  //         toast.error("Opening Balance Date is required", {
  //           position: "top-right",
  //           autoClose: 2000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: false,
  //           draggable: true,
  //           progress: undefined,
  //           theme: "colored",
  //         });
  //       } else {
  //         toast.error("Unexpected error occurred", {
  //           position: "top-right",
  //           autoClose: 2000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: false,
  //           draggable: true,
  //           progress: undefined,
  //           theme: "colored",
  //         });
  //       }
  //     } catch (error) {
  //       toast.error("Error adding Bank: " + error.message, {
  //         position: "top-right",
  //         autoClose: 1000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: false,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "colored",
  //       });

  //       console.log("Error adding Bank:", error);
  //     }
  //   };

  // Select2 DropDown Invoice No

  const [SelectedInvoiceNo, setSelectedInvoiceNo] = useState("");

  const [InvoiceNoOptions, setInvoiceNoOptions] = useState([]);

  const [InvoiceNo, setInvoiceNo] = useState([]);
  const [CustomerID, setCustomerID] = useState("");

  const [CustomerName, setCustomerName] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataRef = ref(db, "SaleInvoice");
        const snapshot = await get(dataRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Convert the data object into an array of options
          const options = Object.keys(data).map((key) => ({
            Id: key,
            value: "InvoiceNo# " + data[key].InvoiceID,
            label: "InvoiceNo# " + data[key].InvoiceID,
            customerID: data[key].customerID,
            uid: data[key].uid,
          }));

          // console.log("All Banks:", options); // Log all banks before filtering

          // Filter options based on loggedInUID
          const userBanks = options.filter(
            (bank) => bank.uid === loggedInUID && bank.customerID === CustomerID
          );
          // setInvoiceNo(userBanks);

          setInvoiceNo(userBanks);

          // setInvoiceNo(userBanks);

          // console.log(userBanks[0].customerID);
          // console.log("User Banks:", userBanks); // Log filtered banks

          if (userBanks.length > 0) {
            // Add the "Select Bank" option to the beginning of the array
            setInvoiceNoOptions([
              {
                value: "0",
                label: "Select One",
                disabled: true,
                selected: true,
              },
              ...userBanks,
            ]);
          } else {
            console.log("No matching Invoice No for loggedInUID:", loggedInUID);
            // Handle the case where no matching banks are found
          }
        } else {
          console.log("Data doesn't exist in the 'Customer Name' node.");
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 2000); // Fetch data every 60 seconds

    return () => clearInterval(intervalId);
  }, [db, loggedInUID, CustomerID]);

  const handleInvoiceNo = (selectedOption) => {
    setSelectedInvoiceNo(selectedOption?.value);
  };

  // Select2 DropDown Customer

  const [SelectedCustomer, setSelectedCustomer] = useState("");

  const [CustomerOptions, setCustomerOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataRef = ref(db, "Customer");
        const snapshot = await get(dataRef);
        if (snapshot.exists()) {
          const data = snapshot.val();

          // Convert the data object into an array of options
          const options = Object.keys(data).map((key) => ({
            Id: key,
            value: data[key].customerName,
            label: data[key].customerName,
            uid: data[key].uid,
          }));

          // Filter options based on loggedInUID
          const userBanks = options.filter((bank) => bank.uid === loggedInUID);
          setCustomerName(userBanks);
          // console.log(userBanks);

          // console.log("User Banks:", userBanks); // Log filtered banks

          if (userBanks.length > 0) {
            // Add the "Select Bank" option to the beginning of the array
            setCustomerOptions([
              {
                value: "0",
                label: "Select Customer Name",
                disabled: true,
                selected: true,
              },
              ...userBanks,
            ]);
          } else {
            console.error(
              "No matching Customer Name for loggedInUID:",
              loggedInUID
            );
            // Handle the case where no matching banks are found
          }
        } else {
          console.error("Data doesn't exist in the 'Customer Name' node.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 2000); // Fetch data every 60 seconds

    return () => clearInterval(intervalId);
  }, [db, loggedInUID]);

  const handleCustomer = (selectedOption) => {
    setSelectedCustomer(selectedOption?.value);
    setCustomerID(selectedOption.Id);
  };

  //  Show DropDown Bank DB
  const [bankAmount, setBankAmount] = useState("Rs: 0"); // Initialize bankAmount state

  const [BankID, setBankID] = useState("");
  const [bankOptions, setBankOptions] = useState([]);
  const [bank, setbank] = useState([]);
  const [SelectedBank, setSelectedBank] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataRef = ref(db, "Bank");
        const snapshot = await get(dataRef);
        if (snapshot.exists()) {
          const data = snapshot.val();

          // Convert the data object into an array of options
          const options = Object.keys(data).map((key) => ({
            Id: key,
            value: data[key].bankName,
            label: data[key].bankName,
            Balance: data[key].openingBalance,
            uid: data[key].uid,
          }));

          // console.log("All Banks:", options); // Log all banks before filtering

          // Filter options based on loggedInUID
          const userBanks = options.filter((bank) => bank.uid === loggedInUID);
          setbank(userBanks);

          // console.log("User Banks:", userBanks); // Log filtered banks

          if (userBanks.length > 0) {
            // Add the "Select Bank" option to the beginning of the array
            setBankOptions([
              {
                value: "0",
                label: "Select Bank",
                disabled: true,
                selected: true,
              },
              ...userBanks,
            ]);
          } else {
            console.error("No matching banks for loggedInUID:", loggedInUID);
            // Handle the case where no matching banks are found
          }
        } else {
          console.error("Data doesn't exist in the 'Bank' node.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 2000); // Fetch data every 60 seconds

    return () => clearInterval(intervalId);
  }, [db, loggedInUID]);

  const handleBankSelect = (selectedOption) => {
    setSelectedBank(selectedOption?.value);
    const selectedBankData = bankOptions.find(
      (option) => option.value === selectedOption?.value
    );
    if (selectedBankData.Balance != undefined) {
      var balanceString = selectedBankData.Balance;

      // Extract the numeric part using parseInt
      var balanceNumeric = parseFloat(balanceString);

      setBankAmount(balanceNumeric);
      setBankID(`${selectedBankData.Id}`);
    } else if (selectedBankData.Balance == undefined) {
      setBankAmount("Rs: 0");
    }
  };

  const invoiceOptions = SelectedCustomer
    ? InvoiceNo
    : [{ value: 0, label: "Select One", disabled: true, selected: true }];

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
        Add Customer Payment
      </button>

      {/* -----------------------------------Modal--------------------------------------------- */}
      {/* Modal */}
      <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Add Customer Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <form>
              <div className="row">
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="PaymentDate"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      Payment Date <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="PaymentDate"
                      id="PaymentDate"
                      placeholder="Enter Payment Date"
                    />
                  </div>
                </div>

                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="CustomerName"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      Customer Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                      id="CustomerName"
                      isSearchable={true}
                      options={CustomerName}
                      onChange={handleCustomer}
                      placeholder="Select Customer"
                      styles={{
                        menu: (provided, state) => ({
                          ...provided,
                          overflowY: "auto", // Add scrollbar when needed
                          maxHeight:
                            state.selectProps.menuIsOpen &&
                            CustomerName.length > 5
                              ? "none"
                              : "150px", // Set a maximum height when the menu is open and items are greater than 5
                        }),
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="PaymentMode"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      Payment Mode <span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                      value={paymentMode}
                      onChange={handleChange}
                      options={options}
                      isSearchable={true}
                      placeholder="Select Payment Type"
                    />
                  </div>
                </div>

                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="InvoiceNo"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      Invoice No # <span style={{ color: "red" }}>*</span>
                    </label>

                    <Select
                      id="InvoiceNo"
                      isSearchable={true}
                      options={invoiceOptions}
                      onChange={handleInvoiceNo}
                      placeholder="Select One"
                      styles={{
                        menu: (provided, state) => ({
                          ...provided,
                          overflowY: "auto", // Add scrollbar when needed
                          maxHeight:
                            state.selectProps.menuIsOpen &&
                            invoiceOptions.length > 5
                              ? "none"
                              : "150px", // Set a maximum height when the menu is open and items are greater than 5
                        }),
                      }}
                    />
                  </div>
                </div>
              </div>

              {paymentMode && paymentMode.value === "Bank" && (
                <>
                  <div className="row">
                    <div className="col-md-6 col-sm-6 col-lg-6">
                      <div className="mb-3">
                        <label
                          htmlFor="Bank"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Bank <span style={{ color: "red" }}>*</span>
                        </label>
                        <Select
                          id="BankName"
                          options={bank}
                          styles={{
                            menu: (provided, state) => ({
                              ...provided,
                              overflowY: "auto", // Add scrollbar when needed
                              maxHeight:
                                state.selectProps.menuIsOpen && bank.length > 5
                                  ? "none"
                                  : "150px", // Set a maximum height when the menu is open and items are greater than 5
                            }),
                          }}
                          isSearchable={true}
                          placeholder="Select Bank"
                          onChange={handleBankSelect}
                        />
                        <h6 style={{ float: "right", paddingTop: "5px" }}>
                          {`Rs: ` + bankAmount.toLocaleString()}
                        </h6>
                      </div>
                    </div>

                    <div className="col-md-6 col-sm-6 col-lg-6">
                      <div className="mb-3">
                        <label
                          htmlFor="CheckOnline"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Check #: / Online #:{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="CheckOnline"
                          id="CheckOnline"
                          placeholder="Enter Check or Online"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 col-sm-6 col-lg-6">
                      <div className="mb-3">
                        <label
                          htmlFor="Amount"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Amount <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="Amount"
                          id="Amount"
                          placeholder="Enter Amount"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {paymentMode && paymentMode.value === "Cheque" && (
                <>
                  <div className="row">
                    <div className="col-md-6 col-sm-6 col-lg-6">
                      <div className="mb-3">
                        <label
                          htmlFor="Bank"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Bank <span style={{ color: "red" }}>*</span>
                        </label>
                        <Select
                          id="Bank"
                          isSearchable={true}
                          placeholder="Select Bank"
                        />
                      </div>
                    </div>

                    <div className="col-md-6 col-sm-6 col-lg-6">
                      <div className="mb-3">
                        <label
                          htmlFor="CheckOnline"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Check #: / Online #:{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="CheckOnline"
                          id="CheckOnline"
                          placeholder="Enter Check or Online"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 col-sm-6 col-lg-6">
                      <div className="mb-3">
                        <label
                          htmlFor="ChequeDate"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Cheque Date <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="ChequeDate"
                          id="ChequeDate"
                          placeholder="Enter Cheque Date"
                        />
                      </div>
                    </div>

                    <div className="col-md-6 col-sm-6 col-lg-6">
                      <div className="mb-3">
                        <label
                          htmlFor="Amount"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Amount <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="Amount"
                          id="Amount"
                          placeholder="Enter Amount"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {paymentMode && paymentMode.value === "Cash" && (
                <div className="row">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="mb-3">
                      <label
                        htmlFor="Amount"
                        className="form-label"
                        style={{ color: "black" }}
                      >
                        Amount <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="Amount"
                        id="Amount"
                        placeholder="Enter Amount"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="row">
                <div className="col-md-12 col-sm-12 col-lg-12">
                  <div className="mb-3">
                    <label
                      htmlFor="Note"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      Note <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      type="text"
                      className="form-control"
                      placeholder="Enter Note"
                    ></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddCustomerPayment;
