const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  try {
    for (const width of [320, 375, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
      const response = await page.goto('http://127.0.0.1:8000');
      assert.equal(response.status(), 200);
      assert.match(await page.title(), /普通人如何拥有第一个AI员工/);
      assert.equal(await page.locator('.lessons article').count(), 6);
      for (const id of ['about','audience','outline','outcomes','faq','enroll']) assert.equal(await page.locator(`#${id}`).count(), 1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `overflow at ${width}`);
      for (const link of await page.locator('[data-enroll]').all()) {
        if (!await link.isVisible()) continue;
        await link.click();
        assert.equal(await page.locator('dialog').evaluate(e => e.open), true);
        assert.match(await page.locator('#dialog-description').innerText(), /尚未开放报名和支付/);
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('dialog').evaluate(e => e.open), false);
        assert.equal(await link.evaluate(e => e === document.activeElement), true);
      }
      await page.locator('.hero [data-enroll]').click();
      await page.locator('.confirm').click();
      assert.equal(await page.locator('dialog').evaluate(e => e.open), false);
      const faq = page.locator('details').nth(1);
      await faq.locator('summary').click();
      assert.equal(await faq.evaluate(e => e.open), true);
      assert.match(await faq.innerText(), /费用不包含/);
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}px: content, layout, resources, enrollment, focus, FAQ`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
