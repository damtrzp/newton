import React, { Component } from 'react'

export default class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
          approxColor: null
        };
        props.randomizePolynomialFn();

        this.onApproxChange = this.onApproxChange.bind(this);
    }
    onApproxChange() {
      
    }
  render() {
    return (
        <div className="menu">
            <button 
            onClick={this.props.nextIterationFn}
            disabled={this.props.nextIterationDisabled}
            >Next Step</button>
            <button 
            onClick={this.props.setApproxFn}
            >Set approx.</button>
            <input 
            placeholder={"Initial approximation"} 
            ref={this.props.approxRef} style={{
              backgroundColor: this.props.approxInputColor || this.state.approxColor
            }}
            onChange={this.onApproxChange}></input>
            <button onClick={this.props.randomizePolynomialFn}>Randomize polynomial</button>
        </div>
    )
  }
}
