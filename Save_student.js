// Save_student.js
// Works with type="module" or regular script
document.addEventListener('DOMContentLoaded', function() {
    const completeBtn = document.getElementById('completeBtn1');
    if (completeBtn) {
        completeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert("Hello world!");
        });
    }
});