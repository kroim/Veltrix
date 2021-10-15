import React from "react";
import {Redirect} from "react-router-dom";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/FogetPassword";
import CreatePwd from "../pages/Authentication/CreatePassword";

// Dashboard
import Dashboard from "../pages/Dashboard";

// Product Control
import ConstraintsLog from "../pages/ProductControl/constraints-log";
import CommitmentPlan from "../pages/ProductControl/commitment-plan";
import MakeReadyPlan from "../pages/ProductControl/make-ready-plan";
import StandardProcessLibrary from "../pages/ProductControl/standard-process-library";
import Analytics from "../pages/ProductControl/analytics";
import LookAheadPlan from "../pages/ProductControl/look-ahead-plan";

// Digital Design
import DigitalDesignView from "../pages/DigitalDesign/view";

// Project Attributes
import ProjectAttributes from "../pages/ProjectAttributes/project-attributes";

// Project Collaborators
import ProjectCollaborators from "../pages/ProjectCollaborators/collaborators";
import UserCapabilities from "../pages/Admin/user-capabilities";

// Setting
import ChangePassword from "../pages/Settings/change-password";
import ChangeSysPassword from "../pages/Settings/change-sys-password";
import ReasonCodes from "../pages/ProjectReasonCodes/reason-codes";

const adminProtectedRoutes = [
    {path: "/register", component: ChangeSysPassword},
]

const authProtectedRoutes = [
    // Product Control
    {path: "/constraints-log", component: ConstraintsLog},
    {path: "/make-ready-plan", component: MakeReadyPlan},
    {path: "/look-ahead-plan", component: LookAheadPlan},
    {path: "/commitment-plan", component: CommitmentPlan},
    {path: "/standard-process-library", component: StandardProcessLibrary},
    {path: "/analytics", component: Analytics},

    // Digital Design
    {path: "/digital-design-view", component: DigitalDesignView},

    // Project Attributes
    {path: "/project-attributes", component: ProjectAttributes},

    // Project Collaborators
    {path: "/project-collaborators", component: ProjectCollaborators},

    // Reason Codes
    {path: "/reason-codes", component: ReasonCodes},

    // System Admin
    {path: "/user-capabilities", component: UserCapabilities},

    // Dashboard
    {path: "/dashboard", component: Dashboard},

    // Setting
    {path: "/change_password", component: ChangePassword},

    {path: "/", exact: true, component: () => <Redirect to="/dashboard"/>},
];

const publicRoutes = [
    {path: "/logout", component: Logout},
    {path: "/login", component: Login},
    {path: "/forget-password", component: ForgetPwd},
    {path: "/register", component: Register},
    {path: "/create-password", component: CreatePwd}
];

export {authProtectedRoutes, publicRoutes, adminProtectedRoutes};
