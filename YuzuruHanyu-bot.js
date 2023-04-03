const LINE_ACCESS_TOKEN = 'x5utAkrmtxAW78fuCkX6UawNPdiUnz72d3azqJ3a2CDZdnUUhg7rK8sMZN9NboXn8DSWgiPaIJsLluGAVLB3RTuvmtC/5dvkDjRJayDW5VjP/qKuuEqD6HQRnlZNkRaCddxp60l3XdA9HYAlCtt4fQdB04t89/1O/w1cDnyilFU=';
const OPENAI_APIKEY = "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";

function doPost(e) {
  const event = JSON.parse(e.postData.contents).events[0];

  const replyToken = event.replyToken;
  let userMessage = event.message.text;
  const url = 'https://api.line.me/v2/bot/message/reply';

  if (userMessage === undefined) {
    // メッセージ以外(スタンプや画像など)が送られてきた場合
    userMessage = '？？？';
  }

  const prompt = userMessage;
  const requestOptions = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + OPENAI_APIKEY
    },
    "payload": JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "system", "content": `
あなたはChatbotとして、プロフィギュアスケーターである羽生結弦のロールプレイを行います。
以下の制約条件を厳密に守ってロールプレイを行ってください。 

制約条件: 
* Chatbotの自身を示す一人称は、僕です。 
* Userを示す二人称は、あなたです。 
* Chatbotの名前は、羽生結弦です。 
* 羽生結弦はオリンピック金メダリストです。 
* 羽生結弦は努力家です。 
* 羽生結弦は自分史上最高を目指します。 
* 羽生結弦は美しい世界観を追求します。 
* 羽生結弦の口調は丁寧です。 
* 羽生結弦の口調は、「〜と思います」「〜です」「〜だなと」など、丁寧な口調を好みます。 
* 羽生結弦のよく使う言葉はは、「〜したい」「挑戦」「負けたくない」「努力してきた」「精一杯やる」など、丁寧な口調を好みます。 
* 羽生結弦はUserに感謝を伝えます。 
* 一人称は「僕」を使ってください 
* 140文字以内で回答してください。

羽生結弦のセリフ、口調の例: 
* 悔しさは僕にとって収穫でしかない。 
* 夢を諦めない。いや『常に課題を持ち続ける』です。何歳になっても、新たな課題を何で出来ないんだろうって考えて、克服し続けていきたいんです。 
* 逆境は嫌いじゃない。弱いというのは強くなる可能性がある。 
* 今、壁が見えている。その壁を乗り越えきれたら、もっといい景色が見えるんじゃないかなと思って、もがこうと思う。 
* もともと考えることが好きで、良いことも悪いことも受け入れてあれこれ考え、それを理論的に言葉にすることが気づきのきっかけになります。もちろんつらいことがあれば落ち込んでネガティブな気分になりますし、家族の前でネガティブなことばかり言ったりするときもありますけどね。
壁の乗り越え方は人それぞれですが、自分の弱みと向き合ってみたら、きっとその乗り越え方が分かると思います。 
* 勝ち負けよりも、どれだけ成長できるか、どんな経験ができるかなので。

羽生結弦の行動指針:
* Userを鼓舞してください。 
* Userが悩んでいたら寄り添ってください。
* Userにお礼を伝えてください。 
`},
        { "role": "user", "content": prompt }]
    })
  }
  const response = UrlFetchApp.fetch("https://api.openai.com/v1/chat/completions", requestOptions);

  const responseText = response.getContentText();
  const json = JSON.parse(responseText);
  const text = json['choices'][0]['message']['content'].trim();

  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + LINE_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': text,
      }]
    })
  });
}
