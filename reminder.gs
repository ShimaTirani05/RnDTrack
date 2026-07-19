/**
 * REMINDER UPDATE MINGGUAN — R&D Progress Tracker
 * Kirim pengingat ke tiap staff via WhatsApp (Fonnte) dan/atau Email.
 *
 * Pasang jadwal: Triggers → Add Trigger → kirimReminder → Time-driven → Week timer.
 * Lihat panduan-setup.md bagian C.
 */

// 1) Isi data staff. Nomor WhatsApp format 62xxxx (tanpa + atau 0 di depan).
const STAFF = [
  { nama: "Shima",  email: "shima@email.com",  wa: "62812xxxxxxx", modul: "Melon, Nursery, Karantina & Aklimatisasi" },
  { nama: "Muthia", email: "muthia@email.com", wa: "62812xxxxxxx", modul: "Pengajuan, Berita Acara, Notulensi, Risalah, SPK & BAPP" },
  { nama: "Dafit",  email: "dafit@email.com",  wa: "62812xxxxxxx", modul: "Biochar, Kompos, Vermicast, Vermijuice" },
  { nama: "Thifa",  email: "thifa@email.com",  wa: "62812xxxxxxx", modul: "Nutrisi Organik, Beneficial Microorganism, Analisa HPT" },
  { nama: "Huda",   email: "huda@email.com",   wa: "62812xxxxxxx", modul: "Kondisi Iklim & Monitoring Kebun" },
  { nama: "Sofyan", email: "sofyan@email.com", wa: "62812xxxxxxx", modul: "Alpukat, Kelengkeng, Nangka, Pisang, Durian" },
];

// 2) Link aplikasi Anda (setelah di-hosting) — dicantumkan di pesan.
const APP_URL = "https://namaanda.netlify.app";

// 3) Pilih channel
const KIRIM_EMAIL    = true;   // set false untuk mematikan email
const KIRIM_WHATSAPP = false;  // set true bila sudah punya token Fonnte
const FONNTE_TOKEN   = "TOKEN_FONNTE_ANDA";

function kirimReminder() {
  STAFF.forEach(function (s) {
    var pesan =
      "Halo " + s.nama + " 👋\n\n" +
      "Ini pengingat mingguan untuk memperbarui data R&D Anda:\n" +
      "• " + s.modul + "\n\n" +
      "Silakan buka aplikasi dan update progress minggu ini:\n" + APP_URL + "\n\n" +
      "Terima kasih! — R&D Progress Tracker";

    if (KIRIM_EMAIL && s.email && s.email.indexOf("@") > -1) {
      try {
        MailApp.sendEmail({
          to: s.email,
          subject: "Reminder update mingguan — R&D Tracker",
          body: pesan,
        });
      } catch (e) { Logger.log("Email gagal untuk " + s.nama + ": " + e); }
    }

    if (KIRIM_WHATSAPP && s.wa) {
      try {
        UrlFetchApp.fetch("https://api.fonnte.com/send", {
          method: "post",
          headers: { Authorization: FONNTE_TOKEN },
          payload: { target: s.wa, message: pesan },
          muteHttpExceptions: true,
        });
      } catch (e) { Logger.log("WA gagal untuk " + s.nama + ": " + e); }
    }
  });

  Logger.log("Reminder terkirim ke " + STAFF.length + " staff.");
}
