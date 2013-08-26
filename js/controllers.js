function StartCtrl(){

}
function IvProgCreateCtrl($scope, IvProgSource, $filter){
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
									vars: {},
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
		var ind = $scope.itemCount;
		var id = "var"+$scope.itemCount++;
		$scope.programs[$scope.currentProgram].functions[0].vars[id] = ({ name: 'newVar'+ind, type: 'int', initialValue: 0, id: id });
	}
	$scope.removeVarRec = function(nodes, id){
		angular.forEach(nodes, function(node, key){

			if(node.type=="write"){
				if(node.variable==id){
					node.variable = '';
				}
			}
			if(node.nodes.length>0){
				$scope.removeVarRec(node.nodes, id);
			}
		});
	}
	$scope.removeVar = function(v){
		$scope.removeVarRec($scope.programs[$scope.currentProgram].functions[0].nodes, v.id);
		delete $scope.programs[$scope.currentProgram].functions[0].vars[v.id];
	}
	$scope.removeItem = function(parent, item){
		parent.nodes.splice(parent.nodes.indexOf(item),1);
	}
	$scope.delete = function(data) {
	    data.nodes = [];
	};
	$scope.run = function(){
		var code = $scope.genCode($scope.programs[$scope.currentProgram]);
		console.log(code);
		window.eval(code);
	}
	$scope.clearOutput = function(){
		$(".output").html("");
	}
	$scope.genCode = function(funcs){
		var strCode = "var t = function(){";
		angular.forEach(funcs.functions, function(func, key){
			strCode+= "function "+func.functionName+"(){";
			angular.forEach(func.vars, function(variable, key){
				strCode+="var var_"+variable.id+" = "+variable.initialValue+";";
			});
			var ordenador = $filter('orderBy');
			console.log(ordenador(func.nodes, "order"));
			// precisa ordenar os nodes
			strCode+=$scope.genNode(func.nodes);
			strCode+= "}";
			if(func.type=="main"){
				strCode+=func.functionName+"()";
			}
		});
		strCode+="}; t();";
		return strCode;
	}
	$scope.genNode = function(nodes){
		var strCode = "";
		angular.forEach(nodes, function(node, key){
			if(node.type=="write"){
				if(node.variable!=''){
					strCode += "writer(";
					strCode += "var_"+node.variable;
					strCode += ");";
				}
			}
			if(node.type=="for"){
				if(node.times>0){
					strCode+= "for(var for_"+node.id+"=0; for_"+node.id+"<"+node.times+"; "+"for_"+node.id+"++){";
					if(node.nodes.length>0){
						strCode += $scope.genNode(node.nodes);
					}
					strCode+="}";
				}
			}
			/*if(node.nodes.length>0){
				strCode += $scope.genCode(node.nodes);
			}*/
		});
		return strCode;
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
	    var order;
	    if(data==null){
	    	order = $scope.programs[$scope.currentProgram].functions[0].nodes.length;
	    }else{
		    order = data.nodes.length;
		}
	    var newNode = {
	    					id: $scope.itemCount++,
		    				type: type,
		    				name: name,
		    				data: newData,
		    				nodes: [],
		    				parent: data,
		    				order: order
		    			};
		if(type=="write"){
			newNode.variable = "";
		}
		if(type=="for"){
			newNode.times = 5;
		}
	    if(data==null){
	    	$scope.programs[$scope.currentProgram].functions[0].nodes.push( newNode);
	    }else{
		    data.nodes.push(newNode);
		}
	};

	$scope.order = function(data, qt){
		console.log(data);
		data.order +=qt;
	}

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

