import { Pet, Product, PartnerClinic, Badge, BlogPost, UserProfile } from './types';

// Default User Profile
export const initialUserProfile: UserProfile = {
  name: "Mariana Silva",
  email: "mariana.silva@petmail.com",
  phone: "(11) 98765-4321",
  address: "Av. Paulista, 1200 - São Paulo, SP",
  points: 120, // Initial loyalty points
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
};

// Initial Pets
export const initialPets: Pet[] = [
  {
    id: "pet-1",
    name: "Max",
    type: "dog",
    breed: "Golden Retriever",
    age: "2 anos e 3 meses",
    gender: "Macho",
    photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400",
    weightHistory: [
      { date: "Jan 2026", value: 28.5 },
      { date: "Mao 2026", value: 30.2 },
      { date: "Abr 2026", value: 31.0 },
      { date: "Mai 2026", value: 31.8 }
    ],
    vaccinations: [
      { id: "vac-1", name: "Vacina Antirrábica", date: "2026-03-10", status: "completed", nextDueDate: "2027-03-10" },
      { id: "vac-2", name: "Múltipla V10", date: "2026-04-15", status: "completed", nextDueDate: "2027-04-15" },
      { id: "vac-3", name: "Vacina de Gripe H1N1 Pet", date: "2026-05-20", status: "pending", nextDueDate: "2026-06-15" }
    ],
    healthHistory: [
      { id: "health-1", date: "2026-04-15", title: "Check-up Anual", description: "Max foi considerado em excelente estado físico. Peso ideal e ótima pelagem.", doctor: "Dr. Roberto Neves" },
      { id: "health-2", date: "2026-05-10", title: "Limpeza Dentária", description: "Procedimento preventivo realizado para remoção suave de tártaro inicial.", doctor: "Dra. Elza Mendes" }
    ]
  },
  {
    id: "pet-2",
    name: "Luna",
    type: "cat",
    breed: "Siamês",
    age: "1 ano",
    gender: "Fêmea",
    photo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400",
    weightHistory: [
      { date: "Fev 2026", value: 3.8 },
      { date: "Abr 2026", value: 4.0 },
      { date: "Mai 2026", value: 4.2 }
    ],
    vaccinations: [
      { id: "vac-4", name: "Tríplice Felina F3", date: "2026-02-18", status: "completed", nextDueDate: "2027-02-18" },
      { id: "vac-5", name: "Vacina Quádrupla Felina", date: "2026-05-01", status: "completed", nextDueDate: "2027-05-01" }
    ],
    healthHistory: [
      { id: "health-3", date: "2026-05-01", title: "Avaliação Nutricional", description: "Ajuste na quantidade diária de ração para manter o peso estável na fase adulta.", doctor: "Dra. Elza Mendes" }
    ]
  }
];

// High Quality Catalog Products
export const catalogProducts: Product[] = [
  {
    id: "prod-1",
    name: "Ração Premium Gourmet Cães Adultos",
    category: "ração",
    petType: "dog",
    price: 189.90,
    oldPrice: 219.00,
    rating: 4.9,
    reviewsCount: 142,
    image: "https://images.unsplash.com/photo-1589723930112-f8c21e27a9a0?auto=format&fit=crop&q=80&w=400",
    description: "Nutrição super premium balanceada para cães de médio e grande porte. Sem corantes artificiais e enriquecida com minerais e colágeno para articulações fortes.",
    isPopular: true,
    hasDiscount: true,
    specs: [
      { label: "Peso", value: "10kg" },
      { label: "Sabor", value: "Salmão e Batata Doce" },
      { label: "Idade", value: "Adultos" }
    ]
  },
  {
    id: "prod-2",
    name: "Arranhador Premium de Parede Castle Cats",
    category: "acessórios",
    petType: "cat",
    price: 124.50,
    rating: 4.8,
    reviewsCount: 96,
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&q=80&w=400",
    description: "O protetor definitivo para seus sofás! Arranhador em sisal natural com base de alta resistência e brinquedo acoplado com efeito catnip.",
    specs: [
      { label: "Material", value: "Madeira e Sisal" },
      { label: "Medidas", value: "65cm x 30cm" },
      { label: "Instalação", value: "Fácil fixação por parafusos" }
    ]
  },
  {
    id: "prod-3",
    name: "Bolinha de Neon Ultra-Luminosa Interativa",
    category: "brinquedos",
    petType: "all",
    price: 29.90,
    oldPrice: 39.90,
    rating: 4.7,
    reviewsCount: 220,
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=400",
    description: "Brinquedo de alta durabilidade feito com material atóxico resistente que brilha no escuro. Ideal para sessões de brincadeiras noturnas divertidas.",
    hasDiscount: true,
    specs: [
      { label: "Material", value: "Borracha Termoplástica" },
      { label: "Tamanho", value: "Ø 7cm" },
      { label: "Característica", value: "Brilha no Escuro (Fluorescente)" }
    ]
  },
  {
    id: "prod-4",
    name: "Shampoo Hipoalergênico Aroma Lavanda & Mel",
    category: "higiene",
    petType: "all",
    price: 45.00,
    rating: 4.6,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=400",
    description: "Formulado para cães e gatos com peles delicadas e sensíveis. pH balanceado e ativos hidratantes de aveia com óleo essencial de lavanda pura relaxante.",
    specs: [
      { label: "Volume", value: "500ml" },
      { label: "Fragrância", value: "Lavanda e Aveia" },
      { label: "Indicação", value: "Peles sensíveis ou propensas a alergias" }
    ]
  },
  {
    id: "prod-5",
    name: "Kit Suplemento Vitamínico Vitalidade Sênior",
    category: "farmácia",
    petType: "dog",
    price: 79.90,
    rating: 4.9,
    reviewsCount: 54,
    image: "https://images.unsplash.com/photo-1607619056574-7b8f30413736?auto=format&fit=crop&q=80&w=400",
    description: "Suplemento alimentar com ômega 3, condroitina e glucosamina ideal para cães idosos que necessitam recuperar a vitalidade e proteger as articulações.",
    isPopular: true,
    specs: [
      { label: "Formato", value: "Tabletes mastigáveis" },
      { label: "Quantidade", value: "60 tabletes" },
      { label: "Administração", value: "Via oral diário" }
    ]
  },
  {
    id: "prod-6",
    name: "Ração Premium coelhos e pequenos roedores",
    category: "ração",
    petType: "rabbit",
    price: 54.90,
    oldPrice: 65.00,
    rating: 4.8,
    reviewsCount: 42,
    image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=400",
    description: "Seleta premium de alfafa desidratada combinada com sementes nobres e grãos integrais enriquecidos com vitamina C natural.",
    hasDiscount: true,
    specs: [
      { label: "Peso", value: "1.5kg" },
      { label: "Componentes", value: "Alfafa, Milho e Cenoura Desidratada" },
      { label: "Indicado para", value: "Coelhos e Porquinhos da Índia" }
    ]
  },
  {
    id: "prod-7",
    name: "Guia Retrátil Neon Confort Soft Grip",
    category: "acessórios",
    petType: "dog",
    price: 99.00,
    rating: 4.5,
    reviewsCount: 112,
    image: "https://images.unsplash.com/photo-1541599540903-216a46ca1bf0?auto=format&fit=crop&q=80&w=400",
    description: "Guia retrátil com empunhadura anatômica macia e fita refletora neon que garante segurança total em passeios com pouca iluminação.",
    specs: [
      { label: "Comprimento", value: "5 metros" },
      { label: "Suporte", value: "Até 25kg" },
      { label: "Adicional", value: "Acabamento refletivo neon" }
    ]
  },
  {
    id: "prod-8",
    name: "Brinquedo Kit Ratinho Mecânico com Corda (x3)",
    category: "brinquedos",
    petType: "cat",
    price: 35.00,
    rating: 4.7,
    reviewsCount: 75,
    image: "https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?auto=format&fit=crop&q=80&w=400",
    description: "Kit com 3 ratinhos com sistema de engrenagem por corda de alta velocidade. Desperta o instinto natural de caça de felinos de qualquer idade.",
    specs: [
      { label: "Unidades", value: "3 ratinhos de cores sortidas" },
      { label: "Mecanismo", value: "Corda manual de fricção" },
      { label: "Material", value: "Tecido pelúcia com feltro seguro" }
    ]
  }
];

// Interactive Map Clinic Partners
export const partnerClinics: PartnerClinic[] = [
  {
    id: "clinic-1",
    name: "Hospital Veterinário Neon Pet 24h",
    address: "Rua Augusta, 850 - Jardins, São Paulo",
    phone: "(11) 3214-5500",
    services: ["Consultas presenciais", "Internação", "Vacinas", "Exames laboratoriais"],
    rating: 4.9,
    openHours: "Aberto 24 Horas",
    coords: { x: 35, y: 40 }
  },
  {
    id: "clinic-2",
    name: "Centro de Estética & Spa Felino e Canino",
    address: "Alameda Lorena, 1420 - Jardins, São Paulo",
    phone: "(11) 3088-1240",
    services: ["Banho e Tosa premium", "Hidratação de Pelagem", "Corte de unhas"],
    rating: 4.8,
    openHours: "08:00 às 19:00",
    coords: { x: 55, y: 25 }
  },
  {
    id: "clinic-3",
    name: "Clínica Veterinária Amigo Pastel",
    address: "Av. Brigadeiro Luís Antônio, 2200 - Centro",
    phone: "(11) 3456-7890",
    services: ["Consultas presença/online", "Farmácia veterinária", "Check-ups"],
    rating: 4.7,
    openHours: "09:00 às 18:00",
    coords: { x: 70, y: 65 }
  },
  {
    id: "clinic-4",
    name: "Clínica Pet Park Ibirapuera",
    address: "Av. República do Líbano, 510 - Moema",
    phone: "(11) 5055-6677",
    services: ["Consultas presenciais", "Vacinação express", "Fisioterapia"],
    rating: 4.9,
    openHours: "08:00 às 20:00",
    coords: { x: 20, y: 75 }
  }
];

// Loyalty badges & gamification
export const initialBadges: Badge[] = [
  {
    id: "badge-1",
    title: "Membro da Guilda",
    description: "Criou o primeiro perfil de pet no aplicativo",
    iconName: "Heart",
    points: 50,
    unlocked: true,
    unlockedAt: "28/05/2026",
    category: "social"
  },
  {
    id: "badge-2",
    title: "Super Protetor",
    description: "Completou uma vacinação programada e registrada",
    iconName: "Shield",
    points: 100,
    unlocked: true,
    unlockedAt: "28/05/2026",
    category: "health"
  },
  {
    id: "badge-3",
    title: "Investidor de Carinho",
    description: "Realizou sua primeira compra de ração gourmet premium",
    iconName: "ShoppingBag",
    points: 80,
    unlocked: false,
    category: "shopping"
  },
  {
    id: "badge-4",
    title: "Doador de Mimos",
    description: "Iniciou um agendamento de Banho e Tosa",
    iconName: "Sparkles",
    points: 60,
    unlocked: false,
    category: "booking"
  },
  {
    id: "badge-5",
    title: "Mestre da Saúde",
    description: "Completou o histórico de peso de 3 meses para qualquer pet",
    iconName: "Award",
    points: 150,
    unlocked: false,
    category: "health"
  }
];

// Blog Care Tips Posts
export const blogPosts: BlogPost[] = [
  {
    id: "post-1",
    title: "Como manter a hidratação dos cães e gatos em dias frios",
    summary: "Descubra por que a ingestão de água costuma cair na estação fria e aprenda métodos interativos de incentivo para evitar problemas renais.",
    category: "Saúde",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400",
    date: "24 Mai 2026",
    readingTime: "4 min",
    likes: 45,
    content: "No outono e inverno, os cães e gatos naturalmente gastam menos energia brincando e reduzem a ingestão espontânea de água. Isso pode resultar em forte aumento no risco de cálculos urinários e desidratação branda crônica. Algumas ótimas táticas para estimular o consumo são:\n\n1. Fornecer fontes de água corrente (chafarizes fluídos atraem a atenção imediata de gatos).\n2. Adicionar sachês nutritivos ou caldos cozidos de ossos de boi sem sal.\n3. Distribuir múltiplos potes de louça ou inox de água ultra-fresca pela residência.\n4. Oferecer pedrinhas de gelo aromatizadas com hortelã ou sachê diluído para brincarem."
  },
  {
    id: "post-2",
    title: "Guia definitivo de vacinação essencial preventiva para filhotes",
    summary: "Seu primeiro cachorrinho ou gatinho novo em casa? Conheça as vacinas prioritárias de início de vida para manter vírus de alta periculosidade afastados.",
    category: "Dicas",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=400",
    date: "18 Mai 2026",
    readingTime: "6 min",
    likes: 82,
    content: "Adotar um filhote é uma jornada mágica repleta de lambidas e alegria. No entanto, o sistema imunológico deles ainda é frágil e indefeso. A vacinação deve começar rigorosamente aos 45 dias de idade com a vacina V8 ou V10 para cães (contra cinomose, parvovirose e hepatite infecciosa), repetindo em doses com intervalos de 21 dias.\n\nPara gatos, a V3, V4 ou V5 previne contra clamidiose, panleucopenia e leucemia felina. Por fim, a partir dos 4 meses de vida, ambos os filhotes devem receber obrigatoriamente a vacina Antirrábica contra a raiva, vírus infeccioso incurável de transmissão aos humanos."
  },
  {
    id: "post-3",
    title: "Comportamento animal: O enriquecimento ambiental alivia o tédio",
    summary: "Passear é excelente, mas tornar seu próprio lar um playground de soluções e estímulos de farejar melhora drasticamente a paz animal.",
    category: "Comportamento",
    image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&q=80&w=400",
    date: "12 Mai 2026",
    readingTime: "5 min",
    likes: 104,
    content: "Animais entediados frequentemente desenvolvem hábitos comportamentais destrutivos, como morder sofás, cavar intensamente o jardim ou se lamberem excessivamente devido à ansiedade. O enriquecimento ambiental sugere dar finalidades ativas aos instintos:\n\n1. Enriquecimento Cognitivo: Ofereça brinquedos de quebra-cabeça que liberam petiscos somente após manipulação.\n2. Enriquecimento Sensorial: Use fragrâncias ou brinquedos sonoros para atrair a curiosidade investigativa.\n3. Enriquecimento Físico: Instale degraus elevados, prateleiras de escalada para felinos ou caixas com buracos de escavação segura."
  }
];
