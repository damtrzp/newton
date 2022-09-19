import { create, all, evaluate } from 'mathjs'

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


function TangentToGraph(f, a, derivative) {

    // L(x) = f '(a) (x - a) + f(a)
    let L = `${derivative.evaluate({x:a})} * (x-${a}) + ${evaluate(f, {x:a})}`;
    return L;
}

export default TangentToGraph;