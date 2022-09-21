/**
 * Garoon JavaScript APIを使ったサンプルプログラム
 * 「garoon_portal_overwork.js」ファイル
 * Copyright (c) 2022 Cybozu
 *
 * Licensed under the MIT License
 * https://opensource.org/licenses/mit-license.php
 */

(function($) {
    'use strict';

    // 取得するkintoneアプリのID
    const APP_ID = 13;
    let recordTotalCount;

    // kintone-rest-api-clientの呼び出し
    const client = new KintoneRestAPIClient();


    /**
     * kintoneのレコードを取得する関数
     * @returns {Object}
     */
    let getRecords = async function() {

        try {
            const response = await client.record.getRecords({
                app: APP_ID,
                fields: ['レコード番号', 'date', 'applicant', 'hours'],
                query: 'date = THIS_MONTH()',
                totalCount: 'true'
            });

            return response;

        } catch (error) {
            window.alert(error);
        }

    };

    /**
     * レコードの情報を表形式に変換する関数
     * @returns {List}
     */
    let createItemsList = async () => {
        let recordItems = await getRecords();
        let recordLists = recordItems.records;
        recordTotalCount = recordItems.totalCount;
        let tableLists = [];

        for (let record of recordLists) {
            let itemsList = [];
            itemsList.push(record.applicant.value[0].name);
            itemsList.push(record.date.value);
            itemsList.push(record.hours.value);
            tableLists.push(itemsList);
        }

        return tableLists;
    };

    /**
     * ポータル上に表を描画する関数
     * @param {List} table_items
     */
    let createTable = function(table_items) {

        let countId = document.getElementById('record-count');
        let numberField = document.createElement('p');
        let field = countId.appendChild(numberField);
        field.innerHTML = '今月の残業申請数「' + recordTotalCount + '」件';

        new gridjs.Grid({
            columns: ['申請者', '日付', '残業時間'],
            data: table_items,
            width: 'auto',
        }).render(document.getElementById('kintone-data'));
    };


    $(document).ready(()=> {
        createItemsList()
            .then(table_items => createTable(table_items))
            .catch(e => console.log(e));
    });

})(jQuery.noConflict(true));