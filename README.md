# Aplikasi Ucapan Ulang Tahun

Halaman web sederhana untuk membuat ucapan ulang tahun yang dipersonalisasi. Tidak memerlukan server atau instalasi apa pun.

## Menjalankan di GitHub Pages

1. Buat repository baru di GitHub, lalu unggah seluruh isi folder ini (`index.html`, `style.css`, `script.js`, dan `README.md`).
2. Buka **Settings** > **Pages** pada repository tersebut.
3. Di bagian **Build and deployment**, pilih **Deploy from a branch**.
4. Pilih branch `main`, folder `/(root)`, lalu klik **Save**.
5. Tunggu sebentar; GitHub akan menampilkan tautan situs Anda di halaman tersebut.

## Fitur

- Mengubah nama penerima dan isi ucapan secara langsung.
- Animasi konfeti saat tombol rayakan diklik.
- Tampilan responsif untuk ponsel dan desktop.

## Mengaktifkan buku komentar Google Sheet

Situs ini terhubung ke Web App Google Apps Script berikut:

`https://script.google.com/macros/s/AKfycbz77qobUZUcLfdsAL-YFTerNdnN5ewl284RPB58wujHABfbq82zg3WLmdcvfDLSSLt9/exec`

Pengiriman komentar sudah terhubung. Agar daftar komentar dapat tampil kembali saat halaman dibuka, ganti fungsi `doGet` pada Apps Script dengan kode berikut. Setelah menyimpan, klik **Deploy** > **Manage deployments** > edit deployment yang ada > pilih **New version** > **Deploy**.

```javascript
function doGet(e) {
  const rows = getSheet_()
    .getDataRange()
    .getDisplayValues()
    .slice(1)
    .reverse()
    .slice(0, 50);

  const data = {
    comments: rows.map(([time, name, message]) => ({ time, name, message }))
  };

  const callback = String(e.parameter.callback || "");
  if (callback && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(callback)) {
    return ContentService
      .createTextOutput(`${callback}(${JSON.stringify(data)})`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return output_(data);
}
```

Jangan mengubah alamat Web App yang dipakai aplikasi. Sheet tetap tidak perlu dibagikan kepada pengunjung.
