function randRange(min,max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPolynomial(minDegree = 1, maxDegree = 5, minCoefficient = -10, maxCoefficient = 10) {
    let polynomial = "";

    for(let i = maxDegree; i >= minDegree; i--) {
        let coefficient = randRange(minCoefficient, maxCoefficient);
        let power = i;

        polynomial += `${coefficient}*x^${power} + `;
    }
    polynomial += `${randRange(0, maxCoefficient)}`

    console.log(polynomial);
    return polynomial;
}

export default randomPolynomial;