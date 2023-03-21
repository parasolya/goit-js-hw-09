import throttle from 'lodash.throttle';
import Notiflix from 'notiflix';

const firstDelayEl = document.getElementsByName('delay');
const delayStepEl = document.getElementsByName('step');
const amountEl = document.getElementsByName('amount');
const submiteBtnEl = document.querySelector('button');
const formEl = document.querySelector('form');

const STORAGE_KEY = 'submit-form';

const inputFirstDelay = firstDelayEl[0];
const inputDelayStep = delayStepEl[0];
const inputAmount = amountEl[0];

let firstDelay = 0;
let step = 0;
let amount = 0;

let formData = {};

const handleComeBackInput = () => {
  const savedMessage = localStorage.getItem(STORAGE_KEY);
  if (savedMessage) {
    formData = JSON.parse(savedMessage);
    inputFirstDelay.value = formData.delay;
    inputDelayStep.value = formData.step;
    inputAmount.value = formData.amount;
  }
};
handleComeBackInput();

const handleInput = event => {
  formData[event.target.name] = event.target.value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...formData }));
};
formEl.addEventListener('input', throttle(handleInput, 500));

const handleCreatePromises = event => {
  submiteBtnEl.disabled = true;

  event.preventDefault();
  const savedMessage = localStorage.getItem(STORAGE_KEY);

  formData = JSON.parse(savedMessage);
  firstDelay = Number(formData.delay);
  step = Number(formData.step);
  amount = formData.amount;

  if (firstDelay < 0 || step < 0 || amount < 0) {
    alert('Please enter a value > 0');
    return;
  }

  let delay;

  for (let index = 0; index <= amount; index++) {
    function createPromise(position, delay) {
      delay = firstDelay + step * index;
      const shouldResolve = Math.random() > 0.3;
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          const a = {
            position,
            delay,
          };

          if (shouldResolve) {
            resolve(a);
          } else {
            reject(a);
          }
        }, delay);
      });

      return promise;
    }

    createPromise(index + 1, delay)
      .then(({ position, delay }) =>
        Notiflix.Notify.info(`✅ Fulfilled promise ${position} in ${delay}ms`)
      )
      .catch(({ position, delay }) =>
        Notiflix.Notify.info(`❌ Rejected promise ${position} in ${delay}ms`)
      );
    if (index === amount - 1) {
      setTimeout(() => {
        submiteBtnEl.disabled = false;
      }, step * amount);
    }
  }
};
submiteBtnEl.addEventListener('click', handleCreatePromises);
