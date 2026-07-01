/**
 * Пардус-Р AI-виджет
 * Подключение: <script src="/static/widget.js"
 *   data-api-url="https://your-server.com"
 *   data-title="Консультант Пардус-Р"
 *   data-color="#1a6fc4">
 * </script>
 */
(function () {
  'use strict';

  /* ── Конфигурация ─────────────────────────────────────────────────────── */
  var _script = document.currentScript;
  var API_URL = (_script.getAttribute('data-api-url') || window.location.origin).replace(/\/$/, '');
  var TITLE   = _script.getAttribute('data-title') || 'Консультант Пардус-Р';
  var COLOR   = _script.getAttribute('data-color') || '#1a6fc4';

  function adjColor(hex, amt) {
    var n = parseInt(hex.replace('#', ''), 16);
    var r = Math.max(0, Math.min(255, (n >> 16) + amt));
    var g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
    var b = Math.max(0, Math.min(255, (n & 0xff) + amt));
    return '#' + [r, g, b].map(function (v) { return v.toString(16).padStart(2, '0'); }).join('');
  }

  var COLOR_DARK  = adjColor(COLOR, -30);
  var COLOR_LIGHT = adjColor(COLOR, 200); // почти белый оттенок для фона ввода

  /* ── Состояние ────────────────────────────────────────────────────────── */
  var sessionId    = sessionStorage.getItem('prw_sid') || null;
  var isOpen       = false;
  var isLoading    = false;
  var welcomeShown = false;

  /* ── CSS ──────────────────────────────────────────────────────────────── */
  var css = '\
#prw-root * { box-sizing: border-box; margin: 0; }\
\
#prw-btn {\
  position: fixed; bottom: 24px; right: 24px;\
  width: 60px; height: 60px; border-radius: 50%;\
  background: ' + COLOR + '; color: #fff; border: none;\
  cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,.28);\
  display: flex; align-items: center; justify-content: center;\
  z-index: 9998; transition: transform .22s, box-shadow .22s;\
}\
#prw-btn:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(0,0,0,.34); }\
#prw-btn.prw-active { background: ' + COLOR_DARK + '; }\
#prw-btn svg { width: 28px; height: 28px; }\
\
#prw-badge {\
  position: absolute; top: -4px; right: -4px;\
  width: 20px; height: 20px; border-radius: 50%;\
  background: #e53935; color: #fff;\
  font-size: 11px; font-weight: 700;\
  display: flex; align-items: center; justify-content: center;\
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;\
  border: 2px solid #fff; pointer-events: none;\
}\
\
#prw-chat {\
  position: fixed; bottom: 96px; right: 24px;\
  width: 380px; max-height: 580px;\
  background: #fff; border-radius: 18px;\
  box-shadow: 0 12px 48px rgba(0,0,0,.22);\
  display: none; flex-direction: column;\
  z-index: 9999; overflow: hidden;\
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\
  font-size: 14px; line-height: 1.5; color: #1a1a1a;\
}\
#prw-chat.prw-open {\
  display: flex;\
  animation: prwSlideUp .24s cubic-bezier(.16,1,.3,1);\
}\
@keyframes prwSlideUp {\
  from { opacity: 0; transform: translateY(20px) scale(.97); }\
  to   { opacity: 1; transform: translateY(0) scale(1); }\
}\
\
.prw-header {\
  background: linear-gradient(135deg, ' + COLOR + ' 0%, ' + COLOR_DARK + ' 100%);\
  color: #fff; padding: 14px 18px;\
  display: flex; align-items: center; gap: 12px; flex-shrink: 0;\
}\
.prw-avatar {\
  width: 38px; height: 38px; border-radius: 50%;\
  background: rgba(255,255,255,.18);\
  display: flex; align-items: center; justify-content: center;\
  font-size: 18px; flex-shrink: 0;\
}\
.prw-header-info { flex: 1; min-width: 0; }\
.prw-header-name { font-weight: 600; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\
.prw-header-sub  { font-size: 12px; opacity: .75; margin-top: 1px; }\
.prw-close {\
  background: none; border: none; color: #fff; cursor: pointer;\
  padding: 4px; border-radius: 50%; display: flex; opacity: .7;\
  transition: opacity .2s; flex-shrink: 0;\
}\
.prw-close:hover { opacity: 1; }\
\
.prw-messages {\
  flex: 1; overflow-y: auto; padding: 16px 20px;\
  display: flex; flex-direction: column; gap: 10px;\
  scroll-behavior: smooth;\
}\
.prw-messages::-webkit-scrollbar { width: 4px; }\
.prw-messages::-webkit-scrollbar-track { background: transparent; }\
.prw-messages::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }\
\
.prw-msg { display: flex; flex-direction: column; max-width: 88%; animation: prwFadeIn .18s ease; }\
@keyframes prwFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }\
.prw-msg.prw-user { align-self: flex-end; align-items: flex-end; }\
.prw-msg.prw-bot  { align-self: flex-start; align-items: flex-start; }\
\
.prw-bubble {\
  padding: 10px 16px; border-radius: 16px; word-break: break-word;\
}\
.prw-msg.prw-user .prw-bubble {\
  background: ' + COLOR + '; color: #fff; border-bottom-right-radius: 4px;\
}\
.prw-msg.prw-bot .prw-bubble {\
  background: #f0f2f5; color: #1a1a1a; border-bottom-left-radius: 4px;\
}\
\
.prw-sources {\
  margin-top: 6px; padding: 8px 12px;\
  background: #eef3fb; border-radius: 10px;\
  border-left: 3px solid ' + COLOR + ';\
  font-size: 12px; color: #444; max-width: 100%;\
}\
.prw-sources-label {\
  font-weight: 600; color: ' + COLOR + '; margin-bottom: 4px; font-size: 12px;\
}\
.prw-source-item {\
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;\
  margin-top: 2px; color: #555;\
}\
\
.prw-time {\
  font-size: 11px; color: #aaa;\
  margin-top: 3px; padding: 0 2px;\
}\
\
.prw-typing {\
  display: flex; align-items: center; gap: 5px;\
  padding: 12px 16px; background: #f0f2f5;\
  border-radius: 16px; border-bottom-left-radius: 4px; width: fit-content;\
}\
.prw-dot {\
  width: 8px; height: 8px; background: #aaa; border-radius: 50%;\
  animation: prwBounce 1.3s infinite ease;\
}\
.prw-dot:nth-child(2) { animation-delay: .18s; }\
.prw-dot:nth-child(3) { animation-delay: .36s; }\
@keyframes prwBounce {\
  0%, 60%, 100% { transform: translateY(0); }\
  30%           { transform: translateY(-7px); }\
}\
\
.prw-empty {\
  text-align: center; color: #bbb; font-size: 13px;\
  margin: auto; padding: 24px 16px;\
}\
\
.prw-form {\
  border-top: 1px solid #eee; padding: 10px 12px;\
  display: flex; align-items: center; gap: 8px; flex-shrink: 0;\
  background: #fafafa;\
}\
.prw-input {\
  flex: 1; border: 1.5px solid #e0e0e0; border-radius: 22px;\
  padding: 9px 16px; font-size: 14px; outline: none;\
  transition: border-color .2s; font-family: inherit; color: #1a1a1a;\
  background: #fff;\
  resize: none; line-height: 1.4;\
}\
.prw-input:focus { border-color: ' + COLOR + '; }\
.prw-input:disabled { background: #f5f5f5; cursor: not-allowed; }\
.prw-send {\
  width: 40px; height: 40px; border-radius: 50%;\
  background: ' + COLOR + '; color: #fff; border: none;\
  cursor: pointer; display: flex; align-items: center; justify-content: center;\
  flex-shrink: 0; transition: background .2s, transform .15s;\
}\
.prw-send:hover:not(:disabled) { background: ' + COLOR_DARK + '; transform: scale(1.08); }\
.prw-send:disabled { background: #ccc; cursor: not-allowed; }\
.prw-send svg { width: 18px; height: 18px; }\
\
.prw-powered {\
  text-align: center; font-size: 11px; color: #ccc;\
  padding: 6px 0 8px; flex-shrink: 0; background: #fafafa;\
}\
\
@media (max-width: 440px) {\
  #prw-chat { width: calc(100vw - 32px); right: 16px; bottom: 84px; max-height: calc(100dvh - 112px); }\
  #prw-btn  { bottom: 16px; right: 16px; }\
}';

  /* ── DOM ──────────────────────────────────────────────────────────────── */
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  var root = document.createElement('div');
  root.id = 'prw-root';
  root.innerHTML = [
    '<button id="prw-btn" title="Открыть чат с консультантом" aria-label="Открыть чат">',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
        '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
      '</svg>',
      '<span id="prw-badge" style="display:none">1</span>',
    '</button>',
    '<div id="prw-chat" role="dialog" aria-label="Чат с консультантом">',
      '<div class="prw-header">',
        '<div class="prw-avatar">🔬</div>',
        '<div class="prw-header-info">',
          '<div class="prw-header-name">' + escHtml(TITLE) + '</div>',
          '<div class="prw-header-sub">Отвечу на вопросы об аппарате</div>',
        '</div>',
        '<button class="prw-close" id="prw-close" title="Закрыть" aria-label="Закрыть чат">',
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">',
            '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
          '</svg>',
        '</button>',
      '</div>',
      '<div class="prw-messages" id="prw-messages" role="log" aria-live="polite"></div>',
      '<form class="prw-form" id="prw-form" autocomplete="off">',
        '<input class="prw-input" id="prw-input" type="text"',
          ' placeholder="Введите вопрос…" maxlength="500" aria-label="Сообщение"/>',
        '<button class="prw-send" id="prw-send" type="submit" title="Отправить" aria-label="Отправить">',
          '<svg viewBox="0 0 24 24" fill="currentColor">',
            '<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>',
          '</svg>',
        '</button>',
      '</form>',
      '<div class="prw-powered">Работает на RAG + OpenAI</div>',
    '</div>',
  ].join('');

  document.body.appendChild(root);

  /* ── Ссылки на элементы ───────────────────────────────────────────────── */
  var btn      = document.getElementById('prw-btn');
  var badge    = document.getElementById('prw-badge');
  var chat     = document.getElementById('prw-chat');
  var closeBtn = document.getElementById('prw-close');
  var messages = document.getElementById('prw-messages');
  var form     = document.getElementById('prw-form');
  var input    = document.getElementById('prw-input');
  var sendBtn  = document.getElementById('prw-send');

  /* ── Обработчики ──────────────────────────────────────────────────────── */
  btn.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', closeChat);
  form.addEventListener('submit', handleSubmit);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      form.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  });

  /* ── Функции управления ───────────────────────────────────────────────── */
  function toggleChat() {
    if (isOpen) closeChat(); else openChat();
  }

  function openChat() {
    isOpen = true;
    chat.classList.add('prw-open');
    btn.classList.add('prw-active');
    badge.style.display = 'none';
    if (!welcomeShown) {
      showWelcome();
      welcomeShown = true;
    }
    setTimeout(function () { input.focus(); }, 250);
  }

  function closeChat() {
    isOpen = false;
    chat.classList.remove('prw-open');
    btn.classList.remove('prw-active');
  }

  function showWelcome() {
    addMessage(
      'bot',
      'Здравствуйте! Я — консультант по портативному рентген-аппарату «Пардус-Р».\n\n' +
      'Могу ответить на вопросы о технических характеристиках, эксплуатации, ' +
      'комплектации, безопасности и сценариях применения.'
    );
  }

  /* ── Сообщения ────────────────────────────────────────────────────────── */
  function addMessage(role, text) {
    var el = document.createElement('div');
    el.className = 'prw-msg prw-' + role;

    var timeStr = new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });

    if (role === 'bot') {
      el.innerHTML = formatBotContent(text) + '<span class="prw-time">' + timeStr + '</span>';
    } else {
      el.innerHTML = '<div class="prw-bubble">' + escHtml(text).replace(/\n/g, '<br>') + '</div>' +
                     '<span class="prw-time">' + timeStr + '</span>';
    }

    messages.appendChild(el);
    scrollBottom();
  }

  function showTyping() {
    var el = document.createElement('div');
    el.id  = 'prw-typing-el';
    el.className = 'prw-msg prw-bot';
    el.innerHTML = '<div class="prw-typing"><span class="prw-dot"></span><span class="prw-dot"></span><span class="prw-dot"></span></div>';
    messages.appendChild(el);
    scrollBottom();
  }

  function hideTyping() {
    var el = document.getElementById('prw-typing-el');
    if (el) el.remove();
  }

  function scrollBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  function setLoading(val) {
    isLoading = val;
    input.disabled = val;
    sendBtn.disabled = val;
  }

  /* ── Отправка сообщения ───────────────────────────────────────────────── */
  function handleSubmit(e) {
    e.preventDefault();
    var message = input.value.trim();
    if (!message || isLoading) return;

    input.value = '';
    addMessage('user', message);
    setLoading(true);
    showTyping();

    var body = JSON.stringify({ message: message, session_id: sessionId });

    fetch(API_URL + '/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        sessionId = data.session_id;
        sessionStorage.setItem('prw_sid', sessionId);
        hideTyping();
        addMessage('bot', data.answer);
      })
      .catch(function () {
        hideTyping();
        addMessage('bot', '❌ Не удалось получить ответ. Проверьте соединение и попробуйте снова.');
      })
      .finally(function () {
        setLoading(false);
        input.focus();
      });
  }

  /* ── Форматирование ответа ────────────────────────────────────────────── */
  function formatBotContent(text) {
    /* Разделяем основной текст и блок источников */
    var sourcesSplit = text.split(/\n\n?📎\s*Источники[:\s]*/);
    var main = sourcesSplit[0].trim();
    var sourcesRaw = sourcesSplit.length > 1 ? sourcesSplit[1].trim() : '';

    var bubble = '<div class="prw-bubble">' +
      escHtml(main).replace(/\n/g, '<br>') +
      '</div>';

    if (!sourcesRaw) return bubble;

    var sources = sourcesRaw.split('\n')
      .map(function (l) { return l.replace(/^[•·\-]\s*/, '').trim(); })
      .filter(function (l) { return l.length > 0; });

    if (!sources.length) return bubble;

    var sourcesHtml = '<div class="prw-sources">' +
      '<div class="prw-sources-label">📎 Источники</div>' +
      sources.map(function (s) {
        return '<div class="prw-source-item">• ' + escHtml(s) + '</div>';
      }).join('') +
      '</div>';

    return bubble + sourcesHtml;
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Показать бейдж при закрытом чате (опционально) ──────────────────── */
  // Можно вызвать извне: window.pardusWidget.showBadge()
  window.pardusWidget = {
    open:  openChat,
    close: closeChat,
    showBadge: function () {
      if (!isOpen) { badge.style.display = 'flex'; }
    },
  };

})();
