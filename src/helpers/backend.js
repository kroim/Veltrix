import {getCall, postCall} from "../apiCall";

class BackendAPI {
    fetchUser = (token) => {
        return new Promise((resolve, reject) => {
            getCall(`{
                  me(token: "${token}"){
                    _id,
                    email,
                    name,
                    role,
                    token
                  }
                }`,
                (res) => {
                    if (res.me) {
                        localStorage.setItem("token", res.me.token);
                        localStorage.setItem("authUser", JSON.stringify(res.me));
                        resolve(res.me);
                    } else {
                        localStorage.removeItem("authUser");
                        reject("Fetch Failed");
                    }
                },
                error => {
                    reject(this._handleError(error));
                });
        });
    }
    /**
     * Registers the user with given details
     */
    registerUser = (email, name, password, role) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
        register(email:"${email}", name:"${name}", password: "${password}", role: "${role}"){
            _id,
            email,
            name,
            role,
            token
        }
    }`,
                (res) => {
                    if (res.register._id) {
                        resolve(res.register);
                    } else {
                        reject("Register Failed");
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    };

    /**
     * Registers the user with Mail
     */
    registerUserByMail = (email, name, password, member_id) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
        registerFromMember(email:"${email}", name:"${name}", password: "${password}", member_id: "${member_id}"){
            _id,
            email,
            name,
            token
        }
    }`,
                (res) => {
                    if (res.registerFromMember._id) {
                        resolve(res.registerFromMember);
                    } else {
                        reject("Resiger Failed");
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    };

    /**
     * Login user with given details
     */
    loginUser = (name, password) => {
        return new Promise((resolve, reject) => {
            getCall(`{
        login(name:"${name}", password:"${password}"){
          _id,
          email,
          name,
          role,
          token
         }
        }`, (user) => {
                    resolve(user);
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    };

    /**
     * Login user with given details
     */
    checkPass = ({name, password}) => {
        return new Promise((resolve, reject) => {
            getCall(`{
        check(name:"${name}", password:"${password}"){
          success
         }
        }`, (res) => {
                    resolve(res.check);
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    };

    /**
     * Login user with given details
     */
    checkSysPass = ({password}) => {
        return new Promise((resolve, reject) => {
            getCall(`{
        checkSysPass(password:"${password}"){
          success
         }
        }`, (res) => {
                    resolve(res.checkSysPass);
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    };

    changePassword = (_id, oldpass, newpass) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
        changePassword(_id:"${_id}", oldpass:"${oldpass}", newpass: "${newpass}"){
            success
        }
    }`,
                (res) => {
                    if (res.changePassword) {
                        resolve(res.changePassword);
                    } else {
                        reject("change password failed");
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }

    changeSysPassword = (oldpass, newpass) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
        changeSysPassword(oldpass:"${oldpass}", newpass: "${newpass}"){
            success
        }
    }`,
                (res) => {
                    if (res.changeSysPassword) {
                        resolve(res.changeSysPassword);
                    } else {
                        reject("change system password failed");
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }

    /**
     * forget Password user with given details
     */
    forgetPassword = email => {
        return new Promise((resolve, reject) => {
            postCall('', () => {
                console.log("yes authutils");
                resolve(true);
            })
                .catch(error => {
                    reject(this._handleError(error));
                });
        });
    };

    /**
     * Logout the user
     */
    logout = () => {
        return new Promise((resolve, reject) => {
            postCall('', () => {
                resolve(true);
            })
                .catch(error => {
                    reject(this._handleError(error));
                });
        });
    };

    reset = () => {
        return new Promise((resolve, reject) => {
            getCall(`{
        reset{
          success
         }
        }`, (res) => {
                    if (res.reset) {
                        resolve(res.reset);
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }

    setLoggeedInUser = user => {
        localStorage.setItem("authUser", JSON.stringify(user));
    };

    /**
     * Returns the authenticated user
     */
    getAuthenticatedUser = () => {
        if (!localStorage.getItem("authUser")) return null;
        return JSON.parse(localStorage.getItem("authUser"));
    };

    /**
     * Return All Project Attributes
     */
    allProjectAttributes = () => {
        return new Promise((resolve, reject) => {
            getCall(`{
        all_project_attributes{
          _id,
          attribute_name,
          tag_name,
          handle,
          color
         }
        }`, (res) => {
                    if (res.all_project_attributes) {
                        resolve(res.all_project_attributes);
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }

    /**
     * Add Project Attribute
     */

    addProjectAttribute = (attribute_name, tag_name, handle, color) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
        add_project_attribute(attribute_name:"${attribute_name}", tag_name:"${tag_name}", handle: "${handle}", color: "${color}"){
            _id,
            attribute_name,
            tag_name,
            handle,
            color
        }
      }`,
                (res) => {
                    if (res.add_project_attribute._id) {
                        resolve(res.add_project_attribute);
                    } else {
                        reject("Register Failed");
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }

    /**
     * Return All Teams
     */
    getTeams = () => {
        return new Promise((resolve, reject) => {
            getCall(`{
        teams{
          _id,
          name,
          abrv,
          handle,
          planning
         }
        }`, (res) => {
                    if (res.teams) {
                        resolve(res.teams);
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }

    /**
     * Add Team
     */

    addTeam = (name, abrv, handle, planning) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
        add_team(name:"${name}", abrv:"${abrv}", handle: "${handle}", planning: "${planning}"){
            _id,
            name,
            abrv,
            handle,
            planning
        }
      }`,
                (res) => {
                    if (res.add_team._id) {
                        resolve(res.add_team);
                    } else {
                        reject("Resiger Failed");
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }

    /**
     * Return All Members
     */
    getMembers = () => {
        return new Promise((resolve, reject) => {
            getCall(`{
        members{
          _id,
          first_name,
          last_name,
          abrv,
          handle,
          email
         }
        }`, (res) => {
                    if (res.members) {
                        resolve(res.members);
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }


    /**
     * Return Member
     */
    getMember = (id) => {
        return new Promise((resolve, reject) => {
            getCall(`{
        member(id:"${id}"){
          _id,
          first_name,
          last_name,
          abrv,
          handle,
          email,
          is_registered
         }
        }`, (res) => {
                    if (res.member) {
                        resolve(res.member);
                    } else {
                        reject('failed');
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }

    /**
     * Add Member
     */

    addMember = (first_name, last_name, abrv, handle, email) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
        add_member(first_name:"${first_name}", last_name:"${last_name}", abrv:"${abrv}", handle: "${handle}", email: "${email}"){
            _id,
            first_name,
            last_name,
            abrv,
            handle,
            email
        }
      }`,
                (res) => {
                    if (res.add_member._id) {
                        let newMember = res.add_member;
                        postCall(`mutation{
                  send_mail(member_id:"${newMember._id}", email:"${newMember.email}"){
                     result
                  }
                }`,
                            (res) => {
                                resolve(newMember);
                            },
                            (err) => {
                                reject("Resiger Failed");
                            });
                    } else {
                        reject("Resiger Failed");
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }

    /**
     * Return All Associations
     */
    getAssociations = () => {
        return new Promise((resolve, reject) => {
            getCall(`{
        associations{
          _id,
          team_id,
          member_id,
          role,
          team{
            name
          },
          member{
            first_name,
            last_name
          }
         }
        }`, (res) => {
                    if (res.associations) {
                        resolve(res.associations);
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }

    /**
     * Add Association
     */

    addAssociation = (team_id, member_id, role) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
        add_association(team_id:"${team_id}", member_id:"${member_id}", role: "${role}"){
            _id,
            team_id,
            member_id,
            role,
            team{
              name
            },
            member{
              first_name,
              last_name
            }
        }
      }`,
                (res) => {
                    if (res.add_association._id) {
                        resolve(res.add_association);
                    } else {
                        reject("Resiger Failed");
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }

    /**
     * Return All Projects
     */
    getProjects = () => {
        return new Promise((resolve, reject) => {
            getCall(`{
        projects{
          _id,
          name,
          description,
          created_by_id,
          created_by{
            name
          },
          is_locked,
          plans{
            _id,
            name,
            description,
            created_by_id,
            created_by{
                name
            },
            teams,
            packages,
            locations,
            is_locked
          }
         }
        }`, (res) => {
                    if (res.projects) {
                        resolve(res.projects);
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }

    /**
     * Add Project
     */

    addProject = ({name, description, created_by_id, is_locked}) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
        add_project(name:"${name}", description:"${description}", created_by_id: "${created_by_id}", is_locked: ${is_locked}){
            _id,
            name,
            description,
            created_by_id,
            created_by{
                name
            },
            is_locked,
            plans{
                _id,
                name,
                description,
                created_by_id,
                created_by{
                    name
                },
                teams,
                packages,
                locations,
                is_locked
              }
        }
      }`,
                (res) => {
                    if (res.add_project._id) {
                        resolve(res.add_project);
                    } else {
                        reject("Add Project Failed");
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }

    /**
     * Update Project
     */

    updateProject = ({_id, name, description, created_by_id, is_locked}) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
        update_project(_id: "${_id}", name:"${name}", description:"${description}", created_by_id: "${created_by_id}", is_locked: ${is_locked}){
            _id,
            name,
            description,
            created_by_id,
            created_by{
                name
            },
            is_locked,
            plans{
                _id,
                name,
                description,
                created_by_id,
                created_by{
                    name
                },
                teams,
                packages,
                locations,
                is_locked
              }
            }
          }`,
                (res) => {
                    if (res.update_project._id) {
                        resolve(res.update_project);
                    } else {
                        reject("Update Project Failed");
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }

    /**
     * Delete Project
     */

    deleteProject = (_id) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
        delete_project(_id: "${_id}"){
            success
        }
      }`,
                (res) => {
                    if (res.delete_project.success) {
                        resolve(true);
                    } else {
                        reject("Delete Project Failed");
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }


    /**
     * Return All Plans
     */
    getPlans = () => {
        return new Promise((resolve, reject) => {
            getCall(`{
        plans{
          _id,
          project_id,
          name,
          description,
          created_by_id,
          created_by{
            name
          },
          teams,
          packages,
          locations,
          is_locked
         }
        }`, (res) => {
                    if (res.plans) {
                        resolve(res.plans);
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }

    /**
     * Add Plan
     */

    addPlan = ({project_id, name, description, created_by_id, teams, packages, locations, is_locked}) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
        add_plan(project_id:"${project_id}", name:"${name}", description:"${description}", created_by_id: "${created_by_id}", teams: "${teams}", packages: "${packages}", locations: "${locations}", is_locked: ${is_locked}){
            _id,
            project_id,
            name,
            description,
            created_by_id,
            created_by{
              name
            },
            teams,
            packages,
            locations,
            is_locked
        }
      }`,
                (res) => {
                    if (res.add_plan._id) {
                        resolve(res.add_plan);
                    } else {
                        reject("Add Plan Failed");
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }

    /**
     * Update Plan
     */

    updatePlan = ({_id, name, description, created_by_id, teams, packages, locations, is_locked}) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
        update_plan(_id: "${_id}", name:"${name}", description:"${description}", created_by_id: "${created_by_id}", teams: "${teams}", packages: "${packages}", locations: "${locations}", is_locked: ${is_locked}){
            _id,
            project_id,
            name,
            description,
            created_by_id,
            created_by{
                name
            },
            teams,
            packages,
            locations,
            is_locked
        }
      }`,
                (res) => {
                    if (res.update_plan._id) {
                        resolve(res.update_plan);
                    } else {
                        reject("Update Plan Failed");
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }

    /**
     * Delete Plan
     */

    deletePlan = (_id) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
        delete_plan(_id: "${_id}"){
            success
        }
      }`,
                (res) => {
                    if (res.delete_plan.success) {
                        resolve(true);
                    } else {
                        reject("Delete Plan Failed");
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }

    //-------------2021-09-23 Alex-----------------

    addReasonCodes = (ref_id, reason, description) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
        add_reason_codes(ref_id:"${ref_id}", reason:"${reason}", description: "${description}"){
            _id,
            ref_id,
            reason,
            description
        }
      }`,
                (res) => {
                    if (res.add_reason_codes._id) {
                        resolve(res.add_reason_codes);
                    } else {
                        reject("Register Failed");
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }

    /**
     * Get Reason Codes
     * @returns {Promise<unknown>}
     */
    getReasonCodes = () => {
        return new Promise((resolve, reject) => {
            getCall(`{
        reason_codes{
          _id,
          ref_id,
          reason,
          description
         }
        }`, (res) => {
                    if (res.reason_codes) {
                        resolve(res.reason_codes);
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }

    addComment = (content, user_id, constraint_id) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
                add_comment(constraint_id:"${constraint_id}", user_id:"${user_id}", content:"${content}"){
                    _id,
                    constraint_id,
                    user_id,
                    content,
                    comment_date,
                    user{
                        name
                    }
                }
            }`, (res) => {
                if (res.add_comment._id) {
                    resolve(res.add_comment);
                } else {
                    reject("Register Failed");
                }
            }, error => {
                reject(this._handleError(error));
            });
        });
    }

    addCheckList = (checklist, constraint_id) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
                add_checkList(constraint_id: "${constraint_id}", check_list: "${checklist}"){
                    _id
                }
            }`, (res) => {
                if (res.add_checkList._id) {
                    resolve(res.add_checkList);
                } else {
                    reject("Register Failed");
                }
            }, error => {
                reject(this._handleError(error));
            })
        })
    }

    updateConstraint = (constraint_id, constraint) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
                update_constraint(constraint_id: "${constraint_id}", constraint: "${constraint}"){
                    _id
                }
            }`, (res) => {
                if (res.update_constraint._id) {
                    resolve(res.update_constraint);
                } else {
                    reject("Register Failed");
                }
            }, error => {
                reject(this._handleError(error));
            });
        });
    }

    updateConstraintContent = (constraint_id, checked_list) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
                update_constraint_content(constraint_id: "${constraint_id}", checked_list: "${checked_list}"){
                    _id
                }
            }`, (res) => {
                if (res.update_constraint_content._id) {
                    resolve(res.update_constraint_content);
                } else {
                    reject("Register Failed");
                }
            }, error => {
                reject(this._handleError(error));
            })

        });
    }

    addConstraint = (constraint, initiated_by, team, workPackage, checklist, status) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
        add_constraints(constraint:"${constraint}", initiated_by:"${initiated_by}", team: "${team}", work_packages: "${workPackage}", check_list: "${checklist}", status: ${status}){
            _id,
            constraint,
            initiated_by,
            team,
            work_packages,
            check_list,
            checked_list,
            comments{               
                content,
                comment_date,
                user{
                    name
                }
            },
            status,
            team_info{
                name
            },
            user{
                email
            },
            work_package_info{
                tag_name
            }
        }
      }`, (res) => {
                if (res.add_constraints._id) {
                    resolve(res.add_constraints);
                } else {
                    reject("Register Failed");
                }
            }, error => {
                reject(this._handleError(error));
            });
        });
    }


    getAllConstraints = () => {
        return new Promise((resolve, reject) => {
            getCall(`{
        constraints{
          _id,
          constraint,
          initiated_by,
          team,
          work_packages,
          check_list,
          checked_list,
          comments{           
            content,
            comment_date,
            user{
                name
            }
          },
          status,
          team_info{
            name
          },
          user{
            email
          },
          work_package_info{
            tag_name
          }
         }
        }`, (res) => {
                if (res.constraints) {
                    resolve(res.constraints);
                }
            }, error => {
                reject(this._handleError(error));
            })
        });
    }

    updateConstraintsPosition = ({_id, target, source, user_id}) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
        update_constraints_position(_id: "${_id}", from: ${source}, to: ${target}, user_id: "${user_id}"){
            _id
          }
          }`, (res) => {
                if (res.update_constraints_position._id) {
                    resolve(res.update_constraints_position);
                } else {
                    reject("Update Constraint Failed");
                }
            }, error => {
                reject(this._handleError(error));
            })
        });
    }

    // Task
    addTask = ({type, text, end_date, duration, project_id, plan_id, work_package_id, location_id, team_id, status_code, discipline_id, crew_size, wbs_code, progress}) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
        add_task(type:"${type}", text:"${text}", end_date: "${end_date}", duration: ${duration}, project_id: "${project_id}", plan_id: "${plan_id}", 
        work_package_id: "${work_package_id}", location_id: "${location_id}", team_id: "${team_id}", status_code: ${status_code}, discipline_id: ${discipline_id?`"${discipline_id}"`:discipline_id}, crew_size: ${crew_size}, wbs_code: "${wbs_code}", progress: ${progress}){
            _id,
            type,
            text,
            end_date,
            duration,
            project_id,
            plan_id,
            work_package_id,
            location_id,
            team_id,
            discipline_id,
            status_code,
            crew_size,
            wbs_code,
            progress,
            team_info{
                name
            },
            work_package_info{
                tag_name
            },
            project_info{
                name
            },
            plan_info{
                name
            },
            location_info{
                tag_name
            },
            discipline_info{
                tag_name
            }
        }
      }`, (res) => {
                if (res.add_task._id) {
                    resolve(res.add_task);
                } else {
                    reject("Register Failed");
                }
            }, error => {
                reject(this._handleError(error));
            });
        });
    }

    updateTask = ({_id, type, text, end_date, duration, project_id, plan_id, work_package_id, location_id, team_id, status_code, discipline_id, crew_size, wbs_code, progress}) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
        update_task(_id: "${_id}", type:"${type}", text:"${text}", end_date: "${end_date}", duration: ${duration}, project_id: "${project_id}", plan_id: "${plan_id}",
        work_package_id: "${work_package_id}", location_id: "${location_id}", team_id: "${team_id}", status_code: ${status_code}, discipline_id: ${discipline_id?`"${discipline_id}"`:discipline_id}, crew_size: ${crew_size}, wbs_code: "${wbs_code}", progress: ${progress}){
            _id,
            type,
            text,
            end_date,
            duration,
            project_id,
            plan_id,
            work_package_id,
            location_id,
            team_id,
            discipline_id,
            status_code,
            crew_size,
            wbs_code,
            progress,
            team_info{
                name
            },
            work_package_info{
                tag_name
            },
            project_info{
                name
            },
            plan_info{
                name
            },
            location_info{
                tag_name
            },
            discipline_info{
                tag_name
            }
        }
      }`, (res) => {
                if (res.update_task._id) {
                    resolve(res.update_task);
                } else {
                    reject("Register Failed");
                }
            }, error => {
                reject(this._handleError(error));
            });
        });
    }

    /**
     * Return All Tasks
     */
    getTasks = () => {
        return new Promise((resolve, reject) => {
            getCall(`{
        tasks{
            _id,
            type,
            text,
            end_date,
            duration,
            project_id,
            plan_id,
            work_package_id,
            location_id,
            team_id,
            discipline_id,
            status_code,
            crew_size,
            wbs_code,
            progress,
            project_info{
                name
            },
            plan_info{
                name
            },
            team_info{
                name
            },
            work_package_info{
                tag_name
            },
            location_info{
                tag_name
            },
            discipline_info{
                tag_name
            }
         }
        }`, (res) => {
                    if (res.tasks) {
                        resolve(res.tasks);
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }

    /**
     * Delete Task
     */

    deleteTask = (_id) => {
        return new Promise((resolve, reject) => {
            postCall(`mutation{
        delete_task(_id: "${_id}"){
            success
        }
      }`,
                (res) => {
                    if (res.delete_task.success) {
                        resolve(true);
                    } else {
                        reject("Delete Task Failed");
                    }
                },
                error => {
                    reject(this._handleError(error));
                }
            );
        });
    }

    //-------------2021-09-23 Alex-----------------
    /**
     * Handle the error
     * @param {*} error
     */
    _handleError(error) {
        // var errorCode = error.code;
        var errorMessage = error.message;
        return errorMessage;
    }
}

let _backendAPI = null;

/**
 * Initilize the backend
 * @param {*} config
 */
const initBackendAPI = () => {
    if (!_backendAPI) {
        _backendAPI = new BackendAPI();
    }
    return _backendAPI;
};

/**
 * Returns the backend
 */
const getBackendAPI = () => {
    return _backendAPI;
};

export {initBackendAPI, getBackendAPI};
