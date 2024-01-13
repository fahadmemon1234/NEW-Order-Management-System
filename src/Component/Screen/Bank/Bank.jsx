import React from "react";

// Main Page Connect
// ---------------------------------------------------
import Main from "../../NavBar/Navbar";
// ---------------------------------------------------

function Banks() {
  return (
    <>
      <Main>
        <div className="card">
          <div className="card-body">
            {/* Headng and btn */}
            <div
              className="row"
              style={{ paddingTop: "30px", alignItems: "center" }}
            >
              <div className="col-md-6 col-sm-6 col-lg-6">
                <h1>Banks</h1>
              </div>
            </div>
          </div>
        </div>
      </Main>
    </>
  );
}

export default Banks;
