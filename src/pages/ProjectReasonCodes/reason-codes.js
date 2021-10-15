import React, {Component} from "react";
import {Row, Col} from "reactstrap";
import {Link} from "react-router-dom";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {getBackendAPI} from "../../helpers/backend";

class ReasonCodes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reasons: [],
        };

        this.init();
        //this.insertReasons();

    }

    init = async () => {
        let reason_codes = await getBackendAPI().getReasonCodes();
        this.setState({
            reasons: reason_codes
        });
    }

    insertReasons = async () => {
        try {
            await getBackendAPI().addReasonCodes('RC01', 'Material', 'The team did not have sufficient and/or the correct materials to complete the task.');
            await getBackendAPI().addReasonCodes('RC02', 'Labour', 'The team did not have sufficient and/or correct labour to perform the task.');
            await getBackendAPI().addReasonCodes('RC03', 'Plant', 'The team did not have sufficient and/or correct Plant to perform the task.');
            await getBackendAPI().addReasonCodes('RC04', 'Weather', 'Inclement weather prevented or slowed down progress of the task.');
            await getBackendAPI().addReasonCodes('RC05', 'Directive', 'The team decided to change their intent, instruction and / or priority and this prevented completion of the task.');
            await getBackendAPI().addReasonCodes('RC06', 'Prerequisite', 'The team were missing something (other than material, Labour or plant) which was required to complete the task.');
            await getBackendAPI().addReasonCodes('RC07', 'Site Access', 'The team couldn’t get clear/safe access to the workface.');
            await getBackendAPI().addReasonCodes('RC08', 'Information (Client)', 'The team did not receive Information required from the client, which prevented or slowed down progress of the task.');
            await getBackendAPI().addReasonCodes('RC09', 'Information (Design)', 'The team did not receive Information required from a member of the design team, which prevented or slowed down progress of the task.');
            await getBackendAPI().addReasonCodes('RC10', 'Information (Construction)', 'The team did not receive Information required from a member of the construction team, which prevented or slowed down progress of the task.');
            await getBackendAPI().addReasonCodes('RC11', 'Unforeseen site conditions', 'The actual site conditions encountered which were unable to be accurately determined before the task, were not as expected.');
            await getBackendAPI().addReasonCodes('RC12', '3rd Party Issues', 'Issues relating to others which have constrained us from completing our works.');
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        const {reasons} = this.state;
        return (
            <React.Fragment>
                <div className="container-fluid">
                    <Row className="align-items-center">
                        <Col sm={6}>
                            <div className="page-title-box">
                                <h4 className="font-size-18">Reason Codes</h4>
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to="/#">Project Attributes</Link>
                                    </li>
                                    <li className="breadcrumb-item active">Reason Codes</li>
                                </ol>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <div className="card">
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-striped mb-0">
                                            <thead>
                                            <tr>
                                                <th>Reason Code</th>
                                                <th>Description</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                reasons.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.reason}</td>
                                                        <td>{item.description}</td>
                                                    </tr>
                                                ))
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </React.Fragment>
        );
    }

}

export default ReasonCodes;
