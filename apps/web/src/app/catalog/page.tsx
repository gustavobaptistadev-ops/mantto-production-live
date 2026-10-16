"use client";

import { useState } from "react";
import Link from "next/link";
import { getApiUrl } from "@/lib/apiConfig";

export default function CatalogPage() {
  const [activeTab, setActiveTab] = useState('provador'); // Inicia no provador como foco atual
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Produtos Mockados para o Frontend
  const [products] = useState([
    { id: 1, name: "Camisa Flamengo Oficial 2026", sku: "FLA-26-HOME", price: "299,00", stock: 50, img: "https://images.unsplash.com/photo-1580087433295-ab2600c1030e?q=80&w=256&auto=format&fit=crop" },
    { id: 2, name: "Calção Flamengo Oficial 2026", sku: "FLA-26-SHORTS", price: "129,00", stock: 30, img: "https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=256&auto=format&fit=crop" },
    { id: 3, name: "Camisa Real Madrid Home", sku: "RMA-HOME", price: "349,00", stock: 15, img: "https://images.unsplash.com/photo-1508215885820-4585e5610e28?q=80&w=256&auto=format&fit=crop" },
  ]);

  // VTON State
  const [isGenerating, setIsGenerating] = useState(false);
  const [vtonResult, setVtonResult] = useState<string | null>(null);

  const handleGenerateTryOn = async () => {
    setIsGenerating(true);
    setVtonResult(null);

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/vton/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          person_image: "dummy_person_base64",
          garment_image: "dummy_garment_base64"
        })
      });
      const data = await response.json();
      
      // Simula um delay dramático da IA processando (já que o backend mock responde instantaneamente)
      setTimeout(() => {
        setVtonResult(data.result_image_url);
        setIsGenerating(false);
      }, 3000);

    } catch (e) {
      console.error(e);
      setIsGenerating(false);
      alert("Erro ao conectar com API de Visão.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 pt-12 max-w-[1400px] mx-auto font-sans">
      {/* NAVEGAÇÃO GLOBAL */}
      <nav className="flex items-center gap-6 mb-8 border-b border-slate-800 pb-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-2 mr-8">
          <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-slate-900 font-black italic">M</div>
          <span className="text-xl font-bold tracking-tight text-white">MANTTO <span className="text-cyan-400 font-light">ERP</span></span>
        </div>
        <Link href="/" className="text-slate-400 hover:text-white transition-colors pb-1">Dashboard</Link>
        <Link href="/catalog" className="text-cyan-400 font-medium border-b-2 border-cyan-400 pb-1">Catálogo & VTON</Link>
        <Link href="/settings" className="text-slate-400 hover:text-white transition-colors pb-1">Motor IA & Config</Link>
      </nav>

      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Estúdio MANTTO</h1>
          <p className="text-slate-400 mt-2">Gerencie sua vitrine virtual e o algoritmo de Prova de Roupas.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Nova Peça
        </button>
      </header>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-700/50 mb-8">
        <button className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'provador' ? 'border-purple-400 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`} onClick={() => setActiveTab('provador')}>
          ✨ Provador Virtual (VTON)
        </button>
        <button className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'produtos' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`} onClick={() => setActiveTab('produtos')}>
          Camisas e Kits
        </button>
      </div>

      {activeTab === 'produtos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {products.map((p) => (
            <div key={p.id} className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-colors group">
              <div className="h-48 w-full bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 opacity-60"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2">{p.name}</h3>
                <p className="text-2xl font-black text-cyan-400">R$ {p.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'provador' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Lado Esquerdo: Inputs de Imagem */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-purple-400">1.</span> Preparar Fusão
            </h2>
            
            <div className="space-y-6">
              {/* Foto do Cliente */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Foto do Cliente (Pessoa)</label>
                <div className="h-32 rounded-xl border-2 border-dashed border-slate-600 bg-slate-900/50 flex items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-slate-800 transition-colors group">
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto text-slate-500 group-hover:text-purple-400 transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    <span className="text-sm font-medium text-slate-400 group-hover:text-purple-300">Fazer Upload ou arrastar foto</span>
                  </div>
                </div>
              </div>

              {/* Foto da Peça */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Peça de Roupa (Garment)</label>
                <div className="h-32 rounded-xl border-2 border-dashed border-slate-600 bg-slate-900/50 flex items-center justify-center cursor-pointer hover:border-cyan-400 hover:bg-slate-800 transition-colors group">
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto text-slate-500 group-hover:text-cyan-400 transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    <span className="text-sm font-medium text-slate-400 group-hover:text-cyan-300">Selecionar do Catálogo</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleGenerateTryOn}
                disabled={isGenerating}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all ${isGenerating ? 'bg-purple-800 text-purple-300 cursor-wait' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
              >
                {isGenerating ? "✨ Processando Redes Neurais..." : "Gerar Provador Virtual"}
              </button>
            </div>
          </div>

          {/* Lado Direito: O Resultado Mágico */}
          <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border border-slate-700/50 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden">
            
            {!isGenerating && !vtonResult && (
              <div className="text-center text-slate-500">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                <p className="font-medium">O resultado aparecerá aqui.</p>
                <p className="text-sm mt-2 opacity-70">A IA veste a roupa respeitando a iluminação, pose e dobras do tecido.</p>
              </div>
            )}

            {isGenerating && (
              <div className="text-center z-10">
                <div className="w-20 h-20 border-4 border-purple-500 border-t-cyan-400 rounded-full animate-spin mx-auto mb-6 shadow-[0_0_30px_rgba(168,85,247,0.5)]"></div>
                <h3 className="text-2xl font-bold text-white mb-2 animate-pulse">Difusão em Andamento</h3>
                <p className="text-purple-300">Ajustando tecido e iluminação ao corpo...</p>
              </div>
            )}

            {vtonResult && !isGenerating && (
              <div className="relative w-full h-full animate-in zoom-in-95 duration-700 flex flex-col items-center">
                <span className="absolute -top-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold px-4 py-1 rounded-full text-sm z-20 shadow-lg border border-purple-300/30">
                  Resultado Gerado (Mock)
                </span>
                <div className="w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden border-4 border-slate-700 shadow-2xl relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={vtonResult} alt="Provador Virtual" className="w-full h-full object-cover" />
                  
                  {/* Botão flutuante para enviar p/ cliente */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-2 px-6 rounded-full shadow-lg flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M1.026 2.053l21.948 9.947-21.948 9.948 5.688-9.948z"></path></svg>
                      Enviar no WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Modal Novo Produto (Manteve-se inalterado) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md text-center">
            <h2 className="text-white text-xl mb-4">Adicionar ao Catálogo (Em breve)</h2>
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-700 text-white rounded">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}
