var todomvc = angular.module('todomvc', []);
var Controllers;
(function (Controllers) {
    var TodoCtrl = (function () {
        function TodoCtrl($scope, $location, todoStorage, filterFilter) {
            var todos = $scope.todos = todoStorage.get();

            $scope.newTodo = '';
            $scope.editedTodo = null;

            $scope.$watch('todos', function (newValue, oldValue) {
                $scope.remainingCount = filterFilter(todos, { completed: false }).length;
                $scope.completedCount = todos.length - $scope.remainingCount;
                $scope.allChecked = !$scope.remainingCount;
                if (newValue !== oldValue) {
                    todoStorage.put(todos);
                }
            }, true);

            if ($location.path() === '') {
                $location.path('/');
            }

            $scope.location = $location;

            $scope.$watch('location.path()', function (path) {
                $scope.statusFilter = (path === '/active') ? { completed: false } : (path === '/completed') ? { completed: true } : null;
            });

            $scope.addTodo = function () {
                var newTodo = $scope.newTodo.trim();
                if (!newTodo.length) {
                    return;
                }

                todos.push({
                    title: newTodo,
                    completed: false
                });

                $scope.newTodo = '';
            };

            $scope.editTodo = function (todo) {
                $scope.editedTodo = todo;

                $scope.originalTodo = angular.extend({}, todo);
            };

            $scope.doneEditing = function (todo) {
                $scope.editedTodo = null;
                todo.title = todo.title.trim();

                if (!todo.title) {
                    $scope.removeTodo(todo);
                }
            };

            $scope.revertEditing = function (todo) {
                todos[todos.indexOf(todo)] = $scope.originalTodo;
                $scope.doneEditing($scope.originalTodo);
            };

            $scope.removeTodo = function (todo) {
                todos.splice(todos.indexOf(todo), 1);
            };

            $scope.clearCompletedTodos = function () {
                $scope.todos = todos = todos.filter(function (val) {
                    return !val.completed;
                });
            };

            $scope.markAll = function (completed) {
                todos.forEach(function (todo) {
                    todo.completed = completed;
                });
            };
        }
        return TodoCtrl;
    })();

    todomvc.controller('TodoCtrl', TodoCtrl);
})(Controllers || (Controllers = {}));
todomvc.directive('todoBlur', function () {
    return function (scope, elem, attrs) {
        elem.bind('blur', function () {
            scope.$apply(attrs.todoBlur);
        });
    };
});
todomvc.directive('todoBlur', function () {
    var ESCAPE_KEY = 27;
    return function (scope, elem, attrs) {
        elem.bind('keydown', function (event) {
            if (event.keyCode === ESCAPE_KEY) {
                scope.$apply(attrs.todoEscape);
            }
        });
    };
});
todomvc.directive('todoFocus', function todoFocus($timeout) {
    return function (scope, elem, attrs) {
        scope.$watch(attrs.todoFocus, function (newVal) {
            if (newVal) {
                $timeout(function () {
                    elem[0].focus();
                }, 0, false);
            }
        });
    };
});
var TodoStorage = (function () {
    function TodoStorage() {
        this.STORAGE_ID = 'todos-angularjs';
    }
    TodoStorage.prototype.get = function () {
        return JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
    };

    TodoStorage.prototype.put = function (todos) {
        localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
    };
    return TodoStorage;
})();

todomvc.service('todoStorage', TodoStorage);
todomvc.controller(Controllers);
//# sourceMappingURL=out.js.map
