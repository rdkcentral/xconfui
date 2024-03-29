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
(function () {
    'use strict';
    angular
        .module('app.vodsettings')
        .factory('vodSettingsService', service);
    service.$inject = ['$http'];
    function service($http) {
        var API_URL = 'dcm/vodsettings/';

        return {
            getAll: getAll,
            getPage: getPage,
            getSizeOfVodSettings: getSizeOfVodSettings,
            getById: getById,
            create: create,
            update: update,
            deleteById: deleteById,
            exportAllSettings : exportAllSettings
        };

        function getAll() {
            return $http.get(API_URL);
        }

        function getPage(pageSize, pageNumber, searchContext) {
            return $http.post(API_URL + 'filtered?pageSize=' + pageSize + '&pageNumber=' + pageNumber, searchContext);
        }

        function getSizeOfVodSettings() {
            return $http.get(API_URL + 'size');
        }

        function getById(id) {
            return $http.get(API_URL + id);
        }

        function create(vodSettings) {
            return $http.post(API_URL, vodSettings);
        }

        function update(vodSettings) {
            return $http.put(API_URL, vodSettings);
        }

        function deleteById(id) {
            return $http.delete(API_URL + id)
        }

        function exportAllSettings() {
            window.open(API_URL + 'export');
        }
    }
})();