const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X)'
  });
  const page = await context.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  console.log('Index loaded.');
  
  await page.click('#hamburger-btn');
  console.log('Clicked menu on index.');
  await page.waitForTimeout(1000);
  
  await page.click('a.mobile-link[href="/nosotros"]');
  console.log('Navigating to /nosotros...');
  await page.waitForTimeout(2000);
  
  console.log('Clicking menu on nosotros...');
  await page.click('#hamburger-btn');
  await page.waitForTimeout(1000);
  
  const drawerClass = await page.evaluate(() => document.getElementById('mobile-drawer').className);
  console.log('Mobile drawer class:', drawerClass);
  
  await browser.close();
})();
