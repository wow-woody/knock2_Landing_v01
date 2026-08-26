const SPREADSHEET_ID = '1QwhPEF5vb5rEoyZffDXEXLG1G78L5kIWe4-UBHmg7NI';
const RECENT_APPLICANTS_CACHE_KEY = 'recent_applicants';
const RECENT_APPLICANTS_CACHE_TTL_SECONDS = 60;

function parseRequestData(e) {
    const parameterData = e && e.parameter ? e.parameter : {};
    const merged = {};

    Object.keys(parameterData).forEach((key) => {
        const value = parameterData[key];
        merged[key] = Array.isArray(value) ? value.join(',') : String(value || '');
    });

    return merged;
}

function doPost(e) {
    const lock = LockService.getScriptLock();
    const lockAcquired = lock.tryLock(30000);

    if (!lockAcquired) {
        return ContentService.createTextOutput('lock_failed');
    }

    try {
        const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);

        const data = parseRequestData(e);
        const name = String(data.name || '').trim();
        const phone = String(data.phone || '').trim();
        const selectedType = String(data.selectedType || '').trim() || '국산 정품 임플란트';

        if (!name || !phone) {
            console.log(
                'missing_fields',
                JSON.stringify({
                    parameter: data,
                    postData: e && e.postData ? e.postData.contents : '',
                }),
            );
            return ContentService.createTextOutput('missing_fields');
        }

        const sheet = spreadsheet.getSheetByName(selectedType);

        if (!sheet) {
            const availableSheetNames = spreadsheet.getSheets().map((s) => s.getName());
            console.error('sheet_not_found', selectedType, availableSheetNames);
            return ContentService.createTextOutput(
                'sheet_not_found: requested="' + selectedType + '" available=' + JSON.stringify(availableSheetNames),
            );
        }

        if (sheet.getLastRow() === 0) {
            sheet.appendRow(['timestamp', 'name', 'phone']);
        }

        sheet.appendRow([new Date(), name, phone]);
        CacheService.getScriptCache().remove(RECENT_APPLICANTS_CACHE_KEY);

        return ContentService.createTextOutput('success');
    } catch (error) {
        console.error('submit_error', error);
        return ContentService.createTextOutput('error');
    } finally {
        if (lockAcquired) {
            lock.releaseLock();
        }
    }
}

function doGet() {
    const cache = CacheService.getScriptCache();
    const cached = cache.get(RECENT_APPLICANTS_CACHE_KEY);

    if (cached) {
        return ContentService.createTextOutput(cached).setMimeType(ContentService.MimeType.JSON);
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheets = spreadsheet.getSheets();
    const maxItemsPerSheet = 20;

    let items = [];

    sheets.forEach((sheet) => {
        const lastRow = sheet.getLastRow();
        if (lastRow < 2) {
            return;
        }

        const numRows = Math.min(lastRow - 1, maxItemsPerSheet);
        const startRow = lastRow - numRows + 1;
        const values = sheet.getRange(startRow, 1, numRows, 3).getValues();

        values.forEach((row) => {
            items.push({
                timestamp: row[0] instanceof Date ? row[0].toISOString() : String(row[0] || ''),
                name: String(row[1] || ''),
                phone: String(row[2] || ''),
                type: sheet.getName(),
            });
        });
    });

    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    items = items.slice(0, 20);

    const payload = JSON.stringify({ items: items });
    cache.put(RECENT_APPLICANTS_CACHE_KEY, payload, RECENT_APPLICANTS_CACHE_TTL_SECONDS);

    return ContentService.createTextOutput(payload).setMimeType(ContentService.MimeType.JSON);
}
