import { test, expect } from '@playwright/test';
import { login } from '../utils/login';

test('get institutions 401', async ({ page }) => {
    await login(page, 'p.rossi', 'test');
    await page.route('https://api.dev.selfcare.pagopa.it/dashboard/v2/institutions', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          detail: 'Internal Server Error',
          instance: 'string',
          invalidParams: [
            {
              name: 'string',
              reason: 'string',
            },
          ],
          status: 401,
          title: 'Internal Server Error',
          type: 'string',
        }),
      });
    });
    await page.waitForResponse('https://api.dev.selfcare.pagopa.it/dashboard/v2/institutions');
    await expect(page.locator('#root')).toContainText('Accedi all’Area Riservata');
  });
  
  test('get institutions 404', async ({ page }) => {
    await login(page, 'p.rossi', 'test');
    await page.route('https://api.dev.selfcare.pagopa.it/dashboard/v2/institutions', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          detail: 'Internal Server Error',
          instance: 'string',
          invalidParams: [
            {
              name: 'string',
              reason: 'string',
            },
          ],
          status: 404,
          title: 'Internal Server Error',
          type: 'string',
        }),
      });
    });
    await page.waitForResponse('https://api.dev.selfcare.pagopa.it/dashboard/v2/institutions');
    await expect(page.getByRole('heading')).toContainText('Accesso non consentito');
    await expect(page.locator('#root')).toContainText('Aggiungi un nuovo Amministratore');
    await page.getByRole('link', { name: 'Aggiungi un nuovo' }).click();
    await expect(page.getByRole('main')).toContainText('Indica per quale prodotto vuoi aggiungere un nuovoAmministratore');
  });
  
  test('get institutions 500', async ({ page }) => {
    await login(page, 'p.rossi', 'test');
    await page.route('https://api.dev.selfcare.pagopa.it/dashboard/v2/institutions', async (route) => {
      console.log('Request intercepted:', route.request().url());
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          detail: 'Internal Server Error',
          instance: 'string',
          invalidParams: [
            {
              name: 'string',
              reason: 'string',
            },
          ],
          status: 500,
          title: 'Internal Server Error',
          type: 'string',
        }),
      });
    });
    await page.waitForResponse('https://api.dev.selfcare.pagopa.it/dashboard/v2/institutions');
  });
  