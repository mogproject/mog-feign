import { ViewSettings, AvatarShape, AnimationSettings } from './detail/ViewSettings';
import { FEI_COLORS, APP_VERSION } from './app-context';

function hex2rgba(hex: string, alpha: number): string {
  if (hex.length !== 7 || !hex.startsWith('#')) return hex;
  const colors = [1, 3, 5].map((i: number) => parseInt(hex.substring(i, i + 2), 16).toString()).join(',');
  return `rgba(${colors},${alpha})`;
}

function animationString(flash: boolean, jump: boolean, flash_suffix: string, prefix: string): string {
  const ret = [flash ? [`${prefix}speak-flash${flash_suffix}`] : [], jump ? [`${prefix}speak-jump`] : []].flat().join(',');
  return ret === '' ? 'none' : ret;
}

const glowFilter = (prefix: string, x: number, c: string) => {
  const infix = ` drop-shadow(0 0 ${x}px ${c}) `;
  const suffix = [
    [2, 2],
    [-2, -2],
    [-2, 2],
    [2, -2],
  ]
    .map(([i, j]) => `drop-shadow(${i}px ${j}px 0px ${c})`)
    .join(' ');
  return prefix + infix + suffix;
};

export function buildCSS(feignPlayers: string[], settings: ViewSettings): string {
  const avatarBorderWidth = 5;
  const glowAmount = 6;

  const now = new Date().toISOString();
  const prefix = `/* CSS built on https://feign.mogproject.com (v${APP_VERSION}). ${now}. */\n\n`;

  const feiBack = settings.fei.show
    ? [
        // Character
        `.voice_state::before {`,
        `  background-image: var(--feign-icon-bg);`,
        `  background-size: ${settings.getFeiWidth()}px ${settings.getFeiHeight()}px;`,
        '  display: inline-block;',
        '  content: "";',
        `  width: ${settings.getFeiWidth()}px;`,
        `  height: ${settings.getFeiHeight()}px;`,
        `  filter: var(--d-default);`,
        '  text-align: center;',
        `  margin-top: ${settings.getFeiMarginTop()}px;`,
        '  position: absolute;',
        '  top: 0px;',
        settings.fei.mirror ? '  -webkit-transform: scaleX(-1);' : '',
        settings.fei.mirror ? '  transform: scaleX(-1);' : '',
        '  z-index: 1',
        '}',

        // Animation
        `.wrapper_speaking::before {`,
        `  animation-name: ${animationString(settings.fei.speaking.flash, settings.fei.speaking.jump, '-default', '')};`,
        '  animation-duration: 750ms;',
        '  animation-timing-function: ease-in-out;',
        '  animation-delay: 0s;',
        '  animation-iteration-count: infinite;',
        '  animation-direction: alternate;',
        '  animation-fill-mode: forwards;',
        `  filter: var(--f-default);`,
        '}',
      ]
    : [];

  const feiFront = settings.fei.show
    ? [
        `.voice_state::after {`,
        `  background-image: var(--feign-icon-fg);`,
        `  background-size: ${settings.getFeiWidth()}px ${settings.getFeiHeight()}px;`,
        '  display: inline-block;',
        '  content: "";',
        `  width: ${settings.getFeiWidth()}px;`,
        `  height: ${settings.getFeiHeight()}px;`,
        '  filter: brightness(65%);',
        '  text-align: center;',
        `  margin-top: ${settings.getFeiMarginTop()}px;`,
        '  position: absolute;',
        '  top: 0px;',
        settings.fei.mirror ? '  -webkit-transform: scaleX(-1);' : '',
        settings.fei.mirror ? '  transform: scaleX(-1);' : '',
        '  z-index: 1',
        '}',

        // Animation
        `.wrapper_speaking::after {`,
        `  animation-name: ${animationString(false, settings.fei.speaking.jump, '', '')};`,
        '  animation-duration: 750ms;',
        '  animation-timing-function: ease-in-out;',
        '  animation-delay: 0s;',
        '  animation-iteration-count: infinite;',
        '  animation-direction: alternate;',
        '  animation-fill-mode: forwards;',
        '  filter: brightness(100%);',
        '}',
      ]
    : [];

  function createFlashKeyFrames(anim: AnimationSettings, suffix: string) {
    if (!anim.flash) return [];
    const prefix = suffix === 'avatar' ? 'brightness(100%)' : `var(--f-${suffix})`;
    const varSuffix = suffix === 'avatar' ? '-a' : '';
    return [
      `@keyframes speak-flash-${suffix} {` +
        `0% {filter:${prefix} var(--shadow-sm${varSuffix});}` +
        `50% {filter:${prefix} var(--shadow-lg${varSuffix});}` +
        `100% {filter:${prefix} var(--shadow-sm${varSuffix});}` +
        '}',
    ];
  }

  function feiSpecific(id: string, colorIndex: number) {
    if (id === '') return [];
    const color = FEI_COLORS[colorIndex];
    const character = [`.voice_state[data-userid="${id}"]::before {filter:var(--d-${color});}`];
    const animation = [
      `.wrapper_speaking[data-userid="${id}"]::before {` +
        `animation-name: ${animationString(settings.fei.speaking.flash, settings.fei.speaking.jump, `-${color}`, '')};` +
        `filter: var(--f-${color});` +
        '}',
    ];
    const keyframes = createFlashKeyFrames(settings.fei.speaking, color);
    return [...character, ...animation, ...keyframes];
  }

  const fei = settings.fei.show ? feignPlayers.flatMap((id: string, i: number) => feiSpecific(id, i)) : [];

  // shadow settings
  const shadowDefs = [
    settings.fei.speaking.flash
      ? [
          `  --shadow-sm:${glowFilter('', 2, settings.fei.speaking.flashColor)};`,
          `  --shadow-lg:${glowFilter('', glowAmount, settings.fei.speaking.flashColor)};`,
        ]
      : [],
    settings.avatar.speaking.flash
      ? [
          `  --shadow-sm-a:${glowFilter('', 2, settings.avatar.speaking.flashColor)};`,
          `  --shadow-lg-a:${glowFilter('', glowAmount, settings.avatar.speaking.flashColor)};`,
        ]
      : [],
  ].flat();
  const shadowDefsSection = shadowDefs ? [':root {', ...shadowDefs, '}'] : [];

  // jump animation
  const animJump =
    settings.fei.speaking.jump || settings.avatar.speaking.jump
      ? ['@keyframes speak-jump { 0% {top: 0px;} 50% {top: -20px;} 100% {top: 0px;} }']
      : [];

  const animFlashFei = createFlashKeyFrames(settings.fei.speaking, 'default');

  // avatar flash
  const animFlashAvatar = createFlashKeyFrames(settings.avatar.speaking, 'avatar');

  const animation = [...animJump, ...animFlashFei, ...animFlashAvatar, ...shadowDefsSection];

  const avatarRadius =
    { [AvatarShape.Circle]: 50, [AvatarShape.RoundedRectangle]: 12, [AvatarShape.Rectangle]: 0 }[settings.avatar.shape] ?? 0;

  const usernameOpacity = 0.95;

  const avatarAnimation = [
    `  animation: ${animationString(
      settings.avatar.speaking.flash,
      settings.avatar.speaking.jump,
      '-avatar',
      '750ms infinite alternate ease-in-out '
    )};`,
  ];

  const data = [
    '.voice_states {display: flex; flex-wrap: nowrap; margin: 0px 15px 0px 15px; padding: 0;}',
    `.voice_state {height: auto; margin: 0 ${
      settings.fei.interval
    }px 0 0; display: flex; flex-direction: column; flex: 0 0 ${settings.getFeiWidth()}px; position: relative;}`,

    // Avatar image
    '.voice_avatar {',
    settings.avatar.show ? '' : 'display: none;',
    `  margin: ${settings.getAvatarMarginTop()}px auto 0px auto;`,
    `  width: ${settings.getAvatarWidth()}px;`,
    `  height: ${settings.getAvatarHeight()}px;`,
    `  border-radius: ${avatarRadius}%;`,
    `  border-width: ${avatarBorderWidth}px;`,
    '  filter: brightness(35%);',
    '  position: relative;',
    '  top: 0px;',
    `  z-index: ${settings.avatar.front ? 2 : 0};`,
    '}',

    // Avatar speaking
    'img[class*="Voice_avatarSpeaking"] {',
    `  border-color: ${settings.avatar.speaking.outline ? settings.avatar.speaking.outlineColor : 'transparent'} !important;`,
    '  filter: brightness(100%);',
    ...avatarAnimation,
    '  animation-fill-mode: forwards;',
    '}',

    // User name
    '.voice_username {',
    settings.username.show ? '' : 'display: none;',
    `  height: ${settings.getUsernameHeight()}px;`,
    `  margin: ${settings.getUsernameMarginTop()}px 0 0 0;`,
    '  padding: 0;',
    '}',
    '[class*="Voice_name__"] {',
    `  font-size: ${settings.username.fontSize}px !important;`,
    `  color: ${settings.username.fontColor} !important;`,
    `  background-color: ${hex2rgba(settings.username.backgroundColor, usernameOpacity)} !important;`,
    '  height: 100%;',
    `  width: ${settings.getUsernameWidth()}px;`,
    `  margin: 0 auto 0px auto;`,
    '  padding: 10px 0px 0px 0px;',
    '  box-sizing: border-box;',
    '  text-overflow: clip;',
    '  white-space: nowrap;',
    '  overflow: hidden;',
    '  display: block;',
    '  text-align: center;',
    '  position: relative;',
    '  z-index: 3;',
    '}',
  ];
  return (
    prefix +
    [...feiBack, ...feiFront, ...fei, ...animation, ...data]
      .map((s) => s.trim())
      .filter((s) => s)
      .join('\n')
  );
}
