// 青空文庫サンプルテキストデータ
// ファイル容量テスト用のコンテンツ生成に使用

export interface AozoraBunkoWork {
  id: string;
  title: string;
  author: string;
  content: string;
  description: string;
  originalUrl?: string;
}

export const AOZORA_BUNKO_SAMPLES: AozoraBunkoWork[] = [
  {
    id: "wagahai-neko",
    title: "吾輩は猫である",
    author: "夏目漱石",
    description:
      "明治の文豪夏目漱石の代表作。猫の視点から人間社会を描いた風刺的な物語",
    content: `吾輩は猫である。名前はまだ無い。
どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。
吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という人間中で一番獰悪な種族であったそうだ。
この書生というのは時々我々を捕えて煮て食うという話である。しかしその当時は何という考もなかったから別段恐しいとも思わなかった。
ただ彼の掌に載せられてスーと持ち上げられた時何だかフワフワした感じがあったばかりである。
掌の上で少し落ちついて書生の顔を見たのがいわゆる人間というものの見始であろう。
この時妙なものだと思った感じが今でも残っている。第一毛をもって装飾されべきはずの顔がつるつるしてまるで薬缶だ。
その後猫にもだいぶ逢ったがこんな片輪には一度も出会わした事がない。のみならず顔の真中があまりに突起している。
そうしてその穴の中から時々ぷうぷうと煙を吹く。苦しい時にはこの穴から汁を垂らす。どうも咽せぽくて実に弱った。
これが人間の飲食する時の作法であろうと思っていると、今度は我々の前へ座ってつくづくと見ている。
人間というものは見込のないものだと思った。猫の時から薄々気がついていたがこんなに愚なものとは思わなかった。
頭の上に何か乗っている。後で聞くとこれを帽子というのだそうだ。しかし何の意味があってそんなものを乗せているのか分らない。
我々の頭には自然に美しい毛が生えているのにわざわざ別のものを乗せるとは実に奇体な風俗もあったものだ。`,
  },
  {
    id: "kokoro",
    title: "こころ",
    author: "夏目漱石",
    description:
      "明治末期から大正初期を舞台に、人間の心の機微を描いた心理小説の傑作",
    content: `私はその人を常に先生と呼んでいた。だからここでもただ先生と書くだけで本名は打ち明けない。
これは世間を憚かる遠慮というよりも、その方が私にとって自然だからである。
私はその人の記憶を呼び起すごとに、すぐ「先生」といいたくなる。筆を執っても心持は同じ事である。
よそよそしい頭文字などはとても使う気にならない。
私が先生と知り合いになったのは鎌倉である。その時私はまだ若い大学生であった。
暑中休暇を利用して海水浴に行った友達からぽつんと取り残された私は、宿に引き返そうかとも考えたが、
せっかく来た機会を、そう無造作に放棄してしまうのも愚かしいと思い直して、とうとう一人寂しく逗留する事にした。
朝湯に入りながら大きな声でうたう人、昼間から酒を飲んで大きな声で騒ぐ人、夜遅くまで碁を打って勝った負けたで大きな声を出す人、
そういう人達の間に挟まって、一人静かにしているのは結構であったが、朝から晩まで一人でいるのは流石に寂しかった。
そこで私はなるべく外にいる事にした。もし海で遊ぶとすれば、こんな賑やかな宿にいるより、
むしろ浜辺にいた方がましであった。そこには磯もあり岩もあり洞もあった。`,
  },
  {
    id: "botchan",
    title: "坊っちゃん",
    author: "夏目漱石",
    description:
      "愛媛県松山市を舞台にした青春小説。正義感溢れる青年教師の奮闘記",
    content: `親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。
なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。
新築の二階から首を出していたら、同級生の一人が冗談に、いくら威張っても、そこから飛び降りる事は出来まい。
弱虫やーい。と囃したからである。小使に負ぶさって帰って来た時、おやじが大きな眼をして二階ぐらいから飛び降りて腰を抜かす奴があるかと云った。
親類のものから西洋館の厄介になるなら猫にでも劣る奴だと云われた。
実際親類のものは猫よりも価値のないものと見えた。その後猫を見る度にこの親類を思い出す。
それでも無鉄砲と無謀とは違う。無鉄砲は単に後先を考えない非計画的な行動である。
無謀は道理を超越し不合理を冒すことである。だから無鉄砲は時として英雄的行為の要素になるが、無謀は決して英雄的にはなりえない。
おやじは無鉄砲を軽蔑しているが、無謀は別に咎めていなかった。
親類のものは無鉄砲を悪口の種にするが、無謀を善悪の標準外に置いてしまった。
だから親類よりもおやじの方がましである。その親類の厄介になったのは愚である。`,
  },
  {
    id: "takekurabe",
    title: "たけくらべ",
    author: "樋口一葉",
    description: "明治時代の東京下町を舞台に、少年少女の成長を描いた名作",
    content: `廻れば大門の見返り柳いと長けれど、お歯ぐろ溝に燈火うつる三階の騒ぎも手に取る如く、
明けくれなしの車の行来ひにはしる大音寺前と名は仏くさけれど、
わけて花やかなる町と申すべく、一丁目と二丁目の境なる仲の町こそよき心持なれ。
名高き見返り柳は二丁目の入り口にて、仲の町なる大黒屋の店先まではよほど間もあり、
そこらは場末町同じ事、家蒔きみちて狭しと見ゆ。
その間を辿りて横町にはいればそれぞれ商ひはかはれども、ここかしこ軒をならべし茶屋、
待合、角海老、升屋、大文字屋、中なか味なきにはあらず。
裏通りには大音寺門前町と申して、これも繁華の地にて、芝居なども時をりはかかり、
青物、乾物、袖もの、はきもの、その外なに屋とも知れぬまで軒端をならべて、朝夕は人通りの絶間もなし。
これらの町々には拙き店の腰元、芸者、娼妓も数多住みて、その住み込みの娘のうちには好き容姿したるもの多し。
なかには小仕立物習ひに通ふもあり、踊りの師匠のもとへ通ふもあり、芸者のなり行きの志あるも多し。
これらの娘どもは同じ町内に住みて生れ合ひしより自然の約束にて姉妹の契りふかく、
互ひに無心のいひあひなど打ちとけて憚らざるほどに仲よくて、遊ぶにも学ぶにもつれ立ちて歩く事おほし。`,
  },
  {
    id: "hashire-melos",
    title: "走れメロス",
    author: "太宰治",
    description: "友情と信義をテーマにした短編小説の名作",
    content: `メロスは激怒した。必ず、かの邪智暴虐の王を除かなければならぬと決意した。
メロスには政治がわからぬ。メロスは、村の牧人である。笛を吹き、羊と遊んで暮して来た。
けれども邪悪に対しては、人一倍に敏感であった。
きょう未明メロスは村を出発し、野を越え山越え、十里はなれた此のシラクスの市にやって来た。
妹の結婚式も間近かなので、花嫁の衣裳やら祝宴の御馳走やらを買いに来たのである。
先ず、その品々を買い集め、それから都の大路をぶらぶら歩いた。
メロスには竹馬の友があった。セリヌンティウスである。今は此のシラクスの市で、石工をして居る。
その友を、これから訪ねてみるつもりなのである。久しく逢わなかったのだから、訪ねて行くのが楽しみである。
歩いているうちにメロスは、まちの様子を怪しく思った。ひっそりして居る。もう既に日も落ちて、
まちの暗いのは当りまえだが、けれども、なんだか、夜のせいばかりでは無い様に思われた。
市場の店々も大部分は戸を閉めて居る。人通りも少い。メロスは総毛立った。
のんきな牧人メロスも、政治の腐敗を嗅ぎ付けたのである。`,
  },
  {
    id: "ame-nimo-makezu",
    title: "雨ニモマケズ",
    author: "宮沢賢治",
    description: "理想的な人間像を描いた詩として愛され続ける代表作",
    content: `雨ニモマケズ
風ニモマケズ
雪ニモ夏ノ暑サニモマケヌ
丈夫ナカラダヲモチ
慾ハナク
決シテ瞋ラズ
イツモシヅカニワラッテヰル
一日ニ玄米四合ト
味噌ト少シノ野菜ヲタベ
アラユルコトヲ
ジブンヲカンジョウニ入レズニ
ヨクミキキシワカリ
ソシテワスレズ
野原ノ松ノ林ノ陰ノ
小サナ萱ブキノ小屋ニヰテ
東ニ病気ノコドモアレバ
行ッテ看病シテヤリ
西ニツカレタ母アレバ
行ッテソノ稲ノ束ヲ負ヒ
南ニ死ニサウナ人アレバ
行ッテコハガラナクテモイヽトイヒ
北ニケンクヮヤソショウガアレバ
ツマラナイカラヤメロトイヒ
ヒドリノトキハナミダヲナガシ
サムサノナツハオロオロアルキ
ミンナニデクノボートヨバレ
ホメラレモセズ
クニモサレズ
サウイフモノニ
ワタシハナリタイ`,
  },
];

// テキスト生成用のヘルパー関数
export const generateTextContent = (
  targetSizeBytes: number,
  selectedWorks?: string[]
): string => {
  const worksToUse = selectedWorks?.length
    ? AOZORA_BUNKO_SAMPLES.filter((work) => selectedWorks.includes(work.id))
    : AOZORA_BUNKO_SAMPLES;

  let content = "";
  let currentSize = 0;
  let workIndex = 0;

  // タイトルとヘッダーを追加
  const header = `# QA Workbench - ファイル容量テスト用データ
# Brewが醸造した高品質テストデータ
# 生成時刻: ${new Date().toISOString()}
# データ量: ${targetSizeBytes / 1024 / 1024}MB
# 品質チェック: 完了 ✅

===== QA Workbench データ醸造ログ =====
醸造者: Brew Assistant
醸造完了時刻: ${new Date().toLocaleString("ja-JP")}
データ種別: 文章・テキストデータ
文字エンコーディング: UTF-8
品質レベル: プロダクション対応
===================================

`;

  content += header;
  currentSize = Buffer.byteLength(content, "utf8");

  // 目標サイズに達するまでテキストを繰り返し追加
  while (currentSize < targetSizeBytes) {
    const work = worksToUse[workIndex % worksToUse.length];

    const workSection = `

## ${work.title} - ${work.author}

${work.content}

---
`;

    const sectionSize = Buffer.byteLength(workSection, "utf8");

    if (currentSize + sectionSize <= targetSizeBytes) {
      content += workSection;
      currentSize += sectionSize;
    } else {
      // 残りサイズに合わせて切り詰める
      const remainingSize = targetSizeBytes - currentSize;
      const truncatedSection = workSection.substring(0, remainingSize);
      content += truncatedSection;
      break;
    }

    workIndex++;
  }

  return content;
};

// ファイル形式別のコンテンツ生成
export const generateContentByType = (
  targetSizeBytes: number,
  fileType: "txt" | "json" | "csv" | "xml" | "yaml",
  selectedWorks?: string[]
): string => {
  const baseContent = generateTextContent(targetSizeBytes, selectedWorks);

  switch (fileType) {
    case "json":
      return JSON.stringify(
        {
          metadata: {
            title: "QA Workbench ファイル容量テスト",
            generator: "Brew Assistant",
            created: new Date().toISOString(),
            size: `${targetSizeBytes / 1024 / 1024}MB`,
            type: "test-data",
            quality: "production-ready",
          },
          content: baseContent,
        },
        null,
        2
      );

    case "csv":
      const lines = baseContent.split("\n");
      const csvHeader = "id,line_number,content,length\n";
      const csvRows = lines
        .map(
          (line, index) =>
            `${index + 1},${index + 1},"${line.replace(/"/g, '""')}",${
              line.length
            }`
        )
        .join("\n");
      return csvHeader + csvRows;

    case "xml":
      const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<testdata>
  <metadata>
    <generator>Brew Assistant</generator>
    <created>${new Date().toISOString()}</created>
    <size>${targetSizeBytes / 1024 / 1024}MB</size>
    <type>capacity-test</type>
  </metadata>
</testdata>`;
      return xmlContent;

    case "yaml":
      return `# QA Workbench - Generated Content
Size: ${targetSizeBytes / 1024 / 1024}MB
generator: "Brew Assistant"
created: ${new Date().toISOString()}

${baseContent}`;

    default:
      return baseContent;
  }
};

export default AOZORA_BUNKO_SAMPLES;
