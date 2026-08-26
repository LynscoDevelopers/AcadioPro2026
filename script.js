/**
 * GLOBAL MANAGER
 * Handles global app state (Layout Switching, Profile, Modal)
 */
class AppManager {

    constructor() {
        // DOM References
        this.dashboardView = document.getElementById('mainDashboardView');
        this.financeView = document.getElementById('financeDashboardView');
        this.profileView = document.getElementById('profileViewContainer');

        this.triggerNewAdmission = document.getElementById('triggerNewAdmission');
        this.triggerViewStudent = document.getElementById('triggerViewStudent');

        // Modal DOM Refs
        this.modal = document.getElementById('newAdmissionModal');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        this.modalFooter = document.getElementById('modalFooter');
        this.mTabs = document.querySelectorAll('#newAdmissionModal .modal-tab');
        this.mContents = {
            1: document.getElementById('tab-content-1'),
            2: document.getElementById('tab-content-2'),
            3: document.getElementById('tab-content-3')
        };

        // Buttons for layout switching
        document.getElementById('switchViewBtn').addEventListener('click', () => this.switchLayout('finance'));
        document.getElementById('switchViewBtnFinance').addEventListener('click', () => this.switchLayout('students'));

        // Initialize
        this.initModalLogic();
        this.initNavigation();
    }

    // --- Layout Switching ---
    switchLayout(view) {
        this.dashboardView.classList.add('hidden');
        this.financeView.classList.add('hidden');
        this.profileView.classList.add('hidden');

        if (view === 'students') {
            this.dashboardView.classList.remove('hidden');
        } else if (view === 'finance') {
            this.financeView.classList.remove('hidden');
        }
    }

    // --- Navigation ---
    initNavigation() {
        // View Student
        if(this.triggerViewStudent) {
            this.triggerViewStudent.addEventListener('click', () => {
                const student = studentController.studentsData[0]; 
                document.getElementById('pName').innerText = student.name;
                document.getElementById('pId').innerText = student.id;
                document.getElementById('pDob').innerText = student.dob;
                document.getElementById('pNat').innerText = student.nat;
                document.getElementById('pClass').innerText = student.class;

                this.dashboardView.classList.add('hidden');
                this.financeView.classList.add('hidden');
                this.profileView.classList.remove('hidden');
            });
        }

        // New Admission
        if(this.triggerNewAdmission) {
            this.triggerNewAdmission.addEventListener('click', () => {
                this.modal.classList.add('active');
                this.switchModalTab(1);
            });
        }
    }

    static goBackToList() {
        document.getElementById('mainDashboardView').classList.remove('hidden');
        document.getElementById('financeDashboardView').classList.add('hidden');
        document.getElementById('profileViewContainer').classList.add('hidden');
    }

    static switchProfileTab(tabId) {
        document.querySelectorAll('.p-tab-modern').forEach(btn => btn.classList.remove('active'));
        const clickedBtn = document.querySelector(`.p-tab-modern[onclick="AppManager.switchProfileTab('${tabId}')"]`);
        if(clickedBtn) clickedBtn.classList.add('active');

        document.querySelectorAll('.p-content-pane').forEach(pane => pane.classList.remove('active'));
        const targetPane = document.getElementById(`pane-${tabId}`);
        if(targetPane) targetPane.classList.add('active');
    }

    // --- Modal Logic ---
    initModalLogic() {
        this.mTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-tab'));
                this.switchModalTab(id);
            });
        });

        this.closeModalBtn.addEventListener('click', () => this.modal.classList.remove('active'));
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.modal.classList.remove('active');
        });
    }

    switchModalTab(id) {
        this.mTabs.forEach(t => t.classList.remove('active'));
        document.querySelector(`#newAdmissionModal .modal-tab[data-tab="${id}"]`).classList.add('active');

        Object.keys(this.mContents).forEach(key => {
            this.mContents[key].classList.add('hidden');
        });
        this.mContents[id].classList.remove('hidden');

        if (id == 3) this.populateModalSummary();
        this.updateModalFooter(id);
    }

    updateModalFooter(tabId) {
        let buttonsHtml = '';
        if (tabId == 1) {
            buttonsHtml = `<button class="m-modal-btn" onclick="alert('Reset Form')">Reset</button><button class="m-modal-btn primary" onclick="appManager.switchModalTab(2)">Next</button>`;
        } else if (tabId == 2) {
            buttonsHtml = `<button class="m-modal-btn" onclick="appManager.switchModalTab(1)">Previous</button><button class="m-modal-btn" onclick="alert('Reset Form')">Reset</button><button class="m-modal-btn primary" onclick="appManager.switchModalTab(3)">Next</button>`;
        } else if (tabId == 3) {
            buttonsHtml = `<button class="m-modal-btn" onclick="appManager.switchModalTab(2)">Previous</button><button class="m-modal-btn" onclick="alert('Reset Form')">Reset</button><button class="m-modal-btn primary" onclick="alert('Complete Registration')">Complete</button>`;
        }
        this.modalFooter.innerHTML = buttonsHtml;
    }

    mFormatDate(input) {
        if(!input.value) return "-";
        const date = new Date(input.value + 'T00:00:00');
        if (isNaN(date.getTime())) return "-";
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${date.getDate().toString().padStart(2, '0')}-${months[date.getMonth()]}-${date.getFullYear().toString().slice(-2)}`;
    }

    populateModalSummary() {
        document.getElementById('mSumName').innerText = document.getElementById('inputName').value || '-';
        document.getElementById('mSumDob').innerText = this.mFormatDate(document.getElementById('inputDob'));
        document.getElementById('mSumGender').innerText = document.querySelector('#newAdmissionModal input[name="gender"]:checked')?.value || '-';
        document.getElementById('mSumNat').innerText = document.getElementById('inputNationality').value || '-';
        document.getElementById('mSumId').innerText = document.getElementById('inputId').value || '-';
        document.getElementById('mSumRel').innerText = document.getElementById('inputReligion').value || '-';

        document.getElementById('mSumGuardian').innerText = `(${document.getElementById('inputGuardian').value || '-'})`;
        document.getElementById('mSumPhone1').innerText = document.getElementById('inputPhone1').value || '-';
        document.getElementById('mSumEmail').innerText = document.getElementById('inputEmail').value || '-';
        document.getElementById('mSumAddr').innerText = document.getElementById('inputAddress').value || '-';
    }
}


/**
 * STUDENT CONTROLLER
 * Handles everything specific to the Students layout (Table, Checkboxes, Filter)
 */
class StudentController {

    constructor() {
        this.studentsData = [
            { name: "Students Full Names", id: "RS/2026/001", isChecked: false, isPresent: true, hasAvatar: true, dob: "01 Jan, 2010", nat: "Kenyan", class: "Daycare", termFee: "15000.00", exemption: "15000.00", balanceBf: "15000.00", totalInst: "15000.00", balance: "15000.00" },
            { name: "John Doe", id: "RS/2026/001", isChecked: false, isPresent: true, hasAvatar: false, dob: "01 Jan, 2010", nat: "Kenyan", class: "Grade 8", termFee: "45000.00", exemption: "5000.00", balanceBf: "2000.00", totalInst: "15000.00", balance: "57000.00" },
            { name: "John Doe", id: "RS/2026/001", isChecked: false, isPresent: true, hasAvatar: false, dob: "01 Jan, 2010", nat: "Kenyan", class: "Grade 8", termFee: "45000.00", exemption: "5000.00", balanceBf: "2000.00", totalInst: "15000.00", balance: "57000.00" },
            { name: "John Doe", id: "RS/2026/001", isChecked: false, isPresent: true, hasAvatar: false, dob: "01 Jan, 2010", nat: "Kenyan", class: "Grade 8", termFee: "45000.00", exemption: "5000.00", balanceBf: "2000.00", totalInst: "15000.00", balance: "57000.00" },
            { name: "John Doe", id: "RS/2026/001", isChecked: false, isPresent: true, hasAvatar: false, dob: "01 Jan, 2010", nat: "Kenyan", class: "Grade 8", termFee: "45000.00", exemption: "5000.00", balanceBf: "2000.00", totalInst: "15000.00", balance: "57000.00" }
        ];

        this.tableBody = document.getElementById('table-body');
        this.filterBtn = document.getElementById('filterBtn');
        this.filterIcon = document.getElementById('filterIcon');
        this.isSortedAsc = false;

        this.avatarDataUri = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEydjZjMCAxLjY2IDEuMzQgMyAzIDNoMWMxLjEgMCAyLS45IDItMlYxM2MwLTEuMS0uOS0yLTItMkg1Yy0xLjEgMC0yIC45LTIgMnYzYzAgMS4xLjkgMiAyIDJoMVYxMmMwLTQuNDIgMy41OC04IDgtOHM4IDMuNTggOCA4djRoMWMxLjEgMCAyLS45IDItMlYxM2MwLTEuMS0uOS0yLTItMkgxN2MtMS4xIDAtMiAuOS0yIDJ2M2MwIDEuMS45IDIgMiAyaDFjMS42NiAwIDMtMS4zNCAzLTNWMTJjMC01LjUyLTQuNDgtMTAtMTAtMTB6Ii8+PC9zdmc+";

        this.init();
    }

    init() {
        this.render();
        this.attachListeners();
    }

    render() {
        this.tableBody.innerHTML = '';
        this.studentsData.forEach((student, index) => {
            const row = document.createElement('tr');
            let checkboxHtml = `<div class="checkbox-container" data-index="${index}"></div>`;
            if(student.isChecked) checkboxHtml = `<div class="checkbox-container checked" data-index="${index}"></div>`;
            
            let avatarHtml = `<div class="avatar" style="background:#1a1a1a;"><img src="${this.avatarDataUri}" alt="Avatar"></div>`;
            if(!student.hasAvatar) avatarHtml = `<div class="avatar" style="background:#000;"><img src="${this.avatarDataUri}" alt="Avatar"></div>`;
            
            let presentClass = student.isPresent ? '' : 'absent';
            let presentText = student.isPresent ? 'Present' : 'Absent';

            row.innerHTML = `
                <td style="text-align: center;">${checkboxHtml}</td>
                <td><div class="student-info">${avatarHtml}<div class="details"><div class="name">${student.name}</div><div class="id">${student.id}</div></div></div></td>
                <td><span class="class-grade">${student.class}</span></td>
                <td>${student.dob}</td>
                <td>${student.nat}</td>
                <td><span class="contact">0712345678</span></td>
                <td style="text-align: center;"><button class="btn-present ${presentClass}" data-index="${index}">${presentText}</button></td>
            `;
            this.tableBody.appendChild(row);
        });
    }

    attachListeners() {
        // Student Checkboxes
        document.querySelectorAll('#table-body .checkbox-container:not(.minus)').forEach(cb => {
            cb.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                this.studentsData[index].isChecked = !this.studentsData[index].isChecked;
                this.render();
            });
        });

        // Student Present Buttons
        document.querySelectorAll('#table-body .btn-present').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                this.studentsData[index].isPresent = !this.studentsData[index].isPresent;
                this.render();
            });
        });

        // Student Filter Button
        this.filterBtn.addEventListener('click', () => {
            this.isSortedAsc = !this.isSortedAsc;
            this.filterIcon.innerHTML = this.isSortedAsc ? '&#8593;' : '&#8595;';
            this.studentsData.sort((a, b) => (a.name < b.name ? -1 : 1) * (this.isSortedAsc ? 1 : -1));
            this.render();
        });
    }
}


/**
 * FINANCE CONTROLLER
 * Handles everything specific to the Finance layout (Table, Checkboxes, Filter)
 */
class FinanceController {

    constructor() {
        this.studentsData = [
            { name: "Students Full Names", id: "RS/2026/001", isChecked: false, isPresent: true, hasAvatar: true, class: "Daycare", termFee: "15000.00", exemption: "15000.00", balanceBf: "15000.00", totalInst: "15000.00", balance: "15000.00" },
            { name: "John Doe", id: "RS/2026/001", isChecked: false, isPresent: true, hasAvatar: false, class: "Grade 8", termFee: "45000.00", exemption: "5000.00", balanceBf: "2000.00", totalInst: "15000.00", balance: "57000.00" },
            { name: "John Doe", id: "RS/2026/001", isChecked: false, isPresent: true, hasAvatar: false, class: "Grade 8", termFee: "45000.00", exemption: "5000.00", balanceBf: "2000.00", totalInst: "15000.00", balance: "57000.00" },
            { name: "John Doe", id: "RS/2026/001", isChecked: false, isPresent: true, hasAvatar: false, class: "Grade 8", termFee: "45000.00", exemption: "5000.00", balanceBf: "2000.00", totalInst: "15000.00", balance: "57000.00" },
            { name: "John Doe", id: "RS/2026/001", isChecked: false, isPresent: true, hasAvatar: false, class: "Grade 8", termFee: "45000.00", exemption: "5000.00", balanceBf: "2000.00", totalInst: "15000.00", balance: "57000.00" }
        ];

        this.tableBody = document.getElementById('finance-table-body');
        this.filterBtn = document.getElementById('filterBtnFinance');
        this.filterIcon = document.getElementById('filterIconFinance');
        this.isSortedAsc = false;

        this.avatarDataUri = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEydjZjMCAxLjY2IDEuMzQgMyAzIDNoMWMxLjEgMCAyLS45IDItMlYxM2MwLTEuMS0uOS0yLTItMkg1Yy0xLjEgMC0yIC45LTIgMnYzYzAgMS4xLjkgMiAyIDJoMVYxMmMwLTQuNDIgMy41OC04IDgtOHM4IDMuNTggOCA4djRoMWMxLjEgMCAyLS45IDItMlYxM2MwLTEuMS0uOS0yLTItMkgxN2MtMS4xIDAtMiAuOS0yIDJ2M2MwIDEuMS45IDIgMiAyaDFjMS42NiAwIDMtMS4zNCAzLTNWMTJjMC01LjUyLTQuNDgtMTAtMTAtMTB6Ii8+PC9zdmc+";

        this.init();
    }

    init() {
        this.render();
        this.attachListeners();
    }

    render() {
        this.tableBody.innerHTML = '';
        this.studentsData.forEach((student, index) => {
            const row = document.createElement('tr');
            
            let checkboxHtml = `<div class="checkbox-container" data-index="${index}"></div>`;
            if(student.isChecked) checkboxHtml = `<div class="checkbox-container checked" data-index="${index}"></div>`;

            let avatarHtml = `<div class="avatar" style="background:#1a1a1a;"><img src="${this.avatarDataUri}" alt="Avatar"></div>`;
            if(!student.hasAvatar) avatarHtml = `<div class="avatar" style="background:#000;"><img src="${this.avatarDataUri}" alt="Avatar"></div>`;

            row.innerHTML = `
                <td style="text-align: center;">${checkboxHtml}</td>
                <td>
                    <div class="student-info">
                        ${avatarHtml}
                        <div class="details">
                            <div class="name">${student.name}</div>
                            <div class="id finance-id">${student.id}</div>
                        </div>
                    </div>
                </td>
                <td><span class="finance-number">${student.termFee}</span></td>
                <td><span class="finance-number">${student.exemption}</span></td>
                <td><span class="finance-number">${student.balanceBf}</span></td>
                <td><span class="finance-number">${student.totalInst}</span></td>
                <td><span class="finance-number">${student.balance}</span></td>
                <td><span class="finance-text">${student.class}</span></td>
            `;
            this.tableBody.appendChild(row);
        });
    }

    attachListeners() {
        // Finance Checkboxes
        document.querySelectorAll('#finance-table-body .checkbox-container:not(.minus)').forEach(cb => {
            cb.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                this.studentsData[index].isChecked = !this.studentsData[index].isChecked;
                this.render();
            });
        });

        // Finance Filter Button
        this.filterBtn.addEventListener('click', () => {
            this.isSortedAsc = !this.isSortedAsc;
            this.filterIcon.innerHTML = this.isSortedAsc ? '&#8593;' : '&#8595;';
            this.studentsData.sort((a, b) => (a.name < b.name ? -1 : 1) * (this.isSortedAsc ? 1 : -1));
            this.render();
        });
    }
}


// --- INSTANTIATE EVERYTHING ---
const appManager = new AppManager();
const studentController = new StudentController();
const financeController = new FinanceController();

// Expose functions to HTML onclick attributes
window.AppManager = AppManager;
window.appManager = appManager;
window.studentController = studentController;
window.financeController = financeController;