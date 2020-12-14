import React, { Component } from "react";
import SettingMenu from "../Shared/SettingMenu";
import { Row, Col, Label, Input, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { getBackendAPI } from "../../helpers/backend";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

class ProjectAttributesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addingPackageTag: false,
      workPackages: [
        { name: 'Pour1', handle: 'pour1' },
        { name: 'Pour2', handle: 'pour2' }
      ],
      addingLocationTag: false,
      locationTags: [
        { name: 'East', handle: 'east' },
        { name: 'Wast', handle: 'west' }
      ],
      addingDisciplineTag: false,
      disciplineTags: [
        { name: 'Architect', handle: 'architect' },
        { name: 'Client', handle: 'client' }
      ],
    };
    this.init();
  }

  componentDidMount() {}

  init = async() => {
    let attributes = await getBackendAPI().allProjectAttributes();
    console.log('attributes', attributes);
    let workPackages = attributes.filter(item => item.attribute_name === 'Work Package');
    let locationTags = attributes.filter(item => item.attribute_name === 'Location');
    let disciplineTags = attributes.filter(item => item.attribute_name === 'Discipline');
    this.setState({workPackages: workPackages, locationTags: locationTags, disciplineTags: disciplineTags});
  }

  addPackageTag = async() => {
    const { workPackages } = this.state;
    let newWorkPackages = workPackages;
    let package_name_text = document.getElementById('package_name').value.trim();
    let package_handle_text = document.getElementById('package_handle').value.trim();

    if(package_name_text.length && package_handle_text.length){
      if(workPackages.find(workPackage => workPackage.tag_name === package_name_text)){
        return;
      }
      try{
        let attribute = await getBackendAPI().addProjectAttribute('Work Package', package_name_text, package_handle_text);
        if(attribute){
          newWorkPackages.push(attribute);
          this.setState({addingPackageTag: false, workPackages: newWorkPackages});
        }
      } catch(e){

      }
    }
  }

  addLocationTag = async() => {
    const { locationTags } = this.state;
    let newLocationTags = locationTags;
    let location_name_text = document.getElementById('location_name').value;
    let location_handle_text = document.getElementById('location_handle').value;

    if(location_name_text.trim().length && location_handle_text.trim().length){
      if(locationTags.find(location_tag => location_tag.tag_name === location_name_text)){
        return;
      }
      try{
        let attribute = await getBackendAPI().addProjectAttribute('Location', location_name_text, location_handle_text);
        if(attribute){
          newLocationTags.push(attribute);
          this.setState({addingLocationTag: false, locationTags: newLocationTags});
        }
      } catch(e){

      }
    }
  }

  addDisciplineTag = async() => {
    const { disciplineTags } = this.state;
    let newDisciplineTags = disciplineTags;
    let discipline_name_text = document.getElementById('discipline_name').value;
    let discipline_handle_text = document.getElementById('discipline_handle').value;

    if(discipline_name_text.trim().length && discipline_handle_text.trim().length){
      if(disciplineTags.find(disciplineTag => disciplineTag.tag_name === discipline_name_text)){
        return;
      }
      try{
        let attribute = await getBackendAPI().addProjectAttribute('Discipline', discipline_name_text, discipline_handle_text);
        if(attribute){
          newDisciplineTags.push(attribute);
          this.setState({addingDisciplineTag: false, disciplineTags: newDisciplineTags});
        }
      } catch(e){

      }
    }
  }

  autoGenerateHandle = (id, e) => {
    let name = e.target.value;
    let auto_gen_handle = '@' + name.toLowerCase().replace(' ', '');
    document.getElementById(id).value = auto_gen_handle;
  }

  render() {
    const { addingPackageTag, workPackages, addingLocationTag, locationTags, addingDisciplineTag, disciplineTags } = this.state;

    return (
      <React.Fragment>
        <div className="container-fluid">
          <Row className="align-items-center">
            <Col sm={6}>
              <div className="page-title-box">
                <h4 className="font-size-18">Project Attributes</h4>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/#">Project Attributes</Link>
                  </li>
                  <li className="breadcrumb-item active">Project Attributes</li>
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

                        {!addingPackageTag?
                          <div className="float-right mt-4">
                            <Button
                                color="primary"
                                className="btn btn-primary waves-effect waves-light"
                                onClick={()=>this.setState({addingPackageTag: true})}
                              >
                              Add +
                            </Button>
                          </div>
                        :
                        <div className="mt-4">
                          <Row  className="align-items-end">
                            <Col lg="6" className="form-group">
                              <Label for="name">Work Package Tag</Label>
                              <Input
                                ref={(r) => this.package_name=r}
                                type="text"
                                id="package_name"
                                name="package_name"
                                onChange={e => this.autoGenerateHandle('package_handle', e)}
                              />
                            </Col>

                            <Col lg="6" className="form-group">
                              <Label for="handle">Handle</Label>
                              <Input 
                                ref={(r) => this.package_handle=r}
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
                              style={{ width: "100%", whiteSpace: "nowrap" }}
                            >
                              {" "}
                              Add Tag{" "}
                            </Button>
                            <Button
                              onClick={()=>this.setState({addingPackageTag: false})}
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
                              <th>Handle</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              disciplineTags.map((item, index) => (
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

                        {!addingDisciplineTag?
                          <div className="float-right mt-4">
                            <Button
                                color="primary"
                                className="btn btn-primary waves-effect waves-light"
                                onClick={()=>this.setState({addingDisciplineTag: true})}
                              >
                              Add +
                            </Button>
                          </div>
                        :
                        <div>
                          <Row  className="align-items-end">
                            <Col lg="6" className="form-group">
                              <Label for="name">Discipline Tag</Label>
                              <Input
                                ref={(r) => this.discipline_name=r}
                                type="text"
                                id="discipline_name"
                                name="discipline_name"
                                onChange={e => this.autoGenerateHandle('discipline_handle', e)}
                              />
                            </Col>

                            <Col lg="6" className="form-group">
                              <Label for="handle">Handle</Label>
                              <Input 
                                ref={(r) => this.discipline_handle=r}
                                type="text" 
                                id="discipline_handle" 
                                name="discipline_handle"
                                />
                            </Col>
                          </Row>
                            <div className="float-right d-flex">
                              <Button
                                onClick={this.addDisciplineTag}
                                color="primary"
                                className="mx-2"
                                style={{ width: "100%", whiteSpace: "nowrap" }}
                              >
                                {" "}
                                Add Tag{" "}
                              </Button>
                              <Button
                                onClick={()=>this.setState({addingDisciplineTag: false})}
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

                    {!addingLocationTag?
                      <div className="float-right mt-4">
                        <Button
                            color="primary"
                            className="btn btn-primary waves-effect waves-light"
                            onClick={()=>this.setState({addingLocationTag: true})}
                          >
                          Add +
                        </Button>
                      </div>
                    :
                    <div className="mt-4">
                      <Row  className="align-items-end">
                        <Col lg="6" className="form-group">
                          <Label for="name">Location Tag</Label>
                          <Input
                            ref={(r) => this.location_name=r}
                            type="text"
                            id="location_name"
                            name="location_name"
                            onChange={e => this.autoGenerateHandle('location_handle', e)}
                          />
                        </Col>

                        <Col lg="6" className="form-group">
                          <Label for="handle">Handle</Label>
                          <Input 
                            ref={(r) => this.location_handle=r}
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
                          style={{ width: "100%", whiteSpace: "nowrap" }}
                        >
                          {" "}
                          Add Tag{" "}
                        </Button>
                        <Button
                          onClick={()=>this.setState({addingLocationTag: false})}
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
        </div>
      </React.Fragment>
    );
  }
}

export default ProjectAttributesPage;
