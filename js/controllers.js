var deferred = Deferred();

function StartCtrl(){

}
function IvProgCreateCtrl($scope, $rootScope, IvProgSource, $filter){
	$scope.itemCount = 0;
	$scope.vars = [];
	$scope.params = [];

	$scope.mapping = {};


	// undo - redo control
	$scope.historyStack = -1;
	$scope.actionsHistory = [];
	$scope.addSnap = true;
	$scope.takeSnap = function(friendlyName, applying, sp){
		if(sp){
			$scope.actionsHistory.splice($scope.historyStack, $scope.actionsHistory.length-$scope.historyStack);
		}
		$scope.actionsHistory.push({name: friendlyName, src: JSON.stringify($scope.program)});
		$scope.historyStack = $scope.actionsHistory.length;
	}
	$rootScope.snapshot = function(friendlyName, applying){
		if(!applying){
			$scope.$apply(function(){
				$scope.takeSnap(friendlyName, applying, true);
			});
		}else{
			$scope.takeSnap(friendlyName, applying, true);
		}
		$scope.addSnap = true;
	}
	$scope.undo = function(){
		if($scope.historyStack>0){
			if($scope.addSnap){
				// salvando o estado atual
				$scope.takeSnap('', 1);
				$scope.historyStack--;
				$scope.addSnap = false;
			}
			$scope.historyStack--;
			var obj = JSON.parse($scope.actionsHistory[$scope.historyStack].src);
			$scope.program = obj;
		}
	}
	$scope.redo = function(){
		if($scope.historyStack < $scope.actionsHistory.length-1){
			$scope.historyStack++;
			var obj = JSON.parse($scope.actionsHistory[$scope.historyStack].src);
			
			$scope.program = obj;
		}
	}


	$scope.currentFunction = 0;
	$scope.program = { 
							programName: "firstProgram",
							functions: [
								{
									isMain: true,
									name: "Principal",
									vars: {},
									params: {},
									type: "main", // int, void, float
									nodes:[]
								}/*,
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
								}*/
							]
						};

	$scope.setCurrentFunction = function(ind){
		$scope.currentFunction = ind;
	}

	$scope.addElVar = function(v){
		v.push({
						t: "var",
						v: "",
						o: "",
						p: ''//v
					});
	}
	$scope.addElVal = function(v){
		v.push({
						t: "val",
						v: 0,
						o: "",
						p: ''//v
					});
	}
	$scope.addElExpB = function(v){
		v.push({
						t: "expB",
						v: {
							op1: {
								t: "v",
								v: ""
							},
							op2: {
								t: "v",
								v: ""
							},
							op: ">"
						},
						o: "&&",
						p: ''//v
					});
	}
	$scope.isolar = function(item){
		item.t = "exp";
		item.v = "";
		item.exp = [];
	}
	$scope.addExp = function(parent){
		parent.push({ t: "val", v: "a", o: "+"});
	}
	

	$scope.getTemplate = function(x){
		return 'partials/elements/'+x.type+'.html'+"?t="+cacheTime;
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
		var previousType = v.type;
		v.type = type;

		if(type=="string"){
			v.initialValue = "Olá mundo!";
		}else if(type=="float"){
			v.initialValue = 1.0;
		}else if(type=="int"){
			v.initialValue = 0;
		}else if(type=="boolean"){
			v.initialValue = true;
		}
		$scope.checkChangeTypeConsequences(v, $scope.program.functions[$scope.currentFunction].nodes, previousType);
	}
	// quando alterar o tipo de uma variavel, checar as consequencias
	$scope.checkChangeTypeConsequences = function(variable, where, previous){
		angular.forEach(where, function(item, key){
			if(item.type=="attr"){
				if(item.variable==variable.id){
					if(variable.type!=previous){
						var compatibility = ["int", "float"];
						if((compatibility.indexOf(variable.type)==-1)||(compatibility.indexOf(previous)==-1)){
							if(where[key].exp.length>0){
								where[key].exp = [];
							}	
						}
					}
				}
			}
			if(item.nodes && item.nodes.length>0){
				$scope.checkChangeTypeConsequences(variable, item.nodes);
			}
		});
	}
	$scope.addVar = function(){
		// TODO: checar se alterou o valor
        $rootScope.snapshot('Variável adicionada', true);
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
		$rootScope.snapshot('Variável removida', true);
		$scope.removeVarRec($scope.program.functions[$scope.currentFunction].nodes, v.id);
		delete $scope.program.functions[$scope.currentFunction].vars[v.id];
	}
	$scope.removeItem = function(parent, item){
		// TODO: tratar para os outros functions
		if(parent=="root_0"){
			parent = $scope.program.functions[0].nodes;
		}else{
			parent = $scope.mapping[parent].nodes;
		}
		parent.splice(parent.indexOf(item),1);
	}
	$scope.isValidAttr = function(attr){
		var isValid = true;
		angular.forEach(attr, function(a, k){
			if(a.type=="var"){

			}
		});
		return false;
	}
	$scope.sortableOptions = {
	    handle: '.handle',
        placeholder: "apps",
        connectWith: ".apps-container"
	};
	$scope.delete = function(data) {
	    data.nodes = [];
	};
	$scope.run = function(){
		if(!$scope.validateEverything($scope.program)){
			writer("<i class='fa fa-exclamation-triangle'></i> Existem campos vazios. Preencha os campos com borda vermelha para executar o algoritmo corretamente.");
		}else{
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
	}
	$scope.clearOutput = function(){
		$(".output").html("");
	}
	$scope.validateEverything = function(funcs){
		$(".node-with-error").removeClass("node-with-error");
		var ret = true;
		angular.forEach(funcs.functions, function(func, key){
			ret = ret && $scope.validateNode(func.nodes, func.vars);
		});
		return ret;
	}
	$scope.validateNode = function(nodes, vars){
		var ret = true;
		angular.forEach(nodes, function(node, key){
			if (node.type=="write"){
				if(node.variable==""){
					$("#node"+node.id).find(".select").addClass("node-with-error");
					ret = false;
				}
			}
			if(node.type=="read"){
				if(node.variable==""){
					$("#node"+node.id).find(".select").addClass("node-with-error");
					ret = false;
				}
			}
			if(node.type=="for"){
				if(node.forType==1){
					if((node.limitType=="var")&&(node.limit=="")){
						$("#node"+node.id).find(".for1").find(".select").addClass("node-with-error");
						ret = false;
					}
				}
				if(node.forType==2){
					if((node.limitType=="var")&&(node.limit=="")){
						$("#node"+node.id).find(".for1").find(".select").addClass("node-with-error");
						ret = false;
					}
					if(node.using==""){
						$("#node"+node.id).find(".for2").addClass("node-with-error");
						ret = false;
					}	
				}
				if(node.forType==3){
					if((node.limitType=="var")&&(node.limit=="")){
						$("#node"+node.id).find(".for1").find(".select").addClass("node-with-error");
						ret = false;
					}
					if(node.using==""){
						$("#node"+node.id).find(".for2").addClass("node-with-error");
						ret = false;
					}
					if((node.initialType=="var")&&(node.initial=="")){
						ret = false;
					}
					if((node.initialType=="val")&&(node.limitType=="val")&&(node.initial>node.limit)){
						ret = false;
					}
					if((node.stepType=="var")&&(node.step=="")){
						$("#node"+node.id).find(".for3").find(".select").addClass("node-with-error");
						ret = false;
					}
				}
			}
		});
		return ret;
	}
	$scope.genCode = function(funcs){
		var strCode = "var t = function(){";
		var i = 0;
		angular.forEach(funcs.functions, function(func, key){
			if(i++==0){
			strCode+= "function "+func.name+"(){";
			angular.forEach(func.vars, function(variable, key){
				if(variable.type=="string"){
					strCode+="var var_"+variable.id+" = \""+variable.initialValue+"\";";
				}else{
					strCode+="var var_"+variable.id+" = "+variable.initialValue+";";
				}
			});
	
			strCode+= 'next(function(){';			
			//strCode+='return deferred;'
			strCode+='})'
			strCode+=$scope.genNode(func.nodes, func.vars);

			strCode+= "}";
			if(func.type=="main"){
				strCode+=func.name+"()";
			}
		}
		});
		strCode+="}; t();";
		
		return strCode;
	}
	$scope.genNode = function(nodes, vars){
		var strCode = "";
		angular.forEach(nodes, function(node, key){
			if(node.type=="write"){
				if(node.variable!=''){
					var v = $scope.program.functions[$scope.currentFunction].vars[node.variable];
					strCode += ".next(function(){";
					
					if(v.type=="boolean"){
						strCode+="if(var_"+node.variable+"){ writer('Verdadeiro'); }else{ writer('Falso'); }";
					}else{
						strCode += "writer(";
						strCode += "var_"+node.variable;
						strCode += ");";
					}
					strCode += "})";
				}
			}
			if(node.type=="for"){
				
				if(node.forType==1){
					// for simples
					strCode+= '.next(function(){';
					strCode+= 'var i'+node.id+ ' = 0;';
					strCode+= 'function loop'+node.id+'(){';
					strCode+= '	return next(function(){})'; // apenas para poder encadear
					if(node.nodes.length>0){
						strCode+= $scope.genNode(node.nodes, vars);
					}
					strCode+='	.next(function(){';
					strCode+='		++i'+node.id+';';
					if(node.limitType=="val"){
						strCode+='		if(i'+node.id+'<'+node.limit+'){';
					}else{
						strCode+='		if(i'+node.id+'<'+' var_'+node.limit+'){';
					}
					strCode+='			return loop'+node.id+'();';
					strCode+='		}'
					strCode+='	});';
					strCode+='}';
					if(node.limitType=="val"){
						strCode+='		if(i'+node.id+'<'+node.limit+'){';
					}else{
						strCode+='		if(i'+node.id+'<'+' var_'+node.limit+'){';
					}
					strCode+='return loop'+node.id+'();';
					strCode+='}';
					strCode+='})';
				}else if(node.forType==2){
					// for mediano
					strCode+= '.next(function(){';
					strCode+= '	var_'+node.using+ ' = 0;';
					strCode+= 'function loop'+node.id+'(){';
					strCode+= '	return next(function(){})'; // apenas para poder encadear
					if(node.nodes.length>0){
						strCode+= $scope.genNode(node.nodes, vars);
					}
					strCode+='	.next(function(){';
					strCode+='		++var_'+node.using+';';
					if(node.limitType=="val"){
						strCode+='		if(var_'+node.using+'<'+node.limit+'){';
					}else{
						strCode+='		if(var_'+node.using+'<'+' var_'+node.limit+'){';
					}
					strCode+='			return loop'+node.id+'();';
					strCode+='		}'
					strCode+='	});';
					strCode+='}';
					if(node.limitType=="val"){
						strCode+='		if(var_'+node.using+'<'+node.limit+'){';
					}else{
						strCode+='		if(var_'+node.using+'<'+' var_'+node.limit+'){';
					}
					strCode+='return loop'+node.id+'();';
					strCode+='}';
					strCode+='})';
				}else if(node.forType==3){
					// for hard rs
					strCode+= '.next(function(){';
					if(node.initialType=="val"){
						strCode+= '	var_'+node.using+ ' = '+node.initial+';';
					}else{
						strCode+= '	var_'+node.using+ ' = var_'+node.initial+';';
					}
					strCode+= 'function loop'+node.id+'(){';
					strCode+= '	return next(function(){})'; // apenas para poder encadear
					if(node.nodes.length>0){
						strCode+= $scope.genNode(node.nodes, vars);
					}
					strCode+='	.next(function(){';
					if(node.stepType=="val"){
						strCode+='		var_'+node.using+'+= '+node.step+';';
					}else{
						strCode+='		var_'+node.using+'+= var_'+node.step+';';
					}
					
					if(node.limitType=="val"){
						strCode+='		if(var_'+node.using+'<'+node.limit+'){';
					}else{
						strCode+='		if(var_'+node.using+'<'+' var_'+node.limit+'){';
					}
					strCode+='			return loop'+node.id+'();';
					strCode+='		}'
					strCode+='	});';
					strCode+='}';
					if(node.limitType=="val"){
						strCode+='		if(var_'+node.using+'<'+node.limit+'){';
					}else{
						strCode+='		if(var_'+node.using+'<'+' var_'+node.limit+'){';
					}
					strCode+='return loop'+node.id+'();';
					strCode+='}';
					strCode+='})';
				}
			}
			if(node.type=="attr"){
				if(node.variable!=""){
					strCode+= '.next(function () {';
					strCode+="		var_"+node.variable+"=";
					strCode+="			("+$scope.genExp(node.exp, vars[node.variable].type)+")";
					strCode+="		;";
					strCode+= '})';
				}
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
				strCode+= '/* '+v.type+' */';
				if(v.type=="int"){
					strCode+= "		var_"+node.variable +" = parseInt(a);";	
				}else if(v.type=="float"){
					strCode+= "		var_"+node.variable +" = parseFloat(a); /* pq cai aqui */";
				}else if(v.type=="boolean"){
					// tratar boolean depois
					strCode+= "		var_"+node.variable +" = a;";
				}else if(v.type=="string"){
					// tratar boolean depois
					strCode+= "		var_"+node.variable +" = a;";
				}else{
					strCode+= "		var_"+node.variable +" = a; ";
				}
				
				strCode+= '})';
			}
		});
		return strCode;
	}
	$scope.genExp = function(exp, type){
		var strCode = "";
		
		angular.forEach(exp, function(ex, key){
			if(ex.t=="var"){
				strCode+=" var_"+ex.v+" ";
			}else if(ex.t=="val"){
				if(type=="string"){
					strCode+=" \" "+ex.v+"\" ";
				}else{
					strCode+=" "+ex.v+" ";
				}
			}else if(ex.t=="exp"){
				strCode+=" ( "+$scope.genExp(ex.exp, type)+" ) ";
			}
			if(key<exp.length-1){
				strCode+=ex.o;
			}
		});
		return strCode;
	}
	
	$scope.changeForType = function(node, v){
		node.forType +=v;
	}
	$scope.changeForValue = function(node){
		node.isValue = !node.isValue;
		if(!node.isValue){
			node.simpleVariable = "";
		}
		writer(node.isValue);
	}
	$scope.childrenVisible = function(node){
		node.isChildrenVisible = !node.isChildrenVisible;
	}

	$scope.add = function(parent, parentId, type, name) {
	    var newNode = {
	    					id: $scope.itemCount++,
		    				type: type,
		    				name: name,
		    				nodes: [],
		    				parent: parentId
		    			};

		// especifico de cada estrutura
		if(type=="if"){
			newNode.exp = [];
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
		}
		parent.push(newNode);
		$scope.mapping[newNode.id] = newNode;
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

