import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

const marketDisplay = document.getElementById('market-display');

// Fetch and Display Club Requests in Real-Time
const q = query(collection(db, "club_requests"), orderBy("timestamp", "desc"));

onSnapshot(q, (snapshot) => {
    marketDisplay.innerHTML = ""; // Clear loader

    if (snapshot.empty) {
        marketDisplay.innerHTML = "<p style='grid-column: 1/-1; text-align:center;'>No active opportunities at the moment. Check back soon!</p>";
        return;
    }

    snapshot.forEach((doc) => {
        const data = doc.data();
        
        // Determine badge class
        let badgeClass = "badge-trial";
        if(data.offerType === "Direct Contract") badgeClass = "badge-contract";
        if(data.offerType === "Scouting Event") badgeClass = "badge-event";

        const card = document.createElement('div');
        card.className = "opportunity-card";
        card.innerHTML = `
            <span class="badge ${badgeClass}">${data.offerType}</span>
            <div class="position-title">${data.positionRequired}</div>
            <div class="club-name">${data.clubName}</div>
            <div class="location">📍 ${data.location}</div>
            <div class="details-text">
                ${data.notes ? data.notes : "Contact SRJ for more details regarding this opportunity."}
            </div>
            <a href="index.html#register" class="apply-btn">Register to Apply</a>
        `;
        marketDisplay.appendChild(card);
    });
});