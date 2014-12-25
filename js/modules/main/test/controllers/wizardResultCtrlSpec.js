'use strict';

describe('WizardResultCtrl', function() {

	beforeEach(function() {
		module('main');
	});

	var scope, result, $timeout, createCtrl, wizard; 

	beforeEach(inject(function($rootScope, $controller, $q, _$timeout_, $httpBackend) {

		$httpBackend.expectGET('templates/main/start.html').respond('');

		wizard = {
			result: {},
			search: jasmine.createSpy('wizard.search').andCallFake(function() {
				var self = this,
					deferred = $q.defer();

				$timeout(function() {
					self.result = result;
					deferred.resolve(result);
				});

				return deferred.promise;
			})
		};

		var stateParams = {
			name: 'test-name',
			place: 'test-place'
		};

		result = {
			bingo: {
				name: {}, 
				place: {}
			}, 

			suggestions: {
				name: {},
				place: {}
			}
		};

		$timeout = _$timeout_;

		scope = $rootScope.$new();
		scope.mainController = {
			wizard_query: {},
			search_again_visible: false
		};

		createCtrl = function() {
			return $controller('WizardResultCtrl as wizardResultController', {
				$scope: scope,
				$stateParams: stateParams,
				wizard: wizard
			});
		}
	}));
	
	it('should get search result from wizard service', function() {
		createCtrl();
		$timeout.flush();
		expect(scope.wizardResultController.result).toBe(wizard.result);
	});
	
	it('should properly set search_status', function() {
		result = {
			bingo: {
				name: {test: 'test'},
				place: {test: 'test'}
			},

			suggestions: {
				name: {},
				place: {}
			}
		};
		createCtrl();
		$timeout.flush();
		
		expect(scope.wizardResultController.search_status).toEqual('bingo');

		result = {
			bingo: {
				name: {test: 'test'},
				place: {}
			},

			suggestions: {
				name: {},
				place: {}
			}
		}
		createCtrl();
		$timeout.flush();
		
		expect(scope.wizardResultController.search_status).toEqual('bingo-name');

		result = {
			bingo: {
				name: {},
				place: {test: 'test'}
			},

			suggestions: {
				name: {},
				place: {}
			}
		}
		createCtrl();
		$timeout.flush();
		
		expect(scope.wizardResultController.search_status).toEqual('bingo-place');

		result = {
			bingo: {
				name: {},
				place: {}
			},

			suggestions: {
				name: {},
				place: {}
			}
		}
		createCtrl();
		$timeout.flush();
		
		expect(scope.wizardResultController.search_status).toEqual('none');
	});

	it('should properly set suggestion_status', function() {
		result = {
			bingo: {
				name: {},
				place: {}
			},

			suggestions: {
				name: {test: 'test'},
				place: {test: 'test'}
			}
		};
		createCtrl();
		$timeout.flush();
		
		expect(scope.wizardResultController.suggestion_status).toEqual('both');

		result = {
			bingo: {
				name: {},
				place: {}
			},

			suggestions: {
				name: {test: 'test'},
				place: {}
			}
		}
		createCtrl();
		$timeout.flush();
		
		expect(scope.wizardResultController.suggestion_status).toEqual('name');

		result = {
			bingo: {
				name: {},
				place: {}
			},

			suggestions: {
				name: {},
				place: {test: 'test'}
			}
		}
		createCtrl();
		$timeout.flush();
		
		expect(scope.wizardResultController.suggestion_status).toEqual('place');

		result = {
			bingo: {
				name: {},
				place: {}
			},

			suggestions: {
				name: {},
				place: {}
			}
		}
		createCtrl();
		$timeout.flush();
		
		expect(scope.wizardResultController.suggestion_status).toEqual('none');
	});
});