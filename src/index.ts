// Init app
import { initApp } from './app';

const port = 8000;

initApp().then((app) => {
  app.listen(port, () => {
    // tslint:disable-next-line: no-console
    console.log('Server running in port', port);
  })
}).catch((error) => {
  // tslint:disable-next-line: no-console
  console.error('ERROR', error);
});