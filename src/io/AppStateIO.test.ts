import { describe, it, expect, beforeEach } from 'vitest';
import { AvatarShape } from '../models/detail/ViewSettings';
import { loadAllFromLocalStorage } from './AppStateIO';

describe('AppStateIO.loadAllFromLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should create new state', () => {
    const state = loadAllFromLocalStorage();
    expect(state).toEqual({
      channelURL: '',
      namedChannels: [],
      namedChannelsTableSettings: {
        sortKey: null,
        sortOrder: null,
      },
      discordUsers: [],
      discordUsersTableSettings: {
        sortKey: null,
        sortOrder: null,
      },
      feignPlayers: { group: '', players: new Map<string, string[]>([['', Array(13).fill('')]]) },
      viewSettings: {
        fei: {
          show: true,
          mirror: true,
          speaking: {
            jump: true,
            flash: true,
            flashColor: '#ffffff',
            outline: false,
            outlineColor: '#ffffff',
          },
          interval: 0,
        },
        avatar: {
          show: true,
          front: true,
          shape: AvatarShape.RoundedRectangle,
          speaking: {
            jump: false,
            flash: false,
            flashColor: '#ffffff',
            outline: true,
            outlineColor: '#ffffff',
          },
          offsetY: 0,
        },
        username: {
          show: true,
          fontSize: 20,
          fontColor: '#ffffff',
          backgroundColor: '#1e2124',
          offsetY: 0,
        },
        streamer: {
          showStreamerFirst: false,
        },
      },
      isSpeaking: [],
    });
  });

  it('should load from v0.0.8', () => {
    localStorage.setItem(
      'discord_users',
      '[{"name":"user-0","id":"100"},{"name":"user-1","id":"101"},{"name":"user-2","id":"102"},{"name":"user-3","id":"103"},{"name":"user-4","id":"104"},{"name":"user-5","id":"105"},{"name":"user-6","id":"106"},{"name":"user-7","id":"107"},{"name":"user-8","id":"108"},{"name":"user-9","id":"109"},{"name":"user-10","id":"110"},{"name":"user-11","id":"111"}]'
    );
    localStorage.setItem('feign_players', '["109","105","111","106","108","107","","110","101","102","104","103",""]');
    localStorage.setItem(
      'view_avatar',
      '{"show":true,"front":true,"shape":1,"speaking":{"jump":false,"flash":false,"flashColor":"#ffffff","outline":true,"outlineColor":"#c7f6fa"},"offsetY":0}'
    );
    localStorage.setItem(
      'view_fei',
      '{"mirror":true,"speaking":{"jump":true,"flash":true,"flashColor":"#ffffff","outline":false,"outlineColor":"#3ba53b"},"interval":4}'
    );
    localStorage.setItem('view_streamer', '{"showStreamerFirst":true}');
    localStorage.setItem('view_username', '{"show":true,"fontSize":20,"fontColor":"#ffffff","backgroundColor":"#1e2124","offsetY":1}');
    localStorage.setItem('voice_channel_url', 'https://discord.com/channels/123/321');

    const state = loadAllFromLocalStorage();
    expect(state).toEqual({
      channelURL: 'https://discord.com/channels/123/321',
      namedChannels: [],
      namedChannelsTableSettings: {
        sortKey: null,
        sortOrder: null,
      },
      discordUsers: [
        { groups: [], id: '100', name: 'user-0' },
        { groups: [], id: '101', name: 'user-1' },
        { groups: [], id: '102', name: 'user-2' },
        { groups: [], id: '103', name: 'user-3' },
        { groups: [], id: '104', name: 'user-4' },
        { groups: [], id: '105', name: 'user-5' },
        { groups: [], id: '106', name: 'user-6' },
        { groups: [], id: '107', name: 'user-7' },
        { groups: [], id: '108', name: 'user-8' },
        { groups: [], id: '109', name: 'user-9' },
        { groups: [], id: '110', name: 'user-10' },
        { groups: [], id: '111', name: 'user-11' },
      ],
      discordUsersTableSettings: {
        sortKey: null,
        sortOrder: null,
      },
      feignPlayers: {
        group: '',
        players: new Map<string, string[]>([['', ['109', '105', '111', '106', '108', '107', '', '110', '101', '102', '104', '103', '']]]),
      },
      viewSettings: {
        fei: {
          show: true,
          mirror: true,
          speaking: {
            jump: true,
            flash: true,
            flashColor: '#ffffff',
            outline: false,
            outlineColor: '#3ba53b',
          },
          interval: 4,
        },
        avatar: {
          show: true,
          front: true,
          shape: AvatarShape.RoundedRectangle,
          speaking: {
            jump: false,
            flash: false,
            flashColor: '#ffffff',
            outline: true,
            outlineColor: '#c7f6fa',
          },
          offsetY: 0,
        },
        username: {
          show: true,
          fontSize: 20,
          fontColor: '#ffffff',
          backgroundColor: '#1e2124',
          offsetY: 1,
        },
        streamer: {
          showStreamerFirst: true,
        },
      },
      isSpeaking: Array(11).fill(false),
    });
  });

  it('should load from v1.0.0', () => {
    localStorage.setItem(
      'discord_users',
      '[{"id":"1","name":"ユーザー01","groups":["あいうえお村"]},{"id":"2","name":"ユーザー02","groups":["あいうえお村"]},{"id":"3","name":"ユーザー03","groups":["あいうえお村","かきくけこ村"]},{"id":"4","name":"ユーザー04","groups":["かきくけこ村"]},{"id":"5","name":"ユーザー05","groups":["かきくけこ村"]},{"id":"6","name":"ユーザー06","groups":["あいうえお村","さしすせそ村"]},{"id":"7","name":"ユーザー07","groups":["かきくけこ村"]},{"id":"8","name":"ユーザー08","groups":["かきくけこ村","あいうえお村"]},{"id":"9","name":"ユーザー09","groups":["さしすせそ村"]},{"id":"10","name":"ユーザー10","groups":["あいうえお村"]},{"id":"11","name":"ユーザー11","groups":["あいうえお村","かきくけこ村","さしすせそ村"]},{"id":"12","name":"ユーザー12","groups":["さしすせそ村"]},{"id":"13","name":"ユーザー13","groups":["さしすせそ村"]},{"id":"14","name":"ユーザー14","groups":["かきくけこ村","さしすせそ村"]},{"id":"15","name":"ユーザー15","groups":["かきくけこ村"]}]'
    );
    localStorage.setItem('discord_users_table', '{"sortKey":null,"sortOrder":null}');
    localStorage.setItem(
      'feign_players',
      '{"group":"あいうえお村","players":{"":["","","","","","4","","","","","","",""],"あいうえお村":["8","","","3","2","1","","","","11","","6","10"],"かきくけこ村":["","","4","","","","","","","11","","",""],"さしすせそ村":["","","","","","","","","","","","",""]}}'
    );
    localStorage.setItem(
      'named_channels',
      '[{"name":"あいうえお村","url":"https://discord.com/channels/1/1","createdAt":1759221404555},{"name":"あいうえお村 (1/1突発)","url":"https://discord.com/channels/1/2","createdAt":1759221468066},{"name":"かきくけこ村","url":"https://discord.com/channels/2/2","createdAt":1759221486887},{"name":"さしすせそ村","url":"https://discord.com/channels/3/3","createdAt":1759221502986}]'
    );
    localStorage.setItem('named_channels_table', '{"sortKey":"createdAt","sortOrder":"DESC"}');
    localStorage.setItem(
      'view_avatar',
      '{"show":true,"front":true,"shape":0,"speaking":{"jump":false,"flash":false,"flashColor":"#ffffff","outline":true,"outlineColor":"#3ba53b"},"offsetY":0}'
    );
    localStorage.setItem(
      'view_fei',
      '{"mirror":true,"speaking":{"jump":true,"flash":true,"flashColor":"#ffffff","outline":false,"outlineColor":"#3ba53b"},"interval":0}'
    );
    localStorage.setItem('view_streamer', '{"showStreamerFirst":false}');
    localStorage.setItem('view_username', '{"show":true,"fontSize":20,"fontColor":"#ffffff","backgroundColor":"#1e2124","offsetY":0}');
    localStorage.setItem('voice_channel_url', 'https://discord.com/channels/1/1');

    const state = loadAllFromLocalStorage();
    expect(state).toEqual({
      channelURL: 'https://discord.com/channels/1/1',
      namedChannels: [
        {
          createdAt: 1759221404555,
          name: 'あいうえお村',
          url: 'https://discord.com/channels/1/1',
        },
        {
          createdAt: 1759221468066,
          name: 'あいうえお村 (1/1突発)',
          url: 'https://discord.com/channels/1/2',
        },
        {
          createdAt: 1759221486887,
          name: 'かきくけこ村',
          url: 'https://discord.com/channels/2/2',
        },
        {
          createdAt: 1759221502986,
          name: 'さしすせそ村',
          url: 'https://discord.com/channels/3/3',
        },
      ],
      namedChannelsTableSettings: {
        sortKey: 'createdAt',
        sortOrder: 'DESC',
      },
      discordUsers: [
        { groups: ['あいうえお村'], id: '1', name: 'ユーザー01' },
        { groups: ['あいうえお村'], id: '2', name: 'ユーザー02' },
        { groups: ['あいうえお村', 'かきくけこ村'], id: '3', name: 'ユーザー03' },
        { groups: ['かきくけこ村'], id: '4', name: 'ユーザー04' },
        { groups: ['かきくけこ村'], id: '5', name: 'ユーザー05' },
        { groups: ['あいうえお村', 'さしすせそ村'], id: '6', name: 'ユーザー06' },
        { groups: ['かきくけこ村'], id: '7', name: 'ユーザー07' },
        { groups: ['かきくけこ村', 'あいうえお村'], id: '8', name: 'ユーザー08' },
        { groups: ['さしすせそ村'], id: '9', name: 'ユーザー09' },
        { groups: ['あいうえお村'], id: '10', name: 'ユーザー10' },
        { groups: ['あいうえお村', 'かきくけこ村', 'さしすせそ村'], id: '11', name: 'ユーザー11' },
        { groups: ['さしすせそ村'], id: '12', name: 'ユーザー12' },
        { groups: ['さしすせそ村'], id: '13', name: 'ユーザー13' },
        { groups: ['かきくけこ村', 'さしすせそ村'], id: '14', name: 'ユーザー14' },
        { groups: ['かきくけこ村'], id: '15', name: 'ユーザー15' },
      ],
      discordUsersTableSettings: {
        sortKey: null,
        sortOrder: null,
      },
      feignPlayers: {
        group: 'あいうえお村',
        players: new Map<string, string[]>([
          ['', ['', '', '', '', '', '4', '', '', '', '', '', '', '']],
          ['あいうえお村', ['8', '', '', '3', '2', '1', '', '', '', '11', '', '6', '10']],
          ['かきくけこ村', ['', '', '4', '', '', '', '', '', '', '11', '', '', '']],
          ['さしすせそ村', ['', '', '', '', '', '', '', '', '', '', '', '', '']],
        ]),
      },
      viewSettings: {
        fei: {
          show: true,
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
        avatar: {
          show: true,
          front: true,
          shape: AvatarShape.Circle,
          speaking: {
            jump: false,
            flash: false,
            flashColor: '#ffffff',
            outline: true,
            outlineColor: '#3ba53b',
          },
          offsetY: 0,
        },
        username: {
          show: true,
          fontSize: 20,
          fontColor: '#ffffff',
          backgroundColor: '#1e2124',
          offsetY: 0,
        },
        streamer: {
          showStreamerFirst: false,
        },
      },
      isSpeaking: Array(7).fill(false),
    });
  });

  it('should load from v1.1.0', () => {
    localStorage.setItem(
      'discord_users',
      '[{"id":"1","name":"ユーザー01","groups":["あいうえお村"]},{"id":"2","name":"ユーザー02","groups":["あいうえお村"]},{"id":"3","name":"ユーザー03","groups":["あいうえお村","かきくけこ村"]},{"id":"4","name":"ユーザー04","groups":["かきくけこ村"]},{"id":"5","name":"ユーザー05","groups":["かきくけこ村"]},{"id":"6","name":"ユーザー06","groups":["あいうえお村","さしすせそ村"]},{"id":"7","name":"ユーザー07","groups":["かきくけこ村"]},{"id":"8","name":"ユーザー08","groups":["かきくけこ村","あいうえお村"]},{"id":"9","name":"ユーザー09","groups":["さしすせそ村"]},{"id":"10","name":"ユーザー10","groups":["あいうえお村"]},{"id":"11","name":"ユーザー11","groups":["あいうえお村","かきくけこ村","さしすせそ村"]},{"id":"12","name":"ユーザー12","groups":["さしすせそ村"]},{"id":"13","name":"ユーザー13","groups":["さしすせそ村"]},{"id":"14","name":"ユーザー14","groups":["かきくけこ村","さしすせそ村"]},{"id":"15","name":"ユーザー15","groups":["かきくけこ村"]}]'
    );
    localStorage.setItem('discord_users_table', '{"sortKey":null,"sortOrder":null}');
    localStorage.setItem(
      'feign_players',
      '{"group":"あいうえお村","players":{"":["","","","","","4","","","","","","",""],"あいうえお村":["8","","","3","2","1","","","","11","","6","10"],"かきくけこ村":["","","4","","","","","","","11","","",""],"さしすせそ村":["","","","","","","","","","","","",""]}}'
    );
    localStorage.setItem(
      'named_channels',
      '[{"name":"あいうえお村","url":"https://discord.com/channels/1/1","createdAt":1759221404555},{"name":"あいうえお村 (1/1突発)","url":"https://discord.com/channels/1/2","createdAt":1759221468066},{"name":"かきくけこ村","url":"https://discord.com/channels/2/2","createdAt":1759221486887},{"name":"さしすせそ村","url":"https://discord.com/channels/3/3","createdAt":1759221502986}]'
    );
    localStorage.setItem('named_channels_table', '{"sortKey":"createdAt","sortOrder":"DESC"}');
    localStorage.setItem(
      'view_avatar',
      '{"show":true,"front":true,"shape":0,"speaking":{"jump":false,"flash":false,"flashColor":"#ffffff","outline":true,"outlineColor":"#3ba53b"},"offsetY":0}'
    );
    localStorage.setItem(
      'view_fei',
      '{"show":false,"mirror":true,"speaking":{"jump":true,"flash":true,"flashColor":"#ffffff","outline":false,"outlineColor":"#3ba53b"},"interval":0}'
    );
    localStorage.setItem('view_streamer', '{"showStreamerFirst":false}');
    localStorage.setItem('view_username', '{"show":true,"fontSize":20,"fontColor":"#ffffff","backgroundColor":"#1e2124","offsetY":0}');
    localStorage.setItem('voice_channel_url', 'https://discord.com/channels/1/1');

    const state = loadAllFromLocalStorage();
    expect(state).toEqual({
      channelURL: 'https://discord.com/channels/1/1',
      namedChannels: [
        {
          createdAt: 1759221404555,
          name: 'あいうえお村',
          url: 'https://discord.com/channels/1/1',
        },
        {
          createdAt: 1759221468066,
          name: 'あいうえお村 (1/1突発)',
          url: 'https://discord.com/channels/1/2',
        },
        {
          createdAt: 1759221486887,
          name: 'かきくけこ村',
          url: 'https://discord.com/channels/2/2',
        },
        {
          createdAt: 1759221502986,
          name: 'さしすせそ村',
          url: 'https://discord.com/channels/3/3',
        },
      ],
      namedChannelsTableSettings: {
        sortKey: 'createdAt',
        sortOrder: 'DESC',
      },
      discordUsers: [
        { groups: ['あいうえお村'], id: '1', name: 'ユーザー01' },
        { groups: ['あいうえお村'], id: '2', name: 'ユーザー02' },
        { groups: ['あいうえお村', 'かきくけこ村'], id: '3', name: 'ユーザー03' },
        { groups: ['かきくけこ村'], id: '4', name: 'ユーザー04' },
        { groups: ['かきくけこ村'], id: '5', name: 'ユーザー05' },
        { groups: ['あいうえお村', 'さしすせそ村'], id: '6', name: 'ユーザー06' },
        { groups: ['かきくけこ村'], id: '7', name: 'ユーザー07' },
        { groups: ['かきくけこ村', 'あいうえお村'], id: '8', name: 'ユーザー08' },
        { groups: ['さしすせそ村'], id: '9', name: 'ユーザー09' },
        { groups: ['あいうえお村'], id: '10', name: 'ユーザー10' },
        { groups: ['あいうえお村', 'かきくけこ村', 'さしすせそ村'], id: '11', name: 'ユーザー11' },
        { groups: ['さしすせそ村'], id: '12', name: 'ユーザー12' },
        { groups: ['さしすせそ村'], id: '13', name: 'ユーザー13' },
        { groups: ['かきくけこ村', 'さしすせそ村'], id: '14', name: 'ユーザー14' },
        { groups: ['かきくけこ村'], id: '15', name: 'ユーザー15' },
      ],
      discordUsersTableSettings: {
        sortKey: null,
        sortOrder: null,
      },
      feignPlayers: {
        group: 'あいうえお村',
        players: new Map<string, string[]>([
          ['', ['', '', '', '', '', '4', '', '', '', '', '', '', '']],
          ['あいうえお村', ['8', '', '', '3', '2', '1', '', '', '', '11', '', '6', '10']],
          ['かきくけこ村', ['', '', '4', '', '', '', '', '', '', '11', '', '', '']],
          ['さしすせそ村', ['', '', '', '', '', '', '', '', '', '', '', '', '']],
        ]),
      },
      viewSettings: {
        fei: {
          show: false,
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
        avatar: {
          show: true,
          front: true,
          shape: AvatarShape.Circle,
          speaking: {
            jump: false,
            flash: false,
            flashColor: '#ffffff',
            outline: true,
            outlineColor: '#3ba53b',
          },
          offsetY: 0,
        },
        username: {
          show: true,
          fontSize: 20,
          fontColor: '#ffffff',
          backgroundColor: '#1e2124',
          offsetY: 0,
        },
        streamer: {
          showStreamerFirst: false,
        },
      },
      isSpeaking: Array(7).fill(false),
    });
  });
});
