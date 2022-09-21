/**
 * Garoon JavaScript APIを使ったサンプルプログラム
 * 「workflow_grkin.js」ファイル
 * Copyright (c) 2022 Cybozu
 *
 * Licensed under the MIT License
 * https://opensource.org/licenses/mit-license.php
 */

(function() {
    'use strict';

    // kintoneのアプリID
    const APP_ID = 13;

    /**
     * kintoneアプリに承認されたワークフローの情報を登録する
     * @param {*} token CSFRトークン
     * @param {*} request 承認されたワークフローのデータ
     */
    function addKintoneRecord(token, request) {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', '/k/v1/record.json?__REQUEST_TOKEN__=' + token);
        xmlhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xmlhttp.setRequestHeader('Content-Type', 'application/json');

        let body = {};
        body.app = APP_ID;
        body.record = {};
        body.record.title = {};
        body.record.title.value = request.items.title.value;
        body.record.detail = {};
        body.record.detail.value = request.items.detail.value;
        body.record.applicant = {};
        body.record.applicant.value = [{'code': request.applicant.code }];
        body.record.date = {};
        body.record.date.value = request.items.date.value;
        body.record.hours = {};
        body.record.hours.value = request.items.hours.value;
        xmlhttp.send(JSON.stringify(body));
        xmlhttp.onload = function() {
            return xmlhttp.responseText;
        };
    }

    /**
     * ワークフローが承認された際に実施する
     * 最終承認の際に、CSRFトークンを取得し、addKintoneRecordを呼ぶ
     */
    garoon.events.on('workflow.request.approve.submit.success', (event) => {
        const request = event.request;
        const status = request.status.type;

        if (status === 'APPROVED' || status === 'COMPLETED') {
            return garoon.connect.kintone.getRequestToken().then((token) => {
                try {
                    addKintoneRecord(token, request);
                } catch (e) {
                    console.log(e);
                }
            });
        }
    });
})();