import React, { Component } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import {Col, InputGroup, Label, Modal, Row} from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {getBackendAPI} from "../helpers/backend";
import {date_str_format, DATE_STRING_FORMAT} from "../helpers/function";

export const TASK_TYPE_MILESTONE = 'milestone';
export const TASK_TYPE_TASK = 'task';
const types = [{_id: TASK_TYPE_MILESTONE, text: 'Milestone'}, {_id: TASK_TYPE_TASK, text: 'Task'}];

export const STATUS_RELEASED = 1;
export const STATUS_RELEASED_AT_RISK = 2;
export const STATUS_CONSTRAINED = 3;
export const STATUS_COMPLETED = 4;
export const STATUS_COMPLETED_NO_PLANNED = 5;
export const STATUS_COMMITMENT_PLAN = 6;
const statusCodes = [
        {_id: STATUS_RELEASED, text: 'Released'},
        {_id: STATUS_RELEASED_AT_RISK, text: 'Released At Risk'},
        {_id: STATUS_CONSTRAINED, text: 'Constrained'},
        {_id: STATUS_COMPLETED, text: 'Completed'},
        {_id: STATUS_COMPLETED_NO_PLANNED, text: 'Completed No Planned'},
        {_id: STATUS_COMMITMENT_PLAN, text: 'Commitment Plan'}
    ];

const crewSizes = [
    {_id: 1, text: '1'},{_id: 2, text: '2'},{_id: 3, text: '3'},{_id: 4, text: '4'},{_id: 5, text: '5'},
    {_id: 6, text: '6'},{_id: 7, text: '7'},{_id: 8, text: '8'},{_id: 9, text: '9'},{_id: 10, text: '10'},
    {_id: 11, text: '11'},{_id: 12, text: '12'},{_id: 13, text: '13'},{_id: 14, text: '14'},{_id: 15, text: '15'},
    {_id: 16, text: '16'},{_id: 17, text: '17'},{_id: 18, text: '18'},{_id: 19, text: '19'},{_id: 20, text: '20'}
]

export default class Gantt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taskId: null,
            _taskId: null,
            taskText: '',
            taskType: TASK_TYPE_MILESTONE,
            taskDate: new Date(),
            taskProjectId: null,
            taskPlanId: null,
            taskWorkPackageId: null,
            taskLocationId: null,
            taskTeamId: null,
            taskStatusCode: STATUS_RELEASED,
            taskCrewSize: 1,
            taskDisciplineId: null,
            duration: 0,
            taskWBSCode: '',
            openAddDlg: false,
        };
        this.tasks = [];
        this.groups = {};
        this.init();
    }

    componentDidMount() {
    }

    init = async () => {
        const taskInfos = await getBackendAPI().getTasks();

        let groups = [];
        let priority_counter = 1;
        taskInfos.forEach((t, index) => {
            const group_key = `${t.project_id}_${t.plan_id}_${t.work_package_id}`;
            if(!this.groups[group_key]){
                this.groups[group_key] = {
                    key: group_key,
                    label: `Sub Project: ${t.project_info.name}`,
                    priority: priority_counter++,
                }
                groups.push(this.groups[group_key]);
            }
            this.tasks.push({id: index + 1, ...t, priority: this.groups[group_key].priority});
        })

        gantt.plugins({
            grouping: true
        });

        gantt.init(this.ganttContainer);
        gantt.showLightbox = this.onShowLightBox;
        const config = {
            data: this.tasks.map(t => ({id: t.id, text: t.text, end_date: new Date(t.end_date), duration: t.duration, progress: t.progress}))
        }
        gantt.attachEvent("onAfterTaskUpdate", this.onUpdateTask);
        gantt.groupBy({
            relation_property: "priority",
            groups: groups,
            group_id: "key",
            group_text: "label"
        });
        gantt.parse(config);
    }

    onShowLightBox = (id) => {
        let task = gantt.getTask(id);
        console.log('open', id, task);
        if(task.$new){
            this.setState({
                taskId: id,
                _taskId: null,
                taskType: TASK_TYPE_MILESTONE,
                taskText: '',
                taskDate: new Date(),
                taskProjectId: null,
                taskPlanId: null,
                taskWorkPackageId: null,
                taskLocationId: null,
                taskTeamId: null,
                taskStatusCode: STATUS_RELEASED,
                taskCrewSize: 1,
                taskDisciplineId: null,
                duration: 0,
                taskWBSCode: '',
                openAddDlg: true
            });
        } else {
            const targetTask = this.tasks.find(t => t.id == id);
            console.log('target task', targetTask, id, this.tasks);
            if(targetTask){
                this.setState({
                    taskId: id,
                    _taskId: targetTask._id,
                    taskType: targetTask.type,
                    taskText: task.text,
                    taskDate: new Date(task.end_date),
                    taskProjectId: targetTask.project_id,
                    taskPlanId: targetTask.plan_id,
                    taskWorkPackageId: targetTask.work_package_id,
                    taskLocationId: targetTask.location_id,
                    taskTeamId: targetTask.team_id,
                    taskStatusCode: targetTask.status_code,
                    taskCrewSize: targetTask.crew_size,
                    taskDisciplineId: targetTask.discipline_id,
                    duration: targetTask.duration,
                    taskWBSCode: targetTask.wbs_code,
                    openAddDlg: true
                });
            }
        }
    }

    onUpdateTask = async (id,item) =>{
        console.log('onUpdate', id, item);
        const updateTask = this.tasks.find(t => t.id === id);
        if(updateTask){
            updateTask.text = item.text;
            updateTask.end_date = date_str_format(item.end_date, DATE_STRING_FORMAT);
            updateTask.duration = item.duration;
            updateTask.progress = item.progress;
            try {
                const taskInfo = await getBackendAPI().updateTask(updateTask);
                this.tasks = this.tasks.map(t => t.id === taskInfo.id?updateTask:t);
            } catch (e){

            }
        }
    }

    isValid = () => {
        const {taskType, taskDate, taskProjectId, taskPlanId, taskWorkPackageId, taskLocationId, taskTeamId, taskStatusCode, taskCrewSize, taskDisciplineId, duration} = this.state;
        if(!taskDate){ alert('Please select completion date'); return false; }
        if(!taskProjectId){ alert('Please select project'); return false; }
        if(!taskPlanId){ alert('Please select plan'); return false; }
        if(!taskWorkPackageId){ alert('Please workPackage'); return false; }
        if(!taskLocationId){ alert('Please select location'); return false; }
        if(!taskTeamId){ alert('Please select team'); return false; }
        if(!taskStatusCode){ alert('Please select status code'); return false; }

        if(taskType === TASK_TYPE_TASK){
            if(!taskDisciplineId){ alert('Please select discipline'); return false; }
            if(!taskCrewSize){ alert('Please select crew size'); return false; }
        }

        const description = document.getElementById('description').value.trim();
        if(!description.length){ alert('Please fill description'); return false; }
        if(duration === 0){ alert('Please input duration'); return false; }
        const wbs_code = document.getElementById('wbs_code').value.trim();
        if(!wbs_code.length){ alert('Please fill wbs code'); return false; }
        return true;
    }

    onSaveTask = async () => {
        if(this.isValid()){
            const {_taskId, taskId, taskType, taskDate, taskProjectId, taskPlanId, taskWorkPackageId, taskLocationId, taskTeamId, taskStatusCode, taskDisciplineId, taskCrewSize, duration} = this.state;
            const description = document.getElementById('description').value.trim();
            const wbs_code = document.getElementById('wbs_code').value.trim();

            let task = {
                type: taskType,
                text: description,
                end_date: date_str_format(taskDate, DATE_STRING_FORMAT),
                duration: duration,
                project_id: taskProjectId,
                plan_id: taskPlanId,
                work_package_id: taskWorkPackageId,
                location_id: taskLocationId,
                team_id: taskTeamId,
                status_code: taskStatusCode,
                discipline_id: taskType===TASK_TYPE_TASK?taskDisciplineId:null,
                crew_size: taskType===TASK_TYPE_TASK?taskCrewSize:null,
                wbs_code: wbs_code,
                progress: 0
            }

            try {
                if(_taskId){
                    task['_id'] = _taskId;
                    const taskInfo = await getBackendAPI().updateTask(task);
                    this.tasks = this.tasks.map(t => t.id === taskId? {id: taskId, ...taskInfo}:t);
                } else {
                    const taskInfo = await getBackendAPI().addTask(task);
                    this.tasks.push({...taskInfo, id: taskId});
                }

                this.onSaveTaskOnChart(task);
                this.setState({openAddDlg: false});
            } catch (e) {
                console.log('error', e);
            }
        }
    }

    onSaveTaskOnChart = (info) => {
        const {taskId} = this.state;
        let task = gantt.getTask(taskId);

        task.text = info.text;
        task.end_date = new Date(info.end_date);
        task.duration = info.duration;
        const startDate = new Date(info.end_date);
        startDate.setDate(startDate.getDate() - info.duration);
        task.start_date = startDate;
        task.progress = info.progress;

        console.log('save task', task, info, startDate);

        if(task.$new){
            delete task.$new;
            gantt.addTask(task,task.parent);
        }else{
            gantt.updateTask(task.id);
        }

        gantt.hideLightbox();
    }

    onCancel = () => {
        var task = gantt.getTask(this.state.taskId);

        if(task.$new)
            gantt.deleteTask(task.id);
        gantt.hideLightbox();
        this.setState({openAddDlg: false, taskId: null, _taskId: null});
    }

    onRemove = async () => {
        if(this.state._taskId){
            try{
                await getBackendAPI().deleteTask(this.state._taskId);
                gantt.deleteTask(this.state.taskId);
                gantt.hideLightbox();
                this.tasks = this.tasks.filter(t => t._id !== this.state._taskId);
                this.setState({openAddDlg: false, taskId: null, _taskId: null});
            } catch (e) {

            }
        }
    }

    render() {
        const {taskType, taskText, taskDate, taskProjectId, taskPlanId, taskWorkPackageId, taskLocationId, taskTeamId, taskStatusCode, taskDisciplineId, taskCrewSize, duration, taskWBSCode} = this.state;
        const {teams, workPackages, disciplines, locations, plans, projects} = this.props;
        return (
            <>
                <div
                    ref={ (input) => { this.ganttContainer = input } }
                    style={ { width: '100%', height: '100%' } }
                ></div>
                <Modal
                    className="modal-lg modal-dialog-centered"
                    isOpen={this.state.openAddDlg}
                >
                    <div className="modal-header">
                        <h5 className="modal-title mt-0" id="myModalLabel">
                            New {taskType}
                        </h5>
                        <button
                            type="button"
                            onClick={this.onCancel}
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body px-4">
                        <Row className={"px-2"}>
                            <Label for="task_type">Type</Label>
                            <select id="task_type" defaultValue={taskType} name="task_type" className="form-control" onChange={(event) => this.setState({taskType: event.target.value, duration: event.target.value === TASK_TYPE_TASK?1:0})}>
                                {types.map(item => (
                                    <option key={item._id} value={item._id}>{item.text}</option>
                                ))}
                            </select>
                        </Row>
                        <Row className={"mt-2 px-2"}>
                            <Label for="description">Description</Label>
                            <input
                                type="text"
                                className="form-control"
                                defaultValue={taskText}
                                id="description"
                                placeholder="Enter Description"
                            />
                        </Row>
                        <Row className={"mt-2"}>
                            <Col lg="6">
                                <Label for="task_date">Completion Date</Label>
                                <InputGroup>
                                    <DatePicker
                                        className="date-picker-control"
                                        selected={taskDate}
                                        onChange={value => this.setState({taskDate: value})}
                                    />
                                </InputGroup>
                            </Col>
                            <Col lg="6">
                                <Label for="duration">Duration (Days)</Label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={duration}
                                    onChange={event => this.setState({duration: Math.abs(event.target.value)})}
                                    id="duration"
                                    placeholder="Enter duration"
                                />
                            </Col>
                        </Row>
                        <Row className={"mt-2"}>
                            <Col lg="6">
                                <Label for="task_project">Sub Project</Label>
                                <select id="task_project" defaultValue={taskProjectId} name="task_project" className="form-control" onChange={(event) => this.setState({taskProjectId: event.target.value, })}>
                                    <option key={'none'} value={null}> </option>
                                    {projects.map(item => (
                                        <option key={item._id} value={item._id}>{item.name}</option>
                                    ))}
                                </select>
                            </Col>
                            <Col lg="6">
                                <Label for="task_plan">Phase Plan</Label>
                                <select id="task_plan" defaultValue={taskPlanId} name="task_plan" className="form-control" onChange={(event) => this.setState({taskPlanId: event.target.value, })}>
                                    <option key={'none'} value={null}> </option>
                                    {plans.map(item => (
                                        <option key={item._id} value={item._id}>{item.name}</option>
                                    ))}
                                </select>
                            </Col>
                        </Row>
                        <Row className={"mt-2"}>
                            <Col lg="6">
                                <Label for="task_work_package">Work Package</Label>
                                <select id="task_work_package" defaultValue={taskWorkPackageId} name="task_work_package" className="form-control" onChange={(event) => this.setState({taskWorkPackageId: event.target.value, })}>
                                    <option key={'none'} value={null}> </option>
                                    {workPackages.map(item => (
                                        <option key={item._id} value={item._id}>{item.tag_name}</option>
                                    ))}
                                </select>
                            </Col>
                            <Col lg="6">
                                <Label for="task_location">Location</Label>
                                <select id="task_location" defaultValue={taskLocationId} name="task_location" className="form-control" onChange={(event) => this.setState({taskLocationId: event.target.value, })}>
                                    <option key={'none'} value={null}> </option>
                                    {locations.map(item => (
                                        <option key={item._id} value={item._id}>{item.tag_name}</option>
                                    ))}
                                </select>
                            </Col>
                        </Row>
                        {
                            taskType === TASK_TYPE_TASK &&
                            <Row className={"mt-2"}>
                                <Col lg="6">
                                    <Label for="task_discipline">Discipline</Label>
                                    <select id="task_discipline" defaultValue={taskDisciplineId} name="task_discipline" className="form-control" onChange={(event) => this.setState({taskDisciplineId: event.target.value, })}>
                                        <option key={'none'} value={null}> </option>
                                        {disciplines.map(item => (
                                            <option key={item._id} value={item._id}>{item.tag_name}</option>
                                        ))}
                                    </select>
                                </Col>
                                <Col lg="6">
                                    <Label for="task_crew_size">Crew Size</Label>
                                    <select id="task_crew_size" defaultValue={taskCrewSize} name="task_crew_size" className="form-control" onChange={(event) => this.setState({taskCrewSize: event.target.value, })}>
                                        <option key={'none'} value={null}> </option>
                                        {crewSizes.map(item => (
                                            <option key={item._id} value={item._id}>{item.text}</option>
                                        ))}
                                    </select>
                                </Col>
                            </Row>
                        }
                        <Row className={"mt-2"}>
                            <Col lg="6">
                                <Label for="task_team">Team</Label>
                                <select id="task_team" defaultValue={taskTeamId} name="task_team" className="form-control" onChange={(event) => this.setState({taskTeamId: event.target.value, })}>
                                    <option key={'none'} value={null}> </option>
                                    {teams.map(item => (
                                        <option key={item._id} value={item._id}>{item.name}</option>
                                    ))}
                                </select>
                            </Col>
                            <Col lg="6">
                                <Label for="task_status_code">Status Code</Label>
                                <select id="task_status_code" defaultValue={taskStatusCode} name="task_status_code" className="form-control" onChange={(event) => this.setState({taskStatusCode: event.target.value, })}>
                                    {statusCodes.map(item => (
                                        <option key={item._id} value={item._id}>{item.text}</option>
                                    ))}
                                </select>
                            </Col>
                        </Row>
                        <Row className={"mt-2 px-2"}>
                            <Label for="wbs_code">WBS Code</Label>
                            <input
                                type="text"
                                className="form-control"
                                id="wbs_code"
                                name="wbs_code"
                                defaultValue={taskWBSCode}
                                placeholder="Enter WBS Code"
                            />
                        </Row>
                    </div>
                    <div className="modal-footer justify-content-between">
                        <div>
                            <button
                                type="button"
                                className="btn btn-primary waves-effect waves-light"
                                onClick={this.onSaveTask}
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary waves-effect waves-light ml-2"
                                onClick={() => this.onCancel()}
                            >
                                Cancel
                            </button>
                        </div>
                        <button
                            type="button"
                            className="btn btn-danger waves-effect waves-light"
                            onClick={() => this.onRemove()}
                        >
                            Delete
                        </button>
                    </div>
                </Modal>
            </>
        );
    }
}
