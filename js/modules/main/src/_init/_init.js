'use strict';

/**
 * @ngdoc module
 * @name main
 * @module main
 *
 * @description
 * # BHSClient main module
 * This is the main module for the BHS client.
 * It contains the ui.router state configurations.
 */
angular.module('main', [
    'ngResource',
    'ngAnimate',
    'ngSanitize',
    'ngStorage',
    'ui.bootstrap',
    'ui.router',
    'config',
    'flow',
    'lang',
    'auth',
    'apiClient',
    'cache',
    'plumb',
    'rcSubmit',
    'gedcomParser',
	'hc.marked'
    ]).
config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
	   '$httpProvider', '$provide', '$sceDelegateProvider', 'markedProvider',
function($urlRouterProvider, $stateProvider, $locationProvider, $httpProvider, $provide, $sceDelegateProvider, markedProvider) {

    /*** State definitions go here ***/
    var states = [ 
        {
            name: 'start',
			title: 'Home Page',
            url: '/',
            templateUrl: 'templates/main/start.html',
            controller: 'StartController as startCtrl',
            onEnter: ['cache', 'wizard', 'header', function(cache, wizard, header) {
                wizard.clear();
                header.sub_header_state = 'closed';
            }]
        },

        {
            name: 'item-view',
            url: '/item/:collection/:id',
            controller: 'ItemCtrl as itemController',
			templateUrl: function(params) {
				return 'templates/item/'+params.collection+'.html'
			}

        },

        {
            name: 'general-search',
            url: '/search?q&size&from_&collection',
            controller: 'GeneralSearchController as generalSearchCtrl',
            templateUrl: 'templates/main/search-results.html'
        },

        {
            name: 'about_center',
            url: '/about/:collection',
            controller: 'GeneralSearchController as generalSearchCtrl',
            templateUrl: 'templates/main/allresults.html'
        },

        {
            name: 'mjs',
            url: '/mjs',
            templateUrl: 'templates/main/mjs/mjs.html',
            onEnter: ['notification', 'plumbConnectionManager', 'plumbConnectionSetManager', function(notification, plumbConnectionManager, plumbConnectionSetManager) {
                notification.clear();
                plumbConnectionManager.connections = {};
                angular.forEach(plumbConnectionSetManager.sets, function(connection_set) {
                    connection_set.repaint();
                });
            }]
        }, 

        {
            name: 'ftrees',
            url: '/ftrees?place&first_name&last_name&maiden_name&sex&birth_place&marriage_place&death_place&birth_year&marriage_year&death_year&filters_tree_number',
            controller: 'FtreesController as ftreesCtrl',
            //templateUrl: 'templates/main/ftrees/ftrees.html'
            templateUrl: 'templates/main/ftrees/coming-soon.html'
        },

        {
            name: 'ftree-view',
            url: '/ftree_view/:tree_number/:node_id',
            controller: 'FtreeViewController as ctrl',
            templateUrl: 'templates/main/ftrees/ftree-item.html',
            onEnter: ['header', function(header) {
                header.show_recent();
				header.hide_main = true;
            }],
            onExit: ['header', function(header) {
				header.hide_main = false;
            }]
        },


        {
            name: 'upload',
            abstract: true,
            url: '/upload',
            templateUrl: 'templates/main/upload/upload.html'
        },

        {
            name: 'upload.image',
            url: '/image',
            controller: 'UploadFormController as uploadFormCtrl',
            templateUrl: 'templates/main/upload/image.html'
        },

        {
            name: 'upload.video',
            url: '/video',
            //controller: 'PictureUploadController as pictureUploadCtrl',
            templateUrl: 'templates/main/upload/video.html'
        },

        {
            name: 'upload.music',
            url: '/music',
            //controller: 'PictureUploadController as pictureUploadCtrl',
            templateUrl: 'templates/main/upload/music.html'
        },

        {
            name: 'upload.family_tree',
            url: '/family_tree',
            controller: 'UploadFormController as uploadFormCtrl',
            templateUrl: 'templates/main/upload/tree.html'
        },

        {
            name: 'verify_email',
            url: '/verify_email/:verification_token',
            controller: 'VerifyEmailController as verifyEmailCtrl',
            templateUrl: 'templates/main/verify_email.html'
        },

        {
            name: '404',
            abstract: true,
            templateUrl: 'templates/main/404.html'
        }

    ];

    angular.forEach(states, function(state) {
        $stateProvider.state(state);
    });

    /*** End of state definitions ***/

    // Add current state data to $state when calling $state.go
    $provide.decorator('$state', function($delegate, $stateParams) {
        var old_go = $delegate.go;
        $delegate.go = function(state_name, state_params, config) {
            $delegate.lastState = $delegate.current;
            $delegate.lastStateParams = $delegate.params;
            return old_go.apply($delegate, [state_name, state_params, config]);
        };
        return $delegate;
    });

    $urlRouterProvider.otherwise('/405');

    $locationProvider.html5Mode(true);

    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        new RegExp('^http[s]?:\/\/storage.googleapis.com\/bhs.*\.mp4$')
    ]);

	markedProvider.setOptions({ breaks: true })
}]).
run(['$state', '$rootScope', 'langManager', 'header', function ($state, $rootScope, langManager, header) {
    
    Object.defineProperty($rootScope, 'lang', {
        get: function() {
            return langManager.lang;
        },

        set: function(language) {
            langManager.lang = language;
        }
    });

    Object.defineProperty($rootScope, 'header_visible', {
        get: function() {
            return header.is_visible;
        }
    });

    $rootScope.isCurrentState = function(state_name) {
        return $state.includes(state_name);
    };
    
    // $rootScope.facebookAppId = 666465286777871;

    $state.go('start');
	$rootScope.$on('$stateChangeSuccess',
		function(event, toState, toParams, fromState, fromParams){
			$rootScope.title = ('title' in toState)?toState.title:"";
	});

}]);
