import React, { useState, useEffect } from "react";

// Bootstrap Modal
// ---------------------------------------------------
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useLocation } from "react-router-dom";
// ---------------------------------------------------

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

function Code() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const CodeTypeName = searchParams.get("CodeName");

  const [Code, setCode] = useState("");
  const [CodeError, setCodeError] = useState("");

  const [IsActive, setIsActive] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = async () => {
    setCode("");

    setShow(true); // Store the editing item's ID in state
  };

  const handleInputBlur = (field, value) => {
    switch (field) {
      case "code":
        if (value.trim() === "") {
          // setCodeTypeError("CodeType is required");
          toast.error(`${CodeTypeName} is required`, {
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
          setCodeError("");
        }
        break;
      default:
        break;
    }
  };

  const handleSaveChanges = () => {
    if (Code) {
      // Implement your save logic here
      console.log("Changes saved!");

      try {
        const loggedInUID = localStorage.getItem("uid");
        const CustomerRef = ref(db, `${CodeTypeName}`);
        const newCustomer = {
          uid: loggedInUID,
          codeValue: Code,
          isActive: IsActive,
        };
        push(CustomerRef, newCustomer);

        // Show a success toast if the product is successfully added
        toast.success(`${CodeTypeName} Added Successfully`, {
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

        // handleClose(); // Close the modal after successful insert
      } catch (error) {
        toast.error(`${CodeTypeName} Error adding: ` + error.message, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        console.log(`Error adding ${CodeTypeName}:`, error);
      }
    } else {
      handleInputBlur("code", Code);
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
        Add {CodeTypeName}
      </button>

      {/* -----------------------------------Modal--------------------------------------------- */}
      {/* Modal */}
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="small-Model"
        // style={{ paddingTop: "3%" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add {CodeTypeName}</Modal.Title>
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
                      onBlur={() => handleInputBlur("code", Code)}
                      onFocus={() => setCodeError("")}
                      onChange={(e) => setCode(e.target.value)}
                    />
                    {CodeError && (
                      <div style={{ color: "red" }}>{CodeError}</div>
                    )}
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

export default Code;
