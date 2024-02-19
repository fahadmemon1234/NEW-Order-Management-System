import React, { useState } from "react";

//Image
// ---------------------------------------------------
import BgShape from "../../assets/img/bg-shape.png";
import Shape1 from "../../assets/img/shape-1.png";
import HalfCircle from "../../assets/img/half-circle.png";
// ---------------------------------------------------

//DataBase
// ---------------------------------------------------
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../Config/firebase";
// ---------------------------------------------------

//Notify
// ---------------------------------------------------
import { toast, ToastContainer } from "react-toastify";
import "../../assets/Css/Tostify.css";
// ---------------------------------------------------

function Login() {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admins");
  const [, setError] = useState(null);

  const handleLogin = async (e) => {
    debugger;
    e.preventDefault();
    const auth = getAuth(app);
    var validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      email
    );

    try {
      if (!validRegex) {
        toast.error("Email is not valid", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (password === "") {
        toast.error("Password cannot be empty", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (email !== "" && password !== "") {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const uid = userCredential.user.uid;
        console.log("User UID:", uid);

        // Store user information in local storage
        localStorage.setItem("uid", uid);
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        localStorage.setItem("userlogin", true);

        console.log("User logged in:", userCredential.user);
        if (localStorage.getItem("userlogin", true)) {
          toast.success("You login was successful", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
        setTimeout(() => {
          window.location.replace("/Home");
        }, 2000);
      } else {
        toast.error("Please fill in both Email and Password Correctly!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (error) {
      setError(error.message);
      console.log("Error logging in:", error.message);

      toast.error("Network Error", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
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
      <main className="main" id="top">
        <div className="container-fluid">
          <div className="row min-vh-100 flex-center g-0">
            <div className="col-lg-8 col-xxl-5 py-3 position-relative">
              <img
                className="bg-auth-circle-shape"
                src={BgShape}
                alt=""
                width="250"
              />
              <img
                className="bg-auth-circle-shape-2"
                src={Shape1}
                alt=""
                width="150"
              />
              <div className="card overflow-hidden z-1">
                <div className="card-body p-0">
                  <div className="row g-0 h-100">
                    <div className="col-md-5 text-center bg-card-gradient">
                      <div
                        className="position-relative p-4 pt-md-5 pb-md-7"
                        data-bs-theme="light"
                      >
                        <div
                          className="bg-holder bg-auth-card-shape"
                          style={{
                            backgroundImage: `url(${HalfCircle})`,
                          }}
                        ></div>
                        <div className="z-1 position-relative">
                          <a
                            className="link-light mb-4 font-sans-serif fs-5 d-inline-block fw-bolder"
                            href="#"
                          >
                            falcon
                          </a>
                          <p className="opacity-75 text-white">
                            With the power of Falcon, you can now focus only on
                            functionaries for your digital products, while
                            leaving the UI design on us!
                          </p>
                        </div>
                      </div>
                      <div
                        className="mt-3 mb-4 mt-md-4 mb-md-5"
                        data-bs-theme="light"
                      >
                        <p className="text-white">
                          Don't have an account?
                          <br />
                          <a
                            className="text-decoration-underline link-light"
                            href="#"
                          >
                            Get started!
                          </a>
                        </p>
                        <p className="mb-0 mt-4 mt-md-5 fs-10 fw-semi-bold text-white opacity-75">
                          Read our{" "}
                          <a
                            className="text-decoration-underline text-white"
                            href="#"
                          >
                            terms
                          </a>{" "}
                          and{" "}
                          <a
                            className="text-decoration-underline text-white"
                            href="#"
                          >
                            conditions{" "}
                          </a>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-7 d-flex flex-center">
                      <div className="p-4 p-md-5 flex-grow-1">
                        <div className="row flex-between-center">
                          <div className="col-auto">
                            <h3>Account Login</h3>
                          </div>
                        </div>
                        <form>
                          <div className="mb-3">
                            <label className="form-label" htmlFor="card-email">
                              Email address
                            </label>
                            <input
                              className="form-control"
                              id="card-email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between">
                              <label
                                className="form-label"
                                htmlFor="card-password"
                              >
                                Password
                              </label>
                            </div>
                            <input
                              className="form-control"
                              id="card-password"
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <div className="row flex-between-center">
                            <div className="col-auto">
                              <div className="form-check mb-0">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="card-checkbox"
                                  defaultChecked="checked"
                                />
                                <label
                                  className="form-check-label mb-0"
                                  htmlFor="card-checkbox"
                                >
                                  Remember me
                                </label>
                              </div>
                            </div>
                            <div className="col-auto">
                              <a className="fs-10" href="#">
                                Forgot Password?
                              </a>
                            </div>
                          </div>
                          <div className="mb-3">
                            <button
                              className="btn btn-primary d-block w-100 mt-3"
                              type="submit"
                              name="submit"
                              onClick={handleLogin}
                            >
                              Log in
                            </button>
                          </div>
                        </form>
                        <div className="position-relative mt-4">
                          <hr />
                          <div className="divider-content-center">
                            or log in with
                          </div>
                        </div>

                        <div className="row g-2 mt-2">
                          <div className="col-sm-6">
                            <a
                              className="btn btn-outline-google-plus btn-sm d-block w-100"
                              href="#"
                            >
                              <svg
                                className="svg-inline--fa fa-google-plus-g fa-w-20 me-2"
                                data-fa-transform="grow-8"
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fab"
                                data-icon="google-plus-g"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 640 512"
                                data-fa-i2svg=""
                                style={{ transformOrigin: " 0.625em 0.5em" }}
                              >
                                <g transform="translate(320 256)">
                                  <g transform="translate(0, 0)  scale(1.5, 1.5)  rotate(0 0 0)">
                                    <path
                                      fill="currentColor"
                                      d="M386.061 228.496c1.834 9.692 3.143 19.384 3.143 31.956C389.204 370.205 315.599 448 204.8 448c-106.084 0-192-85.915-192-192s85.916-192 192-192c51.864 0 95.083 18.859 128.611 50.292l-52.126 50.03c-14.145-13.621-39.028-29.599-76.485-29.599-65.484 0-118.92 54.221-118.92 121.277 0 67.056 53.436 121.277 118.92 121.277 75.961 0 104.513-54.745 108.965-82.773H204.8v-66.009h181.261zm185.406 6.437V179.2h-56.001v55.733h-55.733v56.001h55.733v55.733h56.001v-55.733H627.2v-56.001h-55.733z"
                                      transform="translate(-320 -256)"
                                    ></path>
                                  </g>
                                </g>
                              </svg>
                              google
                            </a>
                          </div>
                          <div className="col-sm-6">
                            <a
                              className="btn btn-outline-facebook btn-sm d-block w-100"
                              href="#"
                            >
                              <svg
                                className="svg-inline--fa fa-facebook-square fa-w-14 me-2"
                                data-fa-transform="grow-8"
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fab"
                                data-icon="facebook-square"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                                data-fa-i2svg=""
                                style={{ transformOrigin: " 0.4375em 0.5em" }}
                              >
                                <g transform="translate(224 256)">
                                  <g transform="translate(0, 0)  scale(1.5, 1.5)  rotate(0 0 0)">
                                    <path
                                      fill="currentColor"
                                      d="M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z"
                                      transform="translate(-224 -256)"
                                    ></path>
                                  </g>
                                </g>
                              </svg>
                              facebook
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Login;
