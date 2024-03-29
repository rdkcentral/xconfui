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
        .module('app.telemetrytwotestpage')
        .controller('TelemetryTwoTestPageController', controller);

    controller.$inject = ['$scope', '$controller', 'telemetryTwoTestPageService', 'alertsService', 'telemetryTwoProfileService', 'LOG_UPLOAD_FREE_ARG_AUTOCOMPLETE_VALUE', 'testPageUtils'];

    function controller($scope, $controller, telemetryTwoTestPageService, alertsService, telemetryTwoProfileService, LOG_UPLOAD_FREE_ARG_AUTOCOMPLETE_VALUE, testPageUtils) {
        var vm = this;
        angular.extend(vm, $controller('MainController', {
            $scope: $scope
        }));
        vm.matchedRules = null;
        vm.profiles = [];
        vm.parameters = [{key: '', value: ''}];
        vm.autoCompleteValues = LOG_UPLOAD_FREE_ARG_AUTOCOMPLETE_VALUE;
        vm.context = null;

        vm.matchRules = matchRules;

        init();

        function init() {
            telemetryTwoProfileService.getAll()
                .then(function(resp) {
                    vm.profiles = resp.data;
                }, function(error) {
                    alertsService.showError({title: 'Error', message: error.data.message});
                });
        }

        function matchRules() {
            if (testPageUtils.validateInput(vm.parameters)) {
                var objParams = testPageUtils.getParametersAsObject(vm.parameters);
                telemetryTwoTestPageService.getMatchedRules(objParams).then(function (resp) {
                    vm.matchedRules = resp.data.result;
                    vm.context = resp.data.context;
                }, function (error) {
                    alertsService.showError({title: 'Error', message: error.data.message});
                });
            }
        }
    }
})();