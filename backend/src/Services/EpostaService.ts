import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

function smtpYapilandirilmisMu() {
  const { host, user, pass, from } = config.smtp;
  return Boolean(host && user && pass && from);
}

export class EpostaService {
  async gonder(alicilar: string[], konu: string, mesaj: string) {
    if (!smtpYapilandirilmisMu()) {
      throw new Error('SMTP ayarlari eksik. Sunucudaki backend/.env dosyasina SMTP bilgilerini ekleyin.');
    }

    const tasiyici = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: { user: config.smtp.user, pass: config.smtp.pass },
    });

    try {
      await tasiyici.sendMail({
        from: config.smtp.from,
        to: alicilar.join(', '),
        subject: konu,
        text: mesaj,
      });
    } catch (err) {
      console.error('Form yanit e-postasi gonderilemedi:', err);
      throw new Error('E-posta gonderilemedi. SMTP ayarlarini kontrol edin.');
    }
  }
}
