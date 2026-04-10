import { google } from 'googleapis';
import { parseSheetData } from '@/lib/data';

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

   const response = await sheets.spreadsheets.values.get({
  spreadsheetId: process.env.SHEET_ID,
  range: 'Master Data!A:X',
  valueRenderOption: 'UNFORMATTED_VALUE',
  dateTimeRenderOption: 'FORMATTED_STRING',
});

    const rows = response.data.values;
    const data = parseSheetData(rows);

    return Response.json({ success: true, data });

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}