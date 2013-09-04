///<reference path="../reference.ts"/>

/**
 * Service that persists and retrieves TODOs from localStorage
 */
class TodoStorage {
    STORAGE_ID = 'todos-angularjs';

    get() {
        return JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
    }

    put(todos) {
        localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
    }
}    

todomvc.service('todoStorage', TodoStorage);
