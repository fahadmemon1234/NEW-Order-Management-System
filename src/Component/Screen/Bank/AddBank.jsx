import React, { useState, useEffect } from "react";

// Bootstrap Modal
// ---------------------------------------------------
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
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

function AddBank() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setBankName("");
    setBankTitle("");
    setOpeningBalance("");
    setOpeningBalanceDate("");
    setBankAccountNo("");
    setBankAddress("");
    setBranchName("");

    setShow(true);
  };

  const [BankName, setBankName] = useState("");
  const [BankTitle, setBankTitle] = useState("");
  const [OpeningBalance, setOpeningBalance] = useState("");
  const [OpeningBalanceDate, setOpeningBalanceDate] = useState("");
  const [BankAccountNo, setBankAccountNo] = useState("");
  const [BankAddress, setBankAddress] = useState("");
  const [BranchName, setBranchName] = useState("");

  // Auto Genrate ID
  const [lastId, setLastId] = useState(0);

  // Function to generate a new auto-incremented ID
  const generateId = () => {
    const newId = lastId + 1;
    setLastId(newId);
    return newId;
  };

  const checkExistingItem = async () => {
    const productsRef = ref(db, "Bank");
    const snapshot = await get(productsRef);
    const existingProducts = snapshot.val();
    for (const key in existingProducts) {
      if (existingProducts[key].bankName === BankName) {
        return true; // Item with the same name already exists
      }
    }
    return false; // Item with the same name does not exist
  };

  const handleSaveChanges = async () => {
    try {
      if (BankName && OpeningBalance && OpeningBalanceDate) {
        const itemExists = await checkExistingItem();
        if (itemExists) {
          toast.error("Bank already exists.", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        } else {
          const loggedInUID = localStorage.getItem("uid");
          const openingBalanceNumeric = parseFloat(OpeningBalance);

          const BankRef = ref(db, "Bank");
          const newAutoId = generateId();
          const newBank = {
            uid: loggedInUID,
            bankId: newAutoId,
            bankName: BankName,
            bankTitle: BankTitle,
            openingBalance: openingBalanceNumeric,
            openingBalanceDate: OpeningBalanceDate,
            bankAccountNumber: BankAccountNo,
            bankAddress: BankAddress,
            branchName: BranchName,
          };
          push(BankRef, newBank);

          // Show a success toast if the product is successfully added
          toast.success("Bank Added Successfully", {
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

            setBankName("");
            setBankTitle("");
            setOpeningBalance("");
            setOpeningBalanceDate("");
            setBankAddress("");
            setBankAccountNo("");
            setBranchName("");
          }, 2000);
        }
        // handleClose(); // Close the modal after successful insert
      } else if (!BankName) {
        toast.error("Bank Name is required", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (!OpeningBalance) {
        toast.error("Opening Balance is required", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (!OpeningBalanceDate) {
        toast.error("Opening Balance Date is required", {
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
      toast.error("Error adding Bank: " + error.message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      console.log("Error adding Bank:", error);
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
        Add Bank
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
          <Modal.Title>Add Bank</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <form>
              <div className="row">
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="BankName"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      Bank Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="BankName"
                      id="BankName"
                      placeholder="Enter Bank Name"
                      value={BankName}
                      onChange={(e) => setBankName(e.target.value)}
                    />
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
                    <input
                      type="text"
                      className="form-control"
                      name="BankTitle"
                      id="BankTitle"
                      placeholder="Enter Bank Title"
                      value={BankTitle}
                      onChange={(e) => setBankTitle(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="BankAccountNumber"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      Bank Account Number
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="BankAccountNumber"
                      id="BankAccountNumber"
                      placeholder="Enter Bank Account Number"
                      value={BankAccountNo}
                      onChange={(e) => setBankAccountNo(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="BankAddress"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      Bank Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="BankAddress"
                      id="BankAddress"
                      placeholder="Enter Bank Address"
                      value={BankAddress}
                      onChange={(e) => setBankAddress(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="OpeningBalance"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      Opening Balance <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="OpeningBalance"
                      id="OpeningBalance"
                      placeholder="Enter Opening Balance"
                      value={OpeningBalance}
                      onChange={(e) => setOpeningBalance(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="OpeningBalanceDate"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      Opening Balance Date{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="OpeningBalanceDate"
                      id="OpeningBalanceDate"
                      placeholder="Enter Opening Balance Date"
                      value={OpeningBalanceDate}
                      onChange={(e) => setOpeningBalanceDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 col-sm-12 col-lg-12">
                  <div className="mb-3">
                    <label
                      htmlFor="BranchName"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      Branch Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="BranchName"
                      id="BranchName"
                      placeholder="Enter Branch Name"
                      value={BranchName}
                      onChange={(e) => setBranchName(e.target.value)}
                    />
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
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddBank;
