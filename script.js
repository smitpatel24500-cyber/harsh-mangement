let projects = JSON.parse(localStorage.getItem('editFlow_DB')) || [];
let isLoggedIn = localStorage.getItem('isLogged') === 'true';

// 1. Authentication Logic
function handleAuth(type) {
    if (type === 'login') {
        localStorage.setItem('isLogged', 'true');
        location.reload();
    } else {
        localStorage.setItem('isLogged', 'false');
        location.reload();
    }
}

// Check Login on Start
if (isLoggedIn) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-ui').style.display = 'block';
}

// 2. Section Switching
function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById(id + '-section').style.display = 'block';
    document.getElementById('nav-' + id).classList.add('active');
    if(id === 'reports') updateReports();
}

// 3. Project Management
function openPopup() { document.getElementById('modal').style.display = 'flex'; }
function closePopup() { document.getElementById('modal').style.display = 'none'; }

function updateUI() {
    const list = document.getElementById('p-list');
    list.innerHTML = '';
    let earn = 0, pend = 0, done = 0;

    projects.forEach((p, i) => {
        list.innerHTML += `<tr>
            <td>${p.name}</td><td>${p.type}</td><td>₹${p.price}</td>
            <td style="color:${p.status==='Completed'?'green':'orange'}">${p.status}</td>
            <td><i class="fas fa-trash" onclick="del(${i})" style="color:red;cursor:pointer"></i></td>
        </tr>`;
        if(p.status === 'Completed') { earn += Number(p.price); done++; } else { pend++; }
    });

    document.getElementById('s-total').innerText = projects.length;
    document.getElementById('s-earn').innerText = '₹' + earn.toLocaleString();
    document.getElementById('s-pending').innerText = pend;
    document.getElementById('s-done').innerText = done;
    localStorage.setItem('editFlow_DB', JSON.stringify(projects));
}

function del(i) { projects.splice(i, 1); updateUI(); }

document.getElementById('p-form').onsubmit = (e) => {
    e.preventDefault();
    projects.push({
        name: document.getElementById('cName').value,
        type: document.getElementById('pType').value,
        date: document.getElementById('pDate').value,
        price: document.getElementById('pPrice').value,
        status: document.getElementById('pStatus').value
    });
    updateUI(); closePopup(); e.target.reset();
};

// 4. Report Logic
function updateReports() {
    const now = new Date();
    let m = 0, y = 0;
    projects.forEach(p => {
        const d = new Date(p.date);
        if(p.status === 'Completed') {
            if(d.getFullYear() === now.getFullYear()) {
                y += Number(p.price);
                if(d.getMonth() === now.getMonth()) m += Number(p.price);
            }
        }
    });
    document.getElementById('r-month').innerText = '₹' + m.toLocaleString();
    document.getElementById('r-year').innerText = '₹' + y.toLocaleString();
}

// CSV Download
function downloadCSV(type) {
    let csv = "Client,Type,Price,Status\n";
    projects.forEach(p => csv += `${p.name},${p.type},${p.price},${p.status}\n`);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EditFlow_${type}.csv`;
    a.click();
}

updateUI();