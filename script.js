import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// --- NAVIGATION & TABS ---
const tabPlayer = document.getElementById('tab-player');
const tabStaff = document.getElementById('tab-staff'); 
const tabClub = document.getElementById('tab-club');

const playerForm = document.getElementById('playerForm');
const staffForm = document.getElementById('staffForm'); 
const clubForm = document.getElementById('clubForm');

tabPlayer.addEventListener('click', () => showForm(playerForm, tabPlayer));
tabStaff.addEventListener('click', () => showForm(staffForm, tabStaff));
tabClub.addEventListener('click', () => showForm(clubForm, tabClub));

function showForm(activeForm, activeTab) {
    [playerForm, staffForm, clubForm].forEach(f => f.style.display = 'none');
    [tabPlayer, tabStaff, tabClub].forEach(t => t.classList.remove('active'));
    
    activeForm.style.display = 'block';
    activeTab.classList.add('active');
}

// --- REAL-TIME STATS (Dashboard) ---
onSnapshot(collection(db, "players"), (snap) => {
    document.getElementById('player-count').innerText = snap.size;
});
onSnapshot(collection(db, "staff"), (snap) => {
    document.getElementById('staff-count').innerText = snap.size;
});
onSnapshot(collection(db, "club_requests"), (snap) => {
    document.getElementById('club-count').innerText = snap.size;
});

// --- SUBMISSIONS ---

// 1. Player Submission (Enhanced with Physical Profile)
playerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await addDoc(collection(db, "players"), {
            name: document.getElementById('pName').value,
            position: document.getElementById('pPos').value,
            age: document.getElementById('pAge').value,
            nationality: document.getElementById('pNation').value,
            height: document.getElementById('pHeight').value, // Added
            weight: document.getElementById('pWeight').value, // Added
            foot: document.getElementById('pFoot').value,     // Added
            club: document.getElementById('pClub').value || 'Free Agent',
            timestamp: new Date().toISOString()
        });
        alert("Player application sent successfully! Mr. Sunny James will review your profile.");
        playerForm.reset();
    } catch (err) { alert(err.message); }
});

// 2. Staff Submission (Includes Physical Stats)
staffForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await addDoc(collection(db, "staff"), {
            name: document.getElementById('sName').value,
            role: document.getElementById('sRole').value,
            height: document.getElementById('sHeight').value || 'N/A', // Added
            weight: document.getElementById('sWeight').value || 'N/A', // Added
            qualification: document.getElementById('sLicense').value,
            experience: document.getElementById('sExp').value,
            nationality: document.getElementById('sNation').value,
            timestamp: new Date().toISOString()
        });
        alert("Professional staff profile registered!");
        staffForm.reset();
    } catch (err) { alert(err.message); }
});

// 3. Club Request Submission
clubForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await addDoc(collection(db, "club_requests"), {
            clubName: document.getElementById('clubName').value,
            location: document.getElementById('clubLoc').value,
            positionRequired: document.getElementById('reqPos').value,
            offerType: document.getElementById('offerType').value,
            notes: document.getElementById('clubNotes').value,
            timestamp: new Date().toISOString()
        });
        alert("Opportunity posted to Marketplace!");
        clubForm.reset();
    } catch (err) { alert(err.message); }
});