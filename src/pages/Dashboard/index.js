import React, { Component } from "react";
import SettingMenu from "../Shared/SettingMenu";
import { Row, Col, Button, Input, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
// Custom Scrollbar
import SimpleBar from "simplebar-react";

// import images
import servicesIcon1 from "../../assets/images/services-icon/01.png";
import servicesIcon2 from "../../assets/images/services-icon/02.png";
import servicesIcon3 from "../../assets/images/services-icon/03.png";
import servicesIcon4 from "../../assets/images/services-icon/04.png";
import user2 from "../../assets/images/users/user-2.jpg";
import user3 from "../../assets/images/users/user-3.jpg";
import user4 from "../../assets/images/users/user-4.jpg";
import user5 from "../../assets/images/users/user-5.jpg";
import user6 from "../../assets/images/users/user-6.jpg";
import smimg1 from "../../assets/images/small/img-1.jpg";
import smimg2 from "../../assets/images/small/img-2.jpg";

import "chartist/dist/scss/chartist.scss";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div className="container-fluid">
          <Row className="align-items-center">
            <Col sm={6}>
              <div className="page-title-box">
                <h4 className="font-size-18">Dashboard</h4>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item active">
                    Welcome to your Dashboard
                  </li>
                </ol>
              </div>
            </Col>
          </Row>

          <Row>
            <Col xl={3} md={6}>
              <Card className="mini-stat bg-primary text-white">
                <CardBody>
                  <div className="mb-4">
                    <div className="float-left mini-stat-img mr-4">
                      <img src={servicesIcon1} alt="" />
                    </div>
                    <h5 className="font-size-16 text-uppercase mt-0 text-white-50">
                      Tasks
                    </h5>
                    <h4 className="font-weight-medium font-size-16">
                      1,685{" "} Tasks
                    </h4>
                  </div>
                  <div className="pt-2">
                    <div className="float-right">
                      <Link to="#" className="text-white-50">
                        <i className="mdi mdi-arrow-right h5"></i>
                      </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
			<Col xl={3} md={6}>
              <Card className="mini-stat bg-primary text-white">
                <CardBody>
                  <div className="mb-4">
                    <div className="float-left mini-stat-img mr-4">
                      <img src={servicesIcon1} alt="" />
                    </div>
                    <h5 className="font-size-16 text-uppercase mt-0 text-white-50">
                      Commitments
                    </h5>
                    <h4 className="font-weight-medium font-size-16">
                      1,685{" "} Tasks
                    </h4>
                  </div>
                  <div className="pt-2">
                    <div className="float-right">
                      <Link to="#" className="text-white-50">
                        <i className="mdi mdi-arrow-right h5"></i>
                      </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
			<Col xl={3} md={6}>
              <Card className="mini-stat bg-primary text-white">
                <CardBody>
                  <div className="mb-4">
                    <div className="float-left mini-stat-img mr-4">
                      <img src={servicesIcon1} alt="" />
                    </div>
                    <h5 className="font-size-16 text-uppercase mt-0 text-white-50">
                      Analytics
                    </h5>
                    <h4 className="font-weight-medium font-size-16">
                      23%{" "} PPC
                    </h4>
                  </div>
                  <div className="pt-2">
                    <div className="float-right">
                      <Link to="#" className="text-white-50">
                        <i className="mdi mdi-arrow-right h5"></i>
                      </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
			<Col xl={3} md={6}>
              <Card className="mini-stat bg-primary text-white">
                <CardBody>
                  <div className="mb-4">
                    <div className="float-left mini-stat-img mr-4">
                      <img src={servicesIcon1} alt="" />
                    </div>
                    <h5 className="font-size-16 text-uppercase mt-0 text-white-50">
                      Members
                    </h5>
                    <h4 className="font-weight-medium font-size-16">
                      125{" "} Members
                    </h4>
                  </div>
                  <div className="pt-2">
                    <div className="float-right">
                      <Link to="#" className="text-white-50">
                        <i className="mdi mdi-arrow-right h5"></i>
                      </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>            
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;
