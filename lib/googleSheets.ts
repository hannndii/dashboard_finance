import { google } from 'googleapis';

const {
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  google_spreadsheet_id,
  google_sheet_name,
} = process.env as Record<string, string | undefined>;

function requireEnv(name: string, value: unknown): string {
  if (!value) {
    throw new Error(`Env ${name} belum di-set di .env.local`);
  }
  return String(value);
}

function buildPrivateKey(): string {
  const key = requireEnv('GOOGLE_PRIVATE_KEY', process.env.GOOGLE_PRIVATE_KEY);
  // Support format env seperti "-----BEGIN ...\\n...\\n-----END ..." (string dengan literal \\n)
  return key.replace(/\\n/g, '\n');
}

export async function appendRowToGoogleSheet(row: Record<string, string | number | null>) {
  const clientEmail = requireEnv('GOOGLE_CLIENT_EMAIL', GOOGLE_CLIENT_EMAIL);
  const privateKey = buildPrivateKey();
  const spreadsheetId = requireEnv('google_spreadsheet_id', google_spreadsheet_id);
  const sheetName = requireEnv('google_sheet_name', google_sheet_name);

  // Kolom sesuai urutan di bawah
  const headers = [
    'createdAt',
    'productName',
    'paymentMethod',
    'price',
    'qty',
    'total',
    'receiptImage',
  ];

  const values = headers.map((h) => {
    const v = row[h];
    if (v === null || v === undefined) return '';
    return v;
  });

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Append di sheet; jika header belum ada, pastikan sheet sudah memiliki header.
  // Kita tetap append row saja agar tidak mengubah struktur.
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [values],
    },
  });
}

