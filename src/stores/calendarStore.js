import { defineStore } from 'pinia';
import axios from 'axios';
import dayjs from 'dayjs';

const BASE_URL = import.meta.env.BASE_URL;
// 定義類型對照表
  const TYPE_MAP = {
    '產檢': 'checkup',
    '提醒': 'reminder',
    '預約': 'appointment',
    '其他': 'other'
  };
const REVERSE_TYPE_MAP = Object.fromEntries(
  Object.entries(TYPE_MAP).map(([key, value]) => [value, key])
);

export const useCalendarStore = defineStore('schedule', {
  state: () => ({
    events: [],
    diaries: [],
    loading: false,
    currentUserId: null
  }),

  actions: {
    async fetchAllData(user_id) {
      if (!user_id) return;
      this.currentUserId = user_id; // 儲存 ID 供後續 action 使用
      this.loading = true;
      try {
        // 呼叫後端 API 
        const response = await axios.get(`http://192.168.0.187:3001/api/schedule/${user_id}`);
        console.log("後端原始資料:", response.data);
        const { dbEvents, dbDiaries } = response.data;
        console.log("解構後的行程:", dbEvents);

        // 行程 (Events) 
        this.events = dbEvents.map(item => ({
          id: item.event_id,
          date: dayjs(item.event_start_date).format('YYYY-MM-DD'),      
          startDate: dayjs(item.event_start_date).format('YYYY-MM-DD'),
          title: item.event_title,
          type: TYPE_MAP[item.event_type] || 'other',
          rawType: item.event_type,
          startTime: item.event_start_time ? item.event_start_time.substring(0, 5) : '', 
          endTime: item.event_end_time ? item.event_end_time.substring(0, 5) : '',
          location: item.event_place,
          description: item.event_describe,
          isAuto: item.event_is_auto === 1,
          isEditable: item.event_is_editable === 1
        }));

        // 日記 (Diaries) 
        this.diaries = dbDiaries.map(item => ({
          id: item.diary_id,
          date: dayjs(item.diary_date).format('YYYY-MM-DD'),
          title: item.diary_title,
          content: item.diary_description,
          // 如果資料庫存的是相對路徑，這裡補上 BASE_URL
          image: item.diary_file_path|| null,
          createdAt: item.diary_created_datetime,
          updatedAt: item.diary_modified_datetime
        }));

      console.log("資料轉換完成，行程筆數:", this.events.length);
      } catch (error) {
        console.error('獲取資料庫資料失敗:', error);
      } finally {
        this.loading = false;
      }
    },
    // 新增行程
    async addEvent(newEvent) {
      try {
        const payload = {
          event_title: newEvent.title,
          event_type: REVERSE_TYPE_MAP[newEvent.type] || '其他',
          event_start_date: newEvent.date,
          event_start_time: newEvent.startTime.length === 5 ? `${newEvent.startTime}:00` : newEvent.startTime,
          event_end_time: newEvent.endTime.length === 5 ? `${newEvent.endTime}:00` : newEvent.endTime,
          event_place: newEvent.location || '',
          event_describe: newEvent.description || '',
          personal_informations_user_id: this.currentUserId,
        };
        await axios.post('http://192.168.0.187:3001/api/schedule', payload);
        await this.fetchAllData(this.currentUserId); // 重新整理資料
      } catch (error) {
        console.error('新增失敗:', error);
        throw error;
      }
    },

    // 編輯行程 
    async updateEvent(updatedEvent) {
      try {
        console.log("準備更新的 ID:", updatedEvent.id);

        const payload = {
          event_title: updatedEvent.title,
          event_type: REVERSE_TYPE_MAP[updatedEvent.type] || '其他',
          event_start_date: updatedEvent.date,
          event_start_time: updatedEvent.startTime,
          event_end_time: updatedEvent.endTime,
          event_place: updatedEvent.location,
          event_describe: updatedEvent.description,
          personal_informations_user_id: this.currentUserId
        };
        await axios.put(`http://192.168.0.187:3001/api/schedule/${updatedEvent.id}`, payload);
        await this.fetchAllData(this.currentUserId);
      } catch (error) { console.error('更新失敗:', error); }
    },

    // 刪除行程
   async deleteEvent(eventId) {
    try {
      // 發送 DELETE 請求
      await axios.delete(`http://192.168.0.187:3001/api/schedule/${eventId}`);
      
      // 刪除成功後，立即重新抓取資料庫，讓日曆畫面更新
      await this.fetchAllData(this.currentUserId); 
      console.log(`行程 ${eventId} 刪除成功`);
    } catch (error) {
      console.error('刪除失敗:', error);
      alert('刪除行程失敗，請稍後再試');
    }
  },

    // 新增日記 
    async addDiary(diary, imageFile) {
      try {
      const formData = new FormData();
      formData.append('date', diary.date);
      formData.append('title', diary.title || '今日日記');
      formData.append('content', diary.content || '');
      formData.append('personal_informations_user_id', this.currentUserId);
      
      if (imageFile) {
        formData.append('image', imageFile); // 這裡的 imageFile 是使用者在本機選取的原始檔案
      }

      await axios.post('http://192.168.0.187:3001/api/diary', formData);
      console.log("日記儲存成功");
      await this.fetchAllData(this.currentUserId);
      } catch (error) {
        console.error("儲存日記失敗:", error);
        throw error;
      }
    },

    // 編輯日記
    async updateDiary(updatedDiary,imageFile) {
      try {
        const userId = this.currentUserId; 
        if (!userId) {
          console.error('錯誤：找不到 User ID');
          return;
        }
        const formData = new FormData();
        formData.append('title', updatedDiary.title || '今日日記');
        formData.append('date', updatedDiary.date);
        formData.append('content', updatedDiary.content || '');
        formData.append('personal_informations_user_id', this.currentUserId);
        
      if (imageFile) {
        // 如果有新檔案，只傳送檔案
        console.log('上傳新檔案:', imageFile.name);
        formData.append('image', imageFile); 
      } else {
        // 如果沒有新檔案，則傳送舊網址字串 (如果是空字串代表刪除圖片)
        console.log('傳送舊網址或空值:', updatedDiary.image);
        formData.append('image', updatedDiary.image || '');
      }
        await axios.put(`http://192.168.0.187:3001/api/diary/${updatedDiary.id}`, formData);
        
        console.log("日記更新成功");
        await this.fetchAllData(this.currentUserId); // 重新整理畫面
      } catch (error) {
        console.error('更新日記失敗:', error);
        throw error;
      }
    },

    // 刪除日記
    async deleteDiary(diaryId) {
      try {
        // 發送 DELETE 請求到後端
        await axios.delete(`http://192.168.0.187:3001/api/diary/${diaryId}`);
        
        // 2. 刪除成功後，重新抓取所有資料以更新畫面
        await this.fetchAllData(this.currentUserId); 
        console.log(`日記 ${diaryId} 刪除成功`);
      } catch (error) {
        console.error('刪除日記失敗:', error);
        alert('刪除日記失敗，請稍後再試');
      }
    },
  }
});