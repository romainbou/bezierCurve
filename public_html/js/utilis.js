/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function factorial(n){
    var result = 1;
    for(var i=1;i<=n;i++){
        result *= i;
    }
    return result;
}
function binomialCoeficient(n,k){
    return (factorial(n)/(factorial(k)*factorial(n-k)));
}

