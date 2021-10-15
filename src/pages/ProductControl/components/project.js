import React from "react";
import { connect } from "react-redux";
import {getBackendAPI} from "../../../helpers/backend";

class Project extends React.Component {
    constructor(props) {
        super(props);
        const project = this.props.project;

        this.state = {
            isEditing: !(project._id),
            name: project.name??'',
            description: project.description??'',
            isLocked: project.is_locked??false,
        };
    }

    onSave = async () => {
        const {user} = this.props;
        const {name, description} = this.state;

        if(!name.trim().length){
            return;
        }
        try{
            let project;
            if(!this.props.project._id){
                const newProject = {name, description, created_by_id: user._id, is_locked: false};
                project = await getBackendAPI().addProject(newProject);
            } else {
                const newProject = {_id: this.props.project._id, name, description, created_by_id: user._id, is_locked: false};
                project = await getBackendAPI().updateProject(newProject);
            }
            this.setState({isEditing: false});
            this.props.onSave(project);
        } catch (e) {

        }
    }

    onCancel = () => {
        this.setState({isEditing: false});
        if(!this.props.project._id){
            this.props.onDelete();
        }
    }

    onDuplicate = () => {
        this.props.onDuplicate();
    }

    onEdit = () => {
        const {project} = this.props;
        this.setState({
            isEditing: true,
            name: project.name??'',
            description: project.description??'',
        });
    }

    onLock = async () => {
        const {project} = this.props;
        const newProject = {...project, is_locked: true};
        this.props.onToggleLock(newProject);
    }

    onUnlock = async () => {
        const {project} = this.props;
        const newProject = {...project, is_locked: false};
        this.props.onToggleLock(newProject);
    }

    onDelete = async () => {
        try {
            if (this.props.project._id) {
                await getBackendAPI().deleteProject(this.props.project._id);
                this.props.onDelete();
            }
        } catch (e) {
        }
    }

    onSelect = () => {
        if(this.props.project._id){
            this.props.onSelect();
        }
    }

    render (){
        const { project, isSelected, isLocked, user } = this.props;
        const { isEditing, name, description } = this.state;
        const canEdit = user._id === project.created_by_id || user.role === 'admin';

        if(isLocked){
            return (
                <div className="project-container">
                    <div className="project-header">
                        {project.name}
                    </div>
                    <div className="project-content d-flex flex-column">
                        <div className="flex-grow-1 align-items-center d-flex justify-content-center my-2">
                            <i className="ti-lock project-lock"/>
                        </div>
                        {
                            canEdit?
                            <div className="form-group btn-container mt-2">
                                <button
                                    className="btn btn-primary w-md waves-effect waves-light mx-2"
                                    onClick={this.onUnlock}
                                >
                                    Unlock
                                </button>
                            </div>:null
                        }
                    </div>
                </div>
            );
        }

        const selectedClass = isSelected?'selected':'';
        return (<div className={"project-container " + selectedClass} onClick={this.onSelect}>
            <div className="project-header">
                {(isEditing && !project._id)?'New Project':project.name}
            </div>
                {
                    isEditing?
                    <div className="project-content">
                        <form className="mt-4" action="#">
                            <div className="form-group">
                                <label htmlFor="name">Sub Project</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    value={name}
                                    onChange={(event) => this.setState({name: event.target.value})}
                                    placeholder="Enter Project Name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    className="form-control description"
                                    id="description"
                                    value={description}
                                    onChange={(event) => this.setState({description: event.target.value})}
                                    placeholder="Enter Description"
                                />
                            </div>
                            {/*<div className="form-group">*/}
                            {/*    <label htmlFor="description">Created By</label>*/}
                            {/*    <input*/}
                            {/*        type="text"*/}
                            {/*        className="form-control"*/}
                            {/*        id="created_by"*/}
                            {/*        value={created_by}*/}
                            {/*        onChange={(event) => this.setState({created_by: event.target.value})}*/}
                            {/*        placeholder="Enter Creator"*/}
                            {/*    />*/}
                            {/*</div>*/}
                            {
                                canEdit?
                                <div className="form-group btn-container">
                                    <button
                                        className="btn btn-primary w-md waves-effect waves-light mx-2"
                                        onClick={this.onSave}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="btn btn-secondary w-md waves-effect waves-light"
                                        onClick={this.onCancel}
                                    >
                                        Cancel
                                    </button>
                                </div>
                                    :null
                            }
                        </form>
                    </div>
                    :
                    <div className="project-content pt-4 d-flex flex-column">
                        <div className="form-group">
                            <label className="form-label">Description:</label>
                            <label>{project.description}</label>
                        </div>

                        <div className="form-group flex-grow-1">
                            <label className="form-label">Created By:</label>
                            <label>{project.created_by.name}</label>
                        </div>
                        {
                            canEdit?
                            <div className="btn-container mb-2">
                                <div className="mb-2">
                                    <button
                                        className="btn btn-primary w-md waves-effect waves-light"
                                        onClick={this.onEdit}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-outline-dark w-md waves-effect waves-light mx-2"
                                        onClick={this.onLock}
                                    >
                                        Lock
                                    </button>
                                </div>
                                {/*<div>*/}
                                {/*    <button*/}
                                {/*        className="btn btn-outline-dark w-md waves-effect waves-light mx-2"*/}
                                {/*        onClick={this.onDuplicate}*/}
                                {/*    >*/}
                                {/*        Duplicate*/}
                                {/*    </button>*/}
                                {/*    <button*/}
                                {/*        className="btn btn-danger w-md waves-effect waves-light"*/}
                                {/*        onClick={this.onDelete}*/}
                                {/*    >*/}
                                {/*        Delete*/}
                                {/*    </button>*/}
                                {/*</div>*/}
                            </div>
                                :null
                        }
                    </div>
                }
        </div>)
    }
}

const mapStateToProps = state => {
    return {
        user: state.Login.user
    }
}
export default connect(mapStateToProps, null)(Project);
