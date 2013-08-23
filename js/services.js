var ivprogModule = angular.module('ivprogServices', ['ngResource']);

ivprogModule.factory('Exercicio', function($resource){
    return $resource('exercicios/:exercicioId.json', {}, {
    query: {method:'GET', params:{}, isArray:true }});
});

ivprogModule.factory('IvProgSource', function(){
    return {
          generate: function(o){
            var scriptStr = "";
            angular.forEach(o.functions, function(func, key){
              if(func.functionName=="main"){
                scriptStr+="var t = function(){";
                angular.forEach(func.vars, function(variable, keyv){
                  scriptStr+="var var_"+variable.id+" = "+variable.initialValue+";";
                });

                scriptStr+="function "+func.functionName+"(){"+
                    "alert(1);}"+
                "main();}; t();";
              }
              window.eval(scriptStr);
              console.log(scriptStr);
            });
          },
          genVars: function(){
            alert(112);
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