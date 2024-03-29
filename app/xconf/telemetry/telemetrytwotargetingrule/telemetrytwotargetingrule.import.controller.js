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
        .module('app.telemetrytwotargetingrule')
        .controller('TelemetryTwoTargetingRuleImportController', controller);

    controller.$inject = ['$scope', '$log', '$uibModal', 'alertsService', 'utilsService', 'importService', 'telemetryTwoTargetingRuleService', 'telemetryTwoProfileService', 'paginationService'];

    function controller($scope, $log, $modal, alertsService, utilsService, importService, telemetryTwoRuleService, telemetryTwoProfileService, paginationService) {
        var vm = this;

        vm.retrieveFile = retrieveFile;
        vm.importTelemetryTwoRule = importTelemetryTwoRule;
        vm.importAllTelemetryTwoRules = importAllTelemetryTwoRules;
        vm.telemetryTwoRules = null;
        vm.wrappedTelemetryTwoRules = null;
        vm.overwriteAll = overwriteAll;
        vm.isOverwritten = false;
        vm.paginationStorageKey = 'telemetryTwoRulePageSize';
        vm.pageSize = paginationService.getPageSize(vm.paginationStorageKey);
        vm.pageNumber = paginationService.getPageNumber();
        vm.selectPage = selectPage;
        vm.getGeneralItemsNumber = getGeneralItemsNumber;
        vm.progressBarControl = importService.progressBarControl;
        vm.viewTelemetryTwoRule = viewTelemetryTwoRule;

        $scope.$on('$locationChangeSuccess', function () {
            if (paginationService.paginationSettingsInLocationHaveChanged(vm.pageNumber, vm.pageSize)) {
                vm.pageSize = paginationService.getPageSize(vm.paginationStorageKey);
                vm.pageNumber = paginationService.getPageNumber();
                selectPage();
            }
        });

        async function retrieveFile(fileName) {
            vm.telemetryTwoRules = null;
            try {
                let file = await importService.openFile(fileName, null, this);
                vm.isOverwritten = false;
                vm.wrappedTelemetryTwoRules = importService.prepareEntitiesFromFile(file);
                selectPage();
            } catch (e) {
                alertsService.showError({message: e});
            }
        }

        function importTelemetryTwoRule(wrappedTelemetryTwoRule) {
            if (wrappedTelemetryTwoRule.overwrite) {
                telemetryTwoRuleService.update(wrappedTelemetryTwoRule.entity).then(function () {
                    alertsService.successfullySaved(wrappedTelemetryTwoRule.entity.name);
                    utilsService.removeSelectedItemFromListById(vm.wrappedTelemetryTwoRules, wrappedTelemetryTwoRule.entity.id);
                }, alertsService.errorHandler);
            } else {
                telemetryTwoRuleService.create(wrappedTelemetryTwoRule.entity).then(function () {
                    alertsService.successfullySaved(wrappedTelemetryTwoRule.entity.name);
                    utilsService.removeSelectedItemFromListById(vm.wrappedTelemetryTwoRules, wrappedTelemetryTwoRule.entity.id);
                }, alertsService.errorHandler);
            }
        }

        function importAllTelemetryTwoRules() {
            importService.importAllEntities(telemetryTwoRuleService, vm.wrappedTelemetryTwoRules);
        }


        function overwriteAll() {
            angular.forEach(vm.wrappedTelemetryTwoRules, function (val) {
                val.overwrite = vm.isOverwritten;
            });
        }

        function selectPage() {
            paginationService.savePaginationSettingsInLocation(vm.pageNumber, vm.pageSize);
            computeStartAndEndIndex();
        }

        function viewTelemetryTwoRule(telemetryRule) {
            $modal.open({
                templateUrl: 'app/xconf/telemetry/telemetrytwotargetingrule/telemetrytwotargetingrule.view.html',
                controller: 'TelemetryTwoTargetingRuleViewController as vm',
                size: 'lg',
                resolve : {
                    telemetryRule: function() {
                        return telemetryRule;
                    }
                }
            });
        }

        function computeStartAndEndIndex() {
            vm.startIndex = (vm.pageNumber - 1) * vm.pageSize;
            vm.endIndex = vm.pageNumber * vm.pageSize;
        }

        function getGeneralItemsNumber() {
            return vm.wrappedTelemetryTwoRules ? vm.wrappedTelemetryTwoRules.length : 0;
        }
    }
})();
