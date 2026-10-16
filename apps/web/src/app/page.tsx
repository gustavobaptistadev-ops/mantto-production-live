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
            <a href="/" className="px-4 py-3 bg-slate-800 text-cyan-400 rounded-lg font-medium">Dashboard</a>
            <a href="/catalog" className="px-4 py-3 text-slate-400 hover:text-white rounded-lg">Catálogo & VTON</a>
            <a href="/whatsapp-crm" className="px-4 py-3 text-slate-400 hover:text-white rounded-lg">WhatsApp CRM</a>
            <a href="/orders" className="px-4 py-3 text-slate-400 hover:text-white rounded-lg">Pedidos & PIX</a>
            <a href="/settings" className="px-4 py-3 text-slate-400 hover:text-white rounded-lg">Motor IA & Sliders</a>
            <a href="/maintenance" className="px-4 py-3 text-amber-400 hover:text-white rounded-lg">🛠️ Manutenção</a>
          </nav>
        </div>
      )}

      {/* Sidebar Desktop (Padrão Top-10) */}
      <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 flex-col overflow-y-auto z-20">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-900 font-black italic">M</div>
            <span className="text-xl font-bold tracking-tight text-white">
              MANTTO <span className="text-cyan-400 font-light">COMMERCE</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Moda Esportiva & Agentes IA</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-2">
          <a href="/" className="flex items-center px-4 py-3 bg-slate-800/60 text-cyan-400 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.08)]">
            <span className="font-semibold text-sm">📊 Dashboard Geral</span>
          </a>
          <a href="/catalog" className="flex items-center px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all">
            <span className="font-medium text-sm">🧥 Catálogo & VTON</span>
          </a>
          <a href="/whatsapp-crm" className="flex items-center px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all">
            <span className="font-medium text-sm">💬 WhatsApp CRM</span>
          </a>
          <a href="/orders" className="flex items-center px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all">
            <span className="font-medium text-sm">📦 Pedidos & PIX</span>
          </a>
          <a href="/settings" className="flex items-center px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all">
            <span className="font-medium text-sm">⚙️ Sliders & Regras</span>
          </a>
          <a href="/maintenance" className="flex items-center px-4 py-3 text-amber-400 hover:text-amber-300 hover:bg-amber-950/30 rounded-xl transition-all border border-amber-500/20">
            <span className="font-medium text-sm">🛠️ Manutenção</span>
          </a>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative w-full">
        {/* Glow de fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full md:w-[800px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 relative z-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Painel Executivo da Loja</h2>
            <p className="text-sm md:text-base text-slate-400 mt-1">Supervisão estratégica de vendas autônomas, telemetria da IA e fechamento de pedidos.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold flex items-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
              WhatsApp Cloud & Motor IA Online
            </span>
          </div>
        </header>

        {/* Métricas de Poder Executivo do Administrador (KPIs de Alta Performance) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8 relative z-10">
          {[
            { label: "Vendas Autônomas (IA)", value: "R$ 16.141", sub: "85 pedidos fechados", trend: "+24%", color: "text-emerald-400" },
            { label: "Tempo Médio Resposta", value: "1.4s", sub: "Humano: 14min", trend: "99.8% veloz", color: "text-cyan-400" },
            { label: "Conversas Ativas Hoje", value: "342", sub: "48 simultâneas", trend: "+12%", color: "text-blue-400" },
            { label: "Provadores VTON Gerados", value: "128", sub: "38.2% conversão", trend: "+34%", color: "text-fuchsia-400" },
            { label: "Recuperação de Carrinho", value: "R$ 3.840", sub: "21 carrinhos salvos", trend: "+19%", color: "text-amber-400" },
            { label: "Ticket Médio", value: "R$ 189,90", sub: "1.8 camisas/pedido", trend: "+8%", color: "text-indigo-400" },
          ].map((kpi, idx) => (
            <div key={idx} className="p-4 md:p-5 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl hover:border-slate-600 transition-all shadow-sm">
              <h3 className="text-slate-400 text-xs font-medium mb-1.5 line-clamp-1">{kpi.label}</h3>
              <div className="flex items-baseline justify-between">
                <span className={`text-xl md:text-2xl font-black ${kpi.color}`}>{kpi.value}</span>
                <span className="text-emerald-400 text-[11px] font-semibold">{kpi.trend}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{kpi.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 relative z-10">
          {/* Camisas Mais Buscadas */}
          <div className="lg:col-span-2 p-5 md:p-6 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white">Camisas em Alta</h3>
                <p className="text-xs text-slate-400">Uniformes com maior demanda de provador e fechamento</p>
              </div>
              <a href="/catalog" className="text-cyan-400 text-xs md:text-sm font-semibold hover:underline">Ver Catálogo Completo &rarr;</a>
            </div>
            <div className="space-y-4">
              {[
                { name: "Camisa Flamengo 2026 Titular", sku: "FLA-26-TIT", requests: 142, stock: 28, vton: "94 fotos provadas" },
                { name: "Camisa Real Madrid 24/25 Edição Especial", sku: "RMA-25-ESP", requests: 98, stock: 12, vton: "61 fotos provadas" },
                { name: "Camisa Brasil Edição Ouro Canarinho", sku: "BRA-26-OUR", requests: 74, stock: 4, vton: "52 fotos provadas" },
              ].map((prod, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-800 gap-3 sm:gap-0 hover:border-slate-700 transition-colors">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-800/90 border border-slate-700 rounded-lg flex items-center justify-center text-cyan-400 text-lg">👕</div>
                    <div>
                      <p className="font-semibold text-slate-200 text-sm md:text-base line-clamp-1">{prod.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500">SKU: {prod.sku}</span>
                        <span className="text-[11px] text-fuchsia-400 font-medium">✨ {prod.vton}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex sm:block justify-between items-center sm:w-auto w-full">
                    <p className="text-xs md:text-sm text-slate-300"><span className="font-bold text-cyan-400">{prod.requests}</span> consultas</p>
                    <p className="text-xs text-emerald-400 font-medium">Estoque: {prod.stock} un</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Radar Comercial da IA */}
          <div className="p-5 md:p-6 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl flex flex-col">
            <h3 className="text-lg md:text-xl font-bold text-white mb-1 flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 mr-2 animate-ping"></span>
              Radar do Administrador
            </h3>
            <p className="text-xs text-slate-400 mb-6">Ações recomendadas pela IA com base nas negociações.</p>
            
            <div className="flex-1 space-y-4">
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-sm text-amber-300 font-bold mb-1">⚡ Alerta de Estoque Crítico</p>
                <p className="text-xs text-slate-300 leading-relaxed">A <strong>Camisa Brasil Ouro</strong> tem apenas 4 unidades e 12 carrinhos abertos. Considere pausar o desconto de 1ª tentativa para preservar a margem.</p>
                <a href="/settings" className="mt-3 block text-center py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs font-semibold transition-colors">Ajustar Teto de Desconto</a>
              </div>

              <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                <p className="text-sm text-cyan-300 font-bold mb-1">🤖 Conversão do WhatsApp</p>
                <p className="text-xs text-slate-300 leading-relaxed">O Provador Virtual VTON elevou a conversão do carrinho em <strong>+28%</strong> hoje. 18 torcedores pagaram via PIX após testar a camisa.</p>
                <a href="/whatsapp-crm" className="mt-3 block text-center py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg text-xs font-semibold transition-colors">Abrir CRM do WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
