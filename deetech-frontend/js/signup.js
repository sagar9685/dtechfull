document.getElementById('sendOtpBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const otp_val = Math.floor(Math.random() * 10000); // Generate a 4-digit OTP
    const emailbody = `<h2>Your OTP is</h2>${otp_val}`;

    if (!email) {
        alert('Please enter your email address.');
        return;
    }

    // Send email using the EmailJS service
    Email.send({
        SecureToken: "d3aaa33e-8032-4521-92c7-755182557aa7",
        To: email, // Use the email variable
        From: "sagargupta7067@gmail.com",
        Subject: "OTP using JS",
        Body: emailbody // Use the email body with OTP
    }).then(
        message => {
            if (message === "OK" || message === "OK") { // Adjust based on the service response
                alert("OTP sent to your email: " + email);
                // Show the OTP input area
                document.getElementById('otp').style.display = "block"; // Ensure the correct element is referenced
            } else {
                alert("Failed to send OTP.");
            }
        }
    ).catch(error => {
        console.error('Error sending email:', error);
    });

    // Store the generated OTP in a variable for later verification
    const otp_btn = document.getElementById('otp_btn');
    
    otp_btn.addEventListener('click', () => {
        const otp_inp = document.getElementById('otp').value; // Corrected element ID
        if (otp_inp == otp_val) {
            alert("Email address verified");
        } else {
            alert("Invalid OTP");
        }
    });
});

document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const otp = document.getElementById('otp').value;

    if (!otp) {
        alert('Please enter the OTP sent to your email.');
        return;
    }

    try {
        const response = await fetch('/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ otp }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            // Proceed with signup logic
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
    }
});
