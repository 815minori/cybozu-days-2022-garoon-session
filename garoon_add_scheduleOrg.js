/**
 * Garoon JavaScript APIを使ったサンプルプログラム
 * 「garoon_add_scheduleOrg.js」ファイル
 * Copyright (c) 2022 Cybozu
 *
 * Licensed under the MIT License
 * https://opensource.org/licenses/mit-license.php
 */

(function() {
    'use strict';

    // 表示する組織の組織IDの設定
    const ORGANIZATION_ID = 8;

    const GAROON_ATTENDEE_ORGANIZATION = {
        id: ORGANIZATION_ID,
        type: 'ORGANIZATION'
    };

    const ADD_MENU = '休み';

    garoon.events.on(['schedule.event.create.submit', 'schedule.event.edit.submit'], (events) => {
        const event = events.event;

        if (event.eventMenu === ADD_MENU) {
            event.attendees.push(GAROON_ATTENDEE_ORGANIZATION);
        }

        return events;
    });

})();