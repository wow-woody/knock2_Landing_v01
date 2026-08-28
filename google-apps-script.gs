const SPREADSHEET_ID = '1QwhPEF5vb5rEoyZffDXEXLG1G78L5kIWe4-UBHmg7NI';
const RECENT_APPLICANTS_CACHE_KEY = 'recent_applicants';
const RECENT_APPLICANTS_CACHE_TTL_SECONDS = 60;
// 같은 IP가 이 시간(초) 이내에 재신청하면 막는다
const RATE_LIMIT_SECONDS = 300;
// 정상 저장(락 실패, 시트 없음, 기타 에러)에 실패했을 때 신청 데이터를 잃지 않도록 백업해두는 시트
const FALLBACK_SHEET_NAME = 'DB로스';
// 상담유형(국산 정품 임플란트/오스템 임플란트/전체 임플란트)과 상관없이 모든 신청을 한곳에 모아두는 시트
const INTEGRATED_SHEET_NAME = '통합';

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
        sheet.appendRow(['번호', '신청시간', '이름', '연락처', '상담유형', '유실사유']);
    }

    return sheet;
}

function getOrCreateIntegratedSheet(spreadsheet) {
    let sheet = spreadsheet.getSheetByName(INTEGRATED_SHEET_NAME);

    if (!sheet) {
        sheet = spreadsheet.insertSheet(INTEGRATED_SHEET_NAME);
    }

    if (sheet.getLastRow() === 0) {
        sheet.appendRow(['번호', '신청시간', '이름', '연락처', '상담유형']);
    }

    return sheet;
}

// 정상 저장 경로가 실패했을 때 최후의 수단으로 호출. 이 함수마저 실패하면 콘솔 로그만 남기고 넘어간다.
function logToFallbackSheet(spreadsheet, name, phone, selectedType, reason) {
    try {
        const fallbackSheet = getOrCreateFallbackSheet(spreadsheet);
        const number = fallbackSheet.getLastRow();
        fallbackSheet.appendRow([number, new Date(), name, phone, selectedType, reason]);
        // 전화번호 칸이 '자동' 서식이면 010으로 시작하는 숫자만 있는 값이 숫자로 인식되어 앞자리 0이 사라지므로, 쓴 직후 텍스트 서식으로 다시 고정해 덮어쓴다
        fallbackSheet.getRange(fallbackSheet.getLastRow(), 4).setNumberFormat('@').setValue(phone);
    } catch (fallbackError) {
        console.error('fallback_log_error', fallbackError);
    }
}

function doPost(e) {
    const data = parseRequestData(e);
    const name = String(data.name || '').trim();
    const phone = String(data.phone || '').trim();
    const selectedType = String(data.selectedType || '').trim() || '국산 정품 임플란트';
    const clientIp = String(data.ip || '').trim();
    // 임시 테스트 신호: 프론트엔드 테스트 버튼이 켜면 실제 상담유형은 그대로 두고 저장만 강제로 실패시킨다. 테스트 끝나면 이 필드 관련 코드 전부 삭제할 것
    const forceFail = String(data.forceFail || '') === '1';

    // 같은 IP는 RATE_LIMIT_SECONDS 이내 재신청 차단 (클라이언트가 보낸 IP라 완전한 서버 검증은 아니고 연타 방지 목적)
    if (clientIp) {
        const rateLimitCache = CacheService.getScriptCache();
        const rateLimitKey = 'submit_ip_' + clientIp;

        if (rateLimitCache.get(rateLimitKey)) {
            return ContentService.createTextOutput('rate_limited');
        }

        rateLimitCache.put(rateLimitKey, '1', RATE_LIMIT_SECONDS);
    }

    const lock = LockService.getScriptLock();
    const lockAcquired = lock.tryLock(30000);

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
                'sheet_not_found: requested="' +
                    selectedType +
                    '" available=' +
                    JSON.stringify(availableSheetNames),
            );
        }

        if (sheet.getLastRow() === 0) {
            sheet.appendRow(['번호', '신청시간', '이름', '연락처', '상담유형']);
        }

        const now = new Date();
        const number = sheet.getLastRow();
        sheet.appendRow([number, now, name, phone, selectedType]);
        // 전화번호 칸이 '자동' 서식이면 010으로 시작하는 숫자만 있는 값이 숫자로 인식되어 앞자리 0이 사라지므로, 쓴 직후 텍스트 서식으로 다시 고정해 덮어쓴다
        sheet.getRange(sheet.getLastRow(), 4).setNumberFormat('@').setValue(phone);

        const integratedSheet = getOrCreateIntegratedSheet(spreadsheet);
        const integratedNumber = integratedSheet.getLastRow();
        integratedSheet.appendRow([integratedNumber, now, name, phone, selectedType]);
        integratedSheet
            .getRange(integratedSheet.getLastRow(), 4)
            .setNumberFormat('@')
            .setValue(phone);

        CacheService.getScriptCache().remove(RECENT_APPLICANTS_CACHE_KEY);

        return ContentService.createTextOutput('success');
    } catch (error) {
        console.error('submit_error', error);
        // 예상치 못한 에러로 정상 저장이 실패해도 신청 데이터는 DB로스 시트에 남긴다
        if (name && phone) {
            try {
                const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
                logToFallbackSheet(
                    spreadsheet,
                    name,
                    phone,
                    selectedType,
                    'error: ' + error.message,
                );
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
        // DB로스 시트는 유실 백업용, 통합 시트는 다른 시트와 데이터가 중복되므로 신청 목록 화면에는 노출하지 않는다
        if (sheet.getName() === FALLBACK_SHEET_NAME || sheet.getName() === INTEGRATED_SHEET_NAME) {
            return;
        }

        const lastRow = sheet.getLastRow();
        if (lastRow < 2) {
            return;
        }

        const numRows = Math.min(lastRow - 1, maxItemsPerSheet);
        const startRow = lastRow - numRows + 1;
        const values = sheet.getRange(startRow, 1, numRows, 5).getValues();

        values.forEach((row) => {
            items.push({
                timestamp: row[1] instanceof Date ? row[1].toISOString() : String(row[1] || ''),
                name: String(row[2] || ''),
                phone: String(row[3] || ''),
                type: String(row[4] || sheet.getName()),
            });
        });
    });

    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    items = items.slice(0, 20);

    const payload = JSON.stringify({ items: items });
    cache.put(RECENT_APPLICANTS_CACHE_KEY, payload, RECENT_APPLICANTS_CACHE_TTL_SECONDS);

    return ContentService.createTextOutput(payload).setMimeType(ContentService.MimeType.JSON);
}
