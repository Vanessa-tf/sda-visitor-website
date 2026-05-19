document.getElementById('visitorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const statusDiv = document.getElementById('formStatus');
    
    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const email = document.getElementById('email').value.trim();
    const heardFrom = document.getElementById('heardFrom').value;
    const prayerRequest = document.getElementById('message').value.trim();
    
    if (!fullName || !whatsapp) {
        showStatus('Please fill in your name and WhatsApp number.', 'error');
        return;
    }
    
    // Basic WhatsApp number validation (starts with + and digits)
    const phoneRegex = /^\+[1-9]\d{7,14}$/;
    if (!phoneRegex.test(whatsapp)) {
        showStatus('Please enter a valid WhatsApp number with country code (e.g. +233501234567).', 'error');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    statusDiv.style.display = 'none';
    
    try {
        const response = await fetch('/api/send-whatsapp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName,
                whatsapp,
                email,
                heardFrom,
                prayerRequest
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showStatus('✅ Welcome message sent to your WhatsApp! Check your phone shortly.', 'success');
            document.getElementById('visitorForm').reset();
        } else {
            showStatus(result.error || 'Something went wrong. Please try again or contact the church directly.', 'error');
        }
    } catch (err) {
        console.error(err);
        showStatus('Network error. Please check your connection and try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '📩 Send & Get Church Info';
    }
});

function showStatus(msg, type) {
    const statusDiv = document.getElementById('formStatus');
    statusDiv.textContent = msg;
    statusDiv.className = `status-message ${type}`;
    statusDiv.style.display = 'block';
    setTimeout(() => {
        if (statusDiv.style.display === 'block') statusDiv.style.display = 'none';
    }, 8000);
}