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
        .factory('uploadRepositoryService', service);

    service.$inject = ['utilsService', '$http', 'syncHttpService']

    function service(utilsService, $http, syncHttpService) {
        var urlMapping = 'dcm/uploadRepository/';

        return {
            getAll: getAll,
            getPage: getPage,
            getSizeOfUploadRepositories: getSizeOfUploadRepositories,
            getById: getById,
            create: create,
            update: update,
            deleteUploadRepository: deleteUploadRepository,
            updateSyncEntities: updateSyncEntities,
            createSyncEntities: createSyncEntities,
            exportOne: exportOne,
            exportAll: exportAll
        };

        function getAll() {
            return $http.get(urlMapping);
        }

        function getPage(pageSize, pageNumber, searchParam) {
            return $http.post(urlMapping + 'filtered?pageSize=' + pageSize + '&pageNumber=' + pageNumber, searchParam);
        }

        function getSizeOfUploadRepositories() {
            return $http.get(urlMapping + 'size');
        }

        function getById(id) {
            return $http.get(urlMapping + id);
        }

        function create(formula) {
            return $http.post(urlMapping, formula);
        }

        function update(formula) {
            return $http.put(urlMapping, formula);
        }

        function deleteUploadRepository(id) {
            return $http.delete(urlMapping + id);
        }

        function updateSyncEntities(formulas) {
            var requests = utilsService.generateRequestList(formulas, {url: urlMapping + 'entities', method: 'PUT'});
            return requests && requests.length ? syncHttpService.http(requests) : null;
        }

        function createSyncEntities(formulas) {
            var requests = utilsService.generateRequestList(formulas, {url: urlMapping + 'entities', method: 'POST'});
            return requests && requests.length ? syncHttpService.http(requests) : null;
        }

        function exportOne(id) {
            window.open(urlMapping + id + '/?export');
        }

        function exportAll() {
            window.open(urlMapping + '?export');
        }
    }
})();