import { expect, test } from '@playwright/test';

test('index page has text next to logo on navbar', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('lipu Linku', { exact: true })).toBeVisible();
});
