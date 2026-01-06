import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBFUCsNpKHucsDN-cqlNLr4YXLzeco5cNA",
    authDomain: "srj-international.firebaseapp.com",
    projectId: "srj-international",
    storageBucket: "srj-international.firebasestorage.app",
    messagingSenderId: "406854929366",
    appId: "1:406854929366:web:2eb36e30647ff439bdb277"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- DELETE FUNCTION ---
window.deleteEntry = async (col, id) => {
    if(confirm("Permanently delete this professional record? This will also remove it from the public marketplace.")) {
        try {
            await deleteDoc(doc(db, col, id));
        } catch (err) {
            alert("Error: " + err.message);
        }
    }
};

// --- EXPORT FUNCTION (CSV) ---
window.exportTable = (tableId, fileName) => {
    const tableBody = document.getElementById(tableId);
    const rows = tableBody.querySelectorAll("tr");
    let csv = [];
    
    // Custom Headers for each table
    const headers = {
        "playerBody": "Name,Position,Age,Physical (H/W),Foot,Nationality,Current Club",
        "coachBody": "Name,Role/Dept,Physical (H/W),Experience,Nationality",
        "clubBody": "Club Name,Location,Position Required,Offer Type,Notes",
        "vacancyBody": "Applicant Name,Desired Role,Location,Background/Message",
        "partnerBody": "Organization,Contact,Email,Type,Proposal"
    };

    csv.push(headers[tableId] || "Data");

    rows.forEach(row => {
        const cols = row.querySelectorAll("td");
        if (cols.length > 1) { 
            let rowData = [];
            for (let i = 0; i < cols.length - 1; i++) {
                let cellText = cols[i].innerText.replace(/"/g, '""').replace(/\n/g, ' '); 
                rowData.push(`"${cellText}"`);
            }
            csv.push(rowData.join(","));
        }
    });

    const blob = new Blob([csv.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
};

// --- LOAD DATA FUNCTIONS ---

// 1. Players
onSnapshot(collection(db, "players"), (snap) => {
    const tbody = document.getElementById('playerBody');
    tbody.innerHTML = snap.empty ? "<tr><td colspan='8' style='text-align:center;'>No players found.</td></tr>" : "";
    snap.forEach((doc) => {
        const p = doc.data();
        tbody.innerHTML += `
            <tr class="searchable-row" data-search="${p.name.toLowerCase()} ${p.position.toLowerCase()}">
                <td>${p.name}</td><td><strong>${p.position}</strong></td><td>${p.age}</td>
                <td>${p.height}cm / ${p.weight}kg</td>
                <td><mark style="background:#fff3cd; color:#856404;">${p.foot || 'N/A'}</mark></td>
                <td>${p.nationality}</td><td>${p.club || 'Free Agent'}</td>
                <td><button class="delete-btn" onclick="deleteEntry('players', '${doc.id}')">Delete</button></td>
            </tr>`;
    });
});

// 2. Staff
onSnapshot(collection(db, "staff"), (snap) => {
    const tbody = document.getElementById('coachBody');
    tbody.innerHTML = snap.empty ? "<tr><td colspan='6' style='text-align:center;'>No staff found.</td></tr>" : "";
    snap.forEach((doc) => {
        const s = doc.data();
        tbody.innerHTML += `
            <tr class="searchable-row" data-search="${s.name.toLowerCase()} ${s.role.toLowerCase()}">
                <td>${s.name}</td><td><mark>${s.role}</mark></td>
                <td>${s.height && s.weight ? s.height + 'cm / ' + s.weight + 'kg' : 'N/A'}</td>
                <td>${s.experience} Years</td><td>${s.nationality}</td>
                <td><button class="delete-btn" onclick="deleteEntry('staff', '${doc.id}')">Delete</button></td>
            </tr>`;
    });
});

// 3. Club Requests (Market)
onSnapshot(collection(db, "club_requests"), (snap) => {
    const tbody = document.getElementById('clubBody');
    tbody.innerHTML = snap.empty ? "<tr><td colspan='6' style='text-align:center;'>No active requests.</td></tr>" : "";
    snap.forEach((doc) => {
        const c = doc.data();
        tbody.innerHTML += `
            <tr class="searchable-row" data-search="${c.clubName.toLowerCase()} ${c.positionRequired.toLowerCase()}">
                <td><strong>${c.clubName}</strong></td><td>${c.location}</td>
                <td>${c.positionRequired}</td><td><mark>${c.offerType}</mark></td>
                <td><small>${c.notes || '-'}</small></td>
                <td><button class="delete-btn" onclick="deleteEntry('club_requests', '${doc.id}')">Delete</button></td>
            </tr>`;
    });
});

// 4. Agency Vacancies
onSnapshot(collection(db, "vacancies"), (snap) => {
    const tbody = document.getElementById('vacancyBody');
    tbody.innerHTML = snap.empty ? "<tr><td colspan='5' style='text-align:center;'>No applications.</td></tr>" : "";
    snap.forEach((doc) => {
        const v = doc.data();
        tbody.innerHTML += `
            <tr class="searchable-row" data-search="${v.name.toLowerCase()} ${v.desiredRole.toLowerCase()}">
                <td><strong>${v.name}</strong></td><td><mark>${v.desiredRole}</mark></td>
                <td>${v.location}</td><td><small>${v.message}</small></td>
                <td><button class="delete-btn" onclick="deleteEntry('vacancies', '${doc.id}')">Delete</button></td>
            </tr>`;
    });
});

// 5. Partnerships
onSnapshot(collection(db, "partnerships"), (snap) => {
    const tbody = document.getElementById('partnerBody');
    tbody.innerHTML = snap.empty ? "<tr><td colspan='6' style='text-align:center;'>No proposals.</td></tr>" : "";
    snap.forEach((doc) => {
        const p = doc.data();
        tbody.innerHTML += `
            <tr class="searchable-row" data-search="${p.organization.toLowerCase()} ${p.partnershipType.toLowerCase()}">
                <td><strong>${p.organization}</strong></td><td>${p.contactPerson}</td>
                <td><a href="mailto:${p.email}">${p.email}</a></td><td><mark>${p.partnershipType}</mark></td>
                <td><small>${p.proposal}</small></td>
                <td><button class="delete-btn" onclick="deleteEntry('partnerships', '${doc.id}')">Delete</button></td>
            </tr>`;
    });
});

// --- SEARCH LOGIC ---
document.getElementById('positionSearch').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.searchable-row').forEach(row => {
        row.style.display = row.getAttribute('data-search').includes(term) ? "" : "none";
    });
});