import React, { Component } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

// falgs
import usFlag from "../assets/images/flags/us_flag.jpg";
import germanyFlag from "../assets/images/flags/germany_flag.jpg";
import italyFlag from "../assets/images/flags/italy_flag.jpg";
import frenchFlag from "../assets/images/flags/french_flag.jpg";
import spainFlag from "../assets/images/flags/spain_flag.jpg";
import russiaFlag from "../assets/images/flags/russia_flag.jpg";

class LanguageDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      menu: !prevState.menu
    }));
  }
  render() {
    return (
      <React.Fragment>
        <Dropdown
          isOpen={this.state.menu}
          toggle={this.toggle}
          className="d-none d-md-block ml-2"
        >
          <DropdownToggle
            className="btn header-item waves-effecte"
            tag="button"
          >
            <img
              className="mr-2"
              src={usFlag}
              alt="Header Language"
              height="16"
            />{" "}
            English
            <span className="mdi mdi-chevron-down"></span>
          </DropdownToggle>
          <DropdownMenu className="language-switch" right>
            <DropdownItem tag="a" href="#" className="notify-item">
              <img
                src={germanyFlag}
                alt="veltrix"
                className="mr-1"
                height="12"
              />{" "}
              <span className="align-middle"> German </span>
            </DropdownItem>
            <DropdownItem tag="a" href="#" className="notify-item">
              <img src={italyFlag} alt="veltrix" className="mr-1" height="12" />{" "}
              <span className="align-middle"> Italian </span>
            </DropdownItem>
            <DropdownItem tag="a" href="#" className="notify-item">
              <img
                src={frenchFlag}
                alt="veltrix"
                className="mr-1"
                height="12"
              />{" "}
              <span className="align-middle"> French </span>
            </DropdownItem>
            <DropdownItem tag="a" href="#" className="notify-item">
              <img src={spainFlag} alt="veltrix" className="mr-1" height="12" />{" "}
              <span className="align-middle"> Spanish </span>
            </DropdownItem>
            <DropdownItem tag="a" href="#" className="notify-item">
              <img
                src={russiaFlag}
                alt="veltrix"
                className="mr-1"
                height="12"
              />{" "}
              <span className="align-middle"> Russian </span>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </React.Fragment>
    );
  }
}

export default LanguageDropdown;
