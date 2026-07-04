const puppeteer = require('/tmp/node_modules/puppeteer');

async function scrapeImages(query) {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(`https://images.search.yahoo.com/search/images?p=${encodeURIComponent(query)}`, { waitUntil: 'domcontentloaded' });
    
    const results = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.map(i => i.getAttribute('data-src') || i.src)
                   .filter(src => src && src.startsWith('http') && !src.includes('yimg.com/a'));
    });
    
    await browser.close();
    return results.slice(0, 3).map(u => ({ url: u }));
}

module.exports = { scrapeImages };
