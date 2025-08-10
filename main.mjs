// main.mjs - Discord Botのメインプログラム

// 必要なライブラリを読み込み
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import express from 'express';

// .envファイルから環境変数を読み込み
dotenv.config();

// Discord Botクライアントを作成
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,           // サーバー情報取得
        GatewayIntentBits.GuildMessages,    // メッセージ取得
        GatewayIntentBits.MessageContent,   // メッセージ内容取得
        GatewayIntentBits.GuildMembers,     // メンバー情報取得
    ],
});

// ===== 合言葉とロール名を設定 =====
const SECRET_KEYWORD = "apple123"; // 合言葉
const KORNN_WORD1 = 'とうもろこし';
const ROLE_NAME = "異世界1"; // 付与するロール名
const TARGET_CHANNEL_ID = "1327169018464960606"; // 対象チャンネルのID

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