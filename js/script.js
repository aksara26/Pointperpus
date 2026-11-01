// DATA INITIALIZATION IN LOCALSTORAGE
const defaultUsers = [
    { username: 'admin', name: 'Arya Wira', role: 'admin', points: 0 },
    { username: '2022101234', name: 'Andi Pratama', role: 'student', points: 35, equippedBorderId: 'frame-gold', equippedBannerId: 'banner-top-reader', ownedItems: ['frame-bronze', 'frame-gold', 'banner-top-reader'] }
];

const defaultRewards = [
    { id: 'banner-top-reader', name: 'Banner Top Reader', description: 'Banner eksklusif untuk pembaca paling aktif.', type: 'banner', points: 30, image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80', cssClass: '', active: true },
    { id: 'frame-bronze', name: 'Border Perunggu', description: 'Border sederhana untuk memulai koleksi.', type: 'border', points: 10, image: '', cssClass: 'frame-bronze', active: true },
    { id: 'frame-silver', name: 'Border Perak', description: 'Border elegan dengan efek glow lembut.', type: 'border', points: 25, image: '', cssClass: 'frame-silver', active: true },
    { id: 'frame-gold', name: 'Border Emas Glowing', description: 'Border paling bergengsi dengan glow emas.', type: 'border', points: 50, image: '', cssClass: 'frame-gold', active: true }
];

if (!localStorage.getItem('perpus_users')) localStorage.setItem('perpus_users', JSON.stringify(defaultUsers));
if (!localStorage.getItem('perpus_rewards')) localStorage.setItem('perpus_rewards', JSON.stringify(defaultRewards));
if (!localStorage.getItem('perpus_redemptions')) localStorage.setItem('perpus_redemptions', JSON.stringify([]));
if (!localStorage.getItem('perpus_history')) {
    // Riwayat awal berfluktuasi untuk membentuk pola grafik realistis
    const initialHistory = [
        { time: '09:00', date: '2026-05-10', monthIndex: 4, username: '2022101234', activity: 'Kunjungan Perpustakaan', points: 1, givenBy: 'Arya Wira' },
        { time: '10:15', date: '2026-06-12', monthIndex: 5, username: '2022101234', activity: 'Peminjaman Buku', points: 1, givenBy: 'Arya Wira' },
        { time: '11:30', date: '2026-07-18', monthIndex: 6, username: '2022101234', activity: 'Kunjungan Perpustakaan', points: 1, givenBy: 'Arya Wira' },
        { time: '13:45', date: '2026-08-22', monthIndex: 7, username: '2022101234', activity: 'Peminjaman Buku', points: 1, givenBy: 'Arya Wira' },
        { time: '14:00', date: '2026-09-05', monthIndex: 8, username: '2022101234', activity: 'Kunjungan Perpustakaan', points: 1, givenBy: 'Arya Wira' },
        { time: '15:20', date: '2026-10-14', monthIndex: 9, username: '2022101234', activity: 'Peminjaman Buku', points: 1, givenBy: 'Arya Wira' }
    ];
    localStorage.setItem('perpus_history', JSON.stringify(initialHistory));
}

let currentUser = null;
let uploadedBase64Image = '';
let editingRewardId = null;
let activeRewardFilterAdmin = 'all';
let activeRewardFilterStudent = 'all';
let confirmAction = null;
let trendChartInstance = null;

// ============================================================
// STORAGE HELPERS (aman jika localStorage rusak / penuh)
// ============================================================
function cloneData(value) {
    return JSON.parse(JSON.stringify(value));
}

function safeParse(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        const parsed = JSON.parse(raw);
        return parsed === null || parsed === undefined ? fallback : parsed;
    } catch (error) {
        console.error(`Gagal membaca localStorage "${key}":`, error);
        return fallback;
    }
}

function safeSave(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Gagal menyimpan localStorage "${key}":`, error);
        return false;
    }
}

function getUsers() {
    const data = safeParse('perpus_users', null);
    return Array.isArray(data) ? data : cloneData(defaultUsers);
}

function saveUsers(users) {
    return safeSave('perpus_users', users);
}

function getRewards() {
    const data = safeParse('perpus_rewards', null);
    return Array.isArray(data) ? data : cloneData(defaultRewards);
}

function saveRewards(rewards) {
    return safeSave('perpus_rewards', rewards);
}

function getRedemptions() {
    const data = safeParse('perpus_redemptions', null);
    return Array.isArray(data) ? data : [];
}

function saveRedemptions(redemptions) {
    return safeSave('perpus_redemptions', redemptions);
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

function getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateID(dateString) {
    if (!dateString) return '-';
    const parts = String(dateString).split('-').map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return dateString;
    const [year, month, day] = parts;
    return new Date(year, month - 1, day).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
}

function formatDateTime(dateString, timeString) {
    const dateLabel = formatDateID(dateString);
    return timeString ? `${dateLabel} • ${timeString}` : dateLabel;
}

// ============================================================
// MIGRASI DATA LAMA: equippedBorder/equippedBanner -> ID
// ============================================================
function migrateUserSchema() {
    const users = getUsers();
    const rewards = getRewards();
    let changed = false;

    users.forEach(user => {
        if (user.role !== 'student') return;

        if (!Array.isArray(user.ownedItems)) {
            user.ownedItems = [];
            changed = true;
        }

        if (!Object.prototype.hasOwnProperty.call(user, 'equippedBorderId')) {
            let borderId = null;

            if (user.equippedBorder === 'custom-image' && user.equippedBorderImage) {
                const found = rewards.find(r => r.type === 'border' && r.image === user.equippedBorderImage);
                borderId = found ? found.id : null;
            } else if (user.equippedBorder) {
                const found = rewards.find(r =>
                    r.type === 'border' &&
                    (r.id === user.equippedBorder || r.cssClass === user.equippedBorder)
                );
                borderId = found ? found.id : null;
            }

            user.equippedBorderId = borderId;
            changed = true;
        }

        if (!Object.prototype.hasOwnProperty.call(user, 'equippedBannerId')) {
            let bannerId = null;

            if (user.equippedBanner) {
                const found = rewards.find(r => r.type === 'banner' && r.image === user.equippedBanner);
                bannerId = found ? found.id : null;
            }

            user.equippedBannerId = bannerId;
            changed = true;
        }

        // Item yang sedang dipakai harus ada di koleksi.
        [user.equippedBorderId, user.equippedBannerId].forEach(itemId => {
            if (itemId && !user.ownedItems.includes(itemId)) {
                user.ownedItems.push(itemId);
                changed = true;
            }
        });
    });

    if (changed) saveUsers(users);
}

// Helper mengambil reward yang sedang dipakai
function getEquippedId(user, type) {
    if (!user) return null;
    return type === 'border' ? (user.equippedBorderId || null) : (user.equippedBannerId || null);
}

function getEquippedReward(user, type) {
    const equippedId = getEquippedId(user, type);
    if (!equippedId) return null;
    return getRewards().find(r => r.id === equippedId && r.type === type) || null;
}

// CUSTOM ALERT MODAL HELPER
function showCustomAlert(message) {
    const msgEl = document.getElementById('alert-message');
    const modalEl = document.getElementById('custom-alert-modal');
    if (msgEl) msgEl.innerText = message;
    if (modalEl) modalEl.classList.remove('hidden');
}

function closeAlertModal() {
    const modalEl = document.getElementById('custom-alert-modal');
    if (modalEl) modalEl.classList.add('hidden');
}

// LOGIN SYSTEM
function handleLogin(e) {
    e.preventDefault();
    const u = document.getElementById('login-username').value.trim();
    const users = getUsers();
    const user = users.find(x => String(x.username).toLowerCase() === u.toLowerCase());

    if (user) {
        currentUser = user;
        startSession();
    } else {
        showCustomAlert('Username tidak ditemukan!');
    }
}

function quickLogin(username) {
    const users = getUsers();
    let user = users.find(x => x.username === username);

    // Jangan reset seluruh data user; cukup tambahkan akun demo yang hilang.
    if (!user) {
        const demoUser = defaultUsers.find(x => x.username === username);
        if (demoUser) {
            user = cloneData(demoUser);
            users.push(user);
            saveUsers(users);
        }
    }

    currentUser = user;

    if (currentUser) {
        const userInput = document.getElementById('login-username');
        const passInput = document.getElementById('login-password');
        if (userInput) userInput.value = username;
        if (passInput) passInput.value = '123456';

        startSession();
    } else {
        showCustomAlert('Akun demo tidak ditemukan.');
    }
}

function startSession() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('app-section').classList.remove('hidden');

    document.getElementById('user-display-name').innerText = currentUser.name;
    document.getElementById('user-display-id').innerText = currentUser.username;
    document.getElementById('sidebar-role-badge').innerText = `Role: ${currentUser.role.toUpperCase()}`;

    // Set default kalender ke tanggal hari ini (tanggal lokal, bukan UTC)
    const datePicker = document.getElementById('app-date-picker');
    if (datePicker) {
        datePicker.value = getLocalDateString();
    }

    if (currentUser.role === 'admin') {
        document.getElementById('admin-menu').classList.remove('hidden');
        document.getElementById('student-menu').classList.add('hidden');
        switchTab('admin-dashboard');
    } else {
        document.getElementById('admin-menu').classList.add('hidden');
        document.getElementById('student-menu').classList.remove('hidden');
        switchTab('student-dashboard');
    }
}

function handleLogout() {
    currentUser = null;
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('app-section').classList.add('hidden');
}

function handleDateChange(selectedDate) {
    if (currentUser && currentUser.role === 'admin') {
        renderAdminDashboard();
    }
}

// TAB SWITCHING
function switchTab(tabName, menuEl = null) {
    document.querySelectorAll('.tab-page').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));

    const target = document.getElementById(`tab-${tabName}`);
    if (target) target.classList.remove('hidden');

    const activeMenu = menuEl || document.querySelector(`.menu-item[data-tab="${tabName}"]`);
    if (activeMenu) activeMenu.classList.add('active');

    const pageMeta = {
        'admin-dashboard': ['Dashboard', 'Ringkasan aktivitas dan tren perpustakaan.'],
        'admin-beri-poin': ['Beri Poin & Presensi', 'Catat kunjungan dan peminjaman mahasiswa.'],
        'admin-rewards': ['Kelola Atribut Profil', 'Atur katalog reward border dan banner mahasiswa.'],
        'admin-pustakawan': ['Kelola Pustakawan', 'Tambahkan akun staf pengelola perpustakaan.'],
        'student-dashboard': ['Profil Saya', 'Lihat poin, koleksi, dan riwayat aktivitasmu.'],
        'student-katalog': ['Katalog Hadiah', 'Tukarkan poin dengan atribut profil eksklusif.']
    };
    const meta = pageMeta[tabName];
    if (meta) {
        const titleEl = document.getElementById('page-title');
        const subtitleEl = document.getElementById('page-subtitle');
        if (titleEl) titleEl.innerText = meta[0];
        if (subtitleEl) subtitleEl.innerText = meta[1];
    }

    if (tabName === 'admin-dashboard') {
        renderAdminDashboard();
    }
    if (tabName === 'admin-rewards') renderAdminRewards();
    if (tabName === 'student-dashboard') renderStudentDashboard();
    if (tabName === 'student-katalog') renderStudentCatalog();
}

// HELPER: SORT REWARDS (BANNER DULUAN, BARU BORDER)
function sortRewardsBannerFirst(rewardsList) {
    return rewardsList.sort((a, b) => {
        if (a.type === 'banner' && b.type === 'border') return -1;
        if (a.type === 'border' && b.type === 'banner') return 1;
        return 0;
    });
}

// ADMIN DASHBOARD & FLUTUATING CHARTS
function renderAdminDashboard() {
    const users = getUsers();
    const history = safeParse('perpus_history', []);

    document.getElementById('kpi-members').innerText = users.filter(x => x.role === 'student').length;

    const datePicker = document.getElementById('app-date-picker');
    const selectedDate = datePicker ? datePicker.value : getLocalDateString();
    const currentMonthIdx = new Date(selectedDate).getMonth();

    const currentMonthVisits = history.filter(x => (x.monthIndex === currentMonthIdx || new Date(x.date).getMonth() === currentMonthIdx) && x.activity.includes('Kunjungan')).length;
    const currentMonthBorrows = history.filter(x => (x.monthIndex === currentMonthIdx || new Date(x.date).getMonth() === currentMonthIdx) && x.activity.includes('Peminjaman')).length;

    document.getElementById('kpi-visits').innerText = currentMonthVisits + 12;
    document.getElementById('kpi-borrows').innerText = currentMonthBorrows + 8;

    const tbody = document.getElementById('table-history');
    tbody.innerHTML = history.slice(-5).reverse().map(h => `
        <tr>
            <td>${escapeHtml(h.time)}</td>
            <td><strong>${escapeHtml(h.username)}</strong></td>
            <td>${escapeHtml(h.activity)}</td>
            <td><span class="badge badge-success">+${escapeHtml(h.points)} Poin</span></td>
            <td>${escapeHtml(h.givenBy)}</td>
        </tr>
    `).join('') || '<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">Belum ada riwayat</td></tr>';

    renderTrendChart(history);
}

function renderTrendChart(history) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    
    // Baseline fluktuasi statistik realistis (naik-turun)
    const visitorData = [12, 19, 14, 25, 18, 30, 22, 28, 35, 24, 31, 20];
    const borrowData  = [ 7, 11,  8, 15, 10, 18, 12, 16, 21, 14, 19, 13];

    history.forEach(h => {
        let mIdx = h.monthIndex;
        if (mIdx === undefined && h.date) {
            mIdx = new Date(h.date).getMonth();
        }
        if (mIdx >= 0 && mIdx < 12) {
            if (h.activity.includes('Kunjungan')) visitorData[mIdx] += 1;
            if (h.activity.includes('Peminjaman')) borrowData[mIdx] += 1;
        }
    });

    const canvas = document.getElementById('libraryTrendChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    if (trendChartInstance) {
        trendChartInstance.destroy();
    }

    trendChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Jumlah Pengunjung (Biru Muda)',
                    data: visitorData,
                    borderColor: '#38bdf8', // Biru Muda
                    backgroundColor: 'rgba(56, 189, 248, 0.18)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.35,
                    pointBackgroundColor: '#38bdf8',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: 'Peminjaman Buku (Biru Tua)',
                    data: borrowData,
                    borderColor: '#0369a1', // Biru Tua
                    backgroundColor: 'rgba(3, 105, 161, 0.15)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.35,
                    pointBackgroundColor: '#0369a1',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { family: 'Plus Jakarta Sans', weight: '700' },
                        color: '#0f172a'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: { font: { family: 'Plus Jakarta Sans' } }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { family: 'Plus Jakarta Sans' } }
                }
            }
        }
    });
}

function handleGivePoints(e) {
    e.preventDefault();
    const memberId = document.getElementById('search-member-id').value.trim();
    const activity = document.getElementById('point-activity').value;
    const pts = parseInt(document.getElementById('point-amount').value, 10);

    const datePicker = document.getElementById('app-date-picker');
    const selectedDate = datePicker ? datePicker.value : getLocalDateString();
    const monthIdx = new Date(selectedDate).getMonth();

    const users = getUsers();
    const member = users.find(x => String(x.username).toLowerCase() === memberId.toLowerCase());

    if (!member) {
        showCustomAlert('Mahasiswa dengan NIM tersebut tidak ditemukan!');
        return;
    }
    if (member.role !== 'student') {
        showCustomAlert('Poin hanya dapat diberikan kepada akun mahasiswa.');
        return;
    }
    if (!Number.isFinite(pts) || pts < 1) {
        showCustomAlert('Jumlah poin minimal 1.');
        return;
    }

    member.points += pts;
    if (!saveUsers(users)) {
        showCustomAlert('Gagal menyimpan poin. Silakan coba lagi.');
        return;
    }

    const history = safeParse('perpus_history', []);
    const now = new Date();
    history.push({
        time: now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        date: selectedDate,
        monthIndex: monthIdx,
        username: member.username,
        activity: activity,
        points: pts,
        givenBy: currentUser.name
    });
    safeSave('perpus_history', history);

    showCustomAlert(`Berhasil mencatat "${activity}" pada tanggal ${selectedDate}! Grafik diperbarui.`);
    document.getElementById('search-member-id').value = '';
    document.getElementById('member-search-preview').style.display = 'none';

    renderAdminDashboard();
}

function searchMemberPreview() {
    const val = document.getElementById('search-member-id').value.trim();
    const users = getUsers();
    const member = users.find(x => String(x.username).toLowerCase() === val.toLowerCase());
    const box = document.getElementById('member-search-preview');

    if (member && member.role === 'student') {
        box.style.display = 'block';
        box.innerHTML = `<p style="font-size:0.85rem;"><i class="fa-solid fa-user-check" style="color:var(--success);"></i> <strong>${escapeHtml(member.name)}</strong> (${escapeHtml(member.username)}) - Total Poin: ${escapeHtml(member.points)}</p>`;
    } else {
        box.style.display = 'none';
    }
}

// FILTER SYSTEM
function setRewardFilter(type, role, buttonEl = null) {
    if (role === 'admin') {
        activeRewardFilterAdmin = type;
        document.querySelectorAll('#tab-admin-rewards .filter-btn').forEach(btn => btn.classList.remove('active'));
        if (buttonEl) buttonEl.classList.add('active');
        renderAdminRewards();
    } else {
        activeRewardFilterStudent = type;
        document.querySelectorAll('#tab-student-katalog .filter-btn').forEach(btn => btn.classList.remove('active'));
        if (buttonEl) buttonEl.classList.add('active');
        renderStudentCatalog();
    }
}

// ============================================================
// CUSTOM CONFIRM (dipakai untuk tukar poin & hapus reward)
// ============================================================
function showCustomConfirm(options = {}, onConfirm = null) {
    const titleEl = document.getElementById('confirm-title');
    const msgEl = document.getElementById('confirm-message');
    const iconEl = document.getElementById('confirm-icon');
    const okBtn = document.getElementById('confirm-btn-ok');

    if (titleEl) titleEl.innerText = options.title || 'Konfirmasi';
    if (msgEl) msgEl.innerText = options.message || '';
    if (iconEl) {
        iconEl.style.color = options.danger ? 'var(--danger)' : 'var(--accent-blue)';
        iconEl.innerHTML = `<i class="fa-solid ${options.icon || 'fa-circle-question'}"></i>`;
    }
    if (okBtn) {
        okBtn.className = `btn flex-1 ${options.confirmClass || 'btn-primary'}`;
        okBtn.innerText = options.confirmText || 'Ya';
    }

    confirmAction = typeof onConfirm === 'function' ? onConfirm : null;
    document.getElementById('custom-confirm-modal').classList.remove('hidden');
}

function closeConfirmModal() {
    confirmAction = null;
    document.getElementById('custom-confirm-modal').classList.add('hidden');
}

// ============================================================
// REWARDS MANAGEMENT (ADMIN)
// ============================================================
function rewardPreviewHtml(reward, isCompact = false) {
    if (reward.type === 'border') {
        const customImageStyle = reward.image
            ? `background-image:url('${escapeHtml(reward.image)}'); background-size:100% 100%; background-repeat:no-repeat; background-position:center;`
            : '';
        return `<div class="avatar-container">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200" class="avatar-img" alt="Avatar">
            <div class="border-overlay ${escapeHtml(reward.cssClass || '')}" style="${customImageStyle}"></div>
        </div>`;
    }

    if (reward.image) {
        const height = isCompact ? 70 : 80;
        return `<img src="${escapeHtml(reward.image)}" alt="${escapeHtml(reward.name)}" style="width:100%; height:${height}px; object-fit:cover; border-radius:8px;">`;
    }

    return `<div class="reward-placeholder"><i class="fa-regular fa-image"></i></div>`;
}

function openAddRewardModal() {
    editingRewardId = null;
    resetRewardForm();
    const titleEl = document.getElementById('reward-modal-title');
    const saveBtn = document.getElementById('reward-save-btn');
    if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-circle-plus"></i> Tambah Border / Banner Baru';
    if (saveBtn) saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Hadiah';
    document.getElementById('reward-modal').classList.remove('hidden');
}

function openEditRewardModal(rewardId) {
    const item = getRewards().find(r => r.id === rewardId);
    if (!item) {
        showCustomAlert('Reward tidak ditemukan.');
        return;
    }

    editingRewardId = rewardId;
    resetRewardForm();

    document.getElementById('reward-name').value = item.name || '';
    document.getElementById('reward-type').value = item.type;
    document.getElementById('reward-points').value = item.points;
    document.getElementById('reward-description').value = item.description || '';
    document.getElementById('reward-active').checked = item.active !== false;

    if (item.image) {
        if (String(item.image).startsWith('data:')) {
            uploadedBase64Image = item.image;
        } else {
            document.getElementById('reward-image-url').value = item.image;
        }
        showRewardPreview(item.image);
    }

    const titleEl = document.getElementById('reward-modal-title');
    const saveBtn = document.getElementById('reward-save-btn');
    if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Border / Banner';
    if (saveBtn) saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Perubahan';
    document.getElementById('reward-modal').classList.remove('hidden');
}

function closeAddRewardModal() {
    document.getElementById('reward-modal').classList.add('hidden');
    resetRewardForm();
    editingRewardId = null;
}

function resetRewardForm() {
    const form = document.getElementById('reward-form');
    if (form) form.reset();
    uploadedBase64Image = '';

    const pointsInput = document.getElementById('reward-points');
    if (pointsInput) pointsInput.value = 10;
    const activeInput = document.getElementById('reward-active');
    if (activeInput) activeInput.checked = true;

    hideRewardPreview();
}

function showRewardPreview(src) {
    const previewContainer = document.getElementById('reward-preview-container');
    const previewImg = document.getElementById('reward-preview-img');
    if (!previewContainer || !previewImg) return;
    previewImg.src = src;
    previewContainer.classList.remove('hidden');
}

function hideRewardPreview() {
    const previewContainer = document.getElementById('reward-preview-container');
    const previewImg = document.getElementById('reward-preview-img');
    if (previewContainer) previewContainer.classList.add('hidden');
    if (previewImg) previewImg.src = '';
}

function handleRewardUrlInput(url) {
    const trimmed = String(url || '').trim();
    if (!trimmed) {
        hideRewardPreview();
        return;
    }

    uploadedBase64Image = '';
    const fileInput = document.getElementById('reward-file');
    if (fileInput) fileInput.value = '';
    showRewardPreview(trimmed);
}

function previewUploadedImage(input) {
    const file = input.files && input.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        uploadedBase64Image = '';
        hideRewardPreview();
        showCustomAlert('File harus berupa gambar (PNG/JPG/WebP).');
        input.value = '';
        return;
    }

    if (file.size > 3 * 1024 * 1024) {
        uploadedBase64Image = '';
        hideRewardPreview();
        showCustomAlert('Ukuran gambar maksimal 3MB.');
        input.value = '';
        return;
    }

    const type = document.getElementById('reward-type').value;
    const maxDimension = type === 'banner' ? 1200 : 512;

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(img.width * scale));
            canvas.height = Math.max(1, Math.round(img.height * scale));
            const ctx = canvas.getContext('2d');

            // JPEG tidak mendukung transparansi; beri latar putih untuk banner.
            if (type === 'banner') {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Border butuh transparansi (PNG), banner boleh JPEG agar hemat storage.
            uploadedBase64Image = type === 'border'
                ? canvas.toDataURL('image/png')
                : canvas.toDataURL('image/jpeg', 0.85);

            const urlInput = document.getElementById('reward-image-url');
            if (urlInput) urlInput.value = '';
            showRewardPreview(uploadedBase64Image);
        };
        img.onerror = function() {
            showCustomAlert('Gambar tidak bisa dibaca. Coba file lain.');
            input.value = '';
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function handleSaveReward(e) {
    e.preventDefault();

    const name = document.getElementById('reward-name').value.trim();
    const description = document.getElementById('reward-description').value.trim();
    const type = document.getElementById('reward-type').value;
    const points = parseInt(document.getElementById('reward-points').value, 10);
    const active = document.getElementById('reward-active').checked;
    const urlInput = document.getElementById('reward-image-url').value.trim();
    const wasEditing = Boolean(editingRewardId);

    const rewards = getRewards();
    const existing = editingRewardId ? rewards.find(r => r.id === editingRewardId) : null;
    const finalImage = uploadedBase64Image || urlInput || (existing ? existing.image : '');

    if (!name) {
        showCustomAlert('Nama atribut wajib diisi.');
        return;
    }
    if (!Number.isFinite(points) || points < 1) {
        showCustomAlert('Harga poin minimal 1.');
        return;
    }

    const duplicate = rewards.find(r =>
        r.id !== editingRewardId &&
        String(r.name).toLowerCase() === name.toLowerCase()
    );
    if (duplicate) {
        showCustomAlert('Nama reward sudah digunakan. Pilih nama lain.');
        return;
    }

    if (type === 'banner' && !finalImage) {
        showCustomAlert('Banner wajib memiliki gambar (upload atau URL).');
        return;
    }
    if (type === 'border' && !finalImage && !(existing && existing.cssClass)) {
        showCustomAlert('Border baru wajib memiliki gambar/URL.');
        return;
    }

    const payload = {
        id: editingRewardId || 'custom-' + Date.now(),
        name,
        description,
        type,
        points,
        image: finalImage,
        cssClass: existing ? (existing.cssClass || '') : '',
        active
    };

    let nextRewards;
    if (editingRewardId) {
        nextRewards = rewards.map(r => r.id === editingRewardId ? payload : r);
    } else {
        nextRewards = rewards.concat(payload);
    }

    if (!saveRewards(nextRewards)) {
        showCustomAlert('Gagal menyimpan reward. Gambar mungkin terlalu besar untuk localStorage.');
        return;
    }

    // Kalau tipe reward diubah, lepas dari mahasiswa yang memakainya agar data tidak rancu.
    if (existing && existing.type !== type) {
        const users = getUsers();
        users.forEach(user => {
            if (user.equippedBorderId === payload.id) user.equippedBorderId = null;
            if (user.equippedBannerId === payload.id) user.equippedBannerId = null;
        });
        saveUsers(users);
    }

    closeAddRewardModal();
    renderAdminRewards();
    showCustomAlert(wasEditing ? 'Reward berhasil diperbarui!' : 'Reward baru berhasil ditambahkan!');
}

function toggleRewardActive(rewardId) {
    const rewards = getRewards();
    const item = rewards.find(r => r.id === rewardId);
    if (!item) return;

    item.active = item.active === false;
    if (!saveRewards(rewards)) {
        showCustomAlert('Gagal mengubah status reward.');
        return;
    }

    renderAdminRewards();
    showCustomAlert(`"${item.name}" sekarang ${item.active ? 'aktif' : 'nonaktif'}.`);
}

function deleteReward(rewardId) {
    const item = getRewards().find(r => r.id === rewardId);
    if (!item) return;

    showCustomConfirm({
        title: 'Hapus Reward',
        message: `Hapus "${item.name}"? Item ini akan dilepas dan dihapus dari koleksi semua mahasiswa yang memilikinya.`,
        confirmText: 'Hapus',
        confirmClass: 'btn-danger',
        icon: 'fa-trash-can',
        danger: true
    }, function() {
        const nextRewards = getRewards().filter(r => r.id !== rewardId);
        if (!saveRewards(nextRewards)) {
            showCustomAlert('Gagal menghapus reward.');
            return;
        }

        const users = getUsers();
        users.forEach(user => {
            user.ownedItems = (user.ownedItems || []).filter(id => id !== rewardId);
            if (user.equippedBorderId === rewardId) user.equippedBorderId = null;
            if (user.equippedBannerId === rewardId) user.equippedBannerId = null;
        });
        saveUsers(users);

        if (currentUser) {
            currentUser.ownedItems = (currentUser.ownedItems || []).filter(id => id !== rewardId);
            if (currentUser.equippedBorderId === rewardId) currentUser.equippedBorderId = null;
            if (currentUser.equippedBannerId === rewardId) currentUser.equippedBannerId = null;
        }

        renderAdminRewards();
        showCustomAlert('Reward berhasil dihapus dari katalog dan koleksi mahasiswa.');
    });
}

function renderAdminRewards() {
    let rewards = getRewards();
    rewards = sortRewardsBannerFirst(rewards);

    if (activeRewardFilterAdmin !== 'all') {
        rewards = rewards.filter(r => r.type === activeRewardFilterAdmin);
    }

    const container = document.getElementById('admin-rewards-grid');

    if (!rewards.length) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:var(--text-muted); padding:30px;">Tidak ada atribut pada kategori ini.</div>`;
    } else {
        container.innerHTML = rewards.map(r => {
            const isActive = r.active !== false;
            return `
                <div class="glass-card text-center reward-admin-card">
                    <div class="reward-card-actions">
                        <button onclick="openEditRewardModal('${r.id}')" class="icon-btn" title="Edit reward"><i class="fa-solid fa-pen"></i></button>
                        <button onclick="toggleRewardActive('${r.id}')" class="icon-btn ${isActive ? 'icon-btn-success' : ''}" title="${isActive ? 'Nonaktifkan reward' : 'Aktifkan reward'}"><i class="fa-solid ${isActive ? 'fa-eye' : 'fa-eye-slash'}"></i></button>
                        <button onclick="deleteReward('${r.id}')" class="icon-btn icon-btn-danger" title="Hapus reward"><i class="fa-solid fa-trash"></i></button>
                    </div>
                    <div class="reward-preview-area">
                        ${rewardPreviewHtml(r)}
                    </div>
                    <h4 class="reward-name">${escapeHtml(r.name)}</h4>
                    <p class="reward-type-line">${escapeHtml(r.type.toUpperCase())} • ${escapeHtml(r.points)} Poin</p>
                    ${r.description ? `<p class="reward-description">${escapeHtml(r.description)}</p>` : ''}
                    <span class="badge ${isActive ? 'badge-success' : 'badge-muted'}">${isActive ? 'Aktif' : 'Nonaktif'}</span>
                </div>
            `;
        }).join('');
    }

    renderAdminRedemptions();
}

function renderAdminRedemptions() {
    const tbody = document.getElementById('admin-redemption-table');
    if (!tbody) return;

    const items = getRedemptions().slice().reverse();
    const totalPoints = items.reduce((sum, item) => sum + (Number(item.points) || 0), 0);
    const countEl = document.getElementById('admin-redemption-count');
    const totalEl = document.getElementById('admin-redemption-total');

    if (countEl) countEl.innerText = `${items.length} Transaksi`;
    if (totalEl) totalEl.innerText = `${totalPoints} Poin`;

    tbody.innerHTML = items.slice(0, 10).map(item => `
        <tr>
            <td>${escapeHtml(formatDateTime(item.date, item.time))}</td>
            <td>
                <strong>${escapeHtml(item.studentName || item.username)}</strong><br>
                <span class="table-subtext">${escapeHtml(item.username)}</span>
            </td>
            <td>${escapeHtml(item.rewardName)}</td>
            <td><span class="badge badge-primary">${escapeHtml(String(item.type).toUpperCase())}</span></td>
            <td><span class="badge badge-danger">-${escapeHtml(item.points)} Poin</span></td>
        </tr>
    `).join('') || '<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">Belum ada penukaran reward</td></tr>';
}

// LIBRARIAN MANAGEMENT
function handleAddLibrarian(e) {
    e.preventDefault();
    const name = document.getElementById('new-lib-name').value.trim();
    const username = document.getElementById('new-lib-username').value.trim();

    if (!name || !username) {
        showCustomAlert('Nama dan username pustakawan wajib diisi.');
        return;
    }

    const users = getUsers();
    const duplicate = users.find(x => String(x.username).toLowerCase() === username.toLowerCase());
    if (duplicate) {
        showCustomAlert('Username sudah digunakan. Pilih username lain.');
        return;
    }

    users.push({ username, name, role: 'admin', points: 0 });
    if (!saveUsers(users)) {
        showCustomAlert('Gagal mendaftarkan pustakawan.');
        return;
    }

    showCustomAlert(`Pustakawan ${name} berhasil didaftarkan ke sistem!`);
    document.getElementById('new-lib-name').value = '';
    document.getElementById('new-lib-username').value = '';
    document.getElementById('new-lib-password').value = '';
}

// ============================================================
// STUDENT FEATURES
// ============================================================
function renderStudentDashboard() {
    if (!currentUser || currentUser.role !== 'student') return;

    document.getElementById('student-name-display').innerText = currentUser.name;
    document.getElementById('student-nim-display').innerText = currentUser.username;
    document.getElementById('student-points-badge').innerText = currentUser.points;

    const border = getEquippedReward(currentUser, 'border');
    const borderFrame = document.getElementById('student-border-frame');

    if (borderFrame) {
        if (border && border.image) {
            borderFrame.className = 'border-overlay';
            borderFrame.style.backgroundImage = `url('${border.image}')`;
            borderFrame.style.backgroundSize = '100% 100%';
            borderFrame.style.backgroundRepeat = 'no-repeat';
            borderFrame.style.backgroundPosition = 'center';
        } else {
            borderFrame.style.backgroundImage = '';
            borderFrame.className = 'border-overlay ' + (border ? (border.cssClass || '') : '');
        }
    }

    const banner = getEquippedReward(currentUser, 'banner');
    const bannerEl = document.getElementById('student-profile-banner');
    if (bannerEl) {
        bannerEl.style.backgroundImage = banner && banner.image ? `url('${banner.image}')` : '';
    }

    const history = safeParse('perpus_history', [])
        .filter(x => x.username === currentUser.username)
        .reverse();

    document.getElementById('student-history-table').innerHTML = history.map(h => `
        <tr>
            <td>${escapeHtml(formatDateTime(h.date, h.time))}</td>
            <td>${escapeHtml(h.activity)}</td>
            <td><span class="badge badge-success">+${escapeHtml(h.points)} Poin</span></td>
            <td>${escapeHtml(h.givenBy)}</td>
        </tr>
    `).join('') || '<tr><td colspan="4" style="text-align:center;">Belum ada riwayat poin</td></tr>';

    renderStudentRedemptions();
}

function renderStudentRedemptions() {
    const tbody = document.getElementById('student-redemption-table');
    if (!tbody) return;

    const items = getRedemptions()
        .filter(item => item.username === currentUser.username)
        .reverse();
    const totalPoints = items.reduce((sum, item) => sum + (Number(item.points) || 0), 0);

    const totalEl = document.getElementById('student-redemption-total');
    if (totalEl) totalEl.innerText = `${totalPoints} Poin`;

    tbody.innerHTML = items.map(item => `
        <tr>
            <td>${escapeHtml(formatDateTime(item.date, item.time))}</td>
            <td>${escapeHtml(item.rewardName)}</td>
            <td><span class="badge badge-primary">${escapeHtml(String(item.type).toUpperCase())}</span></td>
            <td><span class="badge badge-danger">-${escapeHtml(item.points)} Poin</span></td>
        </tr>
    `).join('') || '<tr><td colspan="4" style="text-align:center;">Belum ada penukaran reward</td></tr>';
}

function renderStudentCatalog() {
    if (!currentUser || currentUser.role !== 'student') return;

    let rewards = getRewards();
    const owned = Array.isArray(currentUser.ownedItems) ? currentUser.ownedItems : [];

    // Sembunyikan reward nonaktif, kecuali yang sudah dimiliki mahasiswa.
    rewards = rewards.filter(r => r.active !== false || owned.includes(r.id));
    rewards = sortRewardsBannerFirst(rewards);

    if (activeRewardFilterStudent === 'owned') {
        rewards = rewards.filter(r => owned.includes(r.id));
    } else if (activeRewardFilterStudent !== 'all') {
        rewards = rewards.filter(r => r.type === activeRewardFilterStudent);
    }

    const container = document.getElementById('student-catalog-grid');

    if (!rewards.length) {
        const emptyMessage = activeRewardFilterStudent === 'owned'
            ? 'Kamu belum memiliki reward. Tukarkan poinmu di katalog!'
            : 'Tidak ada atribut pada kategori ini.';
        container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:var(--text-muted); padding:30px;">${emptyMessage}</div>`;
        return;
    }

    container.innerHTML = rewards.map(r => {
        const isOwned = owned.includes(r.id);
        const isEquipped = getEquippedId(currentUser, r.type) === r.id;
        const isActive = r.active !== false;
        const canAfford = currentUser.points >= r.points;

        let actionButton;
        if (isEquipped) {
            actionButton = `<button onclick="unequipItem('${r.type}')" class="btn btn-secondary" style="width:100%;"><i class="fa-solid fa-xmark"></i> Lepas</button>`;
        } else if (isOwned) {
            actionButton = `<button onclick="equipItem('${r.id}')" class="btn btn-secondary" style="width:100%;"><i class="fa-solid fa-check"></i> Pakai</button>`;
        } else if (!isActive) {
            actionButton = `<button class="btn btn-secondary" disabled style="width:100%; opacity:0.5;"><i class="fa-solid fa-ban"></i> Tidak Tersedia</button>`;
        } else if (canAfford) {
            actionButton = `<button onclick="requestBuyReward('${r.id}')" class="btn btn-primary" style="width:100%;"><i class="fa-solid fa-bag-shopping"></i> Tukar & Pakai</button>`;
        } else {
            actionButton = `<button class="btn btn-secondary" disabled style="width:100%; opacity:0.5;"><i class="fa-solid fa-lock"></i> Butuh ${r.points - currentUser.points} Poin Lagi</button>`;
        }

        return `
            <div class="glass-card text-center flex flex-col justify-between reward-student-card">
                <div>
                    <div class="reward-badges">
                        ${isEquipped ? '<span class="badge badge-success">Dipakai</span>' : ''}
                        ${isOwned && !isEquipped ? '<span class="badge badge-primary">Dimiliki</span>' : ''}
                        ${!isActive ? '<span class="badge badge-muted">Nonaktif</span>' : ''}
                    </div>
                    <div class="reward-preview-area">
                        ${rewardPreviewHtml(r, true)}
                    </div>
                    <h4 class="reward-name">${escapeHtml(r.name)}</h4>
                    ${r.description ? `<p class="reward-description">${escapeHtml(r.description)}</p>` : ''}
                    <p class="reward-type-line">Harga: ${escapeHtml(r.points)} Poin</p>
                </div>
                ${actionButton}
            </div>
        `;
    }).join('');
}

function requestBuyReward(rewardId) {
    const item = getRewards().find(r => r.id === rewardId);
    if (!item) {
        showCustomAlert('Reward tidak ditemukan.');
        return;
    }
    if (item.active === false) {
        showCustomAlert('Reward ini sedang tidak tersedia.');
        return;
    }

    const owned = Array.isArray(currentUser.ownedItems) ? currentUser.ownedItems : [];
    if (owned.includes(rewardId)) {
        showCustomAlert('Kamu sudah memiliki reward ini.');
        return;
    }
    if (currentUser.points < item.points) {
        showCustomAlert(`Poin tidak cukup. Kamu butuh ${item.points - currentUser.points} poin lagi.`);
        return;
    }

    showCustomConfirm({
        title: 'Tukar Poin',
        message: `Tukar ${item.points} poin untuk "${item.name}"? Sisa poin setelah penukaran: ${currentUser.points - item.points}.`,
        confirmText: 'Tukar & Pakai',
        confirmClass: 'btn-primary',
        icon: 'fa-bag-shopping'
    }, function() {
        redeemReward(rewardId);
    });
}

function redeemReward(rewardId) {
    const rewards = getRewards();
    const item = rewards.find(r => r.id === rewardId);
    if (!item) {
        showCustomAlert('Reward tidak ditemukan.');
        return;
    }
    if (item.active === false) {
        showCustomAlert('Reward ini sedang tidak tersedia.');
        return;
    }

    const users = getUsers();
    const user = users.find(x => x.username === currentUser.username);
    if (!user) {
        showCustomAlert('Data mahasiswa tidak ditemukan.');
        return;
    }

    user.ownedItems = Array.isArray(user.ownedItems) ? user.ownedItems : [];
    if (user.ownedItems.includes(rewardId)) {
        showCustomAlert('Kamu sudah memiliki reward ini.');
        return;
    }
    if (user.points < item.points) {
        showCustomAlert('Poin tidak cukup untuk menukar reward ini.');
        return;
    }

    user.points -= item.points;
    user.ownedItems.push(item.id);

    if (item.type === 'border') {
        user.equippedBorderId = item.id;
    } else {
        user.equippedBannerId = item.id;
    }

    if (!saveUsers(users)) {
        showCustomAlert('Gagal menyimpan penukaran. Silakan coba lagi.');
        return;
    }

    const now = new Date();
    const redemptions = getRedemptions();
    redemptions.push({
        id: 'rdm-' + Date.now(),
        username: user.username,
        studentName: user.name,
        rewardId: item.id,
        rewardName: item.name,
        type: item.type,
        points: item.points,
        date: getLocalDateString(now),
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    if (!saveRedemptions(redemptions)) {
        console.error('Gagal menyimpan riwayat penukaran reward.');
    }

    currentUser = user;
    renderStudentCatalog();
    renderStudentDashboard();
    showCustomAlert(`Berhasil menukar "${item.name}"! Poinmu sekarang ${user.points}.`);
}

function equipItem(rewardId) {
    const item = getRewards().find(r => r.id === rewardId);
    if (!item) {
        showCustomAlert('Reward tidak ditemukan.');
        return;
    }

    const users = getUsers();
    const user = users.find(x => x.username === currentUser.username);
    if (!user) {
        showCustomAlert('Data mahasiswa tidak ditemukan.');
        return;
    }

    const owned = Array.isArray(user.ownedItems) ? user.ownedItems : [];
    if (!owned.includes(rewardId)) {
        showCustomAlert('Kamu belum memiliki reward ini.');
        return;
    }

    if (item.type === 'border') {
        user.equippedBorderId = item.id;
    } else {
        user.equippedBannerId = item.id;
    }

    if (!saveUsers(users)) {
        showCustomAlert('Gagal memakai reward. Silakan coba lagi.');
        return;
    }

    currentUser = user;
    renderStudentCatalog();
    renderStudentDashboard();
}

function unequipItem(type) {
    const users = getUsers();
    const user = users.find(x => x.username === currentUser.username);
    if (!user) return;

    if (type === 'border') {
        user.equippedBorderId = null;
    } else {
        user.equippedBannerId = null;
    }

    if (!saveUsers(users)) {
        showCustomAlert('Gagal melepas reward.');
        return;
    }

    currentUser = user;
    renderStudentCatalog();
    renderStudentDashboard();
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    migrateUserSchema();

    const btnOk = document.getElementById('confirm-btn-ok');
    const btnCancel = document.getElementById('confirm-btn-cancel');

    if (btnOk) {
        btnOk.onclick = function() {
            const action = confirmAction;
            closeConfirmModal();
            if (typeof action === 'function') action();
        };
    }

    if (btnCancel) {
        btnCancel.onclick = function() {
            closeConfirmModal();
        };
    }
});