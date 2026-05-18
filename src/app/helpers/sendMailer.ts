import nodemailer from 'nodemailer';
import config from '../config';
import { HttpException } from '@nestjs/common';

const sendMailer = async (email: string, subject?: string, html?: string) => {
  if (!config.email.host || !config.email.address || !config.email.pass) {
    throw new HttpException('Email service is not configured', 500);
  }

  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: false,
    auth: {
      user: config.email.address,
      pass: config.email.pass,
    },
  });
  const info = await transporter.sendMail({
    from: `"${config.email.senderName}" ${config.email.from || config.email.address}`,
    to: email,
    subject,
    html,
  });

  console.log('Message sent:', info.messageId);
};

export default sendMailer;
