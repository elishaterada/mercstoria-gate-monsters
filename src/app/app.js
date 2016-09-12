function config (
  $mdThemingProvider
) {
  // Angular Material Setup
  $mdThemingProvider.theme('custom')
    .primaryPalette('deep-purple')
    .accentPalette('blue')

  $mdThemingProvider.setDefaultTheme('custom')
}

function run ($rootScope, $window) {
  $rootScope._ = $window._
}

function AppCtrl () {
}

angular
  .module('app', [
    'ngAnimate',
    'ngMaterial',
    'ngAria'
  ])
  .controller('AppCtrl', AppCtrl)
  .config(config)
  .run(run)

//  Monsters Component
function MonstersCtrl ($mdDialog) {
  var ctrl = this

  ctrl.type = ''

  ctrl.monsters = {
    fire: [

    ],
    water: [
      {
        name: 'メリギール',
        reach: 90,
        range: 140,
        combo: 3,
        chosen: false
      },
      {
        name: 'ヴィンデール',
        reach: 115,
        range: 150,
        combo: 0,
        chosen: false
      },
      {
        name: 'セネガルガ',
        reach: 70,
        range: 140,
        combo: 4,
        chosen: false
      },
      {
        name: 'アンキロクロス',
        reach: 40,
        range: 80,
        combo: 0,
        chosen: false
      }

    ],
    wind: [

    ],
    light: [

    ],
    dark: [

    ]
  }

  ctrl.chosenMonsters = []

  ctrl.generateMonsterList = function(ev) {
    $mdDialog.show({
      controller: MonsterGeneratorCtrl,
      templateUrl: 'src/templates/monster-list-generator-dialog.tpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      locals: {
        monsters: ctrl.monsters[ctrl.type]
      }
    })
    .then(function(answer) {
    }, function() {
    })
  }
}

angular
  .module('app')
  .component('monsters', {
    templateUrl: 'src/templates/monsters.tpl.html',
    controller: MonstersCtrl
  })

// Monster Generator Dialog Controller
function MonsterGeneratorCtrl ($scope, $mdDialog, monsters) {

  $scope.monsters = monsters

  $scope.close = function() {
    $mdDialog.cancel()
  }
}
