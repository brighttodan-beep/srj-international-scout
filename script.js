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
const tabVacancy = document.getElementById('tab-vacancy');
const tabPartner = document.getElementById('tab-partner');

const playerForm = document.getElementById('playerForm');
const staffForm = document.getElementById('staffForm'); 
const clubForm = document.getElementById('clubForm');
const vacancyForm = document.getElementById('vacancyForm');
const partnerForm = document.getElementById('partnerForm');

// Event Listeners for Tabs
tabPlayer.addEventListener('click', () => showForm(playerForm, tabPlayer));
tabStaff.addEventListener('click', () => showForm(staffForm, tabStaff));
tabClub.addEventListener('click', () => showForm(clubForm, tabClub));
tabVacancy.addEventListener('click', () => showForm(vacancyForm, tabVacancy));
tabPartner.addEventListener('click', () => showForm(partnerForm, tabPartner));

function showForm(activeForm, activeTab) {
    // Hide all forms and reset all tab styles
    [playerForm, staffForm, clubForm, vacancyForm, partnerForm].forEach(f => f.style.display = 'none');
    [tabPlayer, tabStaff, tabClub, tabVacancy, tabPartner].forEach(t => t.classList.remove('active'));
    
    // Show selected form and set active tab
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

// 1. Player Submission
playerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await addDoc(collection(db, "players"), {
            name: document.getElementById('pName').value.trim(),
            position: document.getElementById('pPos').value.trim(),
            age: document.getElementById('pAge').value,
            nationality: document.getElementById('pNation').value.trim(),
            height: document.getElementById('pHeight').value,
            weight: document.getElementById('pWeight').value,
            foot: document.getElementById('pFoot').value,
            club: document.getElementById('pClub').value.trim() || 'Free Agent',
            timestamp: new Date().toISOString()
        });
        alert("Player application sent successfully! Mr. Sunny James will review your profile.");
        playerForm.reset();
    } catch (err) { alert(err.message); }
});

// 2. Staff Submission
staffForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await addDoc(collection(db, "staff"), {
            name: document.getElementById('sName').value.trim(),
            role: document.getElementById('sRole').value,
            qualification: document.getElementById('sLicense').value.trim(),
            experience: document.getElementById('sExp').value,
            nationality: document.getElementById('sNation').value.trim(),
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
            clubName: document.getElementById('clubName').value.trim(),
            location: document.getElementById('clubLoc').value.trim(),
            positionRequired: document.getElementById('reqPos').value.trim(),
            offerType: document.getElementById('offerType').value,
            notes: document.getElementById('clubNotes').value.trim(),
            timestamp: new Date().toISOString()
        });
        alert("Opportunity posted to Marketplace!");
        clubForm.reset();
    } catch (err) { alert(err.message); }
});

// 4. Agency Vacancy Submission
vacancyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await addDoc(collection(db, "vacancies"), {
            name: document.getElementById('vName').value.trim(),
            desiredRole: document.getElementById('vRole').value,
            location: document.getElementById('vLocation').value.trim(),
            message: document.getElementById('vMessage').value.trim(),
            timestamp: new Date().toISOString()
        });
        alert("Application sent! The SRJ team will contact you if your profile matches our needs.");
        vacancyForm.reset();
    } catch (err) { alert(err.message); }
});

// 5. Partnership Proposal Submission
partnerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await addDoc(collection(db, "partnerships"), {
            organization: document.getElementById('partOrg').value.trim(),
            contactPerson: document.getElementById('partContact').value.trim(),
            email: document.getElementById('partEmail').value.trim(),
            partnershipType: document.getElementById('partType').value,
            proposal: document.getElementById('partProposal').value.trim(),
            timestamp: new Date().toISOString()
        });
        alert("Partnership proposal sent! We look forward to collaborating.");
        partnerForm.reset();
    } catch (err) { alert(err.message); }
});