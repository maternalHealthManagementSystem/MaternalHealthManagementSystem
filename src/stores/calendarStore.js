// src/stores/calendarStore.js

import { defineStore } from 'pinia';
import dayjs from 'dayjs';

const INITIAL_EVENTS = [
    {
    id: 1,
    date: '2025-11-30',
    startDate: '2025-11-30',
    title: '第一次產檢',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '確認懷孕週數、抽血檢驗、超音波檢查'
  },
  {
    id: 2,
    date: '2025-12-07',
    startDate: '2025-12-07',
    title: '第二次產檢',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '例行產檢、胎心音監測'
  },
  {
    id: 3,
    date: '2025-12-21',
    startDate: '2025-12-21',
    title: '第三次產檢',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '唐氏症篩檢、超音波檢查'
  },
  {
    id: 4,
    date: '2026-01-04',
    startDate: '2026-01-04',
    title: '第四次產檢',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '例行產檢、胎兒發育監測'
  },
  {
    id: 5,
    date: '2026-01-18',
    startDate: '2026-01-18',
    title: '第五次產檢',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '妊娠糖尿病篩檢、血壓監測'
  },
  {
    id: 6,
    date: '2026-02-01',
    startDate: '2026-02-01',
    title: '第六次產檢',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '例行產檢、胎動與羊水量檢查'
  },
  {
    id: 7,
    date: '2026-02-15',
    startDate: '2026-02-15',
    title: '第七次產檢',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '超音波檢查、胎兒位置確認'
  },
  {
    id: 8,
    date: '2026-03-01',
    startDate: '2026-03-01',
    title: '第八次產檢',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '例行產檢、胎心音監測'
  },
  {
    id: 9,
    date: '2026-03-15',
    startDate: '2026-03-15',
    title: '第九次產檢',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '胎兒發育監測、血壓與體重檢查'
  },
  {
    id: 10,
    date: '2026-03-29',
    startDate: '2026-03-29',
    title: '第十次產檢',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '例行產檢、胎兒位置與羊水量檢查'
  },
  {
    id: 11,
    date: '2026-04-05',
    startDate: '2026-04-05',
    title: '第十一至十四次產檢',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '每週一次例行產檢，監測胎兒狀況直到臨盆'
  },
  {
    id: 12,
    date: '2026-03-20',
    startDate: '2026-03-20',
    title: '待產包準備提醒',
    type: 'reminder',
    startTime: '20:00',
    endTime: '21:00',
    location: '家中',
    description: '準備待產包：證件、換洗衣物、嬰兒用品'
  },
  {
    id: 13,
    date: '2025-12-05',
    startDate: '2025-12-05',
    title: '產檢後運動提醒',
    type: 'reminder',
    startTime: '18:00',
    endTime: '18:30',
    location: '社區公園',
    description: '輕鬆散步 30 分鐘，促進血液循環'
  }
];


const INITIAL_DIARIES = [
    {
    id: 201,
    date: '2025-11-29',
    title: '美食冒險',
    content: '今天突然想吃酸酸甜甜的水果，切了鳳梨和奇異果，滿足了味蕾。',
    image: 'public/images/鳳梨奇異果.jpg',
    createdAt: '2025-11-29T12:45:00Z',
    updatedAt: ''
  },
  {
    id: 202,
    date: '2025-11-30',
    title: '產檢的安心感',
    content: '今天去產檢，聽到寶寶的心跳聲，覺得很安心，醫生說一切正常。',
    image: 'public/images/超音波小月份.jpg',
    
    updatedAt: '2025-11-30T12:45:00Z'
  },
  {
    id: 203,
    date: '2025-12-01',
    title: '孕婦的購物日',
    content: '今天去買了幾件孕婦裝，穿起來舒服又好看，心情大好。',
    image: 'public/images/購物.jpg',
    createdAt: '2025-12-01T18:20:00Z',
    updatedAt: ''
  },
  {
    id: 204,
    date: '2025-12-03',
    title: '甜點時光',
    content: '今天做了黑糖紅豆湯，暖暖的甜味讓心情也變得溫柔。',
    image: 'public/images/黑糖紅豆湯.jpg',
    createdAt: '2025-12-03T16:00:00Z',
    updatedAt: ''
  },
  {
    id: 205,
    date: '2025-12-05',
    title: '瑜伽練習',
    content: '跟著影片做孕婦瑜伽，伸展身體的同時覺得很放鬆，呼吸也更順暢。',
    image: 'public/images/孕婦瑜伽.jpg',
    createdAt: '2025-12-05T19:00:00Z',
    updatedAt: ''
  }
];

// 計算下一個可用的 ID (如果沒有後端)
// 這是為了在新增資料時，確保 ID 不會與現有資料衝突
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