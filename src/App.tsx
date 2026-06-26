import React, { useState } from 'react';
import { Pet, ServiceAppointment, Badge, DeliveryTracker, UserProfile } from './types';
import { initialUserProfile, initialPets, initialBadges } from './data';
import PetProfiles from './components/PetProfiles';
import Store from './components/Store';
import Services from './components/Services';
import MapTracker from './components/MapTracker';
import Blog from './components/Blog';
import { 
  Trophy, User, Bell, Heart, Calendar, ShoppingBag, Navigation, BookOpen, 
  Sparkles, ShieldAlert, CheckCircle2, ChevronRight, Activity, Smile, Target, Trash2, Menu, X, LogOut 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Login from './components/Login';

export default function App() {
  // Global State Managers
  const [activeScreen, setActiveScreen] = useState<'dashboard' | 'pets' | 'services'>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('pet_club_logged_in') === 'true';
  });
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('pet_club_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return initialUserProfile;
  });
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [selectedPetId, setSelectedPetId] = useState<string>(initialPets[0]?.id || '');
  const [appointments, setAppointments] = useState<ServiceAppointment[]>([
    {
      id: "app-default-1",
      petId: "pet-1",
      serviceType: "consulta_presencial",
      serviceName: "Consulta Geral Presencial VIP",
      date: "2026-06-05",
      time: "10:30",
      price: 150.00,
      status: "agendado",
      providerName: "Dr. Roberto Neves"
    }
  ]);
  const [badges, setBadges] = useState<Badge[]>(initialBadges);
  const [deliveries, setDeliveries] = useState<DeliveryTracker[]>([]);
  const [activityLogs, setActivityLogs] = useState<string[]>([
    "Aplicativo inicializado com o perfil de Mariana Silva.",
    "Max e Luna sincronizados no prontuário digital local.",
    "Badge 'Membro da Guilda' desbloqueado (+50 XP)."
  ]);

  // System Push level logs
  const [notifications, setNotifications] = useState<string[]>([
    "Parabéns! Max completou a Vacina Antirrábica recente.",
    "Aviso: Dose pendente para Max (Gripe H1N1 Pet) até 15/06.",
    "Seja bem-vinda de volta às metas de cuidado premiadas!"
  ]);

  // Mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quick state modifiers
  const handleAddPet = (newPet: Pet) => {
    setPets(prev => [...prev, newPet]);
    setSelectedPetId(newPet.id);
    addToActivityLog(`Cadastrou o pet ${newPet.name} (${newPet.breed}).`);
  };

  const handleDeletePet = (petId: string) => {
    setPets(prev => prev.filter(p => p.id !== petId));
    addToActivityLog(`Removeu o cadastro do pet.`);
  };

  const handleAddWeight = (petId: string, record: { date: string; value: number }) => {
    setPets(prev => prev.map(p => {
      if (p.id === petId) {
        return {
          ...p,
          weightHistory: [...p.weightHistory, record]
        };
      }
      return p;
    }));
    addToActivityLog(`Registrou novo peso de ${record.value}kg para o pet.`);
  };

  const handleAddVaccine = (petId: string, record: any) => {
    setPets(prev => prev.map(p => {
      if (p.id === petId) {
        return {
          ...p,
          vaccinations: [...p.vaccinations, record]
        };
      }
      return p;
    }));
    addToActivityLog(`Inseriu agendamento de imunização (${record.name}) no prontuário.`);
  };

  const handleAddHealthRecord = (petId: string, record: any) => {
    setPets(prev => prev.map(p => {
      if (p.id === petId) {
        return {
          ...p,
          healthHistory: [...p.healthHistory, record]
        };
      }
      return p;
    }));
    addToActivityLog(`Adicionou observação de saúde: "${record.title}".`);
  };

  const handleAddAppointment = (appt: ServiceAppointment) => {
    setAppointments(prev => [...prev, appt]);
    // Also push into selected pet health logs as pending
    setPets(pats => pats.map(p => {
      if (p.id === appt.petId) {
        return {
          ...p,
          healthHistory: [
            ...p.healthHistory,
            {
              id: `health-booked-${appt.id}`,
              date: appt.date,
              title: `Reservado: ${appt.serviceName}`,
              description: `Serviço agendado às ${appt.time} conduzido por ${appt.providerName}. Valor: R$ ${appt.price.toFixed(2)}.`,
              doctor: appt.providerName
            }
          ]
        };
      }
      return p;
    }));
    // Award loyalty points for booking
    handleAddPoints(80);
  };

  const handleCancelAppointment = (apptId: string) => {
    setAppointments(prev => prev.filter(appt => appt.id !== apptId));
    setPets(pats => pats.map(p => ({
      ...p,
      healthHistory: p.healthHistory.filter(h => h.id !== `health-booked-${apptId}`)
    })));
    addToActivityLog(`Cancelou um agendamento de serviço.`);
  };

  const handleLoginSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsLoggedIn(true);
    localStorage.setItem('pet_club_logged_in', 'true');
    localStorage.setItem('pet_club_user_profile', JSON.stringify(profile));
    addToActivityLog(`Sessão iniciada como ${profile.name}.`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('pet_club_logged_in');
    localStorage.removeItem('pet_club_user_profile');
    addToActivityLog('Sessão encerrada.');
  };

  const handleAddPoints = (pts: number) => {
    setUserProfile(prev => ({
      ...prev,
      points: prev.points + pts
    }));
    addToActivityLog(`Acumulou +${pts} XP no programa de fidelidade.`);
  };

  const handleUnlockBadge = (badgeId: string) => {
    setBadges(prev => prev.map(b => {
      if (b.id === badgeId && !b.unlocked) {
        // Boost user xp points on unlock!
        handleAddPoints(b.points);
        // Dispatch notifications
        setNotifications(notifs => [...notifs, `Desbloqueou Conquista: ${b.title}! (+${b.points} XP)`]);
        return {
          ...b,
          unlocked: true,
          unlockedAt: new Date().toLocaleDateString('pt-BR')
        };
      }
      return b;
    }));
  };

  // Dispatch deliveries from checkout
  const handleAddDelivery = (order: { itemsCount: number; amount: number }) => {
    const newOrder: DeliveryTracker = {
      orderId: `${Math.floor(Math.random() * 9000 + 1000)}`,
      itemsCount: order.itemsCount,
      amount: order.amount,
      status: 'confirmado',
      estimatedTime: '25-35 min',
      steps: [
        { label: "Pagamento Aprovado", done: true },
        { label: "Preparando na boutique", done: false },
        { label: "Entregador à caminho", done: false },
        { label: "Concluído", done: false }
      ],
      driverName: "Márcio Silva",
      driverPhone: "(11) 99911-2233",
      mapRouteProgress: 10
    };

    setDeliveries(prev => [newOrder, ...prev]);
    setNotifications(notifs => [...notifs, `Boutique iniciou empacotamento do pedido #${newOrder.orderId}`]);
  };

  // Update cargo shipments state from tracker
  const handleTriggerDeliveryUpdate = (orderId: string) => {
    setDeliveries(prev => prev.map(d => {
      if (d.orderId === orderId) {
        let nextStatus: DeliveryTracker['status'] = 'confirmado';
        let progress = d.mapRouteProgress;

        if (d.status === 'confirmado') {
          nextStatus = 'preparando';
          progress = 40;
          addToActivityLog(`Pedido #${orderId} está sendo embalado na boutique Central.`);
        } else if (d.status === 'preparando') {
          nextStatus = 'em_transito';
          progress = 55;
          addToActivityLog(`Pedido #${orderId} despachado com entregador Márcio.`);
        } else if (d.status === 'em_transito') {
          if (progress < 90) {
            progress = 85; 
            addToActivityLog(`Entregador Márcio está virando a esquina com seus mimos.`);
            nextStatus = 'em_transito';
          } else {
            nextStatus = 'entregue';
            progress = 100;
            addToActivityLog(`Pedido #${orderId} entregue com sucesso!`);
            // Highlight notification
            setNotifications(no => [...no, `Objeto entregue na portaria/jardim!`]);
          }
        }

        const updatedSteps = d.steps.map((step, idx) => {
          if (nextStatus === 'confirmado' && idx === 0) return { ...step, done: true };
          if (nextStatus === 'preparando' && idx <= 1) return { ...step, done: true };
          if (nextStatus === 'em_transito' && idx <= 2) return { ...step, done: true };
          if (nextStatus === 'entregue') return { ...step, done: true };
          return step;
        });

        return {
          ...d,
          status: nextStatus,
          mapRouteProgress: progress,
          steps: updatedSteps
        };
      }
      return d;
    }));
  };

  const addToActivityLog = (log: string) => {
    setActivityLogs(prev => [log, ...prev].slice(0, 15));
  };

  const activePet = pets.find(p => p.id === selectedPetId) || pets[0];

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white" id="main-application-frame">
      {/* 1. Header Navigation Bar (Premium/Minimalist Look) */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo with neat neo-pastel theme */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveScreen('dashboard')}>
            <div className="bg-emerald-500 hover:bg-emerald-600 transition h-11 w-11 rounded-2xl flex items-center justify-center text-white font-extrabold shadow-sm scale-100 active:scale-95 duration-250">
              <span className="font-display text-base tracking-tighter">PET</span>
            </div>
            <div>
              <h1 className="text-sm font-extrabold font-display tracking-tight text-slate-800">PET CLUB</h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Agendamentos e Pets</p>
            </div>
          </div>

          {/* Desktop Navigation Link buttons */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => { setActiveScreen('dashboard'); setMobileMenuOpen(false); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition ${
                activeScreen === 'dashboard' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => { setActiveScreen('pets'); setMobileMenuOpen(false); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition ${
                activeScreen === 'pets' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Meus Pets
            </button>
            <button
              onClick={() => { setActiveScreen('services'); setMobileMenuOpen(false); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition ${
                activeScreen === 'services' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Agendamentos
            </button>
          </nav>

          {/* User profile */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-800 block leading-tight">{userProfile.name}</span>
              <span className="text-[10px] text-slate-400 font-medium">Tutor</span>
            </div>
            
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-100"
              referrerPolicy="no-referrer"
            />

            <button
              onClick={handleLogout}
              className="ml-1 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
              title="Sair da conta"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu toggle action */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            aria-label="Abrir menu"
            className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-slate-100 flex flex-col p-4 gap-2 z-30"
          >
            <button
              onClick={() => { setActiveScreen('dashboard'); setMobileMenuOpen(false); }}
              className={`py-2 px-3 rounded-lg text-xs font-bold text-left uppercase ${activeScreen === 'dashboard' ? 'bg-slate-950 text-white' : 'text-slate-600'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => { setActiveScreen('pets'); setMobileMenuOpen(false); }}
              className={`py-2 px-3 rounded-lg text-xs font-bold text-left uppercase ${activeScreen === 'pets' ? 'bg-slate-950 text-white' : 'text-slate-600'}`}
            >
              Meus Pets
            </button>
            <button
              onClick={() => { setActiveScreen('services'); setMobileMenuOpen(false); }}
              className={`py-2 px-3 rounded-lg text-xs font-bold text-left uppercase ${activeScreen === 'services' ? 'bg-slate-950 text-white' : 'text-slate-600'}`}
            >
              Agendamentos
            </button>

            {/* Mobile User state overview */}
            <div className="border-t pt-3 mt-2 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <img src={userProfile.avatar} alt={userProfile.name} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                <div>
                  <p className="font-bold text-slate-800">{userProfile.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Tutor</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-bold transition text-[11px]"
              >
                <LogOut className="w-3.5 h-3.5" /> Sair
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main content container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6" id="applet-viewport-mount">
        {activeScreen === 'dashboard' && (
          <div className="space-y-6 animate-fade-in" id="dashboard-tab-view">
            
            {/* Top Level visual welcome card */}
            <div className="bg-emerald-600 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
              <div className="space-y-2 z-10 max-w-2xl relative">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
                  Olá, {userProfile.name}!
                </h2>
                <p className="text-sm text-emerald-50 leading-relaxed max-w-lg">
                  Agende consultas, banhos e gerencie a saúde dos seus pets de forma simples.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
                  <button
                    onClick={() => setActiveScreen('services')}
                    className="bg-slate-950 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-slate-850 transition duration-200"
                  >
                    Agendar Novo Serviço
                  </button>
                  <button
                    onClick={() => setActiveScreen('pets')}
                    className="bg-white text-emerald-800 font-bold px-4 py-2.5 rounded-xl hover:bg-slate-100 transition duration-200"
                  >
                    Ver Meus Pets
                  </button>
                </div>
              </div>
              <div className="absolute right-[-10px] bottom-[-20px] w-48 h-48 bg-teal-400/25 rounded-full blur-2xl pointer-events-none" />
            </div>

            {/* Dashboard clean layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Side: Pets and Active Appointments */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Active Pet health highlights */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 space-y-4 shadow-xs">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-display">
                      <Smile className="text-emerald-500 w-5 h-5 fill-emerald-100" /> Pet Selecionado: {activePet?.name || 'Max'}
                    </h3>
                    <button
                      onClick={() => setActiveScreen('pets')}
                      className="text-xs text-emerald-600 hover:underline font-bold flex items-center gap-1"
                    >
                      Ver Detalhes &rarr;
                    </button>
                  </div>

                  {/* Tiny selector avatar pets tabs */}
                  <div className="flex gap-2">
                    {pets.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPetId(p.id)}
                        className={`flex items-center gap-2 p-1.5 pr-4 rounded-full border text-xs font-semibold transition-all ${
                          selectedPetId === p.id 
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        <img src={p.photo} alt={p.name} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                        <span>{p.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Active detailed metrics */}
                  {activePet && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {/* Weight widget */}
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Peso Atual</span>
                        <div className="py-2">
                          <span className="text-2xl font-extrabold font-display text-slate-800">
                            {activePet.weightHistory[activePet.weightHistory.length - 1]?.value || 0}
                          </span>
                          <span className="text-sm text-slate-600 font-semibold ml-0.5">kg</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Registrado em {activePet.weightHistory[activePet.weightHistory.length - 1]?.date}</p>
                      </div>

                      {/* Vaccinations summary */}
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Vacinas Aplicadas</span>
                        <div className="py-2">
                          <span className="text-2xl font-extrabold font-display text-emerald-800">
                            {activePet.vaccinations.filter(v => v.status === 'completed').length}
                          </span>
                          <span className="text-xs text-slate-600 font-bold ml-1">concluídas</span>
                        </div>
                        <p className="text-[10px] text-slate-600 font-semibold">
                          {activePet.vaccinations.some(v => v.status === 'pending') ? "⚠️ Vacinas pendentes" : "✓ Tudo em dia"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-display">
                      <Calendar className="w-5 h-5 text-emerald-500" /> Próximos Atendimentos Agendados
                    </h3>
                    <button
                      onClick={() => setActiveScreen('services')}
                      className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl font-bold transition duration-200"
                    >
                      + Agendar Novo
                    </button>
                  </div>

                  <div className="space-y-3">
                    {appointments.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 space-y-2">
                        <Calendar className="w-10 h-10 text-slate-200 mx-auto" />
                        <p className="text-xs font-semibold text-slate-500">Nenhum atendimento agendado na lista.</p>
                        <p className="text-[10px] text-slate-400">Marque consultas ou banhos clicando no botão acima.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {appointments.map((appt) => {
                          const pData = pets.find(p => p.id === appt.petId);
                          return (
                            <div key={appt.id} className="p-4 bg-slate-55 hover:bg-slate-100/70 border border-slate-150 rounded-2xl flex items-start justify-between gap-4 transition-all duration-200">
                              <div className="space-y-1">
                                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                  {appt.serviceType === 'banho_tosa' ? 'Banho e Tosa' : appt.serviceType === 'vacina' ? 'Vacina' : 'Consulta'}
                                </span>
                                <h4 className="font-bold text-slate-800 text-xs sm:text-sm leading-snug mt-1">{appt.serviceName}</h4>
                                <p className="text-[11px] text-slate-500">Pet: <span className="font-semibold text-slate-700">{pData?.name || 'Max'}</span></p>
                                <p className="text-[10px] text-slate-400">Clínico: {appt.providerName}</p>
                              </div>
                              <div className="flex flex-col items-end justify-between h-full min-h-[70px]">
                                <div className="text-right">
                                  <p className="font-extrabold text-slate-800 text-xs font-mono">{appt.date}</p>
                                  <p className="text-xs text-emerald-600 font-bold uppercase">{appt.time}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleCancelAppointment(appt.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Cancelar agendamento"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Side: Quick info and Contacts */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Emergency & Clinic Info */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest block font-display flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-500" /> Plantão Veterinário 24h
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Em caso de emergência ou sintomas graves, entre em contato direto com a clínica de plantão ou traga seu pet imediatamente.
                  </p>
                  
                  <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl space-y-2 text-xs">
                    <p className="font-bold text-rose-800">Hospital Veterinário Neon Pet 24h</p>
                    <p className="text-rose-700 text-[11px]">Rua Augusta, 850 - Jardins, São Paulo</p>
                    <p className="font-bold text-rose-800 font-mono mt-1 flex items-center gap-1">
                      📞 (11) 3214-5500
                    </p>
                  </div>

                  <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-3">
                    <p className="font-semibold text-slate-500">Horário de Atendimento Normal:</p>
                    <p className="mt-0.5">Segunda a Sábado, das 08h às 20h.</p>
                  </div>
                </div>

                {/* Quick Care Tips */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest block font-display">
                    Dica de Saúde Pet
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Mantenha as vacinas e a desparasitação em dia para garantir que seu amiguinho esteja protegido contra as principais viroses e verminoses caninas e felinas.
                  </p>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* VIEW 2: PET PROFILES MANAGER */}
        {activeScreen === 'pets' && (
          <PetProfiles 
            pets={pets}
            selectedPetId={selectedPetId}
            onSelectPet={setSelectedPetId}
            onAddPet={handleAddPet}
            onDeletePet={handleDeletePet}
            onAddWeight={handleAddWeight}
            onAddVaccine={handleAddVaccine}
            onAddHealthRecord={handleAddHealthRecord}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {/* VIEW 3: SCHEDULING SERVICES AND RESERVATIONS */}
        {activeScreen === 'services' && (
          <Services 
            pets={pets}
            selectedPetId={selectedPetId}
            appointments={appointments}
            onAddAppointment={handleAddAppointment}
            onCancelAppointment={handleCancelAppointment}
            onUnlockBadge={handleUnlockBadge}
            onAddToActivityLog={addToActivityLog}
          />
        )}

      </main>

      {/* 3. Footer and credentials details bar */}
      <footer className="bg-white border-t border-slate-100 py-6 px-6 mt-12 text-center text-xs text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Pet Club Premium S.A. Todos os direitos reservados. Projeto local persistente de Sandbox.</p>
          <div className="flex gap-4">
            <button onClick={() => alert("Termos de Serviço simulados.")} className="hover:underline">Termos</button>
            <button onClick={() => alert("Política de privacidade simulada.")} className="hover:underline">Privacidade</button>
            <button onClick={() => alert("Central de Atendimento 0800-PET-CLUB ativa.")} className="hover:underline font-bold text-emerald-600">Ajuda</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
