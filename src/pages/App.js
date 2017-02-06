import React, { Component } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

class App extends Component {
  render() {
    const {children} = this.props;

    return (
      <div className="App">
        <Header />
        <div className="container container--content">
          {children}
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;