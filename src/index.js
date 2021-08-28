function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    
    expr = expr.replace(/\s/g, '');//delete spaces

    if (expr.indexOf('(') === -1 && expr.indexOf(')') === -1){//no parentheses
        return +calculateSimpleExpression(expr);
    } else {//with parentheses
        if ( ! isBracketsCorrect(expr)){//check if expression has correct brackets
            throw new Error("ExpressionError: Brackets must be paired");
        } else {
            while(expr.indexOf('(') !== -1){
                let begin, end;
                for (let i = 0; i < expr.length; i++) {
                    if (expr[i] === "("){
                        begin = i;
                    } else if(expr[i] === ")"){
                        end = i;
                        break;
                    }
                }
                if (begin === 0 && end === expr.length - 1){
                    expr = calculateSimpleExpression(expr.substring(begin + 1, end));
                } else if (begin === 0) {
                    expr = calculateSimpleExpression(expr.substring(begin + 1, end)) + expr.substring(end + 1);
                } else if (end === expr.length - 1){
                    let calculatedSimpleExpr = calculateSimpleExpression(expr.substring(begin + 1, end));
                    if (calculatedSimpleExpr[0] === "-" && expr[begin - 1] === "+") {
                        expr = expr.substring(0, begin - 1) + calculatedSimpleExpr;// -+ => -
                    } else if (calculatedSimpleExpr[0] === "-" && expr[begin - 1] === "-"){
                        expr = expr.substring(0, begin - 1) + "+" + calculatedSimpleExpr.substring(1);// -- => +
                    } else {
                        expr = expr.substring(0, begin) + calculatedSimpleExpr;
                    }
                } else {
                    let calculatedSimpleExpr = calculateSimpleExpression(expr.substring(begin + 1, end));
                    if (calculatedSimpleExpr[0] === "-" && expr[begin - 1] === "+") {
                        expr = expr.substring(0, begin - 1) + calculatedSimpleExpr + expr.substring(end + 1);// -+ => -
                    } else if (calculatedSimpleExpr[0] === "-" && expr[begin - 1] === "-"){
                        expr = expr.substring(0, begin - 1) + "+" + calculatedSimpleExpr.substring(1) + expr.substring(end + 1);// -- => +
                    } else {
                        expr = expr.substring(0, begin) + calculatedSimpleExpr + expr.substring(end + 1);
                    }
                }
            }

            expr = calculateSimpleExpression(expr);//expr without brackets
            return +expr;
        }
    }  
}

//calculates expression without parenthesis
let calculateSimpleExpression = (simpleStr) => {
    
    let indexMult = simpleStr.indexOf('*');
    let indexDev = simpleStr.indexOf('/');
    let indexSubtr = simpleStr.indexOf('-', 1);
    let indexAdd = simpleStr.indexOf("+");

    while (indexMult > -1 || indexDev > -1 || indexSubtr > -1 || indexAdd > -1){
        
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
            indexSubtr = simpleStr.indexOf('-', 1);
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
    firstOperand = str.substring(strCutBegin, operatorPosition);
    
    //get second operand
    i = operatorPosition + 1;
    while(i < str.length){
        if(str[i] === '-' && i === (operatorPosition + 1)){
            secondOperand += str[i];
            strCutEnd = i;
        }
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
    if (operationSign === "/"){
        if (+secondOperand === 0) throw new Error("TypeError: Division by zero.");
        operationResult = +firstOperand / +secondOperand;
    } 
    if (operationSign === "+") operationResult = +firstOperand + +secondOperand;
    if (operationSign === "-") operationResult = +firstOperand - +secondOperand;

    if (strCutBegin === 0 && strCutEnd === str.length - 1) return String(operationResult);
    if (strCutBegin === 0) return String(operationResult) + str.substring(strCutEnd + 1);
    if (strCutEnd === str.length - 1) return str.substring(0, strCutBegin) + String(operationResult);

    return str.substring(0, strCutBegin) + String(operationResult) + str.substring(strCutEnd + 1);
}

let isBracketsCorrect = (expr) => {
    let stack = [];

    for (let j = 0; j < expr.length; j++) {
        let elem = expr[j];

        if (elem === '('){
            stack.push(elem);
        } else if (elem === ")"){
            if (stack[stack.length - 1] === "("){
                stack.pop();
            } else {
                return false;
            }
        }
    }

    return stack.length === 0;
};

module.exports = {
    expressionCalculator
}