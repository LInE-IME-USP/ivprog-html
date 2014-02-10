var deferred = Deferred();

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

		$("#valor").unbind('keydown');
		$("#valor").keydown(function( event ) {
			if ( event.which == 13 ) {
				$('#readData').modal('hide');
				var valor = $("#valor").val();
				$("#valor").val("");
				deferred.call(valor);
				event.preventDefault();
			}
		});
		$("#btnOk").unbind('click');
		$("#btnOk").click(function(){
			$('#readData').modal('hide');
			var valor = $("#valor").val();
			$("#valor").val("");
			deferred.call(valor);
		});
	}
	$scope.clearOutput = function(){
		$(".output").html("");
	}
	$scope.genCode = function(funcs){
		var strCode = "var t = function(){";

		//strCode += 'var deferred = Deferred();';

		var i = 0;
		angular.forEach(funcs.functions, function(func, key){
			if(i++==0){
			strCode+= "function "+func.name+"(){";

			angular.forEach(func.vars, function(variable, key){
				strCode+="var var_"+variable.id+" = "+variable.initialValue+";";
			});
	
			strCode+= 'next(function(){';			
			//strCode+='return deferred;'
			strCode+='})'
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
					strCode += ".next(function(){";
					strCode += "writer(";
					strCode += "var_"+node.variable;
					strCode += ");})";
				}
			}
			if(node.type=="for"){
				console.log(node);
				if(((node.simple)&&(node.times>0))||((node.simple)&&(node.simpleVariable!=""))){
					strCode+= '.next(function(){';
					if(node.isValue){
						strCode+= 'var i'+node.id+' = 0;'
					}else{
						strCode+= 'var_'+node.simpleVariable+' = 0;'
					}
					strCode+= 'function loop'+node.id+'(){';
					strCode+= '	return next(function(){})'; // apenas para poder encadear
					if(node.nodes.length>0){
						strCode+= $scope.genNode(node.nodes);
					}
					strCode+='	.next(function(){';
					//strCode+='		writer("i'+node.id+'"+i'+node.id+');'
					if(node.isValue){
						strCode+='		++i'+node.id+';';	
						strCode+='		if(i'+node.id+'<'+node.times+'){';
					}else{
						strCode+='		++var_'+node.simpleVariable+';';
						strCode+='		if(var_'+node.simpleVariable+'<'+node.times+'){';
					}
					
					
					strCode+='			return loop'+node.id+'();';
					strCode+='		}'
					strCode+='	});';
					strCode+='}';
					strCode+='return loop'+node.id+'();})';
				}else{
					strCode+= '.next(function(){';
					strCode+= ''+node.simpleVariable+' = '+node.initialValue+';'
					strCode+= 'function loop'+node.id+'(){';
					strCode+= '	return next(function(){})'; // apenas para poder encadear
					if(node.nodes.length>0){
						strCode+= $scope.genNode(node.nodes);
					}
					strCode+='	.next(function(){';
					//strCode+='		writer("i'+node.id+'"+i'+node.id+');'
					strCode+='		++'+node.simpleVariable+';';
					strCode+='		if('+node.simpleVariable+'<'+node.endValue+'){';
					strCode+='			return loop'+node.id+'();';
					strCode+='		}'
					strCode+='	});';
					strCode+='}';
					strCode+='return loop'+node.id+'();})';
				}
			}
			if(node.type=="attr"){
				strCode+= '.next(function () {';
				strCode+="		var_"+node.variable+"=";
				strCode+="			("+$scope.genExp(node.exp)+")";
				strCode+="		;";
				strCode+= '})';
			}
			if(node.type=="read"){
				strCode+= '.next(function () {';
				strCode+= '		$("#msgRead").html("'+node.message+'");';
				strCode+= '		$("#readData").modal();';
				strCode+= '		$("#valor").focus();';
				strCode+= '		return deferred;';
				strCode+= '}).';
				strCode+= 'next(function(a){';
				strCode+= '		console.log("Valor lido: "+a);';
				var v = $scope.program.functions[$scope.currentFunction].vars[node.variable];
				if(v.type=="int"){
					strCode+= "		var_"+node.variable +" = parseInt(a);";	
				}else if(v.type="float"){
					strCode+= "		var_"+node.variable +" = parseFloat(a);";
				}else if(v.type="boolean"){
					// tratar boolean depois
					strCode+= "		var_"+node.variable +" = a;";
				}else{
					strCode+= "		var_"+node.variable +" = a;";
				}
				
				strCode+= '})';
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
	
	$scope.changeForType = function(node){
		node.simple = !node.simple;
	}
	$scope.changeForValue = function(node){
		node.isValue = !node.isValue;
		if(!node.isValue){
			node.simpleVariable = "";
		}
		writer(node.isValue);
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
		if(type=="read"){
			newNode.message = "Por favor digite um valor:";
		}
		if(type=="write"){
			newNode.variable = "";
		}
		if(type=="for"){
			newNode.times = 5;
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

