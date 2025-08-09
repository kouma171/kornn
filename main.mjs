// main.mjs - Discord Botのメインプログラム

// 必要なライブラリを読み込み
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus
} from '@discordjs/voice';

// .envファイルから環境変数を読み込み
dotenv.config();

// ===== 合言葉とロール名を設定 =====
const SECRET_KEYWORD = "apple123"; // 合言葉
const KORNN_WORD1 = 'とうもろこし';
const ROLE_NAME = "異世界1"; // 付与するロール名
const TARGET_CHANNEL_ID = "1327169018464960606"; // 対象チャンネルのID
const FILE_PATH = './sound.mp3';
const timeFile = './times.json';

// Discord Botクライアントを作成
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// Botが起動完了したとき
client.once('ready', () => {
    console.log(`🎉 ${client.user.tag} が正常に起動しました！`);
    console.log(`📊 ${client.guilds.cache.size} つのサーバーに参加中`);
});

// メッセージが送信されたとき
client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // Bot自身は無視

    // ===== 合言葉判定 =====
    if (message.content.trim() === SECRET_KEYWORD) {
        const guild = message.guild;
        const role = guild.roles.cache.find(r => r.name === ROLE_NAME);

        if (!role) {
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
    
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

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
    const missNumbers = ['767', '772', '773', '210', '414', '778', '776'];

    // 1/10の確率で当たり
    const isWin = Math.floor(Math.random() * 10) === 0;

    if (isWin) {
        await message.reply(`おめでとう！！！ **777** です！🎉`);
    } else {
        const miss = missNumbers[Math.floor(Math.random() * missNumbers.length)];
        await message.reply(`残念💦 **${miss}** です`);
    }
    }
});

// 設定ファイル読み込み
let alarmSettings = {};
if (fs.existsSync(timeFile)) {
    alarmSettings = JSON.parse(fs.readFileSync(timeFile));
}

// コマンドで時間とVCを設定
client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('!settime')) {
        const parts = message.content.split(' ');
        if (parts.length < 3) {
            return message.reply('時間とVCを `!settime HH:MM #VC名` の形式で指定してください');
        }

        const time = parts[1];
        if (!/^\d{1,2}:\d{2}$/.test(time)) {
            return message.reply('時間は HH:MM 形式で指定してください');
        }

        const channelMention = message.mentions.channels.first();
        if (!channelMention || channelMention.type !== 2) { // 2 = ボイスチャンネル
            return message.reply('有効なボイスチャンネルをメンションしてください');
        }

        // ギルドごとに保存
        alarmSettings[message.guild.id] = {
            time: time,
            channelId: channelMention.id
        };
        fs.writeFileSync(timeFile, JSON.stringify(alarmSettings));

        message.reply(`🔔 アラームを **${time}** に **${channelMention.name}** で鳴らすよう設定しました`);
    }
});

// 時間監視（1分ごと）
setInterval(async () => {
    const now = new Date();
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hour}:${minute}`;

    for (const [guildId, { time, channelId }] of Object.entries(alarmSettings)) {
        if (time === currentTime) {
            try {
                const channel = await client.channels.fetch(channelId);
                const connection = joinVoiceChannel({
                    channelId: channelId,
                    guildId: guildId,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                });

                const player = createAudioPlayer();
                const resource = createAudioResource(fs.createReadStream(FILE_PATH));
                player.play(resource);
                connection.subscribe(player);

                player.on(AudioPlayerStatus.Idle, () => {
                    connection.destroy();
                });

                console.log(`🎵 ${time} に ${channel.name} で音を再生しました`);
            } catch (err) {
                console.error("再生エラー:", err);
            }
        }
    }
}, 60 * 1000);

// エラーハンドリング
client.on('error', (error) => {
    console.error('❌ Discord クライアントエラー:', error);
});

// プロセス終了時
process.on('SIGINT', () => {
    console.log('🛑 Botを終了しています...');
    client.destroy();
    process.exit(0);
});

// Discord ログイン
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

// Express Webサーバー（Render用）
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.json({
        status: 'Bot is running! 🤖',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});
app.listen(port, () => {
    console.log(`🌐 Web サーバーがポート ${port} で起動しました`);
});
