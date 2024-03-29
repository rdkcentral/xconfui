/**
 * Copyright 2023 Comcast Cable Communications Management, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
angular.module('app.directives').directive('environmentModelEditDirective',
    ['modelService', 'environmentService', 'alertsService', 'ENTITY_TYPE', '$state', '$stateParams', '$controller',
        function (modelService, environmentService, alertsService, ENTITY_TYPE, $state, $stateParams, $controller) {
    return {
        link: function (scope, element, attrs) {

            var entityService = null;
            var homePage = null;
            scope.isNewEntity = false;
            init();

            angular.extend(scope, $controller('EditController', {
                $scope: scope,
                mainPage: homePage,
                stateParameters: null
            }));

            scope.cancel = function() {
                $state.go(homePage);
            };

            scope.isSaving = false;

            scope.save = function() {
              if (validateEntity(scope.entity)) {
                scope.isSaving = true; // set isSaving to true to disable the button
            
                if (scope.isNewEntity) {
                  entityService.create(scope.entity).then(function(resp) {
                    alertsService.successfullySaved(resp.data.id);
                    $state.go(homePage);
                  }, function(error) {
                    alertsService.showError({title: 'Error', message: error.data.message});
                  }).finally(function() {
                    scope.isSaving = false; // set isSaving to false to enable the button
                  });
                } else {
                  entityService.update(scope.entity).then(function(resp) {
                    alertsService.successfullySaved(resp.data.id);
                    $state.go(homePage);
                  }, function(error) {
                    alertsService.showError({title: 'Error', message: error.data.message});
                  }).finally(function() {
                    scope.isSaving = false; // set isSaving to false to enable the button
                  });
                }
              }
            };
            

            function init() {
                if (scope.entityType == ENTITY_TYPE.MODEL) {
                    entityService  = modelService;
                    homePage = 'models';
                } else if(scope.entityType == ENTITY_TYPE.ENVIRONMENT) {
                    entityService = environmentService;
                    homePage = 'environments'
                }

                if (!$stateParams.entityId) {
                    scope.isNewEntity = true;
                } else {
                    scope.isNewEntity = false;
                    entityService.getById($stateParams.entityId).then(function(resp) {
                        scope.entity = resp.data;
                    }, function(error) {
                        alertsService.showError({title: 'Error', message: error.data.message});
                    });
                }
            }

            function validateEntity(entity) {
                if (!entity.id || entity.id === '') {
                    alertsService.showError({title: 'Error', message: 'Id field is empty!'});
                    return false;
                }
                return true;
            }
        },
        restrict: 'E',
        scope: {
            entityType: '='
        },
        templateUrl: 'app/shared/directives/environment-model/environment-model.edit.directive.html',

    };
}]);
