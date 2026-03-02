// src/utils/fakeApi.js

export function fakeLogin (id, mobile, code) {
  return new Promise((resolve, reject) => {
    const demoUser = {
      id: "A123456789",
      mobile: "0912345678",
      code: "123456",
      name: "王小美",
      dueDate: "2025/12/31"
    };

    if (id !== demoUser.id || mobile !== demoUser.mobile) {
      reject("身分證或手機號碼錯誤");
      return;
    }

    if (code !== demoUser.code) {
      reject("驗證碼錯誤");
      return;
    }

    resolve({
      name: demoUser.name,
      mobile: demoUser.mobile,
      dueDate: demoUser.dueDate
    });
  });
}
