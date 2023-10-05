import "dotenv/config";
import nodemailer from "nodemailer";
import { google } from "googleapis";

import { userDetails } from "./googleapi.js";

const clientId = userDetails.clientId;
const clientSecret = userDetails.clientSecret;
const redirectUrl = userDetails.redirectUrl;
const refreshToken = userDetails.refreshToken;
const user = userDetails.user;
const OAuth2 = google.auth.OAuth2;
const oAuth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
oAuth2Client.setCredentials({ refresh_token: refreshToken });

const accessToken = await oAuth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: user,
    clientId: clientId,
    clientSecret: clientSecret,
    refreshToken: refreshToken,
    accessToken: accessToken,
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


