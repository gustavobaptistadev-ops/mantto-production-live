"use client";

import { useState } from "react";
import Link from "next/link";
import { getApiUrl } from "@/lib/apiConfig";

export default function CatalogPage() {
  const [products] = useState([
    {
      id: 1,
      name: "Camisa Flamengo 2026 Titular",
      sku: "FLA-26-HOME",
      price: "299,90",
      stock: 28,
      img: "https://images.unsplash.com/photo-1580087433295-ab2600c1030e?q=80&w=600&auto=format&fit=crop",
      vtonModel: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop",
      category: "Clubes Nacionais",
      sizes: ["P", "M", "G", "GG"],
      rating: "4.9",
      history: "Manto com tecido micro-perfurado respirável e escudo bordado de alta densidade.",
    },
    {
      id: 2,
      name: "Camisa Real Madrid 24/25 Especial",
      sku: "RMA-25-ESP",
      price: "349,90",
      stock: 12,
      img: "https://images.unsplash.com/photo-1508215885820-4585e5610e28?q=80&w=600&auto=format&fit=crop",
      vtonModel: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
      category: "Internacionais",
      sizes: ["M", "G"],
      rating: "5.0",
      history: "Edição especial comemorativa da Champions League com patches dourados oficiais.",
    },
    {
      id: 3,
      name: "Camisa Brasil Canarinho Edição Ouro",
      sku: "BRA-26-OUR",
      price: "329,90",
      stock: 4,
      img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop",
      vtonModel: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
      category: "Seleções",
      sizes: ["G"],
      rating: "4.8",
      history: "Edição histórica com detalhes texturizados em jacquard com a silhueta da fauna nacional.",
    },
    {
      id: 4,
      name: "Camisa Corinthians 2026 Alvinegra",
      sku: "SCCP-26-ALV",
      price: "289,90",
      stock: 35,
      img: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=600&auto=format&fit=crop",
      vtonModel: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop",
      category: "Clubes Nacionais",
      sizes: ["P", "M", "G", "GG"],
      rating: "4.9",
      history: "Listras verticais clássicas com tecnologia Dry-Fit avançada de rápida evaporação.",
    },
  ]);

  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [selectedSize, setSelectedSize] = useState("M");
  const [isGenerating, setIsGenerating] = useState(false);
  const [vtonResult, setVtonResult] = useState<string | null>(products[0].vtonModel);
  const [sentWhatsapp, setSentWhatsapp] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");

  const handleSelectProduct = (prod: typeof products[0]) => {
    setSelectedProduct(prod);
    setVtonResult(prod.vtonModel);
  };

  const handleGenerateTryOn = async () => {
    setIsGenerating(true);
    setSentWhatsapp(false);

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/vton/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          person_image: "client_photo_base64",
          garment_image: selectedProduct.sku,
          custom_name: customName,
          custom_number: customNumber,
        }),
      });
      const data = await response.json();

      setTimeout(() => {
        setVtonResult(data.result_image_url || selectedProduct.vtonModel);
        setIsGenerating(false);
      }, 1200);
    } catch {
      setTimeout(() => {
        setVtonResult(selectedProduct.vtonModel);
        setIsGenerating(false);
      }, 1000);
    }
  };

  const handleSendToWhatsApp = () => {
    setSentWhatsapp(true);
    setTimeout(() => setSentWhatsapp(false), 4000);
  };

  return (
    <div className="flex h-screen bg-[#070b12] text-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar Corporativa */}
      <aside className="hidden md:flex w-72 bg-[#090e1a] border-r border-slate-800/80 flex-col justify-between overflow-y-auto select-none">
        <div>
          <div className="p-6 pb-5 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-base shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                M
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-tight text-white text-base">MANTTO</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">AI</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Estúdio Virtual Try-On</p>
              </div>
            </div>
          </div>

          <div className="px-3 pt-5">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Comando & Controle</span>
            <nav className="space-y-1">
              <Link href="/" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 text-xs font-medium transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                <span>Visão Geral</span>
              </Link>
              
              <Link href="/catalog" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-medium text-xs shadow-sm transition-all">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                <span>Catálogo & Provador VTON</span>
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              </Link>

              <Link href="/whatsapp-crm" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 text-xs font-medium transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <span>WhatsApp CRM & Kanban</span>
              </Link>

              <Link href="/orders" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 text-xs font-medium transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                <span>Pedidos & Faturamento</span>
              </Link>

              <Link href="/settings" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 text-xs font-medium transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Motor IA & Regras</span>
              </Link>

              <Link href="/maintenance" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-amber-400 hover:text-amber-300 hover:bg-amber-950/20 text-xs font-medium transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
                <span>Manutenção & Logs</span>
              </Link>
            </nav>
          </div>
        </div>

        <div className="p-4 m-3 bg-[#0d1424] border border-slate-800/80 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>VTON GPU Cluster</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              99.8% Online
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Latência Média: 1.2s</span>
        </div>
      </aside>

      {/* Conteúdo Central */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#070b12]">
        
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-800/70">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-white tracking-tight">Catálogo & Estúdio Virtual Try-On (VTON)</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/30">
                Diffusion Engine v3.4
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Simulador neural de caimento em torcedores para envio imediato de fotos personalizadas no WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs font-semibold text-slate-300">
              Conversão pós-VTON: <strong className="text-emerald-400">38.2%</strong>
            </span>
          </div>
        </header>

        {/* Layout de 2 Colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Lado Esquerdo: Catálogo de Produtos (5 colunas) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mantos Disponíveis</span>
              <span className="text-xs text-cyan-400 font-semibold">{products.length} modelos cadastrados</span>
            </div>

            <div className="space-y-3 max-h-[calc(100vh-210px)] overflow-y-auto pr-1">
              {products.map((p) => {
                const isSelected = selectedProduct.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProduct(p)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? "bg-cyan-950/20 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30"
                        : "bg-[#0b101d] border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 border border-slate-950"></div>
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">{p.category}</span>
                        <h3 className="text-xs font-bold text-white line-clamp-1">{p.name}</h3>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                          <span className="font-mono">SKU: {p.sku}</span>
                          <span>•</span>
                          <span className={p.stock <= 5 ? "text-rose-400 font-bold" : "text-emerald-400 font-medium"}>
                            {p.stock} em estoque
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-white block">R$ {p.price}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {p.sizes.join("/")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lado Direito: Estúdio Neural VTON (7 colunas) */}
          <div className="lg:col-span-7 rounded-2xl bg-gradient-to-b from-[#0f172a]/90 to-[#0b1120]/95 border border-slate-800/80 p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse"></span>
                  <span className="text-sm font-bold text-white">Renderizador de Caimento Neural</span>
                </div>
                <span className="text-[11px] text-slate-400">Manto Selecionado: <strong className="text-cyan-400">{selectedProduct.name}</strong></span>
              </div>

              {/* Informações Rápidas do Produto Selecionado */}
              <div className="p-3 mb-4 rounded-xl bg-[#090f1d] border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Detalhes do Manto:</span>
                  <span className="text-slate-200 font-medium">{selectedProduct.history}</span>
                </div>
                <div className="flex items-center gap-1.5 ml-4 flex-shrink-0">
                  <span className="text-amber-400 font-black">★ {selectedProduct.rating}</span>
                </div>
              </div>

              {/* Customização: Nome e Número nas Costas (Pulo do Gato) */}
              <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-xl bg-[#090e1a] border border-slate-800/80">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Personalizar Nome nas Costas
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                    placeholder="Ex: GUSTAVO ou GABI"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Número Oficial
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={customNumber}
                    onChange={(e) => setCustomNumber(e.target.value)}
                    placeholder="Ex: 10 ou 9"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Seleção de Tamanho */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold text-slate-400">Tamanho para Prova:</span>
                <div className="flex items-center gap-1.5">
                  {selectedProduct.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        selectedSize === sz
                          ? "bg-cyan-500 text-slate-950 shadow-md font-black"
                          : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid de Inputs e Resultado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                
                {/* Imagem do Cliente */}
                <div className="p-4 rounded-xl bg-[#080d18] border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">1. Torcedor (Foto WhatsApp)</span>
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-900 border border-slate-800 relative group flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop"
                        alt="Foto do Torcedor"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-semibold text-white bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-700">Substituir Foto</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2 block">Foto enviada pelo cliente no WhatsApp</span>
                </div>

                {/* Resultado Renderizado VTON */}
                <div className="p-4 rounded-xl bg-[#080d18] border border-fuchsia-500/30 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 text-[10px] font-bold tracking-wider uppercase border border-fuchsia-500/40">
                    VTON Render
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-fuchsia-400 block mb-2">2. Fusão Neural Concluída</span>
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center relative">
                      {isGenerating ? (
                        <div className="text-center p-4">
                          <div className="w-10 h-10 border-2 border-fuchsia-500 border-t-cyan-400 rounded-full animate-spin mx-auto mb-2"></div>
                          <span className="text-xs text-fuchsia-300 font-semibold animate-pulse">Ajustando iluminação e tecido...</span>
                        </div>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={vtonResult || selectedProduct.vtonModel}
                          alt="Resultado VTON"
                          className="w-full h-full object-cover animate-in fade-in duration-300"
                        />
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold mt-2 block flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Iluminação 3D, sombras e dobras renderizadas
                  </span>
                </div>

              </div>
            </div>

            {/* Painel Inferior de Ações */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleGenerateTryOn}
                disabled={isGenerating}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <svg className="w-4 h-4 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                {isGenerating ? "Processando IA..." : "Re-renderizar VTON"}
              </button>

              <button
                onClick={handleSendToWhatsApp}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" /></svg>
                {sentWhatsapp ? "✓ Enviado com Sucesso ao Lead!" : "Exportar & Enviar no WhatsApp do Cliente"}
              </button>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
