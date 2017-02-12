import React, { Component } from 'react';
import {PageHeader, Grid, Row, Col, Button, Table, ButtonGroup} from 'react-bootstrap'
import {browserHistory, hashHistory, Link} from 'react-router';

const url = param => `http://localhost/TimeTracker/api/Project`


class Project extends Component {

constructor(props){
    super(props)
    this.state = { requestFailed: false}
}



componentDidMount()
{
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

delete(item){
        
    fetch(url() + "?id=" + item.ProjectID,
{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      
    },
    crossDomain: true,
    method: "DELETE"
})
        const newState = this.state.apiData;
    if (newState.indexOf(item) > -1) {
      newState.splice(newState.indexOf(item), 1);
      this.setState({apiData: newState})
    }
    }
    

  render() {
    if (this.state.requestFailed) {
        return <p>Error</p>
    }
    if (!this.state.apiData) {
        return <p>Loading</p>
    }  

    return (
        <div>
            <Grid>
                <Row className="show-grid">
                    <Col xs={12}>
                        <PageHeader>Project <small>grid</small></PageHeader>
                    </Col>
                </Row>
                <Row className="show-grid"></Row>
                <Row className="show-grid">
                <Col xs={12} >
                    <Table striped bordered condensed hover>
                        <thead>
                            <tr>
                                <th width="35%">Project</th>
                                <th width="35%">Customer</th>
                                <th width="15%">Cost Per Hour</th>
                                <th width="15%">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.apiData.map((Project) => {
                                debugger;
                                return <tr key={Project.ProjectID}>
                                        <td>{Project.Name}</td>
                                        <td>{Project.CustomerName}</td>
                                        <td>{Project.CostPerHour}</td>
                                        <td>
                                            <ButtonGroup  bsSize="small">
                                                <Button bsStyle="primary"><Link to={("ProjectEdit/"+Project.ProjectID)} style={{color:"white", textDecoration: 'none'}}>Edit</Link></Button>
                                                <Button bsStyle="danger"  onClick={this.delete.bind(this, Project) }>Delete</Button>
                                            </ButtonGroup>
                                        </td>
                                        </tr>; 
                            })}
                        </tbody>
                    </Table>
                    </Col>
                </Row>
                <Row className="show-grid">
                    
                        <Button bsStyle="primary"><Link to="ProjectNew" style={{color:"white", textDecoration: 'none'}}>Add New Project</Link></Button>
                    
                </Row>
            </Grid>
        </div>
    );
  }
}

export default Project;
