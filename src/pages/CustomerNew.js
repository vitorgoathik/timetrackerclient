import React, { Component } from 'react';
import {ListGroup, ListGroupItem, Form, Row, PageHeader, ControlLabel, FormControl, FormGroup, Col, Button } from 'react-bootstrap'
import {browserHistory, hashHistory, Link} from 'react-router';
import ToggleDisplay from 'react-toggle-display';

const url = param => `http://localhost/TimeTracker/api/customer`

class CustomerNew extends Component {
    

constructor(props){
    super(props)

    
    this.state = { 
        requestFailed: false, success: false, loading: false, 
    Name: "", Email: "", Phone: "", Address: "",
    errors: {}
    }
    this._onChange = this._onChange.bind(this);
    this._onSubmit = this._onSubmit.bind(this); 
    
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
    fetch(url(),
{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
        Name: this.state.Name,
        Email: this.state.Email,
        Phone: this.state.Phone,
        Address: this.state.Address
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
        this.setState({ success: d.ok,  Name: "", Email: "", Phone: "", Address: "", errors: {} })
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
    if(this.state.Name == "") {
      errors.Name = "Name is required";
    }
    if(this.state.Email == "") {
      errors.Email = "Email is required";
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
  render() { 
       
  


    return (
      <div>
            <Row className="show-grid">
                    <Col xs={12}>
                        <PageHeader>Customer <small>new</small></PageHeader>
                    </Col>
                </Row>
        <Form horizontal ref='customer_form' onSubmit={this._onSubmit}>
            <FormGroup validationState={this._formGroupClass(this.state.errors.Name)}>
                <Col componentClass={ControlLabel} xs={2} xsOffset={2}>
                    Name
                </Col>
                <Col xs={4}>
                    <FormControl onChange={this._onChange} id="Name" placeholder="Name"
                    value={(this.state.Name)}
                     name="Name" ref="Name" type="text" />
            <span className="help-block">{this.state.errors.Name}</span>
                </Col> 
          </FormGroup>
            <FormGroup validationState={this._formGroupClass(this.state.errors.Email)}>
                <Col componentClass={ControlLabel} xs={2} xsOffset={2}>
                    Email
                </Col>
                <Col xs={4}>
                    <FormControl onChange={this._onChange} id="Email" placeholder="Email" 
                    value={(this.state.Email)}
                    name="Email" ref="Email" type="email" />
                    <span className="help-block">{this.state.errors.Email}</span>
                    
                </Col> 
          </FormGroup>
            <FormGroup>
                <Col componentClass={ControlLabel} xs={2} xsOffset={2}>
                    Phone
                </Col>
                <Col xs={4}>
                    <FormControl onChange={this._onChange} id="Phone" placeholder="Phone" 
                    value={(this.state.Phone)}
                    name="Phone" ref="Phone" type="text" />
                </Col> 
          </FormGroup>
            <FormGroup>
                <Col componentClass={ControlLabel} xs={2} xsOffset={2}>
                    Address
                </Col>
                <Col  xs={4}>
                    <FormControl onChange={this._onChange} id="Address" placeholder="Address" 
                    value={(this.state.Address)}
                    name="Address" ref="Address" type="text" />
                </Col> 
          </FormGroup>
            <FormGroup>
            <Col xsOffset={4} xs={4}>
            <span className="help-block">{this.state.errors.General}</span>
                <Button type="submit" bsStyle="success">Save</Button> <Button bsStyle="primary"><Link to="customer" style={{color:"white", textDecoration: 'none'}}>Back</Link></Button>
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
export default CustomerNew;
