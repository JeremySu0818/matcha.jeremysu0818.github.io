import type { LocaleCopy } from "../types";

export const ptBrCopy: LocaleCopy = {
  translation: {
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
      p2: "A seguir, propomos uma experiência interativa em 3D. Ao realizar os passos manualmente, você verá a preparação do chá no seu ritmo.",
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
      replay: "Fazer de novo",
      start: "Start Ritual",
      switcherHint: "Você também pode alternar para o modo 'Rolagem' aqui para aproveitar a animação 3D suave!",
    },
    sceneMode: {
      label: "Modo da cena",
      scroll: "Rolagem",
      manual: "Manual",
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
    manualTutorial: {
      sieveDrag: "Arraste a peneira sobre a tigela",
      sieveReady: "Clique com o botão direito para peneirar o matcha",
      sieveReturn: "Arraste a peneira para devolvê-la",
      kettleDrag: "Arraste a chaleira sobre a tigela",
      kettleReady: "Clique com o botão direito para despejar a água",
      kettleReturn: "Arraste a chaleira para devolvê-la",
      chasenDrag: "Arraste o chasen sobre a tigela",
      whisking: "Bata o matcha arrastando rapidamente para frente e para trás até formar espuma",
      chasenReturn: "Arraste o chasen de volta para o lugar",
      done: "Ritual concluído",
    },
    manualTutorialMobile: {
      sieveReady: "Toque e segure para peneirar o matcha",
      kettleReady: "Toque e segure para despejar a água",
    },
  },
  tools: {
    title: "Utensílios 3D Interativos",
    desc: "Clique nos utensílios abaixo para abrir o visualizador 3D. Gire e amplie para explorar de perto a riqueza dos detalhes.",
    clickToView: "Clique para ver o modelo 3D",
    close3D: "Fechar Visualização 3D",
    loading: "Carregando...",
    interactionHint: "Arraste para girar, role para ampliar",
    tools: [
      {
        id: "chawan",
        name: "Chawan (Tijela)",
        desc: "Uma tigela de cerâmica robusta. Sua forma assimétrica e esmalte rústico incorporam a beleza do wabi-sabi.",
        modelSrc: "/models/tea-bowl.glb",
        scale: 1,
      },
      {
        id: "chasen",
        name: "Chasen (Batedor)",
        desc: "Esculpido a partir de uma única peça de bambu em cerdas finas, é essencial para bater o matcha até obter uma espuma rica.",
        modelSrc: "/models/chasen.glb",
        scale: 1.2,
      },
      {
        id: "chashaku",
        name: "Chashaku (Colher)",
        desc: "Uma colher fina e curvada de bambu para medir o pó. Esculpida à mão com perfeição, representando foco e intenção.",
        modelSrc: "/models/chashaku.glb",
        scale: 1.5,
      },
    ],
  },
  shade: {
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
  calculator: {
      nav: "Preparar",
      eyebrow: "Receita personalizada",
      title: "Prepare seu matcha",
      description:
        "Ajuste a porção, intensidade e temperatura da água. Sua receita atualiza na hora.",
      teaType: "Tipo de chá",
      types: {
        koicha: "Koicha",
        usucha: "Usucha",
        latte: "Latte",
      },
      servingAndStrength: "Porção & intensidade",
      ratioSettings: "Ajustes de proporção",
      serving: "Porção",
      concentration: "Concentração",
      teaMilkRatio: "Proporção de chá e leite",
      temperatureSettings: "Temperatura da água",
      targetTemperature: "Temperatura desejada",
      coldTemperature: "Temperatura da água fria",
      hotTemperature: "Temperatura da água quente",
      recipe: "Receita",
      matchaPowder: "Matcha em pó",
      water: "Água",
      milk: "Leite",
      waterMix: "Mistura de água",
      hotWater: "Água quente",
      coldWater: "Água fria",
      light: "Suave",
      strong: "Forte",
      moreMilk: "Mais leite",
      moreTea: "Mais chá",
      reset: "Redefinir",
    },
};
