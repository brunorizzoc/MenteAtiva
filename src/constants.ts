
export enum ModuleId {
  TOQUE_LUZ = 'toque_luz',
  COR_IGUAL = 'cor_igual',
  MEMORIA_FOTOS = 'memoria_fotos',
  CAIXA_SEPARACAO = 'caixa_separacao',
  SEQUENCIA_LOGICA = 'sequencia_logica',
  MATEMATICA_FACIL = 'matematica_facil',
  BUSCA_VISUAL = 'busca_visual',
  STROOP_TEST = 'stroop_test',
}

export interface Player {
  nome: string;
  dataCriacao: string;
  ultimoLogin: string;
}

export interface ModuleProgress {
  nivel: number;
  pontos: number;
  totalJogadas: number;
  ultimoScore: number;
  erros: number;
}

export interface SessionRecord {
  timestamp: string;
  moduleId: string;
  points: number;
  errors?: number;
}

export interface GameState {
  jogador: Player | null;
  nivelGlobal: number;
  pontosTotal: number;
  diasConsecutivos: number;
  modulos: Record<string, ModuleProgress>;
  historico: SessionRecord[];
  configuracoes: {
    tema: 'claro' | 'escuro';
    vibracao: boolean;
    tamanhoFonte: 'normal' | 'grande';
  }
}

export const PALETA_CORES = [
  { nome: 'Vermelho', codigo: '#EF4444' },
  { nome: 'Azul', codigo: '#3B82F6' },
  { nome: 'Verde', codigo: '#10B981' },
  { nome: 'Amarelo', codigo: '#FBBF24' },
  { nome: 'Roxo', codigo: '#8B5CF6' },
  { nome: 'Laranja', codigo: '#F97316' },
  { nome: 'Rosa', codigo: '#EC4899' },
  { nome: 'Ciano', codigo: '#06B6D4' },
  { nome: 'Marrom', codigo: '#8B4513' },
  { nome: 'Cinza', codigo: '#6B7280' }
];

export const ITENS_CATEGORIAS = [
  // Comida
  { nome: 'Maçã', imagem: '🍎', categoria: 'comida' },
  { nome: 'Banana', imagem: '🍌', categoria: 'comida' },
  { nome: 'Uva', imagem: '🍇', categoria: 'comida' },
  { nome: 'Pão', imagem: '🍞', categoria: 'comida' },
  { nome: 'Pizza', imagem: '🍕', categoria: 'comida' },
  { nome: 'Cenoura', imagem: '🥕', categoria: 'comida' },
  { nome: 'Ovo', imagem: '🥚', categoria: 'comida' },
  { nome: 'Queijo', imagem: '🧀', categoria: 'comida' },
  // Animal
  { nome: 'Cachorro', imagem: '🐶', categoria: 'animal' },
  { nome: 'Gato', imagem: '🐱', categoria: 'animal' },
  { nome: 'Leão', imagem: '🦁', categoria: 'animal' },
  { nome: 'Peixe', imagem: '🐟', categoria: 'animal' },
  { nome: 'Pássaro', imagem: '🐦', categoria: 'animal' },
  { nome: 'Elefante', imagem: '🐘', categoria: 'animal' },
  { nome: 'Girafa', imagem: '🦒', categoria: 'animal' },
  { nome: 'Tartaruga', imagem: '🐢', categoria: 'animal' },
  // Transporte
  { nome: 'Carro', imagem: '🚗', categoria: 'transporte' },
  { nome: 'Avião', imagem: '✈️', categoria: 'transporte' },
  { nome: 'Barco', imagem: '🚢', categoria: 'transporte' },
  { nome: 'Bicicleta', imagem: '🚲', categoria: 'transporte' },
  { nome: 'Ônibus', imagem: '🚌', categoria: 'transporte' },
  { nome: 'Trem', imagem: '🚆', categoria: 'transporte' },
  { nome: 'Foguete', imagem: '🚀', categoria: 'transporte' },
  { nome: 'Moto', imagem: '🏍️', categoria: 'transporte' },
  // Objeto
  { nome: 'Livro', imagem: '📚', categoria: 'objeto' },
  { nome: 'Relógio', imagem: '⌚', categoria: 'objeto' },
  { nome: 'Lápis', imagem: '✏️', categoria: 'objeto' },
  { nome: 'Telefone', imagem: '📱', categoria: 'objeto' },
  { nome: 'Óculos', imagem: '👓', categoria: 'objeto' },
  { nome: 'Cadeira', imagem: '🪑', categoria: 'objeto' },
  { nome: 'Lâmpada', imagem: '💡', categoria: 'objeto' },
  { nome: 'Tesoura', imagem: '✂️', categoria: 'objeto' },
  { nome: 'Chave', imagem: '🔑', categoria: 'objeto' },
  { nome: 'Martelo', imagem: '🔨', categoria: 'objeto' },
  { nome: 'Guarda-chuva', imagem: '️☂️', categoria: 'objeto' },
  { nome: 'Mochila', imagem: '🎒', categoria: 'objeto' },
  // Lugar
  { nome: 'Casa', imagem: '🏠', categoria: 'lugar' },
  { nome: 'Escola', imagem: '🏫', categoria: 'lugar' },
  { nome: 'Parque', imagem: '🌳', categoria: 'lugar' },
  { nome: 'Praia', imagem: '🏖️', categoria: 'lugar' },
  { nome: 'Hospital', imagem: '🏥', categoria: 'lugar' },
  { nome: 'Igreja', imagem: '⛪', categoria: 'lugar' },
  { nome: 'Estádio', imagem: '🏟️', categoria: 'lugar' },
  { nome: 'Museu', imagem: '🏛️', categoria: 'lugar' },
  { nome: 'Mercado', imagem: '🛒', categoria: 'lugar' },
  { nome: 'Padaria', imagem: '🥖', categoria: 'lugar' },
  { nome: 'Cinematógrafo', imagem: '🎬', categoria: 'lugar' },
  { nome: 'Aeroporto', imagem: '✈️', categoria: 'lugar' },
  // Brinquedo
  { nome: 'Bola', imagem: '⚽', categoria: 'brinquedo' },
  { nome: 'Boneca', imagem: '🪆', categoria: 'brinquedo' },
  { nome: 'Pião', imagem: '🪀', categoria: 'brinquedo' },
  { nome: 'Urso', imagem: '🧸', categoria: 'brinquedo' },
  { nome: 'Lego', imagem: '🧱', categoria: 'brinquedo' },
  { nome: 'Pipa', imagem: '🪁', categoria: 'brinquedo' },
  { nome: 'Robô', imagem: '🤖', categoria: 'brinquedo' },
  { nome: 'Ioiô', imagem: '🪀', categoria: 'brinquedo' },
];

export const FOTOS_MEMORIA = [
  { id: 1, emoji: '☀️' },
  { id: 2, emoji: '🐕' },
  { id: 3, emoji: '🏠' },
  { id: 4, emoji: '🍎' },
  { id: 5, emoji: '🚗' },
  { id: 6, emoji: '🌻' },
  { id: 7, emoji: '🍦' },
  { id: 8, emoji: '🧸' },
  { id: 9, emoji: '🌙' },
  { id: 10, emoji: '🦋' },
  { id: 11, emoji: '🎈' },
  { id: 12, emoji: '🍉' },
];
