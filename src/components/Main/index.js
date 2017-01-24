import React, { Component } from 'react';
import logo from './logo-sparkpost-lab.png';

import './style.css';

class Main extends Component {

  render() {
    return (
      <div className="jumbotron">
        <img src={logo} alt="SparkPost Lab" />
      </div>
    );
  }
}

export default Main;
