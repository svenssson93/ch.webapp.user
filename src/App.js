import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import config from './config/config';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor() {
    super();

    this.state = {
      users: [],
    }
  }

  componentWillMount() {
    console.log('Fetching data from backend...');
    fetch(config.backendBase + config.backendApiUriUsers).then((resp) => {
      resp.json().then((json) => {
        console.log(json);
        this.setState({
          users: json['_embedded']['users'],
        })
      });
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <MuiThemeProvider>
          <Paper>
            <Table className="tblUsers">
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn>Id</TableHeaderColumn>
                  <TableHeaderColumn>Name</TableHeaderColumn>
                  <TableHeaderColumn>E-Mail</TableHeaderColumn>
                  <TableHeaderColumn>Nickname</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody id="tblUser" displayRowCheckbox={false}>
                {this.state.users.map((user) => {
                  return(
                    <TableRow key={user['id']}>
                      <TableRowColumn>{user['id']}</TableRowColumn>
                      <TableRowColumn>{user['name']}</TableRowColumn>
                      <TableRowColumn>{user['email']}</TableRowColumn>
                      <TableRowColumn>{user['nickname']}</TableRowColumn>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </MuiThemeProvider>
      </div>
    );
  }

}

export default App;
