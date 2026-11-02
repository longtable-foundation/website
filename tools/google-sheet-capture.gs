/**
 * Longtable sign-ups and proposal requests.
 *
 * The website posts work email + organization here. Each post adds one row to this
 * Google Sheet. A post with type "proposal" also emails the proposal PDF from Google Drive.
 * The PDF never goes on the website or in the GitHub repo.
 *
 * Setup (once):
 * 1. Put the proposal PDF in Google Drive. Keep it private. Copy its file id
 *    (the part between /d/ and /view in its link).
 * 2. Open the sheet "Longtable newsletter capture database".
 * 3. Extensions > Apps Script. Delete the sample code and paste this file. Save.
 * 4. Project Settings (gear icon) > Script properties > Add script property:
 *    PROPOSAL_FILE_ID = the file id from step 1.
 *    Optional: REPLY_TO = the address replies go to (for example press@alpaca.markets).
 * 5. Deploy > New deployment > type "Web app".
 *    Execute as: Me. Who has access: Anyone. Deploy, and allow the access it asks for
 *    (Sheets, Drive read, send email as you).
 * 6. Copy the Web app URL (it ends in /exec) and give it to the site:
 *    src/config.js > sheetEndpoint, or the repo variable SHEET_ENDPOINT.
 * 7. Test: run testProposalEmail() once from the editor. It sends the email to you.
 *
 * After a code change here, use Deploy > Manage deployments > Edit > New version,
 * so the URL stays the same.
 *
 * Limits: Google lets a script send about 100 emails a day from a gmail.com account and
 * about 1,500 a day from a Google Workspace account. An attachment can be up to 25 MB.
 */
var HEADERS = ['Timestamp', 'Work email', 'Organization', 'Request', 'Page', 'Email sent'];
var SUBJECT = 'The Longtable proposal: Multimodal Clearing';

function doPost(e) {
  var p = (e && e.parameter) || {};
  var email = String(p.email || '').trim().slice(0, 254);
  var org = String(p.organization || '').trim().slice(0, 200);
  var type = p.type === 'proposal' ? 'proposal' : 'signup';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !org) return out_({ ok: false });

  var sent = '';
  if (type === 'proposal') {
    try {
      sendProposal_(email);
      sent = 'yes';
    } catch (err) {
      sent = 'failed: ' + String(err).slice(0, 150);
    }
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    // A leading quote stops a value from running as a formula.
    var safe = function (v) { return /^[=+\-@]/.test(v) ? "'" + v : v; };
    sheet.appendRow([new Date(), safe(email), safe(org), type, safe(String(p.page || '').slice(0, 200)), sent]);
  } finally {
    lock.releaseLock();
  }
  return out_({ ok: true });
}

function sendProposal_(to) {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('PROPOSAL_FILE_ID');
  if (!id) throw new Error('PROPOSAL_FILE_ID is not set');
  var pdf = DriveApp.getFileById(id).getAs(MimeType.PDF).setName('longtable-multimodal-clearing-proposal.pdf');
  var opts = {
    to: to,
    subject: SUBJECT,
    name: 'Longtable Foundation',
    body: 'Thank you for your interest in the Longtable Foundation.\n\n' +
      'The proposal "Multimodal Clearing: a technology layer for licensed clearinghouses" is attached.\n\n' +
      'We will send you progress updates. To stop them, reply with "unsubscribe".\n\n' +
      'Longtable Foundation. Incubated by Alpaca.',
    attachments: [pdf],
  };
  var replyTo = props.getProperty('REPLY_TO');
  if (replyTo) opts.replyTo = replyTo;
  MailApp.sendEmail(opts);
}

// Run once from the editor to check the setup. It emails the PDF to you.
function testProposalEmail() {
  sendProposal_(Session.getActiveUser().getEmail());
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
