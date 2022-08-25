import axios from 'axios';
import { URLSearchParams } from 'url';

if (!process.env.RECAPTCHA_SECRET) {
  throw new Error('ReCaptcha v3 secret is not configured correctly!');
}

export const verifyCaptcha = async (key: string) => {
  try {
    const params = new URLSearchParams({
      response: key,
      secret: process.env.RECAPTCHA_SECRET!,
    });
    const captcha = await axios.post<{ success: boolean }>('https://www.google.com/recaptcha/api/siteverify', params.toString());
    return captcha.data.success;  
  } catch (e) {
    console.error(e);
    return false;
  }
}