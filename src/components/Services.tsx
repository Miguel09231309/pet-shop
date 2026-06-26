import React, { useState } from 'react';
import { Pet, ServiceAppointment } from '../types';
import { Calendar, Clock, Smile, Stethoscope, Scissors, Syringe, Sparkles, CheckCircle2, ShieldCheck, Heart, User, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ServicesProps {
  pets: Pet[];
  selectedPetId: string;
  appointments: ServiceAppointment[];
  onAddAppointment: (appointment: ServiceAppointment) => void;
  onCancelAppointment: (id: string) => void;
  onUnlockBadge: (badgeId: string) => void;
  onAddToActivityLog: (log: string) => void;
}

const SERVICE_TYPES = [
  {
    type: 'banho_tosa' as const,
    name: 'Banho & Tosa Estética Premium',
    price: 85.00,
    duration: '1h 30m',
    icon: Scissors,
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-400',
    iconColor: 'bg-emerald-100 text-emerald-700',
    description: 'Higienização profunda com sabão vegano hipoalergênico, corte de unhas, limpeza auricular e secagem morna escovada tranquila.',
    providers: ['Thiago Lima (Esteticista Sênior)', 'Regina Castro (Especialista em Spitz e Poodles)']
  },
  {
    type: 'consulta_online' as const,
    name: 'Telemedicina Veterinária Prime',
    price: 110.00,
    duration: '35m',
    icon: Stethoscope,
    color: 'bg-sky-50 text-sky-800 border-sky-200 hover:border-sky-400',
    iconColor: 'bg-sky-100 text-sky-700',
    description: 'Videoconsulta instantânea para orientações de comportamento, pele, triagem de sintomas de emergência e prescrições médicas digitais.',
    providers: ['Dra. Elza Mendes (Clínica Médica e Felinos)', 'Dr. Alan Torres (Nutricionista Canino)']
  },
  {
    type: 'consulta_presencial' as const,
    name: 'Consulta Geral Presencial VIP',
    price: 150.00,
    duration: '50m',
    icon: Heart,
    color: 'bg-amber-50 text-amber-805 border-amber-200 hover:border-amber-400',
    iconColor: 'bg-amber-100 text-amber-700',
    description: 'Diagnóstico físico minucioso em clínica parceira equipada com ultrassom, aferição de pressão sanguínea, batimentos cardíacos e orientações.',
    providers: ['Dr. Roberto Neves (Hospital 24h)', 'Dra. Elza Mendes (Unidade Ibirapuera)']
  },
  {
    type: 'vacina' as const,
    name: 'Imunização & Vacina Express',
    price: 65.00,
    duration: '15m',
    icon: Syringe,
    color: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200 hover:border-fuchsia-400',
    iconColor: 'bg-fuchsia-100 text-fuchsia-700',
    description: 'Administração sem estresse de imunizantes essenciais (V10, Antirrábica, Tríplice felina) com atestado vacinal digital assinado e brinde pet.',
    providers: ['Enfermeira Júlia Reis', 'Dr. Roberto Neves']
  }
];

const TIME_SLOTS = [
  "09:00", "10:30", "12:00", "14:00", "15:30", "17:00"
];

export default function Services({
  pets,
  selectedPetId,
  appointments,
  onAddAppointment,
  onCancelAppointment,
  onUnlockBadge,
  onAddToActivityLog
}: ServicesProps) {
  // Scheduling states
  const [activeService, setActiveService] = useState<typeof SERVICE_TYPES[0]>(SERVICE_TYPES[0]);
  const [selectedPet, setSelectedPet] = useState<string>(selectedPetId || (pets[0]?.id || ''));
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('14:00');
  const [selectedProvider, setSelectedProvider] = useState<string>(activeService.providers[0]);
  const [extraInstructions, setExtraInstructions] = useState<string>('');

  // Confirmation modals
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookedDetails, setBookedDetails] = useState<ServiceAppointment | null>(null);

  const handleSelectService = (service: typeof SERVICE_TYPES[0]) => {
    setActiveService(service);
    setSelectedProvider(service.providers[0]);
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet || !selectedDate || !selectedTime) {
      alert("Por favor selecione a data e o pet para o agendamento.");
      return;
    }

    const newAppointment: ServiceAppointment = {
      id: `app-${Date.now()}`,
      petId: selectedPet,
      serviceType: activeService.type,
      serviceName: activeService.name,
      date: selectedDate,
      time: selectedTime,
      extraNotes: extraInstructions || undefined,
      price: activeService.price,
      status: 'agendado',
      providerName: selectedProvider
    };

    onAddAppointment(newAppointment);
    setBookedDetails(newAppointment);

    // Activity logging
    const targetPet = pets.find(p => p.id === selectedPet);
    onAddToActivityLog(`Agendou ${activeService.name} para ${targetPet?.name || 'seu pet'} em ${selectedDate} às ${selectedTime}`);

    // Trigger Gamification accomplishments
    if (activeService.type === 'banho_tosa') {
      onUnlockBadge("badge-4"); // Doador de Mimos
    } else {
      onUnlockBadge("badge-2"); // Health Badge
    }

    // Modal view triggers
    setShowConfirmModal(true);

    // Clear notes field
    setExtraInstructions('');
  };

  const currentPetData = pets.find(p => p.id === selectedPet) || pets[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6" id="services-scheduler-container">
      {/* Header and loyalty badge notification info */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-1.5">
            <Calendar className="w-5 h-5 text-emerald-500" /> Agendamento de Serviços de Saúde & Estética
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Escolha o atendimento estético ou consultas médicas. Todos os profissionais são filiados ao conselho de veterinária.
          </p>
        </div>

        <div className="bg-amber-50 text-amber-805 px-3.5 py-1.5 rounded-2xl text-xs font-bold border border-amber-200 flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" /> 100% de carinho assegurado
        </div>
      </div>

      {/* Services Grid configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Columns: Services Selector Cards */}
        <div className="md:col-span-2 space-y-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">1. Selecione o Mimo ou Atendimento</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SERVICE_TYPES.map((service) => {
              const IconComp = service.icon;
              const isSelected = activeService.type === service.type;
              return (
                <div
                  key={service.type}
                  onClick={() => handleSelectService(service)}
                  className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-4 relative group ${
                    isSelected
                      ? 'border-emerald-500 bg-white scale-102 shadow-xs'
                      : 'border-slate-150 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-2xl ${service.iconColor}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      
                      <span className="text-xs font-bold font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                        R$ {service.price.toFixed(2)}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-800 mt-1 leading-snug group-hover:text-emerald-700 transition">
                        {service.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-3">{service.description}</p>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 flex items-center justify-between border-t pt-2 mt-2 font-semibold">
                    <span>Tempo sugerido: {service.duration}</span>
                    <span className="text-emerald-600 font-bold group-hover:underline flex items-center">
                      Agendar &rarr;
                    </span>
                  </div>

                  {/* Aesthetic dot */}
                  {isSelected && (
                    <div className="absolute right-3 top-3 w-3 h-3 bg-emerald-500 rounded-full animate-ping pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Active selected service highlights specs */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150 space-y-2 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Instruções Importantes</span>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Caso escolha Banho, traga brinquedos favoritos para acalmar filhotes.</li>
              <li>A Telemedicina é realizada dentro da nossa plataforma segura via videochamada interativa integrada.</li>
              <li>Vacinas necessitam de avaliação prévia de temperatura, inclusa sem custo na aplicação.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Time/Date and Pet Picker Picker Form */}
        <div className="md:col-span-1 bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
          <form onSubmit={handleBookSubmit} className="space-y-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest block">2. Personalize o Agendamento</h3>

            {/* Pet picker dropdown */}
            <div className="space-y-1.5">
              <label htmlFor="pet-picker-select" className="text-xs font-bold text-slate-600 block">Qual pet irá receber o cuidado?</label>
              <select
                id="pet-picker-select"
                value={selectedPet}
                onChange={(e) => setSelectedPet(e.target.value)}
                className="w-full text-xs border border-slate-200 bg-white rounded-xl p-2.5 focus:outline-emerald-500 font-semibold"
                required
              >
                <option value="">Selecione um Pet</option>
                {pets.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.breed})</option>
                ))}
              </select>
            </div>

            {/* Provider selection */}
            <div className="space-y-1.5">
              <label htmlFor="provider-picker-select" className="text-xs font-bold text-slate-600 block">Profissional de Preferência</label>
              <select
                id="provider-picker-select"
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full text-xs border border-slate-200 bg-white rounded-xl p-2.5 focus:outline-emerald-500 font-semibold"
                required
              >
                {activeService.providers.map((p, i) => (
                  <option key={i} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Date selection picker */}
            <div className="space-y-1.5">
              <label htmlFor="date-picker-input" className="text-xs font-bold text-slate-600 block">Selecione o Dia</label>
              <div className="relative">
                <input
                  id="date-picker-input"
                  type="date"
                  min="2026-05-28"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full text-xs border border-slate-205 rounded-xl p-3 focus:outline-emerald-500 bg-slate-50 font-semibold"
                  required
                />
              </div>
            </div>

            {/* Hour slot selection picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">Horário Disponível</label>
              <div className="grid grid-cols-3 gap-1.5">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                      selectedTime === time
                        ? 'bg-slate-900 text-white border-slate-905 scale-102'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Extra instructions text */}
            <div className="space-y-1.5">
              <label htmlFor="extra-instructions-textarea" className="text-xs font-bold text-slate-600 block">Instruções especiais ou sintomas</label>
              <textarea
                id="extra-instructions-textarea"
                placeholder="ex: Pipoca tem medo de secador de cabelo, usar toalha macia / Max possui alergia a spray perfumado..."
                rows={2}
                value={extraInstructions}
                onChange={(e) => setExtraInstructions(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500 resize-none bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Submit checkout/booking button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-2xl text-xs hover:scale-102 active:scale-98 transition-all hover:shadow-xs flex items-center justify-center gap-1.5"
              >
                Confirmar Agendamento <Clock className="w-4 h-4" />
              </button>
              <center>
                <span className="text-[10px] text-zinc-400 pt-1.5 block">Não cobramos taxa de cancelamento prévio de 24h.</span>
              </center>
            </div>
          </form>
        </div>
      </div>

      {/* Seus Agendamentos Section */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 mt-8 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-display">
            <Clock className="text-emerald-500 w-5 h-5" /> Seus Agendamentos Ativos
          </h3>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold">
            {appointments.length} {appointments.length === 1 ? 'agendamento' : 'agendamentos'}
          </span>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-8 text-slate-400 space-y-2">
            <Calendar className="w-10 h-10 text-slate-200 mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Nenhum serviço agendado no momento.</p>
            <p className="text-[11px] text-slate-400">Escolha um serviço acima para começar!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((appt) => {
              const pet = pets.find(p => p.id === appt.petId);
              return (
                <div key={appt.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-150 flex items-start justify-between gap-4 hover:border-slate-300 transition-colors">
                  <div className="space-y-1">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">
                      {appt.serviceType === 'banho_tosa' ? 'Estética' : appt.serviceType === 'vacina' ? 'Vacina' : 'Consulta'}
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm leading-snug mt-1">{appt.serviceName}</h4>
                    <p className="text-xs text-slate-500 font-medium">Pet: <span className="font-bold text-slate-750">{pet?.name || 'Pet'}</span></p>
                    <p className="text-[11px] text-slate-400">Profissional: {appt.providerName}</p>
                    {appt.extraNotes && (
                      <p className="text-[10px] text-slate-400 bg-white border border-slate-100 rounded-lg p-1.5 mt-1.5 italic">
                        obs: {appt.extraNotes}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-3 justify-between h-full min-h-[70px]">
                    <div className="text-right">
                      <p className="font-extrabold text-slate-800 text-xs font-mono">{appt.date}</p>
                      <p className="text-xs text-emerald-600 font-bold uppercase">{appt.time}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onCancelAppointment(appt.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Cancelar agendamento"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation modal */}
      <AnimatePresence>
        {showConfirmModal && bookedDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs"
            id="booking-confirmation-modal"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl space-y-4 text-center"
            >
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-full w-14 h-14 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold font-display text-slate-800">Cuidado Confirmado!</h3>
                <p className="text-xs text-slate-500">Agendamento concluído e lançado no prontuário digital com sucesso.</p>
              </div>

              {/* Booking receipt */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Pet Selecionado:</span>
                  <span className="font-bold text-slate-800">{currentPetData?.name || 'Seu Pet'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Serviço:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[150px]">{bookedDetails.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Profissional:</span>
                  <span className="font-bold text-slate-800 text-[11px]">{bookedDetails.providerName}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-slate-500">
                  <span className="text-slate-400">Horário:</span>
                  <span className="font-bold text-slate-900 font-mono text-[11px]">{bookedDetails.date} às {bookedDetails.time}</span>
                </div>
                <div className="flex justify-between pt-1 font-bold text-emerald-800">
                  <span>Valor:</span>
                  <span>R$ {bookedDetails.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 bg-yellow-50 text-yellow-805 rounded-xl text-[10px] leading-relaxed flex items-center gap-1.5 text-left font-semibold">
                <ShieldCheck className="w-6 h-6 text-yellow-500 flex-shrink-0 animate-pulse" />
                <span>Mariana acaba de ganhar 80 PONTOS XP de saúde por este agendamento preventivo!</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  setBookedDetails(null);
                }}
                className="w-full bg-slate-950 text-white font-bold py-3 text-xs rounded-xl transition-all"
              >
                Voltar à Agenda Geral
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
