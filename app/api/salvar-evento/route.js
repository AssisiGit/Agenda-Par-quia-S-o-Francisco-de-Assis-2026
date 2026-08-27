import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();

    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth: serviceAccountAuth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Dados!A:I', 
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [
          [
            body.comunidade, 
            body.pastoral, 
            body.responsavel, 
            body.eventoNome, 
            body.data1, 
            body.data2, 
            body.hora1, 
            body.hora2, 
            body.local
          ],
        ],
      },
    });

    return NextResponse.json({ message: 'Evento salvo com sucesso!' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao salvar na planilha:', error);
    return NextResponse.json({ error: 'Erro interno ao salvar' }, { status: 500 });
  }
}