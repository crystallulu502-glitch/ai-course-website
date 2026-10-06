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
      assert.equal(await page.locator('.lessons article').count(), 5);
      for (const id of ['about','benefits','audience','outline','outcomes','example','faq','enroll']) assert.equal(await page.locator(`#${id}`).count(), 1);
      assert.equal(await page.locator('#benefits .cards article').count(), 3);
      assert.equal(await page.locator('#audience .cards article').count(), 4);
      assert.equal(await page.locator('#outcomes .cards article').count(), 4);
      assert.equal(await page.locator('.subtitle').innerText(), '不会编程，也能让AI帮你写内容、整理资料、处理重复工作。');
      assert.match(await page.locator('.hero-price').innerText(), /¥9.9/);
      assert.match(await page.locator('.tags').innerText(), /零基础可学｜手机\/电脑均可｜边学边搭自己的AI员工/);
      assert.equal(await page.locator('#faq summary').count(), 7);
      assert.equal(await page.locator('.output-topics span').count(), 3);
      assert.deepEqual(await page.locator('.output-grid small').allTextContents(), ['标题', '正文', '封面提示词', 'CTA']);
      assert.equal(await page.locator('#example .process article').count(), 3);
      assert.equal(await page.locator('.original-price s').innerText(), '¥49');
      const heroColumns = await page.locator('.hero').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length);
      assert.equal(heroColumns, width <= 640 ? 1 : 2);
      const enrollmentBox = await page.locator('#enroll').boundingBox();
      assert.equal(enrollmentBox.width, width, 'full-width enrollment section');
      for (const button of await page.locator('[data-enroll]').all()) {
        assert.match(await button.innerText(), /9.9元立即解锁/);
        if (await button.isVisible()) {
          const box = await button.boundingBox();
          assert.ok(box.height >= 44 && box.width <= width, `button target at ${width}`);
          assert.equal(await button.evaluate(el => el.scrollWidth <= el.clientWidth), true);
        }
      }
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
