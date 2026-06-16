import { SupportedLanguage } from "./language";

export interface TranslationSchema {
  metadata: {
    title: string;
    description: string;
  };
  header: {
    title: string;
  };
  nav: {
    home: string;
    scene3d: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    scroll: string;
  };
  chapters: {
    chapter1: {
      eyebrow: string;
      title: string;
      p1: string;
      p2: string;
      p3: string;
    };
    chapter2: {
      eyebrow: string;
      title: string;
      p1: string;
      p2: string;
      p3: string;
    };
    chapter3: {
      eyebrow: string;
      title: string;
      p1: string;
      p2: string;
      p3: string;
    };
    chapter4: {
      eyebrow: string;
      title: string;
      p1: string;
      p2: string;
      p3: string;
    };
    chapter5: {
      eyebrow: string;
      title: string;
      p1: string;
      p2: string;
      p3: string;
    };
  };
  final: {
    eyebrow: string;
    title: string;
    p1: string;
    p2: string;
    button: string;
  };
  loader: {
    preparing: string;
  };
  overlay: {
    ritual: string;
    finalRecipe: string;
    matcha: string;
    warmWater: string;
    waterTemp: string;
    back: string;
  };
  steps: {
    intro: {
      title: string;
      body: string;
    };
    powder: {
      eyebrow: string;
      title: string;
      body: string;
    };
    sift: {
      eyebrow: string;
      title: string;
      body: string;
    };
    water: {
      eyebrow: string;
      title: string;
      body: string;
    };
    whisk: {
      eyebrow: string;
      title: string;
      body: string;
    };
    finish: {
      title: string;
      body: string;
    };
  };
}

export const translations: Record<SupportedLanguage, TranslationSchema> = {
  "zh-tw": {
    nav: {
      home: "首頁",
      scene3d: "3D 場景",
    },
    metadata: {
      title: "Matcha - 一期一會",
      description: "一碗抹茶，一期一會。跟隨呼吸與滾動的節奏，在沉浸式 3D 互動中，體驗從落粉、過篩、注水到擊拂的靜心儀式。",
    },
    header: {
      title: "Matcha",
    },
    hero: {
      eyebrow: "專注的儀式",
      title: "喚醒\n你的感官",
      description:
        "在這個什麼都講求快速的時代，抹茶偏偏要你放慢下來。沒辦法急，急了就沒了那個味道。向下捲動，讓我們慢慢聊聊這杯茶的故事。",
      scroll: "向下捲動",
    },
    chapters: {
      chapter1: {
        eyebrow: "第一章",
        title: "從中國到日本，\n一杯茶的旅行",
        p1: "抹茶這件事，要從唐朝說起。那時候中國人把茶葉壓成茶餅，要喝的時候磨成粉再加水攪拌，這就是點茶法的雛形。日本僧人榮西在 1191 年回國的時候，把這套喝法和茶的種子一起帶了回去，種在了京都郊外的土地上。",
        p2: "然後在室町時代，茶道開始成型。到了千利休的時候，他做了一件了不起的事——他把喝茶這件事從貴族的炫耀場合，變成了一種人人都能感受的心靈修煉。他說，茶席不分貴賤，只要你走進那個空間，就請你真誠地放下一切。",
        p3: "這個理念後來被稱為「侘寂」（Wabi-sabi）——在不完美與不長久之中，找到最深沉的美。一個歪歪的茶碗，一根斑駁的竹杓，這些「缺陷」反而成了最有靈魂的地方。",
      },
      chapter2: {
        eyebrow: "第二章",
        title: "那抹翠綠，\n是怎麼來的？",
        p1: "很多人好奇，為什麼抹茶的顏色可以那麼鮮豔？這背後其實藏著一個很有趣的農業邏輯。在採摘前的三到四週，茶農會用遮光棚把茶樹整個罩起來，讓它見不到太陽。",
        p2: "這不是在折磨茶樹，而是讓茶樹在黑暗中拼命生產葉綠素，同時積累大量的茶氨酸——也就是那股讓你喝了之後覺得甘甜、腦袋突然清醒的成分。遮光越徹底，顏色越深，香氣越濃，價格當然也越貴。",
        p3: "採摘之後的步驟就更講究了。茶葉得立刻蒸青，把氧化的酵素統統殺掉，鎖住那個顏色和香氣，再烘乾、去除葉脈和莖，剩下的那部分叫做「碾茶」，才終於能進石臼研磨。一台石臼一個小時只能磨出不到 50 克，你說慢不慢？",
      },
      chapter3: {
        eyebrow: "第三章",
        title: "那些陪著你的\n老朋友們",
        p1: "茶道裡的道具不只是工具，每一件都像是有性格的老朋友。茶碗（Chawan）是裡面最有看頭的一個——它故意做得不對稱，釉色也故意不均勻，因為那些「不完美」才是美的本體。據說老師傅在做茶碗的時候，從來不追求規整，追求的是一種偶然的靈氣。",
        p2: "茶筅（Chasen）是用來打茶的竹製刷子，整個由一塊竹子手工劈開製成，細細密密的竹齒讓抹茶粉和熱水在幾秒內乳化成一層綿密的泡沫。一把好的茶筅可以用很久，壞掉了不是直接丟，而是在茶人聚會上舉辦「茶筅供養」，感謝它的服務，然後用火焚化送走。",
        p3: "茶杓（Chashaku）就更有意思了，一根薄薄的竹片，只是用來挖茶粉，但每一根都是由茶人或職人親手削製，有些名師留下的茶杓甚至是傳家寶，一輩一輩地傳下去。",
      },
      chapter4: {
        eyebrow: "第四章",
        title: "和、敬、清、寂，\n四個字說完一輩子",
        p1: "千利休用這四個字濃縮了整個茶道的精神。和，是你和環境、和對方、和自己的和解；敬，不是那種表演性質的禮貌，而是真心覺得眼前的每件事都值得尊重；清，不是乾淨，而是沒有雜念；寂，是在安靜裡感受到的那種充實感，而不是空洞的孤獨。",
        p2: "茶道裡還有一個很讓人著迷的概念叫「一期一會」。字面上是「一生只見這一次」，意思是，不管你跟這個人見過多少次面，每一次相遇都要當作是最後一次來對待。喝下去的那碗茶，這個時間點、這個光線、這個溫度，永遠不會再有第二次。",
        p3: "這個概念放到現代生活裡其實很有共鳴。我們每天都在被通知轟炸、滑不完的動態，抹茶茶道提醒的就是一件事：放下手機，好好待在這一刻。",
      },
      chapter5: {
        eyebrow: "第五章",
        title: "打一碗抹茶，\n沒你想的那麼難",
        p1: "很多人以為茶道是遙遠的事，搞很久學不來，或是要有很多昂貴的道具才能開始。其實不然。一開始你只需要一個茶碗、一把茶筅、一根茶杓，加上品質說得過去的抹茶粉，就可以在家裡試試看了。",
        p2: "水溫控制在 70 到 80 度之間，太燙會讓抹茶變澀；先用少量的水把茶粉調成糊狀，再慢慢加水；茶筅要以「M」或「W」的走向快速來回刷，而不是畫圈。泡沫打得夠細，入口的時候就會有一種絲滑的口感，然後是慢慢散開的甘甜。",
        p3: "第一次不會很完美，茶粉可能結塊，泡沫可能打不均勻，但這本來就是個需要練習的事。茶道從來不追求第一次就做好，它追求的是你在反覆練習裡慢慢懂得的那些東西。",
      },
    },
    final: {
      eyebrow: "現在",
      title: "準備好了嗎？",
      p1: "看完這些，你大概已經對抹茶有了完全不一樣的感受。它不只是一個飲料的口味，更是一項傳承百年的生活藝術。",
      p2: "接下來，我們為你準備了一個 3D 沉浸式滾動動畫體驗。當你向下滾動，畫面會隨著你的步調，一步步流暢地演繹沖泡抹茶的完整儀式——從落粉、過篩、注水，到茶筅擊拂出細密泡沫。跟隨你自己的節奏，親眼見證一碗茶的誕生吧。",
      button: "進入 3D 場景",
    },
    loader: {
      preparing: "準備中",
    },
    overlay: {
      ritual: "儀式",
      finalRecipe: "配方",
      matcha: "抹茶",
      warmWater: "溫水",
      waterTemp: "水溫",
      back: "返回首頁",
    },
    steps: {
      intro: {
        title: "一期一會",
        body: "放下繁雜，跟隨節奏，見證一碗茶的誕生。",
      },
      powder: {
        eyebrow: "步驟 01",
        title: "落粉",
        body: "細緻的翠綠粉末盛於篩網之中，懸於茶碗之上，靜靜等待開始。",
      },
      sift: {
        eyebrow: "步驟 02",
        title: "過篩",
        body: "在注水之前，讓茶粉濾得更為細緻，這是為了後續能打出綿密泡沫的講究。",
      },
      water: {
        eyebrow: "步驟 03",
        title: "注水",
        body: "以 75 度的溫水緩緩注入，喚醒茶香，而不燙傷茶粉。",
      },
      whisk: {
        eyebrow: "步驟 04",
        title: "擊拂",
        body: "用茶筅以 W 字型快速來回刷動，直到表面浮現如絲絨般的細密泡沫。",
      },
      finish: {
        title: "屬於你的時刻",
        body: "這就是屬於你的抹茶儀式。放慢腳步，好好享受這一刻的寧靜與甘甜。",
      },
    },
  },
  "zh-cn": {
    nav: {
      home: "首页",
      scene3d: "3D 场景",
    },
    metadata: {
      title: "Matcha - 一期一会",
      description: "一碗抹茶，一期一会。跟随呼吸与滚动的节奏，在沉浸式 3D 互动中，体验从落粉、过筛、注水到击拂的静心仪式。",
    },
    header: {
      title: "Matcha",
    },
    hero: {
      eyebrow: "专注的仪式",
      title: "唤醒\n你的感官",
      description:
        "在这个什么都讲求快速的时代，抹茶偏偏要你放慢下来。没办法急，急了就没了那个味道。向下滚动，让我们慢慢聊聊这杯茶的故事。",
      scroll: "向下滚动",
    },
    chapters: {
      chapter1: {
        eyebrow: "第一章",
        title: "从中国到日本，\n一杯茶的旅行",
        p1: "抹茶这件事，要从唐朝说起。那时候中国人把茶叶压成茶饼，要喝的时候磨成粉再加水搅拌，这就是点茶法的雏形。日本僧人荣西在 1191 年回国的时候，把这套喝法和茶的种子一起带了回去，种在了京都郊外的土地上。",
        p2: "然后在室町时代，茶道开始成型。到了千利休的时候，他做了一件了不起的事——他把喝茶这件事从贵族的炫耀场合，变成了一种人人都能感受的心灵修炼。他说，茶席不分贵贱，只要你走进那个空间，就请你真诚地放下一切。",
        p3: "这个理念后来被称为「侘寂」（Wabi-sabi）——在不完美与不长久之中，找到最深沉的美。一个歪歪的茶碗，一根斑驳的竹杓，这些「缺陷」反而成了最有灵魂的地方。",
      },
      chapter2: {
        eyebrow: "第二章",
        title: "那抹翠绿，\n是怎么来的？",
        p1: "很多人好奇，为什么抹茶的颜色可以那么鲜艳？这背后其实藏着一个很有趣的农业逻辑。在采摘前的三到四周，茶农会用遮光棚把茶树整个罩起来，让它见不到太阳。",
        p2: "这不是在折磨茶树，而是让茶树在黑暗中拼命生产叶绿素，同时积累大量的茶氨酸——也就是那股让你喝了之后觉得甘甜、脑袋突然清醒的成分。遮光越彻底，颜色越深，香气越浓，价格当然也越贵。",
        p3: "采摘之后的步骤就更讲究了。茶叶得立刻蒸青，把氧化的酵素统统杀掉，锁住那个颜色和香气，再烘干、去除叶脉和茎，剩下的那部分叫做「碾茶」，才终于能进石臼研磨。一台石臼一个小时只能磨出不到 50 克，你说慢不慢？",
      },
      chapter3: {
        eyebrow: "第三章",
        title: "那些陪着你的\n老朋友們",
        p1: "茶道里的道具不只是工具，每一件都像是有性格的老朋友。茶碗（Chawan）是里面最有看头的一个——它故意做得不对称，釉色也故意不均匀，因为那些「不完美」才是美的本体。据说老师傅在做茶碗的时候，从来不追求规整，追求的是一种偶然的灵气。",
        p2: "茶筅（Chasen）是用来打茶的竹制刷子，整个由一块竹子手工劈开制成，细细密密的竹齿让抹茶粉和热水在几秒内乳化成一层绵密的泡沫。一把好的茶筅可以用很久，坏掉了不是直接丢，而是在茶人聚会上举办「茶筅供养」，感谢它的服务，然后用火焚化送走。",
        p3: "茶杓（Chashaku）就更有意思了，一根薄薄的竹片，只是用来挖茶粉，但每一根都是由茶人或职人亲手削制，有些名师留下来的茶杓甚至是传家宝，一辈一辈地传下去。",
      },
      chapter4: {
        eyebrow: "第四章",
        title: "和、敬、清、寂，\n四个字说完一辈子",
        p1: "千利休用这四个字浓缩了整个茶道的精神。和，是你和环境、和对方、和自己的和解；敬，不是那种表演性质的礼貌，而是真心觉得眼前的每件事都值得尊重；清，不是干净，而是没有杂念；寂，是在安静里感受到的那种充实感，而不是空洞的孤独。",
        p2: "茶道里还有一個很让人着迷的概念叫「一期一会」。字面上是「一生只见这一次」，意思是，不管你跟这个人见过多少次面，每一次相遇都要当作是最后一次来对待。喝下去的那碗茶，这个时间点、这个光线、这个温度，永远不会再有第二次。",
        p3: "这个概念放到现代生活里其实很有共鸣。我们每天都在被通知轰炸、滑不完的动态，抹茶茶道提醒的就是一件事：放下手机，好好待在这一刻。",
      },
      chapter5: {
        eyebrow: "第五章",
        title: "打一碗抹茶，\n没你想的那么难",
        p1: "很多人以为茶道是遥远的事，搞很久学不来，或是要有很多昂贵的道具才能开始。其实不然。一开始你只需要一个茶碗、一把茶筅、一根茶杓，加上品质说得过去的抹茶粉，就可以在家里试试看了。",
        p2: "水温控制在 70 到 80 度之间，太烫会让抹茶变涩；先用少量的水把茶粉调成糊状，再慢慢加水；茶筅要以「M」或「W」的走向快速来回刷，而不是画圈。泡沫打得够细，入口的时候就会有一种丝滑的口感，然后是慢慢散开的甘甜。",
        p3: "第一次不会很完美，茶粉可能结块，泡沫可能打不均匀，但这本来就是个需要练习的事。茶道从来不追求第一次就做好，它追求的是你在反复练习里慢慢懂得的那些东西。",
      },
    },
    final: {
      eyebrow: "现在",
      title: "准备好了吗？",
      p1: "看完这些，你大概已经对抹茶有了完全不一样的感受。它不只是一个饮料的口味，更是一项传承百年的生活艺术。",
      p2: "接下来，我们为你准备了一个 3D 沉浸式滚动动画体验。当你向下滚动，画面会随着你的步调，一步步流畅地演绎冲泡抹茶的完整仪式——从落粉、过筛、注水，到茶筅击拂出细密泡沫。跟随你自己的节奏，亲眼见证一碗茶的诞生吧。",
      button: "进入 3D 场景",
    },
    loader: {
      preparing: "准备中",
    },
    overlay: {
      ritual: "仪式",
      finalRecipe: "配方",
      matcha: "抹茶",
      warmWater: "温水",
      waterTemp: "水温",
      back: "返回首页",
    },
    steps: {
      intro: {
        title: "一期一会",
        body: "放下繁杂，跟随节奏，见证一碗茶的诞生。",
      },
      powder: {
        eyebrow: "步骤 01",
        title: "落粉",
        body: "细致的翠绿粉末盛于筛网之中，悬于茶碗之上，静静等待开始。",
      },
      sift: {
        eyebrow: "步骤 02",
        title: "过筛",
        body: "在注水之前，让茶粉滤得更为细致，这是为了后续能打出绵密泡沫的讲究。",
      },
      water: {
        eyebrow: "步骤 03",
        title: "注水",
        body: "以 75 度的温水缓缓注入，唤醒茶香，而不烫伤茶粉。",
      },
      whisk: {
        eyebrow: "步骤 04",
        title: "击拂",
        body: "用茶筅以 W 字型快速来回刷动，直到表面浮现如丝绒般的细密泡沫。",
      },
      finish: {
        title: "属于你的时刻",
        body: "这就是属于你的抹茶仪式。放慢脚步，好好享受这一刻的宁静与甘甜。",
      },
    },
  },
  en: {
    nav: {
      home: "Home",
      scene3d: "3D Scene",
    },
    metadata: {
      title: "Matcha - Ichigo Ichie",
      description: "A bowl of matcha, a moment in time. Follow the rhythm of your breath and scrolls to experience a meditative matcha-making ritual in an immersive 3D interactive journey.",
    },
    header: {
      title: "Matcha",
    },
    hero: {
      eyebrow: "A Ritual of Focus",
      title: "Awaken\nYour Senses",
      description:
        "In an era that demands speed, matcha gently asks you to slow down. It cannot be rushed; speed would only spoil the taste. Scroll down, and let us slowly tell the story of this tea.",
      scroll: "Scroll down",
    },
    chapters: {
      chapter1: {
        eyebrow: "Chapter 01",
        title: "From China to Japan,\nA Tea's Journey",
        p1: "The story of matcha begins in the Tang Dynasty. Back then, people in China pressed tea leaves into cakes, ground them into powder, and whisked it with water—the prototype of the whisked tea method. When the Japanese monk Eisai returned from China in 1191, he brought this method along with tea seeds back home, planting them in Kyoto's outskirts.",
        p2: "During the Muromachi period, the tea ceremony began to take shape. Later, Sen no Rikyu did something extraordinary: he transformed drinking tea from a display of aristocratic wealth into a spiritual cultivation accessible to all. He believed the tea room has no rank; once you enter, you must sincerely let go of everything.",
        p3: 'This philosophy later came to be known as "Wabi-sabi"—finding profound beauty in imperfection and impermanence. An asymmetrical tea bowl, a weathered bamboo scoop; these "flaws" instead become the most soulful parts.',
      },
      chapter2: {
        eyebrow: "Chapter 02",
        title: "That Vivid Green,\nHow Does It Happen?",
        p1: "Many wonder why matcha is so vibrant. Behind it lies an intriguing agricultural technique: three to four weeks before harvesting, farmers cover the tea plants with shading screens, shielding them from the sun.",
        p2: "This isn't to torment the plants, but to force them to produce chlorophyll, while accumulating l-theanine—the compound responsible for the sweet, focusing effect. The more thorough the shading, the deeper the green, the richer the aroma, and naturally, the more premium the tea.",
        p3: 'The post-harvest steps are even more meticulous. Leaves are steamed immediately to stop oxidation, locking in color and aroma. They are dried, de-veined, and de-stemmed. What remains is called "Tencha", which is finally ground in a stone mill. A single stone mill yields less than 50 grams per hour. Quite slow, isn\'t it?',
      },
      chapter3: {
        eyebrow: "Chapter 03",
        title: "The Old Friends\nBy Your Side",
        p1: 'In the tea ceremony, tools are more than implements; each is like an old friend with a distinct character. The Chawan (tea bowl) is the most captivating—deliberately asymmetric with uneven glaze, because "imperfection" is the essence of beauty. Master craftsmen never seek perfection; they chase a momentary spark.',
        p2: 'The Chasen is a bamboo whisk used to whip the tea. Hand-carved from a single piece of bamboo, its fine tines emulsify matcha powder and hot water into a velvety foam in seconds. A good Chasen lasts long; when it wears out, it isn\'t discarded but given a "Chasen Koyo" memorial service, thanking it for its service before burning it in a fire.',
        p3: "The Chashaku is even more interesting—a simple, thin bamboo scoop. Though only used to portion powder, each is hand-carved by tea masters. Some legendary scoops are passed down as family heirlooms for generations.",
      },
      chapter4: {
        eyebrow: "Chapter 04",
        title: "Wa, Kei, Sei, Jaku,\nA Lifetime in Four Words",
        p1: "Sen no Rikyu condensed the spirit of tea into four concepts. Wa (Harmony) is reconciliation with environment, others, and self; Kei (Respect) is genuine honor for all things, not just polite performance; Sei (Purity) is clarity of mind, free of distractions; Jaku (Tranquility) is a deep sense of fulfillment in silence, rather than empty loneliness.",
        p2: 'A captivating concept in tea is "Ichigo Ichie"—literally "one time, one meeting". It means that no matter how often you meet someone, every encounter should be treated as the last. That bowl of tea, this exact moment, this light, this temperature, will never happen again.',
        p3: "This concept resonates deeply in modern life. As we are bombarded by notifications and infinite scrolling, the tea ceremony reminds us of one thing: put down the phone, and fully occupy this moment.",
      },
      chapter5: {
        eyebrow: "Chapter 05",
        title: "Whisking Matcha,\nNot as Hard as You Think",
        p1: "Many assume the tea ceremony is remote and complex, requiring years of study or expensive gear. That is not so. To start, you only need a Chawan, a Chasen, a Chashaku, and a decent grade of matcha powder to try it at home.",
        p2: 'Control the water between 70 to 80°C; boiling water makes it bitter. First, whisk a little water with the powder into a paste, then add more water. Whisk rapidly in a "W" or "M" pattern, not in circles. Once the foam is fine enough, it will feel silky on the tongue, followed by a slow, sweet finish.',
        p3: "The first try won't be perfect. The powder might clump, the foam might be uneven, but this is a practice. The tea ceremony never demands perfection on the first try; it values what you slowly gather through repeated practice.",
      },
    },
    final: {
      eyebrow: "Now",
      title: "Are You Ready?",
      p1: "Having read this, you likely have a completely new perspective on matcha. It is not just a flavor, but a century-old art of living.",
      p2: "Next, we have prepared a 3D immersive scroll-driven animation experience for you. As you scroll down, the scene will fluidly depict the complete matcha ritual at your own pace—from sifting and pouring to whisking. Follow your rhythm, and witness the birth of a bowl of tea.",
      button: "Enter 3D Scene",
    },
    loader: {
      preparing: "Preparing",
    },
    overlay: {
      ritual: "Ritual",
      finalRecipe: "Recipe",
      matcha: "Matcha",
      warmWater: "Warm Water",
      waterTemp: "Water Temp",
      back: "Back to Home",
    },
    steps: {
      intro: {
        title: "Ichigo Ichie",
        body: "Let go of distractions, follow the rhythm, and witness the birth of a bowl of tea.",
      },
      powder: {
        eyebrow: "Step 01",
        title: "Adding Powder",
        body: "Fine, green powder sits in the strainer, suspended over the tea bowl, quietly waiting to begin.",
      },
      sift: {
        eyebrow: "Step 02",
        title: "Sifting",
        body: "Before adding water, sift the tea powder finely. This ensures a rich, velvety foam later.",
      },
      water: {
        eyebrow: "Step 03",
        title: "Pouring Water",
        body: "Slowly pour warm water at 75°C to awaken the tea aroma without scalding the powder.",
      },
      whisk: {
        eyebrow: "Step 04",
        title: "Whisking",
        body: 'Whisk rapidly in a "W" shape using the Chasen until a velvet layer of fine foam appears on the surface.',
      },
      finish: {
        title: "Your Moment",
        body: "This is your matcha ritual. Slow down, and fully enjoy this moment of peace and sweetness.",
      },
    },
  },
  ja: {
    nav: {
      home: "ホーム",
      scene3d: "3Dシーン",
    },
    metadata: {
      title: "Matcha - 一期一会",
      description: "一碗の抹茶、一期一会。呼吸とスクロールのリズムに合わせ、没入感のある3Dインタラクションの中で、落粉、過篩、注水から点茶にいたる静心儀式をご体験ください。",
    },
    header: {
      title: "Matcha",
    },
    hero: {
      eyebrow: "精神を研ぎ澄ます儀式",
      title: "五感を\n呼び覚ます",
      description:
        "何事にもスピードが求められる現代において、抹茶はゆっくりと立ち止まることを教えてくれます。焦っては、その繊細な味わいは生まれません。スクロールして、この一杯のお茶の物語を紐解いてみましょう。",
      scroll: "スクロールする",
    },
    chapters: {
      chapter1: {
        eyebrow: "第1章",
        title: "中国から日本へ、\n一杯のお茶の旅",
        p1: "抹茶の起源は唐代の中国にあります。当時、茶葉を固めた「団茶」を粉末にし、お湯を注いでかき混ぜて飲む「点茶法」が誕生しました。1191年、日本の僧侶・栄西がこの飲み方と茶の種を持ち帰り、京都の郊外に植えたのが日本における茶の始まりです。",
        p2: "室町時代に入ると茶の湯の形が整い始め、千利休によって大きな変革がもたらされました。彼は茶の湯を貴族の富の象徴から、誰もが心を静める精神的な修行へと昇華させたのです。茶室の中では身分を問わず、真摯に己と向き合うことが求められました。",
        p3: "この思想は、後に「侘寂（わびさび）」として知られるようになります。不完全さや無常さの中に、深い美を見出すこと。歪んだ茶碗や、使い込まれた竹の茶杓といった「欠陥」こそが、最も魂の宿る場所となるのです。",
      },
      chapter2: {
        eyebrow: "第2章",
        title: "その鮮やかな緑は、\nどこから来るのか？",
        p1: "なぜ抹茶はこれほど鮮やかな緑色をしているのでしょうか？そこには、興味深い農法があります。収穫の3〜4週間前、茶園全体に覆いをかけ、日光を遮る「被覆栽培」が行われます。",
        p2: "これは茶樹をいじめているのではなく、暗闇の中で葉緑素を懸命に作り出させると同時に、テアニンという旨味成分を蓄えさせるためです。光を完全に遮ることで、より深い緑、豊かな香り、そして甘みが生まれます。",
        p3: "収穫後の工程も極めて繊細です。茶葉はすぐに蒸されて酸化を防ぎ、色と香りを閉じ込めます。その後、乾燥させて葉脈や茎を取り除き、「碾茶（てんちゃ）」と呼ばれる状態にしてから石臼で挽かれます。石臼で1時間に挽ける量はわずか50g未満です。",
      },
      chapter3: {
        eyebrow: "第3章",
        title: "道具という名の、\n古き友人たち",
        p1: "茶の湯における道具は、単なる道具ではなく、それぞれが独特の個性を持つ古い友人のような存在です。「茶碗」はその最たるもので、意図的に非対称に作られ、釉薬もあえて不均一に塗られます。その「不完全さ」こそが美の本質だからです。",
        p2: "「茶筅」は、1本の竹を細かく裂いて作られる道具で、抹茶とお湯を数秒で乳化させ、きめ細やかな泡を作ります。使い古された茶筅は、単に捨てるのではなく、「茶筅供養」を行って感謝を表し、お焚き上げをします。",
        p3: "「茶杓」は、抹茶をすくうための細い竹の匙です。シンプルな道具ですが、茶人や職人によって1本ずつ削り出され、名工が作ったものは家宝として代々受け継がれることもあります。",
      },
      chapter4: {
        eyebrow: "第4章",
        title: "和、敬、清、寂、\n一生を語る四つの文字",
        p1: "千利休は、茶道の精神をこの四文字に凝縮しました。「和」は調和、「敬」は他者や道具に対する心からの敬意、「清」は雑念のない清らかな心、「寂」は静寂の中で感じられる豊かな充足感を表します。",
        p2: "また、茶道には「一期一会」という魅力的な言葉があります。たとえ何度も顔を合わせる相手であっても、その出会いは一生に一度きりとして接するという意味です。その時に淹れたお茶、その瞬間の光、温度は、二度と戻らないものです。",
        p3: "この考え方は、通知やスクロールに追われる現代人にも深く響くものです。茶道は私たちに、スマートフォンを置いて「今、この瞬間」に留まることを教えてくれます。",
      },
      chapter5: {
        eyebrow: "第5章",
        title: "抹茶を点てることは、\n難しくありません",
        p1: "多くの人は茶道が遠く複雑なもので、高価な道具が必要だと考えがちです。しかし、そんなことはありません。まずは茶碗、茶筅、茶杓、そして良質な抹茶パウダーがあれば、自宅で始めることができます。",
        p2: "お湯の温度は70〜80℃に抑えましょう。熱すぎると渋みが出てしまいます。まず少量の水で抹茶をペースト状に練ってから、お湯を足します。茶筅を円ではなく「W」や「M」の字を描くように素早く振ることで、シルクのように滑らかな泡が立ちます。",
        p3: "最初はダマができたり泡立ちが不均一だったりするかもしれませんが、それも練習の過程です。茶道は最初から完璧であることを求めず、繰り返す中で得られる気づきを大切にしています。",
      },
    },
    final: {
      eyebrow: "現在",
      title: "準備はいいですか？",
      p1: "これらを通じて、抹茶に対する見方が変わったのではないでしょうか。それは単なる飲み物のフレーバーではなく、何百年も受け継がれてきた「暮らしの芸術」です。",
      p2: "続いて、3Dによる没入型のスクロールアニメーション体験をご用意しています。スクロールすると、落粉、過篩、注水、そして茶筅で泡立てるまでのプロセスが、あなたのペースに合わせて再現されます。一杯のお茶が生まれる瞬間を見届けましょう。",
      button: "3Dシーンに入る",
    },
    loader: {
      preparing: "準備中",
    },
    overlay: {
      ritual: "儀式",
      finalRecipe: "レシピ",
      matcha: "抹茶",
      warmWater: "お湯",
      waterTemp: "湯温",
      back: "ホームに戻る",
    },
    steps: {
      intro: {
        title: "一期一会",
        body: "雑念を払い、静かな時間の中で一杯のお茶が生まれる瞬間を見届けましょう。",
      },
      powder: {
        eyebrow: "手順 01",
        title: "落粉",
        body: "美しい緑の粉末が篩に盛られ、茶碗の上で静かにその時を待っています。",
      },
      sift: {
        eyebrow: "手順 02",
        title: "過篩",
        body: "お湯を注ぐ前に、抹茶をきめ細かく篩にかけます。これが滑らかな泡を作る秘訣です。",
      },
      water: {
        eyebrow: "手順 03",
        title: "注水",
        body: "75℃の温かいお湯をゆっくりと注ぎ、抹茶の香りを引き出します。",
      },
      whisk: {
        eyebrow: "手順 04",
        title: "撃拂",
        body: "茶筅を「W」の字を描くように素早く振り、表面にベルベットのような細かな泡を浮かべます。",
      },
      finish: {
        title: "あなただけの時間",
        body: "これがあなただけの抹茶の儀式です。歩みを緩め、この静けさと甘みを楽しんでください。",
      },
    },
  },
  ko: {
    nav: {
      home: "홈",
      scene3d: "3D 장면",
    },
    metadata: {
      title: "Matcha - 일기일회",
      description: "말차 한 잔, 일기일회. 호흡과 스크롤의 리듬에 맞춰 몰입형 3D 인터랙션을 통해 가루 넣기, 체 치기, 물 붓기에서 거품 내기까지 마음이 평온해지는 다도 의식을 체험해 보세요.",
    },
    header: {
      title: "Matcha",
    },
    hero: {
      eyebrow: "집중의 의식",
      title: "감각을\n깨우다",
      description:
        "모든 것이 빠르게 흘러가는 이 시대에 말차는 천천히 가라고 말합니다. 서두르면 고유의 맛을 잃게 됩니다. 아래로 스크롤하여 이 차에 담긴 이야기를 천천히 만나보세요.",
      scroll: "스크롤",
    },
    chapters: {
      chapter1: {
        eyebrow: "제 1장",
        title: "중국에서 일본으로,\n차의 여정",
        p1: "말차의 역사는 당나라에서 시작됩니다. 당시 중국인들은 찻잎을 쪄서 떡처럼 만든 뒤, 필요할 때 갈아서 따뜻한 물과 섞어 마셨습니다. 이것이 점차법의 시작입니다. 1191년 일본의 에이사이 승려가 이 마시는 방법과 차 씨앗을 가지고 돌아와 교토 외곽에 심으면서 일본 말차의 역사가 시작되었습니다.",
        p2: "무로마치 시대에 이르러 다도가 정립되기 시작했고, 센노 리큐에 의해 큰 변화를 맞이했습니다. 그는 귀족들의 부를 과시하던 찻자리를 누구나 참여할 수 있는 마음의 수양 공간으로 바꾸었습니다. 그는 다실에 들어설 때는 신분을 막론하고 진실된 마음으로 모든 것을 내려놓으라고 말했습니다.",
        p3: "이 정신은 훗날 불완전하고 덧없는 것에서 깊은 아름다움을 발견하는 '와비사비'로 널리 알려지게 됩니다. 비뚤어진 찻잔, 낡은 대나무 숟가락 등 불완전한 소품들이 오히려 가장 영혼이 깃든 대상이 되는 것입니다.",
      },
      chapter2: {
        eyebrow: "제 2장",
        title: "그 푸르른 빛깔은\n어디서 오는가?",
        p1: "말차의 색이 왜 이렇게 선명한지 궁금해하는 사람들이 많습니다. 여기에는 흥미로운 농법이 숨겨져 있습니다. 수확하기 3~4주 전, 재배 농가에서는 차나무 전체를 차광막으로 덮어 햇빛을 차단합니다.",
        p2: "이는 차나무를 괴롭히는 것이 아니라, 어둠 속에서 엽록소를 필사적으로 생산하게 하고 동시에 테아닌이라는 아미노산 성분을 축적하게 만드는 방법입니다. 차광이 철저할수록 빛깔이 짙어지고, 향이 풍부해지며, 떫은맛 대신 단맛이 강해져 고급 차가 됩니다.",
        p3: "수확 후 과정도 매우 까다롭습니다. 찻잎을 즉시 쪄서 산화를 멈추고 빛깔과 향을 가둡니다. 이후 건조시켜 잎맥과 줄기를 제거한 '텐차' 상태를 만든 뒤 맷돌로 곱게 갑니다. 맷돌 하나로 한 시간에 갈 수 있는 양은 50g 미만입니다.",
      },
      chapter3: {
        eyebrow: "제 3장",
        title: "늘 곁을 지켜주는\n오래된 친구들",
        p1: "다도에서 도구는 단순한 도구를 넘어 고유한 성격을 지닌 오래된 친구와 같습니다. 가장 눈길을 끄는 '찻잔'은 일부러 비대칭으로 만들고 유약도 불균일하게 바르는데, 이는 '불완전함'이 미의 본질이기 때문입니다. 장인들은 규격화된 정밀함을 추구하지 않고 우연한 영감을 쫓아 만듭니다.",
        p2: "찻솔은 말차를 젓는 대나무 솔로, 하나의 대나무를 정교하게 쪼개어 수작업으로 만듭니다. 미세한 솔잎들이 말차 가루와 온수를 몇 초 만에 부드러운 거품으로 유화시킵니다. 정성스레 사용한 찻솔이 닳으면 그냥 버리지 않고 다인들이 모여 감사를 표하는 '차센 고요' 의식을 치르고 불에 태워 보냅니다.",
        p3: "찻숟가락은 얇은 대나무 조각으로 말차 가루를 떠내는 심플한 도구이지만, 다도 거장이나 장인의 손길로 하나하나 깎아 만듭니다. 유명 다인이 남긴 찻숟가락은 가보로 전해지기도 합니다.",
      },
      chapter4: {
        eyebrow: "제 4장",
        title: "화, 경, 청, 적,\n한 평생을 담은 네 글자",
        p1: "센노 리큐는 다도의 정신을 이 네 글자로 압축했습니다. 화(和)는 나 자신과 상대방, 주변 환경과의 조화이며, 경(敬)은 단순한 예의가 아닌 마주하는 모든 대상을 향한 진심 어린 존중입니다. 청(清)은 잡념이 없는 깨끗한 마음을 뜻하며, 적(寂)은 고요함 속에서 느끼는 충만한 평온함입니다.",
        p2: "또한 다도에는 '일기일회'라는 매력적인 개념이 있습니다. '평생 단 한 번뿐인 만남'이라는 뜻으로, 아무리 자주 만나는 사람이라도 매 순간의 만남을 일생에 단 한 번뿐인 마지막 기회처럼 소중히 대하는 것입니다. 그 순간의 차 한 잔과 빛, 온도는 다시는 오지 않기 때문입니다.",
        p3: "이 생각은 알림과 끝없는 스크롤 속에서 살아가는 현대인에게 깊은 울림을 줍니다. 다도는 우리에게 스마트폰을 내려놓고 '지금 이 순간'에 온전히 머물 것을 상기시킵니다.",
      },
      chapter5: {
        eyebrow: "제 5장",
        title: "말차 우리기,\n생각보다 어렵지 않습니다",
        p1: "많은 이들이 다도는 멀고 복잡한 영역이며 고가의 도구가 필요하다고 생각합니다. 하지만 그렇지 않습니다. 찻잔, 찻솔, 찻숟가락, 그리고 품질 좋은 말차 가루만 있다면 집에서도 쉽게 시작할 수 있습니다.",
        p2: "물 온도는 70~80℃로 조절하세요. 끓는 물은 말차를 떫게 만듭니다. 먼저 소량의 물로 말차 가루를 개어 페이스트처럼 만든 뒤 남은 물을 붓습니다. 찻솔을 원형이 아닌 'W'나 'M' 자 모양으로 빠르게 왕복해주면 실크처럼 부드러운 거품과 은은한 단맛이 살아납니다.",
        p3: "처음에는 뭉치거나 거품이 고르지 않을 수 있지만, 이것도 연습의 한 과정입니다. 다도는 처음부터 완벽하게 만드는 것보다 반복하는 과정 속에서 천천히 깨달아가는 가치를 귀하게 여깁니다.",
      },
    },
    final: {
      eyebrow: "현재",
      title: "준비되셨나요?",
      p1: "이 글을 읽으신 후 말차에 대한 생각이 완전히 달라지셨을 것입니다. 말차는 단순한 음료의 맛을 넘어 백 년 넘게 이어져 온 '생활 예술'입니다.",
      p2: "이제 3D 몰입형 스크롤 애니메이션 체험을 시작합니다. 아래로 스크롤하면 여러분의 템포에 맞춰 말차 가루 떨어뜨리기, 체 치기, 물 붓기, 거품 내기까지의 전 과정이 유연하게 연출됩니다. 나만의 리듬에 따라 차 한 잔이 탄생하는 순간을 감상해보세요.",
      button: "3D 장면 시작",
    },
    loader: {
      preparing: "준비 중",
    },
    overlay: {
      ritual: "의식",
      finalRecipe: "레시피",
      matcha: "말차",
      warmWater: "따뜻한 물",
      waterTemp: "물 온도",
      back: "홈으로 돌아가기",
    },
    steps: {
      intro: {
        title: "일기일회",
        body: "잡념을 내려놓고, 리듬을 따라 한 잔의 차가 탄생하는 과정을 함께 해보세요.",
      },
      powder: {
        eyebrow: "1단계",
        title: "가루 넣기",
        body: "고운 녹색 가루가 체에 담겨 찻잔 위에 놓인 채, 고요히 시작을 기다립니다.",
      },
      sift: {
        eyebrow: "2단계",
        title: "체 치기",
        body: "물을 붓기 전에 체를 이용해 말차 가루를 곱게 걸러줍니다. 이는 부드러운 거품을 만드는 비결입니다.",
      },
      water: {
        eyebrow: "3단계",
        title: "물 붓기",
        body: "75℃의 따뜻한 물을 천천히 부어 가루가 타지 않게 주의하며 차의 향을 깨웁니다.",
      },
      whisk: {
        eyebrow: "4단계",
        title: "거품 내기",
        body: "찻솔로 'W' 모양을 그리며 빠르게 저어 표면에 벨벳 같은 고운 거품을 냅니다.",
      },
      finish: {
        title: "나만의 시간",
        body: "이것이 바로 당신만을 위한 말차 의식입니다. 걸음을 멈추고 고요함과 달콤함을 즐겨보세요.",
      },
    },
  },
  de: {
    nav: {
      home: "Startseite",
      scene3d: "3D-Szene",
    },
    metadata: {
      title: "Matcha - Ichigo Ichie",
      description:
        "Eine Schale Matcha, ein flüchtiger Moment. Folgen Sie dem Rhythmus Ihres Atems und des Scrollens, um ein meditatives Matcha-Ritual in einer immersiven interaktiven 3D-Reise zu erleben.",
    },
    header: {
      title: "Matcha",
    },
    hero: {
      eyebrow: "Ein Ritual der Konzentration",
      title: "Wecke\ndeine Sinne",
      description:
        "In einer Zeit, die Schnelligkeit verlangt, lädt Matcha zum Entschleunigen ein. Es darf nicht gehetzt werden; Eile würde nur den Geschmack verderben. Scrollen Sie nach unten, um die Geschichte dieses Tees zu erfahren.",
      scroll: "Nach unten scrollen",
    },
    chapters: {
      chapter1: {
        eyebrow: "Kapitel 01",
        title: "Von China nach Japan,\ndie Reise eines Tees",
        p1: "Die Geschichte von Matcha beginnt in der Tang-Dynastie. Damals presste man in China Teeblätter zu Fladen, mahlte sie zu Pulver und verrührte sie mit Wasser – der Vorläufer der heutigen Methode. Als der japanische Mönch Eisai 1191 aus China zurückkehrte, brachte er diese Methode und Teesamen mit nach Hause und pflanzte sie in der Nähe von Kyoto an.",
        p2: "In der Muromachi-Zeit nahm die Teezeremonie Form an. Später bewirkte Sen no Rikyu etwas Außergewöhnliches: Er machte das Teetrinken von einer Zurschaustellung aristokratischen Reichtums zu einer spirituellen Praxis, die allen zugänglich war. Er glaubte, dass es im Teeraum keine Ränge gibt; wer ihn betritt, muss alles andere hinter sich lassen.",
        p3: "Diese Philosophie wurde später als „Wabi-Sabi“ bekannt – die Schönheit im Unvollkommenen und Vergänglichen zu finden. Eine asymmetrische Teeschale, ein verwitterter Bambuslöffel: Diese „Makel“ sind die Orte, an denen die Seele wohnt.",
      },
      chapter2: {
        eyebrow: "Kapitel 02",
        title: "Dieses leuchtende Grün,\nwie entsteht es?",
        p1: "Viele wundern sich, warum Matcha so leuchtend grün ist. Dahinter steckt eine faszinierende landwirtschaftliche Methode: Drei bis vier Wochen vor der Ernte beschatten die Bauern die Teepflanzen mit Netzen, um sie vor der Sonne zu schützen.",
        p2: "Dies geschieht nicht, um die Pflanzen zu quälen, sondern um sie anzuregen, Chlorophyll zu bilden, während sie L-Theanin anreichern – die Verbindung, die für den süßen, beruhigenden Geschmack verantwortlich ist. Je gründlicher die Beschattung, desto tiefer das Grün und desto feiner das Aroma.",
        p3: "Die Schritte nach der Ernte sind noch präziser. Die Blätter werden sofort gedämpft, um die Oxidation zu stoppen. Nach dem Trocknen werden Stängel und Blattadern entfernt. Was übrig bleibt, heißt „Tencha“, das in Steinmühlen gemahlen wird. Eine Mühle schafft weniger als 50 Gramm pro Stunde. Sehr langsam, nicht wahr?",
      },
      chapter3: {
        eyebrow: "Kapitel 03",
        title: "Die alten Freunde\nan deiner Seite",
        p1: "Bei der Teezeremonie sind die Geräte mehr als Werkzeuge – sie sind wie alte Freunde mit Charakter. Die Chawan (Teeschale) ist das faszinierendste Stück: absichtlich asymmetrisch und unregelmäßig glasiert, denn „Unvollkommenheit“ ist die Essenz der Schönheit.",
        p2: "Der Chasen ist ein Bambusbesen, der aus einem einzigen Stück Bambus von Hand gespalten wird. Seine feinen Borsten emulgieren das Matchapulver und das heiße Wasser in Sekunden zu einem cremigen Schaum. Ein abgenutzter Chasen wird nicht einfach weggeworfen, sondern in einem Ritual namens „Chasen Koyo“ verbrannt, um ihm zu danken.",
        p3: "Der Chashaku ist ein schlichter, dünner Bambuslöffel. Obwohl er nur zum Portionieren des Pulvers dient, wird jeder von Teemeistern handgeschnitzt und oft über Generationen weitervererbt.",
      },
      chapter4: {
        eyebrow: "Kapitel 04",
        title: "Wa, Kei, Sei, Jaku,\nein Leben in vier Wörtern",
        p1: "Sen no Rikyu fasste den Geist des Tees in vier Prinzipien zusammen: Wa (Harmonie) steht für den Einklang mit der Welt; Kei (Respekt) ist die Achtung vor allen Dingen; Sei (Reinheit) ist die Klarheit des Geistes; Jaku (Stille) ist die tiefe Erfüllung in der Ruhe.",
        p2: "Ein zentrales Konzept ist „Ichigo Ichie“ – wörtlich „einmal, ein Treffen“. Es bedeutet, dass jede Begegnung so behandelt werden sollte, als wäre es die letzte. Diese Schale Tee, dieser genaue Moment, dieses Licht, diese Temperatur werden nie wiederkehren.",
        p3: "Dieses Konzept spricht auch den modernen Menschen an. Inmitten von Benachrichtigungen erinnert uns die Teezeremonie an eines: Leg das Telefon weg und sei ganz in diesem Moment.",
      },
      chapter5: {
        eyebrow: "Kapitel 05",
        title: "Matcha zubereiten,\nnicht so schwer, wie Sie denken",
        p1: "Viele glauben, die Teezeremonie sei kompliziert und erfordere teures Zubehör. Das ist nicht so. Für den Anfang brauchen Sie nur eine Chawan, einen Chasen, einen Chashaku und Matchapulver in guter Qualität.",
        p2: "Verwenden Sie Wasser mit 70 bis 80 °C; kochendes Wasser macht den Tee bitter. Verrühren Sie das Pulver zuerst mit etwas Wasser zu einer Paste, gießen Sie dann den Rest auf. Schlagen Sie den Tee mit dem Chasen in Zickzack-Bewegungen auf, bis ein feiner Schaum entsteht.",
        p3: "Der erste Versuch wird vielleicht nicht perfekt. Das Pulver klumpt eventuell oder der Schaum wird unregelmäßig, aber es ist eine Frage der Übung. Die Teezeremonie sucht nicht die Perfektion beim ersten Mal, sondern den Weg dorthin.",
      },
    },
    final: {
      eyebrow: "Jetzt",
      title: "Bereit?",
      p1: "Nun haben Sie eine neue Perspektive auf Matcha gewonnen. Es ist nicht nur ein Getränk, sondern eine jahrhundertealte Lebenskunst.",
      p2: "Als nächstes erwartet Sie ein interaktives 3D-Erlebnis. Wenn Sie nach unten scrollen, sehen Sie die Schritte der Zubereitung in Ihrem eigenen Tempo. Erleben Sie die Entstehung einer Schale Tee.",
      button: "3D-Szene starten",
    },
    loader: {
      preparing: "Wird geladen",
    },
    overlay: {
      ritual: "Ritual",
      finalRecipe: "Rezept",
      matcha: "Matcha",
      warmWater: "Wasser",
      waterTemp: "Temperatur",
      back: "Zur Startseite",
    },
    steps: {
      intro: {
        title: "Ichigo Ichie",
        body: "Lassen Sie den Alltag hinter sich und erleben Sie die Entstehung einer Schale Tee.",
      },
      powder: {
        eyebrow: "Schritt 01",
        title: "Pulver hinzugeben",
        body: "Feines, grünes Pulver liegt im Sieb über der Schale und wartet darauf, dass es beginnt.",
      },
      sift: {
        eyebrow: "Schritt 02",
        title: "Sieben",
        body: "Vor dem Aufgießen wird das Pulver gesiebt. Dies sorgt später für einen feinen, cremigen Schaum.",
      },
      water: {
        eyebrow: "Schritt 03",
        title: "Wasser eingießen",
        body: "Gießen Sie langsam warmes Wasser mit 75 °C ein, um das Aroma zu wecken, ohne das Pulver zu verbrennen.",
      },
      whisk: {
        eyebrow: "Schritt 04",
        title: "Aufschlagen",
        body: "Schlagen Sie den Tee mit dem Chasen in W-Form auf, bis sich ein samtiger Schaum bildet.",
      },
      finish: {
        title: "Ihr Moment",
        body: "Dies ist Ihr Matcha-Ritual. Finden Sie Ruhe und genießen Sie diesen Moment der Stille und Süße.",
      },
    },
  },
  es: {
    nav: {
      home: "Inicio",
      scene3d: "Escena 3D",
    },
    metadata: {
      title: "Matcha - Ichigo Ichie",
      description:
        "Un tazón de matcha, un momento en el tiempo. Sigue el ritmo de tu respiración y del desplazamiento para experimentar un ritual de té meditativo en un viaje interactivo en 3D.",
    },
    header: {
      title: "Matcha",
    },
    hero: {
      eyebrow: "Un ritual de concentración",
      title: "Despierta\ntus sentidos",
      description:
        "En una era que exige rapidez, el matcha nos pide ir más despacio. No se puede tener prisa; la prisa arruinaría el sabor. Desplácese hacia abajo y descubra la historia de este té.",
      scroll: "Desplazarse hacia abajo",
    },
    chapters: {
      chapter1: {
        eyebrow: "Capítulo 01",
        title: "De China a Japón,\nel viaje de un té",
        p1: "La historia del matcha comienza en la dinastía Tang. En aquel entonces, en China se prensaban las hojas de té en bloques, se molían en polvo y se mezclaban con agua, el prototipo del método actual. En 1191, el monje japonés Eisai regresó de China con este método y semillas de té, y las plantó cerca de Kioto.",
        p2: "Durante el período Muromachi, la ceremonia del té comenzó a tomar forma. Más tarde, Sen no Rikyu hizo algo extraordinario: transformó el acto de beber té de una exhibición de riqueza aristocrática a una práctica espiritual accesible para todos. Creía que en la sala de té no hay rangos y hay que dejar todo atrás.",
        p3: 'Esta filosofía se conoció como "Wabi-sabi": encontrar belleza en la imperfección y la impermanencia. Un tazón asimétrico o una cuchara de bambú desgastada son detalles donde reside el alma.',
      },
      chapter2: {
        eyebrow: "Capítulo 02",
        title: "Ese verde tan vivo,\n¿cómo se consigue?",
        p1: "Muchos se preguntan por qué el matcha es tan verde. Detrás hay una técnica agrícola interesante: tres o cuatro semanas antes de cosechar, los agricultores cubren las plantas con mallas para protegerlas del sol.",
        p2: "Esto no es para maltratar a las plantas, sino para obligarlas a producir clorofila, acumulando L-teanina, responsable de su sabor dulce y relajante. Cuanto más completa sea la sombra, más oscuro será el verde y más rico su aroma.",
        p3: 'Los pasos posteriores a la cosecha son aún más precisos. Las hojas se vaporizan inmediatamente para detener la oxidación. Tras secarse, se retiran las venas y tallos. Lo que queda se llama "Tencha", que se muele en molinos de piedra a razón de menos de 50 gramos por hora.',
      },
      chapter3: {
        eyebrow: "Capítulo 03",
        title: "Los viejos amigos\na tu lado",
        p1: "En la ceremonia del té, los utensilios son más que herramientas: son como viejos amigos con carácter. El Chawan (tazón) es el más fascinante: asimétrico y con un vidriado irregular, porque la imperfección es la esencia de la belleza.",
        p2: "El Chasen es un batidor de bambú tallado a mano de una sola pieza. Sus finas varillas emulsifican el polvo y el agua caliente en segundos para crear una espuma aterciopelada. Cuando se gasta, se le rinde agradecimiento en un ritual antes de quemarse.",
        p3: "El Chashaku es una cuchara delgada de bambú. Aunque solo sirve para dosificar el polvo, cada una es tallada a mano por maestros del té y se transmite de generación en generación.",
      },
      chapter4: {
        eyebrow: "Capítulo 04",
        title: "Wa, Kei, Sei, Jaku,\nuna vida en cuatro palabras",
        p1: "Sen no Rikyu condensó el espíritu del té en cuatro conceptos: Wa (Armonía) con el entorno; Kei (Respeto) hacia todas las cosas; Sei (Pureza) de la mente; y Jaku (Tranquilidad) en el silencio.",
        p2: 'Un concepto cautivador es "Ichigo Ichie": "un momento, un encuentro". Significa que cada encuentro debe tratarse como si fuera el último. Este tazón de té, este momento exacto, esta luz y esta temperatura no se repetirán jamás.',
        p3: "Esta idea resuena en la vida moderna. Entre tantas notificaciones, la ceremonia del té nos recuerda dejar el teléfono y estar presentes en el ahora.",
      },
      chapter5: {
        eyebrow: "Capítulo 05",
        title: "Preparar matcha,\nmás fácil de lo que crees",
        p1: "Muchos piensan que la ceremonia del té es compleja y requiere utensilios caros. No es así. Para empezar, solo necesitas un Chawan, un Chasen, un Chashaku y matcha en polvo de buena calidad.",
        p2: 'Controla el agua entre 70 y 80 °C; el agua hirviendo lo vuelve amargo. Primero mezcla un poco de agua con el polvo hasta formar una pasta y luego añade el resto. Bate rápido en forma de "W" o "M", no en círculos, hasta obtener una espuma fina.',
        p3: "La primera vez no será perfecta, pero es cuestión de práctica. La ceremonia del té no exige perfección al primer intento, sino valorar el aprendizaje en el camino.",
      },
    },
    final: {
      eyebrow: "Ahora",
      title: "¿Estás listo?",
      p1: "Tras leer esto, seguramente tienes una perspectiva diferente del matcha. No es solo una bebida, sino un arte de vivir centenario.",
      p2: "A continuación, te ofrecemos una experiencia interactiva en 3D. Al desplazarte hacia abajo, verás la preparación del té a tu propio ritmo.",
      button: "Entrar a la escena 3D",
    },
    loader: {
      preparing: "Preparando",
    },
    overlay: {
      ritual: "Ritual",
      finalRecipe: "Receta",
      matcha: "Matcha",
      warmWater: "Agua templada",
      waterTemp: "Temperatura",
      back: "Volver al inicio",
    },
    steps: {
      intro: {
        title: "Ichigo Ichie",
        body: "Deja a un lado las distracciones y contempla cómo nace un tazón de té.",
      },
      powder: {
        eyebrow: "Paso 01",
        title: "Añadir el polvo",
        body: "El polvo verde descansa en el colador sobre el tazón, esperando en silencio para comenzar.",
      },
      sift: {
        eyebrow: "Paso 02",
        title: "Tamizar",
        body: "Antes de verter el agua, tamiza el matcha para asegurar una espuma suave y sin grumos.",
      },
      water: {
        eyebrow: "Paso 03",
        title: "Verter el agua",
        body: "Vierte agua templada a 75 °C despacio para despertar el aroma sin quemar el polvo.",
      },
      whisk: {
        eyebrow: "Paso 04",
        title: "Batir",
        body: 'Bate rápido en forma de "W" con el Chasen hasta formar una capa aterciopelada de espuma fina.',
      },
      finish: {
        title: "Tu momento",
        body: "Este es tu ritual del matcha. Ve más despacio y disfruta de este momento de paz y dulzura.",
      },
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      scene3d: "Scène 3D",
    },
    metadata: {
      title: "Matcha - Ichigo Ichie",
      description: "Un bol de matcha, un instant suspendu. Suivez le rythme de votre respiration et du défilement pour vivre un rituel de thé méditatif dans un voyage interactif en 3D.",
    },
    header: {
      title: "Matcha",
    },
    hero: {
      eyebrow: "Un rituel de concentration",
      title: "Éveillez\nvos sens",
      description:
        "Dans un monde qui exige de la rapidité, le matcha nous invite à ralentir. Il ne peut être pressé, sous peine d'en gâcher la saveur. Faites défiler vers le bas pour découvrir son histoire.",
      scroll: "Faire défiler vers le bas",
    },
    chapters: {
      chapter1: {
        eyebrow: "Chapitre 01",
        title: "De la Chine au Japon,\nle voyage d'un thé",
        p1: "L'histoire du matcha commence sous la dynastie Tang. En Chine, les feuilles de thé étaient pressées en briques, moulues en poudre puis fouettées avec de l'eau. En 1191, le moine japonais Eisai rapporta cette méthode et des graines de thé chez lui pour les planter près de Kyoto.",
        p2: "Durant l'époque de Muromachi, la cérémonie du thé commença à se structurer. Plus tard, Sen no Rikyu fit quelque chose d'extraordinaire : il transforma le thé, d'un étalage de richesse aristocratique en une pratique spirituelle accessible à tous, où il n'y a aucun rang.",
        p3: "Cette philosophie prit le nom de \"Wabi-sabi\" : trouver la beauté dans l'imperfection et l'impermanence. Un bol asymétrique ou une cuillère en bambou usée sont des détails où réside l'âme.",
      },
      chapter2: {
        eyebrow: "Chapitre 02",
        title: "Ce vert si éclatant,\ncomment l'obtient-on ?",
        p1: "Beaucoup se demandent pourquoi le matcha est si vert. Derrière cela se cache une technique agricole intéressante : trois ou quatre semaines avant la récolte, les cultivateurs couvrent les théiers pour les protéger du soleil.",
        p2: "Ce n'est pas pour tourmenter les plantes, mais pour les forcer à produire de la chlorophylle, accumulant de la L-théanine, responsable de sa douceur. Plus l'ombre est complète, plus le vert est profond et l'arôme riche.",
        p3: "Les étapes post-récolte sont minutieuses. Les feuilles sont étuvées immédiatement pour stopper l'oxydation. Une fois séchées, on retire les nervures et les tiges. Ce qui reste s'appelle \"Tencha\", moulu dans des moulins en pierre à un rythme de moins de 50 grammes par heure.",
      },
      chapter3: {
        eyebrow: "Chapitre 03",
        title: "Les vieux compagnons\nà vos côtés",
        p1: "Dans la cérémonie du thé, les ustensiles sont plus que des outils : ce sont comme de vieux amis avec du caractère. Le Chawan (bol) est le plus fascinant : asymétrique et au glaçage irrégulier, car l'imperfection est l'essence de la beauté.",
        p2: "Le Chasen est un fouet en bambou sculpté à la main dans une seule pièce. Ses fines tiges émulsionnent la poudre et l'eau chaude en secondes pour créer une mousse veloutée. Quand il est usé, on le remercie lors d'un rituel avant de le brûler.",
        p3: "Le Chashaku est une cuillère fine en bambou. Bien qu'elle serve uniquement à doser la poudre, chacune est taillée à la main par des maîtres du thé et transmise de génération en génération.",
      },
      chapter4: {
        eyebrow: "Chapitre 04",
        title: "Wa, Kei, Sei, Jaku,\nune vie en quatre mots",
        p1: "Sen no Rikyu condensa l'esprit du thé en quatre concepts : Wa (Harmonie) avec l'environnement ; Kei (Respect) envers toutes choses ; Sei (Pureté) de l'esprit ; et Jaku (Tranquillité) dans le silence.",
        p2: 'Un concept captivant est "Ichigo Ichie" : "un moment, une rencontre". Il signifie que chaque rencontre doit être traitée comme si c\'était la dernière. Ce bol de thé, ce moment exact, cette lumière et cette température ne se reproduiront jamais.',
        p3: "Cette idée résonne dans nos vies modernes. Parmi tant de notifications, la cérémonie du thé nous rappelle de poser notre téléphone et de vivre l'instant présent.",
      },
      chapter5: {
        eyebrow: "Chapitre 05",
        title: "Préparer son matcha,\nplus simple qu'il n'y paraît",
        p1: "On pense souvent que la cérémonie du thé est complexe et requiert des ustensiles coûteux. C'est faux. Pour commencer, vous avez seulement besoin d'un Chawan, d'un Chasen, d'un Chashaku et de matcha en poudre de bonne qualité.",
        p2: "Contrôlez l'eau entre 70 et 80 °C ; l'eau bouillante le rendrait amer. Mélangez d'abord un peu d'eau avec le matcha pour former une pâte, puis ajoutez le reste. Fouettez rapidement en \"W\" ou \"M\", pas en cercles, jusqu'à obtenir une mousse fine.",
        p3: "La première fois ne sera pas parfaite, mais c'est une question de pratique. La cérémonie du thé n'exige pas la perfection dès le premier essai, mais valorise l'apprentissage tout au long du chemin.",
      },
    },
    final: {
      eyebrow: "Présent",
      title: "Êtes-vous prêt ?",
      p1: "Après avoir lu cela, vous avez sûrement une perspective différente du matcha. Ce n'est pas seulement une boisson, mais un art de vivre centenaire.",
      p2: "À présent, nous vous proposons une expérience interactive en 3D. En faisant défiler vers le bas, vous observerez les étapes de la préparation à votre propre rythme.",
      button: "Entrer dans la scène 3D",
    },
    loader: {
      preparing: "Préparation",
    },
    overlay: {
      ritual: "Rituel",
      finalRecipe: "Recette",
      matcha: "Matcha",
      warmWater: "Eau chaude",
      waterTemp: "Température",
      back: "Retour à l'accueil",
    },
    steps: {
      intro: {
        title: "Ichigo Ichie",
        body: "Laissez de côté les distractions et observez la naissance d'un bol de thé.",
      },
      powder: {
        eyebrow: "Étape 01",
        title: "Ajouter la poudre",
        body: "La fine poudre verte repose dans le tamis au-dessus du bol, attendant en silence de commencer.",
      },
      sift: {
        eyebrow: "Étape 02",
        title: "Tamiser",
        body: "Avant de verser l'eau, tamisez le matcha pour assurer une mousse lisse et sans grumeaux.",
      },
      water: {
        eyebrow: "Étape 03",
        title: "Verser l'eau",
        body: "Versez de l'eau chaude à 75 °C lentement pour éveiller l'arôme sans brûler la poudre.",
      },
      whisk: {
        eyebrow: "Étape 04",
        title: "Fouetter",
        body: "Fouettez rapidement en dessinant un \"W\" avec le Chasen jusqu'à ce qu'une fine mousse apparaisse.",
      },
      finish: {
        title: "Votre moment",
        body: "C'est votre rituel du matcha. Ralentissez et profitez de ce moment de paix et de douceur.",
      },
    },
  },
  it: {
    nav: {
      home: "Home",
      scene3d: "Scena 3D",
    },
    metadata: {
      title: "Matcha - Ichigo Ichie",
      description:
        "Una tazza di matcha, un momento nel tempo. Segui il ritmo del tuo respiro e dello scorrimento per vivere un meditativo rituale del tè in un viaggio interattivo 3D.",
    },
    header: {
      title: "Matcha",
    },
    hero: {
      eyebrow: "Un rituale di concentrazione",
      title: "Risveglia\ni tuoi sensi",
      description:
        "In un'epoca che esige rapidità, il matcha ci chiede di rallentare. Non si può avere fretta; la fretta rovinerebbe il sapore. Scorri verso il basso e scopri la storia di questo tè.",
      scroll: "Scorri verso il basso",
    },
    chapters: {
      chapter1: {
        eyebrow: "Capitolo 01",
        title: "Dalla Cina al Giappone,\nil viaggio di un tè",
        p1: "La storia del matcha inizia durante la dinastia Tang. A quel tempo, in Cina si pressavano le foglie di tè in panetti, si macinavano in polvere e si mescolavano con acqua. Nel 1191, il monaco giapponese Eisai portò questo metodo e i semi di tè con sé, piantandoli vicino a Kyoto.",
        p2: "Durante il periodo Muromachi, la cerimonia del tè iniziò a prendere forma. Più tardi, Sen no Rikyu fece qualcosa di straordinario: trasformò l'atto di bere il tè da esibizione di ricchezza aristocratica a pratica spirituale accessibile a tutti, senza distinzioni di rango.",
        p3: "Questa filosofia divenne nota come \"Wabi-sabi\": trovare la bellezza nell'imperfezione e nell'impermanenza. Una tazza asimmetrica o un cucchiaio di bambù consumato sono dettagli in cui risiede l'anima.",
      },
      chapter2: {
        eyebrow: "Capitolo 02",
        title: "Quel verde così vivo,\ncome si ottiene?",
        p1: "Molti si chiedono perché il matcha sia così verde. Dietro c'è un'interessante tecnica agricola: tre o quattro settimane prima del raccolto, i coltivatori coprono le piante con reti per proteggerle dal sole.",
        p2: "Questo non è per maltrattare le piante, ma per costringerle a produrre clorofilla, accumulando L-teanina, responsabile del gusto dolce e rilassante. Più l'ombra è completa, più il verde è profondo e l'aroma ricco.",
        p3: "I passaggi post-raccolto sono minuziosi. Le foglie vengono vaporizzate immediatamente per fermare l'ossidazione. Dopo l'asciugatura, si rimuovono venature e steli. Ciò che rimane è chiamato \"Tencha\", macinato in mulini a pietra a meno di 50 grammi all'ora.",
      },
      chapter3: {
        eyebrow: "Capitolo 03",
        title: "I vecchi amici\nal tuo fianco",
        p1: "Nella cerimonia del tè, gli utensili sono più che strumenti: sono come vecchi amici con carattere. Il Chawan (tazza) è il più affascinante: asimmetrico e con una smaltatura irregolare, perché l'imperfezione è l'essenza della bellezza.",
        p2: "Il Chasen è un frustino di bambù intagliato a mano da un unico pezzo. Le sue sottili lamelle emulsionano la polvere e l'acqua calda in pochi secondi creando una schiuma vellutata. Quando si consuma, viene ringraziato in un rituale prima di essere bruciato.",
        p3: "Il Chashaku è un cucchiaio sottile di bambù. Sebbene serva solo a dosare la polvere, ognuno è intagliato a mano da maestri del tè e si tramanda di generazione in generazione.",
      },
      chapter4: {
        eyebrow: "Capitolo 04",
        title: "Wa, Kei, Sei, Jaku,\nuna vita in quattro parole",
        p1: "Sen no Rikyu condensò lo spirito del tè in quattro concetti: Wa (Armonia) con l'ambiente; Kei (Rispetto) verso tutte le cose; Sei (Purezza) della mente; e Jaku (Tranquillità) nel silenzio.",
        p2: 'Un concetto affascinante è "Ichigo Ichie": "un momento, un incontro". Significa che ogni incontro deve essere vissuto come se fosse l\'ultimo. Questa tazza di tè, questo momento esatto, questa luce e questa temperatura non si ripeteranno mai.',
        p3: "Questa idea risuona nella vita moderna. Tra le tante notifiche, la cerimonia del tè ci ricorda di posare il telefono e di essere presenti nel qui e ora.",
      },
      chapter5: {
        eyebrow: "Capitolo 05",
        title: "Preparare il matcha,\npiù facile di quanto pensi",
        p1: "Molti pensano che la cerimonia del tè sia complessa e richieda accessori costosi. Non è così. Per iniziare, hai solo bisogno di un Chawan, un Chasen, un Chashaku e polvere di matcha di buona qualità.",
        p2: "Controlla l'acqua tra 70 e 80 °C; l'acqua bollente lo rende amaro. Mescola prima un po' d'acqua con la polvere per formare una pasta, poi aggiungi il resto. Sbatti rapidamente a forma di \"W\" o \"M\", non in cerchio, fino a ottenere una schiuma fine.",
        p3: "La prima volta non sarà perfetta, ma è questione di pratica. La cerimonia del tè non esige la perfezione al primo tentativo, ma valorizza l'apprendimento nel cammino.",
      },
    },
    final: {
      eyebrow: "Ora",
      title: "Sei pronto?",
      p1: "Dopo aver letto questo, avrai sicuramente una prospettiva diversa del matcha. Non è solo una bevanda, ma un'arte di vivere centenaria.",
      p2: "Di seguito, ti proponiamo un'esperienza interattiva in 3D. Scorrendo verso il basso, vedrai la preparazione del tè al tuo ritmo.",
      button: "Entra nella scena 3D",
    },
    loader: {
      preparing: "Preparazione",
    },
    overlay: {
      ritual: "Rituale",
      finalRecipe: "Ricetta",
      matcha: "Matcha",
      warmWater: "Acqua calda",
      waterTemp: "Temperatura",
      back: "Torna all'inizio",
    },
    steps: {
      intro: {
        title: "Ichigo Ichie",
        body: "Lascia da parte le distrazioni e osserva la nascita di una tazza di tè.",
      },
      powder: {
        eyebrow: "Passo 01",
        title: "Aggiungere la polvere",
        body: "La fine polvere verde riposa nel setaccio sopra la tazza, aspettando in silenzio di iniziare.",
      },
      sift: {
        eyebrow: "Passo 02",
        title: "Setacciare",
        body: "Prima di versare l'acqua, setaccia il matcha per assicurare una schiuma liscia e senza grumi.",
      },
      water: {
        eyebrow: "Passo 03",
        title: "Versare l'acqua",
        body: "Versa acqua calda a 75 °C lentamente per risvegliare l'aroma senza bruciare la polvere.",
      },
      whisk: {
        eyebrow: "Passo 04",
        title: "Sbattere",
        body: 'Sbatti rapidamente disegnando una "W" con il Chasen finché non compare una schiuma fine.',
      },
      finish: {
        title: "Il tuo momento",
        body: "Questo è il tuo rituale del matcha. Rallenta e goditi questo momento di pace e dolcezza.",
      },
    },
  },
  "pt-br": {
    nav: {
      home: "Início",
      scene3d: "Cena 3D",
    },
    metadata: {
      title: "Matcha - Ichigo Ichie",
      description:
        "Uma tigela de matcha, um momento no tempo. Siga o ritmo da sua respiração e da rolagem para vivenciar um ritual de chá meditativo em uma jornada interativa 3D.",
    },
    header: {
      title: "Matcha",
    },
    hero: {
      eyebrow: "Um ritual de concentração",
      title: "Desperte\nseus sentidos",
      description:
        "Em uma era que exige rapidez, o matcha nos pede para ir mais devagar. Não se pode ter pressa; a pressa arruinaria o sabor. Role para baixo e descubra a história deste chá.",
      scroll: "Rolar para baixo",
    },
    chapters: {
      chapter1: {
        eyebrow: "Capítulo 01",
        title: "Da China ao Japão,\na viagem de um chá",
        p1: "A história do matcha começa na dinastia Tang. Naquela época, na China, prensavam-se as folhas de chá em blocos, moendo-as em pó e misturando com água. Em 1191, o monge japonês Eisai voltou da China com este método e sementes de chá, plantando-as perto de Kyoto.",
        p2: "Durante o período Muromachi, a cerimônia do chá começou a tomar forma. Mais tarde, Sen no Rikyu fez algo extraordinário: transformou o ato de beber chá de uma exibição de riqueza aristocrática a uma prática espiritual acessível a todos, sem distinção de classe.",
        p3: 'Essa filosofia ficou conhecida como "Wabi-sabi": encontrar beleza na imperfeição e impermanência. Uma tigela assimétrica ou uma colher de bambu gasta são detalhes onde reside a alma.',
      },
      chapter2: {
        eyebrow: "Capítulo 02",
        title: "Aquele verde tão vivo,\ncomo ele surge?",
        p1: "Muitos se perguntam por que o matcha é tão verde. Por trás disso há uma técnica agrícola interessante: três ou quatro semanas antes de colher, os agricultores cobrem as plantas com telas para protegê-las do sol.",
        p2: "Isso não é para maltratar as plantas, mas para forçá-las a produzir clorofila, acumulando L-teanina, responsável pelo sabor doce e relaxante. Quanto mais completa a sombra, mais escuro o verde e mais rico seu aroma.",
        p3: 'Os passos pós-colheita são minuciosos. As folhas são vaporizadas imediatamente para parar a oxidação. Após secarem, retiram-se as nervuras e caules. O que resta é chamado "Tencha", moído em moinhos de pedra a menos de 50 gramas por hora.',
      },
      chapter3: {
        eyebrow: "Capítulo 03",
        title: "Os velhos amigos\nao seu lado",
        p1: "Na cerimônia do chá, os utensílios são mais que ferramentas: são como velhos amigos com caráter. O Chawan (tigela) é o mais fascinante: assimétrico e com vidrado irregular, porque a imperfeição é a essência da beleza.",
        p2: "O Chasen é um batedor de bambu esculpido à mão de uma única peça. Suas finas cerdas emulsionam o pó e a água quente em segundos para criar uma espuma aveludada. Quando se desgasta, agradece-se em um ritual antes de queimar.",
        p3: "O Chashaku é uma colher fina de bambu. Embora sirva apenas para dosar o pó, cada uma é esculpida à mão por mestres do chá e transmitida de geração em geração.",
      },
      chapter4: {
        eyebrow: "Capítulo 04",
        title: "Wa, Kei, Sei, Jaku,\numa vida em quatro palavras",
        p1: "Sen no Rikyu condensou o espírito do chá em quatro conceitos: Wa (Harmonia) com o ambiente; Kei (Respeito) por todas as coisas; Sei (Pureza) da mente; e Jaku (Tranquilidade) no silêncio.",
        p2: 'Um conceito cativante é "Ichigo Ichie": "um momento, um encontro". Significa que cada encontro deve ser tratado como se fosse o último. Esta tigela de chá, este momento exato, esta luz e esta temperatura não se repetirão jamais.',
        p3: "Esta ideia ressoa na vida moderna. Entre tantas notificações, a cerimônia do chá nos lembra de deixar o celular e estar presentes no aqui e agora.",
      },
      chapter5: {
        eyebrow: "Capítulo 05",
        title: "Preparar matcha,\nmais fácil do que você pensa",
        p1: "Muitos pensam que a cerimônia do chá é complexa e requer utensílios caros. Não é bem assim. Para começar, você só precisa de um Chawan, um Chasen, um Chashaku e matcha em pó de boa qualidade.",
        p2: 'Controle a água entre 70 e 80 °C; água fervendo o deixa amargo. Primeiro misture um pouco de água com o pó até formar uma pasta e depois adicione o resto. Bata rápido em formato de "W" ou "M", não em círculos, até obter uma espuma fina.',
        p3: "A primeira vez não será perfeita, mas é questão de prática. A cerimônia do chá não exige perfeição na primeira tentativa, mas valoriza o aprendizado no caminho.",
      },
    },
    final: {
      eyebrow: "Agora",
      title: "Pronto?",
      p1: "Após ler isso, com certeza você tem uma perspectiva diferente do matcha. Não é apenas uma bebida, mas uma arte de viver centenária.",
      p2: "A seguir, propomos uma experiência interativa em 3D. Ao rolar para baixo, você verá a preparação do chá no seu ritmo.",
      button: "Entrar na cena 3D",
    },
    loader: {
      preparing: "Preparando",
    },
    overlay: {
      ritual: "Ritual",
      finalRecipe: "Receita",
      matcha: "Matcha",
      warmWater: "Água morna",
      waterTemp: "Temperatura",
      back: "Voltar ao início",
    },
    steps: {
      intro: {
        title: "Ichigo Ichie",
        body: "Deixe de lado as distrações e observe o nascimento de uma tigela de chá.",
      },
      powder: {
        eyebrow: "Passo 01",
        title: "Adicionar o pó",
        body: "O pó verde descansa na peneira sobre a tigela, esperando em silêncio para começar.",
      },
      sift: {
        eyebrow: "Passo 02",
        title: "Peneirar",
        body: "Antes de colocar a água, peneire o matcha para garantir uma espuma suave e sem grumos.",
      },
      water: {
        eyebrow: "Passo 03",
        title: "Colocar a água",
        body: "Coloque água morna a 75 °C devagar para despertar o aroma sem queimar o pó.",
      },
      whisk: {
        eyebrow: "Passo 04",
        title: "Bater",
        body: 'Bata rápido desenhando um "W" com o Chasen até formar uma camada aveludada de espuma fina.',
      },
      finish: {
        title: "Seu momento",
        body: "Este é o seu ritual do matcha. Vá mais devagar e aproveite este momento de paz e doçura.",
      },
    },
  },
  ru: {
    nav: {
      home: "Главная",
      scene3d: "3D-сцена",
    },
    metadata: {
      title: "Matcha - Ichigo Ichie",
      description:
        "Чаша матча, мгновение во времени. Следуйте за ритмом своего дыхания и прокрутки, чтобы пройти медитативный ритуал приготовления чая в интерактивном 3D-путешествии.",
    },
    header: {
      title: "Matcha",
    },
    hero: {
      eyebrow: "Ритуал концентрации",
      title: "Пробудите\nсвои чувства",
      description:
        "В эпоху, когда все спешат, матча просит нас замедлиться. Спешка испортит вкус. Прокрутите вниз, чтобы узнать историю этого чая.",
      scroll: "Прокрутить вниз",
    },
    chapters: {
      chapter1: {
        eyebrow: "Глава 01",
        title: "Из Китая в Японию,\nпутешествие чая",
        p1: "История матча начинается в династии Тан. Тогда в Китае листья чая прессовали в плитки, перетирали в порошок и смешивали с водой. В 1191 году японский монах Эйсай привез этот метод и семена чая на родину, посадив их близ Киото.",
        p2: "В период Муромати церемония начала обретать форму. Позже Сэн но Рикю совершил революцию: он превратил чаепитие из демонстрации аристократического богатства в духовную практику, где все равны.",
        p3: "Эта философия стала известна как «Ваби-саби» — поиск красоты в несовершенстве и мимолетности. Асимметричная чаша или простая бамбуковая ложка — детали, в которых живет душа.",
      },
      chapter2: {
        eyebrow: "Глава 02",
        title: "Этот яркий зеленый,\nкак он получается?",
        p1: "Многие удивляются яркости матча. Секрет кроется в земледелии: за три-четыре недели до сбора чайные кусты накрывают навесами, защищая от солнца.",
        p2: "Это заставляет растения вырабатывать хлорофилл и накапливать L-теанин, который дает сладковатый и успокаивающий вкус. Чем гуще тень, тем насыщеннее цвет и аромат.",
        p3: "Последующие шаги еще деликатнее. Листья пропаривают, чтобы остановить окисление. После сушки удаляют прожилки и стебли. То, что осталось, называют «Тэнча», которую перетирают на каменных жерновах со скоростью менее 50 граммов в час.",
      },
      chapter3: {
        eyebrow: "Глава 03",
        title: "Старые друзья\nрядом с вами",
        p1: "В чайной церемонии утварь — больше чем инструменты; это старые друзья со своим характером. Тяван (чаша) — самый завораживающий предмет: асимметричный, с неровной глазурью, ведь несовершенство — суть красоты.",
        p2: "Тясэн — это венчик из цельного куска бамбука. Его тонкие зубья взбивают порошок и воду в нежную пену за секунды. Изношенный тясэн благодарят в ритуале перед сожжением.",
        p3: "Тясяку — простая бамбуковая ложечка для порошка. Каждую ложечку мастера вырезают вручную, и они передаются из поколения в поколение.",
      },
      chapter4: {
        eyebrow: "Глава 04",
        title: "Ва, Кэй, Сэй, Дзяку,\nжизнь в четырех словах",
        p1: "Сэн но Рикю выразил дух чая в четырех понятиях: Ва (Гармония) с миром; Кэй (Уважение) ко всему; Сэй (Чистота) помыслов; и Дзяку (Покой) в тишине.",
        p2: "Увлекательно понятие «Итиго итиэ» — буквально «один раз, одна встреча». Любая встреча уникальна, к ней нужно относиться как к последней. Эта чаша чая, этот момент, свет и температура никогда не повторятся.",
        p3: "Эта идея актуальна и сегодня. В мире бесконечных уведомлений чайная церемония напоминает: отложите телефон и побудьте в моменте.",
      },
      chapter5: {
        eyebrow: "Глава 05",
        title: "Приготовить матча\nпроще, чем кажется",
        p1: "Многие думают, что церемония сложна и требует дорогой утвари. Это не так. Для начала нужны лишь тяван, тясэн, тясяку и качественный порошок матча.",
        p2: "Используйте воду температуры 70–80 °C; кипяток сделает чай горьким. Сначала разотрите порошок с каплей воды в пасту, затем добавьте остальную воду. Взбивайте венчиком зигзагообразными движениями в форме «W» или «M».",
        p3: "Первый раз не будет идеальным, но это практика. Церемония ценит не мгновенный результат, а путь и внимание к деталям.",
      },
    },
    final: {
      eyebrow: "Сейчас",
      title: "Вы готовы?",
      p1: "Теперь у вас наверняка иной взгляд на матча. Это не просто напиток, а вековое искусство жить.",
      p2: "Далее вас ждет интерактивный 3D-опыт. При прокрутке вниз шаги приготовления будут визуализироваться в вашем темпе.",
      button: "Войти в 3D-сцену",
    },
    loader: {
      preparing: "Загрузка",
    },
    overlay: {
      ritual: "Ритуал",
      finalRecipe: "Рецепт",
      matcha: "Матча",
      warmWater: "Вода",
      waterTemp: "Температура",
      back: "На главную",
    },
    steps: {
      intro: {
        title: "Итиго итиэ",
        body: "Оставьте заботы и понаблюдайте за рождением чаши чая.",
      },
      powder: {
        eyebrow: "Шаг 01",
        title: "Добавление порошка",
        body: "Зеленый порошок лежит в ситечке над чашей, безмолвно ожидая начала ритуала.",
      },
      sift: {
        eyebrow: "Шаг 02",
        title: "Просеивание",
        body: "Перед добавлением воды просейте матча. Это обеспечит нежную пену без комочков.",
      },
      water: {
        eyebrow: "Шаг 03",
        title: "Добавление воды",
        body: "Медленно влейте воду температуры 75 °C, чтобы раскрыть аромат, не обжигая порошок.",
      },
      whisk: {
        eyebrow: "Шаг 04",
        title: "Взбивание",
        body: "Быстро взбивайте венчиком движениями в форме «W», пока не появится бархатистая пена.",
      },
      finish: {
        title: "Ваш момент",
        body: "Это ваш ритуал матча. Замедлите шаг и насладитесь этим моментом покоя и сладости.",
      },
    },
  },
  tr: {
    nav: {
      home: "Ana Sayfa",
      scene3d: "3D Sahne",
    },
    metadata: {
      title: "Matcha - Ichigo Ichie",
      description: "Bir kase matcha, zaman içinde bir an. Sürükleyici bir 3D etkileşimli yolculukta meditatif bir çay hazırlama ritüelini deneyimlemek için nefesinizin ve kaydırmanın ritmini takip edin.",
    },
    header: {
      title: "Matcha",
    },
    hero: {
      eyebrow: "Bir Odaklanma Ritüeli",
      title: "Duyularını\nUyandır",
      description:
        "Hız talep eden bu çağda, matcha sizden yavaşlamanızı ister. Aceleye gelmez; acele etmek tadını bozar. Aşağı kaydırın ve bu çayın hikayesini öğrenin.",
      scroll: "Aşağı kaydır",
    },
    chapters: {
      chapter1: {
        eyebrow: "Bölüm 01",
        title: "Çin'den Japonya'ya,\nBir Çayın Yolculuğu",
        p1: "Matcha'nın hikayesi Tang Hanedanlığı'nda başlar. O zamanlar Çin'de çay yaprakları kalıplar halinde preslenir, toz haline getirilir ve suyla karıştırılırdı. 1191'de Japon rahip Eisai bu yöntemi ve çay tohumlarını Kyoto yakınlarında ekmek üzere ülkesine getirdi.",
        p2: "Muromachi döneminde çay töreni şekillenmeye başladı. Daha sonra Sen no Rikyu çay içmeyi soylu bir zenginlik gösterisinden herkesin erişebileceği manevi bir uygulamaya dönüştürdü.",
        p3: 'Bu felsefe daha sonra kusurluluk ve geçicilikte derin bir güzellik bulma anlamına gelen "Wabi-sabi" olarak anıldı. Asimetrik bir çay kasesi veya yıpranmış bir bambu kaşık ruhun hayat bulduğu detaylardır.',
      },
      chapter2: {
        eyebrow: "Bölüm 02",
        title: "O Canlı Yeşil,\nNasıl Ortaya Çıkar?",
        p1: "Birçok kişi matcha'nın neden bu kadar canlı yeşil olduğunu merak eder. Arkasında ilginç bir tarım tekniği yatar: Hasattan üç-dört hafta önce çay bitkileri güneşten korunmak için gölgeliklerle örtülür.",
        p2: "Bu bitkilere eziyet etmek için değil, onları klorofil üretmeye zorlarken tatlı ve sakinleştirici tattan sorumlu olan L-theanine maddesini biriktirmelerini sağlamak içindir. Gölgeleme ne kadar iyi olursa, yeşil o kadar derin ve aroma o kadar zengin olur.",
        p3: 'Hasat sonrası adımlar daha da hassastır. Oksidasyonu durdurmak için yapraklar hemen buharlanır. Kuruduktan sonra damarlar ve saplar ayıklanır. Kalan kısım "Tencha" olarak adlandırılır ve taş değirmenlerde saatte 50 gramdan az olacak şekilde öğütülür.',
      },
      chapter3: {
        eyebrow: "Bölüm 03",
        title: "Yanınızdaki\nEski Dostlar",
        p1: "Çay töreninde malzemeler sadece birer araç değildir; her biri karakter sahibi eski birer dost gibidir. Chawan (çay kasesi) en büyüleyici olanıdır: asimetrik ve düzensiz cilalıdır, çünkü kusurluluk güzelliğin özüdür.",
        p2: "Chasen, tek bir parça bambudan elle oyulmuş bir çırpıcıdır. İnce dişleri matcha tozu ve sıcak suyu saniyeler içinde kadifemsi bir köpüğe dönüştürür. Eskidiğinde çöpe atılmaz, yakılmadan önce bir ritüelle teşekkür edilir.",
        p3: "Chashaku, basit, ince bir bambu kaşıktır. Sadece tozu ölçmek için kullanılsa da her biri çay ustaları tarafından elle yontulur ve nesiller boyu aktarılır.",
      },
      chapter4: {
        eyebrow: "Bölüm 04",
        title: "Wa, Kei, Sei, Jaku,\nDört Kelimede Bir Ömür",
        p1: "Sen no Rikyu çayın ruhunu dört kavramda özetlemiştir: Wa (Uyum) çevreyle; Kei (Saygı) her şeye karşı; Sei (Saflık) zihinde; ve Jaku (Huzur) sessizlikte.",
        p2: 'Çayda büyüleyici bir kavram "Ichigo Ichie"dir; kelime anlamıyla "bir kez, bir karşılaşma". Her karşılaşmanın son karşılaşmaymış gibi değerlendirilmesi gerektiği anlamına gelir. O çay kasesi, o an, ışık ve sıcaklık asla tekrarlanmayacaktır.',
        p3: "Bu fikir modern yaşamda da yankı buluyor. Sonsuz bildirimler arasında çay töreni bize şunu hatırlatır: Telefonu bırakın ve o anda kalın.",
      },
      chapter5: {
        eyebrow: "Bölüm 05",
        title: "Matcha Hazırlamak,\nSandığınızdan Daha Kolay",
        p1: "Pek çok kişi çay töreninin karmaşık olduğunu ve pahalı ekipman gerektirdiğini düşünür. Öyle değil. Başlamak için sadece bir Chawan, bir Chasen, bir Chashaku ve kaliteli matcha tozuna ihtiyacınız var.",
        p2: 'Suyu 70 ila 80 °C arasında tutun; kaynar su çayı acılaştırır. Önce tozu az suyla macun haline getirin, ardından kalan suyu ekleyin. Chasen ile daireler yerine "W" veya "M" çizerek hızlıca çırpın.',
        p3: "İlk deneme mükemmel olmayabilir ama bu bir pratiktir. Çay töreni ilk seferde mükemmelliği değil, süreçteki farkındalığı önemser.",
      },
    },
    final: {
      eyebrow: "Şimdi",
      title: "Hazır mısınız?",
      p1: "Bunları okuduktan sonra matcha'ya bakışınız değişmiş olmalı. O sadece bir içecek değil, asırlık bir yaşam sanatıdır.",
      p2: "Sırada etkileşimli bir 3D deneyimi var. Aşağı kaydırdıkça hazırlama adımları kendi hızınızda görselleşecek.",
      button: "3D Sahneye Gir",
    },
    loader: {
      preparing: "Hazırlanıyor",
    },
    overlay: {
      ritual: "Ritüel",
      finalRecipe: "Tarif",
      matcha: "Matcha",
      warmWater: "Ilık Su",
      waterTemp: "Su Sıcaklığı",
      back: "Ana Sayfaya Dön",
    },
    steps: {
      intro: {
        title: "Ichigo Ichie",
        body: "Zihninizi boşaltın ve bir kase çayın doğuşunu izleyin.",
      },
      powder: {
        eyebrow: "Adım 01",
        title: "Toz Ekleme",
        body: "Yeşil toz, kasenin üzerindeki süzgeçte sessizce başlamayı bekliyor.",
      },
      sift: {
        eyebrow: "Adım 02",
        title: "Eleme",
        body: "Su eklemeden önce matcha'yı eleyin. Bu, pürüzsüz ve köpüklü bir kıvam sağlar.",
      },
      water: {
        eyebrow: "Adım 03",
        title: "Su Dökme",
        body: "Çay aromasını yakmadan uyandırmak için 75 °C sıcaklıktaki ılık suyu yavaşça dökün.",
      },
      whisk: {
        eyebrow: "Adım 04",
        title: "Çırpma",
        body: 'Yüzeyde kadifemsi ince bir köpük oluşana kadar Chasen ile hızlıca "W" şeklinde çırpın.',
      },
      finish: {
        title: "Sizin Anınız",
        body: "Bu sizin matcha ritüeliniz. Yavaşlayın ve bu sessizlik ve tatlılık anının tadını çıkarın.",
      },
    },
  },
  vi: {
    nav: {
      home: "Trang chủ",
      scene3d: "Không gian 3D",
    },
    metadata: {
      title: "Matcha - Nhất Kỳ Nhất Hội",
      description: "Một chén matcha, một khoảnh khắc ngưng đọng. Hãy làm theo nhịp thở và cuộn màn hình để trải nghiệm nghi thức trà tịnh tâm trong hành trình tương tác 3D sống động.",
    },
    header: {
      title: "Matcha",
    },
    hero: {
      eyebrow: "Nghi Thức Của Sự Tập Trung",
      title: "Đánh thức\ngiác quan",
      description:
        "Trong thời đại vội vã này, matcha nhẹ nhàng nhắc ta chậm lại. Không thể gấp gáp; vội vàng sẽ làm hỏng hương vị. Cuộn xuống để lắng nghe câu chuyện về chén trà này.",
      scroll: "Cuộn xuống",
    },
    chapters: {
      chapter1: {
        eyebrow: "Chương 01",
        title: "Từ Trung Hoa đến Nhật Bản,\nHành trình của trà",
        p1: "Câu chuyện về matcha bắt đầu từ thời nhà Đường. Khi đó ở Trung Quốc, lá trà được ép thành bánh, nghiền thành bột và khuấy với nước ấm. Năm 1191, thiền sư Eisai mang cách uống này cùng hạt giống trà về lại Nhật Bản, gieo trồng ở ngoại ô Kyoto.",
        p2: "Vào thời Muromachi, trà đạo bắt đầu định hình. Sau này, Sen no Rikyu đã biến việc thưởng trà từ thú vui xa hoa của quý tộc thành một liệu pháp tu dưỡng tinh thần cho mọi người, không phân biệt đẳng cấp.",
        p3: 'Triết lý này được gọi là "Wabi-sabi" – tìm kiếm vẻ đẹp trong sự bất toàn và vô thường. Một chén trà méo mó hay chiếc thìa tre cũ kỹ chính là nơi lưu giữ tâm hồn.',
      },
      chapter2: {
        eyebrow: "Chương 02",
        title: "Sắc xanh tươi mát ấy,\nTừ đâu mà có?",
        p1: "Nhiều người tự hỏi tại sao matcha lại có màu xanh tươi đến thế. Đằng sau đó là kỹ thuật canh tác thú vị: ba đến bốn tuần trước khi thu hoạch, nông dân phủ lưới che bóng mát cho cây trà khỏi ánh mặt trời.",
        p2: "Điều này giúp kích thích cây trà sản sinh chất diệp lục, tích tụ nhiều L-theanine tạo nên vị ngọt dịu và thư giãn. Che bóng càng kỹ, màu xanh càng thẫm và hương thơm càng phong phú.",
        p3: 'Các bước sau thu hoạch cũng rất tỉ mỉ. Lá trà được hấp ngay để ngăn oxy hóa, giữ trọn sắc hương. Sau khi sấy khô sẽ loại bỏ gân lá và cọng. Phần còn lại gọi là "Tencha", được nghiền bằng cối đá với tốc độ dưới 50g mỗi giờ.',
      },
      chapter3: {
        eyebrow: "Chương 03",
        title: "Những người bạn cũ\nBên cạnh bạn",
        p1: "Trong trà đạo, trà cụ không chỉ là công cụ; mỗi món đồ đều như một người bạn cũ có tính cách riêng. Chawan (chén trà) là món đồ hấp dẫn nhất: bất đối xứng và men không đều, bởi sự bất toàn là cốt lõi của cái đẹp.",
        p2: "Chasen là cây chổi đánh trà được chẻ tay từ một ống tre duy nhất. Những sợi tre nhỏ giúp hòa quyện bột trà và nước ấm thành lớp bọt mịn màng chỉ trong vài giây. Chasen cũ sẽ được làm lễ cảm tạ trước khi hóa đi.",
        p3: "Chashaku là muỗng tre mỏng dùng để múc bột trà. Mỗi chiếc muỗng đều được các nghệ nhân đẽo gọt thủ công và được truyền qua nhiều thế hệ như một báu vật.",
      },
      chapter4: {
        eyebrow: "Chương 04",
        title: "Hòa, Kính, Thanh, Tịch,\nMột đời gói gọn trong bốn chữ",
        p1: "Sen no Rikyu đúc kết tinh thần trà đạo qua bốn chữ: Hòa (hòa hợp với vạn vật); Kính (tôn trọng mọi điều); Thanh (tâm hồn thanh tịnh); và Tịch (sự an yên trong tĩnh lặng).",
        p2: 'Một khái niệm đầy sức hút là "Nhất kỳ nhất hội" (Ichigo Ichie) – "mỗi khoảnh khắc là duy nhất". Nghĩa là mỗi cuộc gặp gỡ cần được trân trọng như thể đó là lần cuối. Chén trà này, khoảnh khắc này, ánh sáng này sẽ không bao giờ lặp lại.',
        p3: "Ý tưởng này rất ý nghĩa trong cuộc sống hiện đại. Giữa vô vàn thông báo điện thoại, trà đạo nhắc nhở chúng ta: hãy đặt điện thoại xuống và trọn vẹn trong phút giây này.",
      },
      chapter5: {
        eyebrow: "Chương 05",
        title: "Pha một chén matcha,\nKhông khó như bạn nghĩ",
        p1: "Nhiều người nghĩ trà đạo rất xa vời và cần trà cụ đắt đỏ. Không hẳn thế. Để bắt đầu, bạn chỉ cần một Chawan, một Chasen, một Chashaku và bột matcha chất lượng tốt tại nhà.",
        p2: 'Giữ nhiệt độ nước ở khoảng 70 đến 80 °C; nước sôi sẽ làm trà bị chát. Trước tiên hòa chút nước với bột trà thành dạng sệt, sau đó thêm nước. Đánh nhanh tay theo hình chữ "W" hoặc "M", tránh đánh vòng tròn.',
        p3: "Lần đầu tiên có thể chưa hoàn hảo nhưng đó là cả quá trình. Trà đạo không tìm kiếm sự hoàn hảo ngay lập tức, mà trân trọng những gì bạn chiêm nghiệm được qua mỗi lần luyện tập.",
      },
    },
    final: {
      eyebrow: "Hiện tại",
      title: "Bạn đã sẵn sàng?",
      p1: "Sau khi đọc những điều này, chắc hẳn bạn đã có góc nhìn khác về matcha. Đó không chỉ là một thức uống, mà là nghệ thuật sống trăm năm.",
      p2: "Tiếp theo sẽ là trải nghiệm 3D tương tác. Khi cuộn xuống, các bước pha trà sẽ được tái hiện sinh động theo tốc độ của riêng bạn.",
      button: "Vào không gian 3D",
    },
    loader: {
      preparing: "Đang chuẩn bị",
    },
    overlay: {
      ritual: "Nghi thức",
      finalRecipe: "Công thức",
      matcha: "Matcha",
      warmWater: "Nước ấm",
      waterTemp: "Nhiệt độ nước",
      back: "Về trang chủ",
    },
    steps: {
      intro: {
        title: "Nhất Kỳ Nhất Hội",
        body: "Buông bỏ muộn phiền, nương theo nhịp điệu và đón chờ sự ra đời của chén trà.",
      },
      powder: {
        eyebrow: "Bước 01",
        title: "Cho bột vào chén",
        body: "Bột trà xanh mịn nằm sẵn trên rây treo trên chén trà, lặng lẽ chờ đợi bắt đầu.",
      },
      sift: {
        eyebrow: "Bước 02",
        title: "Rây bột",
        body: "Trước khi chế nước, rây bột trà thật mịn để đảm bảo lớp bọt sau này thật mịn màng.",
      },
      water: {
        eyebrow: "Bước 03",
        title: "Chế nước ấm",
        body: "Rót nước ấm 75 °C từ từ để đánh thức hương trà mà không làm khét bột.",
      },
      whisk: {
        eyebrow: "Bước 04",
        title: "Đánh trà",
        body: 'Dùng Chasen đánh nhanh tay theo hình chữ "W" cho đến khi lớp bọt mịn màng như nhung xuất hiện.',
      },
      finish: {
        title: "Khoảnh khắc của bạn",
        body: "Đây là nghi thức matcha dành riêng cho bạn. Hãy chậm lại và tận hưởng sự an yên này.",
      },
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      scene3d: "مشهد ثلاثي الأبعاد",
    },
    metadata: {
      title: "ماتشا - إيشيجو إيشيي",
      description: "وعاء من الماتشا، لحظة في الزمن. اتبع رغد أنفاسك وتمريرك لتختبر طقوس تحضير الماتشا التأملية في رحلة تفاعلية ثلاثية الأبعاد غامرة.",
    },
    header: {
      title: "Matcha",
    },
    hero: {
      eyebrow: "طقوس التركيز",
      title: "أيقظ\nحواسك",
      description:
        "في عصر يطالب بالسرعة، تطلب منك الماتشا التمهل. لا يمكن الاستعجال؛ فالسرعة تفسد المذاق. مرر للأسفل وتعرف على قصة هذا الشاي.",
      scroll: "مرر للأسفل",
    },
    chapters: {
      chapter1: {
        eyebrow: "الفصل 01",
        title: "من الصين إلى اليابان،\nرحلة شاي",
        p1: "تبدأ قصة الماتشا في عهد أسرة تانغ. في ذلك الوقت بالصين، كان الناس يكبسون أوراق الشاي في قوالب، ويطحنونها إلى مسحوق ويخلطونها بالماء. وفي عام 1191، عاد الراهب الياباني إيساي بهذه الطريقة وبذور الشاي ليزرعها قرب كيوتو.",
        p2: "خلال فترة موروماتشي، بدأت مراسم الشاي تتشكل. ولاحقاً، جعل سن نو ريكيو شرب الشاي ممارسة روحية متاحة للجميع بدلاً من مجرد مظهر للثراء الأرستقراطي.",
        p3: 'عُرفت هذه الفلسفة باسم "وابي سابي" - وهي البحث عن الجمال في الأشياء غير المثالية والعابرة. وعاء غير متماثل أو ملعقة خيزران قديمة هي تفاصيل تكمن فيها الروح.',
      },
      chapter2: {
        eyebrow: "الفصل 02",
        title: "هذا اللون الأخضر النابض،\nكيف يأتي؟",
        p1: "يتساءل الكثيرون عن سر خضار الماتشا الزاهي. وراء ذلك تقنية زراعية مثيرة: قبل الحصاد بثلاثة إلى أربعة أسابيع، يغطي المزارعون الشجيرات بشبكات لحمايتها من الشمس.",
        p2: "هذا يدفع الشجيرات لإنتاج الكلوروفيل وتجميع الثيانين المسؤول عن المذاق الحلو المهدئ. كلما كان الظل كاملاً، زاد عمق اللون ورونق النكهة.",
        p3: 'خطوات ما بعد الحصاد أكثر دقة. تُبخر الأوراق فوراً لوقف الأكسدة وحفظ اللون. بعد التجفيف تُزال العروق والسيقان، ويُطحن المتبقي "تينشا" في مطاحن حجرية بمعدل يقل عن 50 غراماً في الساعة.',
      },
      chapter3: {
        eyebrow: "الفصل 03",
        title: "الأصدقاء القدامى\nبجانبك",
        p1: "في مراسم الشاي، لا تعد الأدوات مجرد وسائل؛ فكل منها صديق قديم له شخصيته. وعاء الشوان هو الأكثر سحراً: غير متماثل وطلاؤه غير منتظم، لأن النقص جوهر الجمال.",
        p2: "التشاسين مخفقة خيزران تُنحت يدوياً من قطعة واحدة. شعيراتها الدقيقة تدمج المسحوق بالماء الدافئ في ثوانٍ لتصنع رغوة مخملية. وتُشكر المخفقة القديمة في طقس خاص قبل حرقها.",
        p3: "التشاشاكو ملعقة خيزران نحيفة. ورغم أنها مخصصة لغرف المسحوق فقط، يُنحت كل منها يدوياً بواسطة أساتذة الشاي وتتناقلها الأجيال.",
      },
      chapter4: {
        eyebrow: "الفصل 04",
        title: "وا، كي، سي، جاكو،\nحياة في أربع كلمات",
        p1: "لخص سن نو ريكيو روح الشاي في أربعة مفاهيم: وا (الانسجام) مع البيئة؛ كي (الاحترام) لكل الأشياء؛ سي (النقاء) في العقل؛ وجاكو (السكينة) في الصمت.",
        p2: 'ومن المفاهيم الجذابة "إيشيجو إيشيي" - وتعني "مرة واحدة، لقاء واحد". أي أن كل لقاء يجب أن يُعامل كأنه الأخير. هذا الوعاء وهذا اللقاء لن يتكررا أبداً.',
        p3: "هذه الفكرة تلائم الحياة الحديثة اليوم. وسط الإشعارات اللامتناهية، تذكرنا مراسم الشاي بوضع الهاتف والتركيز في اللحظة الحالية.",
      },
      chapter5: {
        eyebrow: "الفصل 05",
        title: "تحضير الماتشا،\nأسهل مما تظن",
        p1: "يعتقد الكثيرون أن تحضير الماتشا معقد ويتطلب أدوات باهظة الثمن. لكن الأمر ليس كذلك. للبدء تحتاج فقط لوعاء تشاوان ومخفقة تشاسين وملعقة تشاشاكو ومسحوق ماتشا جيد.",
        p2: 'اضبط درجة حرارة الماء بين 70 و 80 درجة مئوية؛ الماء المغلي يجعل الشاي مراً. اخلط المسحوق بقليل من الماء أولاً ليصبح كالعجينة، ثم أضف الباقي. اخفق بسرعة بشكل "W" أو "M".',
        p3: "المرة الأولى لن تكون مثالية، لكنها مسألة تدريب. لا تبحث مراسم الشاي عن الكمال من المرة الأولى، بل عن الوعي والسكينة في الطريق.",
      },
    },
    final: {
      eyebrow: "الآن",
      title: "هل أنت مستعد؟",
      p1: "بعد قراءة هذا، نأمل أن نظرتك للماتشا قد تغيرت. فهي ليست مجرد مشروب، بل فن عيش قديم.",
      p2: "التالي هو تجربة تفاعلية ثلاثية الأبعاد. عند التمرير لأسفل، ستتضح خطوات التحضير وفق سرعة تصفحك الخاصة.",
      button: "دخول المشهد ثلاثي الأبعاد",
    },
    loader: {
      preparing: "جاري التحضير",
    },
    overlay: {
      ritual: "طقس",
      finalRecipe: "الوصفة",
      matcha: "ماتشا",
      warmWater: "ماء دافئ",
      waterTemp: "حرارة الماء",
      back: "رجوع للرئيسية",
    },
    steps: {
      intro: {
        title: "إيشيجو إيشيي",
        body: "دع المشاغل جانباً، وتأمل ولادة وعاء الشاي في صمت.",
      },
      powder: {
        eyebrow: "الخطوة 01",
        title: "وضع المسحوق",
        body: "مسحوق أخضر ناعم يستقر في المصفاة فوق الوعاء، بانتظار بدء الطقوس في صمت.",
      },
      sift: {
        eyebrow: "الخطوة 02",
        title: "نخل المسحوق",
        body: "قبل سكب الماء، انخل الماتشا لضمان الحصول على رغوة مخملية خالية من التكتلات.",
      },
      water: {
        eyebrow: "الخطوة 03",
        title: "سكب الماء",
        body: "اسكب الماء الدافئ عند 75 درجة مئوية ببطء لإيقاظ النكهة دون حرق المسحوق.",
      },
      whisk: {
        eyebrow: "الخطوة 04",
        title: "الخفق",
        body: 'اخفق بسرعة بشكل "W" باستخدام التشاسين حتى تظهر رغوة مخملية ناعمة على السطح.',
      },
      finish: {
        title: "لحظتك الخاصة",
        body: "هذا هو طقس الماتشا الخاص بك. تمهل واستمتع بلحظة السلام والحلاوة هذه.",
      },
    },
  },
  cs: {
    nav: {
      home: "Domů",
      scene3d: "3D scéna",
    },
    metadata: {
      title: "Matcha - Ichigo Ichie",
      description: "Miska matcha, okamžik v čase. Sledujte rytmus svého dechu a rolování a zažijte meditativní rituál přípravy čaje v pohlcující 3D interaktivní cestě.",
    },
    header: {
      title: "Matcha",
    },
    hero: {
      eyebrow: "Rituál soustředění",
      title: "Probuďte\nsvé smysly",
      description:
        "V uspěchané době nás matcha žádá, abychom zpomalili. Nelze spěchat; spěch by jen zkazil chuť. Přejděte dolů a objevte příběh tohoto čaje.",
      scroll: "Přejít dolů",
    },
    chapters: {
      chapter1: {
        eyebrow: "Kapitola 01",
        title: "Z Číny do Japonska,\ncesta jednoho čaje",
        p1: "Příběh čaje matcha začíná za dynastie Tang. Tehdy se v Číně lisovaly čajové lístky do lisovaných cihel, mlely se na prášek a šlehaly s teplou vodou. V roce 1191 přivezl japonský mnich Eisai tuto metodu a čajová semínka domů a zasadil je nedaleko Kjóta.",
        p2: "Během období Muromachi se čajový obřad začal formovat. Později Sen no Rikyu proměnil pití čaje z ukázky bohatství na duchovní praxi přístupnou všem, bez rozdílu postavení.",
        p3: "Tato filozofie se stala známou jako „Wabi-sabi“ – hledání krásy v nedokonalosti a pomíjivosti. Asymetrická čajová miska nebo stará bambusová lžička jsou detaily, ve kterých žije duše.",
      },
      chapter2: {
        eyebrow: "Kapitola 02",
        title: "Ta sytá zeleň,\njak vzniká?",
        p1: "Mnozí se diví, proč je matcha tak jasně zelená. Za vším stojí zajímavá zemědělská technika: tři až čtyři týdny před sklizní zakrývají pěstitelé keře sítěmi, aby je chránili před sluncem.",
        p2: "To rostliny netrápí, ale nutí je produkovat chlorofyl a hromadit L-theanin, který dává čaji sladkou a uklidňující chuť. Čím hlubší stín, tím sytější zelená a bohatší aroma.",
        p3: "Kroky po sklizni jsou ještě jemnější. Lístky se ihned napařují, aby se zastavila oxidace. Po sušení se odstraní řapíky a stonky. Co zbude, se nazývá „Tencha“, která se mele na kamenných mlýnech rychlostí nižší než 50 gramů za hodinu.",
      },
      chapter3: {
        eyebrow: "Kapitola 03",
        title: "Starší přátelé\npo vašem boku",
        p1: "Při čajovém obřadu jsou nádoby více než nástroje; jsou jako staří přátelé s vlastním charakterem. Chawan (miska) je nejúchvatnější: asymetrický, s nepravidelnou glazurou, neboť nedokonalost je podstatou krásy.",
        p2: "Chasen je metlička z jednoho kusu bambusu. Její jemná vlákna emulgují prášek a teplou vodu během vteřin do sametové pěny. Opotřebovaný chasen se spálí při rituálu na poděkování.",
        p3: "Chashaku je jednoduchá bambusová lžička na prášek. Každou lžičku mistři vyřezávají ručně a předávají se z generace na generaci.",
      },
      chapter4: {
        eyebrow: "Kapitola 04",
        title: "Wa, Kei, Sei, Jaku,\nživot ve čtyřech slovech",
        p1: "Sen no Rikyu vyjádřil ducha čaje ve čtyřech pojmech: Wa (Harmonie) s okolím; Kei (Respekt) ke všemu; Sei (Čistota) mysli; a Jaku (Klid) v tichu.",
        p2: "Úchvatným pojmem je „Ichigo Ichie“ – doslova „jeden čas, jedno setkání“. Znamená to, že každé setkání by mělo být bráno jako poslední. Tato miska čaje, tento moment, světlo a teplota se nikdy nebudou opakovat.",
        p3: "Tato myšlenka rezonuje i dnes. V uspěchaném světě plném oznámení nám čajový obřad připomíná: odložte telefon a buďte v přítomném okamžiku.",
      },
      chapter5: {
        eyebrow: "Kapitola 05",
        title: "Příprava čaje matcha\nje jednodušší, než se zdá",
        p1: "Mnozí si myslí, že obřad je složitý a vyžaduje drahé nádobí. Není tomu tak. Pro začátek stačí jen chawan, chasen, chashaku a kvalitní prášek matcha.",
        p2: "Používejte vodu o teplotě 70–80 °C; vroucí voda udělá čaj hořkým. Nejprve rozetřete prášek s kapkou vody na pastu, poté přidejte zbytek vody. Šlehejte metličkou pohyby ve tvaru „W“ nebo „M“, ne v kruzích.",
        p3: "Poprvé to nebude dokonalé, ale je to otázka cviku. Obřad si necení okamžitého výsledku, ale cesty a pozornosti k detailům.",
      },
    },
    final: {
      eyebrow: "Nyní",
      title: "Jste připraveni?",
      p1: "Nyní máte jistě jiný pohled na čaj matcha. Není to jen nápoj, ale staleté umění žít.",
      p2: "Dále vás čeká interaktivní 3D zážitek. Při rolování dolů se kroky přípravy vizualizují ve vašem tempu.",
      button: "Vstoupit do 3D scény",
    },
    loader: {
      preparing: "Příprava",
    },
    overlay: {
      ritual: "Rituál",
      finalRecipe: "Recept",
      matcha: "Matcha",
      warmWater: "Teplá voda",
      waterTemp: "Teplota vody",
      back: "Zpět na úvod",
    },
    steps: {
      intro: {
        title: "Ichigo Ichie",
        body: "Nechte starosti stranou a pozorujte zrození misky čaje.",
      },
      powder: {
        eyebrow: "Krok 01",
        title: "Přidání prášku",
        body: "Zelený prášek leží v sítku nad miskou a tiše čeká na začátek rituálu.",
      },
      sift: {
        eyebrow: "Krok 02",
        title: "Prosívání",
        body: "Před přidáním vody prášek prosejte. Tím zajistíte sametovou pěnu bez hrudek.",
      },
      water: {
        eyebrow: "Krok 03",
        title: "Přilévání vody",
        body: "Pomalu přilévejte vodu o teplotě 75 °C, abyste probudili aroma a nespálili prášek.",
      },
      whisk: {
        eyebrow: "Krok 04",
        title: "Šlehání",
        body: "Rychle šlehejte metličkou v pohybech tvaru „W“, dokud se neobjeví sametová pěna.",
      },
      finish: {
        title: "Váš moment",
        body: "Toto je váš rituál matcha. Zpomalte a vychutnejte si tento moment klidu a sladkosti.",
      },
    },
  },
  hi: {
    nav: {
      home: "मुख्य पृष्ठ",
      scene3d: "3D दृश्य",
    },
    metadata: {
      title: "माचा - इचिगो इची",
      description:
        "माचा का एक प्याला, समय का एक क्षण। एक गहन 3D संवादात्मक यात्रा में ध्यानपूर्ण माचा बनाने की विधि का अनुभव करने के लिए अपनी सांस और स्क्रॉल की लय का पालन करें।",
    },
    header: {
      title: "Matcha",
    },
    hero: {
      eyebrow: "एकाग्रता की विधि",
      title: "अपनी इंद्रियों\nको जगाएं",
      description:
        "तेजी की मांग करने वाले इस युग में, माचा आपसे धीमे होने का अनुरोध करता है। जल्दबाजी नहीं की जा सकती; जल्दबाजी से स्वाद बिगड़ जाता है। नीचे स्क्रॉल करें और इस चाय की कहानी जानें।",
      scroll: "नीचे स्क्रॉल करें",
    },
    chapters: {
      chapter1: {
        eyebrow: "अध्याय 01",
        title: "चीन से जापान तक,\nएक चाय की यात्रा",
        p1: "माचा की कहानी तांग राजवंश से शुरू होती है। उस समय चीन में चाय की पत्तियों को दबाकर ब्लॉक बनाए जाते थे, उन्हें पीसकर पाउडर बनाया जाता था और पानी में मिलाया जाता था। 1191 में जापानी भिक्षु इसाई इस विधि और बीजों को अपने साथ ले गए और क्योटो के पास लगाया।",
        p2: "मुरोमाची काल में चाय समारोह ने आकार लेना शुरू किया। बाद में सेन नो रिकीउ ने चाय पीने को अमीर कुलीनों के दिखावे से बदलकर एक आध्यात्मिक अभ्यास में बदल दिया, जिसमें सभी का स्वागत था।",
        p3: 'इस दर्शन को बाद में "वाबी-साबी" के नाम से जाना गया - जिसका अर्थ है अपूर्णता में सौंदर्य खोजना। एक टेढ़ा-मेढ़ा चाय का प्याला या पुरानी बांस की चम्मच वह विवरण हैं जहां आत्मा बसती है।',
      },
      chapter2: {
        eyebrow: "अध्याय 02",
        title: "वह चमकीला हरा रंग,\nकैसे आता है?",
        p1: "कई लोग आश्चर्य करते हैं कि माचा का रंग इतना चमकीला हरा क्यों होता है। इसके पीछे एक कृषि तकनीक है: कटाई से तीन-चार सप्ताह पहले चाय के पौधों को छाया से ढक दिया जाता है।",
        p2: "यह पौधों को परेशान करने के लिए नहीं, बल्कि उन्हें क्लोरोफिल का उत्पादन करने के लिए मजबूर करने और एल-थीनिन जमा करने के लिए है। छाया जितनी अच्छी होगी, रंग उतना ही गहरा होगा और सुगंध उतनी ही समृद्ध होगी।",
        p3: 'कटाई के बाद के कदम और भी नाजुक हैं। पत्तियों को तुरंत भाप दी जाती है ताकि ऑक्सीकरण रुक सके। सूखने के बाद नसें और तने हटा दिए जाते हैं। बचे हुए हिस्से को "तेनचा" कहा जाता है, जिसे पत्थर की मिलों में बहुत धीरे-धीरे पीसा जाता है।',
      },
      chapter3: {
        eyebrow: "अध्याय 03",
        title: "आपके पास के\nपुराने मित्र",
        p1: "चाय समारोह में बर्तन केवल उपकरण नहीं हैं; प्रत्येक का अपना चरित्र है। चावन (प्याला) सबसे आकर्षक है: यह जानबूझकर असममित होता है, क्योंकि अपूर्णता ही सौंदर्य का सार है।",
        p2: "चासेन एक बांस का व्हिस्क है जिसे हाथ से तराशा जाता है। इसके बारीक रेशे माचा पाउडर और गर्म पानी को कुछ ही सेकंड में झागदार बना देते हैं। पुराने व्हिस्क को फेंकने के बजाय एक समारोह में जला दिया जाता है।",
        p3: "चाशाकु एक साधारण, पतली बांस की चम्मच है। भले ही यह केवल पाउडर नापने के लिए हो, प्रत्येक को चाय मास्टर्स द्वारा हाथ से तराशा जाता है और पीढ़ियों तक पहुँचाया जाता है।",
      },
      chapter4: {
        eyebrow: "अध्याय 04",
        title: "वा, केई, सेई, जाकु,\nचार शब्दों में एक जीवन",
        p1: "सेन नो रिकीउ ने चाय की भावना को चार सिद्धांतों में समेटा: वा (सामंजस्य); केई (सम्मान); सेई (शुद्धता) मन में; और जाकु (शांति) मौन में।",
        p2: 'एक दिलचस्प अवधारणा "इचिगो इची" है; जिसका अर्थ है "एक बार, एक मुलाकात"। इसका अर्थ है कि हर मुलाकात को इस तरह माना जाना चाहिए जैसे कि वह आखिरी हो। वह प्याला, वह क्षण, प्रकाश और तापमान कभी दोबारा नहीं आएंगे।',
        p3: "यह विचार आधुनिक जीवन में भी प्रासंगिक है। अंतहीन सूचनाओं के बीच चाय समारोह हमें याद दिलाता है: फोन को अलग रखें और उस क्षण में रहें।",
      },
      chapter5: {
        eyebrow: "अध्याय 05",
        title: "माचा तैयार करना,\nजितना आप सोचते हैं उससे आसान",
        p1: "कई लोग सोचते हैं कि चाय समारोह जटिल है और महंगे उपकरणों की आवश्यकता होती है। ऐसा नहीं है। शुरू करने के लिए आपको केवल एक चावन, एक चासेन, एक चाशाकु और अच्छी गुणवत्ता वाले माचा पाउडर की आवश्यकता है।",
        p2: 'पानी को 70 से 80 डिग्री सेल्सियस के बीच रखें; उबलता पानी चाय को कड़वा बना देता है। पहले पाउडर को थोड़े पानी के साथ पेस्ट बना लें, फिर बचा हुआ पानी डालें। चासेन से गोल के बजाय "W" या "M" आकार में तेजी से फेंटें।',
        p3: "पहली कोशिश सही नहीं हो सकती है लेकिन यह एक अभ्यास है। चाय समारोह पहले प्रयास में पूर्णता को नहीं, बल्कि ध्यान और शांति को महत्व देता है।",
      },
    },
    final: {
      eyebrow: "अब",
      title: "क्या आप तैयार हैं?",
      p1: "इसे पढ़ने के बाद माचा के प्रति आपका नजरिया जरूर बदल गया होगा। यह सिर्फ एक पेय नहीं है, बल्कि जीवन जीने की एक पुरानी कला है।",
      p2: "आगे एक इंटरैक्टिव 3D अनुभव है। नीचे स्क्रॉल करने पर तैयारी के चरण आपकी गति से दिखाई देंगे।",
      button: "3D दृश्य में प्रवेश करें",
    },
    loader: {
      preparing: "तैयारी हो रही है",
    },
    overlay: {
      ritual: "विधि",
      finalRecipe: "रेसिपी",
      matcha: "माचा",
      warmWater: "गुनगुना पानी",
      waterTemp: "पानी का तापमान",
      back: "मुख्य पृष्ठ पर वापस जाएं",
    },
    steps: {
      intro: {
        title: "इचिगो इची",
        body: "चिंताओं को छोड़ें और चाय के प्याले के जन्म को शांत होकर देखें।",
      },
      powder: {
        eyebrow: "चरण 01",
        title: "पाउडर डालना",
        body: "हरा पाउडर प्याले के ऊपर लगे छननी में शांत होकर शुरू होने की प्रतीक्षा कर रहा है।",
      },
      sift: {
        eyebrow: "चरण 02",
        title: "छानना",
        body: "पानी डालने से पहले माचा को छान लें। इससे रेशमी झाग मिलता है।",
      },
      water: {
        eyebrow: "चरण 03",
        title: "पानी डालना",
        body: "चाय की खुशबू को जगाने के लिए 75 डिग्री सेल्सियस तापमान का गुनगुना पानी धीरे-धीरे डालें।",
      },
      whisk: {
        eyebrow: "चरण 04",
        title: "फेंटना",
        body: "सतह पर झाग आने तक चासेन से तेजी से फेंटें।",
      },
      finish: {
        title: "आपका क्षण",
        body: "यह आपका माचा अनुष्ठान है। धीमे हो जाएं और शांति और मिठास के इस क्षण का आनंद लें।",
      },
    },
  },
  hu: {
    nav: {
      home: "Főoldal",
      scene3d: "3D jelenet",
    },
    metadata: {
      title: "Matcha - Ichigo Ichie",
      description: "Egy tál matcha, egy pillanat az időben. Kövesse lélegzetének és görgetésének ritmusát, hogy megtapasztalja a meditatív teázási rituálét egy magával ragadó 3D-s interaktív utazásban.",
    },
    header: {
      title: "Matcha",
    },
    hero: {
      eyebrow: "Az összpontosítás rituáléja",
      title: "Ébreszd fel\nszaglásod és ízlésed",
      description:
        "Egy olyan korban, amely gyorsaságot követel, a matcha arra kér, hogy lassíts le. Nem lehet siettetni; a sietség csak elrontaná az ízét. Görgess lejjebb, és ismerd meg a tea történetét.",
      scroll: "Görgess le",
    },
    chapters: {
      chapter1: {
        eyebrow: "01. Fejezet",
        title: "Kínából Japánba,\negy tea utazása",
        p1: "A matcha története a Tang-dinasztiában kezdődik. Akkoriban Kínában a tealeveleket tömbökbe préselték, porrá őrölték és vízzel keverték. 1191-ben a japán szerzetes, Eisai hazatért ezzel a módszerrel és teamagokkal, és Kyoto közelében ültette el őket.",
        p2: "A Muromachi-korszakban a teaszertartás kezdett formát ölteni. Később Sen no Rikyu a teázást az arisztokratikus gazdagság mutogatásából mindenki számára elérhető szellemi gyakorlattá alakította.",
        p3: "Ezt a filozófiát később „Wabi-sabi” néven ismerték – a tökéletlenségben és a múlandóságban megtalálni a mély szépséget. Egy aszimmetrikus teáscsésze vagy egy kopott bambuszkanál olyan részletek, amelyekben a lélek lakozik.",
      },
      chapter2: {
        eyebrow: "02. Fejezet",
        title: "Az az élénk zöld,\nhogyan keletkezik?",
        p1: "Sokan csodálkoznak, miért olyan élénk zöld a matcha. Mögötte egy érdekes mezőgazdasági technika áll: három-négy héttel a szüret előtt a gazdák hálókkal takarják le a teacserjéket, hogy megvédjék őket a naptól.",
        p2: "Ez nem a növények kínzása, hanem arra kényszeríti őket, hogy klorofillt termeljenek, és felhalmozzák az L-teanint, amely a teának édes és nyugtató ízt ad. Minél mélyebb az árnyék, annál mélyebb a zöld és gazdagabb az aroma.",
        p3: "A szüret utáni lépések még finomabbak. A leveleket azonnal gőzölik az oxidáció megállítása érdekében. Szárítás után eltávolítják a szárakat és ereket. Ami megmarad, azt „Tenchának” nevezik, amelyet kőmalmokban őrölnek.",
      },
      chapter3: {
        eyebrow: "03. Fejezet",
        title: "A régi barátok\naz oldaladon",
        p1: "A teaszertartásban az eszközök többek, mint szerszámok; mindegyik egy-egy karakteres régi barát. A Chawan (csésze) a leglenyűgözőbb: aszimmetrikus, mert a tökéletlenség a szépség lényege.",
        p2: "A Chasen egy bambusz habverő, amelyet egyetlen darab bambuszból kézzel faragtak. Finom szálai másodpercek alatt krémes habbá emulgeálják a matcha port és a meleg vizet. Az elhasználódott chasent elégetik egy szertartáson.",
        p3: "A Chashaku egy egyszerű, vékony bambuszkanál. Bár csak a por mérésére szolgál, mindegyiket teamesterek faragják kézzel, és generációkon át öröklődnek.",
      },
      chapter4: {
        eyebrow: "04. Fejezet",
        title: "Wa, Kei, Sei, Jaku,\negy élet négy szóban",
        p1: "Sen no Rikyu a tea szellemét négy fogalomba sűrítette: Wa (Harmónia) a környezettel; Kei (Tisztelet) minden iránt; Sei (Tisztaság) a tudatban; és Jaku (Csend) a nyugalomban.",
        p2: "Egy lenyűgöző fogalom az „Ichigo Ichie” – szó szerint „egy alkalom, egy találkozás”. Azt jelenti, hogy minden találkozást úgy kell kezelni, mintha az lenne az utolsó. Az a csésze tea, az a pillanat, a fény és a hőmérséklet soha nem ismétlődik meg.",
        p3: "Ez a gondolat a modern életben is visszhangra talál. A teaszertartás emlékeztet minket: tedd le a telefont és légy jelen a pillanatban.",
      },
      chapter5: {
        eyebrow: "05. Fejezet",
        title: "Matcha készítés,\negyszerűbb, mint gondolnád",
        p1: "Sokan azt gondolják, hogy a szertartás bonyolult és drága eszközöket igényel. Ez nem így van. Kezdetnek csak egy chawanra, chasenre, chashakura és jó minőségű matcha porra van szükséged.",
        p2: "Tartsd a vizet 70 és 80 °C között; a forró víz keserűvé teszi a teát. Először keverj el egy kis vizet a porral pasztává, majd add hozzá a többit. Verd fel gyorsan „W” vagy „M” alakban, ne körökben.",
        p3: "Az első próbálkozás talán nem lesz tökéletes, de ez gyakorlás kérdése. A szertartás nem a tökéletességet keresi elsőre, hanem a figyelmet és a nyugalmat az úton.",
      },
    },
    final: {
      eyebrow: "Most",
      title: "Készen állsz?",
      p1: "Ezek után biztosan másképp nézel a matchára. Ez nem csak egy ital, hanem egy évszázados életművészet.",
      p2: "Következik egy interaktív 3D élmény. Ahogy lefelé görgetsz, a készítés lépései a saját tempódban jelennek meg.",
      button: "Belépés a 3D jelenetbe",
    },
    loader: {
      preparing: "Előkészítés",
    },
    overlay: {
      ritual: "Rituálé",
      finalRecipe: "Recept",
      matcha: "Matcha",
      warmWater: "Meleg víz",
      waterTemp: "Vízhőmérséklet",
      back: "Vissza a főoldalra",
    },
    steps: {
      intro: {
        title: "Ichigo Ichie",
        body: "Hagyd hátra a gondokat és figyeld a csésze tea születését csendben.",
      },
      powder: {
        eyebrow: "01. Lépés",
        title: "Por hozzáadása",
        body: "A zöld por a csésze feletti szitában fekszik, csendben várva a rituálé kezdetét.",
      },
      sift: {
        eyebrow: "02. Lépés",
        title: "Szitálás",
        body: "Víz hozzáadása előtt szitáld át a matchát. Ez biztosítja a csomómentes krémes habot.",
      },
      water: {
        eyebrow: "03. Lépés",
        title: "Víz öntése",
        body: "Lassan önts meleg vizet 75 °C-on, hogy felébreszd az aromát anélkül, hogy megégetnéd a port.",
      },
      whisk: {
        eyebrow: "04. Lépés",
        title: "Habverés",
        body: "Verd fel gyorsan a chasennel „W” alakban, amíg finom hab nem keletkezik a felületén.",
      },
      finish: {
        title: "A te pillanatod",
        body: "Ez a te matcha rituáléd. Lassíts le és élvezd a csend és az édesség ezen pillanatát.",
      },
    },
  },
  id: {
    nav: {
      home: "Beranda",
      scene3d: "Adegan 3D",
    },
    metadata: {
      title: "Matcha - Ichigo Ichie",
      description:
        "Semangkuk matcha, momen dalam waktu. Ikuti ritme napas dan guliran Anda untuk merasakan ritual pembuatan teh yang meditatif dalam perjalanan interaktif 3D yang imersif.",
    },
    header: {
      title: "Matcha",
    },
    hero: {
      eyebrow: "Ritual Fokus",
      title: "Bangkitkan\nIndramu",
      description:
        "Di era yang menuntut kecepatan, matcha meminta kita untuk melambat. Tidak bisa terburu-buru; tergesa-gesa hanya akan merusak rasa. Gulir ke bawah dan ketahui kisah teh ini.",
      scroll: "Gulir ke bawah",
    },
    chapters: {
      chapter1: {
        eyebrow: "Bab 01",
        title: "Dari Tiongkok ke Jepang,\nPerjalanan Secangkir Teh",
        p1: "Kisah matcha dimulai pada Dinasti Tang. Saat itu di Tiongkok, daun teh ditekan menjadi balok, digiling menjadi bubuk dan dicampur dengan air. Pada tahun 1191, biksu Jepang Eisai membawa metode ini dan biji teh pulang untuk ditanam di dekat Kyoto.",
        p2: "Selama periode Muromachi, upacara teh mulai terbentuk. Kemudian Sen no Rikyu mengubah minum teh dari pajangan kekayaan bangsawan menjadi latihan spiritual yang dapat diakses oleh semua orang.",
        p3: 'Filosofi ini kemudian dikenal sebagai "Wabi-sabi" – menemukan keindahan dalam ketidaksempurnaan dan ketidakkekalan. Mangkuk asimetris atau sendok bambu usang adalah detail tempat jiwa berada.',
      },
      chapter2: {
        eyebrow: "Bab 02",
        title: "Warna Hijau Cerah Itu,\nBagaimana Terbentuknya?",
        p1: "Banyak orang heran mengapa matcha begitu hijau cerah. Di baliknya ada teknik pertanian yang menarik: tiga hingga empat minggu sebelum panen, petani menutupi tanaman teh dengan jaring untuk melindunginya dari matahari.",
        p2: "Ini bukan untuk menyiksa tanaman, tetapi untuk memaksa mereka memproduksi klorofil, mengumpulkan L-theanine yang bertanggung jawab atas rasa manis dan menenangkan. Semakin rindang naungannya, semakin pekat warnanya dan kaya aromanya.",
        p3: 'Langkah pascapanen bahkan lebih teliti. Daun segera dikukus untuk menghentikan oksidasi. Setelah kering, urat dan batang dibuang. Sisanya disebut "Tencha", yang digiling di pabrik batu kurang dari 50 gram per jam.',
      },
      chapter3: {
        eyebrow: "Bab 03",
        title: "Teman Lama\ndi Sisi Anda",
        p1: "Dalam upacara teh, alat bukan sekadar alat; masing-masing memiliki karakter tersendiri. Chawan (mangkuk) adalah yang paling menawan: asimetris dan dengan glasir tidak rata, karena ketidaksempurnaan adalah inti dari keindahan.",
        p2: "Chasen adalah pengocok bambu yang diukir dengan tangan dari satu bagian bambu. Seratnya yang halus mengemulsi bubuk matcha dan air hangat dalam beberapa detik menjadi busa beludru. Saat aus, ia dibakar dalam sebuah ritual terima kasih.",
        p3: "Chashaku adalah sendok bambu tipis yang sederhana. Meskipun hanya untuk menakar bubuk, masing-masing diukir dengan tangan oleh master teh dan diwariskan dari generasi ke generasi.",
      },
      chapter4: {
        eyebrow: "Bab 04",
        title: "Wa, Kei, Sei, Jaku,\nHidup dalam Empat Kata",
        p1: "Sen no Rikyu merangkum semangat teh dalam empat konsep: Wa (Keselarasan) dengan lingkungan; Kei (Rasa Hormat) terhadap segalanya; Sei (Kemurnian) dalam pikiran; dan Jaku (Ketenangan) dalam keheningan.",
        p2: 'Konsep menarik lainnya adalah "Ichigo Ichie" – secara harfiah "satu kali, satu pertemuan". Artinya, setiap pertemuan harus diperlakukan seolah-olah itu adalah yang terakhir. Secangkir teh itu, momen itu, cahaya dan suhu tidak akan pernah terulang.',
        p3: "Ide ini beresonansi dalam kehidupan modern. Di tengah notifikasi yang tak henti-hentinya, upacara teh mengingatkan kita: letakkan ponsel dan tetaplah berada di momen itu.",
      },
      chapter5: {
        eyebrow: "Bab 05",
        title: "Menyiapkan Matcha,\nLebih Mudah dari yang Anda Pikirkan",
        p1: "Banyak orang berpikir bahwa upacara teh itu rumit dan membutuhkan peralatan mahal. Tidak juga. Untuk memulai Anda hanya membutuhkan Chawan, Chasen, Chashaku, dan bubuk matcha berkualitas baik di rumah.",
        p2: 'Jaga suhu air antara 70 hingga 80 °C; air mendidih membuat teh pahit. Pertama campur bubuk dengan sedikit air sampai menjadi pasta, lalu tambahkan sisa air. Kocok cepat dengan Chasen membentuk "W" atau "M", bukan melingkar.',
        p3: "Uji coba pertama mungkin tidak sempurna, tetapi ini masalah latihan. Upacara teh tidak menuntut kesempurnaan pada percobaan pertama, melainkan menghargai prosesnya.",
      },
    },
    final: {
      eyebrow: "Sekarang",
      title: "Apakah Anda Siap?",
      p1: "Setelah membaca ini, pandangan Anda tentang matcha pasti telah berubah. Ini bukan sekadar minuman, melainkan seni hidup yang berusia ratusan tahun.",
      p2: "Berikutnya adalah pengalaman 3D interaktif. Saat Anda menggulir ke bawah, langkah-langkah persiapan akan divisualisasikan sesuai kecepatan Anda.",
      button: "Masuk ke Adegan 3D",
    },
    loader: {
      preparing: "Menyiapkan",
    },
    overlay: {
      ritual: "Ritual",
      finalRecipe: "Resep",
      matcha: "Matcha",
      warmWater: "Air Hangat",
      waterTemp: "Suhu Air",
      back: "Kembali ke Beranda",
    },
    steps: {
      intro: {
        title: "Ichigo Ichie",
        body: "Tinggalkan kekhawatiran dan saksikan kelahiran secangkir teh dalam keheningan.",
      },
      powder: {
        eyebrow: "Langkah 01",
        title: "Menambahkan Bubuk",
        body: "Bubuk hijau halus terletak di saringan di atas mangkuk, menunggu dalam diam dimulainya ritual.",
      },
      sift: {
        eyebrow: "Langkah 02",
        title: "Menyaring",
        body: "Sebelum menambahkan air, saring matcha terlebih dahulu. Ini memastikan busa lembut bebas gumpalan.",
      },
      water: {
        eyebrow: "Langkah 03",
        title: "Menuangkan Air",
        body: "Tuangkan air hangat bersuhu 75 °C perlahan untuk membangkitkan aroma tanpa menghanguskan bubuk.",
      },
      whisk: {
        eyebrow: "Langkah 04",
        title: "Mengocok",
        body: 'Kocok cepat membentuk pola "W" dengan Chasen sampai terbentuk lapisan busa halus di permukaan.',
      },
      finish: {
        title: "Momen Anda",
        body: "Ini adalah ritual matcha Anda. Melambatlah dan nikmati momen kedamaian dan kemanisan ini.",
      },
    },
  },
  nl: {
    nav: {
      home: "Home",
      scene3d: "3D-scène",
    },
    metadata: {
      title: "Matcha - Ichigo Ichie",
      description:
        "Een kom matcha, een moment in de tijd. Volg het ritme van je ademhaling en het scrollen om een meditatief theeritueel te ervaren in een immersieve interactieve 3D-reis.",
    },
    header: {
      title: "Matcha",
    },
    hero: {
      eyebrow: "Een Ritueel van Focus",
      title: "Ontwaak\nje zintuigen",
      description:
        "In een tijdperk dat snelheid eist, vraagt matcha je om te vertragen. Je kunt het niet haasten; haast zou de smaak bederven. Scroll naar beneden en ontdek het verhaal van deze thee.",
      scroll: "Scroll naar beneden",
    },
    chapters: {
      chapter1: {
        eyebrow: "Hoofdstuk 01",
        title: "Van China naar Japan,\nde reis van een thee",
        p1: "Het verhaal van matcha begint in de Tang-dynastie. Destijds perste men in China theeblaadjes tot koeken, maalden ze tot poeder en mengden ze met water. In 1191 keerde de Japanse monnik Eisai terug uit China met deze methode en theezaden, en plantte ze nabij Kyoto.",
        p2: "Tijdens de Muromachi-periode nam de theeceremonie vorm aan. Later veranderde Sen no Rikyu het theedrinken van een vertoon van aristocratische rijkdom in een spirituele beoefening die voor iedereen toegankelijk was, zonder onderscheid van rang.",
        p3: 'Deze filosofie werd bekend als "Wabi-sabi" – schoonheid vinden in imperfectie en vergankelijkheid. Een asymmetrische theekom of een versleten bamboelepel zijn details waarin de ziel leeft.',
      },
      chapter2: {
        eyebrow: "Hoofdstuk 02",
        title: "Dat levendige groen,\nhoe ontstaat het?",
        p1: "Velen vragen zich af waarom matcha zo levendig groen is. Dahinter zit een interessante landbouwtechniek: drie tot vier weken voor de oogst bedekken boeren de theestruiken om ze tegen de zon te beschermen.",
        p2: "Dit is niet om de planten te kwellen, maar om ze te dwingen chlorofyl aan te maken, terwijl ze L-theanine opbouwen – verantwoordelijk voor de zoete, rustgevende smaak. Hoe completer de schaduw, hoe dieper het groen en hoe rijker het aroma.",
        p3: 'De stappen na de oogst zijn uiterst nauwkeurig. De blaadjes worden direct gestoomd om de oxidatie te stoppen. Na het drogen worden stelen en nerven verwijderd. Wat overblijft heet "Tencha", dat in steenmolens wordt gemalen.',
      },
      chapter3: {
        eyebrow: "Hoofdstuk 03",
        title: "De oude vrienden\naan je zijde",
        p1: "Bij de theeceremonie zijn de gereedschappen meer dan hulpmiddelen; ze zijn als oude vrienden met karakter. De Chawan (theekom) is de meest fascinerende: asymmetrisch en onregelmatig geglazuurd, want imperfectie is de essentie van schoonheid.",
        p2: "De Chasen is een bamboe klopper, met de hand gesneden uit één stuk bambu. Zijn fijne haren emulgeren het matchapoeder en het hete water in seconden tot een romig schuim. Een versleten chasen wordt verbrand in een ritueel om hem te danken.",
        p3: "De Chashaku is een eenvoudige, dunne bamboelepel. Hoewel hij alleen dient voor het portioneren van het poeder, wordt elke lepel met de hand gesneden door theemeesters.",
      },
      chapter4: {
        eyebrow: "Hoofdstuk 04",
        title: "Wa, Kei, Sei, Jaku,\neen leven in vier woorden",
        p1: "Sen no Rikyu vatte de geest van thee samen in vier principes: Wa (Harmonie) met de omgeving; Kei (Respect) voor alle dingen; Sei (Zuiverheid) van geest; en Jaku (Stilte) in de rust.",
        p2: 'Een boeiend concept is "Ichigo Ichie" – letterlijk "één tijd, één ontmoeting". Het betekent dat elke ontmoeting behandeld moet worden alsof het de laatste is. Die kom thee, dit moment, dit licht en deze temperatuur zullen zich nooit herhalen.',
        p3: "Dit idee resoneert in het moderne leven. Te midden van eindeloze meldingen herinnert de theeceremonie ons eraan: leg de telefoon weg en wees in het moment.",
      },
      chapter5: {
        eyebrow: "Hoofdstuk 05",
        title: "Matcha bereiden,\nniet zo moeilijk als je denkt",
        p1: "Velen denken dat de ceremonie ingewikkeld is en dure accessoires vereist. Dat is niet zo. Om te beginnen heb je alleen een Chawan, een Chasen, een Chashaku en matchapoeder van goede kwaliteit nodig.",
        p2: "Gebruik water met een temperatuur van 70 tot 80 °C; kokend water maakt de thee bitter. Verras het poeder eerst met wat water tot een pasta, giet dan de rest erbij. Klop de thee snel met de chasen in zigzagbewegingen.",
        p3: "De eerste poging zal misschien niet perfect zijn, maar het is een kwestie van oefenen. De theeceremonie zoekt niet de perfectie bij de eerste keer, maar het pad daarnaartoe.",
      },
    },
    final: {
      eyebrow: "Nu",
      title: "Ben je klaar?",
      p1: "Nu heb je vast een andere kijk op matcha gekregen. Het is niet zomaar een drankje, maar een eeuwenoude levenskunst.",
      p2: "Als volgende wacht een interactieve 3D-ervaring. Bij het naar beneden scrollen zie je de stappen van de bereiding op je eigen tempo.",
      button: "Start 3D-scène",
    },
    loader: {
      preparing: "Voorbereiden",
    },
    overlay: {
      ritual: "Ritueel",
      finalRecipe: "Recept",
      matcha: "Matcha",
      warmWater: "Warm water",
      waterTemp: "Temperatuur",
      back: "Terug naar start",
    },
    steps: {
      intro: {
        title: "Ichigo Ichie",
        body: "Laat de waan van de dag achter je en ervaar het ontstaan van een kom thee.",
      },
      powder: {
        eyebrow: "Stap 01",
        title: "Poeder toevoegen",
        body: "Fijn, groen poeder ligt in de zeef boven de kom en wacht tot het begint.",
      },
      sift: {
        eyebrow: "Stap 02",
        title: "Zeven",
        body: "Voor het opgieten wordt het poeder gezeefd. Dit zorgt later voor een fijn, romig schuim.",
      },
      water: {
        eyebrow: "Stap 03",
        title: "Water gieten",
        body: "Giet langzaam warm water van 75 °C erbij om het aroma te wekken zonder het poeder te verbranden.",
      },
      whisk: {
        eyebrow: "Stap 04",
        title: "Kloppen",
        body: "Klop de thee snel met de chasen in zigzagbewegingen tot er een fluweelzacht schuim ontstaat.",
      },
      finish: {
        title: "Jouw moment",
        body: "Dit is jouw matcha-ritueel. Vertraag en geniet van dit moment van rust en zoetheid.",
      },
    },
  },
  pl: {
    nav: {
      home: "Start",
      scene3d: "Scena 3D",
    },
    metadata: {
      title: "Matcha - Ichigo Ichie",
      description:
        "Czarka matchy, chwila w czasie. Podążaj za rytmem swojego oddechu i przewijania, aby doświadczyć medytacyjnego rytuału parzenia herbaty w immersyjnej, interaktywnej podróży 3D.",
    },
    header: {
      title: "Matcha",
    },
    hero: {
      eyebrow: "Rytuał koncentracji",
      title: "Obudź\nswoje zmysły",
      description:
        "W czasach wymagających szybkości matcha prosi nas o zwolnienie tempa. Nie da się przyspieszyć; pośpiech zepsułby smak. Przewiń w dół i poznaj historię tej herbaty.",
      scroll: "Przewiń w dół",
    },
    chapters: {
      chapter1: {
        eyebrow: "Rozdział 01",
        title: "Z Chin do Japonii,\npodróż herbaty",
        p1: "Historia matchy zaczyna się w czasach dynastii Tang. Wtedy w Chinach liście herbaty prasowano w kostki, mielono na proszek i mieszano z wodą. W 1191 roku japoński mnich Eisai przywiózł tę metodę i nasiona herbaty do kraju, sadząc je niedaleko Kioto.",
        p2: "W okresie Muromachi ceremonia zaczęła nabierać kształtu. Później Sen no Rikyu przekształcił picie herbaty z pokazu arystokratycznego bogactwa w praktykę duchową dostępną dla wszystkich, bez względu na status.",
        p3: "Filozofia ta stała się znana jako „Wabi-sabi” – poszukiwanie piękna w niedoskonałości i przemijalności. Asymetryczna czarka czy stara bambusowa łyżeczka to szczegóły, w których żyje dusza.",
      },
      chapter2: {
        eyebrow: "Rozdział 02",
        title: "Ta żywa zieleń,\njak powstaje?",
        p1: "Wielu zastanawia się, dlaczego matcha jest tak jasna i zielona. Za wszystkim stoi ciekawa technika rolnicza: na trzy lub cztery tygodnie przed zbiorem rolnicy zakrywają krzewy sieciami, aby chronić je przed słońcem.",
        p2: "Nie chodzi o męczenie roślin, ale o zmuszenie ich do produkcji chlorofilu i gromadzenia L-teaniny, która nadaje słodki i uspokajający smak. Im głębszy cień, tym ciemniejsza zieleń i bogatszy aromat.",
        p3: "Kolejne kroki po zbiorach są jeszcze delikatniejsze. Liście są natychmiast parowane, aby zatrzymać utlenianie. Po wysuszeniu usuwa się ogonki i łodyżki. To, co zostaje, nazywa się „Tencha”, którą miele się w kamiennych młynach.",
      },
      chapter3: {
        eyebrow: "Rozdział 03",
        title: "Starzy przyjaciele\nu Twego boku",
        p1: "W ceremonii herbacianej naczynia to coś więcej niż narzędzia; są jak starzy przyjaciele o własnym charakterze. Chawan (czarka) jest najbardziej zachwycający: asymetryczny, z nieregularnym szkliwem, gdyż niedoskonałość jest istotą piękna.",
        p2: "Chasen to miotełka z jednego kawałka bambusa. Jej drobne włókna emulsyfikują proszek i ciepłą wodę w sekundy w aksamitną pianę. Zużyty chasen pali się w rytuale podziękowania.",
        p3: "Chashaku to prosta bambusowa łyżeczka do proszku. Każdą łyżeczkę mistrzowie rzeźbią ręcznie i są przekazywane z pokolenia na pokolenie.",
      },
      chapter4: {
        eyebrow: "Rozdział 04",
        title: "Wa, Kei, Sei, Jaku,\nżycie w czterech słowach",
        p1: "Sen no Rikyu wyraził ducha herbaty w czterech pojęciach: Wa (Harmonia) z otoczeniem; Kei (Szacunek) do wszystkiego; Sei (Czystość) umysłu; i Jaku (Spokój) w ciszy.",
        p2: "Zachwycającym pojęciem jest „Ichigo Ichie” – dosłownie „jeden czas, jedno spotkanie”. Oznacza, że każde spotkanie powinno być traktowane jak ostatnie. Ta czarka herbaty, ten moment, światło i temperatura nigdy się nie powtórzą.",
        p3: "Ta myśl rezonuje również dzisiaj. W świecie pełnym powiadomień ceremonia przypomina nam: odłóż telefon i bądź w teraźniejszości.",
      },
      chapter5: {
        eyebrow: "Rozdział 05",
        title: "Przygotowanie matchy\njest łatwiejsze niż myślisz",
        p1: "Wielu uważa, że ceremonia jest skomplikowana i wymaga drogich naczyń. Tak nie jest. Na początek wystarczą tylko chawan, chasen, chashaku i dobrej jakości proszek matcha.",
        p2: "Używaj wody o temperaturze 70–80 °C; wrzątek sprawi, że herbata będzie gorzka. Najpierw rozetrzyj proszek z odrobiną wody na pastę, a potem dodaj resztę. Ubijaj miotełką ruchami w kształcie „W” lub „M”.",
        p3: "Pierwszy raz nie będzie idealny, ale to kwestia wprawy. Ceremonia nie ceni natychmiastowego rezultatu, ale drogę i uważność na szczegóły.",
      },
    },
    final: {
      eyebrow: "Teraz",
      title: "Czy jesteś gotów?",
      p1: "Teraz z pewnością masz inne spojrzenie na matchę. To nie tylko napój, ale stuletnia sztuka życia.",
      p2: "Następnie czeka Cię interaktywne doświadczenie 3D. Podczas przewijania w dół kroki przygotowania będą wizualizować się w Twoim tempie.",
      button: "Wejdź do sceny 3D",
    },
    loader: {
      preparing: "Przygotowanie",
    },
    overlay: {
      ritual: "Rytuał",
      finalRecipe: "Przepis",
      matcha: "Matcha",
      warmWater: "Ciepła woda",
      waterTemp: "Temperatura wody",
      back: "Powrót do startu",
    },
    steps: {
      intro: {
        title: "Ichigo Ichie",
        body: "Zostaw troski i spójrz na narodziny czarki herbaty w ciszy.",
      },
      powder: {
        eyebrow: "Krok 01",
        title: "Dodawanie proszku",
        body: "Zielony proszek leży w sitku nad czarką, bezszelestnie czekając na rozpoczęcie rytuału.",
      },
      sift: {
        eyebrow: "Krok 02",
        title: "Przesiewanie",
        body: "Przed dodaniem wody przesiej matchę. To zapewni aksamitną pianę bez grudek.",
      },
      water: {
        eyebrow: "Krok 03",
        title: "Wlewanie wody",
        body: "Powoli wlej wodę o temperaturze 75 °C, aby obudzić aromat i nie przypalić proszku.",
      },
      whisk: {
        eyebrow: "Krok 04",
        title: "Ubijanie",
        body: "Szybko ubijaj miotełką ruchami w kształcie „W” z pomocą chasenu, aż pojawi się aksamitna piana.",
      },
      finish: {
        title: "Twój moment",
        body: "To jest Twój rytuał matchy. Zwolnij i ciesz się tym momentem spokoju i słodyczy.",
      },
    },
  },
};
