'use strict';

const DEPTS = ['산업설비과', '스마트팩토리과', '기계과', '전기과'];
const CATEGORIES = ['전공교재', '자격증수험서', '실습용품'];
const CAT_LABELS = { '전공교재': '전공 교재', '자격증수험서': '자격증 수험서', '실습용품': '실습용품/공구' };
const CONDITIONS = ['새책급', '필기약간', '필기많음', '사용감있음'];
const STATUSES = ['판매중', '예약중', '판매완료'];
const GRADE_MAP = { '새책급': '상', '필기약간': '중', '필기많음': '하', '사용감있음': '중' };
const HAS_NOTE = { '새책급': false, '필기약간': true, '필기많음': true, '사용감있음': false };

const LS_KEYS = { user: 'bmh_market_user_items' };

const fmt = n => (Number(n) || 0).toLocaleString('ko-KR');
const $ = id => document.getElementById(id);

const MOCK_DB = [
  { title: 'Win-Q 피복아크용접기능사 필기', category: '자격증수험서', dept: '산업설비과' },
  { title: 'Win-Q 피복아크용접기능사 실기', category: '자격증수험서', dept: '산업설비과' },
  { title: 'Win-Q 에너지관리기능사 필기', category: '자격증수험서', dept: '산업설비과' },
  { title: 'Win-Q 에너지관리기능사 실기', category: '자격증수험서', dept: '산업설비과' },
  { title: 'Win-Q 컴퓨터응용밀링기능사 필기+실기', category: '자격증수험서', dept: '기계과' },
  { title: 'Win-Q 컴퓨터응용선반기능사 필기+실기', category: '자격증수험서', dept: '기계과' },
  { title: 'Win-Q 전자기기기능사 필기', category: '자격증수험서', dept: '전기과' },
  { title: 'Win-Q 전기기능사 필기', category: '자격증수험서', dept: '전기과' },
  { title: 'Win-Q 전기기능사 실기', category: '자격증수험서', dept: '전기과' },
  { title: '배관기능사 필기 (동영상 강의 포함)', category: '자격증수험서', dept: '산업설비과' },
  { title: '배관기능사 실기', category: '자격증수험서', dept: '산업설비과' },
  { title: '컴퓨터응용조각기능사 필기', category: '자격증수험서', dept: '기계과' },
  { title: '재료역학 (마이스터고 전공 교재)', category: '전공교재', dept: '기계과' },
  { title: '기계공작법', category: '전공교재', dept: '기계과' },
  { title: '기계제도', category: '전공교재', dept: '기계과' },
  { title: '용접공학', category: '전공교재', dept: '산업설비과' },
  { title: '배관공학', category: '전공교재', dept: '산업설비과' },
  { title: '전기이론', category: '전공교재', dept: '전기과' },
  { title: '유체역학 기초', category: '전공교재', dept: '기계과' },
  { title: '공압·유압 실습 교재', category: '전공교재', dept: '스마트팩토리과' },
  { title: 'PLC 프로그래밍 실습', category: '전공교재', dept: '스마트팩토리과' },
  { title: '버니어캘리퍼스 (디지털)', category: '실습용품', dept: '기계과' },
  { title: '마이크로미터', category: '실습용품', dept: '기계과' },
  { title: '용접면 (자동 조광식)', category: '실습용품', dept: '산업설비과' },
  { title: '용접장갑 (소가죽)', category: '실습용품', dept: '산업설비과' },
  { title: '공구함 세트', category: '실습용품', dept: '기계과' }
];

const CAT_ICONS = {
  '전공교재': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>',
  '자격증수험서': '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"/>',
  '실습용품': '<path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"/>'
};

const QUICK_REPLIES = ['직거래 가능할까요?', '가격 조정 가능할까요?', '언제 거래 가능한가요?', '물품 상태가 어떤가요?', '예약하고 싶어요'];

const PIN_ICON = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5 shrink-0 text-slate-400"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>';

let allItems = [];
let currentDetailId = null;
let currentChatItem = null;
let selectedImage = null;
let filters = { query: '', dept: 'all', category: 'all', grade: 'all', note: 'all', status: 'all' };

function loadJSON(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v === null || v === undefined ? fallback : v;
  } catch (e) {
    return fallback;
  }
}

function saveJSON(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    return true;
  } catch (e) {
    toast('브라우저 저장 공간이 부족합니다. 이미지 용량을 줄여주세요.', 'error');
    return false;
  }
}

function escapeHTML(str) {
  return String(str === null || str === undefined ? '' : str).replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]));
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return '방금 전';
  const min = Math.floor(diff / 60000);
  if (min < 60) return min + '분 전';
  const hr = Math.floor(min / 60);
  if (hr < 24) return hr + '시간 전';
  return Math.floor(hr / 24) + '일 전';
}

function statusClass(s) {
  return s === '판매중' ? 'bg-emerald-500' : s === '예약중' ? 'bg-amber-500' : 'bg-slate-600';
}

function catIcon(cat, cls) {
  const path = CAT_ICONS[cat] || CAT_ICONS['전공교재'];
  return '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="' + cls + '">' + path + '</svg>';
}

function placeholderHTML(item) {
  return '<div class="w-full aspect-square bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 flex flex-col items-center justify-center gap-2 text-blue-400">' +
    catIcon(item.category, 'w-10 h-10') +
    '<span class="text-xs font-extrabold tracking-wide">' + CAT_LABELS[item.category] + '</span></div>';
}

function bigPlaceholder(item) {
  return '<div class="w-full h-full bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 flex flex-col items-center justify-center gap-3 text-blue-400">' +
    catIcon(item.category, 'w-16 h-16') +
    '<span class="text-sm font-extrabold tracking-wide">' + CAT_LABELS[item.category] + '</span>' +
    '<span class="text-xs text-slate-400">등록된 사진이 없습니다</span></div>';
}

function buildItems() {
  allItems = loadJSON(LS_KEYS.user, [])
    .map(u => Object.assign({}, u, { source: 'user' }))
    .sort((a, b) => b.createdAt - a.createdAt);
}

function getFilteredItems() {
  const q = filters.query.trim().toLowerCase();
  return allItems.filter(item => {
    if (filters.dept !== 'all' && item.dept !== filters.dept) return false;
    if (filters.category !== 'all' && item.category !== filters.category) return false;
    if (filters.status !== 'all' && item.status !== filters.status) return false;
    if (filters.grade !== 'all' && GRADE_MAP[item.condition] !== filters.grade) return false;
    if (filters.note !== 'all') {
      const has = HAS_NOTE[item.condition];
      if (filters.note === 'yes' && !has) return false;
      if (filters.note === 'no' && has) return false;
    }
    if (q) {
      const hay = (item.title + ' ' + item.dept + ' ' + CAT_LABELS[item.category] + ' ' + (item.desc || '') + ' ' + item.location).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function renderGrid() {
  const items = getFilteredItems();
  $('item-grid').innerHTML = items.map(item => {
    const sold = item.status === '판매완료';
    const media = item.image
      ? '<img src="' + item.image + '" alt="' + escapeHTML(item.title) + '" class="w-full aspect-square object-cover' + (sold ? ' grayscale opacity-70' : '') + '">'
      : placeholderHTML(item);
    return '<article data-id="' + item.id + '" class="bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ring-slate-200 hover:ring-blue-400 hover:-translate-y-0.5 hover:shadow-lg transition cursor-pointer">' +
      '<div class="relative">' + media +
      '<span class="status-badge ' + statusClass(item.status) + '">' + item.status + '</span>' +
      (item.source === 'user' ? '<span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-blue-950/80 text-white text-[10px] font-bold">내 등록</span>' : '') +
      (sold ? '<div class="absolute inset-0 bg-slate-900/30 flex items-center justify-center"><span class="text-white font-extrabold bg-slate-900/70 px-3 py-1 rounded-lg text-sm tracking-widest">거래 완료</span></div>' : '') +
      '</div>' +
      '<div class="p-3 space-y-1.5">' +
      '<p class="text-[11px] font-extrabold text-blue-700">' + CAT_LABELS[item.category] + ' · ' + item.dept + '</p>' +
      '<h3 class="text-sm font-bold text-slate-800 leading-snug line-clamp-2 min-h-[2.5rem]">' + escapeHTML(item.title) + '</h3>' +
      '<div class="flex items-baseline gap-1.5 flex-wrap">' +
      '<span class="text-lg font-extrabold text-blue-700">' + fmt(item.price) + '<span class="text-xs font-bold">원</span></span>' +
      (item.originalPrice > item.price ? '<span class="text-[11px] text-slate-400 line-through">' + fmt(item.originalPrice) + '원</span>' : '') +
      '</div>' +
      '<div><span class="tag tag-sky">' + item.condition + '</span></div>' +
      '<p class="text-[11px] text-slate-500 flex items-center gap-1">' + PIN_ICON +
      '<span class="truncate">' + escapeHTML(item.location) + '</span>' +
      '<span class="text-slate-300 shrink-0">·</span><span class="shrink-0">' + timeAgo(item.createdAt) + '</span></p>' +
      '</div></article>';
  }).join('');
  $('result-count').textContent = items.length;
  $('hero-count').textContent = allItems.length;
  $('empty-state').classList.toggle('hidden', items.length > 0);
}

const showModal = el => el.classList.remove('hidden');
const hideModal = el => el.classList.add('hidden');

function openDetail(id) {
  const item = allItems.find(i => i.id === id);
  if (!item) return;
  currentDetailId = id;
  const badge = $('detail-status');
  badge.textContent = item.status;
  badge.className = 'status-badge ' + statusClass(item.status);
  $('detail-media').innerHTML = item.image
    ? '<img src="' + item.image + '" alt="' + escapeHTML(item.title) + '" class="w-full h-full object-cover">'
    : bigPlaceholder(item);
  $('detail-tags').innerHTML =
    '<span class="tag tag-sky">' + CAT_LABELS[item.category] + '</span>' +
    '<span class="tag tag-blue">' + item.dept + '</span>' +
    '<span class="tag tag-slate">' + item.condition + ' (' + GRADE_MAP[item.condition] + '급)</span>' +
    (HAS_NOTE[item.condition] ? '<span class="tag tag-amber">필기 있음</span>' : '<span class="tag tag-slate">필기 없음</span>');
  $('detail-title').textContent = item.title;
  $('detail-price').textContent = fmt(item.price) + '원';
  $('detail-original').textContent = item.originalPrice > item.price ? '정가 ' + fmt(item.originalPrice) + '원' : '';
  $('detail-seller').textContent = item.seller || '익명 (재학생)';
  $('detail-time').textContent = timeAgo(item.createdAt);
  $('detail-condition').textContent = item.condition + ' (' + GRADE_MAP[item.condition] + '급)';
  $('detail-location').textContent = item.location;
  $('detail-desc').textContent = item.desc || '상세 설명이 없습니다.';
  renderStatusGroup(item);
  showModal($('detail-modal'));
}

function renderStatusGroup(item) {
  $('detail-status-group').innerHTML = STATUSES.map(s =>
    '<button type="button" data-status="' + s + '" class="flex-1 py-2 rounded-lg border text-sm font-bold transition ' +
    (s === item.status ? 'bg-blue-700 border-blue-700 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-700') +
    '">' + s + '</button>'
  ).join('');
}

function refreshDetail() {
  const item = allItems.find(i => i.id === currentDetailId);
  if (!item) return;
  const badge = $('detail-status');
  badge.textContent = item.status;
  badge.className = 'status-badge ' + statusClass(item.status);
  renderStatusGroup(item);
}

function changeStatus(id, status) {
  const item = allItems.find(i => i.id === id);
  if (!item || item.status === status) return;
  item.status = status;
  const users = loadJSON(LS_KEYS.user, []);
  const u = users.find(x => x.id === id);
  if (u) {
    u.status = status;
    saveJSON(LS_KEYS.user, users);
  }
  renderGrid();
  refreshDetail();
  toast("거래 상태가 '" + status + "'(으)로 변경되었습니다.");
}

function deleteItem() {
  const item = allItems.find(i => i.id === currentDetailId);
  if (!item) return;
  if (!confirm("'" + item.title + "' 판매글을 삭제할까요?")) return;
  saveJSON(LS_KEYS.user, loadJSON(LS_KEYS.user, []).filter(x => x.id !== item.id));
  hideModal($('detail-modal'));
  buildItems();
  renderGrid();
  toast('판매글이 삭제되었습니다.');
}

function openChat() {
  const item = allItems.find(i => i.id === currentDetailId);
  if (!item) return;
  currentChatItem = item;
  $('chat-title').textContent = item.title;
  $('chat-messages').innerHTML = '';
  appendMsg('안녕하세요! "' + item.title + '"에 관심 가져주셔서 감사합니다. 상태는 "' + item.condition + '"이며 "' + item.location + '"에서 교내 직거래 가능합니다. 궁금한 점 편하게 물어보세요!', 'bot');
  showModal($('chat-modal'));
}

function appendMsg(text, who) {
  const div = document.createElement('div');
  div.className = 'msg ' + who;
  div.textContent = text;
  $('chat-messages').appendChild(div);
  $('chat-messages').scrollTop = $('chat-messages').scrollHeight;
}

function showTyping() {
  const div = document.createElement('div');
  div.id = 'typing-msg';
  div.className = 'msg bot';
  div.innerHTML = '<span class="typing-dots"><span></span><span></span><span></span></span>';
  $('chat-messages').appendChild(div);
  $('chat-messages').scrollTop = $('chat-messages').scrollHeight;
}

function removeTyping() {
  const t = $('typing-msg');
  if (t) t.remove();
}

function botReply(text, item) {
  const t = (text || '').toLowerCase();
  const has = function () { for (let i = 0; i < arguments.length; i++) { if (t.includes(arguments[i])) return true; } return false; };
  if (has('직거래', '만나', '장소', '어디', '위치')) return '네, 가능합니다! "' + item.location + '"에서 만나는 걸 추천해요. 점심시간(12:40~13:30) 또는 방과 후(16:40 이후) 중 어느 쪽이 편하신가요?';
  if (has('가격', '할인', '네고', '깎', '싸게')) return '가격은 ' + fmt(item.price) + '원입니다. 상태 대비 착한 가격이라 크게는 어렵지만, 바로 가져가주시면 조금은 협의 가능해요!';
  if (has('언제', '시간', '오늘', '내일', '몇 시')) return '점심시간이나 방과 후 실습 끝나고 바로 거래할 수 있어요. 하교 전까지 시간 알려주시면 맞춰드릴게요!';
  if (has('상태', '필기', '사용감', '새책')) return '상품 상태는 "' + item.condition + '"(' + GRADE_MAP[item.condition] + '급)입니다. 상세 설명 참고해주시고, 직접 보고 판단하셔도 괜찮아요.';
  if (has('예약')) return '예약 원하시면 오늘 중으로 거래 부탁드려요! 확정되면 판매글 상태를 "예약중"으로 바꿔두겠습니다.';
  if (has('결제', '계좌', '카드', '송금')) return '교내 직거래 원칙이라 현금 또는 간편 송금으로 거래합니다. 안전을 위해 선입금은 하지 않아요!';
  if (has('안녕', '하이', '반가')) return '안녕하세요! "' + item.title + '"에 관심 가져주셔서 감사합니다. 무엇이든 편하게 물어보세요.';
  if (has('고마', '감사', 'ㅎㅎ', 'ㅋㅋ')) return '감사합니다! 거래 예정되면 채팅으로 다시 연락드릴게요.';
  return '네, 확인했습니다! "직거래", "네고", "예약" 등 키워드로 물어보시면 자세히 안내해드려요.';
}

function sendChat() {
  const input = $('chat-input');
  const text = input.value.trim();
  if (!text || !currentChatItem) return;
  appendMsg(text, 'me');
  input.value = '';
  showTyping();
  setTimeout(function () {
    removeTyping();
    appendMsg(botReply(text, currentChatItem), 'bot');
  }, 900 + Math.random() * 600);
}

function hideSuggestions() {
  const box = $('reg-suggestions');
  box.classList.add('hidden');
  box.innerHTML = '';
}

function renderSuggestions(list) {
  const box = $('reg-suggestions');
  if (!list.length) {
    hideSuggestions();
    return;
  }
  box.innerHTML = list.map(b =>
    '<button type="button" class="suggest-item" data-title="' + escapeHTML(b.title) + '" data-category="' + b.category + '" data-dept="' + b.dept + '">' +
    '<span class="tag tag-blue shrink-0">' + CAT_LABELS[b.category] + '</span>' +
    '<span class="font-semibold truncate">' + escapeHTML(b.title) + '</span></button>'
  ).join('');
  box.classList.remove('hidden');
}

function resetForm() {
  $('register-form').reset();
  selectedImage = null;
  $('reg-preview-wrap').classList.add('hidden');
  $('reg-image-label').classList.remove('hidden');
  hideSuggestions();
}

function openRegister() {
  resetForm();
  showModal($('register-modal'));
}

let toastTimer = null;
function toast(msg, type) {
  const el = $('toast');
  el.textContent = msg;
  el.className = 'toast show' + (type === 'error' ? ' error' : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.className = 'toast'; }, 2400);
}

function resetFilters() {
  filters = { query: '', dept: 'all', category: 'all', grade: 'all', note: 'all', status: 'all' };
  $('search-input').value = '';
  $('filter-dept').value = 'all';
  $('filter-status').value = 'all';
  [['cat-chips', 'category'], ['grade-chips', 'grade'], ['note-chips', 'note']].forEach(function (pair) {
    document.querySelectorAll('#' + pair[0] + ' .chip-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset[pair[1]] === 'all');
    });
  });
  renderGrid();
}

function init() {
  $('filter-dept').innerHTML = '<option value="all">전체 학과</option>' + DEPTS.map(d => '<option value="' + d + '">' + d + '</option>').join('');
  $('filter-status').innerHTML = '<option value="all">전체</option>' + STATUSES.map(s => '<option value="' + s + '">' + s + '</option>').join('');
  $('reg-dept').innerHTML = '<option value="">학과 선택</option>' + DEPTS.map(d => '<option value="' + d + '">' + d + '</option>').join('');
  $('reg-category').innerHTML = '<option value="">카테고리 선택</option>' + CATEGORIES.map(c => '<option value="' + c + '">' + CAT_LABELS[c] + '</option>').join('');
  $('reg-condition').innerHTML = CONDITIONS.map(c => '<option value="' + c + '">' + c + '</option>').join('');
  $('chat-quick').innerHTML = QUICK_REPLIES.map(q =>
    '<button type="button" class="shrink-0 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:border-blue-400 hover:text-blue-700 transition" data-q="' + q + '">' + q + '</button>'
  ).join('');

  buildItems();
  renderGrid();

  $('search-input').addEventListener('input', e => { filters.query = e.target.value; renderGrid(); });
  $('filter-dept').addEventListener('change', e => { filters.dept = e.target.value; renderGrid(); });
  $('filter-status').addEventListener('change', e => { filters.status = e.target.value; renderGrid(); });
  $('reset-filters').addEventListener('click', resetFilters);

  [['cat-chips', 'category'], ['grade-chips', 'grade'], ['note-chips', 'note']].forEach(function (pair) {
    $(pair[0]).addEventListener('click', e => {
      const btn = e.target.closest('.chip-btn');
      if (!btn) return;
      document.querySelectorAll('#' + pair[0] + ' .chip-btn').forEach(b => b.classList.toggle('active', b === btn));
      filters[pair[1]] = btn.dataset[pair[1]];
      renderGrid();
    });
  });

  $('open-register').addEventListener('click', openRegister);
  $('empty-register-btn').addEventListener('click', openRegister);

  document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', function () { hideModal($(el.dataset.close)); });
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!$('chat-modal').classList.contains('hidden')) { hideModal($('chat-modal')); return; }
    if (!$('detail-modal').classList.contains('hidden')) hideModal($('detail-modal'));
    if (!$('register-modal').classList.contains('hidden')) hideModal($('register-modal'));
  });

  $('item-grid').addEventListener('click', e => {
    const card = e.target.closest('[data-id]');
    if (card) openDetail(card.dataset.id);
  });

  $('detail-status-group').addEventListener('click', e => {
    const btn = e.target.closest('[data-status]');
    if (btn && currentDetailId) changeStatus(currentDetailId, btn.dataset.status);
  });

  $('detail-chat-btn').addEventListener('click', openChat);
  $('detail-delete-btn').addEventListener('click', deleteItem);

  $('chat-quick').addEventListener('click', e => {
    const btn = e.target.closest('[data-q]');
    if (!btn) return;
    $('chat-input').value = btn.dataset.q;
    sendChat();
  });
  $('chat-send').addEventListener('click', sendChat);
  $('chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendChat();
    }
  });

  $('reg-title').addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) {
      hideSuggestions();
      return;
    }
    renderSuggestions(MOCK_DB.filter(b => b.title.toLowerCase().includes(q)).slice(0, 6));
  });
  $('reg-suggestions').addEventListener('click', e => {
    const btn = e.target.closest('.suggest-item');
    if (!btn) return;
    $('reg-title').value = btn.dataset.title;
    $('reg-category').value = btn.dataset.category;
    $('reg-dept').value = btn.dataset.dept;
    hideSuggestions();
    $('reg-price').focus();
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('#reg-suggestions') && !e.target.closest('#reg-title')) hideSuggestions();
  });

  $('reg-image').addEventListener('change', e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast('이미지 파일만 선택할 수 있습니다.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = function (ev) {
      const img = new Image();
      img.onload = function () {
        const MAX = 500;
        let w = img.width;
        let h = img.height;
        if (w > h && w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
        else if (h >= w && h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        selectedImage = canvas.toDataURL('image/jpeg', 0.75);
        $('reg-preview').src = selectedImage;
        $('reg-preview-wrap').classList.remove('hidden');
        $('reg-image-label').classList.add('hidden');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
  $('reg-remove-image').addEventListener('click', () => {
    selectedImage = null;
    $('reg-image').value = '';
    $('reg-preview-wrap').classList.add('hidden');
    $('reg-image-label').classList.remove('hidden');
  });

  $('register-form').addEventListener('submit', e => {
    e.preventDefault();
    const title = $('reg-title').value.trim();
    const dept = $('reg-dept').value;
    const category = $('reg-category').value;
    const price = parseInt($('reg-price').value, 10);
    const originalPrice = parseInt($('reg-original').value, 10) || 0;
    const condition = $('reg-condition').value;
    const location = $('reg-location').value.trim();
    const desc = $('reg-desc').value.trim();
    if (!title) { toast('물품 제목을 입력해주세요.', 'error'); return; }
    if (!dept) { toast('학과를 선택해주세요.', 'error'); return; }
    if (!category) { toast('품목 카테고리를 선택해주세요.', 'error'); return; }
    if (isNaN(price) || price < 0) { toast('판매 가격을 올바르게 입력해주세요.', 'error'); return; }
    if (!location) { toast('거래 희망 장소를 입력해주세요.', 'error'); return; }
    const users = loadJSON(LS_KEYS.user, []);
    users.push({
      id: 'u' + Date.now(),
      title: title,
      dept: dept,
      category: category,
      price: price,
      originalPrice: originalPrice,
      condition: condition,
      location: location,
      desc: desc,
      status: '판매중',
      seller: '나 (재학생)',
      createdAt: Date.now(),
      image: selectedImage
    });
    if (!saveJSON(LS_KEYS.user, users)) return;
    resetForm();
    hideModal($('register-modal'));
    buildItems();
    renderGrid();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast('판매글이 등록되었습니다! 메인 목록에 바로 반영됩니다.');
  });
}

document.addEventListener('DOMContentLoaded', init);
