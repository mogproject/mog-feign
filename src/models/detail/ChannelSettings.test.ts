import { describe, it, expect } from 'vitest';
import { createUrl, isValidVoiceChannelURL, retrieveChannelIDs } from './ChannelSettings';

describe('ChannelSettings.retrieveChannelIDs', () => {
  it('should retrieve channel IDs', () => {
    expect(retrieveChannelIDs('')).toEqual(['', '']);
    expect(retrieveChannelIDs('http://discord.com/channels/1/2')).toEqual(['', '']);
    expect(retrieveChannelIDs('https://discord.com/channels/1/')).toEqual(['', '']);
    expect(retrieveChannelIDs('https://discord.com/channels/1/2')).toEqual(['1', '2']);
    expect(retrieveChannelIDs('https://discord.com/channels/1/2/')).toEqual(['1', '2']);
    expect(retrieveChannelIDs('https://discord.com/channels/1/a/')).toEqual(['', '']);
    expect(retrieveChannelIDs('https://discord.com/channels/x/2/')).toEqual(['', '']);
    expect(retrieveChannelIDs('https://discord.com/channels/1234567890/1234567890')).toEqual(['1234567890', '1234567890']);
  });
});

describe('ChannelSettings.isInvalidVoiceChannelURL', () => {
  it('should determine if the URL is valid', () => {
    expect(isValidVoiceChannelURL('')).toBeFalsy();
    expect(isValidVoiceChannelURL('https://discord.com/channels/1/x/')).toBeFalsy();
    expect(isValidVoiceChannelURL('https://discord.com/channels/1/2')).toBeTruthy();
    expect(isValidVoiceChannelURL('https://discord.com/channels/1/2/')).toBeTruthy();
  });
});

describe('ChannelSettings.createUrl', () => {
  it('should create overlay URL', () => {
    expect(createUrl('12345', '67890', false)).toEqual('https://streamkit.discord.com/overlay/voice/12345/67890');
    expect(createUrl('12345', '67890', true)).toEqual('https://streamkit.discord.com/overlay/voice/12345/67890?streamer_avatar_first=true');
  });
});
