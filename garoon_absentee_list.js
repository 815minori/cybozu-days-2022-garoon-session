/* eslint-disable no-undef */
/**
 * Garoon JavaScript APIを使ったサンプルプログラム
 * 「garoon_absentee_list.js」ファイル
 * Copyright (c) 2022 Cybozu
 *
 * Licensed under the MIT License
 * https://opensource.org/licenses/mit-license.php
 */

(function($) {

    'use strict';


    // 表示する組織の組織IDの設定
    const ORGANIZATION_ID = 8;
    // 表に表示する予定メニューの種類
    const SCHEDULE_MENU = '休み';

    // eslint-disable-next-line no-undef
    const today = moment().format('YYYY-MM-DD');

    // 取得する予定データの条件を指定する
    const scheduleApiBody = {
        target: ORGANIZATION_ID,
        targetType: 'organization',
        rangeStart: today + 'T00:00:00+09:00',
        rangeEnd: today + 'T23:59:59+09:00'
    };

    /**
     * 予定を取得する関数
     * @returns {promise} garoon-rest-api
     */
    function getSchedules() {
        return garoon.api('/api/v1/schedule/events', 'GET', scheduleApiBody);
    }


    /**
     * 予定情報を加工する関数
     * @returns {list} itemLists
     */
    async function createScheduleList() {
        const response = await getSchedules();
        const scheduleEvents = response.data.events;
        let itemLists = [];

        for (let event of scheduleEvents) {
            if (event.eventMenu === SCHEDULE_MENU) {
                let scheduleItem = [];
                let attendUser = event.attendees.filter(attendee => attendee.type === 'USER');
                scheduleItem.push(attendUser[0].name);
                scheduleItem.push(event.subject);
                scheduleItem.push(event.notes);

                itemLists.push(scheduleItem);
            }
        }

        return itemLists;
    }

    /**
     * テーブルを描画する関数
     */
    function createTable(scheduleLists) {
        new gridjs.Grid({
            columns: ['名前', '件名', 'メモ'],
            data: scheduleLists,
            width: 'auto',
            search: {
                enable: true
            }
        }).render(document.getElementById('wrapper'));
    }

    $(document).ready(() => {
        createScheduleList().then((scheduleLists)=> {
            createTable(scheduleLists);
        }).catch((e) => {
            console.error(e);
        });
    });

})(jQuery.noConflict(true));