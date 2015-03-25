/// <reference path="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.9.1.min.js" />
/// <reference path="http://ajax.aspnetcdn.com/ajax/mobileservices/MobileServices.Web-1.2.5.min.js" />


// initialize the base module
angular.module('app', []);


angular.module('app').controller('mainController', [function() {

    var self = this;
    var serviceClient = new WindowsAzure.MobileServiceClient('https://readinglist-pguru.azure-mobile.net/', 'RTwNiNJFOelgGTVGQwwzvOwaSAsaCd69');

    var currentUser = serviceClient.currentUser;

    var doPostLogin = function () {
        self.errorMessage = '';
        self.infoMessage = "Welcome " + serviceClient.currentUser.userId + "! You are now logged in.";
        self.isLoggedIn = true;
        self.refreshItems();

    };

    var handleLoginError = function(error) {
        self.errorMessage = "Login failed. " + error + "!!! Please try again or contact Code-Neurons by using the feedback form.";
    };

    
    self.isLoggedIn = (currentUser !== null);

    self.newItem = {};
    self.itemsList = [];

    self.login = function (provider) {
        serviceClient.login(provider).then(doPostLogin, handleLoginError);
    };

    self.handleSaveError = function(error) {
        alert('save error ' + error);
    };

    self.refreshItems = function() {
        var query = serviceClient.getTable('readinglistitems').where({});
        query.read().then(function(items) {
            self.itemsList = items;
        });

    };

    self.saveItem = function(newItem) {
        alert(newItem.title + ' ... ' + newItem.link);
        serviceClient.getTable('readinglistitems').insert(
            { text: newItem.title, url: newItem.link, read: false })
            .then(self.refreshItems, self.handleSaveError);
    };


}]);

