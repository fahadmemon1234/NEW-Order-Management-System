import React, { useState, useEffect } from "react";

// Main Page Connect
// ---------------------------------------------------
import Main from "../../NavBar/Navbar";
// ---------------------------------------------------

// Add Modal
// ---------------------------------------------------
import AddDeposit from "./AddDeposit";
// --------------------------------------------------

// Bootstrap Modal
// ---------------------------------------------------
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import SweetAlert from "react-bootstrap-sweetalert";
import Select from "react-select";
// ---------------------------------------------------

//DataBase
// ---------------------------------------------------
import { ref, onValue, update, remove, get } from "firebase/database";
import { db } from "../../Config/firebase";
// ---------------------------------------------------

//Notify
// ---------------------------------------------------
import { toast, ToastContainer } from "react-toastify";
import "../../../assets/Css/Tostify.css";
// ---------------------------------------------------

function Deposit() {
  const [tableData, setTableData] = useState([]);

  const loggedInUID = localStorage.getItem("uid");

  useEffect(() => {
    if (loggedInUID) {
      // Reference to the 'Product' node in Firebase Realtime Database
      const DepositRef = ref(db, "Deposit");

      // Attach an event listener for data changes
      const fetchData = async () => {
        onValue(DepositRef, (snapshot) => {
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

  //   ---------------------------------Edit Modal and Populate----------------------------------

  const [TransactionDate, setTransactionDate] = useState("");
  const [TransactionDateError, setTransactionDateError] = useState("");
  const [Amount, setAmount] = useState("");
  const [AmountError, setAmountError] = useState("");
  const [Note, setNote] = useState("");
  const [NoteError, setNoteError] = useState("");
  const [selectedPaymentType, setSelectedPaymentType] = useState("0");

  const [CheckOnline, setCheckOnline] = useState("");
  const [CheckOnlineError, setCheckOnlineError] = useState("");
  const [SelectedBank, setSelectedBank] = useState("");

  const [SelectedBankError, setSelectedBankError] = useState("");

  const [show, setShow] = useState(false);

  const [bankOptions, setBankOptions] = useState([]);
  const [CashOnHand, setCashOnHand] = useState([]);

  const [editedItem, setEditedItem] = useState(null);
  const [oldAmount, setoldAmount] = useState("");

  const handleClose = () => setShow(false);

  const handleShow = async (item) => {
    debugger;
    setEditedItem(item.id);
    setAmount(item.amount);
    setoldAmount(item.amount);
    setCheckOnline(item.checkOnline);
    setNote(item.note);
    setSelectedPaymentType(item.paymentType);
    setSelectedBank(item.selectedBank);

    setTransactionDate(item.transactionDate);

    try {
      const dataRef = ref(db, "CashOnHand");
      const snapshot = await get(dataRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        let totalAmount = 0;

        // Loop through the keys in the data object and add amounts where uid matches
        for (const key in data) {
          if (
            Object.prototype.hasOwnProperty.call(data, key) &&
            data[key].uid === loggedInUID
          ) {
            totalAmount += parseFloat(data[key].Amount);
          }
        }

        // Set the total amount to the 'CashOnHand' state
        setCashOnHand(totalAmount);
        // setUniqueNum(UniqueNum);
      } else {
        console.error("Data doesn't exist in the 'CashOnHand' node.");
      }
    } catch (error) {
      console.error("Error fetching data from the 'CashOnHand' node:", error);
    }

    // BankAmount

    const dataRefs = ref(db, "Bank");
    const snapshots = await get(dataRefs);
    if (snapshots.exists()) {
      const data = snapshots.val();
      // Convert the data object into an array of options
      const options = Object.keys(data).map((key) => ({
        Id: key,
        value: data[key].bankName,
        label: data[key].bankName, // Assuming your data structure has keys and bankName values
        Balance: data[key].openingBalance
        
      }));

      const selectedBankData = options.find(
        option => option.value === item.selectedBank
      );
      console.log(selectedBankData)
      setBankAmount(selectedBankData.Balance);
      setBankID(selectedBankData.Id);

      // Add the "Select Bank" option to the beginning of the array
      setBankOptions([
        {
          value: "0",
          label: "Select Bank",
          disabled: true,
          selected: true,
        },
        ...options,
      ]);
    } else {
      console.error("Data doesn't exist in the 'Bank' node.");
    }

    setShow(true); // Store the editing item's ID in state
  };

  const [BankID, setBankID] = useState("");

  const handleSaveChanges = async () => {
    if ((TransactionDate && Amount && Note) || (CheckOnline && SelectedBank)) {
      // Implement your save logic here
      // console.log('Changes saved!');

      try {
        debugger;
        const loggedInUID = localStorage.getItem("uid");
        const DepositRef = ref(db, `Deposit/${editedItem}`);
        const newDeposit = {
          uid: loggedInUID,
          transactionDate: TransactionDate,
          paymentType: selectedPaymentType,
          amount: Amount,
          note: Note,
          checkOnline: CheckOnline,
          selectedBank: SelectedBank,
        };
        update(DepositRef, newDeposit);

        // ----------------Edit Cash On Hand----------------

        if (selectedPaymentType === "Cash") {
          debugger;

          const CashID = "-NoSkv0ysgg_X2lPpq-X";

          var TotaCashGet = CashOnHand;
          // console.log(TotaCashGet);

          if (oldAmount < Amount) {
            var TotalAmount = parseInt(Amount) - parseInt(oldAmount);
            var TotalCash = parseInt(TotaCashGet) + parseInt(TotalAmount);

            const updatedTotalAmount = {
              Amount: TotalCash,
            };

            // Update the product data in Firebase
            const TotalAmountRef = ref(db, `CashOnHand/${CashID}`);
            await update(TotalAmountRef, updatedTotalAmount);
          } else {
            var TotalAmounts = parseInt(oldAmount) - parseInt(Amount);
            var TotalCashs = parseInt(TotaCashGet) - parseInt(TotalAmounts);

            const updatedTotalAmounts = {
              Amount: TotalCashs,
            };

            // Update the product data in Firebase
            const TotalAmountRefs = ref(db, `CashOnHand/${CashID}`);
            await update(TotalAmountRefs, updatedTotalAmounts);
          }
        } else {
          var BanksID = BankID;

          const openingBalanceNumeric = parseFloat(bankAmount);

          var BanksAmount = openingBalanceNumeric;

          if (oldAmount < Amount) {
            var BankTotalAmount = parseInt(Amount) - parseInt(oldAmount);

            var BankTotal = parseInt(BanksAmount) + parseInt(BankTotalAmount);

            const updatedBankAmount = {
              openingBalance: BankTotal,
            };

            const BankTotalAmountRef = ref(db, `Bank/${BanksID}`);
            await update(BankTotalAmountRef, updatedBankAmount);
          } else {
            var BankTotalAmounts = parseInt(oldAmount) - parseInt(Amount);

            var BankTotals = parseInt(BanksAmount) - parseInt(BankTotalAmounts);

            const updatedBankAmount = {
              openingBalance: BankTotals,
            };

            const BankTotalAmountRef = ref(db, `Bank/${BanksID}`);
            await update(BankTotalAmountRef, updatedBankAmount);
          }
        }

        // Show a success toast if the product is successfully added
        toast.success("Deposit Added Successfully", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setTimeout(() => {
          setTransactionDate("");
          setAmount("");
          setNote("");
          setSelectedBank("");
          setCheckOnline("");
          setSelectedPaymentType("0");
          handleClose();
        }, 2000);

        debugger;
        const dataRef = ref(db, "CashOnHand");
        const snapshot = await get(dataRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          let totalAmount = 0;

          for (const key in data) {
            if (
              Object.prototype.hasOwnProperty.call(data, key) &&
              data[key].uid === loggedInUID
            ) {
              totalAmount += parseFloat(data[key].Amount);
            }
          }

          setCashOnHand(totalAmount);
        } else {
          console.log("Data doesn't exist in the 'CashOnHand' node.");
        }

        // -----------------------------------------------------------------------

        // setBankAmount

        const dataRefs = ref(db, "Bank");
        const snapshots = await get(dataRefs);
        if (snapshots.exists()) {
          const data = snapshots.val();
          // Convert the data object into an array of options
          const options = Object.keys(data).map((key) => ({
            Id: key,
            value: data[key].bankName,
            label: data[key].bankName, // Assuming your data structure has keys and bankName values
            Balance: data[key].openingBalance,
          }));
          // Add the "Select Bank" option to the beginning of the array
          setBankOptions([
            {
              value: "0",
              label: "Select Bank",
              disabled: true,
              selected: true,
            },
            ...options,
          ]);
        } else {
          console.error("Data doesn't exist in the 'Bank' node.");
        }

        // ---------------------------------------------------------------------

        // handleClose(); // Close the modal after successful insert
      } catch (error) {
        toast.error("Error adding Deposit: " + error.message, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        console.log("Error adding Deposit:", error);
      }
    } else {
      handleInputBlur("transactionDate", TransactionDate);
      handleInputBlur("amount", Amount);
      handleInputBlur("note", Note);
      handleInputBlur("checkOnline", CheckOnline);
      handleInputBlur("selectedBank", SelectedBank);
    }
  };

  const handleInputBlur = (field, value) => {
    switch (field) {
      case "transactionDate":
        if (typeof value === "string" && value.trim() === "") {
          setTransactionDateError("Transaction Date is required");
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
          setTransactionDateError("");
        }
        break;
      case "amount":
        if (typeof value === "string" && value.trim() === "") {
          setAmountError("Amount is required");
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
          setAmountError("");
        }
        break;
      case "note":
        if (typeof value === "string" && value.trim() === "") {
          setNoteError("Note is required");
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
          setNoteError("");
        }
        break;
      case "checkOnline":
        if (typeof value === "string" && value.trim() === "") {
          setCheckOnlineError("Check & Online is required");
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
          setCheckOnlineError("");
        }
        break;
      case "selectedBank":
        if (typeof value === "string" && value.trim() === "") {
          setSelectedBankError("Bank is required");
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
          setSelectedBankError("");
        }
        break;
      default:
        break;
    }
  };

  //  Show DropDown Bank DB
  const [bankAmount, setBankAmount] = useState("Rs: 0"); // Initialize bankAmount state
  // const loggedInUID = localStorage.getItem("uid");

  const [bank, setbank] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataRef = ref(db, "Bank");
        const snapshot = await get(dataRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          debugger;
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
  }, [loggedInUID]);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid #ccc",
      borderRadius: "4px",
      minHeight: "38px",
    }),
  };

  const handleBankSelect = (selectedOption) => {
    setSelectedBank(selectedOption?.value);
    const selectedBankData = bankOptions.find(
      (option) => option.value === selectedOption?.value
    );
    if (selectedBankData.Balance !== undefined) {
      var balanceString = selectedBankData.Balance;

      // Extract the numeric part using parseInt
      var balanceNumeric = parseFloat(balanceString);

      setBankAmount(balanceNumeric);
      setBankID(`${selectedBankData.Id}`);
    } else if (selectedBankData.Balance === undefined) {
      setBankAmount("Rs: 0");
    }
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
      const dataRef = ref(db, `Deposit/${id}`);
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
                <h1>Deposit</h1>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6">
                <div style={{ float: "right" }}>
                  <AddDeposit />

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
                          <th className="text-900 sort" data-sort="BankName">
                            Transaction Date
                          </th>
                          <th className="text-900 sort" data-sort="BankTitle">
                            Transaction Type
                          </th>
                          <th
                            className="text-900 sort"
                            data-sort="OpeningBalance"
                          >
                            Bank Name
                          </th>
                          <th
                            className="text-900 sort"
                            data-sort="OpeningBalanceDate"
                          >
                            Check No
                          </th>
                          <th
                            className="text-900 sort"
                            data-sort="BankAccountNumber"
                          >
                            Amount
                          </th>
                          <th className="text-900 sort" data-sort="BankAddress">
                            Description
                          </th>
                          <th className="text-900 sort" data-sort=" BranchName">
                            Branch Name
                          </th>
                        </tr>
                      </thead>
                      <tbody className="list">
                        {visibleItems.slice(0, rowsToShow).map((item) => (
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

                            <td className="tdchild">{item.transactionDate}</td>
                            <td className="tdchild">{item.paymentType}</td>
                            <td className="tdchild">{item.selectedBank}</td>
                            <td className="tdchild">{item.checkOnline}</td>
                            <td className="tdchild">{item.amount}</td>
                            <td className="tdchild">{item.note}</td>
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
        <Modal
          show={show}
          onHide={handleClose}
          dialogClassName="custom-modal"
          style={{ paddingTop: "3%" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Deposite</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container">
              <form>
                <div className="row">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="mb-3">
                      <label
                        htmlFor="TransactionDate"
                        className="form-label"
                        style={{ color: "black" }}
                      >
                        Transaction Date <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="TransactionDate"
                        id="TransactionDate"
                        placeholder="Enter Transaction Date"
                        value={TransactionDate}
                        onBlur={() =>
                          handleInputBlur("transactionDate", TransactionDate)
                        }
                        onFocus={() => setTransactionDateError("")}
                        onChange={(e) => setTransactionDate(e.target.value)}
                      />
                      {TransactionDateError && (
                        <div style={{ color: "red" }}>
                          {TransactionDateError}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="mb-3">
                      <label
                        htmlFor="BankTitle"
                        className="form-label"
                        style={{ color: "black" }}
                      >
                        Bank Title
                      </label>
                      <select
                        className="form-select brand"
                        id="Brand"
                        onChange={(e) => setSelectedPaymentType(e.target.value)}
                        value={selectedPaymentType}
                      >
                        <option value="0" disabled>
                          Select Payment Type
                        </option>
                        <option value="Cash">Cash</option>
                        <option value="Bank">Bank</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    {selectedPaymentType === "Bank" && (
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
                          value={Amount}
                          onBlur={() => handleInputBlur("amount", Amount)}
                          onFocus={() => setAmountError("")}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                        {AmountError && (
                          <div style={{ color: "red" }}>{AmountError}</div>
                        )}
                      </div>
                    )}

                    {selectedPaymentType !== "Bank" && (
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
                          value={Amount}
                          onBlur={() => handleInputBlur("amount", Amount)}
                          onFocus={() => setAmountError("")}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                        {AmountError && (
                          <div style={{ color: "red" }}>{AmountError}</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="mb-3">
                      <label
                        htmlFor="BankAddress"
                        className="form-label"
                        style={{ color: "black" }}
                      >
                        Note <span style={{ color: "red" }}>*</span>
                      </label>
                      <textarea
                        type="text"
                        className="form-control"
                        value={Note}
                        onChange={(e) => setNote(e.target.value)}
                        onBlur={() => handleInputBlur("note", Note)}
                        onFocus={() => setNoteError("")}
                        placeholder="Enter Note"
                      ></textarea>
                      {NoteError && (
                        <div style={{ color: "red" }}>{NoteError}</div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedPaymentType === "Bank" && (
                  <>
                    <div className="row">
                      <div className="col-md-6 col-sm-6 col-lg-6">
                        <div className="mb-3">
                          <label
                            htmlFor="CheckOnline"
                            className="form-label"
                            style={{ color: "black" }}
                          >
                            Check & Online:{" "}
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="Check&Online"
                            id="Check&Online"
                            placeholder="Enter Check & Online"
                            value={CheckOnline}
                            onBlur={() =>
                              handleInputBlur("checkOnline", CheckOnline)
                            }
                            onFocus={() => setCheckOnlineError("")}
                            onChange={(e) => setCheckOnline(e.target.value)}
                          />
                          {CheckOnlineError && (
                            <div style={{ color: "red" }}>
                              {CheckOnlineError}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6 col-sm-6 col-lg-6">
                        <div className="mb-3">
                          <label
                            htmlFor="BankTitle"
                            className="form-label"
                            style={{ color: "black" }}
                          >
                            Bank <span style={{ color: "red" }}>*</span>
                          </label>

                          <Select
                            id="BankName"
                            options={bank}
                            value={bank.find(
                              (option) => option.value === SelectedBank
                            )}
                            styles={{
                              ...customStyles,
                              menu: (provided) => ({
                                ...provided,
                                overflowY: "auto", // Add scrollbar when needed
                                maxHeight: "150px", // Set the maximum height here
                              }),
                            }}
                            isSearchable={true}
                            placeholder="Select Bank"
                            onChange={handleBankSelect}
                            onBlur={() =>
                              handleInputBlur("selectedBank", SelectedBank)
                            }
                            onFocus={() => setSelectedBankError("")}
                          />

                          {SelectedBankError && (
                            <div style={{ color: "red" }}>
                              {SelectedBankError}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row" style={{ float: "right" }}>
                      <div className="col-md-12 col-sm-12 col-lg-12">
                        <label
                          htmlFor="Amount"
                          className="form-label"
                          style={{ color: "black", fontSize: "20px" }}
                        >
                          <div>{`Rs: ` + bankAmount.toLocaleString()}</div>
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {selectedPaymentType === "Cash" && (
                  <div className="row" style={{ float: "right" }}>
                    <div className="col-md-12 col-sm-12 col-lg-12">
                      <label
                        htmlFor="Amount"
                        className="form-label"
                        style={{ color: "black", fontSize: "20px" }}
                      >
                        <div>
                          {typeof CashOnHand === "number" && !isNaN(CashOnHand)
                            ? "Rs: " + CashOnHand.toLocaleString()
                            : "Rs: 0"}
                        </div>
                        {/* <div>
                          RS:{" "}
                          {CashOnHand && CashOnHand > 0
                            ? CashOnHand.toLocaleString()
                            : "0"}
                        </div> */}

                        {/* {Array.isArray(CashOnHand) ? (
                        CashOnHand.map((item, index) => (
                          <div key={index}>
                            {item.value !== null
                              ? `Rs: ${item.value.toLocaleString()}`
                              : 'Rs: 0'}
                          </div>
                        ))
                      ) : (
                        <p>{CashOnHand}</p>
                      )} */}
                      </label>
                    </div>
                  </div>
                )}
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

export default Deposit;
