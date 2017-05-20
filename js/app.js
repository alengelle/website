// Initialize Firebase
var config = {
  apiKey: "AIzaSyCvEGa9e5paXOMD4j8U4h3SExz-1eGNFhU",
  authDomain: "annick-9c643.firebaseapp.com",
  databaseURL: "https://annick-9c643.firebaseio.com",
  projectId: "annick-9c643",
  storageBucket: "annick-9c643.appspot.com",
  messagingSenderId: "109509487670"
};
firebase.initializeApp(config);

var myAppModule = angular.module('myAppModule', []);

var $ = require('./jquery')
require('./ctrl/page')(myAppModule)
require('./directives/markdown')(myAppModule)
require('./directives/blocs')(myAppModule)
require('./directives/firevar')(myAppModule)

angular.module('MyApp', [
  require('angular-route'),
  require('angular-sanitize'),
  require('angular-materialize'),
  "firebase",
  "myAppModule"
])
.config(function($routeProvider, $locationProvider, markdownConverterProvider) {
  $locationProvider.hashPrefix('');

  $routeProvider
  .when('/:page?', {
    templateUrl: 'partials/page.html',
    controller: 'pageCtrl'
  })
  .otherwise({
    redirectTo: '/'
  })

  markdownConverterProvider.config({
    extensions: [ require('./directives/markdown.ext.js') ]
  })
})
.run(function($rootScope, $firebaseObject, $firebaseAuth) {
  var db = firebase.database();
  $rootScope.auth = $firebaseAuth()

  $rootScope.auth.$onAuthStateChanged(function(firebaseUser) {
    $rootScope.user = firebaseUser
    if ($rootScope.user) {
      $firebaseObject(db.ref("admins/" + $rootScope.user.uid)).$loaded().then(function(admin) {
        $rootScope.isadmin = !! admin.$value
        if ($rootScope.isadmin) {
          $firebaseObject(db.ref("textes")).$loaded().then(function(textes) {
            $rootScope.blocs_names = Object.keys(textes).filter(function(v) { return v[0] != '$' && v.substr(0,4) != "new_" })
          })
        }
      })
    } else {
      $rootScope.isadmin = false
    }
  })

  $rootScope.signin = function() {
    $rootScope.auth.$signInWithPopup("google").then(function(firebaseUser) {
      $rootScope.user = firebaseUser.user.uid
    }).catch(function(error) {
      console.log("Authentication failed:", error)
    });
  }

  $rootScope.signout = function() {
    $rootScope.auth.$signOut()
    $rootScope.$emit('app:signout')
  }
})