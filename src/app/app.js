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

  // 5 Total Monsters
  ctrl.chosenMonsters = _.fill(Array(5), null)

  ctrl.generateMonsterList = function(ev) {
    $mdDialog.show({
      controller: MonsterGeneratorCtrl,
      templateUrl: 'src/templates/monster-list-generator-dialog.tpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      locals: {
        monsters: ctrl.chosenMonsters
      }
    })
    .then(function(answer) {
    }, function() {
    })

  }

  ctrl.duplicateCheck = function(index) {
    // Find duplicate monster
    _.forEach(ctrl.chosenMonsters, function(value, key){

      // Skip same index
      if( key !== index ) {

        // Identify and remove duplicate monster from previous selection
        if ( value && ctrl.chosenMonsters[index] && value.name === ctrl.chosenMonsters[index].name ) {
          ctrl.chosenMonsters[key] = null
          return
        }
      }

    })

  }

  function getMonsters () {
    $http({
      method: 'GET',
      url: 'https://rawgit.com/elishaterada/mercstoria-db/master/data/monsters.json'
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

  $scope.options = {
    reach: false
  }

  $scope.close = function() {
    $mdDialog.cancel()
  }
}
