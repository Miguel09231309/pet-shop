import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { catalogProducts } from '../data';
import { ShoppingBag, Search, Filter, ShoppingCart, Trash2, Plus, Minus, CreditCard, QrCode, Sparkles, Star, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StoreProps {
  onAddDelivery: (delivery: { itemsCount: number; amount: number }) => void;
  onAddPoints: (points: number) => void;
  onUnlockBadge: (badgeId: string) => void;
  onAddToActivityLog: (log: string) => void;
}

export default function Store({ onAddDelivery, onAddPoints, onUnlockBadge, onAddToActivityLog }: StoreProps) {
  // Navigation & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedPetType, setSelectedPetType] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'popular' | 'priceAsc' | 'priceDesc'>('popular');

  // Shopping Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartPanel, setShowCartPanel] = useState(false);
  
  // Checkout sequence state
  const [checkoutStep, setCheckoutStep] = useState<'shopping' | 'payment_selection' | 'processing' | 'success'>('shopping');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'wallet'>('pix');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  // Selected product details modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Computed Values
  const categories = ['todos', 'ração', 'brinquedos', 'acessórios', 'higiene', 'farmácia'];
  const petTypes = ['todos', 'dog', 'cat', 'rabbit', 'other'];

  // Filtering Logic
  const filteredProducts = catalogProducts.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || prod.category === selectedCategory;
    
    // Check pet association
    let matchesPet = true;
    if (selectedPetType !== 'todos') {
      if (selectedPetType === 'dog' && prod.petType !== 'dog' && prod.petType !== 'all') matchesPet = false;
      if (selectedPetType === 'cat' && prod.petType !== 'cat' && prod.petType !== 'all') matchesPet = false;
      if (selectedPetType === 'rabbit' && prod.petType !== 'rabbit' && prod.petType !== 'all') matchesPet = false;
      if (selectedPetType === 'other' && prod.petType !== 'all') matchesPet = false;
    }
    
    return matchesSearch && matchesCategory && matchesPet;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    return (b.rating) - (a.rating); // Popular is sorted by rating
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    // Visual trigger
    onAddToActivityLog(`Adicionou ao carrinho: ${product.name}`);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: Math.max(1, newQty) };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const startCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutStep('payment_selection');
  };

  const processPaymentSimulated = () => {
    setCheckoutStep('processing');
    
    setTimeout(() => {
      setCheckoutStep('success');
      
      // Dispatch delivery tracking status
      onAddDelivery({
        itemsCount: totalItemCount,
        amount: cartTotal
      });

      // Award dynamic loyalty program points
      const pointsAwarded = Math.round(cartTotal * 0.15); // 15% rate
      onAddPoints(pointsAwarded);

      // Check badge acquisition
      onUnlockBadge("badge-3");

      onAddToActivityLog(`Compra de R$ ${cartTotal.toFixed(2)} finalizada com sucesso via ${paymentMethod.toUpperCase()}!`);
      
      // Reset State
      setCart([]);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6" id="product-store-container">
      {/* Top Banner and Navigation Bar */}
      <div className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-3xl p-6 md:p-8 text-slate-900 shadow-md flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10 md:max-w-md">
          <span className="bg-yellow-300 text-yellow-905 text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full tracking-wider">
            Entrega Expressa Grátis R$150+
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold font-display leading-tight text-white">
            Clube do Pet Marketplace
          </h2>
          <p className="text-xs text-emerald-50 leading-relaxed font-sans">
            Compre produtos de alta linha e ganhe <span className="font-bold underline text-yellow-250">15% do valor em pontos</span> para trocar por banhos e consultas grátis!
          </p>
        </div>

        {/* Floating Cart Badge or Quick Action */}
        <div className="flex gap-3 z-10">
          <button
            onClick={() => setShowCartPanel(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 border border-emerald-100 font-bold text-xs shadow-md group hover:scale-105 active:scale-95 transition-all"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-600 transition-transform group-hover:rotate-12" /> Carrinho
            {totalItemCount > 0 && (
              <span className="bg-rose-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold animate-bounce">
                {totalItemCount}
              </span>
            )}
          </button>
        </div>

        {/* Absolute Neon circles decoration */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-teal-300/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-44 h-44 bg-emerald-300/30 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Main Catalog View with filter column */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Smart filters panel */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-5 border border-slate-100 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-emerald-500" /> Filtros Inteligentes
            </h3>
            {(selectedCategory !== 'todos' || selectedPetType !== 'todos' || searchQuery !== '') && (
              <button
                onClick={() => {
                  setSelectedCategory('todos');
                  setSelectedPetType('todos');
                  setSearchQuery('');
                }}
                className="text-[10px] text-rose-500 hover:underline font-bold"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Search text inputs */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar ração, brinquedo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-emerald-500 bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Category selection */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Categorias</span>
            <div className="flex flex-wrap lg:flex-col gap-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-left text-xs font-semibold uppercase flex items-center justify-between transition-all ${
                    selectedCategory === cat
                      ? 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-500 pl-4 font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:pl-4'
                  }`}
                >
                  <span>{cat === 'todos' ? 'Todas Categoria' : cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filter for targeted Pet Types */}
          <div className="space-y-2 pt-3 border-t border-slate-105">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Tipo de Pet</span>
            <div className="flex flex-wrap gap-1.5">
              {petTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedPetType(type)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize border ${
                    selectedPetType === type
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {type === 'todos' ? 'Todos' : type === 'dog' ? 'Cães' : type === 'cat' ? 'Gatos' : type === 'rabbit' ? 'Coelho' : 'Aves'}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting picker */}
          <div className="space-y-2 pt-3 border-t border-slate-105">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Ordenar</span>
            <select
              value={sortBy}
              aria-label="Ordenar produtos"
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs border border-slate-200 bg-white rounded-xl p-2 focus:outline-emerald-500"
            >
              <option value="popular">Destaques e Popularidade</option>
              <option value="priceAsc">Preço: Menor para Maior</option>
              <option value="priceDesc">Preço: Maior para Menor</option>
            </select>
          </div>
        </div>

        {/* Right Columns: Products grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
            <p className="text-xs text-slate-500">
              Mostrando <span className="font-bold text-slate-800">{sortedProducts.length}</span> produtos no catálogo de mimos
            </p>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" strokeWidth={1} />
              <h3 className="font-bold text-slate-700">Nenhum produto encontrado</h3>
              <p className="text-xs text-slate-400">Tente ajustar seus termos de busca ou mudar a categoria selecionada.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-150 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover group-hover:scale-[1.03] duration-300 transition-transform"
                      referrerPolicy="no-referrer"
                    />

                    {/* Popularity indicator tags */}
                    {product.isPopular && (
                      <span className="absolute top-2 left-2 bg-slate-900 border border-slate-800 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        ★ Popular
                      </span>
                    )}

                    {product.hasDiscount && (
                      <span className="absolute top-2 right-2 bg-amber-400 font-extrabold text-[#0f172a] text-[9px] px-2 py-0.5 rounded-md">
                        20% OFF
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Rating details & category indicators */}
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold uppercase px-1.5 py-0.5 rounded-md">
                          {product.category}
                        </span>
                        <div className="flex items-center text-amber-500 text-[10px] ml-auto">
                          <Star className="w-3 h-3 fill-amber-500 mr-0.5" />
                          <span className="font-bold">{product.rating}</span>
                          <span className="text-slate-400">({product.reviewsCount})</span>
                        </div>
                      </div>

                      {/* Title & Descr */}
                      <h4
                        onClick={() => setSelectedProduct(product)}
                        className="font-bold text-xs text-slate-800 line-clamp-2 mt-2 leading-snug cursor-pointer hover:text-emerald-600 transition-all"
                      >
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{product.description}</p>
                    </div>

                    {/* Price and Cart attachment */}
                    <div className="pt-2 border-t border-slate-50 flex items-center justify-between mt-auto">
                      <div>
                        {product.oldPrice && (
                          <span className="text-[10px] text-slate-400 line-through block">
                            R$ {product.oldPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-sm font-extrabold font-display text-slate-800 text-emerald-700">
                          R$ {product.price.toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all shadow-xs"
                        title="Adicionar ao Carrinho"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Interactive shopping Card Overlay slider */}
      <AnimatePresence>
        {showCartPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex justify-end backdrop-blur-xs placeholder-shown:backdrop-blur-none"
            id="shopping-cart-overlay"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-bold font-display text-lg text-slate-800 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-500" /> Seu Carrinho ({totalItemCount} itens)
                </h3>
                <button onClick={() => setShowCartPanel(false)} className="text-2xl text-slate-400 hover:text-slate-800 focus:outline-none">
                  &times;
                </button>
              </div>

              {checkoutStep === 'shopping' && (
                <>
                  {/* Cart Content items */}
                  <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
                    {cart.length === 0 ? (
                      <div className="text-center py-12 space-y-3">
                        <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto" />
                        <p className="text-xs text-slate-500 font-medium">O carrinho está sem mimos!</p>
                        <button
                          onClick={() => setShowCartPanel(false)}
                          className="text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-4 py-2 rounded-xl transition-all font-bold"
                        >
                          Explorar Catálogo
                        </button>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={item.product.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3 text-xs justify-between">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-xl object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 space-y-1">
                            <h4 className="font-bold text-slate-800 line-clamp-1">{item.product.name}</h4>
                            <p className="text-[10px] text-slate-500">Unidade: R$ {item.product.price.toFixed(2)}</p>
                            
                            {/* Quantity buttons */}
                            <div className="flex items-center gap-2 mt-1">
                              <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 rounded-md bg-slate-250 hover:bg-slate-300">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-bold text-[#0f172a] font-mono text-xs">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 rounded-md bg-slate-250 hover:bg-slate-300">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <div className="text-right flex flex-col justify-between items-end">
                            <button onClick={() => removeFromCart(item.product.id)} className="text-slate-400 hover:text-red-500">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-extrabold font-display text-slate-800">
                              R$ {(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Pricing footer / next trigger */}
                  {cart.length > 0 && (
                    <div className="border-t pt-4 space-y-4">
                      <div className="space-y-1.5 text-xs text-slate-600">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span className="font-mono">R$ {cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-emerald-600">
                          <span>Entrega Expressa</span>
                          <span className="font-bold font-mono">{cartTotal >= 150 ? 'GRÁTIS' : 'R$ 12,00'}</span>
                        </div>
                        <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t font-display">
                          <span>Total Geral</span>
                          <span className="font-mono text-emerald-800">R$ {(cartTotal >= 150 ? cartTotal : cartTotal + 12).toFixed(2)}</span>
                        </div>
                      </div>

                      <button
                        onClick={startCheckout}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:scale-101 active:scale-99 transition-all text-sm"
                      >
                        Ir para Pagamento <Sparkles className="w-4 h-4 text-yellow-300" />
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* PAYMENT SELECTION STEP */}
              {checkoutStep === 'payment_selection' && (
                <div className="flex-1 flex flex-col justify-between pt-4">
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-slate-500 uppercase block">Forma Segura de Pagamento</span>
                    
                    {/* Method togglers */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('pix')}
                        className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all ${
                          paymentMethod === 'pix' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-500'
                        }`}
                      >
                        <QrCode className="w-5 h-5 text-emerald-500" />
                        <span className="text-[10px] font-bold">PIX Copia/Cola</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all ${
                          paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-500'
                        }`}
                      >
                        <CreditCard className="w-5 h-5 text-sky-500" />
                        <span className="text-[10px] font-bold">Cartão Crédito</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('wallet')}
                        className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all ${
                          paymentMethod === 'wallet' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-500'
                        }`}
                      >
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        <span className="text-[10px] font-bold">Carteira Digital</span>
                      </button>
                    </div>

                    {/* Method unique details forms */}
                    {paymentMethod === 'pix' && (
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-3">
                        <div className="w-32 h-32 bg-slate-200 border border-slate-300 rounded-xl mx-auto flex items-center justify-center">
                          {/* Semicolon mock interactive QRCode visual */}
                          <div className="p-4 grid grid-cols-4 gap-1.5 bg-white rounded-lg">
                            {Array.from({ length: 16 }).map((_, i) => (
                              <div key={i} className={`w-4 h-4 ${i % 3 === 0 || i % 7 === 1 ? 'bg-slate-900' : 'bg-transparent'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-normal">
                          Leia o QR-code com seu banco ou copie a chave Pix. A aprovação é imediata para adiantar o preparo do pet.
                        </p>
                        <div className="p-2 border border-slate-300 rounded-xl bg-white flex items-center justify-between text-[11px] font-mono">
                          <span className="truncate text-slate-600 block max-w-[200px]">00020101021226870014br.gov.bcb.pix0124...</span>
                          <button
                            type="button"
                            onClick={() => alert("Código do Pix Copiado com Sucesso!")}
                            className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-2.5 py-1 rounded-md"
                          >
                            Copiar
                          </button>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Número do Cartão de Crédito"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full text-xs font-mono border border-slate-200 rounded-xl p-2.5 bg-slate-50"
                        />
                        <input
                          type="text"
                          placeholder="Nome impresso no cartão"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-slate-50 animate-fade-in"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Validade (MM/AA)"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="text-xs border border-slate-200 rounded-xl p-2.5 bg-slate-50"
                          />
                          <input
                            type="password"
                            maxLength={3}
                            placeholder="CVV"
                            value={cardCVV}
                            onChange={(e) => setCardCVV(e.target.value)}
                            className="text-xs border border-slate-200 rounded-xl p-2.5 bg-slate-50"
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'wallet' && (
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-2">
                        <span className="text-[10px] bg-slate-200 text-slate-800 font-extrabold px-3 py-1 rounded-full uppercase">
                          Apple Pay / Google Pay Ativo
                        </span>
                        <p className="text-xs text-slate-500 mt-1">Conectado de forma segura através de sua carteira padrão do sistema operacional.</p>
                      </div>
                    )}

                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                      <span>Compra assegurada com criptografia militar de 256 bits. Seus dados estão 100% protegidos.</span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2 border-t">
                    <button
                      onClick={processPaymentSimulated}
                      className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-2xl text-xs hover:bg-emerald-600 transition-all text-center"
                    >
                      Pagar e Fechar Pedido (R$ {(cartTotal >= 150 ? cartTotal : cartTotal + 12).toFixed(2)})
                    </button>
                    <button
                      onClick={() => setCheckoutStep('shopping')}
                      className="w-full text-slate-500 hover:text-slate-8s text-xs font-semibold py-1 hover:underline"
                    >
                      Voltar ao Carrinho
                    </button>
                  </div>
                </div>
              )}

              {/* PROCESSING LOADING PANEL MOCK */}
              {checkoutStep === 'processing' && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
                  <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin" />
                  <p className="text-sm font-bold text-slate-850">Criptografando conexão...</p>
                  <p className="text-xs text-slate-400">Processando sua transação com a bandeira bancária parceira.</p>
                </div>
              )}

              {/* SUCCESS MODAL WRAPPED INSIDE OVERLAY */}
              {checkoutStep === 'success' && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="p-4 bg-emerald-100 text-emerald-700 rounded-full animate-bounce">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-slate-800">Pedido Confirmado!</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Excelente escolha! Sua transação foi regularizada com sucesso. Nossa equipe de veterinários parceiros já iniciou o empacotamento dos mimos.
                  </p>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 w-full space-y-1 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Loyalty Points Ganhos:</span>
                      <span className="font-bold text-emerald-700">+{Math.round((cartTotal || 160) * 0.15)} XP</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Status da Entrega:</span>
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" /> Preparando
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCheckoutStep('shopping');
                      setShowCartPanel(false);
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 text-xs rounded-xl transition-all"
                  >
                    Maravilha! Ver Rastreamento
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs"
            id="product-details-modal"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-100 shadow-2xl relative space-y-4"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute right-4 top-4 text-2xl text-slate-400 hover:text-slate-800 focus:outline-none"
              >
                &times;
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-44 object-cover rounded-2xl"
                  referrerPolicy="no-referrer"
                />

                <div className="space-y-2">
                  <span className="bg-slate-100 text-slate-700 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded">
                    {selectedProduct.category}
                  </span>
                  <h3 className="font-bold font-display text-base text-slate-800 leading-tight">
                    {selectedProduct.name}
                  </h3>
                  
                  <div className="flex items-center text-amber-500 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-500 mr-1" />
                    <span className="font-bold">{selectedProduct.rating}</span>
                    <span className="text-slate-400">({selectedProduct.reviewsCount} opiniões)</span>
                  </div>

                  <div className="pt-2">
                    <span className="text-lg font-extrabold font-display text-emerald-800">
                      R$ {selectedProduct.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product description and specifications */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-600 uppercase">Sinopse do Produto</h4>
                <p className="text-xs text-slate-500 leading-normal">{selectedProduct.description}</p>
                
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-105 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Especificações Técnicas</span>
                  {selectedProduct.specs.map((spec, i) => (
                    <div key={i} className="flex justify-between text-xs py-0.5">
                      <span className="text-slate-500">{spec.label}</span>
                      <span className="font-bold text-slate-800">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="w-1/3 py-2.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all"
                >
                  Voltar
                </button>
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-2/3 py-2.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-xs transition-all text-center flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" /> Colocar no Carrinho
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
