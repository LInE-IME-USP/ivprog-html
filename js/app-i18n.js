icombApp.filter('i18n', ['$rootScope', function($rootScope) {
    return function (input) {
        var translations = {
            'pt' : {
                'Welcome' : 'Bem-vindo',
                'LoadExercise' : 'Carregar um exercício existente...',
                'ChooseOneOptionToContinue' : 'escolha uma opção a seguir para continuar:',
                'CreateNewExercise' : 'Criar um novo exercício...',
                'BackButton' : 'voltar',
                'ENGLISH' : 'English'
            },
            'en' : {
                'Welcome' : 'Welcome',
                'LoadExercise' : 'Load an exercise...',
                'ChooseOneOptionToContinue' : 'Choose one option to continue:',
                'CreateNewExercise' : 'Create a new exercise...',
                'BackButton' : 'back',
                'ENGLISH' : 'english'
            }
        },
        currentLanguage = $rootScope.currentLanguage || 'pt';
        return translations[currentLanguage][input];
    }
}]);