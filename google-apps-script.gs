const SPREADSHEET_ID = '1QwhPEF5vb5rEoyZffDXEXLG1G78L5kIWe4-UBHmg7NI';
const RECENT_APPLICANTS_CACHE_KEY = 'recent_applicants';
const RECENT_APPLICANTS_CACHE_TTL_SECONDS = 60;
// 정상 저장(락 실패, 시트 없음, 기타 에러)에 실패했을 때 신청 데이터를 잃지 않도록 백업해두는 시트
const FALLBACK_SHEET_NAME = 'DB로스';

function parseRequestData(e) {
    const parameterData = e && e.parameter ? e.parameter : {};
    const merged = {};

    Object.keys(parameterData).forEach((key) => {
        const value = parameterData[key];
        merged[key] = Array.isArray(value) ? value.join(',') : String(value || '');
    });

    return merged;
}

function getOrCreateFallbackSheet(spreadsheet) {
    let sheet = spreadsheet.getSheetByName(FALLBACK_SHEET_NAME);

    if (!sheet) {
        sheet = spreadsheet.insertSheet(FALLBACK_SHEET_NAME);
    }

    if (sheet.getLastRow() === 0) {
        sheet.appendRow(['timestamp', 'name', 'phone', '상담유형', '유실사유']);
    }

    return sheet;
}

// 정상 저장 경로가 실패했을 때 최후의 수단으로 호출. 이 함수마저 실패하면 콘솔 로그만 남기고 넘어간다.
function logToFallbackSheet(spreadsheet, name, phone, selectedType, reason) {
    try {
        const fallbackSheet = getOrCreateFallbackSheet(spreadsheet);
        fallbackSheet.appendRow([new Date(), name, phone, selectedType, reason]);
    } catch (fallbackError) {
        console.error('fallback_log_error', fallbackError);
    }
}

function doPost(e) {
    const lock = LockService.getScriptLock();
    const lockAcquired = lock.tryLock(30000);

    const data = parseRequestData(e);
    const name = String(data.name || '').trim();
    const phone = String(data.phone || '').trim();
    const selectedType = String(data.selectedType || '').trim() || '국산 정품 임플란트';
    // 임시 테스트 신호: 프론트엔드 테스트 버튼이 켜면 실제 상담유형은 그대로 두고 저장만 강제로 실패시킨다. 테스트 끝나면 이 필드 관련 코드 전부 삭제할 것
    const forceFail = String(data.forceFail || '') === '1';

    if (!lockAcquired) {
        // 락을 못 잡아 정상 저장 경로를 탈 수 없는 경우에도 신청 데이터 자체는 잃지 않도록 백업
        if (name && phone) {
            try {
                const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
                logToFallbackSheet(spreadsheet, name, phone, selectedType, 'lock_failed');
            } catch (openError) {
                console.error('lock_failed_fallback_error', openError);
            }
        }
        return ContentService.createTextOutput('lock_failed');
    }

    try {
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

        const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);

        if (forceFail) {
            // 실제 선택한 상담유형(selectedType)은 그대로 두고 정상 저장만 건너뛰어 유실 상황을 재현한다
            logToFallbackSheet(spreadsheet, name, phone, selectedType, 'test_forced_failure');
            return ContentService.createTextOutput('test_forced_failure');
        }

        const sheet = spreadsheet.getSheetByName(selectedType);

        if (!sheet) {
            const availableSheetNames = spreadsheet.getSheets().map((s) => s.getName());
            console.error('sheet_not_found', selectedType, availableSheetNames);
            // 상담 유형에 맞는 시트 탭이 없어도 신청 데이터는 DB로스 시트에 남겨 유실을 막는다
            logToFallbackSheet(spreadsheet, name, phone, selectedType, 'sheet_not_found');
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
        // 예상치 못한 에러로 정상 저장이 실패해도 신청 데이터는 DB로스 시트에 남긴다
        if (name && phone) {
            try {
                const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
                logToFallbackSheet(spreadsheet, name, phone, selectedType, 'error: ' + error.message);
            } catch (openError) {
                console.error('fallback_open_error', openError);
            }
        }
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
        // DB로스 시트는 유실 백업용이라 신청 목록 화면에는 노출하지 않는다
        if (sheet.getName() === FALLBACK_SHEET_NAME) {
            return;
        }

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
