module.exports = function(myAppModule) {
	myAppModule.directive('firevar', function ($firebaseObject) {
		return {
			restrict: 'E',
			template: ' \
<div input-field> \
	<input type="text" ng-model="ngModel.$value" ng-blur="save()"/> \
	<label>{{label}}</label> \
</div>',
			scope: {
				ngModel: "=",
				label: "@",
				name: "@"
			},
			link: function (scope, element, attrs) {
				var db = firebase.database()
				scope.ngModel = $firebaseObject(db.ref("vars/" + scope.name))
				var loaded
				scope.ngModel.$loaded().then(function() {
					loaded = true
				})
				scope.save = function() {
					if (loaded) {
						scope.ngModel.$save()
					}
				}
			}
		};
	});
}