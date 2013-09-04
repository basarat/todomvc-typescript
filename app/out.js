var todomvc = angular.module('todomvc', []);

var lastaes;
function aes(element) {
    return lastaes = angular.element(element).scope();
}
var Controllers;
(function (Controllers) {
    var TodoCtrl = (function () {
        function TodoCtrl($scope, todoStorage) {
            var _this = this;
            this.todos = [];
            this.newTodo = '';
            this.editedTodo = null;
            this.originalTodo = null;
            $scope.vm = this;

            this.todos = todoStorage.get();

            this.editedTodo = null;

            $scope.$watch('vm.todos', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    todoStorage.put(angular.copy(_this.todos));
                }

                _this.remainingCount = _.filter(_this.todos, function (todo) {
                    return !todo.completed;
                }).length;
                _this.completedCount = _this.todos.length - _this.remainingCount;
                _this.allChecked = !_this.remainingCount;
            }, true);
        }
        TodoCtrl.prototype.addTodo = function () {
            var newTodo = this.newTodo.trim();
            if (!newTodo) {
                return;
            }

            this.todos.push({
                title: newTodo,
                completed: false
            });

            this.newTodo = '';
        };

        TodoCtrl.prototype.editTodo = function (todo) {
            this.editedTodo = todo;

            this.originalTodo = _.clone(todo);
        };

        TodoCtrl.prototype.doneEditing = function (todo) {
            console.log(this.editedTodo);
            this.editedTodo = null;
            todo.title = todo.title.trim();

            if (!todo.title) {
                this.removeTodo(todo);
            }
        };

        TodoCtrl.prototype.revertEditing = function (todo) {
            this.todos[this.todos.indexOf(todo)] = this.originalTodo;
            this.doneEditing(this.originalTodo);
        };

        TodoCtrl.prototype.removeTodo = function (todo) {
            this.todos.splice(this.todos.indexOf(todo), 1);
        };

        TodoCtrl.prototype.clearCompletedTodos = function () {
            this.todos = this.todos.filter(function (val) {
                return !val.completed;
            });
        };

        TodoCtrl.prototype.markAll = function (completed) {
            this.todos.forEach(function (todo) {
                todo.completed = completed;
            });
        };
        return TodoCtrl;
    })();
    Controllers.TodoCtrl = TodoCtrl;
})(Controllers || (Controllers = {}));
todomvc.directive('todoBlur', function ($parse) {
    return function (scope, elem, attrs) {
        elem.bind('blur', function () {
            scope.$apply(function () {
                $parse(attrs.todoBlur, scope);
            });
        });
    };
});
todomvc.directive('todoEscape', function ($parse) {
    var ESCAPE_KEY = 27;
    return function (scope, elem, attrs) {
        elem.bind('keydown', function (event) {
            if (event.keyCode === ESCAPE_KEY) {
                scope.$apply(function () {
                    $parse(attrs.todoEscape)(scope);
                });
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
