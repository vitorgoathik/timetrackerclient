import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; 
import { Router, Route, IndexRoute, hashHistory} from "react-router"
import Customer from './pages/Customer.js';
import CustomerNew from './pages/CustomerNew.js';
import CustomerEdit from './pages/CustomerEdit.js';
import Project from './pages/Project.js';
import ProjectNew from './pages/ProjectNew.js';
import ProjectEdit from './pages/ProjectEdit.js';
import User from './pages/User.js';
import UserNew from './pages/UserNew.js';
import UserEdit from './pages/UserEdit.js';
import TimeRecord from './pages/TimeRecord.js';
import TimeRecordNew from './pages/TimeRecordNew.js';
import TimeRecordEdit from './pages/TimeRecordEdit.js';

  const app = document.getElementById('root');
ReactDOM.render(
<Router history={hashHistory}>
  <Route path="/" component={App}> 
    <Route path="customer" component={Customer}></Route>
    <Route path="customerNew" component={CustomerNew}></Route>
    <Route path="customerEdit/:id" component={CustomerEdit}></Route>
    <Route path="project" component={Project}></Route>
    <Route path="projectNew" component={ProjectNew}></Route>
    <Route path="projectEdit/:id" component={ProjectEdit}></Route>
    <Route path="user" component={User}></Route>
    <Route path="userNew" component={UserNew}></Route>
    <Route path="userEdit/:id" component={UserEdit}></Route>
    <Route path="timerecord" component={TimeRecord}></Route>
    <Route path="timerecordNew" component={TimeRecordNew}></Route>
    <Route path="timerecordEdit/:id" component={TimeRecordEdit}></Route>
  </Route>
</Router>
  , app);
