# Boykotify Tasarım Sistemi (Techno-Minimalist)

Bu döküman, Boykotify projesinin görsel dilini, etkileşim felsefesini ve teknik tasarım standartlarını tanımlar.

## 1. Tasarım Felsefesi: "Techno-Minimalist Activism"
Boykotify'ın tasarımı, teknolojik soğuklukla (Industrial/Techno) aktivist ruhun (Punk/Resistance) birleşimidir. Amacımız, kullanıcının sadece bir playlist taraması değil, bir "eylem" gerçekleştirdiğini hissettirmektir.

- **Sert ve Kararlı:** Yuvarlatılmış köşeler yerine daha net hatlar, güçlü tipografi.
- **Görsel Geri Bildirim:** Her eylem (hover, click, remove) kullanıcıya anlık ve güçlü bir tepki verir.
- **Odaklanmış Minimalizm:** Gereksiz arka plan renklerinden kaçınılır, hiyerarşi "glow" (parlama) ve "outline" (çerçeve) ile kurulur.

---

## 2. Renk Paleti (Design Tokens)

| Kategori | Renk Kodu | Kullanım Alanı |
| :--- | :--- | :--- |
| **Arka Plan (Base)** | `#000000` | Ana sayfa ve temel katman. |
| **Yüzey (Surface)** | `#0A0A0A` | Kartlar ve modüller. |
| **Boykot / Primary** | `#E30A17` | Kritik uyarılar, Boykotlu şarkılar, ana aksiyonlar. |
| **Vatansever** | `#28A745` | Onaylanmış sanatçılar, güvenli bölgeler. |
| **Tümü / Genel** | `#3B82F6` | İstatistikler, genel filtreler. |
| **Alakasız / Nötr** | `#666666` | İnceleme altındakiler, ikincil metinler. |

---

## 3. Tipografi

- **Heading (Başlıklar):** `Teko` (Sans-serif)
    - Karakteristiği: Uzun, dar ve endüstriyel.
    - Kullanım: Logo, büyük başlıklar, buton metinleri.
- **Body (Gövde):** `Poppins` (Sans-serif)
    - Karakteristiği: Modern, geometrik ve okunabilir.
    - Kullanım: Açıklamalar, şarkı isimleri, kaynak metinleri.

---

## 4. Etkileşim ve Animasyonlar

### A. Glow & Outline Sistemi
Butonlar ve kartlar seçildiğinde veya üzerine gelindiğinde (hover), arka plan rengi değişmez. Bunun yerine:
- İlgili kategori renginde **Outline** (çerçeve) belirir.
- Dışa doğru yayılan yumuşak bir **Glow** (parlama/aura) eklenir.

### B. "Yırtıcı" Silme Animasyonu (Predatory Removal)
"S*KTİR ET!" butonuna basıldığında tetiklenen animasyon:
1. **Direnç (Shake):** Kart hafifçe titrer ve büyür.
2. **İmha (Shrink & Rotate):** Kart hızla küçülürken 45 derece döner.
3. **Fırlatma (Slide Out):** Ekranın sağına doğru bulanıklaşarak (blur) fırlatılır.

### C. Yardım Modülü (Hybrid Interaction)
- **Peek:** Soru işareti ikonuna hover yapıldığında popup açılır.
- **Pin:** İkona tıklandığında popup sabitlenir.
- **Dismiss:** Dışarıya tıklandığında popup kapanır.

---

## 5. Komponent Standartları

- **TrackCard:** Boykotluysa kırmızı, vatanseverse yeşil aura ile işaretlenir. Alakasız olanlar standart yüzey renginde kalır.
- **Minimalist Silme (Alakasız Şarkılar):** Kartın sağ üst köşesinde sade, beyaz bir "X" butonu bulunur. Boykotlu şarkılardaki agresif tavır yerine daha teknik ve sessiz bir ayıklama aracıdır.
- **ScoreCard:** İnteraktif filtre butonları olarak çalışır. Aktif filtre, kendi rengindeki glow ile vurgulanır.
- **Giriş Alanları:** Playlist URL kutusu, hover durumunda "Industrial Red" outline ile parlar.

---

## 6. Aksiyon Farklılaştırması

| Kategori | Aksiyon Metni / İkon | Stil | Duygu |
| :--- | :--- | :--- | :--- |
| **Boykotlu** | "S*KTİR ET!" | Kırmızı Metin | Öfke / Kararlılık |
| **Alakasız** | "✕" | Beyaz Minimal İkon | Temizlik / Düzen |
| **Vatansever** | "✕" | Beyaz Minimal İkon | Temizlik / Seçim |

---

## 7. Versiyonlama ve Güncelleme
Tasarım sistemi 0.0.100 sürümü ile sabitlenmiştir. Her görsel değişiklik bu felsefeye (Techno-Minimalist) uygun olmak zorundadır.

