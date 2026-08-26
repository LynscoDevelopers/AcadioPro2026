// student.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// ======================================================
// FIREBASE CONFIGURATION
// Replace these values with your Firebase project values
// ======================================================

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};


// ======================================================
// INITIALIZE FIREBASE
// ======================================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// ======================================================
// SAVE STUDENT
// ======================================================

async function saveStudent() {

    try {

        // -----------------------------------------------
        // Get gender
        // -----------------------------------------------

        const genderElement =
            document.querySelector('input[name="gender"]:checked');


        // -----------------------------------------------
        // Create student object
        // -----------------------------------------------

        const studentData = {

            name: document.getElementById('studentName').value.trim(),

            dob: document.getElementById('studentDOB').value,

            religion: document.getElementById('studentReligion').value,

            nationality:
                document.getElementById('studentNationality').value,

            gender:
                genderElement ? genderElement.value : '',

            idNumber:
                document.getElementById('studentID').value.trim(),

            guardian:
                document.getElementById('guardianName').value.trim(),

            relationship:
                document.getElementById('guardianRelationship').value,

            phone:
                document.getElementById('guardianPhone').value.trim(),

            email:
                document.getElementById('guardianEmail').value.trim(),

            address:
                document.getElementById('guardianAddress').value.trim(),

            admissionNumber:
                document.getElementById('admissionNumber').value.trim(),

            class:
                document.getElementById('studentClass').value,

            consent:
                document.getElementById('consentCheck').checked,

            createdAt: serverTimestamp()
        };


        // -----------------------------------------------
        // Basic validation
        // -----------------------------------------------

        if (!studentData.name) {
            alert("Please enter the student's name.");
            return false;
        }

        if (!studentData.admissionNumber) {
            alert("Please enter the admission number.");
            return false;
        }

        if (!studentData.class) {
            alert("Please select the student's class.");
            return false;
        }

        if (!studentData.consent) {
            alert("Please confirm the consent.");
            return false;
        }


        // -----------------------------------------------
        // Save to Firestore
        // Collection: students
        // -----------------------------------------------

        const docRef = await addDoc(
            collection(db, "students"),
            studentData
        );


        // -----------------------------------------------
        // Success
        // -----------------------------------------------

        console.log(
            "Student successfully saved.",
            "Document ID:",
            docRef.id
        );

        alert(
            "Student saved successfully!\n\n" +
            "Student ID: " + docRef.id
        );


        return true;

    } catch (error) {

        console.error(
            "Error saving student:",
            error
        );

        alert(
            "Failed to save student.\n\n" +
            error.message
        );

        return false;
    }
}


// ======================================================
// MAKE FUNCTION AVAILABLE TO HTML
// ======================================================

window.saveStudent = saveStudent;