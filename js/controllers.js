function StartCtrl(){

}
function IvProgCreateCtrl($scope, IvProgSource){
	$scope.itemCount = 0;
	$scope.vars = [];
	$scope.params = [];

	$scope.currentProgram = 0;
	$scope.programs = [
						{ 
							programName: "firstProgram.ivprog",
							functions: [
								{
									functionName: "main",
									vars: [],
									params: [],
									type: "main",
									nodes: []
								}
							]
						}];

	$scope.getTemplate = function(x){
		return x.type+'.html';
	}
	$scope.addParam = function(){
		//var ind = $scope.params.length;
		var ind = $scope.programs[$scope.currentProgram].functions[0].params.length;

		//$scope.params.push({ name: 'newParam'+ind, type: 'int', initialValue: 0 } );
		$scope.programs[$scope.currentProgram].functions[0].params.push({ name: 'newParam'+ind, type: 'int', initialValue: 0 } );
	}
	$scope.removeParam = function(v){
		$scope.params.splice($scope.params.indexOf(v), 1);
	}
	$scope.addVar = function(){
		//var ind = $scope.vars.length;
		var ind = $scope.programs[$scope.currentProgram].functions[0].vars.length;
		//$scope.vars.push({ name: 'newVar'+ind, type: 'int', initialValue: 0 } );
		$scope.programs[$scope.currentProgram].functions[0].vars.push({ name: 'newVar'+ind, type: 'int', initialValue: 0, id: $scope.itemCount++ });
	}
	$scope.removeVar = function(v){
		$scope.vars.splice($scope.vars.indexOf(v), 1);
	}
	$scope.removeItem = function(parent, item){
		parent.nodes.splice(parent.nodes.indexOf(item),1);
	}
	$scope.delete = function(data) {
	    data.nodes = [];
	};
	$scope.run = function(){
		IvProgSource.generate($scope.programs[$scope.currentProgram]);
	}
	// considering add as IF
	$scope.add = function(data, type, name) {
	    //var post = data.nodes.length + 1;
	    //var newName = data.name + '-' + post;
	    var newData = {};
	    if(type=="var"){
	    	newData.varName = "newVar1";
	    	newData.varValue = "0";
	    }
	    var newNode = {
		    				type: type,
		    				name: name,
		    				data: newData,
		    				nodes: [],
		    				parent: data
		    			};
		if(type=="write"){
			newNode.variable = "aaa";
		}
	    if(data==null){
	    	$scope.programs[$scope.currentProgram].functions[0].nodes.push( newNode);
	    }else{
		    data.nodes.push( newNode);
		}
	};

}
function IvProgAbertoCtrl($scope){
  $scope.delete = function(data) {
        data.nodes = [];
    };
    $scope.add = function(data) {
        var post = data.nodes.length + 1;
        var newName = data.name + '-' + post;
        data.nodes.push({name: newName,nodes: []});
    };
    $scope.tree = [{name: "Node", nodes: []}];
}

