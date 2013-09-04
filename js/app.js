var ivProgApp = angular.module('ivprog', ['ivprogServices', 'ui']);

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

ivProgApp.directive('editInPlaceValue', function() {
  return {
    restrict: 'A',
    scope: { value: '=editInPlaceValue' },
    template: '<span ng-click="edit()" ng-bind="value"><span ng-show="value==\'\'">sem valor</span></span><input ng-model="value" type="text" class="input" />',
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
    template: '<span class="dropdown select-variable-value" ng-class="{\'need-to-set\': value==\'\'}"><a id="drop1" href="#" role="button" class="dropdown-toggle" data-toggle="dropdown"><span ng-show="value==\'\'"><i>selecionar variável</i></span><span ng-hide="value==\'\'">{{vars[value].name}}</span> <b class="caret"></b></a><ul class="dropdown-menu" role="menu" aria-labelledby="drop1"><li ng-repeat="var in vars"><a ng-click="setValue(var.id)">{{var.name}}</a></li></ul></span></span>',
    link: function ( $scope, element, attrs ) {
      // Let's get a reference to the input element, as we'll want to reference it.
      var inputElement = angular.element( element.children()[1] );
      
      // This directive should have a set class so we can style it.
      //element.addClass('edit-in-place');
      
      // Initially, we're not editing.
      $scope.editing = false;

      $scope.setValue = function(v){
        $scope.value = v;
      }
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

ivProgApp.directive('selectOperator', function() {
  return {
    restrict: 'A',
    scope: { value: '=selectOperator', model: '=selectModel', vars: '=selectVars' },
    template: '<span class="dropdown select-variable-value" ng-class="{\'need-to-set\': value==\'\'}"><a id="drop1" href="#" role="button" class="dropdown-toggle" data-toggle="dropdown"><span ng-show="value==\'\'"><i>selecionar operação</i></span><span ng-hide="value==\'\'">{{value}}</span> <b class="caret"></b></a><ul class="dropdown-menu" role="menu" aria-labelledby="drop1"><li ng-repeat="op in operators"><a ng-click="setValue(op)">{{op}}</a></li></ul></span></span>',
    link: function ( $scope, element, attrs ) {
      // Let's get a reference to the input element, as we'll want to reference it.
      var inputElement = angular.element( element.children()[1] );
      
      // This directive should have a set class so we can style it.
      //element.addClass('edit-in-place');
      
      $scope.operators = {
        "+": "+",
        "-": "-",
        "/": "/",
        "*": "*",
        "%": "%"
      };

      // Initially, we're not editing.
      $scope.editing = false;
      
      $scope.setValue = function(v){
        $scope.value = v;
      }
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

ivProgApp.directive('selectVariableBoot', function() {
  return {
    restrict: 'A',
    scope: { ex: '=ex', value: '=selectVariableBoot', model: '=selectModel', vars: '=selectVars' },
    template: '<span class="dropdown select-variable-value" ng-class="{\'need-to-set\': value==\'\'}"><a id="drop1" href="#" role="button" class="dropdown-toggle" data-toggle="dropdown"><span ng-show="value==\'\'"><i>selecionar variável</i></span><span ng-hide="value==\'\'">{{vars[value].name}}</span> <b class="caret"></b></a><ul class="dropdown-menu" role="menu" aria-labelledby="drop1"><li ng-repeat="var in vars"><a ng-click="setValue(var.id)">{{var.name}}</a></li><li class="divider"></li><li><a ng-click="removeItem(ex)">Remover item</a></li><li><a ng-click="convertToValue(ex)">Converter para valor</a></li><li><a ng-click="isolar(ex)">Isolar</a></li></ul></span></span>',
    link: function ( $scope, element, attrs ) {
      // Let's get a reference to the input element, as we'll want to reference it.
      var inputElement = angular.element( element.children()[1] );
      
      // This directive should have a set class so we can style it.
      //element.addClass('edit-in-place');
      
      // Initially, we're not editing.
      $scope.editing = false;
      
      $scope.setValue = function(v){
        $scope.value = v;
      }
      $scope.isolar = function(item){
        item.t = "exp";
        item.v = "";
        item.exp = [];
      }
      $scope.convertToValue = function(item){
        item.t = "val";
        item.v = 0;
      }
      $scope.removeItem = function(v){
        v.p.splice(v.p.indexOf(v), 1);
      }

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

