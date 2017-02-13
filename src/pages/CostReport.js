import React, { Component } from 'react';
import {FormGroup,ControlLabel,FormControl, PageHeader, Grid, Row, Col, Button, Table, ButtonGroup, Navbar, Nav, NavItem} from 'react-bootstrap'
import { Link } from "react-router";

const url = param => `http://localhost/TimeTracker/api/costreport`
const urlUser = param => `http://localhost/TimeTracker/api/User`
class CostReport extends Component {
constructor(props){
    super(props)
    this.state = { requestFailed: false}
    this._onChange = this._onChange.bind(this);
}



componentDidMount()
{
    this.getCostReports();
    this.getUsersCombo();
} 
getCostReports(){
fetch(url())
    .then(response => {
        if(!response.ok)
        {
            throw Error("Network request failed")
        }
        return response;
    })
    .then(d => d.json())
    .then(d => {
        this.setState({ apiData: d.slice() })
    }, () => {
        this.setState({ requestFailed: true });
    })
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
        this.setState({ userCombo: d.slice() })
    }, () => {
        this.setState({ requestFailed: true });
    })    
}
  
  _onChange (e) {
    var state = {};
    debugger;
    state[e.target.name] =  e.target.value;
    this.setState(state);
  }
    

  render() {
    var sumHours = 0;
    var sumCost = 0;
    var i = 0;
    
    if (this.state.requestFailed) {
        return <p>Error</p>
    }
    if (!this.state.apiData) {
        return <p>Loading</p>
    }  
    if (!this.state.userCombo) {
        return <p>Loading Users Select</p>
    }  
    return (
      <div>

            <Grid>
                <Row className="show-grid">
                    <Col xs={12}>
                        <PageHeader>Total Cost <small>report</small></PageHeader>
                    </Col>
                </Row>
                <Row className="show-grid"></Row>
                <Row className="show-grid">
                <Col xs={8} xsOffset={3} >
                <FormGroup>
                <Col componentClass={ControlLabel} xs={2} >
                    Filter by User
                </Col>
                <Col xs={4}>
                <FormControl componentClass="select" 
            name="UserID" ref="UserID" type="UserID" 
            value={(this.state.UserID)} onChange={this._onChange} >
                <option value="">Filter projects by user</option>
                {this.state.userCombo.map((user) => {
                    return <option value={user.UserID}>{user.Name}</option>;
                })}
            </FormControl>     
                </Col> 
                <Col xs={2}>  
                    <Button bsStyle="primary"><Link to={("CostReport/"+this.state.UserID)} style={{color:"white", textDecoration: 'none'}}>Filter</Link></Button> 
                </Col> 
          </FormGroup>
                    </Col>
                </Row>
                <br/>
                <Row className="show-grid">
                <Col xs={12} >
                    <Table striped bordered condensed hover>
                        <thead>
                            <tr>
                                <th width="25%">Customer</th>
                                <th width="20%">Project</th>
                                <th width="10%">Hours Worked</th>
                                <th width="25%">Total Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.apiData.map((costReport) => {
                              sumHours += costReport.TotalHours;
                              sumCost += costReport.TotalCost;
                                return <tr key={i++}>
                                        <td>{costReport.CustomerName}</td>
                                        <td>{costReport.ProjectName}</td>
                                        <td>{costReport.TotalHours}</td>
                                        <td>{costReport.TotalCost}</td>
                                        </tr>;

                            })}
                        </tbody>
                    </Table>
                    </Col>
                </Row>
            </Grid>
        </div>
    );
  }
}  

export default CostReport;
