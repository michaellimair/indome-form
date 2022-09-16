import MailComposer from "nodemailer/lib/mail-composer";
import { Attachment } from "nodemailer/lib/mailer";

export const makeBody = ({from, to, body, subject, attachments}: {
  from: string;
  to: string;
  body: string;
  subject: string;
  attachments?: Attachment[];
}) => {
  let mail = new MailComposer({
    to: to,
    from: from,
    html: body,
    subject: subject,
    attachments,
    textEncoding: "base64",
  });
  
  // Compiles and encodes the mail.
  return new Promise<string>((resolve, reject) => {
    mail.compile().build((err, msg) => {
      if (err){
        return reject(err);
      } 
    
      const encodedMessage = Buffer.from(msg)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      
      return resolve(encodedMessage);
    });  
  })
}
