function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    
    expr = expr.replace(/\s/g, '');//delete spaces

    if (expr.indexOf('(') === -1 && expr.indexOf(')') === -1){
        return +calculateSimpleExpression(expr);
    } else {
        return 0;
        //check if expression has correct brackets
        
        //в цикле - ищем вложенности скобок (...) и считаем выражения внутри, заменяем в строке (...) на число и начинаем сначала до 
        // того, как скобок не останется 
    }

    
}

//calculates expression without parenthesis
let calculateSimpleExpression = (simpleStr) => {
    let indexMult, indexDev, indexSubtr, indexAdd;
    indexAdd = simpleStr.indexOf("+");

    while ((indexMult = simpleStr.indexOf('*')) > -1 || (indexDev = simpleStr.indexOf('/')) > -1 ||
        (indexSubtr = simpleStr.indexOf('-', 1)) > -1 || indexAdd > -1){
        
            if (indexMult > -1 && indexDev > -1){
                if (indexMult < indexDev){
                    simpleStr = makeOperation(simpleStr, "*", indexMult);
                } else {
                    simpleStr = makeOperation(simpleStr, "/", indexDev);
                }
            } else if (indexMult > -1){
                simpleStr = makeOperation(simpleStr, "*", indexMult);
            } else if (indexDev > -1) {
                simpleStr = makeOperation(simpleStr, "/", indexDev);
            } else if (indexSubtr > -1 && indexAdd > -1){
                if (indexSubtr < indexAdd){
                    simpleStr = makeOperation(simpleStr, "-", indexSubtr);
                } else {
                    simpleStr = makeOperation(simpleStr, "+", indexAdd);
                }
            } else if (indexSubtr > -1){
                simpleStr = makeOperation(simpleStr, "-", indexSubtr);
            } else if (indexAdd > -1){
                simpleStr = makeOperation(simpleStr, "+", indexAdd);
            }

            indexMult = simpleStr.indexOf('*');
            indexDev = simpleStr.indexOf('/');
            indexSubtr = simpleStr.indexOf('-');
            indexAdd = simpleStr.indexOf('+');
    }

    return simpleStr;

}

let makeOperation = (str, operationSign, operatorPosition) => {
    let firstOperand = "";
    let secondOperand = "";
    let strCutBegin;
    let strCutEnd;
    let operationResult;

    //get first operand
    let i = operatorPosition - 1;
    if (operationSign === "-"){
        while(i > -1){
            if (str[i] === '-' && i === 0){
                strCutBegin = 0;
                break;
            } 
            if ((str[i] !== '*' && str[i] !== '/' && str[i] !== '+') && str[i] !== '-'){
            // if (str[i] !== ' '){
                strCutBegin = i;
            } else {
                break;
            }
            i--;
        }
    } else {
        while(i > -1){
            if (str[i] !== '*' && str[i] !== '/' && str[i] !== '+' && str[i] !== '-'){
            // if (str[i] !== ' '){
                strCutBegin = i;
            } else {
                break;
            }
            i--;
        }
    }
    firstOperand = str.substring(strCutBegin, operatorPosition);
    
    //get second operand
    i = operatorPosition + 1;
    while(i < str.length){
        if (str[i] !== '*' && str[i] !== '/' && str[i] !== '+' && str[i] !== '-'){
        // if(str[i] !== " "){
            secondOperand += str[i];
            strCutEnd = i;
        } else {
            break;
        }
        i++;
    }

    if (operationSign === "*") operationResult = +firstOperand * +secondOperand;
    //TODO: devision by 0 situation
    if (operationSign === "/") operationResult = +firstOperand / +secondOperand;
    if (operationSign === "+") operationResult = +firstOperand + +secondOperand;
    if (operationSign === "-") operationResult = +firstOperand - +secondOperand;

    if (strCutBegin === 0 && strCutEnd === str.length - 1) return String(operationResult);
    if (strCutBegin === 0) return String(operationResult) + str.substring(strCutEnd + 1);
    if (strCutEnd === str.length - 1) return str.substring(0, strCutBegin) + String(operationResult);

    return str.substring(0, strCutBegin) + String(operationResult) + str.substring(strCutEnd + 1);
}

module.exports = {
    expressionCalculator
}