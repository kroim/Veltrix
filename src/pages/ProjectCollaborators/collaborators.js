import React, { Component } from "react";
import SettingMenu from "../Shared/SettingMenu";
import { Row, Col, Card, CardBody, Input, Label, Button } from "reactstrap";
import { Link } from "react-router-dom";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

class CollaboratorsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addingTeam: false,
      teams: [
        { name: 'Construction', abrv: 'Con', handle: 'construction', planning: 'Daily' },
        { name: 'Design', abrv: 'Des', handle: 'design', planning: 'Weekly' },
        { name: 'Engineering', abrv: 'Eng', handle: 'engineering', planning: 'Weekly' }
      ],
      addingMember: false,
      teamMembers: [
        { first_name: 'Mark', last_name: 'Otto', abrv: 'M01', handle: 'motto', email: 'test@email.com' },
        { first_name: 'Jocob', last_name: 'Thorntom', abrv: 'JT1', handle: 'motto', email: 'test@email.com' },
        { first_name: 'Larry', last_name: 'Bird', abrv: 'LB1', handle: 'motto', email: 'test@email.com' },
      ],
      currentTeam: 0,
      associations: [
        { team_name: 'Construction', member_name: 'Mark Otto', role: 'Administrator' },
        { team_name: 'Construction', member_name: 'Mark Otto', role: 'Member' },
        { team_name: 'Construction', member_name: 'Mark Otto', role: 'Member' }
      ]
    };
  }

  componentDidMount() {}

  validateEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
  }

  addTeam=() => {
    const { teams } = this.state;
    let newTeams = teams;
    let team_name_text = document.getElementById('team_name').value;
    let team_abrv_text = document.getElementById('team_abrv').value;
    let team_handle_text = document.getElementById('team_handle').value;
    let team_planning_text = document.getElementById('team_planning').value;

    if(team_name_text.trim().length && team_abrv_text.trim().length && team_handle_text.trim().length && team_planning_text.trim().length){
      newTeams.push({
        name: team_name_text, 
        abrv: team_abrv_text,
        handle: team_handle_text,
        planning: team_planning_text
      });
      this.setState({addingTeam: false, teams: newTeams});
    }
  }

  addTeamMember=() => {
    const { teamMembers } = this.state;
    let newTeamMembers = teamMembers;
    let member_first_name_text = document.getElementById('member_first_name').value;
    let member_last_name_text = document.getElementById('member_last_name').value;
    let member_abrv_text = document.getElementById('member_abrv').value;
    let member_handle_text = document.getElementById('member_handle').value;
    let member_email_text = document.getElementById('member_email').value;

    if(member_first_name_text.trim().length && member_last_name_text.trim().length && member_abrv_text.trim().length && member_handle_text.trim().length && member_email_text.trim().length  && this.validateEmail(member_email_text.trim())){
      newTeamMembers.push({
        first_name: member_first_name_text, 
        last_name: member_last_name_text, 
        abrv: member_abrv_text,
        handle: member_handle_text,
        email: member_email_text
      });
      this.setState({addingMember: false, teamMembers: newTeamMembers});
    }
  }

  render() {
    const { addingTeam, teams, addingMember, teamMembers, associations } = this.state;
    return (
      <React.Fragment>
        <div className="container-fluid">
          <Row className="align-items-center">
            <Col sm={6}>
              <div className="page-title-box">
                <h4 className="font-size-18">Project Collaborators</h4>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/#">Project Collaborators</Link>
                  </li>
                  <li className="breadcrumb-item active">Collaborators</li>
                </ol>
              </div>
            </Col>

            <Col sm={6}>
              <div className="float-right d-none d-md-block">
                <SettingMenu />
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

                      {!addingTeam?
                        <div className="float-right  mt-4">
                          <Button
                              color="primary"
                              className="btn btn-primary waves-effect waves-light"
                              onClick={()=>this.setState({addingTeam: true})}
                            >
                            Add +
                          </Button>
                        </div>
                      :
                      <div className="mt-4">
                      <Row  className="align-items-end">
                        <Col lg="3" className="form-group">
                          <Label for="name">Team Name</Label>
                          <Input
                            ref={(r) => this.team_name=r}
                            type="text"
                            id="team_name"
                            name="team_name"
                          />
                        </Col>
                        <Col lg="3" className="form-group">
                          <Label for="handle">Abrv.</Label>
                          <Input 
                            ref={(r) => this.team_abrv=r}
                            type="text" 
                            id="team_abrv" 
                            name="team_abrv"
                            />
                        </Col>
                        <Col lg="3" className="form-group">
                          <Label for="handle">Handle</Label>
                          <Input 
                            ref={(r) => this.team_handle=r}
                            type="text" 
                            id="team_handle" 
                            name="team_handle"
                            />
                        </Col>
                        <Col lg="3" className="form-group">
                          <Label for="handle">Planngin Horizon</Label>
                          <Input 
                            ref={(r) => this.team_planning=r}
                            type="text" 
                            id="team_planning" 
                            name="team_planning"
                            />
                        </Col>
                      </Row>
                      <div class="float-right d-flex">
                          <Button
                            onClick={this.addTeam}
                            color="primary"
                            className="mx-2"
                            style={{ width: "100%" }}
                          >
                            {" "}
                            AddTeam{" "}
                          </Button>
                          <Button
                            onClick={()=>this.setState({addingTeam: false})}
                            color="secondary"
                            style={{ width: "100%" }}
                          >
                            {" "}
                            Close{" "}
                          </Button>
                      </div>
                      </div>
                      }

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

                        {!addingMember?
                          <div className="float-right  mt-4">
                            <Button
                                color="primary"
                                className="btn btn-primary waves-effect waves-light"
                                onClick={()=>this.setState({addingMember: true})}
                              >
                              Add +
                            </Button>
                          </div>
                        :
                        <div className="mt-4">
                        <Row  className="align-items-end">
                          <Col lg="2" className="form-group">
                            <Label for="name">First Name</Label>
                            <Input
                              ref={(r) => this.member_first_name=r}
                              type="text"
                              id="member_first_name"
                              name="member_first_name"
                            />
                          </Col>
                          <Col lg="2" className="form-group">
                            <Label for="name">First Name</Label>
                            <Input
                              ref={(r) => this.member_last_name=r}
                              type="text"
                              id="member_last_name"
                              name="member_last_name"
                            />
                          </Col>
                          <Col lg="2" className="form-group">
                            <Label for="handle">Abrv.</Label>
                            <Input 
                              ref={(r) => this.member_abrv=r}
                              type="text" 
                              id="member_abrv" 
                              name="member_abrv"
                              />
                          </Col>
                          <Col lg="3" className="form-group">
                            <Label for="handle">Handle</Label>
                            <Input 
                              ref={(r) => this.member_handle=r}
                              type="text" 
                              id="member_handle" 
                              name="member_handle"
                              />
                          </Col>
                          <Col lg="3" className="form-group">
                            <Label for="handle">Email</Label>
                            <Input 
                              ref={(r) => this.member_email=r}
                              type="email" 
                              id="member_email" 
                              name="member_email"
                              />
                          </Col>
                        </Row>
                        <div class="float-right d-flex">
                          <Button
                            onClick={this.addTeamMember}
                            color="primary"
                            className="mx-2"
                            style={{ width: "100%" }}
                          >
                            {" "}
                            AddMember{" "}
                          </Button>
                          <Button
                            onClick={()=>this.setState({addingMember: false})}
                            color="secondary"
                            style={{ width: "100%" }}
                          >
                            {" "}
                            Close{" "}
                          </Button>
                      </div>
                      </div>
                      }

                    </div>
                  </div>
                  </Col>
                </Row>
            </Col>


            {/* Team Member Association*/}

            <Col sm={6}>
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Team Memeber Association Tags</h4>

                  <div className="table-responsive">
                    <table className="table table-striped mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Team</th>
                          <th>Member</th>
                          <th>Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          associations.map((item, index) => (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <td>{item.team_name}</td>
                              <td>{item.member_name}</td>
                              <td>{item.role}</td>
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

export default CollaboratorsPage;
