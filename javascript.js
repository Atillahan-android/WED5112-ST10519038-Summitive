(function () {
    const defaultUsers = { emails: [], passwords: [] };

    let storedUsers = defaultUsers;
    try {
        const savedUsers = JSON.parse(localStorage.getItem("hotelUsers") || JSON.stringify(defaultUsers));
        storedUsers = {
            emails: Array.isArray(savedUsers.emails) ? savedUsers.emails : [],
            passwords: Array.isArray(savedUsers.passwords) ? savedUsers.passwords : []
        };
    } catch (error) {
        storedUsers = { ...defaultUsers };
    }

    const arrayemail = storedUsers.emails;
    const arraypassword = storedUsers.passwords;

    function saveUsers() {
        localStorage.setItem("hotelUsers", JSON.stringify({
            emails: arrayemail,
            passwords: arraypassword
        }));
    }

    function isValidEmail(email) {
        return /.+@.+\..+/.test(email);
    }

    function isStrongPassword(password) {
        return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
    }

    const authPage = document.querySelector("main");

    const loginForm = document.getElementById("loginForm");
    const loginEmail = document.getElementById("login-email");
    const loginPassword = document.getElementById("login-password");

    if (loginForm && loginEmail && loginPassword && authPage) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = loginEmail.value.trim();
            const password = loginPassword.value.trim();

            if (!email || !password) {
                alert("Please fill in both email and password fields.");
                return;
            }

            if (!isValidEmail(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            if (!isStrongPassword(password)) {
                alert("Password must be at least 8 characters long, contain at least one capital letter, and one number.");
                return;
            }

            const emailIndex = arrayemail.indexOf(email);

            if (emailIndex === -1 || arraypassword[emailIndex] !== password) {
                alert("User not found. Please sign up first.");
                return;
            }

            authPage.innerHTML = `
                <section class="auth-card auth-success-card">
                    <div class="auth-success-box">
                        <h2>Login successful</h2>
                        <p>Welcome back to The Turk Boutique Hotel.</p>
                        <a class="header-link-button" href="Home_page.html">Go home</a>
                    </div>
                </section>
            `;
        });
    }

    const signupForm = document.getElementById("signupForm");
    const signupEmail = document.getElementById("signup-email");
    const signupPassword = document.getElementById("signup-password");
    const signupConfirm = document.getElementById("signup-confirm");

    if (signupForm && signupEmail && signupPassword && signupConfirm && authPage) {
        signupForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = signupEmail.value.trim();
            const password = signupPassword.value.trim();
            const confirmPassword = signupConfirm.value.trim();

            if (!email || !password || !confirmPassword) {
                alert("Please fill in all fields.");
                return;
            }

            if (!isValidEmail(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            if (!isStrongPassword(password)) {
                alert("Password must be at least 8 characters long, contain at least one capital letter, and one number.");
                return;
            }

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            if (arrayemail.includes(email)) {
                alert("This email is already registered.");
                return;
            }

            arrayemail.push(email);
            arraypassword.push(password);
            saveUsers();

            authPage.innerHTML = `
                <section class="auth-card auth-success-card">
                    <div class="auth-success-box">
                        <h2>Signup successful</h2>
                        <p>Your profile has been created.</p>
                        <a class="header-link-button" href="login.html">Go to login</a>
                    </div>
                </section>
            `;
        });
    }
})();

const bookingForm = document.getElementById("bookingForm");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const checkInInput = document.getElementById("checkin");
const checkOutInput = document.getElementById("checkout");
const roomTypeSelect = document.getElementById("room_type");
const bookingInfo = document.getElementById("booking_info");
const bookingReceipt = document.getElementById("booking_receipt");

function calculateStayDays(checkIn, checkOut) {
    if (!checkIn || !checkOut) return 0;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;

    const diffInMs = end - start;
    const dayCount = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    return dayCount > 0 ? dayCount : 0;
}

function updateBookingReceipt() {
    if (!bookingForm || !nameInput || !phoneInput || !checkInInput || !checkOutInput || !roomTypeSelect) {
        return;
    }

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const checkIn = checkInInput.value;
    const checkOut = checkOutInput.value;

    if (!name || !phone || !checkIn || !checkOut) {
        if (bookingReceipt) {
            bookingReceipt.innerHTML = "<h3>Receipt</h3><p>Fill in the booking details to see the total price.</p>";
        }
        if (bookingInfo) {
            bookingInfo.value = "";
        }
        return;
    }

    if (!/^\+?[0-9\s-]{10,15}$/.test(phone)) {
        if (bookingReceipt) {
            bookingReceipt.innerHTML = "<h3>Receipt</h3><p>Please enter a valid phone number to continue.</p>";
        }
        if (bookingInfo) {
            bookingInfo.value = "";
        }
        return;
    }

    const stayDays = calculateStayDays(checkIn, checkOut);
    if (stayDays <= 0) {
        if (bookingReceipt) {
            bookingReceipt.innerHTML = "<h3>Receipt</h3><p>Check-out date must be after the check-in date.</p>";
        }
        if (bookingInfo) {
            bookingInfo.value = "";
        }
        return;
    }

    const selectedRoom = roomTypeSelect.options[roomTypeSelect.selectedIndex];
    const nightlyRate = Number(selectedRoom.dataset.price || 0);
    const total = nightlyRate * stayDays;

    const receiptText = `The Turk Boutique Hotel\n\nGuest: ${name}\nPhone: ${phone}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nStay length: ${stayDays} day(s)\nRoom: ${selectedRoom.text}\nPrice per night: R${nightlyRate}\nTOTAL: R${total}`;

    if (bookingInfo) {
        bookingInfo.value = receiptText;
    }

    if (bookingReceipt) {
        bookingReceipt.innerHTML = `
            <h3>Receipt</h3>
            <p><strong>Guest:</strong> ${name}</p>
            <p><strong>Room:</strong> ${selectedRoom.text}</p>
            <p><strong>Stay:</strong> ${stayDays} day(s)</p>
            <p><strong>Price per night:</strong> R${nightlyRate}</p>
            <p><strong>Total:</strong> <span>R${total}</span></p>
        `;
    }
}

if (bookingForm && nameInput && phoneInput && checkInInput && checkOutInput && roomTypeSelect) {
    [nameInput, phoneInput, checkInInput, checkOutInput, roomTypeSelect].forEach(function (input) {
        input.addEventListener("input", updateBookingReceipt);
        input.addEventListener("change", updateBookingReceipt);
    });

    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const checkIn = checkInInput.value;
        const checkOut = checkOutInput.value;
        const room = roomTypeSelect.value;

        if (!name || !phone || !checkIn || !checkOut || !room) {
            alert("Please fill in all required fields.");
            return;
        }

        if (!/^\+?[0-9\s-]{10,15}$/.test(phone)) {
            alert("Please enter a valid phone number.");
            return;
        }

        if (new Date(checkOut) <= new Date(checkIn)) {
            alert("Check-out date must be after the check-in date.");
            return;
        }

        const selectedRoom = roomTypeSelect.options[roomTypeSelect.selectedIndex];
        const stayDays = calculateStayDays(checkIn, checkOut);
        const total = Number(selectedRoom.dataset.price || 0) * stayDays;

        if (bookingInfo) {
            bookingInfo.value = `The Turk Boutique Hotel\n\nGuest: ${name}\nPhone: ${phone}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nStay length: ${stayDays} day(s)\nRoom: ${selectedRoom.text}\nPrice per night: R${selectedRoom.dataset.price || 0}\nTOTAL: R${total}`;
        }

        if (bookingReceipt) {
            bookingReceipt.innerHTML = `
                <h3>Receipt</h3>
                <p><strong>Guest:</strong> ${name}</p>
                <p><strong>Room:</strong> ${selectedRoom.text}</p>
                <p><strong>Stay:</strong> ${stayDays} day(s)</p>
                <p><strong>Price per night:</strong> R${selectedRoom.dataset.price || 0}</p>
                <p><strong>Total:</strong> R${total}</p>
            `;
        }

        alert("Booking request submitted successfully.");
    });
}
