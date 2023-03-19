function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

const bodyEl = document.querySelector('body');
const BtnStartEl = document.querySelector('button[data-start]');
const BtnStopEl = document.querySelector('button[data-stop]');

const changeColor = {
  IntervalId: null,
  isActive: false,
  start() {
    if (this.isActive) {
      return;
    }
    this.isActive = true;
    this.IntervalId = setInterval(
      () => bodyEl.style.backgroundColor = getRandomHexColor(),
      1000
    );
  },
  stop() {
    clearInterval(this.IntervalId);
  },
};

BtnStartEl.addEventListener('click', () => changeColor.start());

BtnStopEl.addEventListener('click', () => changeColor.stop());
