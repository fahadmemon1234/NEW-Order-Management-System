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

function AddBrandCode() {
  const [Code, setCode] = useState("");
  const [CodeError, setCodeError] = useState("");

  const [IsActive, setIsActive] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = async () => {
    setCode("");

    setShow(true); // Store the editing item's ID in state
  };

  const checkExistingItem = async () => {
    const productsRef = ref(db, "BrandCode");
    const snapshot = await get(productsRef);
    const existingProducts = snapshot.val();
    for (const key in existingProducts) {
      if (existingProducts[key].codeValue === Code) {
        return true; // Item with the same name already exists
      }
    }
    return false; // Item with the same name does not exist
  };

  const handleSaveChanges = async () => {
    try {
      if (Code) {
        const itemExists = await checkExistingItem();

        if (itemExists) {
          toast.error("Brand Code already exists.", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          // You can show an error message or handle the situation accordingly
          return;
        } else {
          const loggedInUID = localStorage.getItem("uid");
          const CustomerRef = ref(db, `BrandCode`);
          const newCustomer = {
            uid: loggedInUID,
            codeValue: Code,
            isActive: IsActive,
          };
          push(CustomerRef, newCustomer);

          // Show a success toast if the product is successfully added
          toast.success(`Brand Code Added Successfully`, {
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

            setCode("");
            setIsActive(false);
          }, 2000);
        }
        // handleClose(); // Close the modal after successful insert
      } else {
        toast.error("Brand Code is required", {
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
      toast.error(`Brand Code Error adding: ` + error.message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      console.log(`Error adding Brand Code:`, error);
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

      {/* <button
        className="btn btn-primary"
        type="button"
        onClick={handleShow}
        style={{ float: "right" }}d
      >
        Add Measurement
      </button> */}

      <a
        href="#"
        style={{ float: "right", fontSize: 13 + "px", fontWeight: "600" }}
        onClick={handleShow}
      >
        Add Brand Code
      </a>

      {/* -----------------------------------Modal--------------------------------------------- */}
      {/* Modal */}
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="small-Model"
        // style={{ paddingTop: "3%" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Brand Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <form>
              <div className="row">
                <div className="col-md-12 col-sm-12 col-lg-12">
                  <div className="mb-3">
                    <label
                      htmlFor="Code"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      Code Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="Code"
                      id="Code"
                      placeholder="Enter Code Value"
                      value={Code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-12 col-sm-12 col-lg-12">
                  <div className="mb-3">
                    <label
                      htmlFor="Code"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      IsActive
                    </label>
                    <div class="form-check form-switch">
                      <input
                        class="form-check-input"
                        id="flexSwitchCheckDefault"
                        type="checkbox"
                        checked={IsActive} // add checked attribute to reflect the state of isActive
                        onChange={() => setIsActive(!IsActive)}
                      />
                    </div>
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

export default AddBrandCode;
