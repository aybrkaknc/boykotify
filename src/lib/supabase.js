/**
 * Supabase İstemci Yapılandırması
 * 
 * Supabase veritabanına bağlantı kuran ve tüm uygulama genelinde
 * kullanılacak tek bir istemci instance'ı oluşturur.
 * 
 * @returns {SupabaseClient} - Yapılandırılmış Supabase istemcisi.
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Supabase istemcisini oluşturur ve dışa aktarır.
 * Çevre değişkenleri yoksa konsola uyarı yazdırır.
 */
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase çevre değişkenleri yapılandırılmamış. .env dosyasını kontrol edin.');
}

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
