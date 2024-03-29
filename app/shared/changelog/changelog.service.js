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
        .module('app.changeLog')
        .factory('changeLogService', service);

    service.$inject=['$http'];

    function service($http) {
        var API_URL = 'changelog';

        return {
            getChangeLog : getChangeLog,
            countAndSaveOperationsNumber: countAndSaveOperationsNumber
        };

        function getChangeLog() {
            return $http.get(API_URL);
        }

        function countAndSaveOperationsNumber(dataObj, storeObj) {
            storeObj.creations = 0;
            storeObj.deletions = 0;
            angular.forEach(dataObj, function(operation) {
                if(operation.operationType === 'CREATE') {
                    storeObj.creations++;
                }
                if(operation.operationType === 'DELETE') {
                    storeObj.deletions++;
                }
            });
        }
    }
})();