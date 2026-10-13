"use client";
import { useState } from "react";

export default function SettingsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-900 text-slate-200 overflow-hidden font-sans">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 z-30 relative">
        <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Mantto AI
        </h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-slate-400 hover:text-white focus:outline-none p-2"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* Menu Overlay Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[65px] left-0 w-full h-[calc(100vh-65px)] bg-slate-900/95 backdrop-blur-md z-40 p-4 border-b border-slate-800">
          <nav className="flex flex-col space-y-2">
            <a href="/" className="px-4 py-3 text-slate-400 hover:text-white rounded-lg">Dashboard</a>
            <a href="/products" className="px-4 py-3 text-slate-400 hover:text-white rounded-lg">Catálogo</a>
            <a href="/orders" className="px-4 py-3 text-slate-400 hover:text-white rounded-lg">Pedidos</a>
            <a href="/settings" className="px-4 py-3 bg-slate-800 text-cyan-400 rounded-lg font-medium">Config. IA</a>
          </nav>
        </div>
      )}

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 flex-col overflow-y-auto z-20">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Mantto AI
          </h1>
          <p className="text-xs text-slate-500 mt-1">Commerce Manager</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <a href="/" className="flex items-center px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all">
            <span className="font-medium">Dashboard</span>
          </a>
          <a href="/products" className="flex items-center px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all">
            <span className="font-medium">Catálogo</span>
          </a>
          <a href="/orders" className="flex items-center px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all">
            <span className="font-medium">Pedidos</span>
          </a>
          <a href="/settings" className="flex items-center px-4 py-3 bg-slate-800/50 text-cyan-400 rounded-lg border border-slate-700/50 shadow-[0_0_10px_rgba(34,211,238,0.1)] transition-all">
            <span className="font-medium">Configurações (IA)</span>
          </a>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative w-full">
        <header className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">Configurações de Inteligência Artificial</h2>
          <p className="text-sm md:text-base text-slate-400 mt-1">Gerencie chaves, modelos LLM e regras determinísticas.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Painel FreeAPI / LLM Engine */}
          <div className="p-6 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl">
            <h3 className="text-xl font-semibold text-white mb-6">Motor de IA (FreeAPI / LLM)</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Base URL (Endpoint)</label>
                <input type="text" defaultValue="https://api.freeapi.local/v1" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-400" />
                <p className="text-xs text-slate-500 mt-1">Ex: URL do FreeAPI, LMStudio ou OpenAI.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Modelo de IA (Model ID)</label>
                <input type="text" defaultValue="llama3-8b-instruct" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-400" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Chave de API (Opcional para Local)</label>
                <input type="password" placeholder="sk-..." className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-400" />
              </div>
              
              <div className="pt-4">
                <button className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold px-6 py-2 rounded-lg transition-colors">
                  Salvar Motor IA
                </button>
              </div>
            </div>
          </div>

          {/* Painel Determinismo & Prompts */}
          <div className="p-6 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl flex flex-col">
            <h3 className="text-xl font-semibold text-white mb-6">Controle de Determinismo</h3>
            
            <div className="space-y-6 flex-1">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Temperatura (Criatividade vs Determinação)</label>
                <input type="range" min="0" max="100" defaultValue="0" className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400" />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span className="text-cyan-400 font-bold">0 (Frio/Robótico)</span>
                  <span>100 (Criativo)</span>
                </div>
              </div>

              {/* O PULO DO GATO: Margem de Negociação Dinâmica */}
              <div className="pt-4 border-t border-slate-700/50">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-emerald-400">Pulo do Gato: Margem Oculta da IA</label>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-md font-bold">15% Max</span>
                </div>
                <input type="range" min="0" max="30" defaultValue="15" className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                <p className="text-xs text-slate-400 mt-2">
                  A IA tentará vender a preço cheio. Mas se o cliente reclamar do preço, ela está autorizada a oferecer até esse % de desconto para salvar a venda.
                </p>
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">Diretriz do Agente (System Prompt)</label>
                <textarea rows={5} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-400" defaultValue={"Você é uma assistente de vendas da Mantto.\n1: Tente vender preço cheio.\n2: Se o cliente hesitar pelo preço, dê o desconto da Margem Oculta.\n3: SÓ venda o que tem no estoque."}></textarea>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
