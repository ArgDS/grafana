define([
  'angular',
],
function (angular) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('SaveDashboardAsCtrl', function($scope, backendSrv, $location) {

    $scope.init = function() {
      $scope.clone.id = null;
      $scope.clone.editable = true;
      $scope.clone.title = $scope.clone.title + " Копия";

      // remove alerts
      $scope.clone.rows.forEach(function(row) {
        row.panels.forEach(function(panel) {
          delete panel.alert;
        });
      });

      // remove auto update
      delete $scope.clone.autoUpdate;
    };

    function saveDashboard(options) {
      return backendSrv.saveDashboard($scope.clone, options).then(function(result) {
        $scope.appEvent('alert-success', ['Панель сохранена', 'Сохранена как \"' + $scope.clone.title + '\"']);

        $location.url('/dashboard/db/' + result.slug);

        $scope.appEvent('dashboard-saved', $scope.clone);
        $scope.dismiss();
      });
    }

    $scope.keyDown = function (evt) {
      if (evt.keyCode === 13) {
        $scope.saveClone();
      }
    };

    $scope.saveClone = function() {
      saveDashboard({overwrite: false}).then(null, function(err) {
        if (err.data && err.data.status === "name-exists") {
          err.isHandled = true;

          $scope.appEvent('confirm-modal', {
            title: 'Конфликт',
            text: 'Панель с таким именем уже существует.',
            text2: 'Сохранить панель с этим именем?',
            yesText: "Сохранить и перезаписать",
            icon: "fa-warning",
            onConfirm: function() {
              saveDashboard({overwrite: true});
            }
          });
        }
      });
    };
  });

});
