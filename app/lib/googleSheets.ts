import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-sheet',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Sheet not connected');
  }
  return accessToken;
}

export async function getUncachableGoogleSheetClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.sheets({ version: 'v4', auth: oauth2Client });
}

export async function initializeSheetHeaders() {
  const sheets = await getUncachableGoogleSheetClient();
  
  const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  
  if (!SPREADSHEET_ID) {
    throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID not configured');
  }

  const headers = [[
    'ID de Pedido',
    'Fecha',
    'Hora',
    'Nombre Cliente',
    'Teléfono',
    'Dirección',
    'Tipo de Entrega',
    'Forma de Pago',
    'Detalles del Pedido',
    'Total',
    'Estado del Pedido'
  ]];

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Pedidos!A1:K1',
    });

    if (!response.data.values || response.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Pedidos!A1:K1',
        valueInputOption: 'RAW',
        requestBody: {
          values: headers
        }
      });
      console.log('Google Sheets headers initialized');
    } else {
      console.log('Google Sheets headers already exist');
    }
  } catch (error) {
    console.error('Failed to initialize Google Sheets headers:', error);
    throw error;
  }
}

export async function appendOrderToSheet(orderData: {
  id: number;
  customerName: string;
  phone: string;
  orderType: string;
  address?: string | null;
  paymentMethod: string;
  orderDetails: string;
  items: string;
  total: string;
  status: string;
  createdAt: Date;
  orderTime?: string | null;
}) {
  const sheets = await getUncachableGoogleSheetClient();
  
  const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  
  if (!SPREADSHEET_ID) {
    console.warn('GOOGLE_SHEETS_SPREADSHEET_ID not configured. Skipping Google Sheets sync.');
    return;
  }

  const orderDate = orderData.createdAt.toLocaleDateString('es-MX');
  const orderHour = orderData.orderTime || orderData.createdAt.toLocaleTimeString('es-MX');
  
  const deliveryTypeMap: Record<string, string> = {
    delivery: 'Domicilio',
    pickup: 'Recoger',
    'dine-in': 'Comer Aquí'
  };

  const values = [[
    orderData.id,
    orderDate,
    orderHour,
    orderData.customerName,
    orderData.phone,
    orderData.address || '',
    deliveryTypeMap[orderData.orderType] || orderData.orderType,
    orderData.paymentMethod,
    orderData.orderDetails,
    orderData.total,
    orderData.status
  ]];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Pedidos!A:K',
      valueInputOption: 'RAW',
      requestBody: {
        values
      }
    });
    console.log(`Order #${orderData.id} synced to Google Sheets successfully`);
  } catch (error) {
    console.error('Failed to sync order to Google Sheets:', error);
    throw error;
  }
}
