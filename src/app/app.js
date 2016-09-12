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
function MonstersCtrl ($http, $log, $mdDialog) {
  var ctrl = this

  ctrl.type = ''

  ctrl.monsters = {}

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

  function getMonsters () {
    $http({
      method: 'GET',
      url: 'src/data/monsters.json'
    }).then(function successCallback(response) {
      ctrl.monsters = response.data
    }, function errorCallback(response) {
      $log.debug(response)
    })
  }

  function init() {
    getMonsters()
  }

  init()
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
