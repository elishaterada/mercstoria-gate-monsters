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

//  Sample Component
function SampleCtrl () {
  var ctrl = this

  ctrl.greeting = 'Hello World'
}

angular
  .module('app')
  .component('sample', {
    templateUrl: 'src/templates/sample.tpl.html',
    controller: SampleCtrl
  })
