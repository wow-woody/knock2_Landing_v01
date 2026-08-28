const form = document.querySelector('#consult-form');
const submitFrame = document.querySelector('iframe[name="submit-frame"]');
const submitButton = form ? form.querySelector('button[type="submit"]') : null;
const selectedTypeInput = document.querySelector('#selected-type');
const choiceInputs = document.querySelectorAll('input[name="choice"]');
const consultationList = document.querySelector('#consultation-list');
const consultationListEmpty = document.querySelector('#consultation-list-empty');
const API_URL = form ? form.getAttribute('action') : '';
const CONSULTATION_CACHE_KEY = 'consultationListCache';
const phoneInput = document.querySelector('input[name="phone"]');
const nameInput = document.querySelector('input[name="name"]');
const countdownTimerEl = document.querySelector('#countdown-timer');
const clientIpInput = document.querySelector('#client-ip');

// 서버에서 같은 IP의 5분 이내 재신청을 막을 수 있도록 공인 IP를 미리 조회해둔다
if (clientIpInput) {
    fetch('https://api.ipify.org?format=json')
        .then((response) => response.json())
        .then((data) => {
            clientIpInput.value = data.ip || '';
        })
        .catch(() => {
            // 조회 실패 시 빈 값으로 두면 서버는 해당 신청에 IP 제한을 적용하지 않는다
        });
}

// ==== 이름 인풋 금지 단어 목록 (여기에 단어를 추가/삭제하세요) ====
// 짧고 애매한 글자(정상 이름에도 들어갈 수 있는 글자)는 이름 전체와 정확히 같을 때만 차단
const FORBIDDEN_NAME_EXACT_WORDS = [
    '개',
    '돌',
    '좆',
    '좃',
    '샹',
];

// 명확한 욕설/조합 단어는 이름에 포함되어 있으면 차단
const FORBIDDEN_NAME_WORDS = [
    '시발',
    'ㅅㅂ',
    'ㅂㅅ',
    'ㅄ',
    '병신',
    '시브랄',
    '살인자',
    '돌팔이',
    '돌아이',
    '미친',
    '미친놈',
    '미친년',
    '개새',
    '개새끼',
    '사기',
    '사기꾼',
    '돌팔',
    '썅놈',
    '싸가지',
    '좆까',
];

function containsForbiddenWord(value) {
    const normalized = String(value || '').trim().toLowerCase();
    const isExactMatch = FORBIDDEN_NAME_EXACT_WORDS.some((word) => word && normalized === word.toLowerCase());
    const isSubstringMatch = FORBIDDEN_NAME_WORDS.some((word) => word && normalized.includes(word.toLowerCase()));
    return isExactMatch || isSubstringMatch;
}

// 매주 일요일 23:59:59 마감, 월요일 자동 재시작
function getWeeklyDeadline() {
    const now = new Date();
    const day = now.getDay(); // 0=일, 1=월 ... 6=토
    const daysUntilSunday = day === 0 ? 0 : 7 - day;
    const deadline = new Date(now);
    deadline.setDate(now.getDate() + daysUntilSunday);
    deadline.setHours(23, 59, 59, 0);
    return deadline;
}

function updateCountdown() {
    if (!countdownTimerEl) {
        return;
    }

    const diff = getWeeklyDeadline().getTime() - Date.now();

    if (diff <= 0) {
        countdownTimerEl.textContent = '00:00:00';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');
    const dayText = days > 0 ? `${days}일 ` : '';
    countdownTimerEl.textContent = `${dayText}${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

if (countdownTimerEl) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// 허용하는 지역번호/통신사 번호 (앞 2~3자리)
const ALLOWED_PHONE_PREFIXES = [
    '02',
    '031', '032', '033',
    '041', '042', '043', '044',
    '051', '052', '054', '055',
    '061', '062', '063', '064',
    '010',
];

function isAllowedPhonePrefix(prefixDigits) {
    return ALLOWED_PHONE_PREFIXES.some(
        (code) => code.startsWith(prefixDigits) || prefixDigits.startsWith(code),
    );
}

function formatPhoneInput(value) {
    const rawDigits = value.replace(/[^0-9]/g, '').slice(0, 11);
    let digits = '';

    for (const digit of rawDigits) {
        if (digits.length < 3 && !isAllowedPhonePrefix(digits + digit)) {
            break;
        }
        digits += digit;
    }

    // 서울(02)은 지역번호가 2자리라 나머지 지역번호/휴대폰(3자리)와 분리해서 처리
    const isSeoul = digits.startsWith('02');
    const prefixLength = isSeoul ? 2 : 3;
    digits = isSeoul ? digits.slice(0, 10) : digits;

    if (digits.length <= prefixLength) {
        return digits;
    }

    if (digits.length <= prefixLength + 4) {
        return `${digits.slice(0, prefixLength)}-${digits.slice(prefixLength)}`;
    }

    return `${digits.slice(0, prefixLength)}-${digits.slice(prefixLength, prefixLength + 4)}-${digits.slice(prefixLength + 4)}`;
}

if (phoneInput) {
    phoneInput.addEventListener('input', () => {
        phoneInput.value = formatPhoneInput(phoneInput.value);
    });
}

if (nameInput) {
    nameInput.addEventListener('input', () => {
        nameInput.value = nameInput.value.replace(/[0-9]/g, '');
    });
}

function normalizePhone(value) {
    return value.replace(/[^0-9]/g, '');
}

// 장난번호(예: 010-4444-4444, 010-1234-5678) 차단
function isSuspiciousPhoneNumber(phone) {
    if (phone.length < 8) {
        return false;
    }

    const last8 = phone.slice(-8);
    const firstHalf = last8.slice(0, 4);
    const secondHalf = last8.slice(4);

    // 뒤 4자리가 그대로 반복되는 패턴 (4444-4444, 1234-1234 등)
    if (firstHalf === secondHalf) {
        return true;
    }

    // 순차 증가/감소 패턴 (1234-5678, 8765-4321 등)
    const SEQUENTIAL_PATTERNS = [
        '01234567', '12345678', '23456789',
        '98765432', '87654321', '76543210',
    ];

    return SEQUENTIAL_PATTERNS.includes(last8);
}

function syncSelectedType() {
    if (!selectedTypeInput) {
        return;
    }

    const checkedChoice = document.querySelector('input[name="choice"]:checked');
    selectedTypeInput.value = checkedChoice ? checkedChoice.value : '국산 정품 임플란트';
}

function maskName(value) {
    const name = String(value || '').trim();

    if (name.length <= 1) {
        return name;
    }

    if (name.length === 2) {
        return `${name[0]}*`;
    }

    return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}`;
}

function maskPhone(value) {
    const digits = String(value || '').replace(/[^0-9]/g, '');

    if (digits.length < 8) {
        return digits;
    }

    return `${digits.slice(0, 3)}-****-${digits.slice(-4)}`;
}

function formatTimestamp(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value || '');
    }

    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function buildApplicantRow(item) {
    const row = document.createElement('div');
    row.className = 'recent-applicants-row';

    const dateCell = document.createElement('div');
    dateCell.textContent = formatTimestamp(item.timestamp);

    const nameCell = document.createElement('div');
    nameCell.textContent = maskName(item.name);

    const phoneCell = document.createElement('div');
    phoneCell.textContent = maskPhone(item.phone);

    row.append(dateCell, nameCell, phoneCell);
    return row;
}

let rollTimer = null;

function startApplicantRoll(items) {
    if (rollTimer) {
        clearInterval(rollTimer);
        rollTimer = null;
    }

    if (!consultationList) {
        return;
    }

    consultationList.innerHTML = '';
    consultationList.classList.remove('is-rolling');
    consultationList.style.transform = 'translateY(0)';

    if (consultationListEmpty) {
        consultationListEmpty.hidden = items.length > 0;
    }

    if (items.length === 0) {
        return;
    }

    let index = 0;
    const nextItem = () => {
        const item = items[index % items.length];
        index += 1;
        return item;
    };

    // 화면에 보이는 4줄 + 여유분
    for (let i = 0; i < 6; i += 1) {
        consultationList.appendChild(buildApplicantRow(nextItem()));
    }

    if (items.length <= 1) {
        return;
    }

    let paused = false;
    const viewportEl = consultationList.parentElement;

    if (viewportEl) {
        viewportEl.addEventListener('mouseenter', () => {
            paused = true;
        });
        viewportEl.addEventListener('mouseleave', () => {
            paused = false;
        });
    }

    let rolling = false;

    rollTimer = setInterval(() => {
        if (rolling || paused) {
            return;
        }

        const firstRow = consultationList.firstElementChild;
        const rowHeight = firstRow ? firstRow.getBoundingClientRect().height : 0;

        if (!rowHeight) {
            return;
        }

        rolling = true;
        consultationList.appendChild(buildApplicantRow(nextItem()));
        consultationList.classList.add('is-rolling');
        void consultationList.offsetHeight; // 강제 리플로우: 트랜지션이 확실히 새 transform 값을 감지하게 함
        consultationList.style.transform = `translateY(-${rowHeight}px)`;

        setTimeout(() => {
            if (consultationList.firstElementChild) {
                consultationList.firstElementChild.remove();
            }

            consultationList.classList.remove('is-rolling');
            consultationList.style.transform = 'translateY(0)';
            rolling = false;
        }, 500);
    }, 1500);
}

function readCachedConsultationList() {
    try {
        const cached = sessionStorage.getItem(CONSULTATION_CACHE_KEY);
        const items = cached ? JSON.parse(cached) : null;
        return Array.isArray(items) ? items : null;
    } catch (error) {
        return null;
    }
}

function writeCachedConsultationList(items) {
    try {
        sessionStorage.setItem(CONSULTATION_CACHE_KEY, JSON.stringify(items));
    } catch (error) {
        // 저장 실패는 무시 (프라이빗 브라우징 등)
    }
}

async function loadConsultationList() {
    if (!consultationList || !API_URL) {
        return;
    }

    // 직전에 불러온 목록이 있으면 fetch 응답을 기다리지 않고 즉시 먼저 보여준다.
    const cachedItems = readCachedConsultationList();
    if (cachedItems) {
        startApplicantRoll(cachedItems);
    }

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const items = Array.isArray(data.items) ? data.items : [];
        writeCachedConsultationList(items);
        startApplicantRoll(items);
    } catch (error) {
        console.error('load_consultation_list_error', error);
    }
}

const appModal = document.querySelector('#app-modal');
const appModalIcon = document.querySelector('#app-modal-icon');
const appModalTitle = document.querySelector('#app-modal-title');
const appModalMessage = document.querySelector('#app-modal-message');
const appModalConfirm = document.querySelector('#app-modal-confirm');

function showModal({ icon, title, message, tone = 'default' }) {
    if (!appModal) {
        return;
    }

    if (appModalIcon) {
        appModalIcon.textContent = icon;
        appModalIcon.classList.toggle('modal-icon--warning', tone === 'warning');
    }

    if (appModalTitle) {
        appModalTitle.textContent = title;
    }

    if (appModalMessage) {
        appModalMessage.textContent = message;
    }

    appModal.hidden = false;
}

function hideModal() {
    if (!appModal) {
        return;
    }

    appModal.hidden = true;
}

if (appModalConfirm) {
    appModalConfirm.addEventListener('click', hideModal);
}

if (appModal) {
    appModal.addEventListener('click', (event) => {
        if (event.target === appModal) {
            hideModal();
        }
    });
}

let waitingForResponse = false;

function submitConsultForm(event) {
    if (waitingForResponse) {
        event.preventDefault();
        return;
    }

    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const phone = normalizePhone(String(formData.get('phone') || '').trim());
    const agree = formData.get('agree') === 'on';
    const selectedType = String((selectedTypeInput && selectedTypeInput.value) || '').trim() || '국산 정품 임플란트';

    formData.set('selectedType', selectedType);
    formData.set('phone', phone);

    if (!name || !phone) {
        showModal({
            icon: '⚠️',
            title: '입력값을 확인해주세요',
            message: '이름과 연락처를 입력해주세요.',
            tone: 'warning',
        });
        return;
    }

    if (isSuspiciousPhoneNumber(phone)) {
        showModal({
            icon: '⚠️',
            title: '연락처를 확인해주세요',
            message: '올바른 연락처를 입력해주세요.',
            tone: 'warning',
        });
        event.preventDefault();
        return;
    }

    if (containsForbiddenWord(name)) {
        showModal({
            icon: '⚠️',
            title: '이름을 확인해주세요',
            message: '이름에 사용할 수 없는 단어가 포함되어 있습니다.',
            tone: 'warning',
        });
        event.preventDefault();
        return;
    }

    if (!agree) {
        showModal({
            icon: '⚠️',
            title: '약관 동의가 필요해요',
            message: '개인정보 수집 및 이용에 동의해주세요.',
            tone: 'warning',
        });
        event.preventDefault();
        return;
    }

    waitingForResponse = true;
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = '전송 중...';
    }
}

choiceInputs.forEach((choiceInput) => {
    choiceInput.addEventListener('change', syncSelectedType);
});

syncSelectedType();
loadConsultationList();

if (form) {
    form.addEventListener('submit', submitConsultForm);
}

if (submitFrame) {
    submitFrame.addEventListener('load', () => {
        if (!waitingForResponse) {
            return;
        }

        waitingForResponse = false;
        form.reset();
        syncSelectedType();
        loadConsultationList();

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = '상담 신청하기';
        }

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'form_submit_success' });

        showModal({
            icon: '✅',
            title: '상담 신청이 완료되었습니다!',
            message: '빠른 시간 안에 상담원이 연락드리겠습니다.',
        });
    });
}

// 임시 테스트 코드: DB로스 유실 테스트용. 테스트 끝나면 이 블록과 counsel.html의 #debug-force-fail-btn, #force-fail-flag 삭제할 것
const debugForceFailBtn = document.querySelector('#debug-force-fail-btn');
const forceFailFlagInput = document.querySelector('#force-fail-flag');

if (debugForceFailBtn && new URLSearchParams(window.location.search).get('test') === '1') {
    debugForceFailBtn.style.display = 'inline-flex';

    debugForceFailBtn.addEventListener('click', () => {
        // 실제 선택한 상담유형(selectedType)은 건드리지 않고, 저장만 강제로 실패시키는 신호만 켠다
        if (forceFailFlagInput) {
            forceFailFlagInput.value = '1';
        }

        debugForceFailBtn.textContent = '✅ 실패 강제 적용됨 (이제 신청하기 누르세요)';
    });
}