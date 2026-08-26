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
const countdownTimerEl = document.querySelector('#countdown-timer');

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

function formatPhoneInput(value) {
    const digits = value.replace(/[^0-9]/g, '').slice(0, 11);

    if (digits.length < 4) {
        return digits;
    }

    if (digits.length < 8) {
        return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }

    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

if (phoneInput) {
    phoneInput.addEventListener('input', () => {
        phoneInput.value = formatPhoneInput(phoneInput.value);
    });
}

function normalizePhone(value) {
    return value.replace(/[^0-9]/g, '');
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

        showModal({
            icon: '✅',
            title: '상담 신청이 완료되었습니다!',
            message: '빠른 시간 안에 상담원이 연락드리겠습니다.',
        });
    });
}