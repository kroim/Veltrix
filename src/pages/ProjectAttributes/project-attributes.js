import React, {Component} from "react";
import reactCSS from 'reactcss';
import {Row, Col, Label, Input, Button, Modal} from "reactstrap";
import {Link} from "react-router-dom";
import {CompactPicker} from "react-color";
import {getBackendAPI} from "../../helpers/backend";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

class ProjectAttributesPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: '#4D4D4D',
            color_picker: ['#4D4D4D', '#999999', '#FFFFFF', '#F44E3B', '#FE9200', '#FCDC00', '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF', '#333333', '#808080', '#cccccc', '#D33115', '#E27300', '#FCC400', '#B0BC00', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF', '#000000', '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FB9E00', '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', '#AB149E'],
            show_color_picker: false,
            addingPackageTag: false,
            workPackages: [],
            addingLocationTag: false,
            locationTags: [],
            disciplineTags: [],
            addDisciplineTagModal: false,
        };
        this.tasks = [];

        this.addDisciplineModalHandler = this.addDisciplineModalHandler.bind(this);
        this.handleHor = this.handleHor.bind(this);
        this.init();
    }

    componentDidMount() {
    }

    init = async () => {
        let tasks = await getBackendAPI().getTasks();
        this.setState({tasks: tasks.map((t, index) => ({id: index + 1, ...t}))});
    }
    removeBodyCss() {
        document.body.classList.add("no_padding");
    }

    handleHor = color => {
        this.setState({colorHor: color.hex});
    };

    addDisciplineModalHandler() {
        this.setState(prevState => ({
            addDisciplineTagModal: !prevState.addDisciplineTagModal
        }));
        this.removeBodyCss();
    }

    init = async () => {
        let attributes = await getBackendAPI().allProjectAttributes();
        console.log('attributes', attributes);
        let workPackages = attributes.filter(item => item.attribute_name === 'Work Package');
        let locationTags = attributes.filter(item => item.attribute_name === 'Location');
        let disciplineTags = attributes.filter(item => item.attribute_name === 'Discipline');
        this.setState({workPackages: workPackages, locationTags: locationTags, disciplineTags: disciplineTags});
    }

    addPackageTag = async () => {
        const {workPackages} = this.state;
        let newWorkPackages = workPackages;
        let package_name_text = document.getElementById('package_name').value.trim();
        let package_handle_text = document.getElementById('package_handle').value.trim();

        if (package_name_text.length && package_handle_text.length) {
            if (workPackages.find(workPackage => workPackage.tag_name === package_name_text) || workPackages.find(workPackage => workPackage.handle === package_handle_text)) {
                return;
            }
            try {
                let attribute = await getBackendAPI().addProjectAttribute('Work Package', package_name_text, package_handle_text);
                if (attribute) {
                    newWorkPackages.push(attribute);
                    this.setState({addingPackageTag: false, workPackages: newWorkPackages});
                }
            } catch (e) {

            }
        }
    }

    addLocationTag = async () => {
        const {locationTags} = this.state;
        let newLocationTags = locationTags;
        let location_name_text = document.getElementById('location_name').value.trim();
        let location_handle_text = document.getElementById('location_handle').value.trim();

        if (location_name_text.trim().length && location_handle_text.trim().length) {
            if (locationTags.find(location_tag => location_tag.tag_name === location_name_text) || locationTags.find(location_tag => location_tag.handle === location_handle_text)) {
                return;
            }
            try {
                let attribute = await getBackendAPI().addProjectAttribute('Location', location_name_text, location_handle_text);
                if (attribute) {
                    newLocationTags.push(attribute);
                    this.setState({addingLocationTag: false, locationTags: newLocationTags});
                }
            } catch (e) {

            }
        }
    }

    addDisciplineTag = async () => {
        const {disciplineTags} = this.state;
        let newDisciplineTags = disciplineTags;
        let discipline_name_text = document.getElementById('discipline_name').value.trim();
        let discipline_handle_text = document.getElementById('discipline_handle').value.trim();
        let discipline_color_text = this.state.color;
        if (discipline_name_text.trim().length && discipline_handle_text.trim().length && discipline_color_text.trim().length) {
            if (disciplineTags.find(disciplineTag => disciplineTag.tag_name === discipline_name_text) || disciplineTags.find(disciplineTag => disciplineTag.handle === discipline_handle_text) || disciplineTags.find(disciplineTag => disciplineTag.color === discipline_color_text)) {
                return;
            }
            try {
                let attribute = await getBackendAPI().addProjectAttribute('Discipline', discipline_name_text, discipline_handle_text, discipline_color_text);
                if (attribute) {
                    newDisciplineTags.push(attribute);
                    this.setState({addDisciplineTagModal: false, disciplineTags: newDisciplineTags});
                }
            } catch (e) {

            }
        }
    }

    autoGenerateHandle = (id, e) => {
        let name = e.target.value;
        let auto_gen_handle = '@' + name.toLowerCase().replace(' ', '');
        document.getElementById(id).value = auto_gen_handle;
    }

    handleClick = () => {
        this.setState({show_color_picker: !this.state.show_color_picker})
    };

    handleClose = () => {
        this.setState({show_color_picker: false})
    };

    handleChange = (color) => {
        this.setState({color: color.hex})
    };

    render() {
        const {addingPackageTag, workPackages, addingLocationTag, locationTags, disciplineTags} = this.state;
        const styles = reactCSS({
            'default': {
                color: {
                    width: '36px',
                    height: '14px',
                    borderRadius: '2px',
                    background: `${this.state.color}`//`rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})`,
                },
                swatch: {
                    padding: '5px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'absolute',
                    zIndex: '2',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
            },
        });
        return (
            <React.Fragment>
                <div className="container-fluid">
                    <Row className="align-items-center">
                        <Col sm={6}>
                            <div className="page-title-box">
                                <h4 className="font-size-18">Project Tags</h4>
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to="/#">Project Attributes</Link>
                                    </li>
                                    <li className="breadcrumb-item active">Project Tags</li>
                                </ol>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={6}>
                            <Row>
                                <Col sm={12}>
                                    <div className="card">
                                        <div className="card-body">
                                            <h4 className="card-title">Work Package Tags</h4>

                                            <div className="table-responsive">
                                                <table className="table table-striped mb-0">
                                                    <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Work Package Tag</th>
                                                        <th>Handle</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        workPackages.map((item, index) => (
                                                            <tr key={index}>
                                                                <th scope="row">{index + 1}</th>
                                                                <td>{item.tag_name}</td>
                                                                <td>{item.handle}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>

                                            {!addingPackageTag ?
                                                <div className="float-right mt-4">
                                                    <Button
                                                        color="primary"
                                                        className="btn btn-primary waves-effect waves-light"
                                                        onClick={() => this.setState({addingPackageTag: true})}
                                                    >
                                                        Add +
                                                    </Button>
                                                </div>
                                                :
                                                <div className="mt-4">
                                                    <Row className="align-items-end">
                                                        <Col lg="6" className="form-group">
                                                            <Label for="name">Work Package Tag</Label>
                                                            <Input
                                                                ref={(r) => this.package_name = r}
                                                                type="text"
                                                                id="package_name"
                                                                name="package_name"
                                                                onChange={e => this.autoGenerateHandle('package_handle', e)}
                                                            />
                                                        </Col>

                                                        <Col lg="6" className="form-group">
                                                            <Label for="handle">Handle</Label>
                                                            <Input
                                                                ref={(r) => this.package_handle = r}
                                                                type="text"
                                                                id="package_handle"
                                                                name="package_handle"
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <div className="float-right d-flex">
                                                        <Button
                                                            onClick={this.addPackageTag}
                                                            color="primary"
                                                            className="mx-2"
                                                            style={{width: "100%", whiteSpace: "nowrap"}}
                                                        >
                                                            {" "}
                                                            Add Tag{" "}
                                                        </Button>
                                                        <Button
                                                            onClick={() => this.setState({addingPackageTag: false})}
                                                            color="secondary"
                                                            style={{width: "100%"}}
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


                            {/* Discipline Tags */}
                            <Row>
                                <Col sm={12}>
                                    <div className="card">
                                        <div className="card-body">
                                            <h4 className="card-title">Discipline Tags</h4>

                                            <div className="table-responsive">
                                                <table className="table table-striped mb-0">
                                                    <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Discipline Tag</th>
                                                        <th>Color</th>
                                                        <th>Handle</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        disciplineTags.map((item, index) => (
                                                            <tr key={index}>
                                                                <th scope="row">{index + 1}</th>
                                                                <td>{item.tag_name}</td>
                                                                <td>
                                                                    <div style={{
                                                                        width: '36px',
                                                                        height: '14px',
                                                                        borderRadius: '2px',
                                                                        background: item.color
                                                                    }}/>
                                                                </td>
                                                                <td>{item.handle}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>
                                            <Modal
                                                className="modal-lg modal-dialog-centered"
                                                isOpen={this.state.addDisciplineTagModal}
                                                toggle={this.addDisciplineModalHandler}
                                            >
                                                <div className="modal-header">
                                                    <h5
                                                        className="modal-title mt-0"
                                                        id="add_team_modal"
                                                    >
                                                        Discipline Tag
                                                    </h5>
                                                    <button
                                                        onClick={() =>
                                                            this.setState({addDisciplineTagModal: false})
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
                                                    <Row className="align-items-end">
                                                        <Col lg="5" className="form-group">
                                                            <Label for="name">Discipline Tag</Label>
                                                            <Input
                                                                ref={(r) => this.discipline_name = r}
                                                                type="text"
                                                                id="discipline_name"
                                                                name="discipline_name"
                                                                onChange={e => this.autoGenerateHandle('discipline_handle', e)}
                                                            />
                                                        </Col>
                                                        <Col lg="5" className="form-group">
                                                            <Label for="handle">Handle</Label>
                                                            <Input
                                                                ref={(r) => this.discipline_handle = r}
                                                                type="text"
                                                                id="discipline_handle"
                                                                name="discipline_handle"
                                                            />
                                                        </Col>
                                                        <Col lg="2" className="form-group">
                                                            <Label for="handle">Color</Label>
                                                            <div>
                                                                <div style={styles.swatch} onClick={this.handleClick}>
                                                                    <div style={styles.color}/>
                                                                </div>
                                                                {this.state.show_color_picker ? <div style={styles.popover}>
                                                                    <div style={styles.cover} onClick={this.handleClose}/>
                                                                    <CompactPicker
                                                                        value={this.state.show_color_picker}
                                                                        colors={this.state.color_picker}
                                                                        onChange={this.handleChange}
                                                                    />
                                                                </div> : null}
                                                            </div>

                                                        </Col>
                                                    </Row>
                                                </div>
                                                <div className="modal-footer">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={this.addDisciplineTag}
                                                    >
                                                        Add Tag
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        onClick={() =>
                                                            this.setState({addDisciplineTagModal: false})
                                                        }
                                                    >
                                                        Close
                                                    </button>
                                                </div>
                                            </Modal>
                                            <div className="float-right mt-4">
                                                <Button
                                                    type="button"
                                                    onClick={this.addDisciplineModalHandler}
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


                        {/* location Tags */}

                        <Col sm={6}>
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Location Tags</h4>

                                    <div className="table-responsive">
                                        <table className="table table-striped mb-0">
                                            <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Location Tag</th>
                                                <th>Handle</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                locationTags.map((item, index) => (
                                                    <tr key={index}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{item.tag_name}</td>
                                                        <td>{item.handle}</td>
                                                    </tr>
                                                ))
                                            }
                                            </tbody>
                                        </table>
                                    </div>

                                    {!addingLocationTag ?
                                        <div className="float-right mt-4">
                                            <Button
                                                color="primary"
                                                className="btn btn-primary waves-effect waves-light"
                                                onClick={() => this.setState({addingLocationTag: true})}
                                            >
                                                Add +
                                            </Button>
                                        </div>
                                        :
                                        <div className="mt-4">
                                            <Row className="align-items-end">
                                                <Col lg="6" className="form-group">
                                                    <Label for="name">Location Tag</Label>
                                                    <Input
                                                        ref={(r) => this.location_name = r}
                                                        type="text"
                                                        id="location_name"
                                                        name="location_name"
                                                        onChange={e => this.autoGenerateHandle('location_handle', e)}
                                                    />
                                                </Col>

                                                <Col lg="6" className="form-group">
                                                    <Label for="handle">Handle</Label>
                                                    <Input
                                                        ref={(r) => this.location_handle = r}
                                                        type="text"
                                                        id="location_handle"
                                                        name="location_handle"
                                                    />
                                                </Col>
                                            </Row>
                                            <div className="float-right d-flex">
                                                <Button
                                                    onClick={this.addLocationTag}
                                                    color="primary"
                                                    className="mx-2"
                                                    style={{width: "100%", whiteSpace: "nowrap"}}
                                                >
                                                    {" "}
                                                    Add Tag{" "}
                                                </Button>
                                                <Button
                                                    onClick={() => this.setState({addingLocationTag: false})}
                                                    color="secondary"
                                                    style={{width: "100%"}}
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
                </div>
            </React.Fragment>
        );
    }
}

export default ProjectAttributesPage;
