import type { SupportedLanguage } from "./language";

export interface ShadeCopy {
  shadeTitle: string;
  shadeDesc: string;
  shadeSunlight: string;
  shadeFull: string;
  chlorophyll: string;
  theanine: string;
  catechin: string;
  shadeStateSun: string;
  shadeStateMed: string;
  shadeStateFull: string;
}

export const shadeTranslations: Record<SupportedLanguage, ShadeCopy> = {
  ar: {
    shadeTitle: "محاكاة الزراعة المظللة",
    shadeDesc:
      "اسحب المؤشر لملاحظة التغيرات الكيميائية الدقيقة داخل ورقة الشاي أثناء التظليل.",
    shadeSunlight: "أشعة الشمس",
    shadeFull: "مظلل",
    chlorophyll: "الكلوروفيل",
    theanine: "الثيانين",
    catechin: "الكاتيكين",
    shadeStateSun:
      "تحت أشعة الشمس المباشرة، تصنع الورقة الكاتيكين للحماية من الأشعة فوق البنفسجية، مما يؤدي إلى طعم أكثر مرارة.",
    shadeStateMed:
      "مع زيادة التظليل، يبطئ النبات إنتاج الكاتيكين ويبدأ في تجميع الثيانين الحلو.",
    shadeStateFull:
      "في الظلام الدامس، يزداد الكلوروفيل ويرتفع الثيانين إلى ذروته، مما يخلق لون الماتشا الزمردي العميق والأومامي الحلو.",
  },
  cs: {
    shadeTitle: "Simulace pěstování ve stínu",
    shadeDesc:
      "Přetažením posuvníku sledujte jemné chemické změny uvnitř čajového lístku během procesu stínění.",
    shadeSunlight: "Sluneční svit",
    shadeFull: "Zastíněno",
    chlorophyll: "Chlorofyl",
    theanine: "L-theanin",
    catechin: "Katechiny",
    shadeStateSun:
      "Na přímém slunci lístek syntetizuje katechiny pro ochranu před UV zářením, což vede k trpčí chuti.",
    shadeStateMed:
      "S rostoucím stíněním rostlina zpomaluje produkci katechinů a začíná hromadit sladký L-theanin.",
    shadeStateFull:
      "V hluboké tmě rostlina zvyšuje produkci chlorofylu a L-theanin dosahuje vrcholu, což vytváří typickou smaragdovou barvu matcha a sladké umami.",
  },
  de: {
    shadeTitle: "Schattenanbau-Simulation",
    shadeDesc:
      "Ziehen Sie den Schieberegler, um die subtilen chemischen Veränderungen im Teeblatt während des Beschattungsprozesses zu beobachten.",
    shadeSunlight: "Sonnenlicht",
    shadeFull: "Beschattet",
    chlorophyll: "Chlorophyll",
    theanine: "L-Theanin",
    catechin: "Katechine",
    shadeStateSun:
      "Unter direktem Sonnenlicht synthetisiert das Blatt Katechine zum UV-Schutz, was zu einem herberen Geschmack führt.",
    shadeStateMed:
      "Mit zunehmender Beschattung verlangsamt die Pflanze die Katechinproduktion und reichert süßes L-Theanin an.",
    shadeStateFull:
      "In tiefer Dunkelheit steigt der Chlorophyllgehalt stark an und das L-Theanin erreicht seinen Höhepunkt. Dies verleiht dem Matcha sein tiefes Smaragdgrün und süßes Umami.",
  },
  en: {
    shadeTitle: "Shade Cultivation Simulation",
    shadeDesc:
      "Drag the slider to observe the subtle internal changes in the tea leaf during the shading process.",
    shadeSunlight: "Sunlight",
    shadeFull: "Shaded",
    chlorophyll: "Chlorophyll",
    theanine: "L-Theanine",
    catechin: "Catechins",
    shadeStateSun:
      "Under direct sunlight, the leaf synthesizes catechins for UV protection, resulting in a more astringent taste.",
    shadeStateMed:
      "As shading increases, the plant slows catechin production and begins accumulating sweet L-theanine.",
    shadeStateFull:
      "In profound darkness, the plant surges with chlorophyll and L-theanine peaks, creating matcha's signature deep emerald color and sweet umami.",
  },
  es: {
    shadeTitle: "Simulación de cultivo bajo sombra",
    shadeDesc:
      "Arrastre el deslizador para observar los sutiles cambios químicos en la hoja de té durante el proceso de sombreado.",
    shadeSunlight: "Luz solar",
    shadeFull: "Sombreado",
    chlorophyll: "Clorofila",
    theanine: "L-teanina",
    catechin: "Catequinas",
    shadeStateSun:
      "Bajo la luz solar directa, la hoja sintetiza catequinas para protegerse de los rayos UV, lo que resulta en un sabor más astringente.",
    shadeStateMed:
      "A medida que aumenta la sombra, la planta ralentiza la producción de catequinas y comienza a acumular L-teanina dulce.",
    shadeStateFull:
      "En la oscuridad profunda, la planta se llena de clorofila y la L-teanina alcanza su punto máximo, creando el color esmeralda característico del matcha y un dulce umami.",
  },
  fr: {
    shadeTitle: "Simulation de culture ombragée",
    shadeDesc:
      "Faites glisser le curseur pour observer les subtiles modifications chimiques de la feuille de thé pendant l'ombrage.",
    shadeSunlight: "Lumière",
    shadeFull: "Ombragé",
    chlorophyll: "Chlorophylle",
    theanine: "L-Théanine",
    catechin: "Catéchines",
    shadeStateSun:
      "Sous la lumière directe du soleil, la feuille synthétise des catéchines pour se protéger des UV, ce qui donne un goût plus astringent.",
    shadeStateMed:
      "À mesure que l'ombrage augmente, la plante ralentit la production de catéchines et commence à accumuler de la L-théanine douce.",
    shadeStateFull:
      "Dans l'obscurité profonde, la plante se gorge de chlorophylle et la L-théanine culmine, créant la couleur émeraude signature du matcha et un umami doux.",
  },
  hi: {
    shadeTitle: "छायादार खेती सिमुलेशन",
    shadeDesc:
      "छायांकन प्रक्रिया के दौरान चाय की पत्ती के भीतर होने वाले सूक्ष्म रासायनिक परिवर्तनों को देखने के लिए स्लाइडर को खींचें।",
    shadeSunlight: "धूप",
    shadeFull: "छायादार",
    chlorophyll: "क्लोरोफिल",
    theanine: "एल-थियानिन",
    catechin: "कैटेचिन",
    shadeStateSun:
      "सीधी धूप में, पत्ती यूवी सुरक्षा के लिए कैटेचिन का संश्लेषण करती है, जिसके परिणामस्वरूप स्वाद अधिक कसैला होता है।",
    shadeStateMed:
      "जैसे-जैसे छाया बढ़ती है, पौधा कैटेचिन का उत्पादन धीमा कर देता है और मीठे एल-थियानिन का संचय शुरू कर देता है।",
    shadeStateFull:
      "गहरे अंधेरे में, पौधा क्लोरोफिल से भर जाता है और एल-थियानिन चरम पर पहुंच जाता है, जिससे माचा का गहरा पन्ना रंग और मीठा उमामी स्वाद बनता है।",
  },
  hu: {
    shadeTitle: "Árnyékolt termesztés szimuláció",
    shadeDesc:
      "Húzza a csúszkát a tealevél árnyékolása során végbemenő finom kémiai változások megfigyeléséhez.",
    shadeSunlight: "Napfény",
    shadeFull: "Árnyékolt",
    chlorophyll: "Klorofill",
    theanine: "L-teanin",
    catechin: "Katechinek",
    shadeStateSun:
      "Közvetlen napfényben a levél katechineket szintetizál az UV-védelem érdekében, ami fanyarabb ízt eredményez.",
    shadeStateMed:
      "Az árnyékolás növelésével a növény lassítja a katechin termelést, és elkezdi felhalmozni az édes L-teanint.",
    shadeStateFull:
      "Mély sötétségben a növény klorofill-szintje megemelkedik és az L-teanin eléri a csúcsot, megteremtve a matcha jellegzetes mély smaragdzöld színét és édes umamiját.",
  },
  id: {
    shadeTitle: "Simulasi Budidaya Naungan",
    shadeDesc:
      "Geser slider untuk mengamati perubahan kimia halus di dalam daun teh selama proses menaungi.",
    shadeSunlight: "Sinar Matahari",
    shadeFull: "Ternaungi",
    chlorophyll: "Klorofil",
    theanine: "L-Teanin",
    catechin: "Katekin",
    shadeStateSun:
      "Di bawah sinar matahari langsung, daun mensintesis katekin untuk perlindungan UV, menghasilkan rasa yang lebih sepat.",
    shadeStateMed:
      "Seiring meningkatnya naungan, tanaman memperlambat produksi katekin dan mulai mengumpulkan L-teanin yang manis.",
    shadeStateFull:
      "Dalam kegelapan pekat, tanaman memproduksi klorofil secara melimpah dan L-teanin mencapai puncaknya, menghasilkan warna hijau zamrud khas matcha dan rasa umami yang manis.",
  },
  it: {
    shadeTitle: "Simulazione di coltivazione all'ombra",
    shadeDesc:
      "Trascina lo slider per osservare i sottili cambiamenti chimici all'interno della foglia di tè durante l'ombreggiamento.",
    shadeSunlight: "Luce solare",
    shadeFull: "Ombreggiato",
    chlorophyll: "Clorofilla",
    theanine: "L-teanina",
    catechin: "Catechine",
    shadeStateSun:
      "Sotto la luce diretta del sole, la foglia sintetizza catechine per la protezione UV, con un conseguente gusto più astringente.",
    shadeStateMed:
      "Con l'aumentare dell'ombra, la pianta rallenta la produzione di catechine e inizia ad accumulare la dolce L-teanina.",
    shadeStateFull:
      "Nel buio profondo, la pianta si carica di clorofilla e la L-teanina raggiunge il picco, creando il tipico colore verde smeraldo del matcha e un dolce umami.",
  },
  ja: {
    shadeTitle: "被覆栽培シミュレーション",
    shadeDesc:
      "スライダーを動かして、収穫前の「被覆（ひふく）」が茶葉の内部成分に与える繊細な変化を観察しましょう。",
    shadeSunlight: "日光",
    shadeFull: "遮光",
    chlorophyll: "クロロフィル",
    theanine: "テアニン",
    catechin: "カテキン",
    shadeStateSun:
      "直射日光の下では、茶葉は紫外線から身を守るためにカテキンを大量に合成し、渋みの強い味わいになります。",
    shadeStateMed:
      "遮光率が上がるにつれて、茶樹は日光の減少を感知し、カテキンの合成を抑え、甘み成分であるテアニンを蓄積し始めます。",
    shadeStateFull:
      "極限の暗闇の中で、茶樹は必死にクロロフィルを放出し、テアニンは頂点に達します。これが抹茶特有の深い翡翠色と極上の旨味を生み出します。",
  },
  ko: {
    shadeTitle: "차광 재배 시뮬레이션",
    shadeDesc:
      "슬라이더를 움직여 수확 전 '차광막 설치'가 찻잎 내부의 미세한 화학 성분에 미치는 영향을 관찰해 보세요.",
    shadeSunlight: "햇빛",
    shadeFull: "차광",
    chlorophyll: "엽록소",
    theanine: "테아닌",
    catechin: "카테킨",
    shadeStateSun:
      "충분한 햇빛 아래에서 찻잎은 자외선을 막기 위해 카테킨을 다량 합성하여 떫은맛이 강해집니다.",
    shadeStateMed:
      "차광률이 높아질수록 찻잎은 햇빛 감소를 감지하고 카테킨 합성을 늦추며, 단맛을 내는 테아닌을 축적하기 시작합니다.",
    shadeStateFull:
      "극도의 어둠 속에서 차나무는 엽록소를 방출하고 테아닌은 최고조에 달합니다. 이것이 말차 특유의 깊은 비취색과 극상의 감칠맛을 만들어냅니다.",
  },
  nl: {
    shadeTitle: "Schaduwteelt Simulatie",
    shadeDesc:
      "Sleep de schuifregelaar om de subtiele chemische veranderingen in het theeblad tijdens het schaduwproces te observeren.",
    shadeSunlight: "Zonlicht",
    shadeFull: "Schaduw",
    chlorophyll: "Bladgroen",
    theanine: "L-theanine",
    catechin: "Catechines",
    shadeStateSun:
      "Onder direct zonlicht synthetiseert het blad catechines for UV-bescherming, wat resulteert in een wrange smaak.",
    shadeStateMed:
      "Naarmate de schaduw toeneemt, vertraagt de plant de catechineproductie en begint deze zoete L-theanine op te hopen.",
    shadeStateFull:
      "In diepe duisternis produceert de plant veel bladgroen en bereikt L-theanine zijn piek, wat zorgt voor de diepe smaragdgroene kleur en zoete umami van matcha.",
  },
  pl: {
    shadeTitle: "Symulacja uprawy w cieniu",
    shadeDesc:
      "Przeciągnij suwak, aby zaobserwować subtelne zmiany chemiczne zachodzące w liściu herbaty podczas procesu zacieniania.",
    shadeSunlight: "Światło słoneczne",
    shadeFull: "Zacienienie",
    chlorophyll: "Chlorofil",
    theanine: "L-teanina",
    catechin: "Katechiny",
    shadeStateSun:
      "W pełnym słońcu liść syntetyzuje katechiny w celu ochrony przed promieniowaniem UV, co daje bardziej cierpki smak.",
    shadeStateMed:
      "W miarę wzrostu zacienienia roślina spowalnia produkcję katechin i zaczyna gromadzić słodką L-teaninę.",
    shadeStateFull:
      "W głębokim cieniu roślina intensywnie wytwarza chlorofil, a poziom L-teaniny osiąga szczyt, tworząc charakterystyczny głęboki szmaragdowy kolor matcha i słodkie umami.",
  },
  "pt-br": {
    shadeTitle: "Simulação de cultivo sob sombra",
    shadeDesc:
      "Arraste o controle deslizante para observar as sutis mudanças químicas dentro da folha de chá durante o sombreamento.",
    shadeSunlight: "Luz solar",
    shadeFull: "Sombreado",
    chlorophyll: "Clorofila",
    theanine: "L-teanina",
    catechin: "Catequinas",
    shadeStateSun:
      "Sob luz solar direta, a folha sintetiza catequinas para proteção UV, resultando em um sabor mais adstringente.",
    shadeStateMed:
      "À medida que o sombreamento aumenta, a planta retarda a produção de catequinas e começa a acumular a doce L-teanina.",
    shadeStateFull:
      "Na escuridão profunda, a planta produz muita clorofila e a L-teanina atinge o pico, criando a cor verde esmeralda característica do matcha e um doce umami.",
  },
  ru: {
    shadeTitle: "Симуляция теневого выращивания",
    shadeDesc:
      "Перемещайте ползунок, чтобы наблюдать тонкие химические изменения внутри чайного листа в процессе затенения.",
    shadeSunlight: "Солнечный свет",
    shadeFull: "Тень",
    chlorophyll: "Хлорофилл",
    theanine: "L-теанин",
    catechin: "Катехины",
    shadeStateSun:
      "Под прямыми солнечными лучами лист синтезирует катехины для защиты от ультрафиолета, что придает чаю более терпкий вкус.",
    shadeStateMed:
      "По мере увеличения тени растение замедляет выработку катехинов и начинает накапливать сладкий L-теанин.",
    shadeStateFull:
      "В глубокой тени растение вырабатывает много хлорофилла, а уровень L-теанина достигает пика, создавая характерный изумрудный цвет матча и сладкий вкус умами.",
  },
  tr: {
    shadeTitle: "Gölgede Yetiştirme Simülasyonu",
    shadeDesc:
      "Gölgeleme sürecinde çay yaprağındaki hassas kimyasal değişimleri gözlemlemek için kaydırıcıyı sürükleyin.",
    shadeSunlight: "Güneş Işığı",
    shadeFull: "Gölgeli",
    chlorophyll: "Klorofil",
    theanine: "L-Teanin",
    catechin: "Kateşinler",
    shadeStateSun:
      "Doğrudan güneş ışığı altında yaprak, UV koruması için kateşin sentezler ve bu da daha buruk bir tada yol açar.",
    shadeStateMed:
      "Gölgelendirme arttıkça bitki kateşin üretimini yavaşlatır ve tatlı L-teanin biriktirmeye başlar.",
    shadeStateFull:
      "Derin karanlıkta yaprak klorofille dolar ve L-teanin zirveye ulaşarak matcha'nın imza niteliğindeki zümrüt yeşili rengini ve tatlı umami tadını oluşturur.",
  },
  vi: {
    shadeTitle: "Mô phỏng canh tác trong bóng râm",
    shadeDesc:
      "Kéo thanh trượt để quan sát những thay đổi hóa học tinh tế bên trong lá trà trong quá trình che bóng.",
    shadeSunlight: "Ánh nắng",
    shadeFull: "Che bóng",
    chlorophyll: "Diệp lục",
    theanine: "L-Theanine",
    catechin: "Catechin",
    shadeStateSun:
      "Dưới ánh nắng trực tiếp, lá tổng hợp catechin để bảo vệ khỏi tia cực tím, dẫn đến vị chát hơn.",
    shadeStateMed:
      "Khi tăng độ che bóng, cây sẽ làm chậm sản xuất catechin và bắt đầu tích lũy L-theanine ngọt ngào.",
    shadeStateFull:
      "Trong bóng tối sâu thẳm, cây tăng cường diệp lục và L-theanine đạt đỉnh, tạo nên sắc xanh lục bảo đặc trưng của matcha và vị ngọt hậu umami.",
  },
  "zh-cn": {
    shadeTitle: "遮光栽培模拟",
    shadeDesc: "拖动滑块，观察采摘前「棚被遮光」对茶叶内部化学成分的幽微影响。",
    shadeSunlight: "日照",
    shadeFull: "遮光",
    chlorophyll: "叶绿素 (Chlorophyll)",
    theanine: "茶氨酸 (L-Theanine)",
    catechin: "茶多酚 (Catechins)",
    shadeStateSun:
      "充足日照下，茶叶大量合成茶多酚以抵御光照，茶汤因而带有较明显的苦涩味。",
    shadeStateMed:
      "随着遮光率提升，植物感受到日照减少，放缓茶多酚合成，并开始积累带来甘甜的茶氨酸。",
    shadeStateFull:
      "极度微光中，茶树拼命释放叶绿素，茶氨酸达到顶峰，造就了抹茶特有的深邃翠绿与极致回甘。",
  },
  "zh-tw": {
    shadeTitle: "遮光栽培模擬",
    shadeDesc: "拖曳游標，觀察採摘前「棚被遮光」對茶葉內部化學成分的幽微影響。",
    shadeSunlight: "日照",
    shadeFull: "遮光",
    chlorophyll: "葉綠素 (Chlorophyll)",
    theanine: "茶氨酸 (L-Theanine)",
    catechin: "茶多酚 (Catechins)",
    shadeStateSun:
      "充足日照下，茶葉大量合成茶多酚以抵禦光照，茶湯因而帶有較明顯的苦澀味。",
    shadeStateMed:
      "隨著遮光率提升，植物感受到日照減少，放緩茶多酚合成，並開始積累帶來甘甜的茶氨酸。",
    shadeStateFull:
      "極度微光中，茶樹拼命釋放葉綠素，茶氨酸達到頂峰，造就了抹茶獨有的深邃翠綠與極致回甘。",
  },
};
