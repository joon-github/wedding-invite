const SHEET_NAME = 'guestbook';
const MAX_MESSAGES = 30;

function doGet(e) {
  if (!isAllowed(e.parameter.secret)) {
    return json({ ok: false, error: 'Unauthorized' });
  }

  return json({ ok: true, messages: readMessages() });
}

function doPost(e) {
  const payload = JSON.parse(e.postData.contents || '{}');

  if (!isAllowed(payload.secret)) {
    return json({ ok: false, error: 'Unauthorized' });
  }

  const name = clean(payload.name, 20);
  const message = clean(payload.message, 140);

  if (!name || !message) {
    return json({ ok: false, error: 'Name and message are required' });
  }

  const sheet = getSheet();
  const id = Utilities.getUuid();
  const createdAt = new Date();

  sheet.appendRow([id, createdAt, name, message]);

  return json({ ok: true, messages: readMessages() });
}

function setupGuestbookSheet() {
  const sheet = getSheet();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['id', 'createdAt', 'name', 'message']);
  }
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(['id', 'createdAt', 'name', 'message']);
  }

  return sheet;
}

function readMessages() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return [];
  }

  const startRow = Math.max(2, lastRow - MAX_MESSAGES + 1);
  const rowCount = lastRow - startRow + 1;
  const rows = sheet.getRange(startRow, 1, rowCount, 4).getValues();

  return rows
    .reverse()
    .map(function (row) {
      return {
        id: String(row[0]),
        createdAt: row[1] instanceof Date ? row[1].toISOString() : String(row[1]),
        name: String(row[2]),
        message: String(row[3]),
      };
    });
}

function isAllowed(secret) {
  const expected = PropertiesService.getScriptProperties().getProperty('GUESTBOOK_SECRET');

  return !expected || secret === expected;
}

function clean(value, maxLength) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
