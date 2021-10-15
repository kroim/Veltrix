import React, {Component} from "react";
import {Button, Col, Input, Label, Modal, Row} from "reactstrap";
import {Link} from "react-router-dom";
import Board from 'react-trello';
import {MovableCardWrapper} from 'react-trello/dist/styles/Base';

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {getBackendAPI} from "../../helpers/backend";
import {connect} from "react-redux";
import '../../css/common.css';

const ConstraintCard = (
    {
        onClick,
        onChange,
        id,
        constraint,
        email,
        team,
        work_package,
        check_list,
        checked_list,
        comments,
        status
    }) => {
    const onUpdateEvent = (id, checked_list) => {
        onChange({id: id, checked_list: checked_list});
    }

    return (
        <MovableCardWrapper

        >
            <header
                style={{
                    borderBottom: '1px solid #eee',
                    paddingBottom: 6,
                    marginBottom: 10,
                    display: 'flex',
                    color: '#111',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                <div style={{fontSize: 14, fontWeight: 'bold'}}>{constraint}</div>
                <i className={"fas fa-edit"} onClick={onClick}/>
            </header>
            <div style={{padding: '5px 0px', color: '#111'}}>
                {email}
            </div>
            <div style={{padding: '5px 0px', color: '#111'}}>
                Team: {team}
            </div>
            <div style={{padding: '5px 0px', color: '#111'}}>
                Work Package: {work_package}
            </div>
            <div style={{padding: '5px 0px', color: '#111'}}>
                {check_list.map((item, index) => (
                        <div className="custom-control custom-checkbox" key={index}>
                            <input type="checkbox" className="custom-control-input" id={"checkbox" + id + "_" + index} value={item} defaultChecked={checked_list.includes(item)} onClick={e => {
                                if (checked_list.includes(item)) {
                                    let idx = checked_list.indexOf(item);
                                    if (idx > -1) {
                                        checked_list.splice(idx, 1);
                                        onUpdateEvent(id, checked_list);
                                    }
                                } else {
                                    checked_list.push(item);
                                    onUpdateEvent(id, checked_list);
                                }
                            }}/>
                            <label className="custom-control-label" htmlFor={"checkbox" + id + "_" + index}>{item}</label>
                        </div>
                    )
                )}
            </div>
            <div style={{padding: '5px 0px', color: '#111'}}>
                {comments.length}
            </div>
        </MovableCardWrapper>
    )
}


class ConstraintsLogPage extends Component {
    constructor(props) {
        super(props);
        this.data = {lanes: [{id: 'loading', title: 'loading..', cards: []}]};
        this.state = {
            teams: [],
            workPackages: [],
            addConstraintModal: false,
            editConstraintModal: false,
            eventBus: undefined,
            selected_card: undefined,
            comment_request: false,
            checklist_request: false,
            update_request: false,
        };
        this.addConstraintModalHandler = this.addConstraintModalHandler.bind(this);
        this.editConstraintModalHandler = this.editConstraintModalHandler.bind(this);
        this.init();
    }

    componentDidMount() {
    }

    setEventBus = handle => {
        this.setState({
            eventBus: handle
        })
    }

    init = async () => {
        let teams = await getBackendAPI().getTeams();
        let attributes = await getBackendAPI().allProjectAttributes();
        let workPackages = attributes.filter(item => item.attribute_name === 'Work Package');
        this.setState({
            teams: teams,
            workPackages: workPackages,
        });
        let all_constraints = await getBackendAPI().getAllConstraints();
        let lane1 = [];
        let lane2 = [];
        let lane3 = [];
        let lane4 = [];
        all_constraints.forEach((item) => {
            let data = {
                id: item._id,
                constraint: item.constraint,
                email: item.user.email,
                team: item.team_info.name,
                work_package: item.work_package_info.tag_name,
                check_list: item.check_list.split(","),
                checked_list: item.checked_list.split(","),
                comments: item.comments,
                status: item.status,
                metadata: {id: item._id}
            };
            switch (item.status) {
                case 1:
                    lane1.push(data);
                    break;
                case 2:
                    lane2.push(data);
                    break;
                case 3:
                    lane3.push(data);
                    break;
                case 4:
                    lane4.push(data);
                    break;
                default:
                    lane1.push(data);
                    break;
            }
        });

        let boardData = {
            lanes: [
                {
                    id: 'constraint',
                    title: 'Constraint',
                    label: lane1.length.toString(),
                    currentPage: 1,
                    cards: lane1,
                    style: {color: "white", width: "24%", minWidth: "270px"},
                },
                {
                    id: 'work_in_progress',
                    title: 'Work In Progress',
                    label: lane2.length.toString(),
                    currentPage: 1,
                    cards: lane2,
                    style: {color: "white", width: "24%", minWidth: "270px"},
                },
                {
                    id: 'blocked',
                    title: 'Blocked',
                    label: lane3.length.toString(),
                    currentPage: 1,
                    cards: lane3,
                    style: {color: "white", width: "24%", minWidth: "270px"},
                }, {
                    id: 'completed',
                    title: 'Completed',
                    label: lane4.length.toString(),
                    currentPage: 1,
                    cards: lane4,
                    style: {color: "white", width: "24%", minWidth: "270px"},
                }
            ]
        }
        this.data = boardData;
        this.setState({
            teams: teams,
            workPackages: workPackages,

        });
    }

    removeBodyCss() {
        document.body.classList.add("no_padding");
    }

    addConstraintModalHandler() {
        this.setState(prevState => ({
            addConstraintModal: !prevState.addConstraintModal
        }));
        this.removeBodyCss();
    }

    editConstraintModalHandler() {
        this.setState(prevState => ({
            editConstraintModal: !prevState.editConstraintModal
        }));
        this.removeBodyCss();
    }

    addConstraint = () => {
        let constraint = document.getElementById('constraint').value.trim();
        let team = document.getElementById("team").value.trim();
        let workPackage = document.getElementById("work_package").value.trim();
        let checklist = document.getElementById("checklist").value.trim();
        if (constraint.length && team.length && workPackage.length) {
            try {
                getBackendAPI().addConstraint(constraint, this.props.user._id, team, workPackage, checklist, 1).then((new_constraint) => {
                    let item = {
                        id: new_constraint._id,
                        constraint: new_constraint.constraint,
                        email: new_constraint.user.email,
                        team: new_constraint.team_info.name,
                        work_package: new_constraint.work_package_info.tag_name,
                        check_list: checklist === "" ? [] : new_constraint.check_list.split(","),
                        checked_list: new_constraint.checked_list.split(","),
                        comments: new_constraint.comments,
                        status: new_constraint.status,
                        metadata: {id: new_constraint._id},
                        laneId: "constraint"
                    };
                    this.setState({
                        addConstraintModal: false,
                    });
                    this.data.lanes[0].cards.push(item);
                    this.state.eventBus.publish({type: 'ADD_CARD', laneId: 'constraint', card: item});
                    this.state.eventBus.publish({
                        type: 'UPDATE_LANES',
                        lanes: this.data.lanes.map((lane) => {
                            return {...lane, label: lane.cards.length.toString()}
                        })
                    });
                })

            } catch (e) {

            }
        }
    }

    onCardMoveAcrossLanes = async (fromLaneId, toLaneId, cardId, addedIndex) => {
        let sourceID = this.getStatusValue(fromLaneId);
        let targetID = this.getStatusValue(toLaneId);
        try {
            getBackendAPI().updateConstraintsPosition({_id: cardId, target: targetID, source: sourceID, user_id: this.props.user._id}).then((res) => {
                let sourceLane = this.data.lanes.find((item) => item.id === fromLaneId);
                let targetLane = this.data.lanes.find((item) => item.id === toLaneId);
                let sourceLaneIndex = this.data.lanes.indexOf(sourceLane);
                let targetLaneIndex = this.data.lanes.indexOf(targetLane);
                let targetCard = this.data.lanes[sourceLaneIndex].cards.find(item => item.id === cardId);
                targetCard.laneId = toLaneId;
                this.data.lanes[sourceLaneIndex].cards = this.data.lanes[sourceLaneIndex].cards.filter(item => item.id !== cardId)
                this.data.lanes[targetLaneIndex].cards.splice(addedIndex, 0, targetCard);
                this.state.eventBus.publish({
                    type: 'UPDATE_LANES',
                    lanes: this.data.lanes.map((lane) => {
                        return {...lane, label: lane.cards.length.toString()}
                    })
                });
            });

        } catch (e) {
        }
    }

    getStatusValue = value => {
        switch (value) {
            case "constraint":
                return 1;
            case "work_in_progress":
                return 2;
            case "blocked":
                return 3;
            case "completed":
                return 4;
            default:
                return 1;
        }
    }

    cardEditHandler = (laneId, cardId) => {
        let targetLane = this.data.lanes.find((item) => item.id === laneId);
        if (targetLane === undefined) return;
        let targetCard = targetLane.cards.find((item) => item.id === cardId);
        this.setState({
            selected_card: targetCard,
        })
        this.editConstraintModalHandler();
    }

    addComment = () => {
        if (this.state.selected_card === undefined) return;
        if (this.state.comment_request) return;
        let comment = document.getElementById('add_comment_text').value.trim();
        if (comment.length) {
            this.setState({
                comment_request: true
            });
            try {
                getBackendAPI().addComment(comment, this.props.user._id, this.state.selected_card.id).then((new_comment) => {
                    document.getElementById('add_comment_text').value = "";
                    this.state.selected_card.comments = [new_comment].concat(this.state.selected_card.comments);
                    this.setState({
                        comment_request: false
                    });
                });
            } catch (e) {
                this.setState({
                    comment_request: false
                });
            }

        }
    }

    addCheckList = () => {
        if (this.state.selected_card === undefined) return;
        if (this.state.checklist_request) return;
        let check = document.getElementById('add_checklist_text').value.trim();
        if (check.length) {
            let current_checkList = this.state.selected_card.check_list;
            current_checkList.push(check);
            this.setState({
                checklist_request: true
            });
            try {
                getBackendAPI().addCheckList(current_checkList.join(), this.state.selected_card.id).then((res) => {
                    document.getElementById('add_checklist_text').value = "";
                    const {selected_card} = this.state;
                    selected_card.check_list = current_checkList;
                    this.setState({
                        checklist_request: false,
                        selected_card
                    });
                });
            } catch (e) {
                this.setState({
                    checklist_request: false
                });
            }
        }
    }

    updateConstraintInfo = () => {
        if (this.state.selected_card === undefined) return;
        if (this.state.update_request) return;
        let title = document.getElementById('edit_constraint').value.trim();
        if (title.length && title !== this.state.selected_card.constraint) {
            this.setState({
                update_request: true,
                editConstraintModal: false
            });
            try {
                getBackendAPI().updateConstraint(this.state.selected_card.id, title).then((res) => {
                    const {selected_card} = this.state;
                    selected_card.constraint = title;
                    this.setState({
                        update_request: false,
                        selected_card
                    });
                })
            } catch (e) {
                this.setState({
                    update_request: false
                });
            }
        }
    }

    checkboxUpdateHandler = (card_id, card) => {
        let current_checked = card.checked_list.filter(item => item !== undefined && item !== "");
        try {
            getBackendAPI().updateConstraintContent(card.id, current_checked.join());
        } catch (e) {

        }
    }

    render() {
        const {teams, workPackages} = this.state;
        return (
            <React.Fragment>
                <div className="container-fluid">
                    <Row className="align-items-center">
                        <Col sm={6}>
                            <div className="page-title-box">
                                <h4 className="font-size-18">Constraints Log</h4>
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to="/#">Product Control</Link>
                                    </li>
                                    <li className="breadcrumb-item active">Constraints Log</li>
                                </ol>
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className="float-right d-none d-md-block">
                                <Button type="button"
                                        color="primary"
                                        className="btn btn-primary waves-effect waves-light"
                                        onClick={this.addConstraintModalHandler}
                                        data-toggle="modal"
                                        data-target=".bs-example-modal-lg .bs-example-modal-center">
                                    Add Constraint
                                </Button>
                                <Modal
                                    className="modal-lg modal-dialog-centered"
                                    isOpen={this.state.addConstraintModal}
                                    toggle={this.addConstraintModalHandler}
                                >
                                    <div className="modal-header">
                                        <h5
                                            className="modal-title mt-0"
                                            id="add_team_modal"
                                        >
                                            Add Constraint
                                        </h5>
                                        <button
                                            onClick={() =>
                                                this.setState({addConstraintModal: false})
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
                                                <Col lg="12" className="form-group">
                                                    <Label for="constraint">Constraint</Label>
                                                    <Input
                                                        ref={(r) => this.constraint = r}
                                                        type="text"
                                                        id="constraint"
                                                        name="constraint"
                                                    />
                                                </Col>
                                                <Col lg="12" className="form-group">
                                                    <Label for="team">Team</Label>
                                                    <select id="team" name="team" className="form-control">
                                                        {teams.map(item => (
                                                            <option key={item._id} value={item._id}>{item.name}</option>
                                                        ))}
                                                    </select>
                                                </Col>
                                                <Col lg="12" className="form-group">
                                                    <Label for="work_package">workPackages</Label>
                                                    <select id="work_package" name="work_package" className="form-control">
                                                        {workPackages.map(item => (
                                                            <option key={item._id} value={item._id}>{item.tag_name}</option>
                                                        ))}
                                                    </select>
                                                </Col>
                                                <Col lg="12" className="form-group">
                                                    <Label for="checklist">Checklist</Label>
                                                    <Input
                                                        ref={(r) => this.checklist = r}
                                                        type="text"
                                                        id="checklist"
                                                        name="checklist"
                                                    />
                                                </Col>
                                            </Row>
                                        </div>

                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={this.addConstraint}
                                        >
                                            Add
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() =>
                                                this.setState({addConstraintModal: false})
                                            }
                                        >
                                            Close
                                        </button>
                                    </div>
                                </Modal>
                                <Modal
                                    className="modal-lg modal-dialog-centered"
                                    isOpen={this.state.editConstraintModal}
                                    toggle={this.editConstraintModalHandler}
                                >
                                    <div className="modal-header">
                                        <h5
                                            className="modal-title mt-0"
                                            id="add_team_modal"
                                        >
                                            Edit Constraint
                                        </h5>
                                        <button
                                            onClick={() =>
                                                this.setState({editConstraintModal: false})
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
                                        {this.state.selected_card !== undefined ? <div className="mt-4">
                                            <Row className="align-items-end">
                                                <Col lg="12" className="form-group">
                                                    <Label for="constraint">Constraint</Label>
                                                    <Input
                                                        ref={(r) => this.edit_constraint = r}
                                                        type="text"
                                                        id="edit_constraint"
                                                        name="edit_constraint"
                                                        defaultValue={this.state.selected_card.constraint}
                                                    />
                                                </Col>
                                                <Col lg="12" className="form-group">
                                                    <Label for="checklist">Checklist</Label>
                                                    {
                                                        this.state.selected_card.check_list.map((item, index) => (
                                                            <div className="custom-control custom-checkbox" key={index}>
                                                                <input type="checkbox" className="custom-control-input" id={"edit_checkbox" + this.state.selected_card.id + "_" + index} defaultChecked={this.state.selected_card.checked_list.includes(item)} readOnly={true} disabled={true}/>
                                                                <label className="custom-control-label" htmlFor={"edit_checkbox" + this.state.selected_card.id + "_" + index}>{item}</label>
                                                            </div>
                                                        ))
                                                    }
                                                </Col>
                                                <Col md="10" className="form-group">
                                                    <Input
                                                        id="add_checklist_text"
                                                        name="add_checklist_text"
                                                        type="text"
                                                        className="inner form-control"
                                                        placeholder="Enter the checklist name"
                                                    />
                                                </Col>
                                                <Col md="2" className="form-group">
                                                    <Button
                                                        onClick={this.addCheckList}
                                                        color="primary"
                                                        className="btn-block inner"
                                                        style={{width: "100%"}}
                                                    >
                                                        {" "}
                                                        Add{" "}
                                                    </Button>
                                                </Col>
                                                <Col md="10" className="form-group">
                                                    <Label for="constraint">Add Comment:</Label>
                                                    <Input
                                                        id="add_comment_text"
                                                        name="add_comment_text"
                                                        type="text"
                                                        className="inner form-control"
                                                        placeholder="Enter the Comment"
                                                    />
                                                </Col>
                                                <Col md="2" className="form-group">
                                                    <Button
                                                        onClick={this.addComment}
                                                        color="primary"
                                                        className="btn-block inner"
                                                        style={{width: "100%"}}
                                                    >
                                                        {" "}
                                                        Add{" "}
                                                    </Button>
                                                </Col>
                                                <Col lg="12" className="form-group">
                                                    <Label for="constraint">Comments:</Label>
                                                    {this.state.selected_card.comments.map((item, index) => (
                                                        <div key={index} className="mb-2">
                                                            <div className="d-flex">
                                                                <div className="flex-shrink-0">
                                                                    <i className="mdi mdi-account-circle font-size-24 align-middle mr-1"/>
                                                                </div>
                                                                <div className="flex-grow-1">
                                                                    <h4 className="font-size-15 m-0">{item.user.name}</h4>
                                                                    <small className="text-muted">{item.content}</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </Col>
                                            </Row>
                                        </div> : <div className="mt-4 text-center">Loading</div>}
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={this.updateConstraintInfo}
                                        >
                                            Update
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() =>
                                                this.setState({editConstraintModal: false})
                                            }
                                        >
                                            Close
                                        </button>
                                    </div>
                                </Modal>
                            </div>
                        </Col>
                    </Row>
                    <Board
                        data={this.data}
                        draggable
                        cardDragClass="draggingCard"
                        laneDraggable={false}
                        className="boardContainer"
                        components={{Card: ConstraintCard}}
                        onCardClick={(laneId, metadata, cardId) => this.cardEditHandler(cardId, laneId)}
                        onCardUpdate={(cardId, card) => this.checkboxUpdateHandler(cardId, card)}
                        onCardMoveAcrossLanes={this.onCardMoveAcrossLanes}
                        eventBusHandle={this.setEventBus}
                        style={{backgroundColor: "#404040", justifyContent: "center"}}
                    />
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.Login.user,
    }
}


export default connect(mapStateToProps, null)(ConstraintsLogPage);
