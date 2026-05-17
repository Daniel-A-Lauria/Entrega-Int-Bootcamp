const { test, expect } = require('@playwright/test');

test('Deve carregar o calendário e buscar feriados da API', async ({ page }) => {
  await page.goto('https://daniel-a-lauria.github.io/Entrega-Int-Bootcamp/');

  const title = page.locator('#calendar-title');
  await expect(title).not.toBeEmpty();

  const holidayList = page.locator('#holiday-list-items li');
  
  await expect(holidayList.first()).toBeVisible({ timeout: 5000 });
});