import React, { Component } from "react";
import { Link } from "react-router-dom";

// import images
import logodarkImg from "../../assets/images/logo-dark.png";
import logosmImg from "../../assets/images/logo-sm.png";
import logolightImg from "../../assets/images/logo-light.png";

import ProfileMenu from "../../components/ProfileMenu";

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleRightbar = this.toggleRightbar.bind(this);
  }

  /**
   * Toggle sidebar
   */
  toggleMenu() {
    // this.props.toggleMenuCallback();
    this.props.openLeftMenuCallBack();
  }

  /**
   * Toggles the sidebar
   */
  toggleRightbar() {
    this.props.toggleRightSidebar();
  }

  /**
   * Toggle full screen
   */
  toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <header id="page-topbar">
          <div className="navbar-header">
            <div className="d-flex">
              <div
                className="navbar-brand-box"
              >

                <Link to="/" className="logo logo-dark">
                  <span className="logo-sm">
                    <img src={logosmImg} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logodarkImg} alt="" height="17" />
                  </span>
                </Link>

                <Link to="/" className="logo logo-light">
                  <span className="logo-sm">
                    <img src={logosmImg} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logolightImg} alt="" height="18" />
                  </span>
                </Link>
              </div>

              <button
                type="button"
                className="btn btn-sm mr-2 font-size-24 d-lg-none header-item waves-effect waves-light"
                onClick={this.toggleMenu}
              >
                <i className="mdi mdi-menu"></i>
              </button>
            </div>

            <div className="d-flex">
              
              <div className="dropdown d-none d-lg-inline-block">
                <button
                  type="button"
                  className="btn header-item noti-icon waves-effect"
                  onClick={this.toggleFullscreen}
                >
                  <i className="mdi mdi-fullscreen"></i>
                </button>
              </div>

              <ProfileMenu />
              
            </div>
          </div>
        </header>
      </React.Fragment>
    );
  }
}

export default TopBar;
