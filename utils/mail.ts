import MailComposer from "nodemailer/lib/mail-composer";

export const makeBody = ({from, to, body, subject}: {
  from: string;
  to: string;
  body: string;
  subject: string;
}) => {
  let mail = new MailComposer({
    to: to,
    from: from,
    html: body,
    subject: subject,
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
