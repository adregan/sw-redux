import { add, subtract } from './actions.js';

const controls = document.getElementById('controls');
const display = document.getElementById('display');

const receiveMessage = (event) => {
  display.textContent = event.data;
};

const sendMessage = (msg) => {
  let messageChannel = new MessageChannel();
  messageChannel.port1.onmessage = receiveMessage;
  navigator.serviceWorker.controller.postMessage(msg, [messageChannel.port2]);
};

controls.addEventListener('click', (event) => {
  event.stopPropagation();

  if (!navigator.serviceWorker.controller) {
    return alert('So sorry something has gone wrong. Please refresh.');
  }

  switch (event.target.id) {
    case 'add':
      return sendMessage(add());
    case 'sub':
      return sendMessage(subtract());
    default:
      return;
  }
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service.js')
    .then((reg) => {
      reg.pushManager.subscribe({userVisibleOnly: true})
        .then(sub => console.log(sub))
        .catch(err => console.error('Problem subscribing to push notifications: ', err))
        .then(() => (reg.active) ? sendMessage({type: 'ACTIVATE'}) : undefined);
    })
    .catch((err) => {
      console.error(err);
    });

  navigator.serviceWorker.addEventListener('message', (event) => {
    return receiveMessage(event);
  });
}

