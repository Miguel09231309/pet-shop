export interface WeightRecord {
  date: string;
  value: number;
}

export interface VaccinationRecord {
  id: string;
  name: string;
  date: string;
  status: 'completed' | 'pending';
  nextDueDate?: string;
}

export interface HealthRecord {
  id: string;
  date: string;
  title: string;
  description: string;
  doctor?: string;
}

export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed: string;
  age: string;
  gender: 'Macho' | 'Fêmea';
  photo: string;
  weightHistory: WeightRecord[];
  vaccinations: VaccinationRecord[];
  healthHistory: HealthRecord[];
}

export interface Product {
  id: string;
  name: string;
  category: 'ração' | 'brinquedos' | 'acessórios' | 'higiene' | 'farmácia';
  petType: 'all' | 'dog' | 'cat' | 'bird' | 'rabbit';
  price: number;
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  isPopular?: boolean;
  hasDiscount?: boolean;
  specs: { label: string; value: string }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ServiceAppointment {
  id: string;
  petId: string;
  serviceType: 'banho_tosa' | 'consulta_online' | 'consulta_presencial' | 'vacina';
  serviceName: string;
  date: string;
  time: string;
  extraNotes?: string;
  price: number;
  status: 'agendado' | 'concluido' | 'cancelado';
  providerName: string;
}

export interface PartnerClinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  services: string[];
  rating: number;
  openHours: string;
  coords: { x: number; y: number }; // percentage positions (10-90) for our mock interactive UI map
}

export interface DeliveryTracker {
  orderId: string;
  itemsCount: number;
  amount: number;
  status: 'confirmado' | 'preparando' | 'em_transito' | 'entregue';
  estimatedTime: string;
  steps: { label: string; time?: string; done: boolean }[];
  driverName?: string;
  driverPhone?: string;
  mapRouteProgress: number; // 0 to 100 for visual route alignment
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'health' | 'shopping' | 'booking' | 'social';
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Dicas' | 'Saúde' | 'Nutrição' | 'Comportamento';
  image: string;
  date: string;
  readingTime: string;
  likes: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  points: number;
  avatar: string;
}
