// main.mjs - Discord Botのメインプログラム

// 必要なライブラリを読み込み
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import express from 'express';

// .envファイルから環境変数を読み込み
dotenv.config();

// ===== 合言葉とロール名を設定 =====
const SECRET_KEYWORD = "apple123"; // 合言葉
const KORNN_WORD1 = "とうもろこし"; const KORNN_WORD2 = "🌽";
const ROLE_NAME = "異世界1"; // 付与するロール名
const TARGET_CHANNEL_ID = "1327169018464960606"; // 対象チャンネルのID

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

    // ping応答（テスト用）
    if (message.content.toLowerCase() === 'ping') {
        message.reply('🏓 pong!');
        return;
    }

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
        if (message.content.trim() === KORNN_WORD1 || message.content.trim() === KORNN_WORD2) {
        if (message.author.bot) return; // Bot自身は無視

        if (message.content.toLowerCase() === 'ping') {
            var random = Math.floor( Math.random() * 2 );
            if (random === 0){
                message.reply('とうもろこしです');
            }else if(random === 1){
                message.reply('こーんです');
            }else if(random === 2){
                message.reply('なんでしょうか？');
            }
            return;
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
