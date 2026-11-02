/**
 * Longtable sign-up capture.
 *
 * Adds one row to this Google Sheet for each sign-up on the website.
 *
 * Setup (once):
 * 1. Open the sheet "Longtable newsletter capture database".
 * 2. Extensions > Apps Script. Delete the sample code and paste this file. Save.
 * 3. Deploy > New deployment > type "Web app".
 *    Execute as: Me. Who has access: Anyone. Deploy, and allow the access it asks for.
 * 4. Copy the Web app URL (it ends in /exec) and give it to the site:
 *    src/config.js > sheetEndpoint, or the repo variable SHEET_ENDPOINT.
 *
 * After a code change here, use Deploy > Manage deployments > Edit > New version,
 * so the URL stays the same.
 */
var HEADERS = ['Timestamp', 'Work email', 'Organization', 'Page'];

function doPost(e) {
  var p = (e && e.parameter) || {};
  var email = String(p.email || '').trim().slice(0, 254);
  var org = String(p.organization || '').trim().slice(0, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !org) return out_({ ok: false });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    // A leading quote stops a value from running as a formula.
    var safe = function (v) { return /^[=+\-@]/.test(v) ? "'" + v : v; };
    sheet.appendRow([new Date(), safe(email), safe(org), safe(String(p.page || '').slice(0, 200))]);
  } finally {
    lock.releaseLock();
  }
  return out_({ ok: true });
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
