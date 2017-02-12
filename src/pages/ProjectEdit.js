import React, { Component } from 'react';
import {ListGroup, ListGroupItem, Form, Row, PageHeader, ControlLabel, FormControl, FormGroup, Col, Button } from 'react-bootstrap'
import {browserHistory, hashHistory, Link} from 'react-router';
import ToggleDisplay from 'react-toggle-display';

const url = param => `http://localhost/TimeTracker/api/Project`
const urlCustomer = param => `http://localhost/TimeTracker/api/Customer`

class ProjectEdit extends Component {
    

constructor(props){
    super(props)

    
    this.state = { 
        requestFailed: false, success: false, loading: false, 
    Name: "", CustomerID: "", CostPerHour: "", Address: "", 
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
        debugger;
            this.setState({Name: d.Name, CustomerID: d.CustomerID, CostPerHour: d.CostPerHour, Address: d.Address })})
    , () => {
        this.setState({ requestFailed: true });
    }
}
componentDidMount()
{
    this.getCustomersCombo();
}

getCustomersCombo(){
    fetch(urlCustomer())
    .then(response => {
        if(!response.ok)
        {
            throw Error("Network request failed")
        }
        return response;
    })
    .then(d => d.json())
    .then(d => {
        this.setState({ customersCombo: d.slice() })
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
    method: "PUT",
    body: JSON.stringify({
        Name: this.state.Name,
        CustomerID: this.state.CustomerID,
        CostPerHour: this.state.CostPerHour,
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
    if(this.state.Name == "") {
      errors.Name = "Name is required";
    }
    if(this.state.CustomerID == "") {
      errors.CustomerID = "Customer is required";
    }
    if(this.state.CostPerHour == "") {
      errors.CostPerHour = "Cost per Hour is required";
    }
    if(new RegExp("\d+(\.\d{1,2})?").test(this.state.CostPerHour)) {
      errors.CostPerHour = "Cost is not in the decimal format x.xx";
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
       
    if (!this.state.customersCombo) {
        return <p>Loading Customers Select</p>
    }  

    return (
      <div>
            <Row className="show-grid">
                    <Col xs={12}>
                        <PageHeader>Project <small>edit</small></PageHeader>
                    </Col>
                </Row>
                
        <Form horizontal ref='Project_form' onSubmit={this._onSubmit}>
            <FormGroup validationState={this._formGroupClass(this.state.errors.Name)}>
                <Col componentClass={ControlLabel} xs={2} xsOffset={2}>
                    Name
                </Col>
                <Col xs={4}>
                    <FormControl onChange={this._onChange} id="Name" placeholder="Name"
                    value={this.state.Name}
                     name="Name" ref="Name" type="text" />
            <span className="help-block">{this.state.errors.Name}</span>
                </Col> 
          </FormGroup>
           <FormGroup validationState={this._formGroupClass(this.state.errors.CustomerID)}>
                <Col componentClass={ControlLabel} xs={2} xsOffset={2}>
                    Customer
                </Col>
                <Col xs={4}>   
            <FormControl componentClass="select" 
            name="CustomerID" ref="CustomerID" type="CustomerID" 
            value={(this.state.CustomerID)} onChange={this._onChange} >
                <option value="">Select a Customer</option>
                {this.state.customersCombo.map((customer) => {
                    return <option value={customer.CustomerID}>{customer.Name}</option>;
                })}
            </FormControl>
                    <span className="help-block">{this.state.errors.CustomerID}</span>
                </Col> 
          </FormGroup>
            <FormGroup validationState={this._formGroupClass(this.state.errors.CostPerHour)}>
                <Col componentClass={ControlLabel} xs={2} xsOffset={2}>
                    Cost per Hour
                </Col>
                <Col xs={4}>
                    <FormControl onChange={this._onChange} id="CostPerHour" placeholder="Cost per Hour" 
                    value={this.state.CostPerHour}
                    name="CostPerHour" ref="CostPerHour" type="text" />
                    <span className="help-block">{this.state.errors.CostPerHour}</span>
                </Col> 
          </FormGroup>
            <FormGroup>
            <Col xsOffset={4} xs={4}>
            <span className="help-block">{this.state.errors.General}</span>
                <Button type="submit" bsStyle="success">Save</Button> <Button bsStyle="primary"><Link to="Project" style={{color:"white", textDecoration: 'none'}}>Back</Link></Button>
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
export default ProjectEdit;
