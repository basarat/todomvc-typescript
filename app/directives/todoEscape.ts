///<reference path="../reference.ts"/>

/**
 * Directive that executes an expression when the element it is applied to gets
 * an `escape` keydown event.
 */
todomvc.directive('todoEscape', function ($parse) {
    var ESCAPE_KEY = 27;
    return function (scope, elem, attrs) {
        elem.bind('keydown', function (event) {
            if (event.keyCode === ESCAPE_KEY) {
                scope.$apply(() => {
                    $parse(attrs.todoEscape)(scope)
                 });
            }
        });
    };
});

