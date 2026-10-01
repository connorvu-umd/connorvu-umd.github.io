// ============================================================
// TUTORIAL 4: JAVASCRIPT FUNDAMENTALS
// RSVP card — completed behavior
// ============================================================

let isGoing = false;
let isNotGoing = false;


// ── ELEMENTS ─────────────────────────────────────────────────

const nameInput = document.querySelector('#name-input');
const guestInput = document.querySelector('#guest-input');
const guestField = document.querySelector('#guest-field');

const btnYes = document.querySelector('#btn-yes');
const btnNo = document.querySelector('#btn-no');
const confirmation = document.querySelector('#confirmation');
const regret = document.querySelector('#regret');
const guestTotal = document.querySelector('#guest-total');


// ── HELPERS ──────────────────────────────────────────────────

const getName = () => {
    const raw = nameInput.value.trim();
    return raw || 'Someone';
};

const getGuests = () => Number(guestInput.value);


// ── STRETCH: RUNNING TOTAL ───────────────────────────────────

const updateGuestTotal = () => {
    const total = getGuests() + 1;

    guestTotal.textContent =
    `${total} ${total === 1 ? 'person' : 'people'} confirmed so far`;
};


// ── TASK 1 & 2: YES / NO BUTTONS ─────────────────────────────

// When the user clicks "Going"
btnYes.addEventListener('click', () => {
    isGoing = true;
    isNotGoing = false;

    btnYes.classList.add('active');
    btnNo.classList.remove('active');

    guestField.classList.remove('hidden');
    guestTotal.classList.remove('hidden');

    confirmation.classList.remove('hidden');
    regret.classList.add('hidden');

    updateConfirmation();
    updateGuestTotal();
});


// When the user clicks "Can't make it"
btnNo.addEventListener('click', () => {
    isGoing = false;
    isNotGoing = true;

    btnNo.classList.add('active');
    btnYes.classList.remove('active');

    guestField.classList.add('hidden');
    guestTotal.classList.add('hidden');

    confirmation.classList.add('hidden');
    regret.classList.remove('hidden');

    regret.textContent = `${getName()} can't make it.`;
});


// ── TASK 3 & 4: CONFIRMATION MESSAGE ─────────────────────────

const updateConfirmation = () => {
    const guests = getGuests();
    let guestLine;

    if (guests === 0) {
        guestLine = 'flying solo.';
    } else if (guests === 1) {
        guestLine = 'bringing 1 guest.';
    } else {
        guestLine = `bringing ${guests} guests.`;
    }

    confirmation.textContent =
    `${getName()} is coming — ${guestLine}`;
};


// ── TASK 5: LIVE UPDATES ─────────────────────────────────────

// Update the confirmation/regret message when the name changes.
nameInput.addEventListener('input', () => {
    if (isGoing) {
        updateConfirmation();
    } else if (isNotGoing) {
        regret.textContent = `${getName()} can't make it.`;
    }
});


// Update the confirmation and running total when the guest
// count changes.
guestInput.addEventListener('input', () => {
    if (isGoing) {
        updateConfirmation();
        updateGuestTotal();
    }
});


// ── DEBUGGING ─────────────────────────────────────────────────

// Type checkStatus() in the browser console to see current
// variable values.

const checkStatus = () => {
    console.log('=== current state ===');
    console.log('isGoing:    ', isGoing);
    console.log('isNotGoing: ', isNotGoing);
    console.log('name:       ', nameInput.value);
    console.log(
        'guests:     ',
        getGuests(),
                '(type:',
                typeof getGuests(),
                ')'
    );
    console.log(
        'raw value:  ',
        guestInput.value,
        '(type:',
                typeof guestInput.value,
                ')'
    );
    console.log('====================');
};


// Type resetCard() in the browser console to clear everything
// and start over.

const resetCard = () => {
    isGoing = false;
    isNotGoing = false;

    nameInput.value = '';
    guestInput.value = '0';

    btnYes.classList.remove('active');
    btnNo.classList.remove('active');

    guestField.classList.add('hidden');
    guestTotal.classList.add('hidden');
    confirmation.classList.add('hidden');
    regret.classList.add('hidden');

    confirmation.textContent = '';
    regret.textContent = '';
    guestTotal.textContent = '';

    console.log('Card reset.');
};
