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

// --- GLOBAL ACTIONS ---

window.deleteEntry = async (col, id) => {
    if(confirm("Permanently delete this professional record?")) {
        try {
            await deleteDoc(doc(db, col, id));
        } catch (err) {
            alert("Error: " + err.message);
        }
    }
};

// EXPORT FUNCTION: Updated to include Height, Weight, and Foot
window.exportTable = (tableId, fileName) => {
    const tableBody = document.getElementById(tableId);
    const rows = tableBody.querySelectorAll("tr");
    let csv = [];
    
    // 1. Updated Headers for Scouting Reports
    if(tableId === "playerBody") {
        csv.push("Name,Position,Age,Physical (H/W),Foot,Nationality,Current Club");
    } else {
        csv.push("Name,Role/Dept,Physical (H/W),Experience,Nationality");
    }

    // 2. Parse Data Rows
    rows.forEach(row => {
        const cols = row.querySelectorAll("td");
        if (cols.length > 1) { 
            let rowData = [];
            for (let i = 0; i < cols.length - 1; i++) {
                let cellText = cols[i].innerText.replace(/"/g, '""'); 
                rowData.push(`"${cellText}"`);
            }
            csv.push(rowData.join(","));
        }
    });

    // 3. Trigger download
    const csvString = csv.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// --- LOAD PLAYERS ---
onSnapshot(collection(db, "players"), (snapshot) => {
    const tbody = document.getElementById('playerBody');
    tbody.innerHTML = ""; 
    
    if (snapshot.empty) {
        tbody.innerHTML = "<tr><td colspan='8' style='text-align:center;'>No players found.</td></tr>";
        return;
    }

    snapshot.forEach((doc) => {
        const p = doc.data();
        tbody.innerHTML += `
            <tr class="searchable-row" data-search="${p.name.toLowerCase()} ${p.position.toLowerCase()}">
                <td>${p.name}</td>
                <td><strong>${p.position}</strong></td>
                <td>${p.age}</td>
                <td>${p.height}cm / ${p.weight}kg</td>
                <td><mark style="background:#fff3cd; color:#856404;">${p.foot || 'N/A'}</mark></td>
                <td>${p.nationality}</td>
                <td>${p.club || 'Free Agent'}</td>
                <td><button class="delete-btn" onclick="deleteEntry('players', '${doc.id}')">Delete</button></td>
            </tr>
        `;
    });
});

// --- LOAD PROFESSIONAL STAFF ---
onSnapshot(collection(db, "staff"), (snapshot) => {
    const tbody = document.getElementById('coachBody');
    tbody.innerHTML = "";
    
    if (snapshot.empty) {
        tbody.innerHTML = "<tr><td colspan='6' style='text-align:center;'>No professional staff found.</td></tr>";
        return;
    }

    snapshot.forEach((doc) => {
        const s = doc.data();
        tbody.innerHTML += `
            <tr class="searchable-row" data-search="${s.name.toLowerCase()} ${s.role.toLowerCase()}">
                <td>${s.name}</td>
                <td><mark>${s.role}</mark></td>
                <td>${s.height && s.weight ? s.height + 'cm / ' + s.weight + 'kg' : 'N/A'}</td>
                <td>${s.experience} Years</td>
                <td>${s.nationality}</td>
                <td><button class="delete-btn" onclick="deleteEntry('staff', '${doc.id}')">Delete</button></td>
            </tr>
        `;
    });
});

// --- SEARCH FILTER ---
document.getElementById('positionSearch').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.searchable-row').forEach(row => {
        const searchData = row.getAttribute('data-search');
        row.style.display = searchData.includes(term) ? "" : "none";
    });
});