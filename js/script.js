// DATA INITIALIZATION IN LOCALSTORAGE
const defaultUsers = [
    { username: 'admin', name: 'Arya Wira', role: 'admin', points: 0 },
    { username: '2022101234', name: 'Andi Pratama', role: 'student', points: 35, equippedBorder: 'frame-gold', equippedBanner: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80', ownedItems: ['frame-bronze', 'frame-gold'] }
];

const defaultRewards = [
    { id: 'banner-top-reader', name: 'Banner Top Reader', type: 'banner', points: 30, image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80', cssClass: '' },
    { id: 'frame-bronze', name: 'Border Perunggu', type: 'border', points: 10, image: '', cssClass: 'frame-bronze' },
    { id: 'frame-silver', name: 'Border Perak', type: 'border', points: 25, image: '', cssClass: 'frame-silver' },
    { id: 'frame-gold', name: 'Border Emas Glowing', type: 'border', points: 50, image: '', cssClass: 'frame-gold' }
];

if (!localStorage.getItem('perpus_users')) localStorage.setItem('perpus_users', JSON.stringify(defaultUsers));
if (!localStorage.getItem('perpus_rewards')) localStorage.setItem('perpus_rewards', JSON.stringify(defaultRewards));
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
let activeRewardFilterAdmin = 'all';
let activeRewardFilterStudent = 'all';
let rewardIdToDelete = null;
let trendChartInstance = null;

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
    const users = JSON.parse(localStorage.getItem('perpus_users'));
    const user = users.find(x => x.username.toLowerCase() === u.toLowerCase());

    if (user) {
        currentUser = user;
        startSession();
    } else {
        showCustomAlert('Username tidak ditemukan!');
    }
}

function quickLogin(username) {
    let users = JSON.parse(localStorage.getItem('perpus_users'));
    if (!users || !Array.isArray(users) || !users.find(x => x.username === username)) {
        localStorage.setItem('perpus_users', JSON.stringify(defaultUsers));
        users = defaultUsers;
    }

    currentUser = users.find(x => x.username === username);
    
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

    // Set default kalender ke tanggal hari ini saat login
    const datePicker = document.getElementById('app-date-picker');
    if (datePicker) {
        datePicker.value = new Date().toISOString().split('T')[0];
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
function switchTab(tabName) {
    document.querySelectorAll('.tab-page').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));

    const target = document.getElementById(`tab-${tabName}`);
    if (target) target.classList.remove('hidden');

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
    const users = JSON.parse(localStorage.getItem('perpus_users'));
    const history = JSON.parse(localStorage.getItem('perpus_history'));

    document.getElementById('kpi-members').innerText = users.filter(x => x.role === 'student').length;

    const datePicker = document.getElementById('app-date-picker');
    const selectedDate = datePicker ? datePicker.value : new Date().toISOString().split('T')[0];
    const currentMonthIdx = new Date(selectedDate).getMonth();

    const currentMonthVisits = history.filter(x => (x.monthIndex === currentMonthIdx || new Date(x.date).getMonth() === currentMonthIdx) && x.activity.includes('Kunjungan')).length;
    const currentMonthBorrows = history.filter(x => (x.monthIndex === currentMonthIdx || new Date(x.date).getMonth() === currentMonthIdx) && x.activity.includes('Peminjaman')).length;

    document.getElementById('kpi-visits').innerText = currentMonthVisits + 12;
    document.getElementById('kpi-borrows').innerText = currentMonthBorrows + 8;

    const tbody = document.getElementById('table-history');
    tbody.innerHTML = history.slice(-5).reverse().map(h => `
        <tr>
            <td>${h.time}</td>
            <td><strong>${h.username}</strong></td>
            <td>${h.activity}</td>
            <td><span class="badge badge-success">+${h.points} Poin</span></td>
            <td>${h.givenBy}</td>
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
    const pts = parseInt(document.getElementById('point-amount').value);

    const datePicker = document.getElementById('app-date-picker');
    const selectedDate = datePicker ? datePicker.value : new Date().toISOString().split('T')[0];
    const monthIdx = new Date(selectedDate).getMonth();

    let users = JSON.parse(localStorage.getItem('perpus_users'));
    let member = users.find(x => x.username === memberId);

    if (!member) {
        showCustomAlert('Mahasiswa dengan NIM tersebut tidak ditemukan!');
        return;
    }

    member.points += pts;
    localStorage.setItem('perpus_users', JSON.stringify(users));

    let history = JSON.parse(localStorage.getItem('perpus_history'));
    const now = new Date();
    history.push({
        time: now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        date: selectedDate,
        monthIndex: monthIdx,
        username: memberId,
        activity: activity,
        points: pts,
        givenBy: currentUser.name
    });
    localStorage.setItem('perpus_history', JSON.stringify(history));

    showCustomAlert(`Berhasil mencatat "${activity}" pada tanggal ${selectedDate}! Grafik diperbarui.`);
    document.getElementById('search-member-id').value = '';
    document.getElementById('member-search-preview').style.display = 'none';

    renderAdminDashboard();
}

function searchMemberPreview() {
    const val = document.getElementById('search-member-id').value.trim();
    const users = JSON.parse(localStorage.getItem('perpus_users'));
    const member = users.find(x => x.username === val);
    const box = document.getElementById('member-search-preview');

    if (member) {
        box.style.display = 'block';
        box.innerHTML = `<p style="font-size:0.85rem;"><i class="fa-solid fa-user-check" style="color:var(--success);"></i> <strong>${member.name}</strong> (${member.username}) - Total Poin: ${member.points}</p>`;
    } else {
        box.style.display = 'none';
    }
}

// FILTER SYSTEM
function setRewardFilter(type, role) {
    if (role === 'admin') {
        activeRewardFilterAdmin = type;
        const buttons = document.querySelectorAll('#tab-admin-rewards .filter-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        if (event && event.currentTarget) event.currentTarget.classList.add('active');
        renderAdminRewards();
    } else {
        activeRewardFilterStudent = type;
        const buttons = document.querySelectorAll('#tab-student-katalog .filter-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        if (event && event.currentTarget) event.currentTarget.classList.add('active');
        renderStudentCatalog();
    }
}

// REWARDS MANAGEMENT (ADMIN)
function openAddRewardModal() {
    document.getElementById('reward-modal').classList.remove('hidden');
}

function closeAddRewardModal() {
    document.getElementById('reward-modal').classList.add('hidden');
}

function previewUploadedImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedBase64Image = e.target.result;
            document.getElementById('reward-preview-img').src = uploadedBase64Image;
            document.getElementById('reward-preview-container').classList.remove('hidden');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function handleSaveReward(e) {
    e.preventDefault();
    const name = document.getElementById('reward-name').value;
    const type = document.getElementById('reward-type').value;
    const points = parseInt(document.getElementById('reward-points').value);
    const urlInput = document.getElementById('reward-image-url').value;

    const finalImage = uploadedBase64Image || urlInput || '';

    const rewards = JSON.parse(localStorage.getItem('perpus_rewards'));
    rewards.push({
        id: 'custom-' + Date.now(),
        name: name,
        type: type,
        points: points,
        image: finalImage,
        cssClass: ''
    });

    localStorage.setItem('perpus_rewards', JSON.stringify(rewards));
    closeAddRewardModal();
    renderAdminRewards();
    showCustomAlert('Atribut baru berhasil ditambahkan!');
}

function deleteReward(rewardId) {
    rewardIdToDelete = rewardId;
    document.getElementById('custom-confirm-modal').classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    const btnOk = document.getElementById('confirm-btn-ok');
    const btnCancel = document.getElementById('confirm-btn-cancel');

    if (btnOk) {
        btnOk.onclick = function() {
            if (rewardIdToDelete) {
                let rewards = JSON.parse(localStorage.getItem('perpus_rewards'));
                rewards = rewards.filter(r => r.id !== rewardIdToDelete);
                localStorage.setItem('perpus_rewards', JSON.stringify(rewards));
                renderAdminRewards();
                showCustomAlert('Atribut berhasil dihapus!');
            }
            closeConfirmModal();
        };
    }

    if (btnCancel) {
        btnCancel.onclick = function() {
            closeConfirmModal();
        };
    }
});

function closeConfirmModal() {
    rewardIdToDelete = null;
    document.getElementById('custom-confirm-modal').classList.add('hidden');
}

function renderAdminRewards() {
    let rewards = JSON.parse(localStorage.getItem('perpus_rewards'));
    rewards = sortRewardsBannerFirst(rewards);

    if (activeRewardFilterAdmin !== 'all') {
        rewards = rewards.filter(r => r.type === activeRewardFilterAdmin);
    }

    const container = document.getElementById('admin-rewards-grid');

    if (rewards.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:var(--text-muted); padding:30px;">Tidak ada atribut pada kategori ini.</div>`;
        return;
    }

    container.innerHTML = rewards.map(r => `
        <div class="glass-card text-center" style="position:relative;">
            <button onclick="deleteReward('${r.id}')" class="btn-delete-reward" title="Hapus Hadiah"><i class="fa-solid fa-trash"></i></button>
            <div style="height:100px; display:flex; align-items:center; justify-content:center; margin-bottom:10px;">
                ${r.type === 'border' 
                    ? `<div class="avatar-container"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200" class="avatar-img"><div class="border-overlay ${r.cssClass}" style="${r.image ? `background-image:url(${r.image}); background-size:100% 100%; background-repeat:no-repeat; background-position:center;` : ''}"></div></div>`
                    : `<img src="${r.image}" style="width:100%; height:80px; object-fit:cover; border-radius:8px;">`
                }
            </div>
            <h4 style="font-weight:700;">${r.name}</h4>
            <p style="font-size:0.8rem; color:var(--text-muted);">${r.type.toUpperCase()} • ${r.points} Poin</p>
        </div>
    `).join('');
}

// LIBRARIAN MANAGEMENT
function handleAddLibrarian(e) {
    e.preventDefault();
    const name = document.getElementById('new-lib-name').value;
    const username = document.getElementById('new-lib-username').value;

    let users = JSON.parse(localStorage.getItem('perpus_users'));
    users.push({ username, name, role: 'admin', points: 0 });
    localStorage.setItem('perpus_users', JSON.stringify(users));

    showCustomAlert(`Pustakawan ${name} berhasil didaftarkan ke sistem!`);
    document.getElementById('new-lib-name').value = '';
    document.getElementById('new-lib-username').value = '';
    document.getElementById('new-lib-password').value = '';
}

// STUDENT FEATURES
function renderStudentDashboard() {
    document.getElementById('student-name-display').innerText = currentUser.name;
    document.getElementById('student-nim-display').innerText = currentUser.username;
    document.getElementById('student-points-badge').innerText = currentUser.points;

    const borderFrame = document.getElementById('student-border-frame');
    if (currentUser.equippedBorder === 'custom-image' && currentUser.equippedBorderImage) {
        borderFrame.className = 'border-overlay';
        borderFrame.style.backgroundImage = `url('${currentUser.equippedBorderImage}')`;
        borderFrame.style.backgroundSize = '100% 100%';
        borderFrame.style.backgroundRepeat = 'no-repeat';
        borderFrame.style.backgroundPosition = 'center';
    } else {
        borderFrame.style.backgroundImage = '';
        borderFrame.className = 'border-overlay ' + (currentUser.equippedBorder || '');
    }

    if (currentUser.equippedBanner) {
        document.getElementById('student-profile-banner').style.backgroundImage = `url('${currentUser.equippedBanner}')`;
    }

    const history = JSON.parse(localStorage.getItem('perpus_history')).filter(x => x.username === currentUser.username);
    document.getElementById('student-history-table').innerHTML = history.reverse().map(h => `
        <tr>
            <td>${h.time}</td>
            <td>${h.activity}</td>
            <td><span class="badge badge-success">+${h.points} Poin</span></td>
            <td>${h.givenBy}</td>
        </tr>
    `).join('') || '<tr><td colspan="4" style="text-align:center;">Belum ada riwayat poin</td></tr>';
}

function renderStudentCatalog() {
    let rewards = JSON.parse(localStorage.getItem('perpus_rewards'));
    rewards = sortRewardsBannerFirst(rewards);

    if (activeRewardFilterStudent !== 'all') {
        rewards = rewards.filter(r => r.type === activeRewardFilterStudent);
    }

    const container = document.getElementById('student-catalog-grid');
    const owned = currentUser.ownedItems || [];

    if (rewards.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:var(--text-muted); padding:30px;">Tidak ada atribut pada kategori ini.</div>`;
        return;
    }

    container.innerHTML = rewards.map(r => {
        const isOwned = owned.includes(r.id);
        const canAfford = currentUser.points >= r.points;

        return `
            <div class="glass-card text-center flex flex-col justify-between">
                <div>
                    <div style="height:90px; display:flex; align-items:center; justify-content:center; margin-bottom:10px;">
                        ${r.type === 'border'
                            ? `<div class="avatar-container"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200" class="avatar-img"><div class="border-overlay ${r.cssClass}" style="${r.image ? `background-image:url(${r.image}); background-size:100% 100%; background-repeat:no-repeat; background-position:center;` : ''}"></div></div>`
                            : `<img src="${r.image}" style="width:100%; height:70px; object-fit:cover; border-radius:8px;">`
                        }
                    </div>
                    <h4 style="font-weight:700;">${r.name}</h4>
                    <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:15px;">Harga: ${r.points} Poin</p>
                </div>

                ${isOwned 
                    ? `<button onclick="equipItem('${r.id}', '${r.type}')" class="btn btn-secondary" style="width:100%;"><i class="fa-solid fa-circle-check"></i> Pakai Atribut</button>`
                    : (canAfford 
                        ? `<button onclick="buyAndEquip('${r.id}', ${r.points}, '${r.type}')" class="btn btn-primary" style="width:100%;"><i class="fa-solid fa-bag-shopping"></i> Tukar & Pakai</button>`
                        : `<button class="btn btn-secondary" disabled style="width:100%; opacity:0.5;"><i class="fa-solid fa-lock"></i> Butuh ${r.points - currentUser.points} Poin Lagi</button>`
                      )
                }
            </div>
        `;
    }).join('');
}

function buyAndEquip(rewardId, cost, type) {
    currentUser.points -= cost;
    if (!currentUser.ownedItems) currentUser.ownedItems = [];
    currentUser.ownedItems.push(rewardId);

    equipItem(rewardId, type);
    showCustomAlert('Berhasil menukarkan poin dan langsung memakai atribut!');
}

function equipItem(rewardId, type) {
    const rewards = JSON.parse(localStorage.getItem('perpus_rewards'));
    const item = rewards.find(x => x.id === rewardId);

    if (type === 'border') {
        if (item.image) {
            currentUser.equippedBorder = 'custom-image';
            currentUser.equippedBorderImage = item.image;
        } else {
            currentUser.equippedBorder = item.cssClass || '';
            currentUser.equippedBorderImage = '';
        }
    } else {
        currentUser.equippedBanner = item.image;
    }

    let users = JSON.parse(localStorage.getItem('perpus_users'));
    const idx = users.findIndex(x => x.username === currentUser.username);
    users[idx] = currentUser;
    localStorage.setItem('perpus_users', JSON.stringify(users));

    renderStudentCatalog();
    renderStudentDashboard();
}