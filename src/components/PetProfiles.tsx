import React, { useState } from 'react';
import { Pet, WeightRecord, VaccinationRecord, HealthRecord } from '../types';
import { Plus, Heart, Award, Shield, User, Trash2, Calendar, FileText, ChevronRight, Activity, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PetProfilesProps {
  pets: Pet[];
  selectedPetId: string;
  onSelectPet: (id: string) => void;
  onAddPet: (pet: Pet) => void;
  onDeletePet: (id: string) => void;
  onAddWeight: (petId: string, record: WeightRecord) => void;
  onAddVaccine: (petId: string, record: VaccinationRecord) => void;
  onAddHealthRecord: (petId: string, record: HealthRecord) => void;
  onUnlockBadge: (badgeId: string) => void;
}

const PRESET_PHOTOS = [
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200", // Dog 1
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200", // Cat 1
  "https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&q=80&w=200", // Dog 2
  "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=200", // Cat 2
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=200", // Rabbit
  "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&q=80&w=200"  // Bird
];

export default function PetProfiles({
  pets,
  selectedPetId,
  onSelectPet,
  onAddPet,
  onDeletePet,
  onAddWeight,
  onAddVaccine,
  onAddHealthRecord,
  onUnlockBadge
}: PetProfilesProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'vaccines' | 'health'>('info');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetType, setNewPetType] = useState<Pet['type']>('dog');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState('');
  const [newPetGender, setNewPetGender] = useState<'Macho' | 'Fêmea'>('Macho');
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);

  // New weight inputs
  const [newWeight, setNewWeight] = useState('');
  const [newWeightDate, setNewWeightDate] = useState('');

  // New vaccine inputs
  const [newVacName, setNewVacName] = useState('');
  const [newVacDate, setNewVacDate] = useState('');
  const [newVacNext, setNewVacNext] = useState('');

  // New health record inputs
  const [newHealthTitle, setNewHealthTitle] = useState('');
  const [newHealthDesc, setNewHealthDesc] = useState('');
  const [newHealthDoc, setNewHealthDoc] = useState('');

  const currentPet = pets.find(p => p.id === selectedPetId) || pets[0];

  const handleCreatePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName || !newPetBreed || !newPetAge) return;

    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      name: newPetName,
      type: newPetType,
      breed: newPetBreed,
      age: newPetAge,
      gender: newPetGender,
      photo: PRESET_PHOTOS[selectedPhotoIdx],
      weightHistory: [
        { date: "Hoje", value: newPetType === 'cat' ? 4.0 : newPetType === 'dog' ? 12.5 : 1.2 }
      ],
      vaccinations: [
        { id: `vac-init-${Date.now()}`, name: "Avaliação Primária", date: new Date().toISOString().split('T')[0], status: 'completed' }
      ],
      healthHistory: [
        { id: `health-init-${Date.now()}`, date: new Date().toISOString().split('T')[0], title: "Perfil Criado", description: "O pet foi cadastrado no sistema do Pet Shop com sucesso!" }
      ]
    };

    onAddPet(newPet);
    // Auto unlock Badge 1 for first or additional pet
    onUnlockBadge("badge-1");

    // Reset Form
    setNewPetName('');
    setNewPetBreed('');
    setNewPetAge('');
    setShowAddForm(false);
  };

  const submitWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight || !currentPet) return;
    const wNum = parseFloat(newWeight);
    if (isNaN(wNum) || wNum <= 0) return;

    const dateStr = newWeightDate || new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    onAddWeight(currentPet.id, { date: dateStr, value: wNum });
    setNewWeight('');
    setNewWeightDate('');

    // Check weight accomplishment
    if (currentPet.weightHistory.length >= 2) {
      onUnlockBadge("badge-5");
    }
  };

  const submitVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVacName || !newVacDate || !currentPet) return;

    const record: VaccinationRecord = {
      id: `vac-${Date.now()}`,
      name: newVacName,
      date: newVacDate,
      status: 'pending',
      nextDueDate: newVacNext || undefined
    };

    onAddVaccine(currentPet.id, record);
    setNewVacName('');
    setNewVacDate('');
    setNewVacNext('');
  };

  const markVaccineDone = (vacId: string) => {
    if (!currentPet) return;
    const updated = currentPet.vaccinations.map(v => {
      if (v.id === vacId) {
        return { ...v, status: 'completed' as const };
      }
      return v;
    });

    // Simulating health record creation on completion
    const targetVac = currentPet.vaccinations.find(v => v.id === vacId);
    if (targetVac) {
      onAddHealthRecord(currentPet.id, {
        id: `health-vac-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        title: `Imunização: ${targetVac.name}`,
        description: `Dose da vacina aplicada com sucesso na clínica parceira. Próxima dose recomendada registrada em prontuário.`,
        doctor: "Vacinador Credenciado"
      });
      onUnlockBadge("badge-2");
    }
  };

  const submitHealthRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHealthTitle || !newHealthDesc || !currentPet) return;

    const record: HealthRecord = {
      id: `health-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: newHealthTitle,
      description: newHealthDesc,
      doctor: newHealthDoc || 'Auto-registro do tutor'
    };

    onAddHealthRecord(currentPet.id, record);
    setNewHealthTitle('');
    setNewHealthDesc('');
    setNewHealthDoc('');
  };

  // Weight chart SVG dimensions
  const chartHeight = 120;
  const chartWidth = 340;

  return (
    <div className="max-w-4xl mx-auto space-y-6" id="pet-profiles-container">
      {/* Top Pets Picker Row */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold font-display tracking-tight text-slate-800 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> Meus Pets Cadastrados
          </h2>
          <p className="text-xs text-slate-500 mt-1">Gerencie a caderneta de vacinas e peso dos seus companheiros</p>
        </div>

        {/* Picker list with animations */}
        <div className="flex flex-wrap items-center gap-3">
          {pets.map((pet) => (
            <button
              key={pet.id}
              onClick={() => onSelectPet(pet.id)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl text-sm font-semibold transition-all border ${
                selectedPetId === pet.id
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 scale-102 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <img
                src={pet.photo}
                alt={pet.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
                referrerPolicy="no-referrer"
              />
              <span>{pet.name}</span>
              {pet.type === 'dog' && <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded-md">Cão</span>}
              {pet.type === 'cat' && <span className="text-[10px] bg-fuchsia-100 text-fuchsia-800 px-1.5 py-0.5 rounded-md">Gato</span>}
            </button>
          ))}

          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-900 shadow-sm hover:scale-105 transition-all text-center border border-amber-500"
          >
            <Plus className="w-4 h-4" /> Cadastrar Pet
          </button>
        </div>
      </div>

      {/* Main Grid: Info card on left, Records on right */}
      {currentPet && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Esquerdo: Perfil Básico */}
          <div className="md:col-span-1 bg-white rounded-3xl p-6 shadow-xs border border-slate-100 flex flex-col gap-5 justify-between">
            <div className="text-center space-y-3">
              <div className="relative inline-block mx-auto">
                <img
                  src={currentPet.photo}
                  alt={currentPet.name}
                  className="w-28 h-28 rounded-full object-cover mx-auto ring-4 ring-emerald-100 border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-1 right-2 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-md">
                  <Activity className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold font-display text-slate-800">{currentPet.name}</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">{currentPet.breed}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-medium">
                    {currentPet.age}
                  </span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-medium">
                    {currentPet.gender}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics and interactive weights */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Histórico de Peso (Kg)</span>
              
              {/* Dynamic SVG Sparkline weight chart */}
              {currentPet.weightHistory.length > 0 ? (
                <div className="pt-2">
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full overflow-visible">
                    {/* Background Grids */}
                    <line x1="0" y1="20" x2={chartWidth} y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
                    <line x1="0" y1="60" x2={chartWidth} y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
                    <line x1="0" y1="100" x2={chartWidth} y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
                    
                    {/* Plotting points & lines */}
                    {(() => {
                      const values = currentPet.weightHistory.map(w => w.value);
                      const minVal = Math.min(...values) * 0.9;
                      const maxVal = Math.max(...values) * 1.1;
                      const range = maxVal - minVal || 1;

                      const points = currentPet.weightHistory.map((w, idx) => {
                        const x = (idx / (currentPet.weightHistory.length - 1 || 1)) * (chartWidth - 40) + 20;
                        const y = chartHeight - ((w.value - minVal) / range) * (chartHeight - 40) - 20;
                        return { x, y, val: w.value, date: w.date };
                      });

                      const pathD = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

                      return (
                        <>
                          <path d={pathD} stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                          {points.map((p, idx) => (
                            <g key={idx}>
                              <circle cx={p.x} cy={p.y} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" className="drop-shadow-xs" />
                              <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="bold">
                                {p.val}kg
                              </text>
                              <text x={p.x} y={chartHeight - 4} textAnchor="middle" fill="#64748b" fontSize="9">
                                {p.date}
                              </text>
                            </g>
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Nenhum registro de peso inserido ainda.</p>
              )}

              {/* Form to insert weights */}
              <form onSubmit={submitWeight} className="flex gap-2 mt-4 pt-2 border-t border-slate-200">
                <input
                  type="number"
                  step="0.1"
                  placeholder="Novo Peso (kg)"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-1/2 text-xs border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-emerald-500 bg-white"
                  required
                />
                <button type="submit" className="w-1/2 bg-slate-800 text-white text-xs font-bold rounded-xl py-1.5 hover:bg-emerald-600 transition-all">
                  Registrar Peso
                </button>
              </form>
            </div>

            {/* Remove pet button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  if (confirm(`Tem certeza de que deseja remover o cadastro de ${currentPet.name}?`)) {
                    onDeletePet(currentPet.id);
                  }
                }}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-red-500 py-1.5 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" /> Excluir Perfil de {currentPet.name}
              </button>
            </div>
          </div>

          {/* Prontuários e Saúde Direita */}
          <div className="md:col-span-2 bg-white rounded-3xl shadow-xs border border-slate-100 flex flex-col">
            {/* Headers Tabs */}
            <div className="flex border-b border-slate-100 p-2 gap-2">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-3 text-center text-xs font-bold tracking-wide uppercase rounded-xl transition-all ${
                  activeTab === 'info'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                Resumo Geral
              </button>
              <button
                onClick={() => setActiveTab('vaccines')}
                className={`flex-1 py-3 text-center text-xs font-bold tracking-wide uppercase rounded-xl transition-all ${
                  activeTab === 'vaccines'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                Vacinas ({currentPet.vaccinations.length})
              </button>
              <button
                onClick={() => setActiveTab('health')}
                className={`flex-1 py-3 text-center text-xs font-bold tracking-wide uppercase rounded-xl transition-all ${
                  activeTab === 'health'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                Histórico Clínico
              </button>
            </div>

            {/* Tab Contents with micro animations */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              {activeTab === 'info' && (
                <div className="space-y-6">
                  {/* Wellness Indicator */}
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                    <div className="p-2 h-9 w-9 bg-amber-400 text-slate-900 rounded-xl flex items-center justify-center">
                      <Smile className="w-5 h-5 font-bold" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Prontuário Digital Geral - Nível de Cuidado Altíssimo!</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Mantenha o peso monitorado e realize exames preventivos pelo menos uma vez por ano. O programa de fidelidade do {currentPet.name} conta com metas de saúde desbloqueáveis.
                      </p>
                    </div>
                  </div>

                  {/* Summary lists items of vacc and status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 space-y-3">
                      <h5 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-emerald-500" /> Próxima Vacina Prevista
                      </h5>
                      {currentPet.vaccinations.find(v => v.status === 'pending') ? (
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {currentPet.vaccinations.find(v => v.status === 'pending')?.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Previsão: {currentPet.vaccinations.find(v => v.status === 'pending')?.date}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-emerald-600">Todas as imunizações registradas estão regularizadas!</p>
                      )}
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 space-y-3">
                      <h5 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-emerald-500" /> Último Registro Clínico
                      </h5>
                      {currentPet.healthHistory.length > 0 ? (
                        <div>
                          <p className="text-sm font-bold text-slate-800 truncate">
                            {currentPet.healthHistory[currentPet.healthHistory.length - 1].title}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {currentPet.healthHistory[currentPet.healthHistory.length - 1].description}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">Nenhum evento médico listado ainda.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Por que usar o prontuário neonatal?</span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Lojas e clínicas credenciadas visualizam o prontuário de vacinas integrado, tornando sua visita para banho e tosa protegida e higienizada. Além disso, cada vacina regularizada acumula pontos na carteira de Mariana.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'vaccines' && (
                <div className="space-y-5">
                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {currentPet.vaccinations.map((vac) => (
                      <div key={vac.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-start gap-2.5">
                          <div className={`p-1.5 h-7 w-7 rounded-lg flex items-center justify-center ${
                            vac.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800 animate-pulse'
                          }`}>
                            <Shield className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{vac.name}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              {vac.status === 'completed' ? `Aplicada em: ${vac.date}` : `Programada para: ${vac.date}`}
                            </p>
                          </div>
                        </div>

                        {vac.status === 'completed' ? (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md">
                            Concluído
                          </span>
                        ) : (
                          <button
                            onClick={() => markVaccineDone(vac.id)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] px-3 py-1 rounded-lg transition-all"
                          >
                            Registrar Aplicação
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Vaccine expansion form */}
                  <form onSubmit={submitVaccine} className="p-4 rounded-2xl border border-slate-200 space-y-3 bg-white mt-4">
                    <span className="text-xs font-bold text-slate-700 block">Registrar Vacina na Agenda</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Nome da Vacina (ex: Giardia)"
                        value={newVacName}
                        onChange={(e) => setNewVacName(e.target.value)}
                        className="text-xs border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-emerald-500"
                        required
                      />
                      <input
                        type="date"
                        title="Data de Aplicação"
                        value={newVacDate}
                        onChange={(e) => setNewVacDate(e.target.value)}
                        className="text-xs border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-emerald-500"
                        required
                      />
                      <button type="submit" className="bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl py-2 transition-all">
                        Agendar Vacinação
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'health' && (
                <div className="space-y-4">
                  <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
                    {currentPet.healthHistory.map((h) => (
                      <div key={h.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-slate-400" /> {h.title}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{h.date}</span>
                        </div>
                        <p className="text-slate-600 leading-normal">{h.description}</p>
                        {h.doctor && <p className="text-[10px] text-slate-500 font-semibold italic">Veterinário: {h.doctor}</p>}
                      </div>
                    ))}
                  </div>

                  {/* Add medical diary */}
                  <form onSubmit={submitHealthRecord} className="p-4 rounded-2xl border border-slate-200 mt-3 space-y-2 bg-white">
                    <span className="text-xs font-bold text-slate-700 block">Adicionar Anotação ou Prontuário Clínico</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Título do Prontuário (ex: Alergia a picada)"
                        value={newHealthTitle}
                        onChange={(e) => setNewHealthTitle(e.target.value)}
                        className="text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-emerald-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Profissional Médico (opcional)"
                        value={newHealthDoc}
                        onChange={(e) => setNewHealthDoc(e.target.value)}
                        className="text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-emerald-500"
                      />
                    </div>
                    <textarea
                      placeholder="Descrição clínica detalhada do exame, reações, dietas ou recomendações médicas..."
                      rows={2}
                      value={newHealthDesc}
                      onChange={(e) => setNewHealthDesc(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-emerald-500 resize-none"
                      required
                    />
                    <button type="submit" className="w-full bg-slate-900 text-white text-xs font-semibold rounded-xl py-2.5 hover:bg-emerald-600 transition-all">
                      Registrar Ocorrência Médica
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Portal modal form to Register new Pet */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs"
            id="add-pet-modal"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-100 shadow-xl space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold font-display text-slate-900 flex items-center gap-1.5">
                  <Heart className="w-5 h-5 text-emerald-500 fill-emerald-500" /> Cadastrar Novo Pet
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-2xl text-slate-400 hover:text-slate-800 focus:outline-none"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreatePet} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">Nome do Animal</label>
                  <input
                    type="text"
                    placeholder="ex: Pipoca"
                    value={newPetName}
                    onChange={(e) => setNewPetName(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">Espécie</label>
                    <select
                      value={newPetType}
                      onChange={(e) => setNewPetType(e.target.value as Pet['type'])}
                      className="w-full text-xs border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 focus:outline-emerald-500"
                    >
                      <option value="dog">Cachorro</option>
                      <option value="cat">Gato</option>
                      <option value="rabbit">Coelho</option>
                      <option value="bird">Pássaro</option>
                      <option value="other">Outros</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">Gênero</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setNewPetGender('Macho')}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                          newPetGender === 'Macho'
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        Macho
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewPetGender('Fêmea')}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                          newPetGender === 'Fêmea'
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        Fêmea
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">Raça</label>
                    <input
                      type="text"
                      placeholder="ex: SRD/Persa"
                      value={newPetBreed}
                      onChange={(e) => setNewPetBreed(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-emerald-500"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">Idade</label>
                    <input
                      type="text"
                      placeholder="ex: 1 ano e 2 meses"
                      value={newPetAge}
                      onChange={(e) => setNewPetAge(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 block">Escolha uma Ilustração/Foto de Perfil</label>
                  <div className="grid grid-cols-6 gap-2">
                    {PRESET_PHOTOS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedPhotoIdx(idx)}
                        className={`relative rounded-xl overflow-hidden border-2 aspect-square transition-all ${
                          selectedPhotoIdx === idx ? 'border-amber-400 scale-105' : 'border-slate-200 hover:opacity-80'
                        }`}
                      >
                        <img src={url} alt="Preset animal" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-3 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all shadow-sm"
                  >
                    Confirmar Cadastro
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
