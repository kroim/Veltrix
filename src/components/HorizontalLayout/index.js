import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import {
  changeLayout,
  changeTopbarTheme,
  toggleRightSidebar,
  changeLayoutWidth,
} from "../../store/actions";

// Other Layout related Component
import RightSidebar from "../../components/RightSidebar";
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpened: false
    };
    this.toggleRightSidebar = this.toggleRightSidebar.bind(this);
  }

  /**
   * Open/close right sidebar
   */
  toggleRightSidebar() {
    this.props.toggleRightSidebar();
  }

  componentDidMount() {
    // Scrollto 0,0
    window.scrollTo(0, 0);

    const title = this.props.location.pathname;
    let currentage =  title.charAt(1).toUpperCase() + title.slice(2);

    document.title =
      currentage + " | Veltrix - Responsive Bootstrap 4 Admin Dashboard";

      this.props.changeLayout('horizontal');
      if (this.props.topbarTheme) {
        this.props.changeTopbarTheme(this.props.topbarTheme);
      }
      if (this.props.layoutWidth) {
        this.props.changeLayoutWidth(this.props.layoutWidth);
      }
      if(this.props.showRightSidebar) {
        this.toggleRightSidebar();
      }
  }

  /**
   * Opens the menu - mobile
   */
  openMenu = e => {
    this.setState({ isMenuOpened: !this.state.isMenuOpened });
  };

  render() {
    return (
      <React.Fragment>
        <div id="layout-wrapper">
          <TopBar
            theme={this.props.topbarTheme}
            isMenuOpened={this.state.isMenuOpened}
            toggleRightSidebar={this.toggleRightSidebar}
            openLeftMenuCallBack={this.openMenu}
          />
          <Navbar menuOpen={this.state.isMenuOpened} />

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
  changeTopbarTheme, toggleRightSidebar, changeLayout, changeLayoutWidth
})(withRouter(Layout));
