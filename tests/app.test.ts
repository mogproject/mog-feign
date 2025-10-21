import { test, expect, Page } from '@playwright/test';

import path from 'path';
import fs from 'fs';
import { buildCSS } from '../src/models/CSSBuilder';
import { ViewSettings } from '../src/models/detail/ViewSettings';
import { buildFeignImageCss } from '../src/models/FeignImageCss';

//==============================================================================
//    Utilities
//==============================================================================
async function setUpPage(page: Page, fileNames: string[]) {
  const filePaths = fileNames.map((name) => path.resolve(__dirname, `./data/${name}`));
  const fileContents = filePaths.map((path) => fs.readFileSync(path, 'utf-8'));

  await page.addInitScript(
    ([names, contents]) => {
      // Define mocks.
      (window as any).__setUpMocks__ = () => {
        // Mock open file pickeer.
        let call = 0;
        (window as any).showOpenFilePicker = async () => {
          // Return a mock file handle that behaves like a real FileSystemFileHandle
          const file = new File([contents[call]], names[call], { type: 'application/json' });
          call++;
          return [
            {
              getFile: async () => file,
            },
          ];
        };

        // Mock clipboard.
        Object.defineProperty(navigator, 'clipboard', {
          value: {
            writeText: async (text: string) => {
              (window as any).__copiedText__ = text;
              return Promise.resolve();
            },
            readText: async () => (window as any).__copiedText__,
          },
          configurable: true,
        });
      };
    },
    [fileNames, fileContents]
  );

  // Output the console log from the page.
  page.on('console', (msg) => {
    const text = msg.text();
    // Ignore some messages.
    if (text.includes('Download the React DevTools')) return;
    if (text.includes('uses the legacy childContextTypes API')) return;
    console.log(`[BROWSER] ${text}`);
  });

  await page.setViewportSize({ width: 1300, height: 3400 });
  await page.goto('/');
  await page.evaluate(() => (window as any).__setUpMocks__());
}

type Result = {
  url: string;
  width: number;
  height: number;
  players: string[];
  view: ViewSettings;
};

function trimFirstLine(s: string) {
  return s.slice(s.indexOf('\n') + 1);
}

async function verifyResult(page: Page, result: Result) {
  const expectCss = trimFirstLine(buildCSS(result.players, result.view) + '\n' + buildFeignImageCss());

  // URL (main)
  await expect(page.locator('#obs-url')).toHaveValue(result.url);

  await page.click('#main-url-copy');
  const url1 = await page.evaluate(() => navigator.clipboard.readText());
  expect(url1).toBe(result.url);

  // Width
  await expect(page.locator('#obs-width')).toHaveValue(result.width.toString());

  // Height
  await expect(page.locator('#obs-height')).toHaveValue(result.height.toString());

  // CSS (main)
  await page.click('#main-css-copy');
  const result1 = await page.evaluate(() => navigator.clipboard.readText());
  expect(trimFirstLine(result1)).toBe(expectCss);

  // URL (quick)
  await page.click('#quick-url-copy');
  const url1a = await page.evaluate(() => navigator.clipboard.readText());
  expect(url1a).toBe(result.url);

  // CSS (quick)
  await page.click('#main-css-copy');
  const result2 = await page.evaluate(() => navigator.clipboard.readText());
  expect(trimFirstLine(result2)).toBe(expectCss);
}

//==============================================================================
//    Tests
//==============================================================================
test('Load setting files', async ({ page }) => {
  await setUpPage(page, ['test01.json', 'test02.json']);

  //----------------------------------------------------------------------------
  await page.click('#load-all');
  const expected1 = {
    url: 'https://streamkit.discord.com/overlay/voice/1/1',
    width: 1772,
    height: 270,
    players: ['8', '', '', '3', '2', '1', '', '', '', '11', '', '6', '10'],
    view: new ViewSettings(
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
    ),
  };

  await verifyResult(page, expected1);

  //----------------------------------------------------------------------------
  await page.click('#load-all');
  const expected2 = {
    url: 'https://streamkit.discord.com/overlay/voice/1/2?streamer_avatar_first=true',
    width: 1772,
    height: 270,
    players: ['9', '10', '2', '8', '13', '14', '3', '4', '6', '5', '1', '15', '7'],
    view: new ViewSettings(
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
    ),
  };

  await verifyResult(page, expected2);
});

test('Set up from scratch', async ({ page }) => {
  await setUpPage(page, []);
  await expect(page.locator('#main-url-copy')).toHaveCount(0);
  await expect(page.locator('#main-css-copy')).toHaveCount(0);
  await expect(page.locator('#quick-url-copy')).toBeDisabled();
  await expect(page.locator('#quick-css-copy')).toBeDisabled();

  // Input URL
  await page.fill('#discord-channel-url', 'https://discord.com/channels/123/456');
  await expect(page.locator('#quick-url-copy')).not.toBeDisabled();
  await page.click('#quick-url-copy');
  const url = await page.evaluate(() => navigator.clipboard.readText());
  expect(url).toBe('https://streamkit.discord.com/overlay/voice/123/456');

  // Input users
  await page.fill('#input-user-name', 'User 001');
  await page.fill('#input-user-id', '012345');
  await page.click('#input-user-submit');

  await page.fill('#input-user-name', 'User 002');
  await page.fill('#input-user-id', '678');
  await page.click('#input-user-submit');

  await page.fill('#input-user-name', 'User 003');
  await page.fill('#input-user-id', '9101112');
  await page.click('#input-user-submit');

  // Input players
  await page.click('#feign-player-color-5');
  await page.locator('[role="option"]', { hasText: 'User 002' }).click();

  await page.click('#feign-player-color-8');
  await page.locator('[role="option"]', { hasText: 'User 001' }).click();

  await page.click('#feign-player-color-12');
  await page.locator('[role="option"]', { hasText: 'User 003' }).click();

  await page.click('#feign-player-color-0');
  await page.locator('[role="option"]', { hasText: 'User 002' }).click();

  // Update view settings
  await page.locator('#fei-interval').evaluate((el) => {
    const input = el as HTMLInputElement;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!;
    nativeInputValueSetter.call(input, '7');

    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

  // Verify results
  const expected = {
    url: 'https://streamkit.discord.com/overlay/voice/123/456',
    players: ['678', '', '', '', '', '', '', '', '12345', '', '', '', '9101112'],
    width: 1856,
    height: 270,
    view: new ViewSettings(
      {
        mirror: true,
        speaking: {
          jump: true,
          flash: true,
          flashColor: '#ffffff',
          outline: false,
          outlineColor: '#3ba53b',
        },
        interval: 7,
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
    ),
  };

  await verifyResult(page, expected);
  // await page.screenshot({ path: 'screenshot.png' });
});
