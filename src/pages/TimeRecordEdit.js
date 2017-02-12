import React, { Component } from 'react';
import {Glyphicon, InputGroup, Modal, ListGroup, ListGroupItem, Form, Row, PageHeader, ControlLabel, FormControl, FormGroup, Col, Button } from 'react-bootstrap'
import {browserHistory, hashHistory, Link} from 'react-router';
import ToggleDisplay from 'react-toggle-display';
import DayPicker, { DateUtils } from "react-day-picker";
import Moment from 'react-moment';
const url = param => `http://localhost/TimeTracker/api/TimeRecord`
const urlProject = param => `http://localhost/TimeTracker/api/Project`
const urlUser = param => `http://localhost/TimeTracker/api/User`

function sunday(day) {
  return day.getDay() === 0;
}
class TimeRecordEdit extends Component {
    

constructor(props){
    super(props)

    
    this.state = { 
        requestFailed: false, success: false, loading: false,  UserID: "", ProjectID: "", 
        CustomerID: "", Comment: "",
        StartDate: "", StartDateCalendar: null, EndDateCalendar: null,
        showStartDateModal: false,  showEndDateModal: false,
    errors: {}
    }
    this._onChange = this._onChange.bind(this);
    this._onSubmit = this._onSubmit.bind(this); 
    
}

   
componentWillMount()
{   
    debugger;
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
        var moment = require('moment')

        this.setState({UserID: d.UserID, ProjectID: d.ProjectID, StartDate: moment(d.Start).format("DD/MM/YYYY"), EndDate: moment(d.End).format("DD/MM/YYYY"), Comment: d.Comment  })})
    , () => {
        this.setState({ requestFailed: true });
    }
}
   
componentDidMount()
{
    this.getUsersCombo();
    this.getProjectsCombo();
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
    var moment = require('moment')
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
    method: "PUT",
    body: JSON.stringify({
        ProjectID: this.state.ProjectID,
        UserID: this.state.UserID,
        Start: moment(this.state.StartDate),
        End: moment(this.state.EndDate),
        Comment: this.state.Comment
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
    debugger;
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
    if(this.state.StartDate == "") {
      errors.StartDate = "Start Date is required";
    }
    if(this.state.StartDate > this.state.EndDate) {
      errors.StartDate = "Start Date cannot be after End Date";
    }
    return errors;
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

        state[stateName] =  moment(day).format('DD/MM/YYYY');
        state[stateName + "Calendar"] =  day;
    } 
    this.setState(state);
    this.setState({ showStartDateModal: false});
    this.setState({ showEndDateModal: false});
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
      <div>
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
                <Col xs={4}>   
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
                <Col xs={4}>  
                 
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




            <FormGroup validationState={this._formGroupClass(this.state.errors.StartDate)}>
                <Col componentClass={ControlLabel} xs={2} xsOffset={2}>
                    Start Date
                </Col>
                <Col xs={4}>
        
        <InputGroup> 
        <FormControl onChange={this._onChange} id="StartDate" placeholder="Start Date" 
                    value={this.state.StartDate} disabled="true"
                    name="StartDate" ref="StartDate" type="text" />
        <InputGroup.Addon>
        <Button 
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
      </InputGroup>
                    <span className="help-block">{this.state.errors.StartDate}</span>
                </Col> 
          </FormGroup>



    <FormGroup>
                <Col componentClass={ControlLabel} xs={2} xsOffset={2}>
                    End Date
                </Col>
                <Col xs={4}>
        
        <InputGroup> 
        <FormControl onChange={this._onChange} id="EndDate" placeholder="End Date" 
                    value={this.state.EndDate} disabled="true"
                    name="EndDate" ref="EndDate" type="text" />
        <InputGroup.Addon>
        <Button 
          bsSize="xsmall" onClick={() => this.setState({ showEndDateModal: true})}><Glyphicon 
          bsSize="xsmall" glyph="glyphicon glyphicon-calendar" /></Button>
          
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
            <Button onClick={closeEndDateModal}>Close</Button>
          </Modal.Footer>
        </Modal>
        </InputGroup.Addon>
      </InputGroup>
                </Col> 
          </FormGroup>



        <FormGroup>
                <Col componentClass={ControlLabel} xs={2} xsOffset={2}>
                    Comment
                </Col>
                <Col xs={4}>
         
            <FormControl onChange={this._onChange} id="Comment" placeholder="Comment" 
                    value={this.state.Comment} componentClass="textarea" 
                    name="Comment" ref="Comment" />
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
export default TimeRecordEdit;
