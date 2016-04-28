import { add, subtract } from './actions.js';

const queryString = window.location.search;
let params = {};
queryString.replace('?', '').split('&').forEach(param => {
  const [key, value] = param.split('=');
  params[key] = value;
});

const id = params.counter;

if (!id) window.location = '/index.html';

fetch(`http://localhost:8080/counters/${id}`)
  .then(res => res.json())
  .then(data => start(data))
  .catch(() => start());

function start({count, id, pushToken}) {
  const controls = document.getElementById('controls');
  const display = document.getElementById('display');

  const receiveMessage = (event) => {
    display.textContent = event.data.count;
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
          .then(sub => {
            if (pushToken) return;
            const data = {pushToken: sub.endpoint.split('/').pop(-1)};
            fetch(`http://localhost:8080/counters/${id}`,
              { method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
              })
              .catch(err => {throw err;});
          })
          .catch(err => console.error('Problem subscribing to push notifications: ', err))
          .then(() => (reg.active) ? sendMessage({type: 'ACTIVATE', count, id}) : undefined);
      })
        .catch((err) => {
          console.error(err);
        });

    navigator.serviceWorker.addEventListener('message', (event) => {
      return receiveMessage(event);
    });
  }
}
