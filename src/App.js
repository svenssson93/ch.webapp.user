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

    this._fetchUserData = this._fetchUserData.bind(this);
    this._getTableRowMarkup = this._getTableRowMarkup.bind(this);
  }

  componentWillMount() {
    console.log('Fetching user-profile structure...');
    fetch(config.backendBase + config.backendApiUriUsersProfile).then((resp) => {
      resp.json().then((json) => {
        let keys = json.alps.descriptors[0].descriptors.map((descr) => {
          return descr.name;
        })

        if (keys.includes('id') && keys.includes('name') && keys.includes('email') && keys.includes('nickname')) {
          console.log('User-profile structure confirmed.');
          this.setState({
            dataStructure: true,
          });
          this._fetchUserData();
        } else {
          console.error('User-profile does not match expected structure.\nExpecting:\tid,name,email,nickname\nReceived:\t' + keys);
          this.setState({
            dataStructure: false,
          });
          this._fetchUserData();
        }
      })
    });
  }

  _fetchUserData() {
    console.log('Fetching data from backend...');
    fetch(config.backendBase + config.backendApiUriUsers).then((resp) => {
      resp.json().then((json) => {
        console.log('Received data. Adding it to state-variable');
        let users = json['_embedded']['users'];
        this.setState({
          users: users,
        })
      });
    });
  }

  _getTableRowMarkup(user) {
    let markup, rows = [];
    delete user._links;
    for (const [key, value] of Object.entries(user)) {
      switch (key) {
        case 'id':
        case 'name':
        case 'email':
        case 'nickname':
          rows.push(<TableRowColumn key={key}>{value}</TableRowColumn>);
          break;
        default:
          rows.push(<TableRowColumn key={key} className="noData">no data</TableRowColumn>);
      }
    }

    if (user['id']) {
      markup = (<TableRow key={user['id']}>{rows}</TableRow>);
    } else {
      markup = (<TableRow>{rows}</TableRow>);
    }

    return markup;
  }

  render() {
    let error;
    if (!this.state.dataStructure) {
      error = <p>The expected data-structure was not provided. Please update it to see full data.</p>;
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <MuiThemeProvider>
          <Paper>
            {error}
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
                  return this._getTableRowMarkup(user);
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
