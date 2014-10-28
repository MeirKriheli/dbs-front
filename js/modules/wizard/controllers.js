'use strict';

var WizardCtrl = function($state, $stateParams) {
    var self = this;

    this.$state = $state;

    this.name = '';
    this.place = '';

    Object.defineProperty(this, 'submit_disabled', {

    	get: function() {
    		if (this.name == '' && this.place == '') {
    			return true;
    		}
    		else {
    			return false;
    		}
    	}
    });

    Object.defineProperty(this, 'show_result', {

        get: function() {

            if (self.$state.current.name == 'wizard-result') {
                return true;
            }

            return false;
        }
    });
};

WizardCtrl.prototype = {

    start: function() {
        this.$state.go('wizard-result', {name: this.name, place: this.place});
    }
};

angular.module('wizard', []).controller('WizardCtrl', ['$state', WizardCtrl]);