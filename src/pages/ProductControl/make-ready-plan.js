import React, { Component } from "react";
import {Row, Col, Button, Modal} from "reactstrap";
import { Link } from "react-router-dom";
import Project from "./components/project";
import Plan from "./components/plan";
import {getBackendAPI} from "../../helpers/backend";
import {connect} from "react-redux";
import {setEnableAdding as setEnableAddingAction} from "../../store/projects/actions";
import { toast } from 'react-toastify';

class MakeReadyPlanPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newProject: null,
      projects: [],
      selectProject: null,
      newPlan: null,
      plans: [],
      openPassConfirmDlg: false,
      isEnablingAddProjects: false,
      toggleLock: null,
      togglePlanLock: null,
    };
  }

  componentDidMount() {
    this.init();
  }

  init = async () => {
    const projects = await getBackendAPI().getProjects();
    this.setState({projects});
  }

  addNewProject = () => {
    if(this.props.isEnabledAdding){
      const newProject = {_id: null, name: '', description: '', created_by_id: this.props.user._id, is_locked: false};
      this.setState({newProject: newProject})
    } else {
      this.setState({isEnablingAddProjects: true});
      this.onConfirmPassword();
    }
  }

  onDuplicateProject = (_id) => {
    const project = this.state.projects.find(p => p._id === _id);
    if(project){
      const newProject = {...project, _id: null};
      this.setState({newProject});
    }
  }

  onDeleteProject = (_id) => {
    const projects = this.state.projects.filter(p => p._id !== _id);
    if(this.state.selectProject._id === _id){
      this.setState({projects, selectProject: null});
    } else {
      this.setState({projects});
    }
  }

  onSaveProject = (project) => {
    const old = this.state.projects.find(p => p._id === project._id);
    if(old){
      const newProjects = this.state.projects.map(p => p._id === project._id?project:p);
      this.setState({projects: newProjects});
    } else {
      this.setState({projects: [...this.state.projects, project]});
    }
  }

  addNewPlan = () => {
    const newPlan = {_id: null, name: '', description: '', created_by: '', teams: '', packages: '', locations: '', created_by_id: this.props.user._id, is_locked: false};
    this.setState({newPlan})
  }

  onDuplicatePlan = (_id) => {
    const plan = this.state.plans.find(p => p._id === _id);
    if(plan){
      const newPlan = {...plan, _id: null};
      this.setState({newPlan});
    }
  }

  onDeletePlan = (_id) => {
    const plans = this.state.plans.filter(p => p._id !== _id);
    this.setState({plans});
  }

  onSavePlan = (plan) => {
    const old = this.state.plans.find(p => p._id === plan._id);
    let newPlans = [];
    if(old){
      newPlans = this.state.plans.map(p => p._id === plan._id?plan:p);
    } else {
      newPlans = [...this.state.plans, plan]
    }

    if(this.state.selectProject){
      this.setState({plans: newPlans, projects: this.state.projects.map(p => p._id === this.state.selectProject._id?{...p, plans: newPlans}:p)});
    }
  }

  onSelect = (project) => {
    this.setState({selectProject: project, plans: project.plans??[]});
  }


  onConfirmPassword = () => {
    this.setState({openPassConfirmDlg: true});
  }

  confirmPassword = async () => {
    const {user} = this.props;
    let password = document.getElementById('password').value;
    try {
      const res = await getBackendAPI().checkSysPass({password: password});
      this.setState({openPassConfirmDlg: false});
      console.log('success', res);
      if(res.success){
        if(this.state.isEnablingAddProjects){
          this.props.setEnableAdding(true);
        } else if(this.state.toggleLock){
          await this.onLockProject();
        } else if(this.state.togglePlanLock){
          await this.onLockPlan();
        }
        this.setState({openPassConfirmDlg: false, isEnablingAddProjects: false});
      } else {
        toast.error("Password is not invalid!", {hideProgressBar: true});
      }
    } catch (e) {
      toast.error("Password is not invalid!", {hideProgressBar: true});
    }
  }

  onToggleLock = (project) => {
    this.setState({toggleLock: project});
    this.onConfirmPassword();
  }

  onTogglePlanLock = (plan) => {
    this.setState({togglePlanLock: plan});
    this.onConfirmPassword();
  }

  onLockProject = async () => {
    if(!this.state.toggleLock) return;
    try {
      const newProject = await getBackendAPI().updateProject({...this.state.toggleLock});
      this.onSaveProject(newProject);
    } catch (e) {
    }
    this.setState({openPassConfirmDlg: false, toggleLock: null});
  }

  onLockPlan = async () => {
    if(!this.state.togglePlanLock) return;
    try {
      const newPlan = await getBackendAPI().updatePlan({...this.state.togglePlanLock});
      this.onSavePlan(newPlan);
    } catch (e) {
    }
    this.setState({openPassConfirmDlg: false, toggleLock: null});
  }

  render() {
    const {isEnabledAdding, user} = this.props;
    const {projects, plans, newProject, newPlan, selectProject} = this.state;
    const canEdit = selectProject && (user._id === selectProject.created_by_id || user.role === 'admin');

    return (
      <React.Fragment>
        <div className="container-fluid page-projects">
          <Row className="align-items-center">
            <Col sm={6}>
              <div className="page-title-box">
                <h4 className="font-size-18">Visual Planner</h4>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/#">Production Control</Link>
                  </li>
                  <li className="breadcrumb-item active">Visual Planner</li>
                </ol>
              </div>
            </Col>
          </Row>

          <div className="page-content">
            <Row className="section-projects">
              <Col sm={12}>
                <div className="section-title">Sub Project</div>
                <Button
                    color="primary"
                    className={(isEnabledAdding?'btn-primary':'btn-secondary') + " btn waves-effect waves-light"}
                    onClick={this.addNewProject}
                >
                  Add a new Sub Project
                </Button>
                <div className="projects-container">
                  {
                    newProject?
                        <Project
                            key={'new'}
                            project={newProject}
                            onDelete={() => this.setState({newProject: null})}
                            onSave={(p) => {
                              this.setState({newProject: null});
                              this.onSaveProject(p);
                            }}
                        />
                      : null
                  }
                  {
                    projects.map(p =>
                        <Project
                          key={p._id}
                          project={p}
                          isLocked={p.is_locked}
                          isSelected={selectProject && p._id === selectProject._id}
                          onSelect={() => this.onSelect(p)}
                          onDelete={() => this.onDeleteProject(p._id)}
                          onDuplicate={() => this.onDuplicateProject(p._id)}
                          onSave={(p) => this.onSaveProject(p)}
                          onToggleLock={(p) => this.onToggleLock(p)}
                        />)
                  }
                </div>
              </Col>
            </Row>
            {
              selectProject?
                <Row className="section-phase">
                  <Col sm={12}>
                    <Button
                        color="primary"
                        className={(canEdit?'btn-primary ':'btn-secondary ') + "btn waves-effect waves-light"}
                        disabled={!canEdit}
                        onClick={this.addNewPlan}
                    >
                      Add a new Phase Plan
                    </Button>
                    <div className="plans-container">
                      {
                        newPlan?
                            <Plan
                                key={'new'}
                                projectId={selectProject._id}
                                plan={newPlan}
                                onDelete={() => this.setState({newPlan: null})}
                                onSave={(p) => {
                                  this.setState({newPlan: null});
                                  this.onSavePlan(p);
                                }}
                            />
                            : null
                      }
                      {
                        plans.map(p =>
                            <Plan
                              key={p._id}
                              projectId={selectProject._id}
                              plan={p}
                              isLocked={p.is_locked}
                              onDelete={() => this.onDeletePlan(p._id)}
                              onDuplicate={() => this.onDuplicatePlan(p._id)}
                              onSave={(p) => this.onSavePlan(p)}
                              onToggleLock={(p) => this.onTogglePlanLock(p)}
                        />)
                      }
                    </div>
                  </Col>
                </Row>
                  :null
            }
          </div>

          <Modal
              isOpen={this.state.openPassConfirmDlg}
              toggle={() => this.setState({openPassConfirmDlg: !this.state.openPassConfirmDlg, isEnablingAddProjects: false, isEnablingLock: false })}
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="myModalLabel">
                Confirm System Password
              </h5>
              <button
                  type="button"
                  onClick={() =>
                      this.setState({ openPassConfirmDlg: false })
                  }
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter system password"
              />
            </div>
            <div className="modal-footer">
              <button
                  type="button"
                  className="btn btn-primary waves-effect waves-light"
                  onClick={this.confirmPassword}
              >
                Confirm
              </button>
            </div>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.Login.user,
    isEnabledAdding: state.Projects.isEnabledAdding
  }
}

const mapDispatchToProps = dispatch => ({
  setEnableAdding: (enable) => dispatch(setEnableAddingAction(enable)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MakeReadyPlanPage);
