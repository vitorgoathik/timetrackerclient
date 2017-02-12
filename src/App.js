import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Navbar, Nav, NavItem } from "react-bootstrap";
import { Link } from "react-router";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>

        <Navbar inverse collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#">TimeTracker alpha</a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <NavItem eventKey={1} href="#"><Link to="customer"><b>Customers</b></Link></NavItem>
        <NavItem eventKey={2} href="#"><Link to="project"><b>Projects</b></Link></NavItem>
        <NavItem eventKey={3} href="#"><Link to="user"><b>Users</b></Link></NavItem>
        <NavItem eventKey={4} href="#"><Link to="timerecord"><b>Time Records</b></Link></NavItem>
      </Nav>
    </Navbar.Collapse>
  </Navbar> 
        {this.props.children}
      </div>
    );
  }
}

export default App;
