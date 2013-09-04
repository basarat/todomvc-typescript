///<reference path="./reference.ts"/>

var todomvc = angular.module('todomvc', []);

// Debug functions 
var lastaes;
function aes(element) {
    return lastaes = angular.element(element).scope();
}