let seatsLeft = 10; // Total seats in the restaurant
const reservationForm = document.getElementById('reservation-form');
const reservationTable = document.getElementById('reservation-table').getElementsByTagName('tbody')[0];
const seatsLeftElement = document.getElementById('seats-left');
const reservations = [];

// Handle form submission to reserve a table
reservationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const guests = parseInt(document.getElementById('guests').value);

    if (guests > seatsLeft) {
        alert("Not enough seats available!");
        return;
    }

    // Check for duplicate reservations by name
    if (reservations.some(r => r.name === name)) {
        alert("This name is already reserved!");
        return;
    }

    const reservation = {
        name,
        phone,
        guests,
        checkInTime: new Date().toLocaleString(),
        checkedOut: false
    };

    reservations.push(reservation);
    seatsLeft -= guests; // Decrease available seats
    updateSeats();
    renderReservations(); // Update the reservation table
    reservationForm.reset();
});

// Update available seats display
function updateSeats() {
    seatsLeftElement.textContent = seatsLeft;
}

// Render all the current reservations in the table
function renderReservations() {
    reservationTable.innerHTML = '';
    reservations.forEach((reservation, index) => {
        const row = reservationTable.insertRow();
        row.insertCell(0).textContent = reservation.name;
        row.insertCell(1).textContent = reservation.phone;
        row.insertCell(2).textContent = reservation.checkInTime;

        const checkoutButton = document.createElement('button');
        checkoutButton.textContent = reservation.checkedOut ? 'Checked Out' : 'Click to Checkout';
        checkoutButton.disabled = reservation.checkedOut;
        checkoutButton.onclick = () => checkoutReservation(index);
        row.insertCell(3).appendChild(checkoutButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete');
        deleteButton.onclick = () => deleteReservation(index);
        row.insertCell(4).appendChild(deleteButton);
    });
}

// Checkout the reservation, log checkout time and update seats
function checkoutReservation(index) {
    const reservation = reservations[index];
    reservation.checkedOut = true;
    seatsLeft += reservation.guests; // Add back the guests to available seats
    updateSeats();
    renderReservations();
}

// Delete a reservation and adjust available seats accordingly
function deleteReservation(index) {
    const reservation = reservations[index];
    if (!reservation.checkedOut) {
        seatsLeft += reservation.guests; // If not checked out, add guests back to seats
    }
    reservations.splice(index, 1);
    updateSeats();
    renderReservations();
}
