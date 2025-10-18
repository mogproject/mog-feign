import { test, expect } from '@playwright/test';

import path from 'path';
import fs from 'fs';
import { buildCSS } from '../src/models/CSSBuilder';
import { ViewSettings } from '../src/models/detail/ViewSettings';
import { buildFeignImageCss } from '../src/models/FeignImageCss';

test('Custom CSS button', async ({ context }) => {
  const fileNames = ['test01.json', 'test02.json'];
  const filePaths = fileNames.map((name) => path.resolve(__dirname, `./data/${name}`));
  const fileContents = filePaths.map((path) => fs.readFileSync(path, 'utf-8'));

  await context.addInitScript(`
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async (text) => {
          window.__copiedText__ = text;
          return Promise.resolve();
        },
        readText: async () => window.__copiedText__,
      },
      configurable: true,
    });
  `);

  const page = await context.newPage();
  // Mock window.showOpenFilePicker before the page loads
  await page.addInitScript(
    ([names, contents]) => {
      let call = 0;
      window.showOpenFilePicker = async () => {
        // Return a mock file handle that behaves like a real FileSystemFileHandle
        const file = new File([contents[call]], names[call], { type: 'application/json' });
        call++;
        return [
          {
            getFile: async () => file,
          },
        ];
      };
    },
    [fileNames, fileContents]
  );

  page.on('console', (msg) => console.log(`[BROWSER] ${msg.text()}`));

  await page.setViewportSize({ width: 1300, height: 3400 });
  await page.goto('/');

  //----------------------------------------------------------------------------
  await page.click('#load-all');

  // URL (main)
  await page.click('#main-url-copy');
  const url1 = await page.evaluate(() => navigator.clipboard.readText());
  expect(url1).toBe('https://streamkit.discord.com/overlay/voice/1/1');

  // CSS (main)
  await page.click('#main-css-copy');
  const result1 = await page.evaluate(() => navigator.clipboard.readText());
  const trimmedResult1 = result1.slice(result1.indexOf('\n') + 1);

  const players1 = ['8', '', '', '3', '2', '1', '', '', '', '11', '', '6', '10'];
  const viewSettings1 = new ViewSettings(
    {
      mirror: true,
      speaking: {
        jump: true,
        flash: true,
        flashColor: '#ffffff',
        outline: false,
        outlineColor: '#3ba53b',
      },
      interval: 0,
    },
    {
      show: true,
      front: true,
      shape: 0,
      speaking: { jump: false, flash: false, flashColor: '#ffffff', outline: true, outlineColor: '#3ba53b' },
      offsetY: 0,
    },
    { show: true, fontSize: 20, fontColor: '#ffffff', backgroundColor: '#1e2124', offsetY: 0 },
    { showStreamerFirst: false }
  );
  const expect1 = buildCSS(players1, viewSettings1) + '\n' + buildFeignImageCss();
  const trimmedExpect1 = expect1.slice(expect1.indexOf('\n') + 1);
  expect(trimmedResult1).toBe(trimmedExpect1);

  // URL (quick)
  await page.click('#quick-url-copy');
  const url1a = await page.evaluate(() => navigator.clipboard.readText());
  expect(url1a).toBe('https://streamkit.discord.com/overlay/voice/1/1');

  // CSS (quick)
  await page.click('#main-css-copy');
  const result1a = await page.evaluate(() => navigator.clipboard.readText());
  const trimmedResult1a = result1a.slice(result1.indexOf('\n') + 1);
  expect(trimmedResult1a).toBe(trimmedExpect1);

  //----------------------------------------------------------------------------
  await page.click('#load-all');

  // URL (main)
  await page.click('#main-url-copy');
  const url2 = await page.evaluate(() => navigator.clipboard.readText());
  expect(url2).toBe('https://streamkit.discord.com/overlay/voice/1/2?streamer_avatar_first=true');

  // CSS (main)
  await page.click('#main-css-copy');

  const result2 = await page.evaluate(() => navigator.clipboard.readText());
  const trimmedResult2 = result2.slice(result2.indexOf('\n') + 1);

  const players2 = ['9', '10', '2', '8', '13', '14', '3', '4', '6', '5', '1', '15', '7'];
  const viewSettings2 = new ViewSettings(
    {
      mirror: true,
      speaking: {
        jump: true,
        flash: true,
        flashColor: '#ffffff',
        outline: false,
        outlineColor: '#3ba53b',
      },
      interval: 0,
    },
    {
      show: true,
      front: true,
      shape: 1,
      speaking: { jump: false, flash: false, flashColor: '#ffffff', outline: true, outlineColor: '#3ba53b' },
      offsetY: 0,
    },
    { show: true, fontSize: 16, fontColor: '#ffffff', backgroundColor: '#1e2124', offsetY: 0 },
    { showStreamerFirst: true }
  );
  const expect2 = buildCSS(players2, viewSettings2) + '\n' + buildFeignImageCss();
  const trimmedExpect2 = expect2.slice(expect2.indexOf('\n') + 1);
  expect(trimmedResult2).toBe(trimmedExpect2);

  // URL (quick)
  await page.click('#quick-url-copy');
  const url2a = await page.evaluate(() => navigator.clipboard.readText());
  expect(url2).toBe('https://streamkit.discord.com/overlay/voice/1/2?streamer_avatar_first=true');

  // CSS (quick)
  await page.click('#main-css-copy');
  const result2a = await page.evaluate(() => navigator.clipboard.readText());
  const trimmedResult2a = result2a.slice(result2.indexOf('\n') + 1);
  expect(trimmedResult2a).toBe(trimmedExpect2);
});
