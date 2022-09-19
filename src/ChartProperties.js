import { create, all, evaluate } from 'mathjs'
import TangentToGraph from './tangentLine';

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

let chartProperties = {
  options: {
    elements: {
      point: {
        radius: 0
      }
    },
    responsive: true,
    scales: {
      y: {
        min: -50,
        max: 250 
      },
      x: {
        min: -250,
        max: 500
      },
    },
    // The x axis (Line at y=0)
    plugins: {
      autocolors: false,
      annotation: {
        annotations: {
          xAxis: {
            type: 'line',
            yMin: 0,
            yMax: 0,
            borderColor: '#383838'
          },
        }
      },
      /*
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pan: {
            enabled: true,
            mode: "xy"
          },
          pinch: {
            enabled: true
          },
          mode: 'xy',
        }
      }
      */
    }
  }
}

export default chartProperties;