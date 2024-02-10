import React from "react";

// Images and SVG
// ---------------------------------------------------
import defaultMode from "../../assets/img/falcon-mode-default.jpg";
import darkMode from "../../assets/img/falcon-mode-dark.jpg";
import autoMode from "../../assets/img/falcon-mode-auto.jpg";
import defaultTheme from "../../assets/img/default.png";
import invertedTheme from "../../assets/img/inverted.png";
import cardTheme from "../../assets/img/card.png";
import vibrantTheme from "../../assets/img/vibrant.png";
import Arrowh from "../../assets/img/img/icons/arrows-h.svg";
import Paragraph from "../../assets/img/img/icons/paragraph.svg";
// ---------------------------------------------------

// Setting Css
// ---------------------------------------------------
import "./Setting.css";
import "./custom";
// ---------------------------------------------------

function CustomizeSetting() {
  return (
    <>
      <div
        className="offcanvas offcanvas-end settings-panel border-0"
        id="settings-offcanvas"
        tabindex="-1"
        aria-labelledby="settings-offcanvas"
      >
        <div className="offcanvas-header settings-panel-header bg-shape">
          <div className="z-1 py-1">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <h5 className="text-white mb-0 me-2">
                <svg
                  className="svg-inline--fa fa-palette fa-w-16 me-2 fs-9"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="palette"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  data-fa-i2svg=""
                >
                  <path
                    fill="currentColor"
                    d="M204.3 5C104.9 24.4 24.8 104.3 5.2 203.4c-37 187 131.7 326.4 258.8 306.7 41.2-6.4 61.4-54.6 42.5-91.7-23.1-45.4 9.9-98.4 60.9-98.4h79.7c35.8 0 64.8-29.6 64.9-65.3C511.5 97.1 368.1-26.9 204.3 5zM96 320c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm32-128c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128-64c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 64c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"
                  ></path>
                </svg>
                Settings
              </h5>
              <button
                className="btn btn-primary btn-sm rounded-pill mt-0 mb-0"
                data-theme-control="reset"
                style={{ fontSize: "12px" }}
              >
                <svg
                  className="svg-inline--fa fa-redo-alt fa-w-16 me-1"
                  data-fa-transform="shrink-3"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="redo-alt"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  data-fa-i2svg=""
                  style={{ transformOrigin: "0.5em 0.5em" }}
                >
                  <g transform="translate(256 256)">
                    <g transform="translate(0, 0)  scale(0.8125, 0.8125)  rotate(0 0 0)">
                      <path
                        fill="currentColor"
                        d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z"
                        transform="translate(-256 -256)"
                      ></path>
                    </g>
                  </g>
                </svg>
                Reset
              </button>
            </div>
            <p className="mb-0 fs-10 text-white opacity-75">
              Set your own customized style
            </p>
          </div>
          <div className="z-1" data-bs-theme="dark">
            <button
              className="btn-close z-1 mt-0"
              type="button"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
        </div>
        <div
          className="offcanvas-body scrollbar-overlay px-x1 h-100"
          id="themeController"
          data-simplebar="init"
        >
          <div className="simplebar-wrapper" style={{ margin: "-16px -20px" }}>
            <div className="simplebar-height-auto-observer-wrapper">
              <div className="simplebar-height-auto-observer"></div>
            </div>
            <div className="simplebar-mask">
              <div
                className="simplebar-offset"
                style={{ right: "0px; bottom: 0px" }}
              >
                <div
                  className="simplebar-content-wrapper"
                  tabindex="0"
                  role="region"
                  aria-label="scrollable content"
                  style={{ height: "100%", overflow: "hidden scroll" }}
                >
                  <div
                    className="simplebar-content"
                    style={{ padding: "16px 20px" }}
                  >
                    <h5 className="fs-9">Color Scheme</h5>
                    <p className="fs-10">
                      Choose the perfect color mode for your app.
                    </p>
                    <div className="btn-group d-block w-100 btn-group-navbar-style">
                      <div className="row gx-2">
                        <div className="col-4">
                          <input
                            className="btn-check"
                            id="themeSwitcherLight"
                            name="theme-color"
                            type="radio"
                            value="light"
                            data-theme-control="theme"
                            defaultChecked="true"
                          />
                          <label
                            className="btn d-inline-block btn-navbar-style fs-10"
                            htmlFor="themeSwitcherLight"
                          >
                            <span className="hover-overlay mb-2 rounded d-block">
                              <img
                                className="img-fluid img-prototype mb-0"
                                src={defaultMode}
                                alt=""
                              />
                            </span>
                            <span className="label-text">Light</span>
                          </label>
                        </div>
                        <div className="col-4">
                          <input
                            className="btn-check"
                            id="themeSwitcherDark"
                            name="theme-color"
                            type="radio"
                            value="dark"
                            data-theme-control="theme"
                          />
                          <label
                            className="btn d-inline-block btn-navbar-style fs-10"
                            htmlFor="themeSwitcherDark"
                          >
                            <span className="hover-overlay mb-2 rounded d-block">
                              <img
                                className="img-fluid img-prototype mb-0"
                                src={darkMode}
                                alt=""
                              />
                            </span>
                            <span className="label-text"> Dark</span>
                          </label>
                        </div>
                        <div className="col-4">
                          <input
                            className="btn-check"
                            id="themeSwitcherAuto"
                            name="theme-color"
                            type="radio"
                            value="auto"
                            data-theme-control="theme"
                          />
                          <label
                            className="btn d-inline-block btn-navbar-style fs-10"
                            htmlFor="themeSwitcherAuto"
                          >
                            <span className="hover-overlay mb-2 rounded d-block">
                              <img
                                className="img-fluid img-prototype mb-0"
                                src={autoMode}
                                alt=""
                              />
                            </span>
                            <span className="label-text"> Auto</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <hr />
                    <div className="d-flex justify-content-between">
                      <div className="d-flex align-items-start">
                        <img className="me-2" src={Arrowh} width="20" alt="" />
                        <div className="flex-1">
                          <h5 className="fs-9">Fluid Layout</h5>
                          <p className="fs-10 mb-0">
                            Toggle container layout system
                          </p>
                        </div>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input ms-0"
                          id="mode-fluid"
                          type="checkbox"
                          data-theme-control="isFluid"
                          defaultChecked="true"
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="d-flex align-items-start">
                      <img className="me-2" src={Paragraph} width="20" alt="" />
                      <div className="flex-1">
                        <h5 className="fs-9 d-flex align-items-center">
                          Navigation Position
                        </h5>
                        <p className="fs-10 mb-2">
                          Select a suitable navigation system for your web
                          application
                        </p>
                        <div>
                          <select
                            className="form-select form-select-sm active"
                            aria-label="Navbar position"
                            data-theme-control="navbarPosition"
                          >
                            <option value="vertical">Vertical</option>
                            <option value="top">Top</option>
                            <option value="combo">Combo</option>
                            <option value="double-top">Double Top</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <h5 className="fs-9 d-flex align-items-center">
                      Vertical Navbar Style
                    </h5>
                    <p className="fs-10 mb-0">
                      Switch between styles for your vertical navbar
                    </p>
                    <p></p>
                    <div className="btn-group d-block w-100 btn-group-navbar-style">
                      <div className="row gx-2">
                        <div className="col-6">
                          <input
                            className="btn-check"
                            id="navbar-style-transparent"
                            type="radio"
                            name="navbarStyle"
                            value="transparent"
                            data-theme-control="navbarStyle"
                          />
                          <label
                            className="btn d-block w-100 btn-navbar-style fs-10"
                            htmlFor="navbar-style-transparent"
                          >
                            <img
                              className="img-fluid img-prototype"
                              src={defaultTheme}
                              alt=""
                            />
                            <span className="label-text"> Transparent</span>
                          </label>
                        </div>
                        <div className="col-6">
                          <input
                            className="btn-check"
                            id="navbar-style-inverted"
                            type="radio"
                            name="navbarStyle"
                            value="inverted"
                            data-theme-control="navbarStyle"
                          />
                          <label
                            className="btn d-block w-100 btn-navbar-style fs-10"
                            htmlFor="navbar-style-inverted"
                          >
                            <img
                              className="img-fluid img-prototype"
                              src={invertedTheme}
                              alt=""
                            />
                            <span className="label-text"> Inverted</span>
                          </label>
                        </div>
                        <div className="col-6">
                          <input
                            className="btn-check"
                            id="navbar-style-card"
                            type="radio"
                            name="navbarStyle"
                            value="card"
                            data-theme-control="navbarStyle"
                            defaultChecked="true"
                          />
                          <label
                            className="btn d-block w-100 btn-navbar-style fs-10"
                            htmlFor="navbar-style-card"
                          >
                            <img
                              className="img-fluid img-prototype"
                              src={cardTheme}
                              alt=""
                            />
                            <span className="label-text"> Card</span>
                          </label>
                        </div>
                        <div className="col-6">
                          <input
                            className="btn-check"
                            id="navbar-style-vibrant"
                            type="radio"
                            name="navbarStyle"
                            value="vibrant"
                            data-theme-control="navbarStyle"
                          />
                          <label
                            className="btn d-block w-100 btn-navbar-style fs-10"
                            htmlFor="navbar-style-vibrant"
                          >
                            <img
                              className="img-fluid img-prototype"
                              src={vibrantTheme}
                              alt=""
                            />
                            <span className="label-text"> Vibrant</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="simplebar-placeholder"
              style={{ width: "auto", height: "1321px" }}
            ></div>
          </div>
          <div
            className="simplebar-track simplebar-horizontal"
            style={{ visibility: "hidden" }}
          >
            <div
              className="simplebar-scrollbar"
              style={{ display: "hidden", width: "0px" }}
            ></div>
          </div>
          <div
            className="simplebar-track simplebar-vertical"
            style={{ visibility: "visible" }}
          >
            <div
              className="simplebar-scrollbar"
              style={{
                height: "220px",
                transform: "translate3d(0px, 0px, 0px)",
                display: "block",
              }}
            ></div>
          </div>
        </div>
      </div>
      <a
        className="card setting-toggle"
        href="https://prium.github.io/falcon/v3.19.0/pages/authentication/card/login.html#settings-offcanvas"
        data-bs-toggle="offcanvas"
      >
        <div className="card-body d-flex align-items-center py-md-2 px-2 py-1">
          <div
            className="bg-primary-subtle position-relative rounded-start"
            style={{ height: "34px", width: "28px" }}
          >
            <div className="settings-popover">
              <span className="ripple">
                <span className="fa-spin position-absolute all-0 d-flex flex-center">
                  <span className="icon-spin position-absolute all-0 d-flex flex-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.7369 12.3941L19.1989 12.1065C18.4459 11.7041 18.0843 10.8487 18.0843 9.99495C18.0843 9.14118 18.4459 8.28582 19.1989 7.88336L19.7369 7.59581C19.9474 7.47484 20.0316 7.23291 19.9474 7.03131C19.4842 5.57973 18.6843 4.28943 17.6738 3.20075C17.5053 3.03946 17.2527 2.99914 17.0422 3.12011L16.393 3.46714C15.6883 3.84379 14.8377 3.74529 14.1476 3.3427C14.0988 3.31422 14.0496 3.28621 14.0002 3.25868C13.2568 2.84453 12.7055 2.10629 12.7055 1.25525V0.70081C12.7055 0.499202 12.5371 0.297594 12.2845 0.257272C10.7266 -0.105622 9.16879 -0.0653007 7.69516 0.257272C7.44254 0.297594 7.31623 0.499202 7.31623 0.70081V1.23474C7.31623 2.09575 6.74999 2.8362 5.99824 3.25599C5.95774 3.27861 5.91747 3.30159 5.87744 3.32493C5.15643 3.74527 4.26453 3.85902 3.53534 3.45302L2.93743 3.12011C2.72691 2.99914 2.47429 3.03946 2.30587 3.20075C1.29538 4.28943 0.495411 5.57973 0.0322686 7.03131C-0.051939 7.23291 0.0322686 7.47484 0.242788 7.59581L0.784376 7.8853C1.54166 8.29007 1.92694 9.13627 1.92694 9.99495C1.92694 10.8536 1.54166 11.6998 0.784375 12.1046L0.242788 12.3941C0.0322686 12.515 -0.051939 12.757 0.0322686 12.9586C0.495411 14.4102 1.29538 15.7005 2.30587 16.7891C2.47429 16.9504 2.72691 16.9907 2.93743 16.8698L3.58669 16.5227C4.29133 16.1461 5.14131 16.2457 5.8331 16.6455C5.88713 16.6767 5.94159 16.7074 5.99648 16.7375C6.75162 17.1511 7.31623 17.8941 7.31623 18.7552V19.2891C7.31623 19.4425 7.41373 19.5959 7.55309 19.696C7.64066 19.7589 7.74815 19.7843 7.85406 19.8046C9.35884 20.0925 10.8609 20.0456 12.2845 19.7729C12.5371 19.6923 12.7055 19.4907 12.7055 19.2891V18.7346C12.7055 17.8836 13.2568 17.1454 14.0002 16.7312C14.0496 16.7037 14.0988 16.6757 14.1476 16.6472C14.8377 16.2446 15.6883 16.1461 16.393 16.5227L17.0422 16.8698C17.2527 16.9907 17.5053 16.9504 17.6738 16.7891C18.7264 15.7005 19.4842 14.4102 19.9895 12.9586C20.0316 12.757 19.9474 12.515 19.7369 12.3941ZM10.0109 13.2005C8.1162 13.2005 6.64257 11.7893 6.64257 9.97478C6.64257 8.20063 8.1162 6.74905 10.0109 6.74905C11.8634 6.74905 13.3792 8.20063 13.3792 9.97478C13.3792 11.7893 11.8634 13.2005 10.0109 13.2005Z"
                        fill="#2A7BE4"
                      ></path>
                    </svg>
                  </span>
                </span>
              </span>
            </div>
          </div>
          <small className="text-uppercase text-primary fw-bold bg-primary-subtle py-2 pe-2 ps-1 rounded-end">
            customize
          </small>
        </div>
      </a>
    </>
  );
}

export default CustomizeSetting;
