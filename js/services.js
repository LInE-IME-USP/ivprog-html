var ivprogModule = angular.module('ivprogServices', ['ngResource']);

ivprogModule.factory('Exercicio', function($resource){
    return $resource('exercicios/:exercicioId.json', {}, {
    query: {method:'GET', params:{}, isArray:true }});
});

ivprogModule.factory('IvProgSourceParts', function(){
  return {
    genVars: function(){
      alert(1212);
    }
  };
});
var writer = function(t){
    $('.output').append(t+'<br>');
}
var processNodes = function(nodes){
  var scriptStr = "";
  angular.forEach(nodes, function(node, key){
    scriptStr+= "";
  });
  return "var nodes;";
}
ivprogModule.factory('IvProgSource', function(IvProgSourceParts,$filter){
    return {
          generate: function(o){
            var scriptStr = "";
            angular.forEach(o.functions, function(func, key){
              if(func.functionName=="main"){
                scriptStr+="var t = function(){";
                scriptStr+=" ";
                // processing variables
                angular.forEach(func.vars, function(variable, keyv){
                  scriptStr+="var var_"+variable.id+" = "+variable.initialValue+";";
                });
                // processing other stuff
                scriptStr+="function "+func.functionName+"(){";
                scriptStr+= processNodes(func.nodes);
                scriptStr+= "}";
                scriptStr += "main();}; t();";
              }
              window.eval(scriptStr);
              console.log(scriptStr);
            });
          }
        }
});

ivprogModule.factory('ExercicioProcessa', function($resource){
    return {
        processa: function(d){
          var atributos = [];
          var atributosValores = [];

          // descobrindo os atributos
          angular.forEach(d.universo.elemento[0].atributo, function(value, key){
             atributos.push(value.nome);
             atributosValores[value.nome] = [];
          });

          // descobrindo os valores
          angular.forEach(d.universo.elemento, function(elValue, elKey){
            angular.forEach(elValue.atributo, function(atValue, atKey){
             if(atributosValores[atValue.nome].indexOf(atValue.valor)==-1){
                atributosValores[atValue.nome].push(atValue.valor);
             }
             if(atValue.predicado && (atributosValores[atValue.nome].indexOf(atValue.predicado)==-1)){
                atributosValores[atValue.nome].push(atValue.predicado);
             }
            });
          });

          return { atributos: atributos, valores: atributosValores };
        }
    };
});

ivprogModule.factory('Universo', function($resource){
    universo = $resource('universos/:universoTipo/:universoSubTipo.json', {}, {
    query: {method:'GET', params:{}, isArray:false }});
    return universo;
});