import { getGoogleClient, getOutlookClient } from './auth';
import { google } from 'googleapis';
import { Client } from '@microsoft/microsoft-graph-client';

export const readEmailsFromGoogle = async () => {
    const gmail = google.gmail({ version: 'v1', auth: getGoogleClient() });
    const res = await gmail.users.messages.list({ userId: 'me' });
    return res.data.messages;
};

export const readEmailsFromOutlook = async (token: string) => {
    const client = getOutlookClient(token);
    const res = await client.api('/me/messages').get();
    return res.value;
};
