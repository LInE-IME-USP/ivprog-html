function StartCtrl(){

}
function IvProgCreateCtrl($scope, IvProgSource, $filter){
	$scope.itemCount = 0;
	$scope.vars = [];
	$scope.params = [];

	$scope.currentFunction = 0;
	$scope.program = { 
							programName: "firstProgram",
							functions: [
								{
									isMain: true,
									name: "main",
									vars: {},
									varss: {
										"var_1":
											{ name: 'newVar1', type: 'int', initialValue: 0, id: "var_1" }
									},
									params: {},
									type: "main", // int, void, float
									nodes:[],
									nodess: [
										{
					    					id: "attr_1",
						    				type: "attr",
						    				name: "attr",
						    				parent: null,
						    				variable: "",
						    				exp: []
						    			}
									]
								},
								{
									isMain: false,
									name: "fatorial",
									vars: {},
									varss: {
										"var_1":
											{ name: 'newVar1', type: 'int', initialValue: 0, id: "var_1" }
									},
									params: {},
									type: "int", // int, void, float
									nodes:[],
									nodess: [
										{
					    					id: "attr_1",
						    				type: "attr",
						    				name: "attr",
						    				parent: null,
						    				variable: "",
						    				exp: []
						    			}
									]
								}
							]
						};

	$scope.setCurrentFunction = function(ind){
		$scope.currentFunction = ind;
	}

	$scope.addElVar = function(v){
		v.push({
						t: "var",
						v: "",
						o: "+",
						p: v
					});
	}
	$scope.addElVal = function(v){
		v.push({
						t: "val",
						v: 0,
						o: "+",
						p: v
					});
	}
	$scope.isolar = function(item){
		item.t = "exp";
		item.v = "";
		item.exp = [];
		//console.log(item);
		//item.v.push({t: "val", v: "a", o: "+"});
	}
	$scope.addExp = function(parent){
		parent.push({ t: "val", v: "a", o: "+"});
		//$scope.programs[$scope.currentProgram].functions[0].nodes[0].exp.push({t:"val", v: "teste", o: "+"});
	}
	

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
	$scope.varSetType = function(v, type){
		v.type = type;
	}
	$scope.addVar = function(){
		var ind = $scope.itemCount;
		var id = "var"+$scope.itemCount++;
		$scope.program.functions[$scope.currentFunction].vars[id] = ({ name: 'newVar'+ind, type: 'float', initialValue: 0, id: id });
	}
	$scope.removeVarRec = function(nodes, id){
		angular.forEach(nodes, function(node, key){

			if(node.type=="write"){
				if(node.variable==id){
					node.variable = '';
				}
			}
			if(node.type!="attr"){
				if(node.nodes.length>0){
					$scope.removeVarRec(node.nodes, id);
				}
			}
		});
	}
	$scope.removeVar = function(v){
		$scope.removeVarRec($scope.program.functions[$scope.currentFunction].nodes, v.id);
		delete $scope.program.functions[$scope.currentFunction].vars[v.id];
	}
	$scope.removeItem = function(parent, item){
		//parent.nodes.splice(parent.nodes.indexOf(item),1);
		parent.splice(parent.indexOf(item),1);
	}
	$scope.isValidAttr = function(attr){
		var isValid = true;
		angular.forEach(attr, function(a, k){
			if(a.type=="var"){

			}
		});
		//console.log(attr);
		return false;
	}
	$scope.sortableOptions = {
	    handle: '.handle'
	};
	$scope.delete = function(data) {
	    data.nodes = [];
	};
	$scope.run = function(){
		var code = $scope.genCode($scope.program);
		console.log(code);
		window.eval(code);
	}
	$scope.clearOutput = function(){
		$(".output").html("");
	}
	$scope.genCode = function(funcs){
		var strCode = "var t = function(){";
		var i = 0;
		angular.forEach(funcs.functions, function(func, key){
			if(i++==0){
			strCode+= "function "+func.name+"(){";
			angular.forEach(func.vars, function(variable, key){
				strCode+="var var_"+variable.id+" = "+variable.initialValue+";";
			});
			var ordenador = $filter('orderBy');
			//console.log(ordenador(func.nodes, "order"));
			// precisa ordenar os nodes
			strCode+=$scope.genNode(func.nodes);
			strCode+= "}";
			if(func.type=="main"){
				strCode+=func.name+"()";
			}
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
			if(node.type=="attr"){
				strCode+=" var_"+node.variable+"=";
				strCode+="("+$scope.genExp(node.exp)+")";
				strCode+=";";
			}
			/*if(node.nodes.length>0){
				strCode += $scope.genCode(node.nodes);
			}*/
		});
		return strCode;
	}
	$scope.genExp = function(exp){
		var strCode = "";
		
		angular.forEach(exp, function(ex, key){
			if(ex.t=="var"){
				strCode+=" var_"+ex.v+" ";
			}else if(ex.t=="val"){
				strCode+=" "+ex.v+" ";
			}else if(ex.t=="exp"){
				strCode+=" ( "+$scope.genExp(ex.exp)+" ) ";
			}
			if(key<exp.length-1){
				strCode+=ex.o;
			}
		});
		return strCode;
	}
	
	$scope.add = function(parent, type, name) {
	    var newNode = {
	    					id: $scope.itemCount++,
		    				type: type,
		    				name: name,
		    				nodes: [],
		    				parent: parent
		    			};

		// especifico de cada estrutura
		if(type=="write"){
			newNode.variable = "";
		}
		if(type=="for"){
			newNode.times = 5;
		}
		if(type=="attr"){
			newNode.id = "attr_"+newNode.id;
			newNode.variable = "";
			newNode.exp = [];
			delete newNode.nodes;
		}
		parent.push(newNode);
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

