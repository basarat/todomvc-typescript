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

        editedTodo: Todo = null;
        originalTodo: Todo = null;        

        remainingCount: number;
        completedCount: number;
        allChecked: boolean;        

        constructor($scope: TodoCtrlScope, todoStorage: TodoStorage) {

            // Expose the view model on the scope 
            $scope.vm = this;

            this.todos = todoStorage.get();

            this.editedTodo = null;

            $scope.$watch('vm.todos', (newValue, oldValue) => {                
                // Save 
                if (newValue !== oldValue) {
                    todoStorage.put(angular.copy(this.todos));
                }
                // Update ui 
                this.remainingCount = _.filter(this.todos, (todo) => !todo.completed).length;
                this.completedCount = this.todos.length - this.remainingCount;
                this.allChecked = !this.remainingCount;                
            }, true);
        }

        addTodo() {
            var newTodo = this.newTodo.trim();
            if (!newTodo) {
                return;
            }

            this.todos.push({
                title: newTodo,
                completed: false
            });

            this.newTodo = '';
        }

        editTodo(todo:Todo) {
            this.editedTodo = todo;
            // Clone the original todo to restore it on demand.
            this.originalTodo = _.clone(todo);
        }

        doneEditing(todo: Todo) {  
            console.log(this.editedTodo);          
            this.editedTodo = null;
            todo.title = todo.title.trim();

            if (!todo.title) {
                this.removeTodo(todo);
            }
        }

        revertEditing(todo: Todo) {            
            this.todos[this.todos.indexOf(todo)] = this.originalTodo;
            this.doneEditing(this.originalTodo);
        }

        removeTodo(todo:Todo) {
            this.todos.splice(this.todos.indexOf(todo), 1);
        }

        clearCompletedTodos() {
            this.todos = this.todos.filter((val) => {
                return !val.completed;
            });
        }

        markAll(completed:boolean) {
            this.todos.forEach( (todo) => {
                todo.completed = completed;
            });
        }
    }
}

