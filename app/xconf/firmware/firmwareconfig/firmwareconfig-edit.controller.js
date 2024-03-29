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
(function() {
    'use strict';

    angular
        .module('app.firmwareconfig')
        .controller('FirmwareConfigEditController', controller);

    controller.$inject = ['$rootScope', '$scope', '$controller', 'firmwareConfigService', 'modelService', '$stateParams', 'alertsService', '$state', 'authUtilsService', 'PERMISSION', 'utilsService'];

    function controller($rootScope, $scope, $controller, firmwareConfigService, modelService, $stateParams, alertsService, $state, authUtils, PERMISSION, utilsService) {
        var vm = this;

        angular.extend(vm, $controller('EditController', {
            $scope: $scope,
            mainPage: 'firmwareconfigs',
            stateParameters: null
        }));

        vm.models = [];
        vm.firmwareConfig = {
            id: '',
            description: '',
            firmwareFilename: '',
            firmwareVersion: '',
            supportedModelIds: [],
            applicationType: $rootScope.applicationType
        };
        vm.properties = [{key: '', value: ''}];
        vm.PERMISSION = PERMISSION;

        vm.save = save;
        vm.selectModel = selectModel;
        vm.authUtils = authUtils;
        init();

        function init() {
            modelService.getAll().then(function(resp) {
                if (resp.data && resp.data.length > 0) {
                    angular.forEach(resp.data, function(val, key) {
                        var modelCheckObject = {
                            modelId: val.id,
                            selected: false
                        };
                        vm.models.push(modelCheckObject);
                    });
                }
            });

            if ($stateParams.firmwareConfigId) {
                firmwareConfigService.getById($stateParams.firmwareConfigId).then(function(resp) {
                    vm.firmwareConfig.id = resp.data.id;
                    vm.firmwareConfig.description = resp.data.description;
                    vm.firmwareConfig.firmwareFilename = resp.data.firmwareFilename;
                    vm.firmwareConfig.firmwareVersion = resp.data.firmwareVersion;
                    vm.firmwareConfig.supportedModelIds = resp.data.supportedModelIds;
                    vm.firmwareConfig.applicationType = $rootScope.applicationType ? $rootScope.applicationType : resp.data.applicationType;
                    angular.forEach(resp.data.supportedModelIds, function(val, key) {
                        var modelCheckObject = {
                            modelId: val,
                            selected: false
                        };
                        for (var i = 0; i < vm.models.length; i++) {
                            if (modelCheckObject.modelId === vm.models[i].modelId) {
                                vm.models[i].selected = true;
                            }
                        }
                    });
                    vm.properties = [];
                    vm.firmwareConfig.properties = resp.data.properties;
                    for (var key in vm.firmwareConfig.properties) {
                        vm.properties.push({key: key, value: vm.firmwareConfig.properties[key]});
                    }
                }, function(error) {
                    alertsService.showError({title: 'Error', message: 'Error by loading FirmwareConfig'});
                });
            }
        }

        function selectModel(selectModelObject) {
            var index = vm.firmwareConfig.supportedModelIds.indexOf(selectModelObject.modelId);
            if (index >= 0) {
                vm.firmwareConfig.supportedModelIds.splice(index, 1);
                selectModelObject.selected = false;
            } else {
                vm.firmwareConfig.supportedModelIds.push(selectModelObject.modelId);
                selectModelObject.selected = true;
            }
        }
        vm.isSaving = false; 
        function save() {
            if (validateFirmwareConfig(vm.firmwareConfig) && validateProperties(vm.properties)) {
                vm.isSaving = true; // set isSaving to true
                vm.firmwareConfig.properties = keyValueObjectToMap(vm.properties);

                if (vm.firmwareConfig.id) {
                    firmwareConfigService.update(vm.firmwareConfig).then(function (resp) {
                        alertsService.successfullySaved(resp.data.description);
                        $state.go('firmwareconfigs');
                    }, function (error) {
                        alertsService.showError({title: 'Error', message: error.data.message});
                    }).finally(function () {
                        vm.isSaving = false; // set isSaving to false
                    });
                } else {
                    firmwareConfigService.create(vm.firmwareConfig).then(function (resp) {
                        alertsService.successfullySaved(resp.data.description);
                        $state.go('firmwareconfigs');
                    }, function (error) {
                        alertsService.showError({title: 'Error', message: error.data.message});
                    }).finally(function () {
                        vm.isSaving = false; // set isSaving to false
                    });
                }
            }
        }


        function keyValueObjectToMap(properties) {
            let mapObject = {};
            properties.forEach(function (item) {
                if (item.key) {
                    mapObject[item.key] = item.value;
                }
            });
            return mapObject;
        }

        function validateFirmwareConfig(firmwareConfig) {
            var missingFields = [];
            if (!firmwareConfig.description) {
                missingFields.push('description');
            }
            if (!firmwareConfig.firmwareVersion) {
                missingFields.push('version');
            }
            if (!firmwareConfig.firmwareFilename) {
                missingFields.push('firmware file name')
            }
            if (!firmwareConfig.supportedModelIds || firmwareConfig.supportedModelIds.length === 0) {
                missingFields.push('supported models');
            }

            if (missingFields.length > 0) {
                alertsService.showError({title: 'Error', message: 'Next fields are missing: ' + missingFields.join(', ')});
                return false;
            }
            return true;
        }

        function validateProperties(properties) {
            if (!validatePropertyKeyUniqueness(properties)) {
                alertsService.showError({title: 'Error', message: 'Keys are not unique'});
                return false;
            }

            return true;
        }

        function validatePropertyKeyUniqueness(properties) {
            let keys = _.map(properties, function(entry) {return entry.key});
            let uniqKeys = _.uniq(keys);
            return keys.length === uniqKeys.length;
        }
    }

})();