// main.mjs - Discord Botのメインプログラム

// 必要なライブラリを読み込み
import { Client, GatewayIntentBits, ChannelType } from 'discord.js';
import dotenv from 'dotenv';
import express from 'express';
import { joinVoiceChannel, VoiceConnectionStatus, StreamType,createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior, entersState} from '@discordjs/voice';
import path from 'path';
import { join } from "path";
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import prism from 'prism-media';
import { Readable } from 'stream';
import { fileURLToPath } from 'url';
import fs from 'fs';
import fetch from 'node-fetch';

// .envファイルから環境変数を読み込み
dotenv.config();

// Discord Botクライアントを作成
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,           // サーバー情報取得
        GatewayIntentBits.GuildMessages,    // メッセージ取得
        GatewayIntentBits.MessageContent,   // メッセージ内容取得
        GatewayIntentBits.GuildMembers,     // メンバー情報取得
        GatewayIntentBits.GuildVoiceStates,
    ],
});

// ===== 合言葉とロール名を設定 =====
const SECRET_KEYWORD1 = "apple1"; // 合言葉
const SECRET_KEYWORD2 = "apple2"; // 合言葉
const SECRET_KEYWORD3 = "apple3"; // 合言葉
const SECRET_KEYWORD4 = "apple4"; // 合言葉
const SECRET_KEYWORD5 = "apple5"; // 合言葉
const SECRET_KEYWORD6 = "apple6"; // 合言葉
const KORNN_WORD1 = 'とうもろこし';
const ROLE_NAME1 = "birthday1"; // 付与するロール名
const ROLE_NAME2 = "birthday2"; // 付与するロール名
const ROLE_NAME3 = "birthday3"; // 付与するロール名
const ROLE_NAME4 = "birthday4"; // 付与するロール名
const ROLE_NAME5 = "birthday5"; // 付与するロール名
const ROLE_NAME6 = "happybirthday!!"; // 付与するロール名
const TARGET_CHANNEL_ID = "1409612262313824316"; // 対象チャンネルのID
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ALARM_FILE = path.resolve(__dirname, 'alarm.mp3') // 再生する音声ファイル

// アラームのスケジュール格納用
let alarms = [];

const queues = new Map();

let cards = [];
try {
  cards = JSON.parse(fs.readFileSync('./cards.json', 'utf-8'));
  console.log(`カードデータ ${cards.length} 件を読み込みました`);
} catch (err) {
  console.error('カードデータの読み込みに失敗しました:', err);
}
// レアリティごとの排出確率
const rarityRates = {
  "★2": 0.885,
  "★3": 0.085,
  "★4": 0.03
};

// Botが起動完了したとき
client.once('ready', async () => {
    console.log(`🎉 ${client.user.tag} が正常に起動しました！`);
    console.log(`📊 ${client.guilds.cache.size} つのサーバーに参加中`);
});

// メッセージが送信されたとき
client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // Bot自身は無視

    // ===== 合言葉判定 =====
        if (message.channel.id === TARGET_CHANNEL_ID) {
    if (message.content.trim() === SECRET_KEYWORD1) {
        const guild = message.guild;
        const role1 = guild.roles.cache.find(r => r.name === ROLE_NAME1);

        if (!role1) {
            await message.reply(`❌ ロール "${ROLE_NAME}" が見つかりません。管理者に連絡してください。`);
            return;
        }

        try {
            await message.member.roles.add(role);
            await message.reply(`✅ ${ROLE_NAME} ロールを付与しました！`);
            console.log(`🔑 ${message.author.tag} に ${ROLE_NAME} を付与`);
        } catch (err) {
            console.error(`❌ ロール付与エラー:`, err);
            await message.reply(`⚠️ ロールを付与できませんでした。Botの権限を確認してください。`);
        }
    }
        if (message.content.trim() === SECRET_KEYWORD2) {
        const guild = message.guild;
        const role2 = guild.roles.cache.find(r => r.name === ROLE_NAME2);

        if (!role2) {
            await message.reply(`❌ ロール "${ROLE_NAME}" が見つかりません。管理者に連絡してください。`);
            return;
        }

        try {
            await message.member.roles.add(role);
            await message.reply(`✅ ${ROLE_NAME} ロールを付与しました！`);
            console.log(`🔑 ${message.author.tag} に ${ROLE_NAME} を付与`);
        } catch (err) {
            console.error(`❌ ロール付与エラー:`, err);
            await message.reply(`⚠️ ロールを付与できませんでした。Botの権限を確認してください。`);
        }
    }
        if (message.content.trim() === SECRET_KEYWORD3) {
        const guild = message.guild;
        const role3 = guild.roles.cache.find(r => r.name === ROLE_NAME3);


        if (!role3) {
            await message.reply(`❌ ロール "${ROLE_NAME}" が見つかりません。管理者に連絡してください。`);
            return;
        }

        try {
            await message.member.roles.add(role);
            await message.reply(`✅ ${ROLE_NAME} ロールを付与しました！`);
            console.log(`🔑 ${message.author.tag} に ${ROLE_NAME} を付与`);
        } catch (err) {
            console.error(`❌ ロール付与エラー:`, err);
            await message.reply(`⚠️ ロールを付与できませんでした。Botの権限を確認してください。`);
        }
    }
        if (message.content.trim() === SECRET_KEYWORD4) {
        const guild = message.guild;
        const role4 = guild.roles.cache.find(r => r.name === ROLE_NAME4);

        if (!role4) {
            await message.reply(`❌ ロール "${ROLE_NAME}" が見つかりません。管理者に連絡してください。`);
            return;
        }

        try {
            await message.member.roles.add(role);
            await message.reply(`✅ ${ROLE_NAME} ロールを付与しました！`);
            console.log(`🔑 ${message.author.tag} に ${ROLE_NAME} を付与`);
        } catch (err) {
            console.error(`❌ ロール付与エラー:`, err);
            await message.reply(`⚠️ ロールを付与できませんでした。Botの権限を確認してください。`);
        }
    }
        if (message.content.trim() === SECRET_KEYWORD5) {
        const guild = message.guild;
        const role5 = guild.roles.cache.find(r => r.name === ROLE_NAME5);


        if (!role5) {
            await message.reply(`❌ ロール "${ROLE_NAME}" が見つかりません。管理者に連絡してください。`);
            return;
        }

        try {
            await message.member.roles.add(role);
            await message.reply(`✅ ${ROLE_NAME} ロールを付与しました！`);
            console.log(`🔑 ${message.author.tag} に ${ROLE_NAME} を付与`);
        } catch (err) {
            console.error(`❌ ロール付与エラー:`, err);
            await message.reply(`⚠️ ロールを付与できませんでした。Botの権限を確認してください。`);
        }
    }
        if (message.content.trim() === SECRET_KEYWORD6) {
        const guild = message.guild;
        const role6 = guild.roles.cache.find(r => r.name === ROLE_NAME6);

        if (!role6) {
            await message.reply(`❌ ロール "${ROLE_NAME}" が見つかりません。管理者に連絡してください。`);
            return;
        }

        try {
            await message.member.roles.add(role);
            await message.reply(`✅ ${ROLE_NAME} ロールを付与しました！`);
            console.log(`🔑 ${message.author.tag} に ${ROLE_NAME} を付与`);
        } catch (err) {
            console.error(`❌ ロール付与エラー:`, err);
            await message.reply(`⚠️ ロールを付与できませんでした。Botの権限を確認してください。`);
        }
    }
  }

    //特定の言葉に反応
    if (message.content.toLowerCase() === KORNN_WORD1) {

        var random = Math.floor( Math.random() * 3 );
        if (random === 0){
            message.reply('とうもろこしです');
        }else if(random === 1){
            message.reply('こーんです');
         }else if(random === 2){
            message.reply('なんでしょうか？');
         }
    }

    // 指定チャンネルでのみ削除
    if (message.channel.id === TARGET_CHANNEL_ID) {
    try {
      await message.delete();
    } catch (err) {
      console.error("メッセージ削除失敗:", err);
    }
    }

    // コマンドチェック: "!roulette"
    if (message.content.toLowerCase().startsWith('!roulette')) {
        // スペースで区切って配列化（最初はコマンドなので除く）
        const args = message.content.trim().split(/\s+/).slice(1);

        if (args.length === 0) {
            await message.reply('例:りんご みかん バナナ');
            return;
        }

        // ランダム選択
        const choice = args[Math.floor(Math.random() * args.length)];

        await message.reply(`ルーレットの結果は… **${choice}** です！🎉`);
    }

    // コマンドチェック: "!slot"
    if (message.content.toLowerCase().startsWith('!slot')) {
    // 外れパターンの数字リスト（777以外）
    const missNumbers = [
      '775', 
      '779', 
      '770', 
      '778', 
      '776',
      '210\n奏の誕生日', 
      '430\n絵名の誕生日', 
      '414\nみのりの誕生日',
      '1005\n遥の誕生日','1027\n穂波の誕生日','1105\nMEIKOの誕生日','1112\n彰人の誕生日',
      '1206\n雫の誕生日','1227\nリン、レンの誕生日','108\n志歩の誕生日','130\nルカの誕生日',
      '217\nKAITOの誕生日','302\nこはねの誕生日','319\n愛莉の誕生日','509\n咲希の誕生日',
      '525\n冬弥の誕生日','624\n類の誕生日','720\n寧々の誕生日','726\n杏の誕生日',
      '811\n一歌の誕生日','831\nミクの誕生日','909\nえむの誕生日',
      '827\n瑞希の誕生日','127\nまふゆの誕生日',
    ];

    //確率で当たり
    const isWin = Math.floor(Math.random() * 50) === 0;
    const isWinner = Math.floor(Math.random() * 300) === 0;

    if (isWinner) {
        await message.reply(`𝐂𝐨𝐧𝐠𝐫𝐚𝐭𝐮𝐥𝐚𝐭𝐢𝐨𝐧！！！ ***77777*** です！🎉🎉🎉`);
    } else if(isWin){
        await message.reply(`𝐂𝐨𝐧𝐠𝐫𝐚𝐭𝐮𝐥𝐚𝐭𝐢𝐨𝐧！！！ **777** です！🎉`);
    }else{
        const miss = missNumbers[Math.floor(Math.random() * missNumbers.length)];
        await message.reply(`**${miss}** です`);
    }
    }

    // コマンドチェック: "!settime" 
if (message.content.startsWith('!settime')) {
    const args = message.content.trim().split(/\s+/);
    const timeArg = args[1]; // HH:MM
    const vcName = args[2];  // VC名
    const url = args[3];     // YouTube URL（省略可）

    if (!timeArg || !vcName) {
      await message.reply('❌ 使い方: `!settime HH:MM VC名 [YouTubeURL]`');
      return;
    }

    const channel = message.guild.channels.cache.find(c =>
      c.type === ChannelType.GuildVoice &&
      c.name.toLowerCase() === vcName.toLowerCase()
    );

    if (!channel) {
      await message.reply(`❌ VC「${vcName}」が見つかりません`);
      return;
    }

    alarms.push({
      guildId: message.guild.id,
      channelId: channel.id,
      time: timeArg,
      url: url || null,
      played: false
    });

    await message.reply(`✅ アラームを ${timeArg} に VC「${vcName}」でセットしました！`);
  }

  // アラーム一覧表示
  if (message.content === '!listtime') {
    const guildAlarms = alarms.filter(a => a.guildId === message.guild.id);
    if (guildAlarms.length === 0) {
      await message.reply('📭 アラームはまだ登録されていません。');
      return;
    }

    let replyText = '⏰ 現在のアラーム一覧:\n';
    alarms.forEach((a, index) => {
    const guild = client.guilds.cache.get(a.guildId);
    let channelName = '不明';
    if (guild) {
      const channel = guild.channels.cache.get(a.channelId);
      if (channel) channelName = channel.name;
    }

    replyText += `${index + 1}. 時間: ${a.time}, VC: ${channelName}, URL: ${a.url ? `<${a.url}>` : 'ローカル音声'}\n`;
  });

    await message.reply(replyText);
  }

  // アラーム削除
  if (message.content.startsWith('!deltime')) {
    const args = message.content.split(/\s+/);
    const index = parseInt(args[1], 10); // 削除したい番号

    if (isNaN(index)) {
      await message.reply('❌ 使い方: `!deltime 番号`');
      return;
    }

    const guildAlarms = alarms.filter(a => a.guildId === message.guild.id);
    if (index < 1 || index > guildAlarms.length) {
      await message.reply('❌ 指定された番号は存在しません。');
      return;
    }

    // 元の配列から削除
    const alarmToDelete = guildAlarms[index - 1];
    const globalIndex = alarms.indexOf(alarmToDelete);
    if (globalIndex > -1) alarms.splice(globalIndex, 1);

    await message.reply(`✅ アラーム ${alarmToDelete.time} を削除しました。`);
  }
    //コマンドチェック: "!yt"
if (message.content.startsWith('!yt')) {
  const args = message.content.split(' ').slice(1);
  const vcName = args[0];
  const url = args[1];

  if (!vcName || !url) {
    await message.reply('❌ VC名とYouTube URLを指定してください\n例: `!yt テストボイス https://youtu.be/...`');
    return;
  }

  const channel = message.guild.channels.cache.find(
    c => c.type === ChannelType.GuildVoice && c.name.toLowerCase() === vcName.toLowerCase()
  );

  if (!channel) {
    await message.reply(`❌ VC「${vcName}」が見つかりません`);
    return;
  }

  // キューを取得 or 新規作成
  let queue = queues.get(message.guild.id);
  if (!queue) {
    queue = {
      connection: joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator
      }),
      player: createAudioPlayer({
        behaviors: { noSubscriber: NoSubscriberBehavior.Play }
      }),
      tracks: []
    };
    queues.set(message.guild.id, queue);

    // Playerのイベント設定
    queue.player.on(AudioPlayerStatus.Idle, () => {
      if (queue.tracks.length > 0) {
        const nextUrl = queue.tracks.shift();
        playTrack(nextUrl, queue);
      } else {
        if (queue.connection.state.status !== VoiceConnectionStatus.Destroyed) {
          queue.connection.destroy();
        }
        queues.delete(message.guild.id);
      }
    });

    queue.player.on('error', error => {
      console.error('AudioPlayerError:', error);
      if (queue.connection.state.status !== VoiceConnectionStatus.Destroyed) {
        queue.connection.destroy();
      }
      queues.delete(message.guild.id);
    });

    queue.connection.subscribe(queue.player);
  }

  // トラックをキューに追加
  queue.tracks.push(url);

  // 再生中でなければ再生開始
  if (queue.player.state.status !== AudioPlayerStatus.Playing) {
    const nextUrl = queue.tracks.shift();
    playTrack(nextUrl, queue);
  }

  await message.reply(`🎵 VC「${vcName}」でYouTubeの音声を再生キューに追加しました`);

}

//コマンドチェック: "!skip"
if (message.content.startsWith('!skip')) {
  const queue = queues.get(message.guild.id);
  if (!queue || queue.tracks.length === 0) {
    await message.reply('⚠️ スキップできる曲がありません');
    return;
  }

  // 再生中の音楽を停止 → 次の曲が自動的に再生される
  queue.player.stop();
  await message.reply('⏭️ 次の曲へスキップしました');
}

// stopコマンド (!stop)
if (message.content.startsWith('!stop')) {
  // 通常キューの停止
  const queue = queues.get(message.guild.id);
  if (queue) {
    queue.player.stop(true);
    queue.tracks = [];
    if (queue.connection && queue.connection.state.status !== VoiceConnectionStatus.Destroyed) {
      queue.connection.destroy();
    }
    queues.delete(message.guild.id);
  }

  await message.reply('⏹️ すべての再生（アラーム含む）を停止しました');
}

  // 単発ガチャ
  if (message.content.startsWith('!ガチャ単発')) {
    const card = gacha();
    await message.reply(`ガチャ結果:\n[${card.prefix}]${card.name} (${card.rarity})`);
  }

  // 10連ガチャ
  if (message.content.startsWith('!ガチャ10連')) {
    const results = [];
    for (let i = 0; i < 10; i++) {
      results.push(gacha());
    }
   let has3or4 = false;

  // ★3以上がない場合はランダムに1枚置き換え
    if (!results.some(c => c.rarity === '★3' || c.rarity === '★4')) {
      const guaranteed = cards.filter(c => c.rarity === '★3' || c.rarity === '★4');
      const index = Math.floor(Math.random() * 10); // どの位置を置き換えるか
      results[index] = guaranteed[Math.floor(Math.random() * guaranteed.length)];
    }
    const reply = results
    .map((c, index) => `${index + 1}. [${c.prefix}]${c.name} (${c.rarity})`)
    .join('\n');
    await message.reply(`10連ガチャ結果:\n${reply}`);
  }

});

setInterval(async () => {
  const now = new Date();
  const nowStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

  for (const alarm of alarms) {
    if (!alarm.played && alarm.time === nowStr) {
      alarm.played = true; // 二重再生防止
      try {
        const guild = client.guilds.cache.get(alarm.guildId);
        if (!guild) continue;

        const channel = guild.channels.cache.get(alarm.channelId);
        if (!channel) continue;

        const connection = joinVoiceChannel({
          channelId: channel.id,
          guildId: guild.id,
          adapterCreator: guild.voiceAdapterCreator,
        });

        await entersState(connection, VoiceConnectionStatus.Ready, 20_000);
        console.log("VoiceChannelへの接続が安定しました。再生を開始します。");

        const player = createAudioPlayer();
        connection.subscribe(player);

        let resource;
        if (alarm.url) {
          const stream = ytdl(alarm.url, { filter:'audioonly', quality:'highestaudio', highWaterMark:1<<25 });
          resource = createAudioResource(stream);
        } else {
          const filePath = join(__dirname, "alarm.mp3");
          resource = createAudioResource(filePath);
        }

        player.play(resource);

        player.on(AudioPlayerStatus.Playing, () => {
          console.log(alarm.url ? `YouTubeを再生中: ${alarm.url}` : "ローカル音声を再生中...");
        });

        player.on(AudioPlayerStatus.Idle, () => {
          console.log("再生が終了しました。");
          if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
            connection.destroy();
          }
        });

      } catch (err) {
        console.error("アラーム再生エラー:", err);
      }
    }
  }
}, 1000); // 1秒ごとにチェック

// トラック再生用関数
async function playTrack(url, queue) {
  try {
    console.log(`▶️ 再生開始: ${url}`);

    const stream = ytdl(url, {
      filter: 'audioonly',
      quality: 'highestaudio',
      highWaterMark: 1 << 25
    });

    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary
    });

    queue.player.play(resource);

    queue.player.on(AudioPlayerStatus.Playing, () => {
      console.log('✅ 再生中...');
    });

    queue.player.on(AudioPlayerStatus.Idle, () => {
      console.log('✅ 再生終了 → 次の曲を再生するか接続を終了');
      if (queue.tracks.length > 0) {
        playTrack(queue.tracks.shift(), queue);
      } else {
        setTimeout(() => {
          if (queue.connection && queue.connection.state.status !== VoiceConnectionStatus.Destroyed) {
            queue.connection.destroy();
          }
        }, 5000);
      }
    });

    queue.player.on('error', (error) => {
      console.error('❌ AudioPlayer エラー:', error);
    });

  } catch (err) {
    console.error('❌ 再生エラー:', err);
  }
}

// ガチャ関数
function gacha() {
  const rand = Math.random();
  let sum = 0;
  let selectedRarity;

  // レアリティ決定
  for (const [rarity, rate] of Object.entries(rarityRates)) {
    sum += rate;
    if (rand <= sum) {
      selectedRarity = rarity;
      break;
    }
  }

  // 選ばれたレアリティからランダムに1枚選択
  const possibleCards = cards.filter(card => card.rarity === selectedRarity);
  const card = possibleCards[Math.floor(Math.random() * possibleCards.length)];

  return card;
}

// エラーハンドリング
client.on('error', (error) => {
    console.error('❌ Discord クライアントエラー:', error);
});

// プロセス終了時の処理
process.on('SIGINT', () => {
    console.log('🛑 Botを終了しています...');
    client.destroy();
    process.exit(0);
});

// Discord にログイン
if (!process.env.DISCORD_TOKEN) {
    console.error('❌ DISCORD_TOKEN が .env ファイルに設定されていません！');
    process.exit(1);
}

console.log('🔄 Discord に接続中...');
client.login(process.env.DISCORD_TOKEN)
    .catch(error => {
        console.error('❌ ログインに失敗しました:', error);
        process.exit(1);
    });

// Express Webサーバーの設定（Render用）
const app = express();
const port = process.env.PORT || 3000;

// ヘルスチェック用エンドポイント
app.get('/', (req, res) => {
    res.json({
        status: 'Bot is running! 🤖',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// サーバー起動
app.listen(port, () => {
    console.log(`🌐 Web サーバーがポート ${port} で起動しました`);
});