navigator.serviceWorker.register('/static/service.js')
  .then(reg => {
    console.log(reg.scope);
  })
  .catch(err => console.error(err));
