/*******************************************************************************
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
 *******************************************************************************/
(function() {
    'use strict';

    angular
        .module('app.uploadRepository')
        .controller('UploadRepositoryEditController', controller);

    controller.$inject = ['$rootScope', '$scope', '$controller', 'uploadRepositoryService', '$stateParams', 'alertsService', '$state', 'PROTOCOL', 'EDIT_MODE'];

    function controller($rootScope, $scope, $controller, uploadRepositoryService, $stateParams, alertsService, $state, PROTOCOL, EDIT_MODE) {
        var vm = this;

        angular.extend(vm, $controller('EditController', {
            $scope: $scope,
            mainPage: 'uploadrepositories',
            stateParameters: null
        }));

        vm.uploadRepository = {
            applicationType: $rootScope.applicationType
        };
        vm.save = save;
        vm.protocols = PROTOCOL;
        vm.EDIT_MODE = EDIT_MODE;
        vm.currentEditMode = $stateParams.editMode || EDIT_MODE.CREATE;
        vm.isSaving = false;

        init();


        function init() {
            if($stateParams.uploadRepositoryId) {
                uploadRepositoryService.getById($stateParams.uploadRepositoryId).then(function(resp) {
                    if (resp) {
                        vm.uploadRepository = resp.data;
                    }
                }, alertsService.errorHandler);
            }
        }

        function save() {
            if (isValidUploadRepository(vm.uploadRepository)) {
                if (vm.currentEditMode === EDIT_MODE.UPDATE) {
                    vm.isSaving = true;
                    uploadRepositoryService.update(vm.uploadRepository).then(function(resp) {
                        alertsService.successfullySaved(vm.uploadRepository.name);
                        $state.go('uploadrepositories');
                    }).catch(function(reason) {
                        alertsService.errorHandler(reason);
                    }).finally(function() {
                        vm.isSaving = false;
                    });
                }
        
                if (vm.currentEditMode === EDIT_MODE.CREATE) {
                    vm.isSaving = true;
                    uploadRepositoryService.create(vm.uploadRepository).then(function(resp) {
                        alertsService.successfullySaved(vm.uploadRepository.name);
                        $state.go('uploadrepositories');
                    }).catch(function(reason) {
                        alertsService.errorHandler(reason);
                    }).finally(function() {
                        vm.isSaving = false;
                    });
                }
            }
        }

        function isValidUploadRepository(uploadRespository) {
            var missingFields = [];
            if (!uploadRespository.name) {
                missingFields.push('name');
            }
            if (!uploadRespository.description) {
                missingFields.push('description');
            }
            if (!uploadRespository.protocol) {
                missingFields.push('protocol');
            }
            if (!uploadRespository.url) {
                missingFields.push('url');
            }

            if (missingFields.length > 0) {
                alertsService.showError({title: 'Error', message: 'Next fields are empty: ' + missingFields.join(', ')});
                return false;
            }
            return true;
        }
    }
})();