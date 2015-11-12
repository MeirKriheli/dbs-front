var GeneralSearchController = function($scope, $state, langManager, $stateParams, $http, apiClient, $modal, $q, $location, header) {
    var self = this, params = {};
    this._collection  = ($stateParams.collection !== undefined)?$stateParams.collection:'all-results';
    this.results1 = [];    
    this.external_results = [];
    this.$modal = $modal;
    this.$location = $location;
    this.$http = $http;
    this.apiClient = apiClient;
    header.show_search_box();

    Object.defineProperty(this, 'search_collection', {
        get: function() {
            return this.collection;
        },

        set: function(new_collection) {
            this.collection = new_collection;
        }
    });

    Object.defineProperty(this, 'query', {
        get: function() {
            return this.query_string;
        },

        set: function(new_query) {
            this.query_string = new_query;
            self.results = [];
        }
    });

    Object.defineProperty(this, 'collection', {
        get: function() {
            return this._collection;
        },

        set: function(new_collection) {
            this._collection = new_collection;
            $state.go('general-search', {q: this.query, collection: new_collection});
        }
    });


    if ($stateParams.q !== undefined) {
        params.q = header.query = this.query = $stateParams.q;
        if (this.collection != 'all-results')
            params.collection = this.collection;

        $http.get(apiClient.urls.search, {params: params})
        .success(function (r){
            self.results = r.hits;
        });
        $http.get("http://www.europeana.eu/api/v2/search.json?wskey=End3LH3bn", {params: {query: this.query}})
        .success(function(r) {
            if (r.items) {
                for (var i=0;i < r.items.length;i++) {
                    var item = r.items[i];
                    if (item.title)
                        self.external_results.push({Header:  {En: item.title}, ugc: true });
                }
            }
        })
    };
 
}; 

GeneralSearchController.prototype = {


    display_more: function() {
        var query_string = this.query_string;
        this.$http.get(this.apiClient.urls.search, {params: {q: query_string, from_: 14}})
        .success(function (r){
            this.results1 = r.hits;
        });

    },

    open_modal: function (collection_name) {
        var body = document.getElementsByTagName('body')[0];
        var scope = $scope.$new();
        scope.collection_name = this.collection;
        body.addClassName('backdrop');
        var authModalInstance = this.$modal.open({
            templateUrl: 'templates/main/allresults.html',
            size: 'lg',
            scope : scope
        });
    },
};

angular.module('main').controller('GeneralSearchController', ['$scope', '$state', 'langManager', '$stateParams', '$http', 'apiClient', '$modal', '$q', '$location', 'header', GeneralSearchController]);