# Google Sheets Setup

To connect your application form to Google Sheets, follow these steps:

## 1. Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it "01X Applications" (or whatever you prefer)
3. Add these headers in Row 1:

```
A: timestamp
B: fullName
C: email
D: location
E: linkedinUrl
F: whatBuilding
G: whyMatters
H: currentApproach
I: problemSolved
J: currentStage
K: productLink
L: hasCofounder
M: openToConnect
N: background
O: primarySkill
P: superpower
Q: hoursPerWeek
R: investmentRange
S: primaryGoal
T: successLooksLike
U: wantsMentors
V: triedBefore
W: whatHappened
X: biggestBlocker
Y: heardFrom
Z: whyNow
AA: readyToCommit
AB: comfortablePublic
AC: willingToHelp
AD: biggestFear
AE: specificHelp
```

## 2. Create the Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete the default code and paste this:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Define column order (must match headers)
    const columns = [
      'timestamp', 'fullName', 'email', 'location', 'linkedinUrl',
      'whatBuilding', 'whyMatters', 'currentApproach', 'problemSolved',
      'currentStage', 'productLink', 'hasCofounder', 'openToConnect',
      'background', 'primarySkill', 'superpower', 'hoursPerWeek',
      'investmentRange', 'primaryGoal', 'successLooksLike', 'wantsMentors',
      'triedBefore', 'whatHappened', 'biggestBlocker', 'heardFrom',
      'whyNow', 'readyToCommit', 'comfortablePublic', 'willingToHelp',
      'biggestFear', 'specificHelp'
    ];
    
    // Create row in correct order
    const row = columns.map(col => data[col] || '');
    
    // Append to sheet
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Save** (💾 icon)
4. Name the project "01X Form Handler"

## 3. Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙️ → Select **Web app**
3. Set:
   - **Description**: "Application form handler"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Authorize** when prompted (click through the warnings)
6. **Copy the Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

## 4. Add to Environment

Create or update `.env.local` in your project root:

```bash
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

Replace `YOUR_SCRIPT_ID` with your actual script URL.

## 5. Restart Dev Server

```bash
# Stop the current server (Ctrl+C) then:
npm run dev
```

## Testing

1. Submit a test application at `/apply`
2. Check your Google Sheet — a new row should appear!

## Troubleshooting

- **No data appearing?** Check the browser console for errors
- **CORS issues?** Apps Script deployed as "Anyone" should work
- **Authorization errors?** Re-deploy the script after authorizing
