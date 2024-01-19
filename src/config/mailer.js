import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path: path.resolve(__dirname, "../../.env")});
import { createTransport } from 'nodemailer';

const transporter = createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASSWORD,
    },
});

transporter.verify((error,success)=>{
  if(error){
       console.log(error)
  }else{
       console.log(success)
  }
});

export const sendEmail = async (from, to, subject, html, replyTo) => {
	return new Promise((resolve, reject) => {
		transporter.sendMail({ from, to, subject, html, replyTo }, (err, info) => {
			if (err) {
				console.log("mail_error ==>", err);
				return reject(err);
			}
			resolve(info);
		});
	});
};
