import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

export async function POST(request) {
  try {
    // Aqui pegamos os dados e chamamos de 'body'
    const body = await request.json();

    // Faz a autenticação com as chaves do seu arquivo .env
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Inicializa a ferramenta oficial do Google Sheets
    const sheets = google.sheets({ version: 'v4', auth: serviceAccountAuth });

    // Envia os dados (usando append e INSERT_ROWS para não apagar o antigo)
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Página1!A:I', // Verifique se a sua aba original se chama Página1 mesmo
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [
          [
            body.comunidade,  // Trocamos 'data.' por 'body.' para puxar a variável certa
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

    return Response.json({ message: 'Evento salvo com sucesso!' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao salvar na planilha:', error);
    return Response.json({ error: 'Erro interno ao salvar' }, { status: 500 });
  }
}