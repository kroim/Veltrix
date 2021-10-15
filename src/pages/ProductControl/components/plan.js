import React from "react";
import {getBackendAPI} from "../../../helpers/backend";
import {connect} from "react-redux";


class Plan extends React.Component {
    constructor(props) {
        super(props);
        const plan = this.props.plan;
        const projectId = this.props.projectId;

        this.state = {
            isEditing: !(plan._id),
            project_id: projectId,
            name: plan.name??'',
            description: plan.description??'',
            isLocked: plan.is_locked??false,
        };
    }

    onSave = async () => {
        const {user} = this.props;
        const {name, description, project_id} = this.state;

        if(!name.trim().length || !project_id){
            return;
        }

        try{
            let plan = null;
            if(!this.props.plan._id){
                const newPlan = {project_id, name, description, created_by_id: user._id, teams: '', packages: '', locations: '', is_locked: false};
                plan = await getBackendAPI().addPlan(newPlan);
            } else {
                const newPlan = {_id: this.props.plan._id, project_id, name, description, created_by_id: user._id, teams: '', packages: '', locations: '', is_locked: false};
                plan = await getBackendAPI().updatePlan(newPlan);
            }
            this.setState({isEditing: false});
            this.props.onSave(plan);
        } catch (e) {
            console.log('err', e);
        }
    }

    onCancel = () => {
        this.setState({isEditing: false});
        if(!this.props.plan._id){
            this.props.onDelete();
        }
    }

    onDuplicate = () => {
        this.props.onDuplicate();
    }

    onEdit = () => {
        const {plan} = this.props;
        this.setState({
            isEditing: true,
            name: plan.name??'',
            description: plan.description??'',
            created_by: plan.created_by??'',
            teams: plan.teams??'',
            packages: plan.packages??'',
            locations: plan.locations??'',
        });
    }


    onLock = async () => {
        const {plan} = this.props;
        const newPlan = {...plan, is_locked: true};
        this.props.onToggleLock(newPlan);
    }

    onUnlock = async () => {
        const {plan} = this.props;
        const newPlan = {...plan, is_locked: false};
        this.props.onToggleLock(newPlan);
    }

    onDelete = async () => {
        try {
            if (this.props.plan._id) {
                await getBackendAPI().deletePlan(this.props.plan._id);
                this.props.onDelete();
            }
        } catch (e) {

        }
    }


    onClick = () => {

    }

    render (){
        const { plan, user, isLocked } = this.props;
        const { isEditing, name, description } = this.state;
        const canEdit = user._id === plan.created_by_id || user.role === 'admin';

        if(isLocked){
            return (
                <div className="plan-container">
                    <div className="plan-header">
                        {plan.name}
                    </div>
                    <div className="plan-content d-flex flex-column">
                        <div className="flex-grow-1 align-items-center d-flex justify-content-center my-2">
                            <i className="ti-lock plan-lock"/>
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
                            </div>
                            : null
                        }
                    </div>
                </div>
            );
        }

        return (<div className="plan-container">
            <div className="plan-header">
                {(isEditing && !plan._id)?'New Plan':plan.name}
            </div>
            {
                isEditing ?
                <div className="plan-content">
                    <form className="mt-4" action="#">
                        <div className="form-group">
                            <label htmlFor="plan_name">Phase Plan</label>
                            <input
                                type="text"
                                className="form-control"
                                id="plan_name"
                                value={name}
                                onChange={(event) => this.setState({name: event.target.value})}
                                placeholder="Enter Plan Name"
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
                        {/*    <label htmlFor="created_by">Teams</label>*/}
                        {/*    <input*/}
                        {/*        type="text"*/}
                        {/*        className="form-control"*/}
                        {/*        id="teams"*/}
                        {/*        value={teams}*/}
                        {/*        onChange={(event) => this.setState({teams: event.target.value})}*/}
                        {/*        placeholder="Enter Teams"*/}
                        {/*    />*/}
                        {/*</div>*/}
                        {/*<div className="form-group">*/}
                        {/*    <label htmlFor="packages">Work Packages</label>*/}
                        {/*    <input*/}
                        {/*        type="text"*/}
                        {/*        className="form-control"*/}
                        {/*        id="packages"*/}
                        {/*        value={packages}*/}
                        {/*        onChange={(event) => this.setState({packages: event.target.value})}*/}
                        {/*        placeholder="Enter Packages"*/}
                        {/*    />*/}
                        {/*</div>*/}
                        {/*<div className="form-group">*/}
                        {/*    <label htmlFor="locations">Locations</label>*/}
                        {/*    <input*/}
                        {/*        type="text"*/}
                        {/*        className="form-control"*/}
                        {/*        id="locations"*/}
                        {/*        value={locations}*/}
                        {/*        onChange={(event) => this.setState({locations: event.target.value})}*/}
                        {/*        placeholder="Enter Locations"*/}
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
                <div className="plan-content pt-4 d-flex flex-column">
                    <div className="form-group">
                        <label className="form-label">Description:</label>
                        <label>{plan.description}</label>
                    </div>

                    <div className="form-group flex-grow-1">
                        <label className="form-label">Created By:</label>
                        <label>{plan.created_by.name}</label>
                    </div>

                    <div className="form-group flex-grow-1">
                        <label className="form-label">Teams:</label>
                        <label>{plan.teams}</label>
                    </div>

                    <div className="form-group flex-grow-1">
                        <label className="form-label">Work Packages:</label>
                        <label>{plan.packages}</label>
                    </div>

                    <div className="form-group flex-grow-1">
                        <label className="form-label">Locations:</label>
                        <label>{plan.locations}</label>
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
        </div>);
    }
}

const mapStateToProps = state => {
    return {
        user: state.Login.user
    }
}

export default connect(mapStateToProps, null)(Plan);
