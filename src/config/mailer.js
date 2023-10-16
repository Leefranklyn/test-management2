import "dotenv/config";
import { createTransport } from 'nodemailer';
import { userDetails } from "./googleapi.js";

const transporter = createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: userDetails.user,
        pass: userDetails.pass,
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