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
        .controller('FirmwareConfigViewController', controller);

    controller.$inject = ['$uibModalInstance', 'firmwareConfig', 'utilsService'];

    function controller($modalInstance, firmwareConfig, utilsService) {
        var vm = this;
        vm.firmwareConfig = firmwareConfig;

        vm.dismiss = dismiss;
        vm.propertiesAreNotEmpty = propertiesAreNotEmpty;

        function dismiss() {
            $modalInstance.dismiss();
        }

        function propertiesAreNotEmpty(parameters) {
            return !utilsService.isMapEmpty(parameters);
        }
    }
})();