var ivProgApp = angular.module('ivprog', ['ivprogServices']);

ivProgApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/startup', { templateUrl: 'partials/start.html', controller: StartCtrl }).
      when('/opened/:exercicioId', { templateUrl: 'partials/opened.html', controller: IvProgAbertoCtrl }).
      when('/create/', { templateUrl: 'partials/create.html', controller: IvProgCreateCtrl }).
      otherwise({redirectTo: '/create'}); // era startup
}]);

ivProgApp.run(function($rootScope){
    $rootScope.showBack = false;
    $rootScope.currentLanguage = 'pt';
});

ivProgApp.directive('editInPlacess', function($parse){
	return {
		restrict: 'A',

		link: function($scope, element, attrs){
			//console.log($parse(element.html()));
			$(element).editable({
				type: 'text',
				placement: 'right',
				template: 'teste',
				title: 'Alterar nome da variável',
				success: function(response, newValue) {
					//console.log("Resp: "+response+"NV: "+newValue);
					console.log("OPA");
					//userModel.set('username', newValue); //update backbone model
				}
			});
		}
	};
});
ivProgApp.directive('editInPlace', function() {
  return {
    restrict: 'A',
    scope: { value: '=editInPlace' },
    template: '<span ng-click="edit()" ng-bind="value"></span><input ng-model="value" type="text" class="input" />',
    link: function ( $scope, element, attrs ) {
      // Let's get a reference to the input element, as we'll want to reference it.
      var inputElement = angular.element( element.children()[1] );
      
      // This directive should have a set class so we can style it.
      element.addClass('edit-in-place');
      
      // Initially, we're not editing.
      $scope.editing = false;
      
      // ng-click handler to activate edit-in-place
      $scope.edit = function () {
        $scope.editing = true;
        
        // We control display through a class on the directive itself. See the CSS.
        element.addClass( 'active' );
        
        // And we must focus the element. 
        // `angular.element()` provides a chainable array, like jQuery so to access a native DOM function, 
        // we have to reference the first element in the array.
        inputElement[0].focus();
      };
      $(element).mouseout(function(){
      	$(this).removeClass("over");
      });
      $(element).mouseover(function(){
      	$(this).addClass("over");
      });
      $(inputElement).keyup(function(e){
        if(e.keyCode==13){
          $scope.editing = false;
          element.removeClass('active');
          element.removeClass('over');
        }
      });
      // When we leave the input, we're done editing.
      $(inputElement).blur(function(){
      	$scope.editing = false;
        element.removeClass('active');
      });
      
    }
  };
});

ivProgApp.directive('selectVariable', function() {
  return {
    restrict: 'A',
    scope: { value: '=selectVariable', model: '=selectModel', vars: '=selectVars' },
    templatesss: '<span ng-click="edit()" ng-bind="value"></span><input ng-model="value" type="text" class="input" />',
    template: '<span ng-click="edit()"><span ng-show="value==\'\'"><i>selecionar variável</i></span><span ng-hide="value==\'\'">{{vars[value].name}}</span></span><select ng-model="model">                        <option value="{{var.id}}" ng-repeat="var in vars">{{var.name}}</option></select>',
    link: function ( $scope, element, attrs ) {
      // Let's get a reference to the input element, as we'll want to reference it.
      var inputElement = angular.element( element.children()[1] );
      
      // This directive should have a set class so we can style it.
      element.addClass('edit-in-place');
      
      // Initially, we're not editing.
      $scope.editing = false;
      
      // ng-click handler to activate edit-in-place
      $scope.edit = function () {
        $scope.editing = true;
        
        // We control display through a class on the directive itself. See the CSS.
        element.addClass( 'active' );
        
        // And we must focus the element. 
        // `angular.element()` provides a chainable array, like jQuery so to access a native DOM function, 
        // we have to reference the first element in the array.
        inputElement[0].focus();
      };
      $(element).mouseout(function(){
        $(this).removeClass("over");
      });
      $(element).mouseover(function(){
        $(this).addClass("over");
      });
      $(inputElement).keyup(function(e){
        if(e.keyCode==13){
          $scope.editing = false;
          element.removeClass('active');
          element.removeClass('over');
        }
      });
      // When we leave the input, we're done editing.
      $(inputElement).blur(function(){
        $scope.editing = false;
        element.removeClass('active');
      });
      
    }
  };
});

ivProgApp.directive('editInPlacess', function() {
  return {
    restrict: 'E',
    scope: { value: '=' },
    template: '<span ng-click="edit()" ng-bind="value"></span><input ng-model="value"></input>',
    link: function ( $scope, element, attrs ) {
      // Let's get a reference to the input element, as we'll want to reference it.
      var inputElement = angular.element( element.children()[1] );
      
      // This directive should have a set class so we can style it.
      element.addClass('edit-in-place');
      
      // Initially, we're not editing.
      $scope.editing = false;
      
      // ng-click handler to activate edit-in-place
      $scope.edit = function () {
        $scope.editing = true;
        
        // We control display through a class on the directive itself. See the CSS.
        element.addClass( 'active' );
        
        // And we must focus the element. 
        // `angular.element()` provides a chainable array, like jQuery so to access a native DOM function, 
        // we have to reference the first element in the array.
        inputElement[0].focus();
      };
      
      // When we leave the input, we're done editing.
      inputElement.prop('onblur', function() {
        $scope.editing = false;
        element.removeClass( 'active' );
      });
    }
  };
});