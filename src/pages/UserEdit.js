import React, { Component } from 'react';
import {ListGroup, ListGroupItem, Form, Row, PageHeader, ControlLabel, FormControl, FormGroup, Col, Button } from 'react-bootstrap'
import {browserHistory, hashHistory, Link} from 'react-router';
import ToggleDisplay from 'react-toggle-display';

const url = param => `http://localhost/TimeTracker/api/User`

class UserEdit extends Component {
    

constructor(props){
    super(props)

    
    this.state = { 
        requestFailed: false, success: false, loading: false, Name: "", 
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
            this.setState({Name: d.Name })})
    , () => {
        this.setState({ requestFailed: true });
    }
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
        Name: this.state.Name
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
                        <PageHeader>User <small>edit</small></PageHeader>
                    </Col>
                </Row>
                
        <Form horizontal ref='User_form' onSubmit={this._onSubmit}>
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
            <FormGroup>
            <Col xsOffset={4} xs={4}>
            <span className="help-block">{this.state.errors.General}</span>
                <Button type="submit" bsStyle="success">Save</Button> <Button bsStyle="primary"><Link to="User" style={{color:"white", textDecoration: 'none'}}>Back</Link></Button>
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
export default UserEdit;
