import React, { Component } from 'react';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import {Button, Col, InputGroup, Label, Modal, Row} from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {getBackendAPI} from "../helpers/backend";
import {date_str_format, DATE_STRING_FORMAT} from "../helpers/function";
import Select from "react-select";

const gantt = window.dhtmlxgantt.gantt;

export const TASK_TYPE_MILESTONE = gantt.config.types.milestone;
export const TASK_TYPE_TASK = gantt.config.types.task;
export const TASK_TYPE_PROJECT = gantt.config.types.project;

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
];

let projectId = 1;
let teamId = 1;

export default class Gantt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taskId: null,
            _taskId: null,
            taskText: '',
            taskType: TASK_TYPE_MILESTONE,
            taskDate: new Date(),
            taskParent: 0,
            taskProjectId: null,
            taskPlanId: null,
            taskWorkPackageId: null,
            taskLocationIds: [],
            taskTeamId: null,
            taskStatusCode: STATUS_RELEASED,
            taskCrewSize: 1,
            taskDisciplineId: null,
            duration: 0,
            taskWBSCode: '',
            taskIndex: null,
            selectParentId: null,
            openAddDlg: false,
        };
        this.tasks = [];
        this.resources = {};
        this.links = [];
        this.projects = {};
        this.invalidLink = null;
        this.init();
    }

    componentDidMount() {
    }

    init = async () => {
        const taskInfos = (await getBackendAPI().getTasks()).map(t => {
            let metadata = t.metadata?JSON.parse(t.metadata.replaceAll("'", "\"")):{};
            return {...t, metadata: {...metadata}};
        });
        this.links = await getBackendAPI().getLinks();

        let tasks = [];

        // Order
        taskInfos.sort((a, b) => a.metadata.index - b.metadata.index);

        // Generate projects
        taskInfos.forEach((t, index) => {
            const project_key = `${t.project_id}_${t.plan_id}_${t.work_package_id}`;
            if (t.type === TASK_TYPE_PROJECT) {
                this.projects[project_key] = {
                    id: t.id,
                    type: TASK_TYPE_PROJECT,
                    text: t.text,
                    start_date: new Date(t.date),
                    render: "split",
                    open: true
                }
                if(Number(t.id) >= projectId){
                    projectId = Number(t.id) + 1;
                }
                tasks.push(this.projects[project_key]);
            }
        });

        taskInfos.forEach((t, index) => {
            const project_key = `${t.project_id}_${t.plan_id}_${t.work_package_id}`;
            if(t.type !== TASK_TYPE_PROJECT && this.projects[project_key]){
                // ID: bigInteger - DB: String
                this.tasks.push({...t, id: Number(t.id), parent: Number(t.parent)?Number(t.parent):this.projects[project_key].id});

                if(!this.resources[t.team_id]){
                    this.resources[t.team_id] = {id: t.team_id, text: t.team_info.name, parent: null};
                }
                if(t.type === TASK_TYPE_MILESTONE){
                    tasks.push({id: t.id, text: t.text, type: t.type, start_date: new Date(t.date), resource_id: t.team_id, parent: Number(this.projects[project_key].id), rollup: true, open: true, crew_size: 0});
                } else {
                    const resource_id = t.team_id + '_' + t.discipline_id;
                    tasks.push({id: t.id, text: t.text, type: t.type, end_date: new Date(t.date), duration: t.duration, progress: t.progress, resource_id, parent: t.parent, crew_size: t.crew_size});
                    if(!this.resources[resource_id]){
                        this.resources[resource_id] = {id: resource_id, text: t.discipline_info.tag_name, parent: t.team_id};
                    }
                }
            } else {
                this.tasks.push({...t, id: Number(t.id), parent: Number(t.parent)});
            }
        })

        // ----------------------------------------------------------------------------



        // back planning
        gantt.config.schedule_from_end = true;
        gantt.config.project_end = new Date();
        gantt.config.date_format = "%d/%m/%Y";

        // resource
        gantt.config.resource_render_empty_cells = true;
        gantt.config.resource_store = "resource";
        gantt.config.resource_property = "resource_id";
        const resourceConfig = {
            columns: [
                {
                    name: "name", label: "Team", tree:true, template: (resource) => {
                        return resource.text;
                    }
                }
            ]
        };

        gantt.templates.resource_cell_class = (start_date, end_date, resource, tasks) => {
            const resourceTasks = this.getResourceTasks(resource.id, start_date, end_date);
            const css = [];
            css.push("resource_marker");
            if (resourceTasks.length > 0) {
                css.push("workday_ok");
            }
            return css.join(" ");
        };

        gantt.templates.resource_cell_value = (start_date, end_date, resource, tasks) => {
            if(!gantt.isWorkTime(start_date)){
                return "";
            }
            const resourceTasks = this.getResourceTasks(resource.id, start_date, end_date);
            console.log('resource', resource.id, resourceTasks);
            let crew_size = 0;
            resourceTasks.forEach(t => {
                crew_size += t.crew_size;
            });
            if(crew_size){
                return "<div>" + crew_size + "</div>";
            }
            return "";
        };

        // working days
        gantt.config.work_time = true;
        gantt.config.correct_work_time = true;

        gantt.config.min_column_width = 60;
        gantt.config.duration_unit = "day";
        gantt.config.scale_height = 20 * 3;
        gantt.config.row_height = 30;

        var weekScaleTemplate = function (date) {
            var dateToStr = gantt.date.date_to_str("%d %M");
            var weekNum = gantt.date.date_to_str("(week %W)");
            var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
            return dateToStr(date) + " - " + dateToStr(endDate) + " " + weekNum(date);
        };

        gantt.config.scales = [
            {unit: "month", step: 1, format: "%F, %Y"},
            {unit: "week", step: 1, format: weekScaleTemplate},
            {unit: "day", step: 1, format: "%D, %d"}
        ];

        gantt.templates.timeline_cell_class = function (task, date) {
            if (!gantt.isWorkTime(date))
                return "week_end";
            return "";
        };

        // split task
        gantt.config.open_split_tasks = true;

        // roll up task
        gantt.locale.labels.section_rollup = "Rollup";
        gantt.templates.rightside_text = function (start, end, task) {
            if (task.type === TASK_TYPE_MILESTONE) {
                return task.text;
            }
            return "";
        };

        gantt.config.order_branch = true;
        gantt.config.open_tree_initially = true;
        gantt.config.layout = {
            css: "gantt_container",
            rows: [
                {
                    cols: [
                        {view: "grid", group:"grids", scrollY: "scrollVer"},
                        {resizer: true, width: 1},
                        {view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer"},
                        {view: "scrollbar", id: "scrollVer", group:"vertical"}
                    ],
                    gravity:2
                },
                {resizer: true, width: 1},
                {
                    config: resourceConfig,
                    cols: [
                        {view: "resourceGrid", group:"grids", width: 435, scrollY: "resourceVScroll" },
                        {resizer: true, width: 1},
                        {view: "resourceTimeline", scrollX: "scrollHor", scrollY: "resourceVScroll"},
                        {view: "scrollbar", id: "resourceVScroll", group:"vertical"}
                    ],
                    gravity:1
                },
                {view: "scrollbar", id: "scrollHor"}
            ]
        };
        gantt.config.columns = [
            {name: "text", tree: true, width: 300, resize: true},
            {name: "duration", align: "center", width: 70, resize: true},
            {name: "add_task", label: "<div role=\"button\" aria-label=\"New task\" class=\"gantt_add\"></div>",  width: 44, template: function (task) {
              if(task.type === TASK_TYPE_TASK){
                  return '';
              }
              return '<div role="button" aria-label="New task" class="gantt_add"></div>';
            }}
        ];


        gantt.init(this.ganttContainer);

        // Attach Events
        gantt.showLightbox = this.onShowLightBox;
        gantt.attachEvent("onAfterTaskUpdate", this.onUpdateTask);
        gantt.attachEvent("onBeforeLinkAdd", this.onCheckLink);
        gantt.attachEvent("onAfterLinkAdd", this.onLinkCreated);
        gantt.attachEvent("onAfterLinkUpdate", this.onLinkUpdated);
        gantt.attachEvent("onAfterLinkDelete", this.onLinkDeleted);
        gantt.attachEvent("onRowDragEnd", this.onRowDrag);

        // Resources
        const resourcesStore = gantt.createDatastore({
            name: gantt.config.resource_store,
            type: "treeDatastore",
            initItem: function (item) {
                item.parent = item.parent || gantt.config.root_id;
                item[gantt.config.resource_property] = item.id;
                item.open = true;
                return item;
            }
        });
        resourcesStore.attachEvent("onParse", function(){
            let resource = [];
            resourcesStore.eachItem(function(res){
                let copy = gantt.copy(res);
                copy.key = res.id;
                copy.label = res.text;
                resource.push(copy);
            });
            gantt.updateCollection("people", resource);
        });
        resourcesStore.parse(Object.values(this.resources));

        // Config
        const config = {
            data: tasks,
            links: this.links
        }

        gantt.parse(config);
    }

    getResourceTasks = (resourceId, from, to) => {
        let store = gantt.getDatastore(gantt.config.resource_store),
            field = gantt.config.resource_property,
            tasks;

        if(store.hasChild(resourceId)){
            tasks = gantt.getTaskByTime(from, to).filter(t => store.getChildren(resourceId).includes(t[field]));
        }else{
            tasks = gantt.getTaskByTime(from, to).filter(t => t[field] === resourceId);
        }
        return tasks;
    }

    onShowLightBox = (id) => {
        let task = gantt.getTask(id);
        console.log('open task', task);
        if(task.$new){
            const selectParentId = Number(task.parent);
            if(selectParentId){
                const parentTask = this.tasks.find(t => t.id === selectParentId);

                // Task
                if(parentTask){
                    this.setState({
                        taskId: id,
                        _taskId: null,
                        taskType: TASK_TYPE_TASK,
                        taskText: '',
                        taskDate: new Date(task.end_date),
                        taskParent: selectParentId,
                        taskProjectId: parentTask.project_id,
                        taskPlanId: parentTask.plan_id,
                        taskWorkPackageId: parentTask.work_package_id,
                        taskLocationIds: parentTask.location_id.split(','),
                        taskTeamId: parentTask.team_id,
                        taskStatusCode: STATUS_RELEASED,
                        taskCrewSize: 1,
                        taskDisciplineId: null,
                        duration: 0,
                        taskWBSCode: '',
                        taskIndex: task.$index,
                        selectParentId: selectParentId,
                        openAddDlg: true,
                    });
                    console.log('open with parent', id, parentTask, selectParentId);
                    return;
                }
            }
            this.setState({
                taskId: id,
                _taskId: null,
                taskType: TASK_TYPE_MILESTONE,
                taskText: '',
                taskDate: new Date(task.end_date),
                taskParent: task.parent,
                taskProjectId: null,
                taskPlanId: null,
                taskWorkPackageId: null,
                taskLocationIds: [],
                taskTeamId: null,
                taskStatusCode: STATUS_RELEASED,
                taskCrewSize: 1,
                taskDisciplineId: null,
                duration: 0,
                taskWBSCode: '',
                taskIndex: task.$index,
                selectParentId: null,
                openAddDlg: true,
            });
            console.log('open', id, task, selectParentId);
        } else {
            const targetTask = this.tasks.find(t => t.id == id);
            console.log('edit', targetTask);
            if(targetTask){
                this.setState({
                    taskId: id,
                    _taskId: targetTask._id,
                    taskType: targetTask.type,
                    taskText: task.text,
                    taskDate: new Date(task.end_date),
                    taskParent: targetTask.parent,
                    taskProjectId: targetTask.project_id,
                    taskPlanId: targetTask.plan_id,
                    taskWorkPackageId: targetTask.work_package_id,
                    taskLocationIds: targetTask.location_id.split(','),
                    taskTeamId: targetTask.team_id,
                    taskStatusCode: targetTask.status_code,
                    taskCrewSize: targetTask.crew_size,
                    taskDisciplineId: targetTask.discipline_id,
                    duration: targetTask.duration,
                    taskWBSCode: targetTask.wbs_code,
                    taskIndex: task.$index,
                    selectParentId: targetTask.parent,
                    openAddDlg: true
                });
            }
        }
    }

    onUpdateTask = async (id,item) =>{
        console.log('onUpdate', id, item);
        const updateTask = Object.assign({}, this.tasks.find(t => t.id == id));
        if(updateTask){
            updateTask.date = updateTask.type === TASK_TYPE_MILESTONE?date_str_format(item.start_date, DATE_STRING_FORMAT):date_str_format(item.end_date, DATE_STRING_FORMAT);
            updateTask.duration = item.duration;
            updateTask.progress = item.progress;
            updateTask.metadata = JSON.stringify(updateTask.metadata).replace(/"/g, "'");
            try {
                const taskInfo = await getBackendAPI().updateTask(updateTask);
                this.tasks = this.tasks.map(t => t.id === taskInfo.id? {...t, date: updateTask.date, duration: updateTask.duration, progress: updateTask.progress }:t);
                gantt.refreshData();
            } catch (e){

            }
        }
    }

    onCheckLink = async (id, link) => {
        if (link.type == 0){
            let sourceTask = gantt.getTask(link.source);
            let targetTask = gantt.getTask(link.target);
            if (sourceTask.end_date > targetTask.start_date){
                alert("This link is illegal");
                this.invalidLink = id;
                return false;
            }
        }
    }

    onLinkCreated = async (id, link) => {
        if(id === this.invalidLink){
            console.log('invalid Link', id, link);
            gantt.deleteLink(id);
            return false;
        }
        const linkData = {
            id: id,
            source: link.source,
            target: link.target,
            type: link.type
        };
        const newLink = await getBackendAPI().createLink(linkData);
        this.links.push(newLink);
    };

    updateStatusCode = async (id) => {
        let task = this.tasks.find(t => t.id == id);
        if(task){
           const updatedTasks = await getBackendAPI().updateStatusCode(task._id);
           const updateStatuses = {};
           updatedTasks.forEach(t => updateStatuses[t._id] = t.status_code);
           this.tasks = this.tasks.map(t => ({...t, status_code: updateStatuses[t._id]}));
        }
    }

    onLinkUpdated = async (id, link) => {
        console.log('updated', id, link);
    }

    onLinkDeleted = async (id, link) => {
        console.log('deleted', id, link);
        const targetLink = this.links.find(link => link.id == id);
        if(targetLink){
            await getBackendAPI().deleteLink(targetLink._id);
        }
    }

    onRowDrag = async (id, target) => {
        if(!target) return;
        let targetTaskId = null;
        if(target.indexOf('next:') > -1){
            targetTaskId = target.substr('next:'.length);
        } else {
            targetTaskId = target;
        }
        let task = gantt.getTask(id);
        let targetTask = gantt.getTask(targetTaskId);

        if(task){
            await this.updateMetadata(id, {index: task.$index});
        }

        if(targetTask){
            await this.updateMetadata(targetTaskId, {index: targetTask.$index});
        }
    }

    updateMetadata = async (id, metadata) => {
        let task = this.tasks.find(t => t.id == id);
        if(!task){
            return;
        }
        let updateTask = Object.assign({}, task);
        let taskMetadata = updateTask.metadata??{};
        taskMetadata = {...taskMetadata, ...metadata};
        updateTask.metadata = JSON.stringify(taskMetadata).replace(/"/g, "'");
        await getBackendAPI().updateTask(updateTask);
    }

    isValid = () => {
        const {taskType, taskDate, taskProjectId, taskPlanId, taskWorkPackageId, taskLocationIds, taskTeamId, taskStatusCode, taskCrewSize, taskDisciplineId, duration} = this.state;
        if(!taskDate){ alert('Please select completion date'); return false; }
        if(!taskProjectId){ alert('Please select project'); return false; }
        if(!taskPlanId){ alert('Please select plan'); return false; }
        if(!taskWorkPackageId){ alert('Please workPackage'); return false; }
        if(!taskLocationIds.length){ alert('Please select location'); return false; }
        if(!taskTeamId){ alert('Please select team'); return false; }
        if(!taskStatusCode){ alert('Please select status code'); return false; }

        if(taskType === TASK_TYPE_TASK){
            if(!taskDisciplineId){ alert('Please select discipline'); return false; }
            if(!taskCrewSize){ alert('Please select crew size'); return false; }
            if(duration === 0){ alert('Please input duration'); return false; }
        }

        const description = document.getElementById('description').value.trim();
        if(!description.length){ alert('Please fill description'); return false; }
        return true;
    }

    onSaveTask = async () => {
        if(this.isValid()){
            const {_taskId, taskId, taskType, taskDate, taskParent, taskProjectId, taskPlanId, taskWorkPackageId, taskLocationIds, taskTeamId, taskStatusCode, taskDisciplineId, taskCrewSize, taskIndex, duration} = this.state;
            const description = document.getElementById('description').value.trim();
            const wbs_code = document.getElementById('wbs_code').value.trim();
            const metadata = JSON.stringify({index: taskIndex}).replace(/"/g, "'");

            let task = {
                id: taskId,
                type: taskType,
                text: description,
                date: date_str_format(taskDate, DATE_STRING_FORMAT),
                duration: duration,
                parent: taskParent??0,
                project_id: taskProjectId,
                plan_id: taskPlanId,
                work_package_id: taskWorkPackageId,
                location_id: taskLocationIds.join(','),
                team_id: taskTeamId,
                status_code: taskStatusCode,
                discipline_id: taskType===TASK_TYPE_TASK?taskDisciplineId:null,
                crew_size: taskType===TASK_TYPE_TASK?taskCrewSize:null,
                wbs_code: wbs_code,
                metadata: metadata,
                progress: 0
            }

            console.log('task insert/update', task);

            try {
                let taskInfo;
                if(_taskId){
                    task['_id'] = _taskId;
                    taskInfo = await getBackendAPI().updateTask(task);
                    this.tasks = this.tasks.map(t => t.id == taskId? {id: taskId, ...taskInfo, metadata: {index: taskIndex}}:t);
                } else {
                    taskInfo = await getBackendAPI().addTask(task);
                    const task_project_key = `${task.project_id}_${task.plan_id}_${task.work_package_id}`;
                    // Check Project
                    if(!this.projects[task_project_key]){

                        const projectTask = {
                            id: projectId,
                            type: TASK_TYPE_PROJECT,
                            text: `Sub Project: ${taskInfo.project_info.name} Plan: ${taskInfo.plan_info.name} WorkPackage: ${taskInfo.work_package_info.tag_name}`,
                            date: date_str_format(taskDate, DATE_STRING_FORMAT),
                            duration: 0,
                            parent: 0,
                            project_id: task.project_id,
                            plan_id: task.plan_id,
                            work_package_id: task.work_package_id,
                            location_id: '',
                            team_id: '',
                            status_code: 0,
                            discipline_id: null,
                            crew_size: null,
                            wbs_code: '',
                            metadata,
                            progress: 0
                        }
                        await getBackendAPI().addTask(projectTask);
                    }
                     // Update Status Code
                    this.tasks.push({...taskInfo, id: taskId, metadata: {index: taskIndex}});
                    await this.updateStatusCode(taskId);
                }

                this.onSaveTaskOnChart(taskInfo);
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
        if(info.type === TASK_TYPE_TASK){
            task.end_date = new Date(info.date);
            task.duration = info.duration;
            const startDate = new Date(info.date);
            startDate.setDate(startDate.getDate() - info.duration);
            task.start_date = startDate;
            task.progress = info.progress;
            task.resource_id = info.team_id + "_" + info.discipline_id;
            task.crew_size = info.crew_size;
        } else {
            task.type = TASK_TYPE_MILESTONE;
            task.start_date = new Date(info.date);
            task.resource_id = info.team_id;
            task.crew_size = 0;
        }

        const task_project_key = `${info.project_id}_${info.plan_id}_${info.work_package_id}`;
        // Check Project
        if(!this.projects[task_project_key]){
            task.parent = projectId;
            this.projects[task_project_key] = {
                id: projectId++,
                type: TASK_TYPE_PROJECT,
                text: `Sub Project: ${info.project_info.name} Plan: ${info.plan_info.name} WorkPackage: ${info.work_package_info.tag_name}`,
                start_date: task.end_date,
                render: "split",
                open: true
            }
            gantt.addTask(this.projects[task_project_key], 0);
        }

        gantt.hideLightbox();
        if(task.$new){
            delete task.$new;
            task.team_id = info.team_id;
            gantt.addTask(task,task.parent);
        }else{
            gantt.updateTask(task.id);
        }

    }

    onCancel = () => {
        let task = gantt.getTask(this.state.taskId);

        if(task.$new)
            gantt.deleteTask(task.id);
        gantt.hideLightbox();
        this.setState({openAddDlg: false, taskId: null, _taskId: null, selectParentId: null});
    }

    onRemove = async () => {
        if(this.state._taskId){
            try{
                await getBackendAPI().deleteTask(this.state._taskId);
                gantt.deleteTask(this.state.taskId);
                gantt.hideLightbox();
                this.tasks = this.tasks.filter(t => t._id !== this.state._taskId);
                const childTask = this.tasks.find(t => t.parent == this.state.selectParentId);
                await this.updateStatusCode(childTask.id);
                this.setState({openAddDlg: false, taskId: null, _taskId: null, selectParentId: null});
            } catch (e) {

            }
        }
    }

    onSelectProjectId = (project_id) => {
        const {taskPlanId} = this.state;
        const {plans} = this.props;
        const projectPlans = plans.filter(p => p.project_id === project_id);
        if(projectPlans.find(p => p._id === taskPlanId)){
            this.setState({taskProjectId: project_id});
        } else {
            this.setState({taskProjectId: project_id, taskPlanId: null});
        }
    }

    onExportPdf = () => {
        gantt.exportToPDF();
    }

    render() {
        const {taskType, taskText, taskDate, taskProjectId, taskPlanId, taskWorkPackageId, taskLocationIds, taskTeamId, taskStatusCode, taskDisciplineId, taskCrewSize, duration, taskWBSCode, selectParentId} = this.state;
        const {teams, workPackages, disciplines, locations, plans, projects} = this.props;

        console.log('locationIds', taskLocationIds);
        const locationOptions = locations.map(l => ({label: l.tag_name, value: l._id}));
        const selectedLocations = locationOptions.filter(l => taskLocationIds.includes(l.value));

        return (
            <>
                <div
                    ref={ (input) => { this.ganttContainer = input } }
                    style={ { width: '100%', height: 'calc(100% - 52px)' } }
                ></div>
                <Row className="my-2 float-right">
                    <Col sm={12}>
                        <Button
                            color="primary"
                            className={"btn-primary btn waves-effect waves-light"}
                            onClick={this.onExportPdf}
                        >
                            Export To PDF
                        </Button>
                    </Col>
                </Row>
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
                                        dateFormat="dd/MM/yyyy"
                                        className="date-picker-control"
                                        selected={taskDate}
                                        onChange={value => this.setState({taskDate: value})}
                                    />
                                </InputGroup>
                            </Col>
                            {
                                taskType === TASK_TYPE_TASK &&
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
                            }
                        </Row>
                        <Row className={"mt-2"}>
                            <Col lg="6">
                                <Label for="task_project">Sub Project</Label>
                                <select id="task_project" disabled={!!(selectParentId)} defaultValue={taskProjectId} name="task_project" className="form-control" onChange={(event) => this.onSelectProjectId(event.target.value)}>
                                    <option key={'none'} value={null}> </option>
                                    {projects.map(item => (
                                        <option key={item._id} value={item._id}>{item.name}</option>
                                    ))}
                                </select>
                            </Col>
                            <Col lg="6">
                                <Label for="task_plan">Phase Plan</Label>
                                <select id="task_plan" disabled={!!(selectParentId)} defaultValue={taskPlanId} name="task_plan" className="form-control" onChange={(event) => this.setState({taskPlanId: event.target.value, })}>
                                    <option key={'none'} value={null}> </option>
                                    {plans.filter(p => p.project_id === taskProjectId).map(item => (
                                        <option key={item._id} value={item._id}>{item.name}</option>
                                    ))}
                                </select>
                            </Col>
                        </Row>
                        <Row className={"mt-2"}>
                            <Col lg="6">
                                <Label for="task_work_package">Work Package</Label>
                                <select id="task_work_package" disabled={!!(selectParentId)} defaultValue={taskWorkPackageId} name="task_work_package" className="form-control" onChange={(event) => this.setState({taskWorkPackageId: event.target.value, })}>
                                    <option key={'none'} value={null}> </option>
                                    {workPackages.map(item => (
                                        <option key={item._id} value={item._id}>{item.tag_name}</option>
                                    ))}
                                </select>
                            </Col>
                            <Col lg="6">
                                <Label for="task_location">Location</Label>
                                <Select
                                    value={selectedLocations}
                                    isDisabled={!!(selectParentId)}
                                    isMulti={true}
                                    onChange={ value => this.setState({taskLocationIds: value.map(i => i.value)})}
                                    options={locationOptions}
                                />
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
                                <select id="task_team" disabled={!!(selectParentId)} defaultValue={taskTeamId} name="task_team" className="form-control" onChange={(event) => this.setState({taskTeamId: event.target.value, })}>
                                    <option key={'none'} value={null}> </option>
                                    {teams.map(item => (
                                        <option key={item._id} value={item._id}>{item.name}</option>
                                    ))}
                                </select>
                            </Col>
                            <Col lg="6">
                                <Label for="task_status_code">Status Code</Label>
                                <select id="task_status_code" disabled defaultValue={taskStatusCode} name="task_status_code" className="form-control" onChange={(event) => this.setState({taskStatusCode: event.target.value, })}>
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
