import { Chart } from 'chart.js'
import React, { Component } from 'react'
import { Line } from 'react-chartjs-2'
import chartProperties from './ChartProperties'
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import { derivative, random, thomsonCrossSectionDependencies } from 'mathjs';
import { create, all, evaluate } from 'mathjs'
import randomPolynomial from './randomPolynomial';
import TangentToGraph from './tangentLine';
import Menu from './Menu';

// math.js
const config = {
  epsilon: 1e-12,
  matrix: 'Matrix',
  number: 'number',
  precision: 64,
  predictable: false,
  randomSeed: null
}
const math = create(all, config)

Chart.register(annotationPlugin);
Chart.register(zoomPlugin);

Chart.defaults.font.size = 16;
Chart.defaults.color = "#bbb";

let initialxAxisLabels = [];
const xDivident = 10
for(let i = -50; i < 50; i++) {
  let label = i/xDivident;
  initialxAxisLabels.push(label);
}

export default class Plot extends Component {
  constructor(props) {
    super(props);

    this.nextIteration = this.nextIteration.bind(this);
    this.randomizePolynomial = this.randomizePolynomial.bind(this);
    this.setFunction = this.setFunction.bind(this);
    this.setApprox = this.setApprox.bind(this);
    this.getAllFunctionData = this.getAllFunctionData.bind(this);
    this.updateApproxAnnotations = this.updateApproxAnnotations.bind(this);

    let initFunc = randomPolynomial();
    let initDerivative = derivative(initFunc, "x");
    let funcData = this.getAllFunctionData(initFunc, initialxAxisLabels);
    this.state = {
      xAxisLabels: initialxAxisLabels,
      yData: [funcData.yData],
      fn: initFunc,
      derivative: initDerivative, 
      curApprox: null,
      options: chartProperties.options
    }

    this.chartRef = React.createRef();
    this.approxRef = React.createRef();
  }

  setFunction(f) {
    let state = this.getAllFunctionData(f, this.state.xAxisLabels, this.state.curApprox);

    this.setState(state);
  }
  getAllFunctionData(f, xAxisLabels, a) {
    let fprime = derivative(f, "x");

    // Update the chart
      let yData = [];
      let tangentData = [];
      for(let i = 0; i < xAxisLabels.length; i++) {
        let x = xAxisLabels[i];

        yData.push(math.evaluate(f, {x: x}));
      
        if(a) {
          let L = TangentToGraph(f, a, fprime);
          tangentData.push(math.evaluate(L, {x:x}));
        }
      }
      return {
        yData: yData,
        tangentData: tangentData,
        fn: f,
        derivative: fprime
      }
  }
  randomizePolynomial() {
    
    this.approxRef.current && (this.approxRef.current.value = "");
    this.setState({
      curApprox: null,
      nextApprox: null,
      derivative: null
    }, () => {
      this.setFunction(randomPolynomial());
      this.chartRef.current && this.chartRef.current.update();
      this.updateApproxAnnotations(true);
    })
    
  }
  setApprox() {
      let curApproxFromHTML = this.approxRef.current.value;
      console.log(curApproxFromHTML);
      // Check if input is correct
      if(!isNaN(curApproxFromHTML)) {
        this.setState({
          approxInputColor: ""
        })
        this.setState({
          curApprox: Number(curApproxFromHTML),
        }, () => {
          this.chartRef.current.update();
          this.nextIteration();
          this.updateApproxAnnotations();
        })
      }
      else {
        // Error in input indication
        this.setState({
          approxInputColor: "#9c2b2e"
        })
      }
      

    
    
  }
  updateApproxAnnotations(clear = false) {
    let curApprox = this.state.curApprox;
    let xOffset = this.state.xAxisLabels[0];
    let f = this.state.fn;
    let nextApprox = this.state.nextApprox || curApprox;

    this.setState(prevState => ({
      options: {
        ...prevState.options,
        plugins: {
          ...prevState.options.plugins,           
          annotation: {                     
            ...prevState.options.plugins.annotation,   
            annotations: {
              ...prevState.options.plugins.annotation.annotations,
              // TODO, there has to be a better way to code the clearing
              curApprox: clear ? null : {
                type: 'point',
                
                xValue: (nextApprox - xOffset)*xDivident,
                yValue: evaluate(f, {x: nextApprox}),
                backgroundColor: 'rgba(255, 99, 132, 0.25)'
              },
              nextApprox: clear ? null : {
                type: 'point',
                xValue: (curApprox - xOffset)*xDivident,
                yValue: 0,
                backgroundColor: 'rgba(255, 99, 132, 0.25)'
              }
            }
          }
        }
      }
    }))
  }
  nextIteration() {
    try {
    // nextApprox = curApprox - f(curApprox)/f'(curApprox)
    let curApprox = this.state.curApprox;
    let f = this.state.fn;
    let nextApprox = 
        curApprox 
          -
        evaluate(f, {x:curApprox})
          /  
        evaluate(this.state.derivative.toString(), {x: curApprox});

    this.setState({
      nextApprox: curApprox,
      curApprox: nextApprox
    }, () => {
      this.updateApproxAnnotations();
    });
    // Trigger a chart update
    this.setFunction(f);
  }
  catch(error) {
    console.warn(error);
  }
  }


  render() {
    let data = {
      labels: this.state.xAxisLabels,
      // The function
      datasets: [{
        label: this.state.fn,
        borderColor: "blue",
        function: this.state.fn,
        data: this.state.yData,
      }, 
      // The function's tangent line
      {
        label: "Tangent",
        borderColor: "gray",
        function: this.state.fn, // The function is later manipulated in the plugin for it to be a tangent line
        derivative: this.state.derivative,
        data: this.state.tangentData,
        curApprox: this.state.curApprox
      },
      
    ]
    }
    
    return (
      <>
        <Line ref={this.chartRef} 
      options={this.state.options} data={data}/>

        <Menu
          nextIterationFn={this.nextIteration}
          nextIterationDisabled={!this.state.yData}
          randomizePolynomialFn={this.randomizePolynomial}
          setApproxFn={this.setApprox}
          approxRef={this.approxRef}
          approxInputColor={this.state.approxInputColor}
        >
        </Menu>
      </>
    )
  }
}




