import { sendEmail } from "../config/mailer.js";

export const adminAndInstitutionRegistrationSuccess = async (
  firstName,
  lastName,
  email,
  schoolName,
  schoolUrl
) => {
  const html = `
    <div style="width: 70%; margin: 0 auto; background-color: #f2f2f2; padding: 20px; font-family: Arial, sans-serif; color: #333; text-align: left; border-radius: 10px;">
      <h2 style="color: #007bff;">Registration Successful!</h2>
      <p>Hi ${firstName} ${lastName},</p>
      <p>We are pleased to inform you that your application to our platform was successful, and your institution, ${schoolName}, has been registered.</p>
      <p>Below is the URL that you will use to access your school portal:</p>
      <a href="${schoolUrl}" style="color: #007bff; text-decoration: none;">${schoolUrl}</a>
      <p>Thank you for choosing our platform.</p>
      <p>Best Regards,<br>Enfavedu</p>
    </div>
  `;

  return await sendEmail(
    "Enfavedu <enfavedu@gmail.com>",
    email,
    "Registration Successful",
    html,
    "enfavedu@gmail.com"
  );
};


export const forgotPassword = async (firstName, lastName, email, OTP) => {
  const html = `
    <div style="width: 70%; margin: 0 auto; background-color: #f7f7f7; padding: 20px; font-family: Arial, sans-serif; color: #333; text-align: left; border-radius: 10px;">
      <h2 style="color: #007bff;">Password Reset Request</h2>
      <p>Hi ${firstName} ${lastName},</p>
      <p>Your one-time OTP for password reset is:</p>
      <h1 style="color: #007bff; font-size: 36px; margin: 10px;">${OTP}</h1>
      <p>Please keep this code secure and do not share it with anyone.</p>
      <p>If you did not request this change, please ignore this email.</p>
      <p>Best Regards,<br>Enfavedu</p>
    </div>
  `;

  return await sendEmail(
    "Enfavedu <enfavedu@gmail.com>",
    email,
    "Password Reset",
    html,
    "enfavedu@gmail.com"
  );
};


export const userRegistrationSuccess = async (
  firstName,
  lastName,
  userName,
  email,
  password,
  schoolName,
  schoolUrl
) => {
  const html = `
    <div style="width: 70%; margin: 0 auto; background-color: #eaf6ff; padding: 20px; font-family: Arial, sans-serif; color: #333; text-align: left; border-radius: 10px;">
      <h2 style="color: #007bff;">Welcome to ${schoolName}!</h2>
      <p>Hi ${firstName} ${lastName},</p>
      <p>Your application to ${schoolName} has been approved.</p>
      <p>You are now to proceed to the URL below and log in with the following credentials to take a test:</p>
      <p>User-Name: <strong>${userName}</strong></p>
      <p>Password: <strong>${password}</strong></p>
      <p>Access the URL <a href="${schoolUrl}" style="color: #007bff; text-decoration: none;">here</a>.</p>
      <p>Thank you for joining ${schoolName}!</p>
      <p>Best Regards,<br>Enfavedu</p>
    </div>
  `;

  return await sendEmail(
    "Enfavedu <enfavedu@gmail.com>",
    email,
    "Registration Successful",
    html,
    "enfavedu@gmail.com"
  );
};


export const contactUs = async (name, email, message) => {
  const html = `
    <div style="width: 70%; margin: 0 auto; background-color: #f7f7f7; padding: 20px; font-family: Arial, sans-serif; color: #333; text-align: left; border-radius: 10px;">
      <h2 style="color: #007bff;">Contact Us</h2>
      <p>Message from:${name}<${email}></p>
      <p>${message}</p>
    </div>
  `;
  return await sendEmail(
    email,
    "enfavedu@gmail.com",
    "Contact Us",
    html,
    email
  );
};

