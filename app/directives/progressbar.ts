///<reference path="../reference.ts"/>

todomvc.directive('progressbar', function (): ng.IDirective {
    return {
        restrict: 'EAC',
        template: progressbar.tpl.html,
        scope: {
            progress: '='
        }
    };
});