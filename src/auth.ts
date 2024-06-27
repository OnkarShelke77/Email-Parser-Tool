import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { Client } from '@microsoft/microsoft-graph-client';
import { ConfidentialClientApplication } from '@azure/msal-node';

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const GOOGLE_CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET';
const GOOGLE_REDIRECT_URI = 'YOUR_GOOGLE_REDIRECT_URI';

const googleOAuth2Client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

export const getGoogleAuthUrl = () => {
    const scopes = [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send'
    ];
    return googleOAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
};

export const getGoogleToken = async (code: string) => {
    const { tokens } = await googleOAuth2Client.getToken(code);
    googleOAuth2Client.setCredentials(tokens);
    return tokens;
};

export const getGoogleClient = () => googleOAuth2Client;

const OUTLOOK_CLIENT_ID = 'YOUR_OUTLOOK_CLIENT_ID';
const OUTLOOK_CLIENT_SECRET = 'YOUR_OUTLOOK_CLIENT_SECRET';
const OUTLOOK_REDIRECT_URI = 'YOUR_OUTLOOK_REDIRECT_URI';
const TENANT_ID = 'YOUR_TENANT_ID';

const msalConfig = {
    auth: {
        clientId: OUTLOOK_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${TENANT_ID}`,
        clientSecret: OUTLOOK_CLIENT_SECRET,
    }
};

const msalClient = new ConfidentialClientApplication(msalConfig);

export const getOutlookAuthUrl = () => {
    const authCodeUrlParameters = {
        scopes: ['user.read', 'mail.read', 'mail.send'],
        redirectUri: OUTLOOK_REDIRECT_URI,
    };
    return msalClient.getAuthCodeUrl(authCodeUrlParameters);
};

export const getOutlookToken = async (code: string) => {
    const tokenRequest = {
        code,
        scopes: ['user.read', 'mail.read', 'mail.send'],
        redirectUri: OUTLOOK_REDIRECT_URI,
    };
    const response = await msalClient.acquireTokenByCode(tokenRequest);
    return response.accessToken;
};

export const getOutlookClient = (token: string) => {
    return Client.init({
        authProvider: (done) => {
            done(null, token);
        }
    });
};
