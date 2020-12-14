import React, { Component } from "react";
import SettingMenu from "../Shared/SettingMenu";
import { Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

class AnalyticsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <React.Fragment>
        <div className="container-fluid">
          <Row className="align-items-center">
            <Col sm={6}>
              <div className="page-title-box">
                <h4 className="font-size-18">Analytics</h4>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/#">Product Control</Link>
                  </li>
                  <li className="breadcrumb-item active">Analytics</li>
                </ol>
              </div>
            </Col>
          </Row>

          <Row>

          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default AnalyticsPage;
