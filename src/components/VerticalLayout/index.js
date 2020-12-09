import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  toggleRightSidebar,
  changeTopbarTheme,
  changeLayoutWidth
} from "../../store/actions";

import RightSidebar from "../../components/RightSidebar";
import TopBar from "./TopBar";
// Other Layout related Component
import Sidebar from "./Sidebar";
import Footer from "./Footer";

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    };

    this.toggleMenuCallback = this.toggleMenuCallback.bind(this);
    this.toggleRightSidebar = this.toggleRightSidebar.bind(this);
  }

  toggleRightSidebar() {
    this.props.toggleRightSidebar();
  }

  capitalizeFirstLetter = string => {
    return string.charAt(1).toUpperCase() + string.slice(2);
  };

  componentDidMount() {
    // Scroll Top to 0
    window.scrollTo(0, 0);
    let currentage = this.capitalizeFirstLetter(this.props.location.pathname);

    document.title =
      currentage + " | Veltrix - Responsive Bootstrap 4 Admin Dashboard";
    if (this.props.leftSideBarTheme) {
      this.props.changeSidebarTheme(this.props.leftSideBarTheme);
    }
    
    if (this.props.layoutWidth) {
      this.props.changeLayoutWidth(this.props.layoutWidth);
    }
    
    console.log('leftSideBarType', this.props.leftSideBarType)
    if (this.props.leftSideBarType) {
      this.props.changeSidebarType(this.props.leftSideBarType);
    }
    if (this.props.topbarTheme) {
      this.props.changeTopbarTheme(this.props.topbarTheme);
    }
    
    if(this.props.showRightSidebar) {
      this.toggleRightSidebar();
    }
  }

  toggleMenuCallback = () => {
    if (this.props.leftSideBarType === "default") {
      this.props.changeSidebarType("condensed", this.state.isMobile);
    } else if (this.props.leftSideBarType === "condensed") {
      this.props.changeSidebarType("default", this.state.isMobile);
    }
  };

  render() {
    return (
      <React.Fragment>
        <div id="layout-wrapper">
          <TopBar toggleMenuCallback={this.toggleMenuCallback} toggleRightSidebar={this.toggleRightSidebar} />

          <div className="vertical-menu">
            <div data-simplebar className="h-100">
              <Sidebar
                theme={this.props.leftSideBarTheme}
                type={this.props.leftSideBarType}
                isMobile={this.state.isMobile}
              />
            </div>
          </div>
          <div className="main-content">
            <div className="page-content">{this.props.children}</div>
          </div>
          <Footer />

          <RightSidebar />
        </div>
      </React.Fragment>
    );
  }
}

const mapStatetoProps = state => {
  return {
    ...state.Layout
  };
};
export default connect(mapStatetoProps, {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  toggleRightSidebar,
  changeTopbarTheme,
  changeLayoutWidth
})(withRouter(Layout));
