import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const inputDateEl = document.querySelector('#datetime-picker');
const startBtnEl = document.querySelector('button[data-start]');
const daysTimerEl = document.querySelector('span[data-days]');
const hoursTimerEl = document.querySelector('span[data-hours]');
const minutesTimerEl = document.querySelector('span[data-minutes]');
const secondsTimerEl = document.querySelector('span[data-seconds]');

startBtnEl.setAttribute('disabled', 'disabled');

const timer = {
  IntervalId: null,
  isActive: false,

  start(Dates) {
    if (this.isActive) {
      return;
    }
    this.isActive = true;
    this.IntervalId = setInterval(() => {
      const currentTime = Date.now();

      const intervalTime = Dates - currentTime;
      console.log(intervalTime);

      const { days, hours, minutes, seconds } = convertMs(intervalTime);

      daysTimerEl.innerText = days;
      hoursTimerEl.innerText = hours;
      minutesTimerEl.innerText = minutes;
      secondsTimerEl.innerText = seconds;

      if (intervalTime < 1000) {
        clearInterval(this.IntervalId);
        return;
      }
    }, 1000);
  },
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const endTime = new Date(selectedDates).getTime();
    if (endTime <= Date.now()) {
      Notiflix.Report.failure('Please choose a date in the future', '', 'Ok');
      return (endTime = 0);
    }
    startBtnEl.removeAttribute('disabled');
    startBtnEl.addEventListener('click', () => timer.start(endTime));
  },
};
flatpickr('#datetime-picker', options);

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}
