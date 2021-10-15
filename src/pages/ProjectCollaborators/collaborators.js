import React, {Component} from "react";
import {Row, Col, Input, Label, Button, Modal, FormGroup} from "reactstrap";
import {Link} from "react-router-dom";
import {getBackendAPI} from "../../helpers/backend";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

class CollaboratorsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            teamMembers: [],
            currentTeam: 0,
            associations: [],
            currentRole: "Member",
            roles: ['Administrator', 'Member'],
            planning_horizons: ['Daily', 'Weekly'],
            addTeamModal: false,
            addMemberModal: false,
            addMemberAssociationModal: false,
        };

        //Modal instance
        this.addTeamModalHandler = this.addTeamModalHandler.bind(this);
        this.addMemberModalHandler = this.addMemberModalHandler.bind(this);
        this.addMemberAssociationModalHandler = this.addMemberAssociationModalHandler.bind(this);
        this.init();
    }

    componentDidMount() {
    }

    removeBodyCss() {
        document.body.classList.add("no_padding");
    }

    addTeamModalHandler() {
        this.setState(prevState => ({
            addTeamModal: !prevState.addTeamModal
        }));
        this.removeBodyCss();
    }

    addMemberModalHandler() {
        this.setState(prevState => ({
            addMemberModal: !prevState.addMemberModal
        }));
        this.removeBodyCss();
    }

    addMemberAssociationModalHandler() {
        this.setState(prevState => ({
            addMemberAssociationModal: !prevState.addMemberAssociationModal
        }));
        this.removeBodyCss();
    }

    init = async () => {
        let teams = await getBackendAPI().getTeams();
        console.log('teams', teams);
        let members = await getBackendAPI().getMembers();
        console.log('members', members);
        let associations = await getBackendAPI().getAssociations();
        associations = associations.sort((a, b) => {
            if (a.team.name === b.team.name) {
                return (a.member.first_name + a.member.last_name) > (b.member.first_name + b.member.last_name) ? 1 : (-1);
            }
            return a.team.name > b.team.name ? 1 : (-1);
        });
        console.log('associations', associations);
        this.setState({teams: teams, teamMembers: members, associations: associations});
    }

    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    addTeam = async () => {
        const {teams} = this.state;
        let newTeams = teams;
        let team_name_text = document.getElementById('team_name').value.trim();
        let team_abrv_text = document.getElementById('team_abrv').value.trim();
        let team_handle_text = document.getElementById('team_handle').value.trim();
        let team_planning_text = document.getElementById('team_planning').value.trim();

        if (team_name_text.trim().length && team_abrv_text.trim().length && team_handle_text.trim().length && team_planning_text.trim().length) {
            if (teams.find(team => team.name === team_name_text) || teams.find(team => team.handle === team_handle_text)) {
                return;
            }
            try {
                let team = await getBackendAPI().addTeam(team_name_text, team_abrv_text, team_handle_text, team_planning_text);
                newTeams.push(team);
                this.setState({addTeamModal: false, teams: newTeams});
            } catch (e) {

            }
        }
    }

    addTeamMember = async () => {
        const {teamMembers} = this.state;
        let newTeamMembers = teamMembers;
        let member_first_name_text = document.getElementById('member_first_name').value.trim();
        let member_last_name_text = document.getElementById('member_last_name').value.trim();
        let member_abrv_text = document.getElementById('member_abrv').value.trim();
        let member_handle_text = document.getElementById('member_handle').value.trim();
        let member_email_text = document.getElementById('member_email').value.trim();

        if (member_first_name_text.length && member_last_name_text.length && member_abrv_text.length && member_handle_text.length && member_email_text.length && this.validateEmail(member_email_text.trim())) {
            try {
                let member = await getBackendAPI().addMember(member_first_name_text, member_last_name_text, member_abrv_text, member_handle_text, member_email_text);
                newTeamMembers.push(member);
                this.setState({addMemberModal: false, teamMembers: newTeamMembers});
            } catch (e) {

            }
        }
    }


    addAssociation = async () => {
        const {associations} = this.state;
        let newAssociations = associations;
        let team_id_text = document.getElementById('team_id_select').value.trim();
        let member_id_text = document.getElementById('member_id_select').value.trim();
        let role_text = this.state.currentRole;
        console.log(role_text);
        if (team_id_text.length && member_id_text.length && role_text.length) {
            if (associations.find(a => a.team_id === team_id_text && a.member_id === member_id_text)) {
                return;
            }
            try {
                let association = await getBackendAPI().addAssociation(team_id_text, member_id_text, role_text);
                newAssociations.push(association);
                newAssociations = newAssociations.sort((a, b) => {
                    if (a.team.name === b.team.name) {
                        return (a.member.first_name + a.member.last_name) > (b.member.first_name + b.member.last_name) ? 1 : (-1);
                    }
                    return a.team.name > b.team.name ? 1 : (-1);
                });
                this.setState({addMemberAssociationModal: false, associations: newAssociations});
            } catch (e) {

            }
        }
    }


    autoGenerateHandle = (id, e) => {
        let name = e.target.value;
        let auto_gen_handle = '@' + name.toLowerCase().replace(' ', '');
        document.getElementById(id).value = auto_gen_handle;
    }

    autoGenerateMemberHandle = (id, e) => {
        const {teamMembers} = this.state;
        let name = e.target.value;
        let auto_gen_handle = '@' + name.toLowerCase().replace(' ', '');
        let same_count = 0;
        teamMembers.forEach(member => {
            if (member.first_name === name) {
                same_count++;
            }
        });
        if (same_count) {
            auto_gen_handle = `${auto_gen_handle}${same_count}`;
        }
        document.getElementById(id).value = auto_gen_handle;
    }

    onRoleChanged = (e) => {
        this.setState({
            currentRole: e.currentTarget.value
        })
    }

    render() {
        const {teams, teamMembers, associations, roles, planning_horizons} = this.state;
        return (
            <React.Fragment>
                <div className="container-fluid">
                    <Row className="align-items-center">
                        <Col sm={6}>
                            <div className="page-title-box">
                                <h4 className="font-size-18">Project Collaborators</h4>
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to="/#">Project Attributes</Link>
                                    </li>
                                    <li className="breadcrumb-item active">Collaborators</li>
                                </ol>
                            </div>
                        </Col>
                    </Row>


                    <Row>
                        <Col sm={6}>

                            {/*  Teams */}
                            <Row>
                                <Col sm={12}>
                                    <div className="card">
                                        <div className="card-body">
                                            <h4 className="card-title">Teams</h4>

                                            <div className="table-responsive">
                                                <table className="table table-striped mb-0">
                                                    <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Team Name</th>
                                                        <th>Abrv.</th>
                                                        <th>Handle</th>
                                                        <th>Planning Horizon</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        teams.map((item, index) => (
                                                            <tr key={index}>
                                                                <th scope="row">{index + 1}</th>
                                                                <td>{item.name}</td>
                                                                <td>{item.abrv}</td>
                                                                <td>{item.handle}</td>
                                                                <td>{item.planning}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>

                                            <Modal
                                                className="modal-lg modal-dialog-centered"
                                                isOpen={this.state.addTeamModal}
                                                toggle={this.addTeamModalHandler}
                                            >
                                                <div className="modal-header">
                                                    <h5
                                                        className="modal-title mt-0"
                                                        id="add_team_modal"
                                                    >
                                                        Add Team
                                                    </h5>
                                                    <button
                                                        onClick={() =>
                                                            this.setState({addTeamModal: false})
                                                        }
                                                        type="button"
                                                        className="close"
                                                        data-dismiss="modal"
                                                        aria-label="Close"
                                                    >
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="mt-4">
                                                        <Row className="align-items-end">
                                                            <Col lg="3" className="form-group">
                                                                <Label for="name">Team Name</Label>
                                                                <Input
                                                                    ref={(r) => this.team_name = r}
                                                                    type="text"
                                                                    id="team_name"
                                                                    name="team_name"
                                                                    onChange={e => this.autoGenerateHandle('team_handle', e)}
                                                                />
                                                            </Col>
                                                            <Col lg="3" className="form-group">
                                                                <Label for="handle">Abrv.</Label>
                                                                <Input
                                                                    ref={(r) => this.team_abrv = r}
                                                                    type="text"
                                                                    id="team_abrv"
                                                                    name="team_abrv"
                                                                />
                                                            </Col>
                                                            <Col lg="3" className="form-group">
                                                                <Label for="handle">Handle</Label>
                                                                <Input
                                                                    ref={(r) => this.team_handle = r}
                                                                    type="text"
                                                                    id="team_handle"
                                                                    name="team_handle"
                                                                />
                                                            </Col>
                                                            <Col lg="3" className="form-group">
                                                                <Label for="handle">Planning Horizon</Label>
                                                                <select id="team_planning" name="team_planning" className="form-control">
                                                                    {planning_horizons.map(item => (
                                                                        <option key={item} value={item}>{item}</option>
                                                                    ))}
                                                                </select>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={this.addTeam}
                                                    >
                                                        Add Team
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        onClick={() =>
                                                            this.setState({addTeamModal: false})
                                                        }
                                                    >
                                                        Close
                                                    </button>
                                                </div>
                                            </Modal>
                                            <div className="float-right mt-4">
                                                <Button
                                                    type="button"
                                                    onClick={this.addTeamModalHandler}
                                                    color="primary"
                                                    className="btn btn-primary waves-effect waves-light"
                                                    data-toggle="modal"
                                                    data-target=".bs-example-modal-lg .bs-example-modal-center"
                                                >
                                                    Add +
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            {/*  Members */}
                            <Row>
                                <Col sm={12}>
                                    <div className="card">
                                        <div className="card-body">
                                            <h4 className="card-title">Members</h4>

                                            <div className="table-responsive">
                                                <table className="table table-striped mb-0">
                                                    <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>First Name</th>
                                                        <th>Last Name</th>
                                                        <th>Abrv.</th>
                                                        <th>Handle</th>
                                                        <th>Email</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        teamMembers.map((item, index) => (
                                                            <tr key={index}>
                                                                <th scope="row">{index + 1}</th>
                                                                <td>{item.first_name}</td>
                                                                <td>{item.last_name}</td>
                                                                <td>{item.abrv}</td>
                                                                <td>{item.handle}</td>
                                                                <td>{item.email}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>
                                            <Modal
                                                className="modal-lg modal-dialog-centered"
                                                isOpen={this.state.addMemberModal}
                                                toggle={this.addMemberModalHandler}
                                            >
                                                <div className="modal-header">
                                                    <h5
                                                        className="modal-title mt-0"
                                                        id="add_member_modal"
                                                    >
                                                        Add Member
                                                    </h5>
                                                    <button
                                                        onClick={() =>
                                                            this.setState({addMemberModal: false})
                                                        }
                                                        type="button"
                                                        className="close"
                                                        data-dismiss="modal"
                                                        aria-label="Close"
                                                    >
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="mt-4">
                                                        <Row className="align-items-end">
                                                            <Col lg="2" className="form-group">
                                                                <Label for="name">First Name</Label>
                                                                <Input
                                                                    ref={(r) => this.member_first_name = r}
                                                                    type="text"
                                                                    id="member_first_name"
                                                                    name="member_first_name"
                                                                    onChange={e => this.autoGenerateMemberHandle('member_handle', e)}
                                                                />
                                                            </Col>
                                                            <Col lg="2" className="form-group">
                                                                <Label for="name">Last Name</Label>
                                                                <Input
                                                                    ref={(r) => this.member_last_name = r}
                                                                    type="text"
                                                                    id="member_last_name"
                                                                    name="member_last_name"
                                                                />
                                                            </Col>
                                                            <Col lg="2" className="form-group">
                                                                <Label for="handle">Abrv.</Label>
                                                                <Input
                                                                    ref={(r) => this.member_abrv = r}
                                                                    type="text"
                                                                    id="member_abrv"
                                                                    name="member_abrv"
                                                                />
                                                            </Col>
                                                            <Col lg="3" className="form-group">
                                                                <Label for="handle">Handle</Label>
                                                                <Input
                                                                    ref={(r) => this.member_handle = r}
                                                                    type="text"
                                                                    id="member_handle"
                                                                    name="member_handle"
                                                                />
                                                            </Col>
                                                            <Col lg="3" className="form-group">
                                                                <Label for="handle">Email</Label>
                                                                <Input
                                                                    ref={(r) => this.member_email = r}
                                                                    type="email"
                                                                    id="member_email"
                                                                    name="member_email"
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={this.addTeamMember}
                                                    >
                                                        Add Member
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        onClick={() =>
                                                            this.setState({addMemberModal: false})
                                                        }
                                                    >
                                                        Close
                                                    </button>
                                                </div>
                                            </Modal>

                                            <div className="float-right mt-4">
                                                <Button
                                                    type="button"
                                                    onClick={this.addMemberModalHandler}
                                                    color="primary"
                                                    className="btn btn-primary waves-effect waves-light"
                                                    data-toggle="modal"
                                                    data-target=".bs-example-modal-lg .bs-example-modal-center"
                                                >
                                                    Add +
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>


                        {/* Team Member Association*/}

                        <Col sm={6}>
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Team Member Association</h4>

                                    <div className="table-responsive">
                                        <table className="table table-striped mb-0">
                                            <thead>
                                            <tr>
                                                <th>Team</th>
                                                <th>Member</th>
                                                <th>Role</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                associations.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.team.name}</td>
                                                        <td>{item.member.first_name + " " + item.member.last_name}</td>
                                                        <td>{item.role}</td>
                                                    </tr>
                                                ))
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                    <Modal
                                        className="modal-lg modal-dialog-centered"
                                        isOpen={this.state.addMemberAssociationModal}
                                        toggle={this.addMemberAssociationModalHandler}
                                    >
                                        <div className="modal-header">
                                            <h5
                                                className="modal-title mt-0"
                                                id="add_member_modal"
                                            >
                                                Add Member Association
                                            </h5>
                                            <button
                                                onClick={() =>
                                                    this.setState({addMemberAssociationModal: false})
                                                }
                                                type="button"
                                                className="close"
                                                data-dismiss="modal"
                                                aria-label="Close"
                                            >
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="mt-4">
                                                <Row className="align-items-end">
                                                    <Col lg="4" className="form-group">
                                                        <Label for="name">Team</Label>
                                                        <select id="team_id_select" name="team_id_select" className="form-control">
                                                            {teams.map(item => (
                                                                <option key={item._id} value={item._id}>{item.name}</option>
                                                            ))}
                                                        </select>
                                                    </Col>
                                                    <Col lg="4" className="form-group">
                                                        <Label for="name">Member</Label>
                                                        <select id="member_id_select" name="member_id_select" className="form-control">
                                                            {teamMembers.map(item => (
                                                                <option key={item._id} value={item._id}>{item.first_name + " " + item.last_name}</option>
                                                            ))}
                                                        </select>
                                                    </Col>
                                                    <Col lg="4" className="form-group">
                                                        <Label for="handle">Role</Label>
                                                        <br/>
                                                        {
                                                            roles.map((item) => (
                                                                <div className="custom-control custom-radio" key={item}>
                                                                    <Input
                                                                        type="radio"
                                                                        id={item}
                                                                        value={item}
                                                                        checked={this.state.currentRole === item}
                                                                        name="role_text_select"
                                                                        className="custom-control-input"
                                                                        onChange={this.onRoleChanged}
                                                                    />
                                                                    <Label
                                                                        className="custom-control-label"
                                                                        for={item}
                                                                    >
                                                                        {item}
                                                                    </Label>
                                                                </div>
                                                            ))
                                                        }
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={this.addAssociation}
                                            >
                                                Add Member
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() =>
                                                    this.setState({addMemberAssociationModal: false})
                                                }
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </Modal>

                                    <div className="float-right mt-4">
                                        <Button
                                            type="button"
                                            onClick={this.addMemberAssociationModalHandler}
                                            color="primary"
                                            className="btn btn-primary waves-effect waves-light"
                                            data-toggle="modal"
                                            data-target=".bs-example-modal-lg .bs-example-modal-center"
                                        >
                                            Add +
                                        </Button>
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

export default CollaboratorsPage;
