angular.module('main').
	directive('mjsWidget', [function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/main/mjs/mjs-widget.html',
			controller: 'MjsWidgetController as mjsWidgetCtrl',
			scope: {
				item: '='
			},
			link: function(scope, element, attrs, ctrl) {
				scope.ctrl = ctrl;
			}
		};
	}]);