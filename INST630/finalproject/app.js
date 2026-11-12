const DATA_URL = 'appointments.json';
const STORAGE_KEY = 'appointmentSchedulerData';

async function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch (_) {}
  }
  const response = await fetch(DATA_URL);
  if (!response.ok) throw new Error('Could not load appointments.json');
  const data = await response.json();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function formatDate(dateString) {
  return new Date(dateString + 'T12:00:00').toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

function formatTime(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString([], {
    hour: 'numeric', minute: '2-digit'
  });
}

function getAvailableTimes(data, date) {
  const day = data.availability.find(item => item.date === date);
  if (!day) return [];
  const booked = data.appointments
    .filter(item => item.date === date && item.status !== 'cancelled')
    .map(item => item.time);
  return day.times.filter(time => !booked.includes(time)).sort();
}

async function initScheduler() {
  const calendar = document.getElementById('calendar');
  if (!calendar) return;
  let data = await loadData();
  let month = new Date();
  month.setDate(1);
  let selectedDate = '';
  let selectedTime = '';

  const monthLabel = document.getElementById('month-label');
  const slots = document.getElementById('time-slots');
  const selectedLabel = document.getElementById('selected-date-label');
  const confirmButton = document.getElementById('confirm-button');

  function renderCalendar() {
    // Remove every generated cell before drawing the next month.
    // Leaving old blanks behind causes the calendar to grow on each month change.
    calendar.querySelectorAll('.day, .calendar-blank').forEach(el => el.remove());
    monthLabel.textContent = month.toLocaleDateString(undefined, {month: 'long', year: 'numeric'});
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) {
      const blank = document.createElement('span');
      blank.className = 'calendar-blank';
      calendar.appendChild(blank);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${month.getFullYear()}-${String(month.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'day';
      button.textContent = day;
      const hasSlots = getAvailableTimes(data, date).length > 0;
      const today = new Date(); today.setHours(0,0,0,0);
      const candidate = new Date(date + 'T00:00:00');
      button.disabled = !hasSlots || candidate < today;
      if (date === selectedDate) button.classList.add('selected');
      if (hasSlots && candidate >= today) button.classList.add('available');
      button.addEventListener('click', () => {
        selectedDate = date;
        selectedTime = '';
        renderCalendar();
        renderTimes();
      });
      calendar.appendChild(button);
    }
  }

  function renderTimes() {
    selectedLabel.textContent = selectedDate ? formatDate(selectedDate) : 'Choose a date first';
    slots.innerHTML = '';
    if (!selectedDate) {
      slots.innerHTML = '<p class="muted">Available times will appear here.</p>';
      confirmButton.disabled = true;
      return;
    }
    const times = getAvailableTimes(data, selectedDate);
    if (!times.length) {
      slots.innerHTML = '<p class="muted">No available times for this date.</p>';
      confirmButton.disabled = true;
      return;
    }
    times.forEach(time => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'time-button' + (time === selectedTime ? ' selected' : '');
      button.textContent = formatTime(time);
      button.addEventListener('click', () => {
        selectedTime = time;
        renderTimes();
        confirmButton.disabled = false;
      });
      slots.appendChild(button);
    });
    confirmButton.disabled = !selectedTime;
  }

  document.getElementById('prev-month').addEventListener('click', () => {
    month.setMonth(month.getMonth() - 1); renderCalendar();
  });
  document.getElementById('next-month').addEventListener('click', () => {
    month.setMonth(month.getMonth() + 1); renderCalendar();
  });

  document.getElementById('booking-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!selectedDate || !selectedTime) return;
    // Re-check availability before saving to avoid duplicate bookings in this browser.
    data = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(data));
    if (!getAvailableTimes(data, selectedDate).includes(selectedTime)) {
      document.getElementById('booking-message').textContent = 'Sorry, that time is no longer available. Please choose another.';
      renderCalendar(); renderTimes(); return;
    }
    const form = new FormData(event.currentTarget);
    data.appointments.push({
      id: 'A' + Date.now(),
      name: form.get('name').trim(),
      email: form.get('email').trim(),
      date: selectedDate,
      time: selectedTime,
      reason: form.get('reason').trim(),
      status: 'confirmed'
    });
    saveData(data);
    event.currentTarget.reset();
    selectedTime = '';
    document.getElementById('booking-message').textContent = 'Appointment confirmed! You can view it on the My Appointments page.';
    renderCalendar(); renderTimes();
  });

  renderCalendar();
  renderTimes();
}

function appointmentCard(item, admin = false) {
  const card = document.createElement('article');
  card.className = 'appointment-card';
  const details = document.createElement('div');
  const title = document.createElement('h3');
  title.textContent = admin ? item.name : `Appointment ${item.id}`;
  const info = document.createElement('p');
  info.textContent = `${formatDate(item.date)} · ${formatTime(item.time)}`;
  const extra = document.createElement('p');
  extra.className = 'muted small';
  extra.textContent = admin ? `${item.email}${item.reason ? ' · ' + item.reason : ''}` : (item.reason || 'No reason provided');
  details.append(title, info, extra);
  const actions = document.createElement('div');
  actions.className = 'appointment-actions';
  const status = document.createElement('span');
  status.className = 'status ' + (item.status === 'cancelled' ? 'cancelled' : 'confirmed');
  status.textContent = item.status;
  actions.appendChild(status);
  if (!admin && item.status !== 'cancelled') {
    const cancel = document.createElement('button');
    cancel.className = 'text-button';
    cancel.textContent = 'Cancel';
    cancel.addEventListener('click', async () => {
      const data = await loadData();
      const match = data.appointments.find(a => a.id === item.id);
      if (match) { match.status = 'cancelled'; saveData(data); renderMyAppointments(); }
    });
    actions.appendChild(cancel);
  }
  card.append(details, actions);
  return card;
}

async function renderMyAppointments() {
  const root = document.getElementById('appointments-list');
  if (!root) return;
  const data = await loadData();
  root.innerHTML = '';
  const active = data.appointments.filter(a => a.status !== 'cancelled').sort((a,b) => (a.date+a.time).localeCompare(b.date+b.time));
  const cancelled = data.appointments.filter(a => a.status === 'cancelled');
  if (!data.appointments.length) root.innerHTML = '<div class="empty-state">You do not have any appointments yet.</div>';
  active.forEach(item => root.appendChild(appointmentCard(item)));
  if (cancelled.length) {
    const heading = document.createElement('h2'); heading.textContent = 'Cancelled';
    root.appendChild(heading);
    cancelled.forEach(item => root.appendChild(appointmentCard(item)));
  }
}

async function initAdmin() {
  const root = document.getElementById('admin-appointments');
  if (!root) return;
  const data = await loadData();
  const now = new Date().toISOString().slice(0,10);
  const active = data.appointments.filter(a => a.status !== 'cancelled');
  document.getElementById('admin-total').textContent = data.appointments.length;
  document.getElementById('admin-upcoming').textContent = active.filter(a => a.date >= now).length;
  document.getElementById('admin-slots').textContent = data.availability.reduce((sum, day) => sum + getAvailableTimes(data, day.date).length, 0);
  root.innerHTML = '';
  data.appointments.slice().sort((a,b) => (a.date+a.time).localeCompare(b.date+b.time)).forEach(item => root.appendChild(appointmentCard(item, true)));
  if (!data.appointments.length) root.textContent = 'No appointments have been booked.';

  document.getElementById('availability-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const date = form.get('date');
    const time = form.get('time');
    let current = JSON.parse(localStorage.getItem(STORAGE_KEY));
    let day = current.availability.find(item => item.date === date);
    if (!day) { day = {date, times: []}; current.availability.push(day); }
    if (day.times.includes(time)) {
      document.getElementById('availability-message').textContent = 'That time slot already exists.';
      return;
    }
    day.times.push(time); day.times.sort(); saveData(current);
    document.getElementById('availability-message').textContent = 'Availability added.';
    event.currentTarget.reset();
    initAdmin();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initScheduler().catch(error => console.error(error));
  renderMyAppointments().catch(error => console.error(error));
  initAdmin().catch(error => console.error(error));
});
