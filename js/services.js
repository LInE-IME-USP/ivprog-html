var ivprogModule = angular.module('ivprogServices', ['ngResource']);

ivprogModule.factory('Exercicio', function($resource){
    return $resource(':exercicioURL', {}, {
    query: {method:'GET', params:{}, isArray:true }});
});

ivprogModule.factory('IvProgSourceParts', function(){
  return {
    genVars: function(){
      alert(1212);
    }
  };
});

var outputTXT = "";
var writer = function(t, testCase){
    if(!testCase){
      $('.output').append(t+'<br>');
    }
    if(outputTXT==""){
      outputTXT = t;
    }else{
      outputTXT+=" "+t;
    }
}

var isPutDecimalNeeded = function(startVal){
  return startVal == Math.floor(startVal);
}

var getOutput = function(){
  return outputTXT;
}
var cleanOutput = function(){
  outputTXT = "";
  currentInput = 0;
}

var totalTestCases = 0;
var testCases = [];
var totalCasesEvaluated = 0;
var totalCasesPassed = 0;

var resetTestCase = function(index){
  if(testCases.length>index){
    testCases[index].currentIndex = 0;
  }
}

var readerInput = function(index){
  
  if(testCases.length>index){
    var inputTXT = testCases[index].input;
    var ii = inputTXT.split("\n").join(" ").split("  ").join(" ");
    var ii2 = ii.split(" ");
    if(testCases[index].currentIndex<ii2.length){
      //console.log(index+" - "+ii2[testCases[index].currentIndex]);
      return ii2[testCases[index].currentIndex++];
    }
  }
  //console.log(index+" - "+0);
  return "0";
}

var endTest = function(index){
  totalCasesEvaluated++;
  
  //alert(index+")"+outputTXT+"||"+testCases[index].output);

  if(outputTXT==testCases[index].output){
    totalCasesPassed++;
  }
  if(totalCasesEvaluated==totalTestCases){
    // terminou a execucao de tds
    var apro = parseInt((totalCasesPassed/totalTestCases)*100);
    writer("------<br>Total de casos de testes: "+totalTestCases+"<br>Testes corretos: "+totalCasesPassed+"<br>Aproveitamento: "+apro+"%", false);
    // TODO: verificar se precisa retornar ou não
    // retornando ao iassign
    getEvaluationCallback(apro/100);
  }
  //console.log(testCases[index]);
  outputTXT = "";
}

var writerError = function(id, message){
    $('.output').append("<a class='error' href='javascript:;' onclick='highlightError(\""+id+"\")'>"+message+"</a><br>");
}
var highlightError = function(id){
    $(".node-with-error").removeClass("node-with-error");
    $(id).addClass("node-with-error");
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
              //console.log(scriptStr);
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