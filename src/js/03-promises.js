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

let delay = 0;
let formData = {};

const handleComeBackInput = () => {
  const savedMessage = localStorage.getItem(STORAGE_KEY);          
  if (savedMessage) {  
      formData = JSON.parse(savedMessage);
      inputFirstDelay.value = formData.delay;   
      inputDelayStep.value = formData.step;
      inputAmount.value = formData.amount;
  };
};
handleComeBackInput();

const handleInput = (event) => {
  formData[event.target.name] = event.target.value;        
  localStorage.setItem(STORAGE_KEY, JSON.stringify({...formData}));     
};
formEl.addEventListener('input', throttle(handleInput, 500));

const handleCreatePromises = (event) => {
  event.preventDefault();
  const savedMessage = localStorage.getItem(STORAGE_KEY);          
    
  formData = JSON.parse(savedMessage);
  const firstDelay = formData.delay;   
  const step = Number(formData.step);
  const amount = formData.amount; 


for (let index = 1; index <= amount; index++) {
  delay = delay + step;
  function createPromise(position, delay) {
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
   }, firstDelay);
  });  
  return promise;
  };  
  
  createPromise(index, delay)
  .then(({position, delay}) => {
      Notiflix.Notify.info(`✅ Fulfilled promise ${position} in ${delay}ms`);
    })
    .catch(({ position, delay }) => {
      Notiflix.Notify.info(`❌ Rejected promise ${position} in ${delay}ms`);
    });
  
};
};
submiteBtnEl.addEventListener('click', handleCreatePromises);

