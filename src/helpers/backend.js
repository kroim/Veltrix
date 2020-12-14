import { getCall, postCall } from "../apiCall";

class BackendAPI {
  constructor() {
      let token = localStorage.getItem("token");
      console.log('session token', token);
      if(!token) return;
      getCall(
        `{
          me(token: "${token}"){
            _id,
            email,
            name,
            token
          }
        }`, 
        (res) => {
          if (res.me) {
            localStorage.setItem("token", res.me.token);
            localStorage.setItem("authUser", JSON.stringify(res.me));
          } else {
            localStorage.removeItem("authUser");
          }
        });
  }

  /**
   * Registers the user with given details
   */
  registerUser = (email, name, password) => {
    return new Promise((resolve, reject) => {
      postCall(`mutation{
        register(email:"${email}", name:"${name}", password: "${password}"){
            _id,
            email,
            name,
            token
        }
    }`,
      (res) => {
            if(res.register._id){
              resolve(res.register);
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
            if(res.registerFromMember._id){
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
          token
         }
        }`,(user) => {
            resolve(user);
          },
          error => {
            reject(this._handleError(error));
          }
        );
    });
  };

  /**
   * forget Password user with given details
   */
  forgetPassword = email => {
    return new Promise((resolve, reject) => {
      postCall('',() => {
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
      postCall('',() => {
          resolve(true);
        })
        .catch(error => {
          reject(this._handleError(error));
        });
    });
  };

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
          handle
         }
        }`,(res) => {
            if(res.all_project_attributes){
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

   addProjectAttribute = (attribute_name, tag_name, handle) => {
     return new Promise((resolve, reject) => {
      postCall(`mutation{
        add_project_attribute(attribute_name:"${attribute_name}", tag_name:"${tag_name}", handle: "${handle}"){
            _id,
            attribute_name,
            tag_name,
            handle
        }
      }`,
      (res) => {
            if(res.add_project_attribute._id){
              resolve(res.add_project_attribute);
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
        }`,(res) => {
            if(res.teams){
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
            if(res.add_team._id){
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
        }`,(res) => {
            if(res.members){
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
        }`,(res) => {
            if(res.member){
              resolve(res.member);
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
            if(res.add_member._id){
              let newMember = res.add_member;
              postCall(`mutation{
                  send_mail(member_id:"${newMember._id}", email:"${newMember.email}"){
                     result
                  }
                }`,
                (res) => { resolve(newMember); },
                (err) => { reject("Resiger Failed"); });
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
        }`,(res) => {
            if(res.associations){
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
   * Add Member
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
            if(res.add_association._id){
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

export { initBackendAPI, getBackendAPI };
