<!DOCTYPE html>
<html lang="ko">

<head>
    <!-- Google Tag Manager -->
    <script>
        (function(w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
            });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src =
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-XXXXXXX');
    </script>
    <!-- End Google Tag Manager -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* ==== css/reset.css ==== */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        ol,
        ul {
            list-style: none;
        }

        a {
            text-decoration: none;
            color: inherit;
        }

        img {
            vertical-align: top;
            max-width: 100%;
        }

        table {
            border-collapse: collapse;
            border-spacing: 0;
        }

        /* ==== css/index.css ==== */
        .container {
            width: auto;
            height: 100vh;
            margin: 0 auto;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .main_img {
            width: auto;
            height: 100vh;
            position: relative;
        }

        .main_img p img {
            height: 100vh;
            width: auto;
            max-width: 100vw;
        }

        .main_img>a {
            position: absolute;
            left: 50%;
            bottom: 55px;
            transform: translateX(-50%);

            width: 90%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px 0;
            background: #ffffff;
            color: #000000;
            font-weight: 700;
            border-radius: 16px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
            font-size: 18px;
            overflow: hidden;
        }

        .main_img>a:hover {
            background: #fff8f2;
            color: #1147ad;
        }

        .main_img>a::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 80%;
            height: 100%;
            background: linear-gradient(105deg,
                    transparent 0%,
                    rgba(17, 71, 173, 0) 25%,
                    rgba(17, 71, 173, 0.16) 50%,
                    rgba(17, 71, 173, 0) 75%,
                    transparent 100%);
            animation: main-btn-shine 5s ease-in-out infinite;
        }

        @keyframes main-btn-shine {
            0% {
                left: -100%;
            }

            60%,
            100% {
                left: 125%;
            }
        }

        /* ==== css/counsel.css ==== */
        @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap');

        :root {
            --bg: #f4f8ff;
            --surface: #ffffff;
            --surface-soft: #e9f1ff;
            --text: #1a1d29;
            --muted: #6b7280;
            --primary: #3182f6;
            --primary-strong: #1b64da;
            --line: #dde6f7;
            --shadow: 0 18px 45px rgba(49, 130, 246, 0.14);
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            margin: 0;
            font-family: 'Pretendard', sans-serif;
            color: var(--text);
            background:
                radial-gradient(circle at top left, rgba(49, 130, 246, 0.16), transparent 28%),
                radial-gradient(circle at right top, rgba(130, 190, 255, 0.28), transparent 22%), var(--bg);
        }

        input,
        button,
        select,
        textarea {
            font: inherit;
        }

        .choice-switch {
            position: absolute;
            opacity: 0;
            pointer-events: none;
        }

        .page {
            position: relative;
            width: min(100%, 780px);
            margin: 0 auto;
            padding: 28px 20px 52px;
        }

        .countdown-wrap {
            display: flex;
            align-items: center;
            gap: 6px;
            width: fit-content;
            margin: 0 auto;
            background: #fff3cd;
            color: var(--primary-strong);
            font-size: 0.82rem;
            font-weight: 600;
            padding: 7px 16px;
            border-radius: 999px;
        }

        .countdown-timer {
            font-size: 0.88rem;
            font-weight: 800;
            color: #e63946;
            letter-spacing: 0.5px;
        }

        .back-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            width: fit-content;
            height: 44px;
            margin-left: max(0px, calc((100% - 530.234px) / 2));
            margin-bottom: 16px;
            padding: 0 18px 0 14px;
            border: 1px solid var(--line);
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.95);
            color: var(--text);
            font-size: 0.92rem;
            font-weight: 700;
            box-shadow: 0 10px 22px rgba(26, 29, 41, 0.06);
            text-decoration: none;
            transition:
                transform 0.2s ease,
                border-color 0.2s ease,
                box-shadow 0.2s ease;
        }

        .back-btn svg {
            width: 20px;
            height: 20px;
            fill: none;
            stroke: currentColor;
            stroke-width: 2.5;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        .back-btn:hover {
            transform: translateY(-1px);
            border-color: var(--primary);
            box-shadow: 0 12px 24px rgba(49, 130, 246, 0.12);
        }

        .hero,
        .form-section {
            position: relative;
            display: grid;
            gap: 18px;
            width: 530.234px;
            max-width: 100%;
            margin-left: auto;
            margin-right: auto;
            padding: 24px;
            border: 1px solid var(--line);
            border-radius: 28px;
            background: rgba(255, 255, 255, 0.92);
            box-shadow: var(--shadow);
            box-sizing: border-box;
        }

        .hero,
        .form-section {
            margin-bottom: 18px;
        }

        .hero__top {
            display: grid;
            gap: 10px;
            text-align: center;
        }

        .eyebrow {
            display: inline-flex;
            width: fit-content;
            margin: 0;
            padding: 8px 12px;
            border-radius: 999px;
            background: var(--surface-soft);
            color: var(--primary-strong);
            font-size: 0.95rem;
            font-weight: 700;
        }

        .form-section .eyebrow {
            display: flex;
            align-items: center;
            gap: 6px;
            margin: 0 auto;
            background: #fff3cd;
            color: var(--primary-strong);
            font-size: 0.82rem;
            font-weight: 600;
            padding: 7px 16px;
            border-radius: 999px;
        }

        .hero__title {
            margin: 0;
            font-weight: 600;
            letter-spacing: -0.04em;
            line-height: 1.15;
            color: var(--primary);
        }

        .section-heading h2 {
            margin: 0;
            font-weight: 600;
            letter-spacing: -0.04em;
            line-height: 1.15;
            color: var(--primary);
        }

        .hero__title--default,
        .hero__title--korean,
        .hero__title--osstem,
        .hero__title--full {
            display: none;
            font-size: 2.1rem;
        }

        .hero__desc {
            margin: 0;
            color: var(--muted);
            line-height: 1.7;
        }

        .hero__desc--default,
        .hero__desc--korean,
        .hero__desc--osstem,
        .hero__desc--full {
            display: none;

        }

        .choice-list {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
        }

        .choice-card {
            display: grid;
            text-align: center;
            gap: 4px;
            padding: 18px;
            border: 1px solid var(--line);
            border-radius: 20px;
            background: #fff;
            cursor: pointer;
            transition:
                border-color 0.2s ease,
                transform 0.2s ease,
                box-shadow 0.2s ease;
        }

        .choice-card:hover {
            transform: translateY(-1px);
            box-shadow: 0 10px 20px rgba(26, 29, 41, 0.06);
        }

        .choice-card__title {
            font-size: 0.88rem;
            font-weight: 800;
        }

        .choice-card__text {
            color: var(--muted);
            line-height: 1.6;
            font-size: 0.88rem;
        }

        .section-heading {
            display: grid;
            gap: 8px;
            text-align: center;
        }

        .section-heading h2 {
            font-size: 2.1rem;
        }

        .section-heading p {
            margin: 0;
            color: var(--muted);
            line-height: 1.7;
        }

        .consult-form {
            display: grid;
            gap: 16px;
        }

        .field,
        .check-field {
            display: grid;
            gap: 8px;
        }

        .field span,
        .check-field span {
            font-size: 0.98rem;
            font-weight: 700;
        }

        .field input {
            width: 100%;
            min-height: 54px;
            padding: 0 16px;
            border: 1px solid var(--line);
            border-radius: 16px;
            background: #fff;
            color: var(--text);
            outline: none;
            transition:
                border-color 0.2s ease,
                box-shadow 0.2s ease;
        }

        .field input:focus {
            border-color: rgba(49, 130, 246, 0.75);
            box-shadow: 0 0 0 4px rgba(49, 130, 246, 0.12);
        }

        .field input::placeholder {
            color: #b5bcc9;
        }

        .input-icon {
            position: relative;
        }

        .input-icon__svg {
            position: absolute;
            top: 50%;
            left: 16px;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            fill: none;
            stroke: #b5bcc9;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            pointer-events: none;
        }

        .input-icon input {
            padding-left: 46px;
        }

        .check-field {
            grid-template-columns: 18px 1fr;
            align-items: start;
            gap: 10px;
            padding-top: 6px;
            color: var(--text);
        }

        .check-field input {
            width: 18px;
            height: 18px;
            margin-top: 2px;
            accent-color: var(--primary);
        }

        .agree-detail-link {
            margin-left: 4px;
            color: var(--muted);
            font-weight: 400;
            text-decoration: underline;
        }

        .agree-detail-link:hover {
            color: var(--primary);
        }

        .btn {
            position: relative;
            overflow: hidden;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            min-height: 56px;
            border: 0;
            border-radius: 16px;
            background: linear-gradient(135deg, var(--primary) 0%, #60a5fa 100%);
            color: #fff;
            font-size: 1rem;
            font-weight: 800;
            box-shadow: 0 16px 26px rgba(49, 130, 246, 0.25);
            cursor: pointer;
        }

        .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 80%;
            height: 100%;
            background: linear-gradient(105deg,
                    transparent 0%,
                    rgba(255, 255, 255, 0) 25%,
                    rgba(255, 255, 255, 0.3) 50%,
                    rgba(255, 255, 255, 0) 75%,
                    transparent 100%);
            animation: btn-shine 5s ease-in-out infinite;
        }

        @keyframes btn-shine {
            0% {
                left: -100%;
            }

            60%,
            100% {
                left: 125%;
            }
        }

        .btn:hover {
            filter: brightness(1.03);
        }

        .recent-applicants {
            display: grid;
            gap: 16px;
            width: 530.234px;
            max-width: 100%;
            margin-left: auto;
            margin-right: auto;
            padding: 24px;
            border: 1px solid var(--line);
            border-radius: 28px;
            background: rgba(255, 255, 255, 0.92);
            box-shadow: var(--shadow);
            box-sizing: border-box;
        }

        .recent-applicants-title {
            margin: 0;
            font-size: 1.3rem;
            font-weight: 800;
            text-align: center;
            letter-spacing: -0.03em;
        }

        .recent-applicants-head,
        .recent-applicants-row {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            width: 100%;
        }

        .recent-applicants-head {
            height: 44px;
            background: var(--surface-soft);
            color: var(--primary-strong);
            font-size: 0.82rem;
            font-weight: 700;
            border-radius: 14px 14px 0 0;
        }

        .recent-applicants-head>div,
        .recent-applicants-row>div {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 0;
            padding: 0 6px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .recent-applicants-viewport {
            margin-top: -16px;
            max-height: 200px;
            overflow: hidden;
            border: 1px solid var(--line);
            border-top: 0;
            border-radius: 0 0 14px 14px;
        }

        .recent-applicants-track {
            display: flex;
            flex-direction: column;
            transform: translateY(0);
            will-change: transform;
        }

        .recent-applicants-track.is-rolling {
            transition: transform 0.45s ease;
        }

        .recent-applicants-row {
            height: 50px;
            flex: none;
            border-bottom: 1px solid var(--line);
            background: #fff;
            color: var(--text);
            font-size: 0.82rem;
        }

        .recent-applicants-empty {
            margin: 0;
            padding: 24px;
            border: 1px dashed var(--line);
            border-radius: 20px;
            text-align: center;
            color: var(--muted);
        }

        .hidden-frame {
            position: absolute;
            width: 1px;
            height: 1px;
            border: 0;
            padding: 0;
            margin: 0;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            clip-path: inset(50%);
            white-space: nowrap;
        }

        .modal-overlay {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(26, 29, 41, 0.5);
            padding: 20px;
            z-index: 100;
        }

        .modal-overlay[hidden] {
            display: none;
        }

        .modal-card {
            width: 100%;
            max-width: 340px;
            background: #fff;
            border-radius: 24px;
            padding: 32px 28px 28px;
            text-align: center;
            box-shadow: 0 24px 60px rgba(26, 29, 41, 0.25);
            animation: modal-pop 0.25s ease;
        }

        @keyframes modal-pop {
            from {
                opacity: 0;
                transform: scale(0.92) translateY(8px);
            }

            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        .modal-icon {
            width: 56px;
            height: 56px;
            margin: 0 auto 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            background: var(--surface-soft);
            border-radius: 999px;
        }

        .modal-icon--warning {
            background: #fff3cd;
        }

        .modal-card h3 {
            margin: 0 0 8px;
            font-size: 1.2rem;
            font-weight: 800;
            color: var(--text);
        }

        .modal-card p {
            margin: 0 0 20px;
            color: var(--muted);
            font-size: 0.92rem;
            line-height: 1.6;
        }

        .modal-card .btn {
            min-height: 48px;
        }

        #choice-korean:checked~.page .hero__title--korean,
        #choice-korean:checked~.page .hero__desc--korean {
            display: block;
        }

        #choice-korean:checked~.page .hero__title--default,
        #choice-korean:checked~.page .hero__desc--default,
        #choice-korean:checked~.page .hero__title--osstem,
        #choice-korean:checked~.page .hero__desc--osstem,
        #choice-korean:checked~.page .hero__title--full,
        #choice-korean:checked~.page .hero__desc--full {
            display: none;
        }

        #choice-osstem:checked~.page .hero__title--osstem,
        #choice-osstem:checked~.page .hero__desc--osstem {
            display: block;
        }

        #choice-osstem:checked~.page .hero__title--default,
        #choice-osstem:checked~.page .hero__desc--default,
        #choice-osstem:checked~.page .hero__title--korean,
        #choice-osstem:checked~.page .hero__desc--korean,
        #choice-osstem:checked~.page .hero__title--full,
        #choice-osstem:checked~.page .hero__desc--full {
            display: none;
        }

        #choice-full:checked~.page .hero__title--full,
        #choice-full:checked~.page .hero__desc--full {
            display: block;
        }

        #choice-full:checked~.page .hero__title--default,
        #choice-full:checked~.page .hero__desc--default,
        #choice-full:checked~.page .hero__title--korean,
        #choice-full:checked~.page .hero__desc--korean,
        #choice-full:checked~.page .hero__title--osstem,
        #choice-full:checked~.page .hero__desc--osstem {
            display: none;
        }

        #choice-korean:checked~.page .choice-list label[for='choice-korean'],
        #choice-osstem:checked~.page .choice-list label[for='choice-osstem'],
        #choice-full:checked~.page .choice-list label[for='choice-full'] {
            border-color: var(--primary);
            box-shadow: 0 10px 22px rgba(49, 130, 246, 0.12);
        }

        @media (max-width: 640px) {
            .page {
                padding: 16px 14px 36px;
            }

            .back-btn {
                height: 40px;
                padding: 0 14px 0 12px;
                font-size: 0.85rem;
            }

            .hero,
            .form-section,
            .recent-applicants {
                padding: 18px;
                border-radius: 22px;
            }

            .recent-applicants-head {
                height: 36px;
                font-size: 0.78rem;
            }

            .recent-applicants-viewport {
                max-height: 140px;
            }

            .recent-applicants-row {
                height: 36px;
                font-size: 0.8rem;
            }

            .choice-list {
                grid-template-columns: 1fr;
            }

            .section-heading {
                text-align: center;
            }
        }

        /* 아이폰 14 Pro(393px) 등 좁은 폰 화면 대응 */
        @media (max-width: 400px) {
            .page {
                padding: 14px 12px 32px;
            }

            .hero,
            .form-section,
            .recent-applicants {
                padding: 16px;
            }

            .hero__title--default,
            .hero__title--korean,
            .hero__title--osstem,
            .hero__title--full {
                font-size: 2.1rem;
            }

            .recent-applicants-head,
            .recent-applicants-row {
                font-size: 0.74rem;
            }
        }

        /* ==== index.html <-> counsel.html 전환을 한 페이지 안에서 표현하기 위한 뷰 전환용 스타일 ==== */
        .view[hidden] {
            display: none !important;
        }

        #view-index {
            background: #ffffff;
            min-height: 100vh;
        }
    </style>

    <title>임플란트 무료 상담</title>
</head>

<body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->

    <!-- ============ index.html 영역 ============ -->
    <div id="view-index" class="view">
        <div class="container">
            <div class="main_img">
                <p><img src="http://knockknockplant.co.kr/landing/00-test/randing_ko_20.gif
" alt="오스템 메인이미지"></p>
                <a href="#counsel" id="go-counsel-btn" class="btn">
                    <p>무료 상담 신청</p>
                </a>
            </div>
        </div>
    </div>

    <!-- ============ counsel.html 영역 ============ -->
    <div id="view-counsel" class="view" hidden>
        <input class="choice-switch" type="radio" name="choice" id="choice-korean" value="국산 정품 임플란트" checked>
        <input class="choice-switch" type="radio" name="choice" id="choice-osstem" value="오스템 임플란트">
        <input class="choice-switch" type="radio" name="choice" id="choice-full" value="전체 임플란트">

        <main class="page">
            <a class="back-btn" href="#" id="back-to-index-btn">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
                <span>뒤로 가기</span>
            </a>

            <section class="hero">
                <div class="countdown-wrap">
                    <span>⏰ 마감까지</span>
                    <span class="countdown-timer" id="countdown-timer">계산 중...</span>
                </div>

                <div class="hero__top">
                    <h1 class="hero__title hero__title--default">무료 상담 신청</h1>
                    <p class="hero__desc hero__desc--default">아래 항목을 클릭하면 상단 문구가 바뀌고, 원하는 상담 내용을 선택할 수 있습니다.</p>

                    <div class="hero__title hero__title--korean">국산 정품 임플란트 상담</div>
                    <p class="hero__desc hero__desc--korean">국산 정품 임플란트 상담을 원하시면 아래 정보를 입력해주세요.</p>

                    <div class="hero__title hero__title--osstem">오스템 임플란트 상담</div>
                    <p class="hero__desc hero__desc--osstem">오스템 임플란트 상담을 원하시면 아래 정보를 입력해주세요.</p>

                    <div class="hero__title hero__title--full">전체 임플란트 상담</div>
                    <p class="hero__desc hero__desc--full">전체 임플란트 상담을 원하시면 아래 정보를 입력해주세요.</p>
                </div>

                <div class="choice-list" aria-label="상담 종류 선택">
                    <label class="choice-card" for="choice-korean">
                        <span class="choice-card__title">국산 정품 임플란트</span>
                        <span class="choice-card__text">신청하기</span>
                    </label>

                    <label class="choice-card" for="choice-osstem">
                        <span class="choice-card__title">오스템 임플란트</span>
                        <span class="choice-card__text">신청하기</span>
                    </label>

                    <label class="choice-card" for="choice-full">
                        <span class="choice-card__title">전체 임플란트</span>
                        <span class="choice-card__text">신청하기</span>
                    </label>
                </div>
            </section>

            <section class="form-section">
                <div class="eyebrow-wrap">
                    <p class="eyebrow">📝 상담 신청</p>
                </div>

                <div class="section-heading">
                    <h2>연락처를 남겨주세요</h2>
                    <p>상담원이 맞춤 상담을 도와드립니다.</p>
                </div>

                <form class="consult-form" id="consult-form"
                    action="https://script.google.com/macros/s/AKfycbwUM87HB0I04HQ8mjr6sahP6u_K_Q80URJrvtOB8IX0xJWX0SkpTYRwg3nB2jvkCg6Q/exec"
                    method="post" target="submit-frame">
                    <input type="hidden" id="selected-type" name="selectedType" value="국산 정품 임플란트">
                    <input type="hidden" id="force-fail-flag" name="forceFail" value="0">
                    <label class="field">
                        <span>이름</span>
                        <div class="input-icon">
                            <svg class="input-icon__svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 20c0-4.2 3.6-7 8-7s8 2.8 8 7" />
                            </svg>
                            <input type="text" name="name" placeholder="이름을 입력하세요" maxlength="4" autocomplete="off" required>
                        </div>
                    </label>

                    <label class="field">
                        <span>연락처</span>
                        <div class="input-icon">
                            <svg class="input-icon__svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                <path d="M6.5 3h3l1.5 4.5-2 1.5a12 12 0 0 0 6 6l1.5-2 4.5 1.5v3a2 2 0 0 1-2 2c-8 0-14.5-6.5-14.5-14.5a2 2 0 0 1 2-2Z" />
                            </svg>
                            <input type="tel" name="phone" placeholder="연락처를 입력하세요" maxlength="13" autocomplete="off" required>
                        </div>
                    </label>

                    <label class="check-field">
                        <input type="checkbox" name="agree" required checked>
                        <span>[필수] 개인정보 수집 및 이용에 동의합니다.
                            <a class="agree-detail-link" href="https://knockknockplant.co.kr/access.php" target="_blank" rel="noopener noreferrer">자세히 보기</a>
                        </span>
                    </label>

                    <button type="button" id="debug-force-fail-btn" class="btn" style="display:none; background:#666; margin-bottom:10px;">🧪 일부러 실패시키기 (테스트용)</button>

                    <button class="btn" type="submit">상담 신청하기</button>
                </form>
                <iframe name="submit-frame" class="hidden-frame" title="상담 신청 전송 프레임"></iframe>
            </section>

            <section class="recent-applicants" aria-label="실시간 상담 신청 현황">
                <h2 class="recent-applicants-title">🔥 실시간 상담 신청 현황 🔥</h2>

                <div class="recent-applicants-head">
                    <div>접수일</div>
                    <div>이름</div>
                    <div>연락처</div>
                </div>

                <div class="recent-applicants-viewport">
                    <div class="recent-applicants-track" id="consultation-list"></div>
                </div>

                <p class="recent-applicants-empty" id="consultation-list-empty" hidden>아직 상담 신청 내역이 없습니다.</p>
            </section>
        </main>

        <div class="modal-overlay" id="app-modal" hidden>
            <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="app-modal-title">
                <div class="modal-icon" id="app-modal-icon">✅</div>
                <h3 id="app-modal-title">상담 신청이 완료되었습니다!</h3>
                <p id="app-modal-message">빠른 시간 안에 상담원이 연락드리겠습니다.</p>
                <button type="button" class="btn" id="app-modal-confirm">확인</button>
            </div>
        </div>
    </div>

    <script>
        // ==== js/counsel.js ====
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

        function showModal({
            icon,
            title,
            message,
            tone = 'default'
        }) {
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
    </script>
    <script>
        // index.html -> counsel.html 로 실제 이동하던 흐름을, 한 페이지(index.php) 안에서
        // 같은 사용자 경험(주소창 #counsel, 뒤로가기 버튼 동작)으로 재현하기 위한 전환 스크립트
        (function() {
            const viewIndex = document.querySelector('#view-index');
            const viewCounsel = document.querySelector('#view-counsel');
            const goCounselBtn = document.querySelector('#go-counsel-btn');
            const backToIndexBtn = document.querySelector('#back-to-index-btn');

            function showCounsel(pushState) {
                viewIndex.hidden = true;
                viewCounsel.hidden = false;
                if (pushState) {
                    history.pushState({
                        view: 'counsel'
                    }, '', '#counsel');
                }
            }

            function showIndex(pushState) {
                viewCounsel.hidden = true;
                viewIndex.hidden = false;
                if (pushState) {
                    history.pushState({
                        view: 'index'
                    }, '', location.pathname + location.search);
                }
            }

            if (goCounselBtn) {
                goCounselBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    showCounsel(true);
                });
            }

            if (backToIndexBtn) {
                backToIndexBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    showIndex(true);
                });
            }

            window.addEventListener('popstate', (event) => {
                const view = event.state && event.state.view;
                if (view === 'counsel') {
                    showCounsel(false);
                } else {
                    showIndex(false);
                }
            });

            // 새로고침이나 #counsel 딥링크로 바로 들어온 경우 상담 화면을 먼저 보여준다
            if (location.hash === '#counsel') {
                showCounsel(false);
                history.replaceState({
                    view: 'counsel'
                }, '', '#counsel');
            } else {
                history.replaceState({
                    view: 'index'
                }, '', location.pathname + location.search);
            }
        })();
    </script>
</body>

</html>