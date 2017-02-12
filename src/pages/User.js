import React, { Component } from 'react';
import {PageHeader, Grid, Row, Col, Button, Table, ButtonGroup} from 'react-bootstrap'
import {browserHistory, hashHistory, Link} from 'react-router';

const url = param => `http://localhost/TimeTracker/api/User`


class User extends Component {

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
        
    fetch(url() + "?id=" + item.UserID,
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
                        <PageHeader>User <small>grid</small></PageHeader>
                    </Col>
                </Row>
                <Row className="show-grid"></Row>
                <Row className="show-grid">
                <Col xs={8} xsPull={2}  xsPush={2}>
                    <Table striped bordered condensed hover>
                        <thead>
                            <tr>
                                <th width="70%">User</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.apiData.map((User) => {
                                return <tr key={User.UserID}>
                                        <td>{User.Name}</td>
                                        <td>
                                            <ButtonGroup  bsSize="small">
                                                <Button bsStyle="primary"><Link to={("UserEdit/"+User.UserID)} style={{color:"white", textDecoration: 'none'}}>Edit</Link></Button>
                                                <Button bsStyle="danger"  onClick={this.delete.bind(this, User) }>Delete</Button>
                                            </ButtonGroup>
                                        </td>
                                        </tr>; 
                            })}
                        </tbody>
                    </Table>
                    </Col>
                </Row>
                <Row className="show-grid">
                    
                        <Button bsStyle="primary"><Link to="UserNew" style={{color:"white", textDecoration: 'none'}}>Add New User</Link></Button>
                    
                </Row>
            </Grid>
        </div>
    );
  }
}

export default User;
