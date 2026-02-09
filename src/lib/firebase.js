// نسخه آزمایشی برای دیدن ظاهر سایت (دیتابیس کار نمی‌کند)
export const db = {};
export const auth = {};
export const appId = 'test-app';

// شبیه‌سازی توابع فایربیس تا برنامه کرش نکند
export const signInAnonymously = async () => console.log("Login Bypassed");
export const onAuthStateChanged = (auth, cb) => cb({ uid: "test-user" }); // همیشه لاگین فرض می‌شود