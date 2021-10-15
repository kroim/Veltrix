import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import MetisMenu from "metismenujs";

import SimpleBar from "simplebar-react";
import {connect} from "react-redux";

const SidebarContent = props => {
  return (
    <div id="sidebar-menu">
      <ul className="metismenu list-unstyled" id="side-menu">

        <li>
          <Link to="/dashboard" className="waves-effect">
            <i className="ti-home"/>
            <span>Dashboard</span>
          </Link>
        </li>

        <li className="menu-title">Production System</li>

        <li>
          <Link to="/#" className="has-arrow waves-effect">
            <i className="ti-view-grid"/>
            <span>Production Control</span>
          </Link>
          <ul className="sub-menu" aria-expanded="false">
            <li>
              <Link to="/constraints-log">Constraints Log</Link>
            </li>
            <li>
              <Link to="/look-ahead-plan">Lookahead Plan</Link>
            </li>
            <li>
              <Link to="/make-ready-plan">Visual Planner</Link>
            </li>
            <li>
              <Link to="/commitment-plan">Commitment Plan</Link>
            </li>
            <li>
              <Link to="/standard-process-library">Process Library</Link>
            </li>
            <li>
              <Link to="/analytics">Analytics</Link>
            </li>
          </ul>
        </li>

        <li>
          <Link to="/#" className="has-arrow waves-effect">
            <i className="ti-layout"/>
            <span>Project Attributes</span>
          </Link>
          <ul className="sub-menu" aria-expanded="false">
            <li>
              <Link to="project-attributes">Project Tags</Link>
            </li>
			<li>
              <Link to="project-collaborators">Collaborators</Link>
            </li>
			<li>
              <Link to="reason-codes">Reason Codes</Link>
            </li>
          </ul>
        </li>

        {
          props.isAdmin?
              <li>
                <Link to="/#" className="has-arrow waves-effect">
                  <i className="ti-user"/>
                  <span>System Admin</span>
                </Link>
                <ul className="sub-menu" aria-expanded="false">
                  <li>
                    <Link to="user-capabilities">User Capabilities</Link>
                  </li>
                </ul>
              </li>
              :null
        }

		<li className="menu-title">Project Request</li>

		<li>
          <Link to="/#" className="has-arrow waves-effect">
            <i className="ti-package"/>
            <span>Digital Design</span>
          </Link>
          <ul className="sub-menu" aria-expanded="false">
            <li>
              <Link to="digital-design-view">View </Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.initMenu();
  }

  componentDidUpdate(prevProps) {
    if (this.props.type !== prevProps.type) {
      this.initMenu();
    }
  }

  initMenu() {
    if (this.props.type !== "condensed" || this.props.isMobile) {
      new MetisMenu("#side-menu");

      var matchingMenuItem = null;
      var ul = document.getElementById("side-menu");
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
  }

  activateParentDropdown = item => {
    item.classList.add("mm-active");
    const parent = item.parentElement;

    if (parent) {
      parent.classList.add("mm-active"); // li
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show");

        const parent3 = parent2.parentElement;

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add("mm-active");
          }
        }
      }
      return false;
    }
    return false;
  };

  render() {
    const { user } = this.props;
    const isAdmin = user && user.role === 'admin';
    return (
      <React.Fragment>
        {this.props.type !== "condensed" ? (
          <SimpleBar style={{ maxHeight: "100%" }}>
            <SidebarContent isAdmin={isAdmin} />
          </SimpleBar>
        ) : (
          <SidebarContent isAdmin={isAdmin} />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.Login.user
  }
}

export default connect(mapStateToProps, null)(withRouter(Sidebar));
