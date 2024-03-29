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
    "use strict";

    angular.module('app.directives').directive('editableMap', ['utilsService',
        function(utilsService) {
            return {
                restrict: 'E',
                scope: {
                    parameters: '=',
                    autoCompleteValues: '=',
                    quickAdd: '=',
                    maxNumberOfItems: '=',
                    stopAdd: '='
                },
                templateUrl: 'app/shared/directives/editable-map/editable-map.directive.html',
                link: function(scope) {
                    scope.addParameterEntry = function addParameterEntry() {
                        scope.parameters.push({key: '', value: ''});
                    };

                    scope.removeParameterEntry = function removeParameterEntry(entry) {
                        utilsService.removeItemFromArray(scope.parameters, entry);
                    };

                    scope.addKeyValue = function addKeyValue(entry) {
                        scope.parameters.push({key: entry.key, value: entry.value});
                    };
                }
            }
    }]);

})();