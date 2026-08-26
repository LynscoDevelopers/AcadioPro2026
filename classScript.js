
        (function() {
            // ---------- MOCK DATA ----------
            let classData = [
                { grade: '9', stream: 'Alpha', room: '201', capacity: 28, teacher: 'Mrs. Kariuki' },
                { grade: '10', stream: 'Beta', room: '104', capacity: 32, teacher: 'Mr. Ochieng' },
                { grade: '11', stream: 'Gamma', room: '305', capacity: 26, teacher: 'Dr. Njoroge' },
                { grade: '12', stream: 'Delta', room: '412', capacity: 30, teacher: 'Ms. Akinyi' },
                { grade: '8', stream: 'Epsilon', room: '109', capacity: 24, teacher: 'Mr. Mwangi' },
                { grade: '9', stream: 'Zeta', room: '203', capacity: 29, teacher: 'Mrs. Wanjiru' },
                { grade: '10', stream: 'Eta', room: '112', capacity: 27, teacher: 'Mr. Otieno' },
                { grade: '11', stream: 'Theta', room: '310', capacity: 31, teacher: 'Mrs. Auma' },
                { grade: '12', stream: 'Iota', room: '405', capacity: 25, teacher: 'Dr. Kimani' },
                { grade: '8', stream: 'Kappa', room: '107', capacity: 22, teacher: 'Ms. Chebet' }
            ];

            // DOM refs
            const grid = document.getElementById('classGrid');
            const totalClassesSpan = document.getElementById('totalClasses');
            const totalCapacitySpan = document.getElementById('totalCapacity');
            const totalRoomsSpan = document.getElementById('totalRooms');

            // Modal elements
            const modalOverlay = document.getElementById('modalOverlay');
            const openModalBtn = document.getElementById('openModalBtn');
            const closeModalBtn = document.getElementById('closeModalBtn');
            const cancelModalBtn = document.getElementById('cancelModalBtn');
            const classForm = document.getElementById('classForm');

            // Input fields
            const gradeInput = document.getElementById('gradeInput');
            const streamInput = document.getElementById('streamInput');
            const roomInput = document.getElementById('roomInput');
            const capacityInput = document.getElementById('capacityInput');
            const teacherInput = document.getElementById('teacherInput');

            // ---------- helpers ----------
            function computeStats(data) {
                const totalClasses = data.length;
                const totalCapacity = data.reduce((sum, cls) => sum + cls.capacity, 0);
                const roomsSet = new Set(data.map(cls => cls.room));
                const totalRooms = roomsSet.size;
                return { totalClasses, totalCapacity, totalRooms };
            }

            function updateStats(data) {
                const stats = computeStats(data);
                if (totalClassesSpan) totalClassesSpan.textContent = stats.totalClasses;
                if (totalCapacitySpan) totalCapacitySpan.textContent = stats.totalCapacity;
                if (totalRoomsSpan) totalRoomsSpan.textContent = stats.totalRooms;
            }

           
            // full refresh
            function refreshUI() {
                renderClasses(classData);
                updateStats(classData);
            }

            // ---------- MODAL CONTROLS ----------
            function openModal() {
                modalOverlay.classList.add('active');
                // reset form
                classForm.reset();
                // focus first input
                setTimeout(() => gradeInput.focus(), 100);
            }

            function closeModal() {
                modalOverlay.classList.remove('active');
            }

            // ---------- ADD CLASS (from form) ----------
            function handleAddClass(e) {
                e.preventDefault();

                // gather values
                const grade = gradeInput.value.trim();
                const stream = streamInput.value.trim();
                const room = roomInput.value.trim();
                const capacity = parseInt(capacityInput.value.trim(), 10);
                const teacher = teacherInput.value.trim();

                // basic validation
                if (!grade || !stream || !room || isNaN(capacity) || capacity < 1 || !teacher) {
                    alert('Please fill all fields correctly.');
                    return;
                }

                // create new class object
                const newClass = {
                    grade,
                    stream,
                    room,
                    capacity,
                    teacher
                };

                // add to data
                classData.push(newClass);

                // re-render
                refreshUI();

                // close modal
                closeModal();
            }

            // ---------- EVENT LISTENERS ----------
            openModalBtn.addEventListener('click', openModal);
            closeModalBtn.addEventListener('click', closeModal);
            cancelModalBtn.addEventListener('click', closeModal);
            // click outside overlay to close
            modalOverlay.addEventListener('click', function(e) {
                if (e.target === modalOverlay) closeModal();
            });
            // escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                    closeModal();
                }
            });

            classForm.addEventListener('submit', handleAddClass);

            // ---------- INIT ----------
            refreshUI();

            // (optional) expose for debugging
            window.__classData = classData;
        })();