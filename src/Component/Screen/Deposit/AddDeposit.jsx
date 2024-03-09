import React, { useState, useEffect } from "react";

// Bootstrap Modal
// ---------------------------------------------------
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
// ---------------------------------------------------

//DataBase
// ---------------------------------------------------
import { ref, push, get, update } from "firebase/database";
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

function AddDeposit() {
  const [show, setShow] = useState(false);

  const [bankOptions, setBankOptions] = useState([]);
  const [CashOnHand, setCashOnHand] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = async () => {
    setCheckOnline("");
    setNoteError("");
    setTransactionDateError("");
    setAmountError("");
    setCheckOnlineError("");
    setSelectedBankError("");
    setBankAmount("0");
    setCashOnHand("");
    setNote("");
    setAmount("");
    setSelectedPaymentType(0);
    setSelectedBank(0);
    setTransactionDate("");

    // CashonHand

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

    setShow(true); // Store the editing item's ID in state
  };

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

  const [BankID, setBankID] = useState("");

  const handleSaveChanges = async () => {
    if ((TransactionDate && Amount && Note) || (CheckOnline && SelectedBank)) {
      // Implement your save logic here
      // console.log('Changes saved!');

      try {
        debugger;
        const loggedInUID = localStorage.getItem("uid");
        const DepositRef = ref(db, "Deposit");
        const newDeposit = {
          uid: loggedInUID,
          transactionDate: TransactionDate,
          paymentType: selectedPaymentType,
          amount: Amount,
          note: Note,
          checkOnline: CheckOnline,
          selectedBank: SelectedBank,
        };
        push(DepositRef, newDeposit);

        // ----------------Edit Cash On Hand----------------
        if (selectedPaymentType === "Cash") {
          // var ID = "-NfqYJMNFeYTGjIJ6Crc";

          const CashID = "-NoSkv0ysgg_X2lPpq-X";

          var TotaCashGet = CashOnHand;

          var Total = parseInt(TotaCashGet) + parseInt(Amount);

          // console.log(Total);

          const updatedTotalAmount = {
            uid: loggedInUID,
            Amount: Total,
          };
          // Update the product data in Firebase
          const TotalAmountRef = ref(db, `CashOnHand/${CashID}`);
          await update(TotalAmountRef, updatedTotalAmount);
        } else {
          // ----------------Edit Bank Cash----------------

          var BanksID = BankID;

          const openingBalanceNumeric = parseFloat(bankAmount);

          var BanksAmount = openingBalanceNumeric;

          var BankTotal = parseInt(BanksAmount) + parseInt(Amount);

          const updatedBankAmount = {
            openingBalance: BankTotal,
          };

          const BankTotalAmountRef = ref(db, `Bank/${BanksID}`);
          await update(BankTotalAmountRef, updatedBankAmount);
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
          theme: "colored",
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
          theme: "colored",
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
          // toast.error('Transaction Date is required', {
          //   position: 'top-right',
          //   autoClose: 2000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: false,
          //   draggable: true,
          //   progress: undefined,
          //   theme: 'colored',
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
          //   theme: 'colored',
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
          //   theme: 'colored',
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
          //   theme: 'colored',
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
          //   theme: 'colored',
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
  const loggedInUID = localStorage.getItem("uid");

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

    const intervalId = setInterval(fetchData, 2000); // Fetch data every 60 seconds

    return () => clearInterval(intervalId);
  }, [db, loggedInUID]);

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
        Add Deposit
      </button>

      {/* -----------------------------------Modal--------------------------------------------- */}
      {/* Modal */}
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="custom-modal"
        style={{ paddingTop: "3%" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Deposite</Modal.Title>
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
                      <div style={{ color: "red" }}>{TransactionDateError}</div>
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
                          <div style={{ color: "red" }}>{CheckOnlineError}</div>
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
                        RS:{" "}
                        {CashOnHand && CashOnHand > 0
                          ? CashOnHand.toLocaleString()
                          : "0"}
                      </div>

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
    </>
  );
}

export default AddDeposit;
