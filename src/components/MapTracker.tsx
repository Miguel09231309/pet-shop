import React, { useState, useEffect } from 'react';
import { PartnerClinic, DeliveryTracker } from '../types';
import { partnerClinics } from '../data';
import { MapPin, Navigation, Phone, Clock, Star, Landmark, Search, ShieldCheck, Truck, RefreshCw, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MapTrackerProps {
  deliveries: DeliveryTracker[];
  onTriggerDeliveryUpdate: (orderId: string) => void;
  onAddToActivityLog: (log: string) => void;
}

export default function MapTracker({ deliveries, onTriggerDeliveryUpdate, onAddToActivityLog }: MapTrackerProps) {
  // Search and Clinic states
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeClinic, setActiveClinic] = useState<PartnerClinic>(partnerClinics[0]);
  const [simulatedRoute, setSimulatedRoute] = useState<{ distance: string; eta: string; steps: string[] } | null>(null);

  // Filter clinics
  const filteredClinics = partnerClinics.filter(clinic => {
    const matchesSearch = clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          clinic.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'todos') return matchesSearch;
    if (selectedCategory === 'spa') return matchesSearch && clinic.services.some(s => s.toLowerCase().includes('banho') || s.toLowerCase().includes('estética'));
    if (selectedCategory === 'hospital') return matchesSearch && clinic.services.some(s => s.toLowerCase().includes('hospital') || s.toLowerCase().includes('internação') || s.toLowerCase().includes('laboratório'));
    if (selectedCategory === 'clinica') return matchesSearch && clinic.services.some(s => s.toLowerCase().includes('consulta') || s.toLowerCase().includes('vacina'));
    return matchesSearch;
  });

  const triggerCalculateRoute = (clinic: PartnerClinic) => {
    setActiveClinic(clinic);
    
    // Simulate premium routing details
    setSimulatedRoute({
      distance: `${(Math.random() * 4 + 1.2).toFixed(1)} km`,
      eta: `${Math.round(Math.random() * 12 + 6)} minutos`,
      steps: [
        "Partida de Av. Paulista, 1200",
        `Acesse a via expressa sentido ${clinic.address.split(',')[0]}`,
        `Curva à direita e chegada em ¹/₂ quarteirão no ${clinic.name}`
      ]
    });

    onAddToActivityLog(`Calculou rota de entrega/direção para: ${clinic.name}`);
  };

  // Auto clean route on clinic swap
  useEffect(() => {
    setSimulatedRoute(null);
  }, [activeClinic]);

  return (
    <div className="max-w-5xl mx-auto space-y-6" id="map-tracker-container">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-emerald-500 fill-emerald-100" /> Clínicas Parceiras & Rastreio de Entregas
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Navegue no mapa ilustrado de clínicas credenciadas e acompanhe pacotes de compras em tempo real.
          </p>
        </div>

        {/* Legend widgets */}
        <div className="flex gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-slate-600 font-semibold">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block" /> Hospital 24h
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-slate-600 font-semibold">
            <span className="w-2.5 h-2.5 bg-amber-400 rounded-full inline-block" /> Spa Estético
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive Map layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5/12): Clinic Discovery list */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block font-display">Encontrar Credenciados</span>
            
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Hospital, Spa, Unidade..."
                value={searchQuery}
                aria-label="Buscar clínicas credenciadas"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-205 rounded-xl bg-slate-50 focus:bg-white focus:outline-emerald-500"
              />
            </div>

            {/* Quick Filter Pill Buttons */}
            <div className="flex gap-1 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedCategory('todos')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                  selectedCategory === 'todos' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setSelectedCategory('hospital')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                  selectedCategory === 'hospital' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Hospitais
              </button>
              <button
                onClick={() => setSelectedCategory('spa')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                  selectedCategory === 'spa' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Spas
              </button>
            </div>
          </div>

          {/* List Item results */}
          <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1" id="clinic-list-scroller">
            {filteredClinics.map((clinic) => {
              const isSelected = activeClinic.id === clinic.id;
              return (
                <div
                  key={clinic.id}
                  onClick={() => setActiveClinic(clinic)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-xs scale-101'
                      : 'border-slate-150 bg-white hover:border-slate-250 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-xs text-slate-800 leading-snug line-clamp-1">{clinic.name}</h4>
                    <div className="flex items-center text-amber-500 text-[10px]">
                      <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                      <span className="font-bold">{clinic.rating}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 line-clamp-1 leading-normal">{clinic.address}</p>
                  
                  {/* Services pills list */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {clinic.services.slice(0, 2).map((srv, idx) => (
                      <span key={idx} className="text-[8px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                        {srv}
                      </span>
                    ))}
                    {clinic.services.length > 2 && (
                      <span className="text-[8px] text-slate-400">+{clinic.services.length - 2}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center/Right Column (8/12): Vector City Map and Route info */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs flex flex-col justify-between md:h-[430px]">
            
            {/* Interactive Vector Map Body */}
            <div className="bg-slate-900 rounded-2xl w-full h-64 md:h-[300px] relative overflow-hidden border border-slate-950 shadow-inner">
              
              {/* Virtual Grid Lines on dark grid map */}
              <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Styled neon lines simulating modern streets */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-emerald-500/20 stroke-2" fill="none">
                <path d="M 10 20 L 400 300 M 50 350 L 500 50 M 200 10 L 100 400 M 0 150 L 600 150" />
                <path d="M 120 50 C 230 140, 310 80, 500 280" className="stroke-teal-500/20 stroke-[3] stroke-dasharray" />
              </svg>
              
              {/* User/Tutor Home Base coordinate point on Map (São Paulo Av. Paulista) */}
              <div className="absolute top-[60%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-center z-10">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 border-2 border-amber-300 flex items-center justify-center shadow-lg transform scale-100 animate-pulse">
                  <Landmark className="w-4 h-4" />
                </div>
                <span className="bg-slate-900/95 border border-slate-800 text-white rounded px-1.5 py-0.5 text-[8px] font-bold mt-1 inline-block select-none shadow-md">
                  Minha Casa (Mariana)
                </span>
              </div>

              {/* Render Partner clinics pins with different colors */}
              {partnerClinics.map((clinic) => {
                const isSelected = activeClinic.id === clinic.id;
                // Coordinates percentage maps mapped directly to map coordinates
                const styleLoc = {
                  top: `${clinic.coords.y}%`,
                  left: `${clinic.coords.x}%`
                };

                return (
                  <button
                    key={clinic.id}
                    onClick={() => setActiveClinic(clinic)}
                    style={styleLoc}
                    className="absolute -translate-x-1/2 -translate-y-1/2 text-center z-20 group active:scale-95 transition-transform"
                    title={clinic.name}
                  >
                    <div className={`p-1.5 rounded-full border-2 transition-all shadow-md ${
                      isSelected
                        ? 'bg-emerald-500 text-white border-white scale-125 glow-neon-primary'
                        : 'bg-slate-800 text-emerald-400 border-emerald-500 hover:scale-110'
                    }`}>
                      <MapPin className="w-4 h-4 fill-current" />
                    </div>
                    
                    {/* Tiny Floating tag */}
                    <span className={`bg-slate-905 border text-[9px] rounded-md px-1.5 py-0.5 mt-1 block select-none shadow-md max-w-[120px] truncate ${
                      isSelected ? 'border-emerald-400 text-emerald-300 font-extrabold' : 'border-slate-800 text-slate-300'
                    }`}>
                      {clinic.name.split(' ').slice(0, 2).join(' ')}
                    </span>
                  </button>
                );
              })}

              {/* Render Active Product Deliveries live simulation on map */}
              {deliveries.filter(d => d.status === 'em_transito').map((deliv, idx) => {
                // Semicolon coordinate shift interpolation
                const routeProg = deliv.mapRouteProgress;
                const topPerc = 60 - (routeProg / 100) * 20; // Driving towards home x:50% y:60%
                const leftPerc = 35 + (routeProg / 100) * 15;

                return (
                  <div
                    key={idx}
                    style={{ top: `${topPerc}%`, left: `${leftPerc}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 text-center z-30 pointer-events-none transition-all duration-500"
                  >
                    <div className="bg-amber-400 text-[#0f172a] p-2 rounded-xl border border-amber-300 shadow-md animate-bounce">
                      <Truck className="w-4 h-4 fill-current text-slate-900" />
                    </div>
                    <span className="bg-amber-400 text-[#0f172a] text-[7px] font-extrabold rounded px-1.5 py-0.5 mt-0.5 block shadow-xs uppercase">
                      Entrega #{deliv.orderId} ({routeProg}%)
                    </span>
                  </div>
                );
              })}

              {/* Watermark map status */}
              <div className="absolute bottom-2 left-2 bg-slate-900/80 text-[8px] font-mono text-emerald-400 border border-slate-800 rounded px-2 py-0.5 select-none pointer-events-none">
                SÃO PAULO MAPS v4.1 - VIRTUAL CITY MODEL
              </div>
            </div>

            {/* Bottom: Active Selected Clinic and computed Route Info */}
            <div className="pt-3 border-t flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-slate-800 flex items-center gap-1">
                  <Landmark className="w-4 h-4 text-emerald-500" /> {activeClinic.name}
                </h4>
                <p className="text-[11px] text-slate-500">{activeClinic.address} • Tel: {activeClinic.phone}</p>
                <div className="flex gap-2 items-center text-[10px] text-slate-500">
                  <span className="flex items-center text-amber-500 font-bold"><Star className="w-3.5 h-3.5 fill-current mr-0.5" />{activeClinic.rating}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5"><Clock className="w-3.5 h-3.5" /> {activeClinic.openHours}</span>
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={() => triggerCalculateRoute(activeClinic)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <Navigation className="w-4 h-4" /> Calcular Rota
                </button>
                <a
                  href={`tel:${activeClinic.phone.replace(/[^0-9]/g, '')}`}
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Ligando de forma simulada para ${activeClinic.name} no telefone ${activeClinic.phone}`);
                    }}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition"
                    title="Ligar"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Roteamento display instructions */}
          {simulatedRoute && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-slate-900 text-white p-4 rounded-3xl border border-slate-850 space-y-3"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 fill-current" /> Plano de Rota Ativo
                </span>
                <span className="font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
                  {simulatedRoute.distance} ({simulatedRoute.eta} ETA)
                </span>
              </div>
              <ol className="text-[11px] space-y-1.5 text-slate-300 list-decimal list-inside font-semibold leading-relaxed">
                {simulatedRoute.steps.map((step, idx) => (
                  <li key={idx} className="hover:text-white transition-colors">{step}</li>
                ))}
              </ol>
            </motion.div>
          )}

          {/* Home Active Delivery monitor system */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest block font-display">Acompanhar Encomendas Ativas</h3>
            
            {deliveries.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 text-center text-xs text-slate-400 border border-slate-100 leading-normal">
                Nenhuma compra em preparo ou trânsito no momento. Compre pacotes de ração gourmet no <span className="font-bold text-emerald-600">Marketplace</span> para inaugurar o rastreador de entregas.
              </div>
            ) : (
              <div className="space-y-4">
                {deliveries.map((delivery, i) => (
                  <div key={i} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="text-xs">
                        <p className="font-bold text-slate-800 text-sm">Pedido #{delivery.orderId}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Volume: {delivery.itemsCount} itens • Total: R$ {delivery.amount.toFixed(2)}</p>
                      </div>

                      {/* Manual trigger button for sandbox feel */}
                      <div className="flex gap-1">
                        {delivery.status !== 'entregue' && (
                          <button
                            onClick={() => onTriggerDeliveryUpdate(delivery.orderId)}
                            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 hover:scale-105 active:scale-95 text-[10px] font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
                          >
                            <RefreshCw className="w-3 h-3 animate-spin" /> Avançar Entrega
                          </button>
                        )}

                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                          delivery.status === 'confirmado' ? 'bg-sky-100 text-sky-800' :
                          delivery.status === 'preparando' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                          delivery.status === 'em_transito' ? 'bg-emerald-100 text-emerald-800 animate-pulse' :
                          'bg-slate-300 text-slate-700 font-bold'
                        }`}>
                          {delivery.status === 'confirmado' ? 'Confirmado' :
                           delivery.status === 'preparando' ? 'Em Preparo' :
                           delivery.status === 'em_transito' ? 'Em Trânsito' :
                           'Entregue'}
                        </span>
                      </div>
                    </div>

                    {/* Progress tracking line */}
                    <div className="relative pt-2">
                      <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-700"
                          style={{ width: delivery.status === 'confirmado' ? '25%' : delivery.status === 'preparando' ? '50%' : delivery.status === 'em_transito' ? `${delivery.mapRouteProgress}%` : '100%' }}
                        />
                      </div>

                      {/* Dot steppers */}
                      <div className="flex justify-between text-[9px] mt-2 font-bold text-slate-400">
                        <span className={delivery.status !== 'confirmado' ? 'text-emerald-700' : 'text-slate-500'}>✓ Confirmado</span>
                        <span className={delivery.status === 'preparando' || delivery.status === 'em_transito' || delivery.status === 'entregue' ? 'text-emerald-700' : 'text-slate-500'}>✓ Embalado</span>
                        <span className={delivery.status === 'em_transito' || delivery.status === 'entregue' ? 'text-emerald-700' : 'text-slate-500'}>✓ Na Estrada</span>
                        <span className={delivery.status === 'entregue' ? 'text-emerald-700' : 'text-slate-500'}>✓ Entregue</span>
                      </div>
                    </div>

                    {/* Driver details */}
                    {delivery.status === 'em_transito' && (
                      <div className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                            alt="Logistics driver"
                            className="w-8 h-8 rounded-full border"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-bold text-slate-800">Entregador: Márcio Silva</p>
                            <p className="text-[10px] text-slate-400">Veículo: Moto-Pet Express (Fila Rápida)</p>
                          </div>
                        </div>

                        <button
                          onClick={() => alert("Simulação de chat via Whatsapp aberta com Márcio Silva!")}
                          className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-500 flex gap-1 items-center font-bold text-[9px]"
                        >
                          <Smartphone className="w-3.5 h-3.5 text-slate-600" /> Contato
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
