"use client";
import { useState } from 'react';

export default function DashboardPage() {
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
            <a href="#" className="px-4 py-3 bg-slate-800 text-cyan-400 rounded-lg font-medium">Dashboard</a>
            <a href="/products" className="px-4 py-3 text-slate-400 hover:text-white rounded-lg">Catálogo</a>
            <a href="/orders" className="px-4 py-3 text-slate-400 hover:text-white rounded-lg">Pedidos</a>
            <a href="#" className="px-4 py-3 text-slate-400 hover:text-white rounded-lg">Config. WhatsApp</a>
          </nav>
        </div>
      )}

      {/* Sidebar Desktop (Oculta no celular) */}
      <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 flex-col overflow-y-auto z-20">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Mantto AI
          </h1>
          <p className="text-xs text-slate-500 mt-1">Commerce Manager</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <a href="/" className="flex items-center px-4 py-3 bg-slate-800/50 text-cyan-400 rounded-lg border border-slate-700/50 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
            <span className="font-medium">Dashboard</span>
          </a>
          <a href="/products" className="flex items-center px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all">
            <span className="font-medium">Catálogo</span>
          </a>
          <a href="/orders" className="flex items-center px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all">
            <span className="font-medium">Pedidos</span>
          </a>
          <a href="/settings" className="flex items-center px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all">
            <span className="font-medium">Configurações (IA)</span>
          </a>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative w-full">
        {/* Glow de fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full md:w-[800px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 relative z-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Visão Geral</h2>
            <p className="text-sm md:text-base text-slate-400 mt-1">Monitoramento em tempo real dos Agentes IA.</p>
          </div>
          <div className="flex items-center self-start sm:self-auto">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs md:text-sm font-medium flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              WhatsApp Online
            </span>
          </div>
        </header>

        {/* Métricas (KPIs) - Adaptado para celular */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8 relative z-10">
          {[
            { label: "Atendimentos Hoje", value: "342", trend: "+12%", color: "text-cyan-400" },
            { label: "Pedidos Fechados", value: "85", trend: "+5%", color: "text-emerald-400" },
            { label: "Taxa de Conversão", value: "24.8%", trend: "+2.1%", color: "text-blue-400" },
            { label: "Economia (Tokens)", value: "R$ 45,20", trend: "-15%", color: "text-purple-400" },
          ].map((kpi, idx) => (
            <div key={idx} className="p-5 md:p-6 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl hover:border-slate-600 transition-colors">
              <h3 className="text-slate-400 text-xs md:text-sm font-medium mb-2">{kpi.label}</h3>
              <div className="flex items-end justify-between">
                <span className={`text-2xl md:text-3xl font-bold ${kpi.color}`}>{kpi.value}</span>
                <span className="text-emerald-400 text-xs md:text-sm font-medium mb-1">{kpi.trend}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 relative z-10">
          {/* Produtos Mais Procurados */}
          <div className="lg:col-span-2 p-5 md:p-6 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg md:text-xl font-semibold text-white">Mais Procurados</h3>
              <button className="text-cyan-400 text-xs md:text-sm font-medium hover:underline">Catálogo</button>
            </div>
            <div className="space-y-4">
              {[
                { name: "Camiseta Básica Preta", sku: "PROD-1-P", requests: 124, stock: 15 },
                { name: "Jaqueta de Couro", sku: "PROD-2-M", requests: 98, stock: 3 },
                { name: "Calça Alfaiataria", sku: "PROD-3-G", requests: 45, stock: 0 },
              ].map((prod, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800 gap-3 sm:gap-0">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 text-xs">IMG</div>
                    <div>
                      <p className="font-medium text-slate-200 text-sm md:text-base line-clamp-1">{prod.name}</p>
                      <p className="text-xs text-slate-500">SKU: {prod.sku}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex sm:block justify-between items-center sm:w-auto w-full">
                    <p className="text-xs md:text-sm text-slate-300"><span className="font-bold text-cyan-400">{prod.requests}</span> buscas</p>
                    {prod.stock > 0 ? (
                      <p className="text-xs text-emerald-500">Estoque: {prod.stock}</p>
                    ) : (
                      <p className="text-xs text-red-400 animate-pulse">Sem estoque!</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manutenção e Sugestões da IA */}
          <div className="p-5 md:p-6 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl flex flex-col">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
              Insights da IA
            </h3>
            <p className="text-xs md:text-sm text-slate-400 mb-6">A IA sugere melhorias baseadas nas conversas.</p>
            
            <div className="flex-1 space-y-4">
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <p className="text-sm text-purple-200 font-medium mb-1">Reposição</p>
                <p className="text-xs text-slate-300">Hoje, 12 clientes pediram a <strong>Calça Alfaiataria (G)</strong> que está fora de estoque.</p>
                <button className="mt-3 w-full py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-xs font-medium transition-colors">Aprovar Pedido</button>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-200 font-medium mb-1">Comunicação</p>
                <p className="text-xs text-slate-300">Ajustei meu prompt para ser mais direto sobre o prazo de entrega (5 dias) após dúvidas constantes.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
