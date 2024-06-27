import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { getGoogleAuthUrl, getGoogleToken, getOutlookAuthUrl, getOutlookToken } from './auth';
import { readEmailsFromGoogle, readEmailsFromOutlook } from './emailService';
import { addEmailToQueue, setupEmailWorker } from './scheduler';
import { analyzeEmailContent, generateEmailReply } from './aiService';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/auth/google', (req, res) => {
  res.redirect(getGoogleAuthUrl());
});

app.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code as string;
  const tokens = await getGoogleToken(code);
  res.json(tokens);
});

app.get('/auth/outlook', async (req, res) => {
  const authUrl = await getOutlookAuthUrl();
  res.redirect(authUrl);
});

app.get('/auth/outlook/callback', async (req, res) => {
  const code = req.query.code as string;
  const token = await getOutlookToken(code);
  res.json(token);
});

app.get('/emails/google', async (req, res) => {
  const emails = await readEmailsFromGoogle();
  res.json(emails);
});

app.get('/emails/outlook', async (req, res) => {
  const token = req.query.token as string;
  const emails = await readEmailsFromOutlook(token);
  res.json(emails);
});

app.post('/process-email', async (req, res) => {
  const email = req.body;
  await addEmailToQueue(email);
  res.status(200).send('Email added to queue');
});

setupEmailWorker();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
