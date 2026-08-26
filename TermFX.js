
    (function() {
        "use strict";

        // ---------- DATA STORE ----------
        let terms = [];

        // ---------- DOM REFS ----------
        const grid = document.getElementById('termGrid');
        const totalTermsSpan = document.getElementById('totalTerms');
        const totalFeesSpan = document.getElementById('totalFees');
        const totalGradesSpan = document.getElementById('totalGrades');

        const modal = document.getElementById('termModal');
        const modalTitle = document.getElementById('modalTitle');
        const termIdInput = document.getElementById('termIdInput');
        const statusSelect = document.getElementById('statusSelect');
        const startDateInput = document.getElementById('startDateInput');
        const endDateInput = document.getElementById('endDateInput');
        const mealInput = document.getElementById('mealInput');
        const transportInput = document.getElementById('transportInput');
        const boardingInput = document.getElementById('boardingInput');
        const breakInput = document.getElementById('breakInput');
        const gradeFeesContainer = document.getElementById('gradeFeesContainer');
        const newGradeInput = document.getElementById('newGradeInput');
        const newGradeFeeInput = document.getElementById('newGradeFeeInput');
        const addGradeBtn = document.getElementById('addGradeBtn');

        const addBtn = document.getElementById('addTermBtn');
        const closeBtn = document.getElementById('closeModalBtn');
        const cancelBtn = document.getElementById('cancelModalBtn');
        const refreshBtn = document.getElementById('refreshBtn');
        const form = document.getElementById('termForm');

        // ---------- STATE ----------
        let editingIndex = -1;

        // ---------- DEFAULT GRADES ----------
        const defaultGrades = () => ({
            '8': 0,
            '9': 0,
            '10': 0,
            '11': 0,
            '12': 0
        });

        // ---------- RENDER GRADE FEE ROWS ----------
        function renderGradeFees(grades) {
            gradeFeesContainer.innerHTML = '';
            if (!grades) grades = defaultGrades();
            for (const [grade, fee] of Object.entries(grades)) {
                const row = document.createElement('div');
                row.className = 'grade-fee-row';
                row.innerHTML = `
                    <label>${grade}</label>
                    <input type="number" step="0.01" class="grade-fee-input" data-grade="${grade}" value="${fee}" />
                    <button type="button" class="btn-remove-grade" data-grade="${grade}">✕</button>
                `;
                gradeFeesContainer.appendChild(row);
            }
            // attach remove events
            gradeFeesContainer.querySelectorAll('.btn-remove-grade').forEach(btn => {
                btn.addEventListener('click', function() {
                    const grade = this.dataset.grade;
                    const row = this.closest('.grade-fee-row');
                    if (row) row.remove();
                });
            });
        }

        // ---------- COLLECT GRADES FROM UI ----------
        function collectGrades() {
            const grades = {};
            const inputs = gradeFeesContainer.querySelectorAll('.grade-fee-input');
            inputs.forEach(inp => {
                const grade = inp.dataset.grade;
                const val = parseFloat(inp.value) || 0;
                if (grade) grades[grade] = val;
            });
            return grades;
        }

        // ---------- ADD GRADE ROW ----------
        function addGradeRow() {
            const grade = newGradeInput.value.trim();
            const fee = parseFloat(newGradeFeeInput.value) || 0;
            if (!grade) { alert('Please enter a grade.'); return; }
            const existing = gradeFeesContainer.querySelector(`.grade-fee-input[data-grade="${grade}"]`);
            if (existing) { alert('Grade already exists.'); return; }
            const row = document.createElement('div');
            row.className = 'grade-fee-row';
            row.innerHTML = `
                <label>${grade}</label>
                <input type="number" step="0.01" class="grade-fee-input" data-grade="${grade}" value="${fee}" />
                <button type="button" class="btn-remove-grade" data-grade="${grade}">✕</button>
            `;
            gradeFeesContainer.appendChild(row);
            row.querySelector('.btn-remove-grade').addEventListener('click', function() {
                const r = this.closest('.grade-fee-row');
                if (r) r.remove();
            });
            newGradeInput.value = '';
            newGradeFeeInput.value = '';
            newGradeInput.focus();
        }

        // ---------- RENDER GRID ----------
        function renderGrid() {
            grid.innerHTML = '';

            if (terms.length === 0) {
                grid.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-calendar-plus"></i>
                        <p>No terms yet. Click <strong>"New Term"</strong> to add one.</p>
                    </div>
                `;
                updateStats();
                return;
            }

            terms.forEach((term, idx) => {
                const card = document.createElement('div');
                card.className = 'term-card';

                const statusClass = term.status === 'Active' ? '' : term.status === 'Inactive' ? 'inactive' : 'closed';

                // Dates
                const startDate = term.start ? new Date(term.start).toLocaleDateString() : '—';
                const endDate = term.end ? new Date(term.end).toLocaleDateString() : '—';

                // Grades chips
                let gradesHtml = '';
                const gradeEntries = Object.entries(term.grades || {});
                if (gradeEntries.length > 0) {
                    gradesHtml = gradeEntries.map(([g, f]) => 
                        `<span class="grade-chip">${g} <span class="fee">${f.toFixed(2)}</span></span>`
                    ).join('');
                } else {
                    gradesHtml = '<span style="color:#6b7e93;">No grades set</span>';
                }

                card.innerHTML = `
                    <div class="term-card-header">
                        <span class="term-id"><i class="fas fa-tag" style="color:#2a7de1; margin-right:0.3rem;"></i>${term.termId || '—'}</span>
                        <span class="term-status ${statusClass}">${term.status || '—'}</span>
                    </div>
                    <div class="term-dates">
                        <span><i class="fas fa-calendar-day"></i> ${startDate}</span>
                        <span><i class="fas fa-calendar-day"></i> ${endDate}</span>
                    </div>
                    <div class="term-fees">
                        <div class="fee-item"><span class="label">Meal</span><span class="value">${(term.meal || 0).toFixed(2)}</span></div>
                        <div class="fee-item"><span class="label">Transport</span><span class="value">${(term.transport || 0).toFixed(2)}</span></div>
                        <div class="fee-item"><span class="label">Boarding</span><span class="value">${(term.boarding || 0).toFixed(2)}</span></div>
                        <div class="fee-item"><span class="label">Break</span><span class="value">${(term.breakFee || 0).toFixed(2)}</span></div>
                    </div>
                    <div class="term-grades">
                        <span class="label">Grade Fees</span>
                        <div class="grade-chips">${gradesHtml}</div>
                    </div>
                    <div class="term-actions-card">
                        <button class="btn btn-outline btn-sm edit-btn" data-index="${idx}"><i class="fas fa-pen"></i> Edit</button>
                        <button class="btn btn-outline btn-sm delete-btn" data-index="${idx}" style="border-color:#fca5a5; color:#991b1b;"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                `;

                grid.appendChild(card);
            });

            // attach events
            grid.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const idx = parseInt(this.dataset.index);
                    openModal(idx);
                });
            });
            grid.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const idx = parseInt(this.dataset.index);
                    if (confirm('Delete this term?')) {
                        terms.splice(idx, 1);
                        renderGrid();
                    }
                });
            });

            updateStats();
        }

        // ---------- UPDATE STATS ----------
        function updateStats() {
            totalTermsSpan.textContent = terms.length;
            
            let totalFees = 0;
            let gradeSet = new Set();
            terms.forEach(t => {
                totalFees += (t.meal || 0) + (t.transport || 0) + (t.boarding || 0) + (t.breakFee || 0);
                if (t.grades) {
                    Object.keys(t.grades).forEach(g => gradeSet.add(g));
                }
            });
            totalFeesSpan.textContent = totalFees.toFixed(2);
            totalGradesSpan.textContent = gradeSet.size;
        }

        // ---------- MODAL CONTROL ----------
        function openModal(index) {
            editingIndex = index;
            if (index === -1) {
                modalTitle.textContent = 'New Term';
                termIdInput.value = '';
                startDateInput.value = '';
                endDateInput.value = '';
                statusSelect.value = 'Active';
                mealInput.value = '0.00';
                transportInput.value = '0.00';
                boardingInput.value = '0.00';
                breakInput.value = '0.00';
                renderGradeFees(defaultGrades());
            } else {
                modalTitle.textContent = 'Edit Term';
                const t = terms[index];
                termIdInput.value = t.termId || '';
                startDateInput.value = t.start ? t.start.split('T')[0] : '';
                endDateInput.value = t.end ? t.end.split('T')[0] : '';
                statusSelect.value = t.status || 'Active';
                mealInput.value = (t.meal || 0).toFixed(2);
                transportInput.value = (t.transport || 0).toFixed(2);
                boardingInput.value = (t.boarding || 0).toFixed(2);
                breakInput.value = (t.breakFee || 0).toFixed(2);
                renderGradeFees(t.grades || defaultGrades());
            }
            modal.classList.add('active');
        }

        function closeModal() {
            modal.classList.remove('active');
            editingIndex = -1;
        }

        // ---------- SAVE TERM ----------
        function saveTerm(e) {
            e.preventDefault();

            const termId = termIdInput.value.trim();
            const start = startDateInput.value;
            const end = endDateInput.value;
            const status = statusSelect.value;
            const meal = parseFloat(mealInput.value) || 0;
            const transport = parseFloat(transportInput.value) || 0;
            const boarding = parseFloat(boardingInput.value) || 0;
            const breakFee = parseFloat(breakInput.value) || 0;
            const grades = collectGrades();

            if (!termId) { alert('Term ID is required.'); return; }
            if (!start) { alert('Start date is required.'); return; }
            if (!end) { alert('End date is required.'); return; }
            if (new Date(start) > new Date(end)) { alert('Start date must be before end date.'); return; }
            if (Object.keys(grades).length === 0) { alert('Add at least one grade with fee.'); return; }

            const termObj = { termId, start, end, status, meal, transport, boarding, breakFee, grades };

            if (editingIndex === -1) {
                terms.push(termObj);
            } else {
                terms[editingIndex] = termObj;
            }
            renderGrid();
            closeModal();
        }

        // ---------- INIT DEMO DATA ----------
        function initDemoData() {
            if (terms.length === 0) {
                const now = new Date();
                const start1 = new Date(now.getFullYear(), 0, 15);
                const end1 = new Date(now.getFullYear(), 3, 15);
                const start2 = new Date(now.getFullYear(), 4, 10);
                const end2 = new Date(now.getFullYear(), 7, 10);
                terms.push({
                    termId: 'TERM-2026-01',
                    start: start1.toISOString().split('T')[0],
                    end: end1.toISOString().split('T')[0],
                    status: 'Active',
                    meal: 1200,
                    transport: 800,
                    boarding: 3500,
                    breakFee: 450,
                    grades: { '8': 1500, '9': 1600, '10': 1700, '11': 1800, '12': 1900 }
                });
                terms.push({
                    termId: 'TERM-2026-02',
                    start: start2.toISOString().split('T')[0],
                    end: end2.toISOString().split('T')[0],
                    status: 'Inactive',
                    meal: 1250,
                    transport: 850,
                    boarding: 3600,
                    breakFee: 470,
                    grades: { '8': 1550, '9': 1650, '10': 1750, '11': 1850, '12': 1950 }
                });
            }
            renderGrid();
        }

        // ---------- EVENT BINDING ----------
        addBtn.addEventListener('click', () => openModal(-1));
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        refreshBtn.addEventListener('click', renderGrid);

        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
        });

        form.addEventListener('submit', saveTerm);

        addGradeBtn.addEventListener('click', addGradeRow);
        newGradeInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addGradeRow(); } });
        newGradeFeeInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addGradeRow(); } });

        // ---------- START ----------
        initDemoData();

        // expose for debugging
        window.__terms = terms;
    })();