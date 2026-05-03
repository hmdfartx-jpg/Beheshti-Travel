import { createClient } from '@supabase/supabase-js';
// یک کلید الکی می‌دهیم تا سایت موقتاً کرش نکند تا بقیه فایل‌ها را به فایربیس منتقل کنیم
export const supabase = createClient('https://dummy.supabase.co', 'dummy-key');