import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function POST(request) {
  try {
    const body = await request.json();

    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo(); 
    const sheet = doc.sheetsByIndex[0];

    await sheet.addRow({
      'Comunidade': body.comunidade,
      'Pastoral': body.pastoral,
      'Responsavel': body.responsavel,
      'Evento_Nome': body.eventoNome,
      'Data 1': body.data1,
      'Data 2': body.data2,
      'Hora 1': body.hora1,
      'Hora 2': body.hora2,
      'Local': body.local
    });

    return Response.json({ message: 'Evento salvo com sucesso!' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao salvar na planilha:', error);
    return Response.json({ error: 'Erro interno ao salvar' }, { status: 500 });
  }
}