import React, { Component } from 'react'
import Chart from 'chart.js/auto';
import Plot from './Plot.js';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialApprox: null
    }

    
  }
  render() {
    
    return (
      <>
      <Plot></Plot>
      </>
    )
  } 
}