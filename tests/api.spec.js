const { test, expect } = require('@playwright/test');

test('Deve carregar o calendário e buscar feriados da API', async ({ page }) => {
  await page.goto('http://localhost:8080');

  const title = page.locator('#calendar-title');
  await expect(title).not.toBeEmpty();

  const holidayList = page.locator('#holiday-list-items li');
  
  await expect(holidayList.first()).toBeVisible({ timeout: 5000 });
});