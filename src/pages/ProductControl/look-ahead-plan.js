import React, { Component } from "react";
import {connect} from "react-redux";
import Gantt from "../../components/Gantt";
import {getBackendAPI} from "../../helpers/backend";


class LookAheadPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            workPackages: [],
            reasonCodes: [],
            locations: [],
            plans: [],
            projects: [],
            disciplines: [],
            loading: true
        }
        this.init();
    }

    init = async () => {
        let teams = await getBackendAPI().getTeams();
        let attributes = await getBackendAPI().allProjectAttributes();
        let reasonCodes = await getBackendAPI().getReasonCodes();
        let plans = await getBackendAPI().getPlans();
        let projects = await getBackendAPI().getProjects();
        let workPackages = attributes.filter(item => item.attribute_name === 'Work Package');
        let locations = attributes.filter(item => item.attribute_name === 'Location');
        let disciplines = attributes.filter(item => item.attribute_name === 'Discipline');

        this.setState({
            teams: teams,
            workPackages: workPackages,
            reasonCodes: reasonCodes,
            locations: locations,
            plans: plans,
            projects: projects,
            disciplines: disciplines,
            loading: false
        });
        console.log('data', this.state.data);
    }

    render() {
        const {teams, workPackages, reasonCodes, locations, plans, projects, disciplines, loading} = this.state;

        return (
          <React.Fragment>
              <div>
                  <div className="gantt-container">
                      {
                          !loading &&
                          <Gantt
                              teams={teams}
                              workPackages={workPackages}
                              reasonCodes={reasonCodes}
                              locations={locations}
                              plans={plans}
                              projects={projects}
                              disciplines={disciplines}
                          />
                      }
                  </div>
              </div>
          </React.Fragment>
        );
    }
}


const mapStateToProps = state => {
    return {
        user: state.Login.user
    }
}

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(LookAheadPlan);
