import React, { Component } from 'react';
import '../App.css';
import {Checkbox, Glyphicon, InputGroup, Modal, ListGroup, ListGroupItem, Form, Row, PageHeader, ControlLabel, FormControl, FormGroup, Col, Button } from 'react-bootstrap'
import {browserHistory, hashHistory, Link} from 'react-router';
import ToggleDisplay from 'react-toggle-display';
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
const url = param => `http://localhost/TimeTracker/api/TimeRecord`
const urlProject = param => `http://localhost/TimeTracker/api/Project`
const urlUser = param => `http://localhost/TimeTracker/api/User`

function sunday(day) {
  return day.getDay() === 0;
}
class TimeRecordEdit extends Component {
    

constructor(props){
    super(props)

        var moment = require('moment')
        var today =  moment().format('DD/MM/YYYY');
        var todayJS =  moment().toDate();
    this.state = { 
        requestFailed: false, success: false, loading: false,  UserID: "", ProjectID: "", StartTime: "", EndTime: "",
        CustomerID: "", Comments: "", StartDateDisabled: true, EndDateDisabled: true, 
        StartDate: today, EndDate: today, StartDateCalendar: todayJS, EndDateCalendar: todayJS,
        showStartDateModal: false,  showEndDateModal: false,  StartDateCheckToday: true, EndDateCheckToday: true, EndDateCheckTodayDisabled: false,
    errors: {}
    }
    this._onChange = this._onChange.bind(this);
    this._onSubmit = this._onSubmit.bind(this); 
    this.checkTodayChanged = this.checkTodayChanged.bind(this);
    this.checkNowChanged = this.checkNowChanged.bind(this);
}
   
componentWillMount()
{   
    debugger;
        var moment = require('moment')
    fetch(url() + "?id=" + this.props.params.id)
    .then(response => {
        if(!response.ok)
        {
            throw Error("Network request failed")
        }
        return response;
    })
    .then(d => d.json())
    .then(d => {
        debugger;
            this.setState({
                ProjectID: d.ProjectID, UserID: d.UserID, Comments: d.Comments,
                StartDate: moment(d.Start).format("DD/MM/YYYY"), EndDate: moment(d.End).format("DD/MM/YYYY"),
                StartTime: moment(d.Start).format("HH:mm"), EndTime: moment(d.End).format("HH:mm"),

            })})
    , () => {
        this.setState({ requestFailed: true });
    }
}
componentDidMount()
{ 
    this.getUsersCombo()
    this.getProjectsCombo()
}

getUsersCombo(){
    fetch(urlUser())
    .then(response => {
        if(!response.ok)
        {
            throw Error("Network request failed")
        }
        return response;
    })
    .then(d => d.json())
    .then(d => {
        this.setState({ usersCombo: d.slice() })
    }, () => {
        this.setState({ requestFailed: true });
    })    
}
  
getProjectsCombo(){
    fetch(urlProject())
    .then(response => {
        if(!response.ok)
        {
            throw Error("Network request failed")
        }
        return response;
    })
    .then(d => d.json())
    .then(d => {
        this.setState({ projectsCombo: d.slice() })
    }, () => {
        this.setState({ requestFailed: true });
    })    
}
  
  _onSubmit (e) {
    e.preventDefault();
    debugger;
    this.setState({loading: true});
    var errors = this._validate();
    if(Object.keys(errors).length != 0) {
      this.setState({
        errors: errors
      });
      return;
    } 
    fetch(url() + "?id=" + this.props.params.id,
{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
        ProjectID: this.state.ProjectID,
        UserID: this.state.UserID,
        Start: this.getJsDateTime(this.state.StartDate+ " " +this.state.StartTime),
        End: this.getJsDateTime(this.state.EndDate + " " + this.state.EndTime),
        Comments: this.state.Comments
    })
}).then(response => {
        if(!response.ok)
        {
            throw Error("Network request failed")
        }
        return response;
    })
    .then(d => d.json())
    .then(d => {}, (d) => {
        this.setState({ success: d.ok, errors: {} })
    })
this.setState({loading: false});
  } 
  _onChange (e) {
    var state = {};
    state[e.target.name] =  e.target.value;
    this.setState(state);
  }
  _validate () {
    var errors = {}
    if(this.state.UserID == "") {
      errors.UserID = "User is required";
    }
    if(this.state.ProjectID == "") {
      errors.ProjectID = "Project is required";
    }
    if(!new RegExp(DateRegex).test(this.state.StartDate)) {
      errors.StartDate = "Start Date is invalid. Valid format DD/MM/YYYY";
    }
    if(!new RegExp(DateRegex).test(this.state.EndDate)) {
      errors.EndDate = "End Date is invalid. Valid format DD/MM/YYYY";
    }
    if(!new RegExp(TimeRegex).test(this.state.StartTime)) {
      errors.StartTime = "Start Time is invalid. Valid format HH:MM (24H)";
    }
    if(!new RegExp(TimeRegex).test(this.state.EndTime)) {
      errors.EndTime = "End Time is invalid. Valid format HH:MM (24H)";
    }
    if(this.state.StartDate == "") {
      errors.StartDate = "Start Date is required";
    }
    if(this.state.EndDate == "") {
      errors.StartDate = "End Date is required";
    }
    if(this.state.StartTime == "") {
      errors.StartTime = "Start Time is required";
    }
    if(this.state.EndTime == "") {
      errors.EndTime = "End Time is required";
    }
    if(this.getJsDate(this.state.StartDate) > this.getJsDate(this.state.EndDate)) {
      errors.StartDate = "Start Date cannot be later than End Date";
    }
    if(this.state.StartDate == this.state.EndDate && 
    (errors.StartTime == "" || errors.StartTime == undefined) && (errors.StartDate == "" || errors.StartDate == undefined) 
    && (errors.EndTime == "" || errors.EndTime == undefined) && (errors.EndDate == "" || errors.EndDate == undefined)
    && this.getJsDateTime(this.state.StartDate+ " " +this.state.StartTime) > this.getJsDateTime(this.state.EndDate + " " + this.state.EndTime)) {
      errors.StartDate = "Start Time cannot be later than End Time when Dates are the same";
    }
    return errors;
  }
  getJsDate(date){
      debugger;
      var moment = require("moment");
      return moment(date,"DD/MM/YYYY").toDate()
  }
  getJsDateTime(date){
      debugger;
      var moment = require("moment");
      return moment(date,"DD/MM/YYYY HH:mm").toDate()
  }
  _formGroupClass (field) {
    var className = null;
    if(field) {
      className = "error"
    }
    return className;
  }
   handleDayStartClick(e, day, { selected, disabled }) {
       this.handleDayClick(e, "StartDate", day, { selected, disabled })
   }
   handleDayEndClick(e, day, { selected, disabled }) {
       this.handleDayClick(e, "EndDate", day, { selected, disabled })
   }
   handleDayClick(e, stateName, day, { selected, disabled }) {
       debugger;
    if (disabled) {
      return;
    }
    var state = {};
    if (selected) {
        state[stateName] =  null; 
    } else {
        var moment = require('moment')
        state[stateName] = moment(day).format('DD/MM/YYYY');
        state[stateName + "Calendar"] = day;
    } 
    this.setState(state);
    this.setState({ showStartDateModal: false});
    this.setState({ showEndDateModal: false});
  }

  checkTodayChanged (e)
  {
      debugger;
    var moment = require("moment")
    var state = {};
    state[e.target.name + "Disabled"] =  e.target.checked;
    state[e.target.name + "CheckToday"] =  e.target.checked;
    state[e.target.name] = moment().format("DD/MM/YYYY");
    state[e.target.name + "Calendar"] = moment().toDate();
    this.setState(state);
  }
  checkNowChanged (e)
  {
      debugger;
    var moment = require("moment")
        var today =  moment().format('DD/MM/YYYY');
    
this.setState({EndDateCheckTodayDisabled:e.target.checked, EndDateCheckToday: true,
          EndTime: moment().format("HH:mm"), 
          EndDateDisabled:e.target.checked, EndDate:today});
  }
  render() { 
       let closeStartDateModal = () => this.setState({ showStartDateModal: false});
       let closeEndDateModal = () => this.setState({ showEndDateModal: false}); 

    if (!this.state.projectsCombo) {
        return <p>Loading Customers Select</p>
    }  
    if (!this.state.usersCombo) {
        return <p>Loading Customers Select</p>
    }  

    return (
      <div  className="modal-container">
            <Row className="show-grid">
                    <Col xs={12}>
                        <PageHeader>Time Record <small>edit</small></PageHeader>
                    </Col>
                </Row>
        <Form horizontal ref='TimeRecord_form' onSubmit={this._onSubmit}>
            <FormGroup validationState={this._formGroupClass(this.state.errors.UserID)}>
                <Col componentClass={ControlLabel} xs={2} xsOffset={2}>
                    User
                </Col>
                <Col xs={5}>   
            <FormControl componentClass="select" 
            name="UserID" ref="UserID" type="UserID" 
            value={(this.state.UserID)} onChange={this._onChange} >
                <option value="">Select an User</option>
                {this.state.usersCombo.map((user) => {
                    return <option value={user.UserID}>{user.Name}</option>;
                })}
            </FormControl>
                    <span className="help-block">{this.state.errors.UserID}</span>
                </Col> 
          </FormGroup>

           <FormGroup validationState={this._formGroupClass(this.state.errors.ProjectID)}>
                <Col componentClass={ControlLabel} xs={2} xsOffset={2}>
                    Project
                </Col>
                <Col xs={5}>  
                 
            <FormControl componentClass="select" 
            name="ProjectID" ref="ProjectID" type="ProjectID" 
            value={(this.state.ProjectID)} onChange={this._onChange} >
                <option value="">Select a Project</option>
                {this.state.projectsCombo.map((project) => {
                    return <option value={project.ProjectID}>{project.Name}</option>;
                })}
            </FormControl>
                    <span className="help-block">{this.state.errors.ProjectID}</span>
                </Col> 
          </FormGroup>




            <FormGroup validationState={this._formGroupClass(this.state.errors.StartDate) || this._formGroupClass(this.state.errors.StartTime)}>
                <Col componentClass={ControlLabel} xs={2} xsOffset={2}>
                    Start Date/Time
                </Col>
                <Col xs={5}>
        
        <InputGroup> 
        <InputGroup.Addon>
        <FormControl onChange={this._onChange} id="StartDate" placeholder="Start Date" 
                    value={this.state.StartDate} disabled={this.state.StartDateDisabled}
                    name="StartDate" ref="StartDate" type="text" />
        </InputGroup.Addon>
        <InputGroup.Addon>
        <Button disabled={this.state.StartDateDisabled}
          bsSize="xsmall" onClick={() => this.setState({ showStartDateModal: true})}><Glyphicon 
          bsSize="xsmall" glyph="glyphicon glyphicon-calendar" /></Button>
          
        <Modal
          show={this.state.showStartDateModal}
          onHide={closeStartDateModal}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">Start Date</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DayPicker 
        initialMonth={ new Date(2017, 1) }
        disabledDays={ sunday }
        selectedDays={ day => DateUtils.isSameDay(this.state.StartDateCalendar, day) }
        onDayClick={ this.handleDayStartClick.bind(this) }
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={closeStartDateModal}>Close</Button>
          </Modal.Footer>
        </Modal>
        </InputGroup.Addon>

        <InputGroup.Addon>
        <FormControl onChange={this._onChange} id="StartTime" placeholder="Time (24H)" 
                    value={this.state.StartTime} 
                    name="StartTime" ref="StartTime" type="text" />
        </InputGroup.Addon>
        <InputGroup.Addon>
        <Checkbox checked={this.state.StartDateCheckToday} onClick={this.checkTodayChanged} name="StartDate">
            Today
        </Checkbox>
        </InputGroup.Addon>
      </InputGroup>
                    <span className="help-block">{this.state.errors.StartDate}</span>
                    <span className="help-block">{this.state.errors.StartTime}</span>
                </Col> 
          </FormGroup>



    <FormGroup validationState={this._formGroupClass(this.state.errors.EndDate) || this._formGroupClass(this.state.errors.EndTime)}>
                <Col componentClass={ControlLabel} xs={2} xsOffset={2}>
                    End Date/Time
                </Col>
                <Col xs={5}>
        
        <InputGroup> 
        <InputGroup.Addon>
        <FormControl onChange={this._onChange} id="EndDate" placeholder="End Date" 
                    value={this.state.EndDate} disabled={this.state.EndDateDisabled}
                    name="EndDate" ref="EndDate" type="text" />
        
        </InputGroup.Addon>
        <InputGroup.Addon>
        <Button disabled={this.state.EndDateDisabled}
          bsSize="xsmall" onClick={() => this.setState({ showEndDateModal: true})}><Glyphicon 
           glyph="glyphicon glyphicon-calendar" /></Button>
          
        </InputGroup.Addon>
        <Modal
          show={this.state.showEndDateModal}
          onHide={closeEndDateModal}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">End Date</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DayPicker 
        initialMonth={ new Date(2017, 1) }
        disabledDays={ sunday }
        selectedDays={ day => DateUtils.isSameDay(this.state.EndDateCalendar, day) }
        onDayClick={ this.handleDayEndClick.bind(this) }
            />
          </Modal.Body>
          <Modal.Footer>
            
            <Button onClick={()=>this.setState({ EndDate:"", EndDateCalendar:""})}>Clear</Button> <Button onClick={closeEndDateModal}>Close</Button>
          </Modal.Footer>
        </Modal>
        <InputGroup.Addon>
        <FormControl onChange={this._onChange} id="EndTime" placeholder="Time (24H)" disabled={this.state.EndTime}
                    value={this.state.EndTime} disabled={this.state.EndTimeDisabled}
                    name="EndTime" ref="EndTime" type="text" />
        </InputGroup.Addon>
        <InputGroup.Addon>
        <Checkbox checked={this.state.EndDateCheckToday} disabled={this.state.EndDateCheckTodayDisabled} onClick={this.checkTodayChanged} name="EndDate">
            Today
        </Checkbox>
        <Checkbox onClick={this.checkNowChanged} name="EndTime" >
            Now
        </Checkbox>
        </InputGroup.Addon>
      </InputGroup>
                    <span className="help-block">{this.state.errors.EndDate}</span>
                    <span className="help-block">{this.state.errors.EndTime}</span>
                </Col> 
          </FormGroup>



        <FormGroup>
                <Col componentClass={ControlLabel} xs={2} xsOffset={2}>
                    Comments
                </Col>
                <Col xs={5}>
         
            <FormControl onChange={this._onChange} id="Comments" placeholder="Comments" 
                    value={this.state.Comments} componentClass="textarea" 
                    name="Comments" ref="Comments" />
                </Col> 
          </FormGroup>


            <FormGroup>
            <Col xsOffset={4} xs={4}>
            <span className="help-block">{this.state.errors.General}</span>
                <Button type="submit" bsStyle="success">Save</Button> <Button bsStyle="primary"><Link to="TimeRecord" style={{color:"white", textDecoration: 'none'}}>Back</Link></Button>
            </Col>
            </FormGroup>
            <ToggleDisplay show={this.state.success}>
                <ListGroup>
                    <ListGroupItem bsStyle="success">Success</ListGroupItem> 
                </ListGroup>
            </ToggleDisplay>
 
        </Form>
        
     </div>
    );

  }



}

var DateRegex = "^(?:(?:31(\\/|-|\\.)(?:0?[13578]|1[02]))\\1|(?:(?:29|30)(\\/|-|\\.)(?:0?[1,3-9]|1[0-2])\\2))(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:29(\\/|-|\\.)0?2\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)(?:(?:0?[1-9])|(?:1[0-2]))\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$";
var TimeRegex = "^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$";
export default TimeRecordEdit;
