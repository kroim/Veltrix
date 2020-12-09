import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { CustomInput, FormGroup, Label } from "reactstrap";

//SimpleBar
import SimpleBar from "simplebar-react";

import {
  hideRightSidebar,
  changeLayout,
  changeLayoutWidth,
  changeSidebarTheme,
  changeSidebarType,
  changeTopbarTheme,
} from "../store/actions";

// Import images
import layout1 from "../assets/images/layouts/layout-1.jpg";
import layout2 from "../assets/images/layouts/layout-2.jpg";
import layout3 from "../assets/images/layouts/layout-3.jpg";

class RightSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layoutType: this.props.layoutType,
      sidebarType: this.props.leftSideBarType,
      layoutWidth: this.props.layoutWidth,
      sidebarTheme: this.props.leftSideBarTheme,
      topbarTheme: this.props.topbarTheme
    };
    this.hideRightbar = this.hideRightbar.bind(this);
    this.changeLayout = this.changeLayout.bind(this);
    this.changeLayoutWidth = this.changeLayoutWidth.bind(this);
    this.changeLeftSidebarTheme = this.changeLeftSidebarTheme.bind(this);
    this.changeLeftSidebarType = this.changeLeftSidebarType.bind(this);
    this.changeTopbarTheme = this.changeTopbarTheme.bind(this);
  }
  /**
   * Hides the right sidebar
   */
  hideRightbar() {
    this.props.hideRightSidebar();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        layoutType: this.props.layoutType,
        sidebarType: this.props.leftSideBarType,
        layoutWidth: this.props.layoutWidth,
        sidebarTheme: this.props.leftSideBarTheme,
        topbarTheme: this.props.topbarTheme
      });
    }
  }

  /**
   * Change the layout
   * @param {*} e
   */
  changeLayout(e) {
    if (e.target.checked) {
      this.props.changeLayout(e.target.value);
    }
  }

  /**
   * Changes layout width
   * @param {*} e 
   */
  changeLayoutWidth(e) {
    if (e.target.checked) {
      this.props.changeLayoutWidth(e.target.value);
    }
  }

  // change left sidebar design
  changeLeftSidebarType(e) {
    if (e.target.checked) {
      this.props.changeSidebarType(e.target.value);
    }
  }

  // change left sidebar theme
  changeLeftSidebarTheme(e) {
    if (e.target.checked) {
      this.props.changeSidebarTheme(e.target.value);
    }
  }

  // change topbar theme
  changeTopbarTheme(e) {
    if (e.target.checked) {
      this.props.changeTopbarTheme(e.target.value);
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="right-bar">
          <SimpleBar style={{ height: "900px" }}>
            <div data-simplebar className="h-100">
              <div className="rightbar-title px-3 py-4">
                <Link
                  to="#"
                  onClick={this.hideRightbar}
                  className="right-bar-toggle float-right"
                >
                  <i className="mdi mdi-close noti-icon"></i>
                </Link>
                <h5 className="m-0">Settings</h5>
              </div>

              <hr className="my-0" />

              <div className="p-4">
                <FormGroup>
                  <Label for="layout">Layouts</Label>
                  <div>
                    <CustomInput
                      type="radio"
                      id="verticalLayout"
                      name="layout"
                      label="Vertical"
                      value="vertical"
                      checked={this.state.layoutType === "vertical"}
                      onChange={this.changeLayout}
                    />
                    <CustomInput
                      type="radio"
                      id="horizontalLayout"
                      name="layout"
                      label="Horizontal"
                      value="horizontal"
                      checked={this.state.layoutType === "horizontal"}
                      onChange={this.changeLayout}
                    />
                  </div>
                </FormGroup>

                <hr />

                <FormGroup>
                  <Label for="layout">Layout Width</Label>
                  <div>
                    <CustomInput
                      type="radio"
                      id="fluid"
                      name="layoutWidth"
                      label="Fluid"
                      value="fluid"
                      checked={this.state.layoutWidth !== "boxed"}
                      onChange={this.changeLayoutWidth}
                    />
                    <CustomInput
                      type="radio"
                      id="boxed"
                      name="layoutWidth"
                      label="Boxed"
                      value="boxed"
                      checked={this.state.layoutWidth === "boxed"}
                      onChange={this.changeLayoutWidth}
                    />
                  </div>
                </FormGroup>

                <hr />
                <FormGroup>
                  <Label>Topbar Theme</Label>
                  <div>
                    <CustomInput
                      type="radio"
                      id="topbar-light"
                      name="topbar-theme"
                      label="Light"
                      value="light"
                      checked={this.state.topbarTheme === "light"}
                      onChange={this.changeTopbarTheme}
                    />

                    <CustomInput
                      type="radio"
                      id="topbar-dark"
                      name="topbar-theme"
                      label="Dark"
                      value="dark"
                      checked={this.state.topbarTheme === "dark"}
                      onChange={this.changeTopbarTheme}
                    />

                    {/* {this.state.layoutType === "horizontal" ?
                      <CustomInput
                        type="radio"
                        id="topbar-colored"
                        name="topbar-theme"
                        label="Colored"
                        value="colored"
                        checked={this.state.topbarTheme === "colored"}
                        onChange={this.changeTopbarTheme}
                      /> : null} */}
                  </div>
                </FormGroup>

                {this.state.layoutType === "vertical" ? <React.Fragment>
                  <hr />
                  <FormGroup>
                    <Label>Left Sidebar Type</Label>
                    <div>
                      <CustomInput
                        type="radio"
                        id="defaultSidebar"
                        name="type"
                        label="Default"
                        value="default"
                        checked={this.state.sidebarType === "default"}
                        onChange={this.changeLeftSidebarType}
                      />
                      <CustomInput
                        type="radio"
                        id="compactSidebar"
                        name="type"
                        label="Compact"
                        value="compact"
                        checked={this.state.sidebarType === "compact"}
                        onChange={this.changeLeftSidebarType}
                      />
                      <CustomInput
                        type="radio"
                        id="iconSidebar"
                        name="type"
                        label="Icon"
                        value="icon"
                        checked={this.state.sidebarType === "icon"}
                        onChange={this.changeLeftSidebarType}
                      />
                    </div>
                  </FormGroup>

                  <hr />

                  <FormGroup>
                    <Label>Left Sidebar Theme</Label>
                    <div>
                      <CustomInput
                        type="radio"
                        id="light"
                        name="theme"
                        label="Light"
                        value="light"
                        checked={this.state.sidebarTheme !== "dark" && this.state.sidebarTheme !== 'colored'}
                        onChange={this.changeLeftSidebarTheme}
                      />
                      <CustomInput
                        type="radio"
                        id="colored"
                        name="theme"
                        label="Colored"
                        value="colored"
                        checked={this.state.sidebarTheme === "colored"}
                        onChange={this.changeLeftSidebarTheme}
                      />
                      <CustomInput
                        type="radio"
                        id="dark"
                        name="theme"
                        label="Dark"
                        value="dark"
                        checked={this.state.sidebarTheme === "dark"}
                        onChange={this.changeLeftSidebarTheme}
                      />

                    </div>
                  </FormGroup>
                </React.Fragment> : null}

                <h6 className="text-center">Choose Layouts</h6>

                <div className="mb-2">
                  <Link to="//veltrix-h.react.themesbrand.com/" target="_blank">
                    <img
                      src={layout1}
                      className="img-fluid img-thumbnail"
                      alt=""
                    />
                  </Link>
                </div>

                <div className="mb-2">
                  <Link
                    to="//veltrix-h-dark.react.themesbrand.com/"
                    target="_blank"
                  >
                    <img
                      src={layout2}
                      className="img-fluid img-thumbnail"
                      alt=""
                    />
                  </Link>
                </div>

                <div className="mb-2">
                  <Link
                    to="//veltrix-h-rtl.react.themesbrand.com/"
                    target="_blank"
                  >
                    <img
                      src={layout3}
                      className="img-fluid img-thumbnail"
                      alt=""
                    />
                  </Link>
                </div>

                <Link
                  to="https://1.envato.market/grNDB"
                  className="btn btn-primary btn-block mt-3"
                  target="_blank"
                >
                  <i className="mdi mdi-cart mr-1"></i> Purchase Now
                </Link>
              </div>
            </div>
          </SimpleBar>
        </div>
        {/* Right bar overlay */}
        <div className="rightbar-overlay"></div>
      </React.Fragment>
    );
  }
}

const mapStatetoProps = state => {
  return { ...state.Layout };
};

export default connect(mapStatetoProps, {
  hideRightSidebar,
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  changeLayoutWidth,
  changeTopbarTheme
})(RightSidebar);
