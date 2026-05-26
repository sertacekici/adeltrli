# Frontend Geliştirme Prompt'u — Lisans Uzatma Talepleri Modülü

## Amaç
"Uzatma Talepleri" sayfası oluştur. Müşterilerden gelen lisans uzatma taleplerini listele, müşteri / ürün / lisans bilgileriyle birlikte göster.

---

## Backend Endpoint'leri (canlı / Heroku)

**Base URL:** `https://adeltrlisances.herokuapp.com`

### 1) `GET /adeluzatmatalep`
Tüm uzatma taleplerini, ilgili müşteri ve ürün bilgileri ile birlikte döner.

**Response — başarılı (örnek gerçek veri):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "FX84Kp1AM4W8SOJDJR0y",
      "lisanceDocId": "05H7fu3V0DYkAspBnwmI",
      "createdAt": "2026-05-26T18:19:38.229Z",
      "customerName": "Dürümcü Sedat Usta",
      "customerPhone": "05320567753",
      "lisanceNote": "Dürümcü Sedat Usta",
      "lisanceFinishDate": "2027-03-27",
      "productName": "Trendyol Entegrasyonu"
    },
    {
      "id": "qxee7g0a55AuvmaOjwqn",
      "lisanceDocId": "09G4tdIuOpG1TIiQ3zVN",
      "createdAt": "2026-05-26T18:19:38.229Z",
      "customerName": "Çıtır Pide Mertcan",
      "customerPhone": "05531296570",
      "lisanceNote": "Trendyol -Oba Pide Lahmacun",
      "lisanceFinishDate": "2026-07-08",
      "productName": "Trendyol Entegrasyonu"
    },
    {
      "id": "r9YCdChkMEngLnvYlGdo",
      "lisanceDocId": "0D2XqZGX03jnZTXfKwXK",
      "createdAt": "2026-05-26T18:19:38.229Z",
      "customerName": "Çıtır Pide Mertcan",
      "customerPhone": "05531296570",
      "lisanceNote": "Trendyol -Pide Time",
      "lisanceFinishDate": "2026-07-08",
      "productName": "Trendyol Entegrasyonu"
    },
    {
      "id": "6p0ABmlwRcPxtTABU7Fh",
      "lisanceDocId": "02veZ2rjDVr11N4FObyg",
      "createdAt": "2026-05-26T17:59:47.052Z",
      "customerName": "ZEKİ MEHMET SULHAN MEHMET USTANIN YERİ",
      "customerPhone": "05369617947",
      "lisanceNote": "PAVO - PAV860050908",
      "lisanceFinishDate": "2027-05-16",
      "productName": "Pavo Entegrasyonu"
    },
    {
      "id": "jfWGcoMbgBNeGYJfG6MK",
      "lisanceDocId": "01AFMjFkTc2EQKI57Nxs",
      "createdAt": "2026-05-26T17:59:47.052Z",
      "customerName": "RAMAZAN OLUÇ GALA KOKOREÇ - SEFAKÖY ŞUBE",
      "customerPhone": "05378854985",
      "lisanceNote": "Trendyol -Gala Kokoreç ",
      "lisanceFinishDate": "2026-11-06",
      "productName": "Trendyol Entegrasyonu"
    }
  ]
}
```

**Alan açıklamaları:**

| Alan | Tip | Açıklama |
|---|---|---|
| `id` | string | `uzatmatalep` koleksiyonundaki döküman ID'si |
| `lisanceDocId` | string | `lisances` koleksiyonundaki orijinal lisans ID'si |
| `createdAt` | ISO datetime | Talebin oluşturulma zamanı |
| `customerName` | string \| null | Müşteri adı |
| `customerPhone` | string \| null | Müşteri telefonu |
| `lisanceNote` | string \| null | Lisans notu (genelde marka / şube bilgisi) |
| `lisanceFinishDate` | string (YYYY-MM-DD) \| null | Lisansın mevcut bitiş tarihi |
| `productName` | string \| null | Ürün / entegrasyon adı |

> Müşteri, ürün veya lisans silinmişse ilgili alanlar `null` olarak gelir. Frontend'de `"—"` göster.

---

### 2) `POST /adeluzatmatalep`
Yeni lisans uzatma talebi kaydeder. Aynı `lisanceDocId` daha önce eklendiyse tekrar kaydetmez (duplicate skip).

**Request body — desteklenen formatlar:**

Çoklu:
```json
{ "documentIds": ["05H7fu3V0DYkAspBnwmI", "09G4tdIuOpG1TIiQ3zVN"] }
```

Tek:
```json
{ "documentId": "05H7fu3V0DYkAspBnwmI" }
```

**Response — başarılı (karışık: 2 yeni + 1 duplicate):**
```json
{
  "success": true,
  "count": 2,
  "saved": [
    { "id": "FX84Kp1AM4W8SOJDJR0y", "lisanceDocId": "05H7fu3V0DYkAspBnwmI" },
    { "id": "qxee7g0a55AuvmaOjwqn", "lisanceDocId": "09G4tdIuOpG1TIiQ3zVN" }
  ],
  "skippedCount": 1,
  "skipped": [
    { "id": "jfWGcoMbgBNeGYJfG6MK", "lisanceDocId": "01AFMjFkTc2EQKI57Nxs", "reason": "already exists" }
  ]
}
```

**Response — hata (400):**
```json
{ "success": false, "message": "documentIds (array) is required" }
```

---

### 3) `POST /adeluzatmaislem`
Seçilen lisans(lar)ın bitiş tarihini uzatır. İki mod var: `addYear` (mevcut bitiş tarihine N yıl ekle) ve `setDate` (belirtilen tarihe ayarla). İşlem başarılı olunca ilgili `uzatmatalep` kayıtları otomatik silinir (varsayılan: `deleteRequests: true`).

**Request body — modlar:**

a) Mevcut bitiş tarihine 1 yıl ekle (varsayılan):
```json
{ "lisanceDocIds": ["05H7fu3V0DYkAspBnwmI", "01AFMjFkTc2EQKI57Nxs"] }
```

b) Mevcut bitiş tarihine N yıl ekle:
```json
{ "lisanceDocIds": ["05H7fu3V0DYkAspBnwmI"], "mode": "addYear", "years": 2 }
```

c) Belirli bir bitiş tarihine ayarla:
```json
{
  "lisanceDocIds": ["05H7fu3V0DYkAspBnwmI"],
  "mode": "setDate",
  "newFinishDate": "2027-12-31"
}
```

d) Uzatma talebi kaydını silme (sadece tarihi güncelle):
```json
{ "lisanceDocIds": ["05H7fu3V0DYkAspBnwmI"], "deleteRequests": false }
```

**Body alanları:**

| Alan | Tip | Zorunlu | Varsayılan | Açıklama |
|---|---|---|---|---|
| `lisanceDocIds` | string[] | ✅ | — | `lisances` koleksiyonundaki lisans doküman ID'leri (uzatmatalep kaydının `lisanceDocId` alanı) |
| `mode` | `"addYear"` \| `"setDate"` | ❌ | `"addYear"` | İşlem modu |
| `years` | number | ❌ | `1` | `addYear` modunda eklenecek yıl sayısı (negatif olursa kısaltır) |
| `newFinishDate` | string (ISO veya `YYYY-MM-DD`) | `setDate` için ✅ | — | Yeni bitiş tarihi |
| `deleteRequests` | boolean | ❌ | `true` | İşlem sonrası ilgili uzatmatalep kayıtlarını sil |

**Response — başarılı:**
```json
{
  "success": true,
  "mode": "addYear",
  "years": 1,
  "updatedCount": 2,
  "updated": [
    {
      "lisanceDocId": "05H7fu3V0DYkAspBnwmI",
      "previousFinishDate": "2027-03-27",
      "newFinishDate": "2028/03/27 00:00:00"
    },
    {
      "lisanceDocId": "01AFMjFkTc2EQKI57Nxs",
      "previousFinishDate": "2026-11-06",
      "newFinishDate": "2027/11/06 00:00:00"
    }
  ],
  "failedCount": 0,
  "failed": [],
  "deletedRequestCount": 2,
  "deletedRequests": [
    { "id": "FX84Kp1AM4W8SOJDJR0y", "lisanceDocId": "05H7fu3V0DYkAspBnwmI" },
    { "id": "jfWGcoMbgBNeGYJfG6MK", "lisanceDocId": "01AFMjFkTc2EQKI57Nxs" }
  ]
}
```

**Önemli notlar:**
- Yeni tarih formatı: `YYYY/MM/DD HH:mm:ss` (mevcut sistemle uyumlu).
- Güncellenen lisansın `lisanceStatus` alanı otomatik olarak `"1"` (aktif) yapılır.
- Lisans bulunamazsa veya hata olursa `failed` dizisine düşer; diğerleri yine işlenir.

---

## Frontend İstekleri

1. **Sayfa adı:** "Lisans Uzatma Talepleri" — sol menüye link ekle.
2. **Liste tablosu sütunları:**
   - **Seçim kutusu** (checkbox) — ilk sütun. Başlıkta "tümünü seç" checkbox'ı bulunmalı.
   - Müşteri Adı (`customerName`)
   - Telefon (`customerPhone`) — tıklanınca `tel:` link
   - Ürün (`productName`) — badge / chip görünümü
   - Lisans Notu (`lisanceNote`)
   - Mevcut Bitiş Tarihi (`lisanceFinishDate`) — `DD.MM.YYYY` formatında
   - Talep Tarihi (`createdAt`) — `DD.MM.YYYY HH:mm` formatında, en yeni üstte sıralı
   - İşlemler (detay / lisansa git butonu — `lisanceDocId` ile)

### Toplu Uzatma Aksiyonu (zorunlu)

Tablonun üstünde, en az bir satır seçildiğinde aktif olan bir aksiyon bar'ı olsun:

- **"1 Yıl Ekle" butonu** → seçili satırlar için `POST /adeluzatmaislem` çağrısı, body: `{ lisanceDocIds: [...selectedDocIds], mode: "addYear", years: 1 }`. Onay diyaloğu göster ("X lisansın bitiş tarihine 1 yıl eklenecek. Onaylıyor musunuz?").
- **Özel tarih seçim alanı** (date picker) + **"Bu tarihe ayarla" butonu** → seçili satırlar için body: `{ lisanceDocIds: [...selectedDocIds], mode: "setDate", newFinishDate: "YYYY-MM-DD" }`. Tarih seçilmeden buton disabled olsun.
- **Yıl seçici (opsiyonel)**: 1 / 2 / 3 yıl seçimi için küçük bir dropdown — seçilirse `years` alanı gönderilir.
- **Seçim sayacı**: "X kayıt seçildi" şeklinde gösterilsin.
- İşlem başarılı olduğunda:
  - Başarı toast'ı göster: "X lisans güncellendi" (`updatedCount`'a göre).
  - `failedCount > 0` ise uyarı toast: "Y kayıt güncellenemedi" + detayları göster.
  - Listeyi otomatik yenile (`GET /adeluzatmatalep`); başarılı işlemde ilgili talepler backend'de silindiği için listeden düşecek.
  - Seçimleri temizle.
3. **Boş durum:** Liste boşsa "Henüz uzatma talebi bulunmuyor" mesajı.
4. **Yükleniyor / hata:** Skeleton / spinner ve hata mesajı göster.
5. **Filtreler (opsiyonel):** Ürün adına göre, tarih aralığına göre.
6. **Arama:** Müşteri adı veya telefona göre client-side arama.
7. **Yenile butonu:** GET endpoint'ini yeniden çağırır.
8. **Null güvenliği:** Tüm alanlar `null` olabilir; her yerde `value ?? "—"` kullan.

---

## Örnek fetch kodu (referans)

```js
// Listele
const res = await fetch("https://adeltrlisances.herokuapp.com/adeluzatmatalep");
const { success, data } = await res.json();
if (!success) throw new Error("Liste alınamadı");
// data: Array<{ id, lisanceDocId, createdAt, customerName, customerPhone, lisanceNote, lisanceFinishDate, productName }>

// Yeni talep ekle
const post = await fetch("https://adeltrlisances.herokuapp.com/adeluzatmatalep", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ documentIds: ["05H7fu3V0DYkAspBnwmI"] })
});
const result = await post.json();
// result.saved -> yeni eklenen kayitlar
// result.skipped -> zaten var olan kayitlar
```

---

## Notlar
- CORS açık, doğrudan tarayıcıdan çağrılabilir.
- Auth yok (şu an için).
- Veriler Firebase Firestore'dan canlı çekilir; her GET güncel veriyi getirir.
- Duplicate kontrolü `lisanceDocId` alanı üzerinden yapılır — aynı lisans için ikinci talep `skipped` olarak döner, yeni kayıt oluşmaz.
