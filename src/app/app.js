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

// Top level
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

// Main Component
function MainCtrl ($mdSidenav, $timeout) {
  var ctrl = this

  ctrl.toggleLeftNav = buildDelayedToggler('leftNav')

  /**
   * Supplies a function that will continue to operate until the
   * time is up.
   */
  function debounce (func, wait, context) {
    var timer

    return function debounced () {
      var context = this
      var args = Array.prototype.slice.call(arguments)
      $timeout.cancel(timer)
      timer = $timeout(function () {
        timer = undefined
        func.apply(context, args)
      }, wait || 10)
    }
  }

  /**
   * Build handler to open/close a SideNav; when animation finishes
   * report completion in console
   */
  function buildDelayedToggler (navID) {
    return debounce(function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav(navID)
        .toggle()
    }, 200)
  }
}

angular
  .module('app')
  .component('main', {
    templateUrl: 'src/templates/main.tpl.html',
    controller: MainCtrl
  })

//  Monsters Component
function MonstersCtrl ($http, $log, $mdDialog) {
  var ctrl = this

  ctrl.type = ''

  ctrl.monsters = {}

  // 5 Total Monsters
  ctrl.chosenMonsters = _.fill(Array(5), '')

  ctrl.generateMonsterList = function (ev) {
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
    .then(function (answer) {
    }, function () {
    })
  }

  ctrl.duplicateCheck = function (index) {
    // Find duplicate monster
    _.forEach(ctrl.chosenMonsters, function (value, key) {
      // Skip same index
      if (key !== index) {
        // Identify and remove duplicate monster from previous selection
        if (value && ctrl.chosenMonsters[index] && value.name === ctrl.chosenMonsters[index].name) {
          ctrl.chosenMonsters[key] = null
          return
        }
      }
    })
  }

  ctrl.changeType = function () {
    ctrl.chosenMonsters = _.fill(Array(5), '')
  }

  function getMonsters () {
    $http({
      method: 'GET',
      url: 'https://rawgit.com/elishaterada/mercstoria-db/master/data/monsters.json'
    }).then(function successCallback (response) {
      ctrl.monsters = response.data
    }, function errorCallback (response) {
      $log.debug(response)
    })
  }

  function init () {
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
function MonsterGeneratorCtrl ($scope, $window, $mdToast, $mdDialog, monsters) {
  // Instantiate ClipboardJS
  var clipboard = new $window.Clipboard('.clipboard')

  clipboard.on('success', function (e) {
    $mdToast.show(
      $mdToast.simple()
        .textContent('コピーが成功しました')
        .hideDelay(3000)
    )
  })

  clipboard.on('error', function (e) {
    $mdToast.show(
      $mdToast.simple()
      .textContent('コピーに失敗しました')
      .hideDelay(3000)
    )
  })

  $scope.options = {
    reach: false
  }

  $scope.close = function () {
    $mdDialog.cancel()
  }

  $scope.generateList = function () {
    $scope.monsters = ''

    _.forEach(monsters, function (value, key) {
      if (value) {
        $scope.monsters += value.name

        if ($scope.options.reach) {
          $scope.monsters += '(' + value.reach + ')'
        }
      } else {
        $scope.monsters += '不明'
      }

      // Add space after each except the last one
      if (key < 4) {
        $scope.monsters += ' '
      }
    })
  }

  function init () {
    $scope.generateList()
  }

  // Initialize
  init()
}
