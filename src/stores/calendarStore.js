//stores/calendarStore.js

import { defineStore } from 'pinia';
import dayjs from 'dayjs';

const INITIAL_EVENTS = [
  {
    id: 1,
    date: '2025-09-24',
    startDate: '2025-09-24',
    title: '第一次產檢（第8週）',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '例行檢查、問診、尿液檢查、首次超音波、流產徵兆與營養衛教'
  },
  {
    id: 2,
    date: '2025-10-22',
    startDate: '2025-10-22',
    title: '第二次產檢（第12週）',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '問診、全身檢查、抽血、梅毒檢驗、尿液檢查、德國麻疹抗體檢查'
  },
  {
    id: 3,
    date: '2025-11-19',
    startDate: '2025-11-19',
    title: '第三次產檢（第16週）',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '例行檢查、早產防治衛教'
  },
  {
    id: 4,
    date: '2025-12-17',
    startDate: '2025-12-17',
    title: '第四次產檢（第20週）',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '例行檢查、第二次超音波、早產防治衛教'
  },
  {
    id: 5,
    date: '2026-01-14',
    startDate: '2026-01-14',
    title: '第五次產檢（第24週）',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '例行檢查、血液常規、妊娠糖尿病篩檢、營養與早產徵兆衛教'
  },
  {
    id: 6,
    date: '2026-02-11',
    startDate: '2026-02-11',
    title: '第六次產檢（第28週）',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '例行檢查'
  },
  {
    id: 7,
    date: '2026-02-25',
    startDate: '2026-02-25',
    title: '第七次產檢（第30週）',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '例行檢查'
  },
  {
    id: 8,
    date: '2026-03-11',
    startDate: '2026-03-11',
    title: '第八次產檢（第32週）',
    type: 'checkup',
    startTime: '09:00',
    endTimeTime: '10:00',
    location: '台中榮總',
    description: '例行檢查、第三次超音波、VDRL檢驗、必要時做愛滋病毒檢查'
  },
  {
    id: 9,
    date: '2026-03-25',
    startDate: '2026-03-25',
    title: '第九次產檢（第34週）',
    type: 'checkup',
    startTime: '09:00',
    endTimeTime: '10:00',
    location: '台中榮總',
    description: '例行檢查'
  },
  {
    id: 10,
    date: '2026-04-08',
    startDate: '2026-04-08',
    title: '第十次產檢（第36週）',
    type: 'checkup',
    startTime: '09:00',
    endTimeTime: '10:00',
    location: '台中榮總',
    description: '例行檢查、乙型鏈球菌（GBS）篩檢'
  },
  {
    id: 11,
    date: '2026-04-15',
    startDate: '2026-04-15',
    title: '第十一週產檢（第37週）',
    type: 'checkup',
    startTime: '09:00',
    endTimeTime: '10:00',
    location: '台中榮總',
    description: '例行檢查'
  },
  {
    id: 12,
    date: '2026-04-22',
    startDate: '2026-04-22',
    title: '第十二次產檢（第38週）',
    type: 'checkup',
    startTime: '09:00',
    endTimeTime: '10:00',
    location: '台中榮總',
    description: '例行檢查'
  },
  {
    id: 13,
    date: '2026-04-29',
    startDate: '2026-04-29',
    title: '第十三次產檢（第39週）',
    type: 'checkup',
    startTime: '09:00',
    endTimeTime: '10:00',
    location: '台中榮總',
    description: '例行檢查'
  },
  {
    id: 14,
    date: '2026-05-05',
    startDate: '2026-05-05',
    title: '第十四次產檢（第40週）',
    type: 'checkup',
    startTime: '09:00',
    endTimeTime: '10:00',
    location: '台中榮總',
    description: '例行檢查，胎兒狀況確認，生產準備'
  },
  {
    id: 15,
    date: '2026-05-05',
    startDate: '2026-05-05',
    title: '預產期!!!',
    type: 'other',
    startTime: '00:00',
    endTimeTime: '24:00',
    location: '台中榮總',
    description: '準備跟寶寶見面啦!!!'
  }
];

const BASE_URL = import.meta.env.BASE_URL;
const INITIAL_DIARIES = [
  {
    id: 301,
    date: '2025-09-25',
    title: '第一次聽到心跳',
    content: '昨天做了第一次產檢，看到小小豆子在跳動，還聽到了心跳聲，瞬間覺得好神奇。',
    image: `${BASE_URL}images/Ultrasoundsmall.jpg`,
    createdAt: '2025-09-25T10:20:00Z',
    updatedAt: ''
  },
  {
    id: 302,
    date: '2025-10-03',
    title: '開始有點孕吐了',
    content: '最近早上起床都有點反胃，但喝溫水後好很多，希望之後能慢慢改善。',
    image: `${BASE_URL}images/hotwater.png`,
    createdAt: '2025-10-03T08:45:00Z',
    updatedAt: ''
  },
  {
    id: 303,
    date: '2025-10-20',
    title: '想吃清爽的東西',
    content: '今天突然超想吃涼麵和水果，可能是最近胃口變清淡了。',
    image: `${BASE_URL}images/noddle.png`,
    createdAt: '2025-10-20T14:20:00Z',
    updatedAt: ''
  },
  // {
  //   id: 304,
  //   date: '2025-10-22',
  //   title: '第二次產檢',
  //   content: '今天做了抽血和例行檢查，醫生說寶寶發育正常，聽到覺得安心多了。',
  //   image: `${BASE_URL}`,
  //   createdAt: '2025-10-22T13:00:00Z',
  //   updatedAt: '2025-10-22T13:08:00Z'
  // },
  {
    id: 305,
    date: '2025-11-05',
    title: '甜點時光',
    content: '今天做了黑糖紅豆湯，暖暖的甜味讓心情也變得溫柔。',
    image: `${BASE_URL}images/sweetsoup.jpg`,
    createdAt: '2025-11-05T09:30:00Z',
    updatedAt: ''
  },
  {
    id: 306,
    date: '2025-11-12',
    title: '午睡變得很重要',
    content: '最近一下班就覺得超累，每天都要小睡一下才有精神恢復。',
    image: `${BASE_URL}images/nap.png`,
    createdAt: '2025-11-12T16:10:00Z',
    updatedAt: ''
  },
  {
    id: 307,
    date: '2025-11-19',
    title: '第三次產檢，小寶貝平安',
    content: '今天是16週產檢，雖然肚子還不大，但超音波上寶寶動來動去，好可愛！',
    image: `${BASE_URL}images/Ultrasound16.jpg`,
    createdAt: '2025-11-19T11:20:00Z',
    updatedAt: '2025-11-19T12:20:00Z'
  },
  // {
  //   id: 308,
  //   date: '2025-12-01',
  //   title: '感受到第一次胎動？',
  //   content: '今天肚子裡突然有種小泡泡跳動的感覺，不知道是不是胎動，但心裡莫名期待。',
  //   image: `${BASE_URL}`,
  //   createdAt: '2025-12-01T20:00:00Z',
  //   updatedAt: ''
  // },
  {
    id: 309,
    date: '2025-12-17',
    title: '20週產檢大超音波',
    content: '今天做了第二次大超音波，寶寶手腳都很清楚，醫生說成長得剛剛好！',
    image: `${BASE_URL}images/Ultrasound.jpg`,
    createdAt: '2025-12-17T12:30:00Z',
    updatedAt: '2025-12-17T14:30:00Z'
  },
  {
    id: 310,
    date: '2025-12-28',
    title: '肚子明顯圓圓了',
    content: '最近穿衣服明顯能看出孕肚，開始覺得自己像個準媽媽了～',
    image: `${BASE_URL}images/pregnantbelly_big.png`,
    createdAt: '2025-12-28T10:00:00Z',
    updatedAt: ''
  }
];


const getNextEventId = (events) => {
    const maxId = events.reduce((max, event) => Math.max(max, event.id), 0);
    return maxId + 1;
};

export const useCalendarStore = defineStore('calendar', {
    // 1. STATE: 集中管理行程和日記
    state: () => ({
        events: INITIAL_EVENTS,
        diaries: INITIAL_DIARIES,
    }),

    // 2. GETTERS: 取得合併或計算後的資料
    getters: {
        // 取得所有行程和日記，用於日曆顯示
        allEvents: (state) => {
            const diaryEvents = state.diaries.map(diary => ({
                ...diary,
                type: 'diary',
                isDiary: true, // 增加一個標記以區分日記
            }));
            // 合併兩者，並確保 ID 不會衝突 (因為 diaries 和 events 的 ID 是分開計算的)
            return [...state.events, ...diaryEvents];
        },
        // 取得特定日期的所有事件（如果您在其他元件需要）
        getEventsByDate: (state) => (date) => {
            return state.allEvents.filter(event => event.date === date);
        }
    },

    // 3. ACTIONS: 所有修改 state 的方法
    actions: {
        // --- 行程 (Events) 相關 Actions ---

        // 新增行程 (對應 handleAddNewEvent)
        addEvent(newEvent) {
            // 在實際專案中，這裡通常會呼叫 API，成功後才加入 Store
            const newId = getNextEventId(this.events);
            this.events.push({ ...newEvent, id: newId });
        },

        // 更新行程 (對應 handleSaveEvent)
        updateEvent(updatedEvent) {
            const index = this.events.findIndex(e => e.id === updatedEvent.id);
            if (index !== -1) {
                this.events[index] = updatedEvent;
            }
        },

        // 刪除行程 (對應 handleDeleteEvent)
        deleteEvent(eventId) {
            this.events = this.events.filter(e => e.id !== eventId);
        },

        // --- 日記 (Diaries) 相關 Actions ---

        // 新增日記 (對應 saveDiary)
        addDiary(newDiary) {
            // newDiary 已經是您在 saveDiary 裡組裝好的物件
            this.diaries.push(newDiary);
        },

        // 更新日記 (對應 handleSaveDiary)
        updateDiary(updatedDiary) {
            const index = this.diaries.findIndex(d => d.id === updatedDiary.id);
            if (index !== -1) {
                // Pinia/Vue 會自動解包 ref，所以這裡直接賦值即可
                this.diaries[index] = updatedDiary;
            }
        },

        // 刪除日記 (對應 handleDeleteDiary)
        deleteDiary(diaryId) {
            this.diaries = this.diaries.filter(d => d.id !== diaryId);
        }
    }
});
