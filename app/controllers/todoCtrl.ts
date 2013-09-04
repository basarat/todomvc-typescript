///<reference path="../reference.ts"/>

module Controllers {

    export interface TodoCtrlScope extends ng.IScope {
        vm: TodoCtrl;
    }

    /**
     * The main controller for the app. The controller:
     * - retrieves and persists the model via the todoStorage service
     * - exposes the model to the template and provides event handlers
     */
    export class TodoCtrl {

        todos: Todo[] = [];
        newTodo: string = '';
        editedTodo: any = null;
        originalTodo: any = null;        

        remainingCount: number;
        completedCount: number;
        allChecked: boolean;

        statusFilter: any;

        constructor($scope: TodoCtrlScope, todoStorage: TodoStorage, filterFilter) {

            // Expose the view model on the scope 
            $scope.vm = this;

            this.todos = todoStorage.get();

            this.editedTodo = null;


            $scope.$watch('vm.todos',  (newValue, oldValue) => {
                this.remainingCount = filterFilter(this.todos, { completed: false }).length;
                this.completedCount = this.todos.length - this.remainingCount;
                this.allChecked = !this.remainingCount;
                if (newValue !== oldValue) { // This prevents unneeded calls to the local storage
                    todoStorage.put(this.todos);
                }
            }, true);
        }

        addTodo() {
            var newTodo = this.newTodo.trim();
            if (!newTodo.length) {
                return;
            }

            this.todos.push({
                title: newTodo,
                completed: false
            });

            this.newTodo = '';
        }

        editTodo(todo) {
            this.editedTodo = todo;
            // Clone the original todo to restore it on demand.
            this.originalTodo = angular.extend({}, todo);
        }

        doneEditing(todo) {
            this.editedTodo = null;
            todo.title = todo.title.trim();

            if (!todo.title) {
                this.removeTodo(todo);
            }
        }

        revertEditing(todo) {
            this.todos[this.todos.indexOf(todo)] = this.originalTodo;
            this.doneEditing(this.originalTodo);
        }

        removeTodo(todo) {
            this.todos.splice(this.todos.indexOf(todo), 1);
        }

        clearCompletedTodos() {
            this.todos = this.todos.filter((val) => {
                return !val.completed;
            });
        }

        markAll(completed) {
            this.todos.forEach( (todo) => {
                todo.completed = completed;
            });
        }
    }
}

