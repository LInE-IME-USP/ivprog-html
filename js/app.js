var ivProgApp = angular.module('ivprog', ['ivprogServices', 'ui']);

var cacheTime = new Date().getTime(); // change to string empty to production

ivProgApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/startup', { templateUrl: 'partials/start.html', controller: StartCtrl }).
      when('/opened/:exercicioId', { templateUrl: 'partials/opened.html', controller: IvProgAbertoCtrl }).
      when('/create/', 
        { 
          templateUrl: 'partials/create.html'+"?t="+cacheTime, 
          controller: IvProgCreateCtrl
      }).
      otherwise({redirectTo: '/create'}); // era startup
}]);

ivProgApp.run(function($rootScope){
    $rootScope.showBack = false;
    $rootScope.currentLanguage = 'pt';
    // loading JSDeferred
    Deferred.define();
});

ivProgApp.directive('editInPlace', function() {
  return {
    restrict: 'A',
    scope: { value: '=editInPlace' },
    template: '<span ng-click="edit()" ng-bind="value" class="normal"></span><span class="control-group"><input ng-model="value" type="text" class="input" /></span>',
    link: function ( $scope, element, attrs ) {
      // Let's get a reference to the input element, as we'll want to reference it.
      //var inputElement = angular.element( element.children()[1] );
      var inputElement = $(element).find("input");
      var spanControlGroup = $(element).find(".control-group");

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
          if($scope.isValid($scope.value)){
            $scope.editing = false;
            element.removeClass('active');
            element.removeClass('over');
            $(spanControlGroup).removeClass("error");
          }else{
             $(spanControlGroup).addClass("error");
          }
        }
      });
      // When we leave the input, we're done editing.
      $(inputElement).blur(function(){
        if($scope.isValid($scope.value)){
      	   $scope.editing = false;
           element.removeClass('active');
           $(spanControlGroup).removeClass("error");
        }else{
          $(spanControlGroup).addClass("error");
        }
      });
      //$scope.variableNamePattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
      $scope.isValid = function(value){
        return true;
        var VAR_NAME = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
        return VAR_NAME.test(value);
      }
      
    }
  };
});

ivProgApp.directive('editInPlaceVarValue', function($rootScope) {
  return {
    restrict: 'A',
    scope: { 
      value: '=editInPlaceVarValue',
      type: '=type'
    },
    templateUrl: 'partials/directives/edit-in-place-var-values.html'+"?t="+cacheTime,
    link: function ( $scope, element, attrs ) {
      // Let's get a reference to the input element, as we'll want to reference it.
      //var inputElement = angular.element( element.children()[1] );
      var inputElement = $(element).find("input");
      var spanControlGroup = $(element).find(".control-group");

      // This directive should have a set class so we can style it.
      element.addClass('edit-in-place');
      
      // Initially, we're not editing.
      $scope.editing = false;
      
      $scope.getValue = function(){
        if($scope.value==""){
          return "====";
        }else{
          return $scope.value;
        }
      }

      // ng-click handler to activate edit-in-place
      $scope.edit = function () {
        if($scope.type=="boolean"){
          $scope.value = !$scope.value;
        }else{

          $scope.editing = true;
          
          // We control display through a class on the directive itself. See the CSS.
          element.addClass( 'active' );
          
          // And we must focus the element. 
          // `angular.element()` provides a chainable array, like jQuery so to access a native DOM function, 
          // we have to reference the first element in the array.
          inputElement[0].focus();
        }
      }
      $(element).mouseout(function(){
        $(this).removeClass("over");
      });
      $(element).mouseover(function(){
        $(this).addClass("over");
      });
      $(inputElement).keyup(function(e){
        if(e.keyCode==13){
          if($scope.isValid($scope.value)){
            $scope.editing = false;
            element.removeClass('active');
            element.removeClass('over');
            $(spanControlGroup).removeClass("has-error");
          }else{
             $(spanControlGroup).addClass("has-error");
          }
        }
      });
      // When we leave the input, we're done editing.
      $(inputElement).blur(function(){
        if($scope.isValid($scope.value)){
           $scope.editing = false;
           element.removeClass('active');
           $(spanControlGroup).removeClass("has-error");
        }else{
          $(spanControlGroup).addClass("has-error");
        }
      });

      //$scope.variableNamePattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
      $scope.isValid = function(value){
        //return true;
        if($scope.type=="int"){
          var VAR_NAME = /^[0-9]*$/;
          return VAR_NAME.test(value);  
        }
        if($scope.type=="float"){
          var VAR_NAME = /^[\-+]?[0-9]*\.?[0-9]*$/;
          return VAR_NAME.test(value);  
        }
        return true;
        
      }
      
    }
  };
});

ivProgApp.directive('varValue', function($rootScope) {
  return {
    restrict: 'A',
    scope: { 
      value: '=varValue',
      vars: '=vars',
      ttype: '=ttype',
      type: '=type'
    },
    templateUrl: 'partials/directives/var-value.html'+"?t="+cacheTime,
    link: function ( $scope, element, attrs ) {


      $scope.alternate = function(){
        if($scope.ttype=="var"){
          $scope.ttype = "val";
          $scope.value = 5;
        }else{
          $scope.ttype = "var";
          $scope.value = '';
        }
      }

    }
  };
});

ivProgApp.directive('editExpression', function() {
  return {
    restrict: 'A',
    scope: { 
      ex: '=editExpression',
      type: '=type',
      vars: '=vars'
    },
    templateUrl: 'partials/directives/edit-expression.html'+"?t="+cacheTime,
    link: function ( $scope, element, attrs ) {
      // Let's get a reference to the input element, as we'll want to reference it.
      //var inputElement = angular.element( element.children()[1] );
      /*var inputElement = $(element).find("input");
      var spanControlGroup = $(element).find(".control-group");

      // This directive should have a set class so we can style it.
      element.addClass('edit-in-place');
      
      // Initially, we're not editing.
      $scope.editing = false;
      
      // ng-click handler to activate edit-in-place
      $scope.edit = function () {
        if($scope.type=="boolean"){
          $scope.value = !$scope.value;
        }else{
          $scope.editing = true;
          
          // We control display through a class on the directive itself. See the CSS.
          element.addClass( 'active' );
          
          // And we must focus the element. 
          // `angular.element()` provides a chainable array, like jQuery so to access a native DOM function, 
          // we have to reference the first element in the array.
          inputElement[0].focus();
        }
      }
      $(element).mouseout(function(){
        $(this).removeClass("over");
      });
      $(element).mouseover(function(){
        $(this).addClass("over");
      });
      $(inputElement).keyup(function(e){
        if(e.keyCode==13){
          if($scope.isValid($scope.value)){
            $scope.editing = false;
            element.removeClass('active');
            element.removeClass('over');
            $(spanControlGroup).removeClass("has-error");
          }else{
             $(spanControlGroup).addClass("has-error");
          }
        }
      });
      // When we leave the input, we're done editing.
      $(inputElement).blur(function(){
        if($scope.isValid($scope.value)){
           $scope.editing = false;
           element.removeClass('active');
           $(spanControlGroup).removeClass("has-error");
        }else{
          $(spanControlGroup).addClass("has-error");
        }
      });

      //$scope.variableNamePattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
      $scope.isValid = function(value){
        //return true;
        if($scope.type=="int"){
          var VAR_NAME = /^[0-9]*$/;
          return VAR_NAME.test(value);  
        }
        if($scope.type=="float"){
          var VAR_NAME = /^[\-+]?[0-9]*\.?[0-9]*$/;
          return VAR_NAME.test(value);  
        }
        return true;
        
      }*/
      
    }
  };
});

ivProgApp.directive('editExpressionJava', function() {
  return {
    restrict: 'A',
    scope: { 
      ex: '=editExpressionJava',
      type: '=type',
      vars: '=vars'
    },
    templateUrl: 'partials/directives/edit-expression-java.html'+"?t="+cacheTime,
    link: function ( $scope, element, attrs ) {

      // Let's get a reference to the input element, as we'll want to reference it.

      $scope.setType = function(item, type){
        item.t = type;
        if(type=='val'){
          item.v = $scope.getDefaultValue();
        }
      }

      $scope.addEl = function(p, type){
        if(type=="val"){
          if($scope.type=="int"){
            p.push({ t: type, v: 1 });          
          }else if($scope.type=="float"){
            p.push({ t: type, v: 1.0 });
          }else if($scope.type=="boolean"){
            p.push({ 
              t: 'expB', 
              v: [
                { t: 'var', v: '' },
                { t: 'opB', v: '' },
                { t: '', v: '' }
              ]});
            //p.push({ t: type, v: false });
          }else if($scope.type=="string"){
            p.push({ t: type, v: 'texto' });
          }else{
            p.push({ t: type, v: ''});
          }
        }else if(type=="var"){
          p.push({ t: type, v: ''});
        }
      }
      $scope.getDefaultValue = function(){
          if($scope.type=="int"){
            return 1;          
          }else if($scope.type=="float"){
            return 1.0;
          }else if($scope.type=="boolean"){
            return false;
          }else if($scope.type=="string"){
            return 'texto';
          }else{
            return '';
          }
      }
      $scope.selectOp = function(opParent, op){
        //$scope.ex.push({ t: 'op', v: op});
        var old = angular.copy(opParent);
        opParent.v = [];
        opParent.t = "exp";
        
        opParent.v.push(old);
        opParent.v.push({t: 'op', v: op});
      }

      $scope.cleanOp = function(item){
        item.t = "";
        item.v = "";
      }

      $scope.operators = {
        "+": {
                id: "+",
                display: "Adição",
                compatible: ["float", "int", "string"]
        },
        "-": {
                id: "-",
                display: "Subtração",
                compatible: ["float", "int"]
        },
        "/": {
                id: "/",
                display: "Divisão",
                compatible: ["float", "int"]
        },
        "*": {
                id: "*",
                display: "Multiplicação",
                compatible: ["float", "int"]
        },
        "%": {
                id: "%",
                display: "Resto da divisão",
                compatible: ["float", "int"]
        },
        "&&": {
                id: "&&",
                display: "E",
                compatible: ["boolean"]
        },
        "||": {
                id: "||",
                display: "OU",
                compatible: ["boolean"]
        }
      };
    }
  };
});

ivProgApp.directive('editExpressionJavaReadOnly', function() {
  return {
    restrict: 'A',
    scope: { 
      ex: '=editExpressionJavaReadOnly',
      type: '=type',
      vars: '=vars'
    },
    templateUrl: 'partials/directives/edit-expression-java-read-only.html'+"?t="+cacheTime,
    link: function ( $scope, element, attrs ) {
    }
  };
});

ivProgApp.directive('editInPlaceVarName', function() {
  return {
    restrict: 'A',
    scope: { value: '=editInPlaceVarName' },
    template: '<span ng-click="edit()" ng-bind="value" class="normal"></span><span class="control-group form-group"><input ng-model="value" type="text" class="input-edit input form-control input-sm" /></span>',
    link: function ( $scope, element, attrs ) {
      // Let's get a reference to the input element, as we'll want to reference it.
      var inputElement = $(element).find("input");
      var spanControlGroup = $(element).find(".control-group");

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
          if($scope.isValid($scope.value)){
            $scope.editing = false;
            element.removeClass('active');
            element.removeClass('over');
            $(spanControlGroup).removeClass("has-error");
          }else{
             $(spanControlGroup).addClass("has-error");
          }
        }
      });
      // When we leave the input, we're done editing.
      $(inputElement).blur(function(){
        if($scope.isValid($scope.value)){
           $scope.editing = false;
           element.removeClass('active');
           $(spanControlGroup).removeClass("has-error");
        }else{
          $(spanControlGroup).addClass("has-error");
        }
      });
      //$scope.variableNamePattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
      $scope.isValid = function(value){
        var VAR_NAME = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
        return VAR_NAME.test(value);
      }
      
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
    scope: { 
      value: '=selectVariable', 
      vars: '=selectVars',
      type: '=type'
    },
    templateUrl: 'partials/directives/select-variable.html'+"?t="+cacheTime,
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
    scope: { 
      value: '=selectOperator', 
      model: '=selectModel', 
      vars: '=selectVars',
      type: '=type'
    },
    templateUrl: 'partials/directives/select-operator.html'+"?t="+cacheTime,
    link: function ( $scope, element, attrs ) {
      // Let's get a reference to the input element, as we'll want to reference it.
      var inputElement = angular.element( element.children()[1] );
      
      // This directive should have a set class so we can style it.
      //element.addClass('edit-in-place');
      
      $scope.operators = {
        "+": {
                id: "+",
                display: "+",
                compatible: ["float", "int", "string"]
        },
        "-": {
                id: "-",
                display: "-",
                compatible: ["float", "int"]
        },
        "/": {
                id: "/",
                display: "/",
                compatible: ["float", "int"]
        },
        "*": {
                id: "*",
                display: "*",
                compatible: ["float", "int"]
        },
        "%": {
                id: "%",
                display: "%",
                compatible: ["float", "int"]
        },
        "&&": {
                id: "&&",
                display: "E",
                compatible: ["boolean"]
        },
        "||": {
                id: "||",
                display: "OU",
                compatible: ["boolean"]
        }
      };

      // Initially, we're not editing.
      $scope.editing = false;
      
      $scope.setValue = function(v){
        $scope.value = v.id;
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

ivProgApp.directive('selectVariableExpression', function() {
  return {
    restrict: 'A',
    scope: { 
      value: '=selectVariableExpression',
      ex: '=ex', 
      vars: '=vars',
      type: '=type'
    },
    templateUrl: 'partials/directives/select-variable-expression.html'+"?t="+cacheTime,
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

      $scope.showOnlyForTypeFilter = function(variable){
        console.log(variable);
        console.log($scope.type);

        return variable.type==$scope.type;
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



ivProgApp.directive('booleanExpression', function() {
  return {
    restrict: 'A',
    scope: { 
      value: '=booleanExpression',
      ex: '=ex', 
      vars: '=vars'
    },
    templateUrl: 'partials/directives/boolean-expression.html'+"?t="+cacheTime,
    link: function ( $scope, element, attrs ) {
      
      
      $scope.setValue = function(va, v){
        //$scope.value.op = v;
        va = v;
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

      $scope.showOnlyForTypeFilter = function(variable){
        return variable.type==$scope.type;
      }

      $scope.getDefaultValue = function(type){
          if(type=="int"){
            return 1;          
          }else if(type=="float"){
            return 1.0;
          }else if(type=="boolean"){
            return false;
          }else if(type=="string"){
            return 'texto';
          }else{
            return '';
          }
      }


      $scope.operators = {
        ">": {
                id: ">",
                display: ">",
                compatible: ["float", "int", "string"]
        },
        "<": {
                id: "<",
                display: "<",
                compatible: ["float", "int", "string"]
        },
        "<=": {
                id: "<=",
                display: "<=",
                compatible: ["float", "int"]
        },
        ">=": {
                id: ">=",
                display: ">=",
                compatible: ["float", "int"]
        },
        "==": {
                id: "==",
                display: "=",
                compatible: ["float", "int", "string", "boolean"]
        },
        "!=": {
                id: "!=",
                display: "<>",
                compatible: ["float", "int", "string", "boolean"]
        }
      };
    }
  };
});

ivProgApp.directive('buttons', function($rootScope) {
  return {
    restrict: 'A',
    scope: { 
      nodes: '=buttons',
      idParent: '=idParent'
    },
    templateUrl: 'partials/directives/buttons.html'+"?t="+cacheTime,
    link: function ( $scope, element, attrs ) {
      $scope.add = function(parent, parentId, type, name) {
          var newNode = {
                    id: $rootScope.itemCount++,
                    type: type,
                    name: name,
                    nodes: [],
                    parent: parentId
                  };

        // especifico de cada estrutura
        if(type=="if"){
          newNode.exp = [/*
            { t: 'expB',
              v: [{"t":"val","v":""},{"t":"opB","v":""},{"t":"val","v":""}]
            }*/
          ];
          newNode.isChildrenVisible = true;
          newNode.nodes1 = [];
          newNode.nodes2 = [];
        }
        if(type=="read"){
          newNode.message = "Por favor digite um valor:";
          newNode.variable = "";
        }
        if(type=="write"){
          newNode.variable = "";
        }
        if(type=="for"){
          newNode.forType = 1; // 1 SIMPLE, 2 +-, 3 COMPLETE

          newNode.initial = 1;
          newNode.initialType = "val";

          newNode.limit = 5;
          newNode.limitType = "val";

          newNode.using = "";

          newNode.step = 1;
          newNode.stepType = "val";

          newNode.isChildrenVisible = true;

          newNode.times = 5;
          newNode.timesType = 5;
          newNode.simple = true;
          newNode.isValue = true;
          newNode.simpleVariable = "";
          newNode.initialValue = 0;
          newNode.endValue = 5;
          newNode.increment = 1;
          newNode.variable = "";
          
        }
        if(type=="attr"){
          newNode.id = "attr_"+newNode.id;
          newNode.variable = "";
          //newNode.exp = [];
          /*newNode.exp = {
            op1: '',
            op1T : '',
            op: '',
            op2: '',
            op2T: ''
          };*/
          delete newNode.nodes;
          newNode.exp = [];
          newNode.isLocked = false;
        }
        parent.push(newNode);
        $rootScope.mapping[newNode.id] = newNode;
      };
    }
  };
});

var INTEGER_REGEXP = /^\-?\d*$/;
ivProgApp.directive('integer', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
      if (INTEGER_REGEXP.test(viewValue)) {
        // it is valid
        ctrl.$setValidity('integer', true);
        return viewValue;
      } else {
        // it is invalid, return undefined (no model update)
        ctrl.$setValidity('integer', false);
        return undefined;
      }
    });
    }
  };
});

