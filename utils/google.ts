import { gmail_v1, google } from 'googleapis';
import { GaxiosResponse } from "gaxios";
import { OAuth2Client } from 'google-auth-library';
import Mail, { Attachment } from 'nodemailer/lib/mailer';
import { makeBody } from './mail';
const OAuth2 = google.auth.OAuth2;

const defaultSenderName = 'InDome HK <indome.hk@gmail.com>'

export interface IMailData {
  from?: string;
  to: string;
  subject: string;
  body: string;
  attachments?: Attachment[];
}

export interface IInvitationMailData {
  from?: string;
  to: string;
  subject: string;
  icalEvent: Mail.IcalAttachment;
}

class GoogleClient {
  private refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  private authClient: OAuth2Client;

  private gmailClient: gmail_v1.Gmail;

  constructor() {
    this.authClient = new OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    )

    this.authClient.setCredentials({
      refresh_token: this.refreshToken,
    });

    this.gmailClient = google.gmail({
      version: 'v1',
      auth: this.authClient,
    });
  }

  private async setAccessToken() {
    const accessToken = await this.authClient.getAccessToken();
    this.authClient.setCredentials({
      refresh_token: this.refreshToken,
      access_token: accessToken.token,
    });
  }

  private async sendGmailMessage(contents: string) {
    return new Promise<GaxiosResponse<gmail_v1.Schema$Message> | null | undefined>((resolve, reject) => {
      this.gmailClient.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: contents,
        },
      }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      })
    });
  }

  async sendMail({ from, to, subject, body, attachments }: IMailData) {
    await this.setAccessToken();
    const contents = await makeBody({
      from: from ?? defaultSenderName,
      to,
      subject,
      body,
      attachments,
    });
    await this.sendGmailMessage(contents);
  }
}

export const googleClient = new GoogleClient();

export default GoogleClient;
