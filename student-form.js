// student-form.js - Dialog Tab Switching with Data Population
document.addEventListener('DOMContentLoaded', function() {
  const tabButtons = document.querySelectorAll('.dialog-tab-btn');
  const tabPanels = document.querySelectorAll('.dialog-tab-panel');
  const resetBtn = document.getElementById('resetBtn');
  const completeBtn = document.getElementById('completeBtn');

  // Function to populate admission tab with data from tabs 1 & 2
  function populateAdmissionData() {
    // Get data from Tab 1 - Personal Information
    const studentName = document.getElementById('studentName').value || '-';
    const studentDOB = document.getElementById('studentDOB').value || '-';
    const studentReligion = document.getElementById('studentReligion').value || '-';
    const studentNationality = document.getElementById('studentNationality').value || '-';
    const studentID = document.getElementById('studentID').value || '-';
    
    // Get gender from radio buttons
    let gender = '-';
    if (document.getElementById('genderMale').checked) {
      gender = 'Male';
    } else if (document.getElementById('genderFemale').checked) {
      gender = 'Female';
    }
    
    // Get data from Tab 2 - Contact Information
    const guardianName = document.getElementById('guardianName').value || '-';
    const guardianRelationship = document.getElementById('guardianRelationship').value || '-';
    const guardianPhone = document.getElementById('guardianPhone').value || '-';
    const guardianEmail = document.getElementById('guardianEmail').value || '-';
    const guardianAddress = document.getElementById('guardianAddress').value || '-';
    
    // Format DOB for display
    let formattedDOB = studentDOB;
    if (studentDOB !== '-') {
      const date = new Date(studentDOB);
      formattedDOB = date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: '2-digit' 
      });
    }
    
    // Populate Student Information in Tab 3
    document.getElementById('displayName').textContent = studentName;
    document.getElementById('displayDOB').textContent = formattedDOB;
    document.getElementById('displayGender').textContent = gender;
    document.getElementById('displayNationality').textContent = studentNationality;
    document.getElementById('displayID').textContent = studentID;
    document.getElementById('displayReligion').textContent = studentReligion;
    
    // Populate Contact Information in Tab 3
    document.getElementById('displayGuardian').textContent = guardianName;
    document.getElementById('displayRelationship').textContent = guardianRelationship;
    document.getElementById('displayPhone').textContent = guardianPhone;
    document.getElementById('displayEmail').textContent = guardianEmail;
    document.getElementById('displayAddress').textContent = guardianAddress;
  }

  // Function to switch tabs
  function switchTab(tabIndex) {
    // Remove active class from all tabs and panels
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanels.forEach(panel => panel.classList.remove('active'));
    
    // Add active class to selected tab and panel
    tabButtons[tabIndex].classList.add('active');
    tabPanels[tabIndex].classList.add('active');
    
    // If switching to Admission tab (index 2), populate data
    if (tabIndex === 2) {
      populateAdmissionData();
    }
  }

  // Add click event to each tab button
  tabButtons.forEach((button, index) => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      switchTab(index);
    });
  });

  // Auto-populate when any input changes in tabs 1 & 2
  const inputFields = document.querySelectorAll('#tab0 input, #tab0 select, #tab1 input, #tab1 select, #tab1 textarea');
  inputFields.forEach(field => {
    field.addEventListener('change', function() {
      // If we're on tab 3, update the data
      if (document.getElementById('tab2').classList.contains('active')) {
        populateAdmissionData();
      }
    });
    field.addEventListener('input', function() {
      // If we're on tab 3, update the data
      if (document.getElementById('tab2').classList.contains('active')) {
        populateAdmissionData();
      }
    });
  });



  // Reset button
  resetBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to reset all form fields?')) {
      const inputs = document.querySelectorAll('.form-input, textarea.form-input');
      inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
          input.checked = false;
        } else if (input.tagName === 'SELECT') {
          input.selectedIndex = 0;
        } else {
          input.value = '';
        }
      });
      // Reset gender radios
      document.querySelectorAll('input[name="gender"]').forEach(radio => radio.checked = false);
      // Reset consent
      document.getElementById('consentCheck').checked = false;
      // Reset to first tab
      switchTab(0);
    }
  });

  // Complete button
  completeBtn.addEventListener('click', function() {
    // Populate data one more time before submission
    populateAdmissionData();
    
    // Validate required fields
    const studentName = document.getElementById('studentName').value;
    const guardianName = document.getElementById('guardianName').value;
    const consent = document.getElementById('consentCheck').checked;
    
    if (!studentName) {
      alert('Please fill in the Student Name in Personal Information tab');
      switchTab(0);
      return;
    }
    
    if (!guardianName) {
      alert('Please fill in the Guardian Name in Contact Information tab');
      switchTab(1);
      return;
    }
    
    if (!consent) {
      alert('Please agree to the terms and conditions');
      switchTab(2);
      return;
    }
    
    // Collect all data
    const studentData = {
      name: document.getElementById('studentName').value,
      dob: document.getElementById('studentDOB').value,
      religion: document.getElementById('studentReligion').value,
      nationality: document.getElementById('studentNationality').value,
      gender: document.querySelector('input[name="gender"]:checked')?.value || '',
      idNumber: document.getElementById('studentID').value,
      guardian: document.getElementById('guardianName').value,
      relationship: document.getElementById('guardianRelationship').value,
      phone: document.getElementById('guardianPhone').value,
      email: document.getElementById('guardianEmail').value,
      address: document.getElementById('guardianAddress').value,
      admissionNumber: document.getElementById('admissionNumber').value,
      class: document.getElementById('studentClass').value,
      consent: document.getElementById('consentCheck').checked
    };
    
    console.log('Student Data:', studentData);
    alert('Student record completed successfully!\n\n' + 
          'Name: ' + studentData.name + '\n' +
          'Admission No: ' + studentData.admissionNumber + '\n' +
          'Class: ' + studentData.class);
    
    // Close dialog
    document.getElementById('dialogOverlay').classList.remove('active');
  });

  // Close dialog
  document.getElementById('closeDialogIcon').addEventListener('click', function() {
    document.getElementById('dialogOverlay').classList.remove('active');
  });

  document.getElementById('closeDialogSecondary').addEventListener('click', function() {
    document.getElementById('dialogOverlay').classList.remove('active');
  });

  // Close on overlay click
  document.getElementById('dialogOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('active');
    }
  });

  // Image upload functionality
  document.getElementById('imageUploadBox').addEventListener('click', function() {
    document.getElementById('studentImage').click();
  });

  document.getElementById('studentImage').addEventListener('change', function(e) {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const placeholder = document.querySelector('.image-placeholder');
        placeholder.innerHTML = `<img src="${event.target.result}" style="max-width: 60px; max-height: 60px; border-radius: 50%; object-fit: cover;">`;
      };
      reader.readAsDataURL(this.files[0]);
    }
  });

  // Initialize first tab
  switchTab(0);
});