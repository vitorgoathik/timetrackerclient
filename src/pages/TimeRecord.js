import React, { Component } from 'react';
import {PageHeader, Grid, Row, Col, Button, Table, ButtonGroup} from 'react-bootstrap'
import {browserHistory, hashHistory, Link} from 'react-router';

const url = param => `http://localhost/TimeTracker/api/TimeRecord`


class TimeRecord extends Component {

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
        
    fetch(url() + "?id=" + item.TimeRecordID,
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

    var moment = require('moment')
    return (
        <div>
            <Grid>
                <Row className="show-grid">
                    <Col xs={12}>
                        <PageHeader>Time Record <small>grid</small></PageHeader>
                    </Col>
                </Row>
                <Row className="show-grid"></Row>
                <Row className="show-grid">
                <Col xs={8} xsPull={2}  xsPush={2}>
                    <Table striped bordered condensed hover>
                        <thead>
                            <tr>
                                <th width="20%">User</th>
                                <th width="20%">Project</th>
                                <th width="12.5%">Start Date</th>
                                <th width="12.5%">End Date</th>
                                <th width="20%">Comments</th>
                                <th width="20%">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.apiData.map((TimeRecord) => {
                                return 
                                    <tr key={TimeRecord.TimeRecordID}>
                                        <td>{TimeRecord.UserName}</td>
                                        <td>{TimeRecord.ProjectName}</td>
                                        <td>{moment(TimeRecord.Start).format('DD/MM/YYYY')}</td>
                                        <td>{moment(TimeRecord.End).format('DD/MM/YYYY')}</td>
                                        <td>{TimeRecord.Comment}</td>
                                        <td>
                                            <ButtonGroup  bsSize="small">
                                                <Button bsStyle="primary"><Link to={("TimeRecordEdit/"+TimeRecord.TimeRecordID)} style={{color:"white", textDecoration: 'none'}}>Edit</Link></Button>
                                                <Button bsStyle="danger"  onClick={this.delete.bind(this, TimeRecord) }>Delete</Button>
                                            </ButtonGroup>
                                        </td>
                                        </tr>; 
                            })}
                        </tbody>
                    </Table>
                    </Col>
                </Row>
                <Row className="show-grid">
                    
                        <Button bsStyle="primary"><Link to="TimeRecordNew" style={{color:"white", textDecoration: 'none'}}>Add New Time Record</Link></Button>
                    
                </Row>
            </Grid>
        </div>
    );
  }
}

export default TimeRecord;
