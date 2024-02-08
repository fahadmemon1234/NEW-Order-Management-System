import React, { useState, useEffect } from "react";

// Bootstrap Modal
// ---------------------------------------------------
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
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

function CodeType() {


  const [CodeType, setCodeType] = useState("");
  const [CodeTypeError, setCodeTypeError] = useState("");

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = async () => {
  
    setCodeType("");

    setShow(true); // Store the editing item's ID in state
  };

  const handleInputBlur = (field, value) => {
    switch (field) {
      case "codeType":
        if (value.trim() === "") {
            // setCodeTypeError("CodeType is required");
          toast.error('CodeType is required', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });
        } else {
          setCodeTypeError("");
        }
        break;
      default:
        break;
    }
  };

 

  const handleSaveChanges = () => {
    if (CodeType) {
      // Implement your save logic here
      console.log("Changes saved!");

      

      try {
        const loggedInUID = localStorage.getItem("uid");
        const CustomerRef = ref(db, "CodeType");
        const newCustomer = {
          uid: loggedInUID,
          codeType: CodeType,
        };
        push(CustomerRef, newCustomer);

        // Show a success toast if the product is successfully added
        toast.success("CodeType Added Successfully", {
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
          
          setCodeType("");
        }, 2000);

        // handleClose(); // Close the modal after successful insert
      } catch (error) {
        toast.error("Error adding CodeType: " + error.message, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        console.log("Error adding CodeType:", error);
      }
    } else {
      handleInputBlur("codeType", CodeType);
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
        Add CodeType
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
          <Modal.Title>Add CodeType</Modal.Title>
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
                      Code Type <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="Code"
                      id="Code"
                      placeholder="Enter Code Type"
                      value={CodeType}
                      onBlur={() =>
                        handleInputBlur("codeType", CodeType)
                      }
                      onFocus={() => setCodeTypeError("")}
                      onChange={(e) => setCodeType(e.target.value)}
                    />
                    {CodeTypeError && (
                      <div style={{ color: "red" }}>{CodeTypeError}</div>
                    )}
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

export default CodeType;
