import React, { Component } from "react";
import { Collapse } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import classname from "classnames";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    var matchingMenuItem = null;
    var ul = document.getElementById("navigation");
    var items = ul.getElementsByTagName("a");
    for (var i = 0; i < items.length; ++i) {
      if (this.props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      this.activateParentDropdown(matchingMenuItem);
    }
  }

  activateParentDropdown = item => {
    item.classList.add("active");
    const parent = item.parentElement;

    if (parent) {
      parent.classList.add("active"); // li
      const parent2 = parent.parentElement;
      parent2.classList.add("active"); // li
      const parent3 = parent2.parentElement;
      if (parent3) {
        parent3.classList.add("active"); // li
        const parent4 = parent3.parentElement;
        if (parent4) {
          parent4.classList.add("active"); // li
          const parent5 = parent4.parentElement;
          if (parent5) {
            parent5.classList.add("active"); // li
          }
        }
      }
    }
    return false;
  };
  render() {
    return (
      <React.Fragment>
        <div className="topnav">
          <div className="container-fluid">
            <nav className="navbar navbar-light navbar-expand-lg topnav-menu">
              <Collapse
                isOpen={this.props.menuOpen}
                className="navbar-collapse"
              >
                <div id="navigation">
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Link className="nav-link" to="/dashboard">
                        <i className="ti-home mr-2"></i>Dashboard
                      </Link>
                    </li>

                    <li className="nav-item dropdown mega-dropdown">
                      <Link
                        className="nav-link dropdown-toggle arrow-none"
                        to="/#"
                        onClick={e => {
                          e.preventDefault();
                          this.setState({ uiState: !this.state.uiState });
                        }}
                      >
                        <i className="ti-package mr-2"></i>Product Control
                      </Link>

                      <div
                        className={classname("dropdown-menu",
                          { show: this.state.uiState }
                        )}
                      >
                          <Link to="constraints-log" className="dropdown-item">
                            Constraints Log
                          </Link>
                          <Link to="make-ready-plan" className="dropdown-item">
                            MakeReady Plan
                          </Link>
                          <Link to="commitment-plan" className="dropdown-item">
                            Commitment Plan
                          </Link>
                          <Link to="standard-process-library" className="dropdown-item">
                            Standard Process Library
                          </Link>
                          <Link to="analytics" className="dropdown-item">
                            Analytics
                          </Link>
                      </div>
                    </li>

                    <li className="nav-item dropdown">
                      <Link
                        className="nav-link dropdown-toggle arrow-none"
                        to="/#"
                        onClick={e => {
                          e.preventDefault();
                          this.setState({ CompoState: !this.state.CompoState });
                        }}
                      >
                        <i className="ti-harddrives mr-2"></i>Digital Design
                      </Link>

                      <div
                        className={classname("dropdown-menu", {
                          show: this.state.CompoState
                        })}
                      >
                        <Link to="digital-design-view" className="dropdown-item">
                          View
                        </Link>
                      </div>
                    </li>

                    <li className="nav-item dropdown mega-dropdown">
                      <Link
                        className="nav-link dropdown-toggle arrow-none"
                        to="/#"
                        onClick={e => {
                          e.preventDefault();
                          this.setState({
                            AuthState: !this.state.AuthState
                          });
                        }}
                      >
                        <i className="ti-archive mr-2"></i> Project Attributes
                      </Link>

                      <div
                        className={classname("dropdown-menu", {
                          show: this.state.AuthState
                        })}
                      >
                          <Link
                            to="project-attributes"
                            className="dropdown-item"
                          >
                            Project Attributes
                          </Link>
                      </div>
                    </li>

                    <li className="nav-item dropdown mega-dropdown">
                      <Link
                        className="nav-link dropdown-toggle arrow-none"
                        to="/#"
                        onClick={e => {
                          e.preventDefault();
                          this.setState({
                            ExtraState: !this.state.ExtraState
                          });
                        }}
                      >
                        <i className="ti-support mr-2"></i> Project Collaborators
                      </Link>

                      <div
                        className={classname("dropdown-menu",
                          {
                            show: this.state.ExtraState
                          }
                        )}
                      >
                        <Link
                          to="project-collaborators"
                          className="dropdown-item"
                        >
                          Collaborators
                        </Link>
                      </div>
                    </li>
                  </ul>
                </div>
              </Collapse>
            </nav>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Navbar);
