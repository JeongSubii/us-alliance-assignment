import { startApplication } from '@src/app';

startApplication()
  .then((): void => {
    console.log(`Process Start!!!`);
  })
  .catch((error: unknown): void => {
    console.log(`Process Start Error!!! ${error}`);
  });
