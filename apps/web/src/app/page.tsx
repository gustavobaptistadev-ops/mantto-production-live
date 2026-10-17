"use client";

import { useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState("hoje");

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#070b12] text-slate-100 overflow-hidden font-sans">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-5 py-4 bg-[#0a0f1d] border-b border-slate-800/80 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-[0_0_15px_rgba(6,182,212,0.35)]">
            M
          </div>
          <span className="font-bold tracking-tight text-white text-base">
            MANTTO <span className="text-cyan-400 font-light text-xs uppercase tracking-wider ml-1">Enterprise</span>
          </span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/50 border border-slate-700/50"
        >
          {isMobileMenuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* Menu Overlay Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[65px] left-0 w-full h-[calc(100vh-65px)] bg-[#070b12]/98 backdrop-blur-xl z-40 p-5 border-b border-slate-800">
          <nav className="flex flex-col space-y-2">
            <Link href="/" className="px-4 py-3 bg-cyan-500/10 text-cyan-400 rounded-xl font-medium border border-cyan-500/30">Visão Geral</Link>
            <Link href="/catalog" className="px-4 py-3 text-slate-400 hover:text-white rounded-xl">Catálogo & VTON</Link>
            <Link href="/whatsapp-crm" className="px-4 py-3 text-slate-400 hover:text-white rounded-xl">WhatsApp CRM & Kanban</Link>
            <Link href="/orders" className="px-4 py-3 text-slate-400 hover:text-white rounded-xl">Pedidos & Faturamento</Link>
            <Link href="/settings" className="px-4 py-3 text-slate-400 hover:text-white rounded-xl">Motor IA & Políticas</Link>
            <Link href="/maintenance" className="px-4 py-3 text-amber-400 hover:text-white rounded-xl">Manutenção de Infra</Link>
          </nav>
        </div>
      )}

      {/* Sidebar Corporativa Desktop */}
      <aside className="hidden md:flex w-72 bg-[#090e1a] border-r border-slate-800/80 flex-col justify-between overflow-y-auto z-20 select-none">
        <div>
          {/* Brand Header */}
          <div className="p-6 pb-5 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-base shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                M
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-tight text-white text-base">MANTTO</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">AI</span>
                </div>
                <p className="text-[11px] text-slate-500 tracking-wide font-medium">Plataforma Autônoma de Comércio</p>
              </div>
            </div>
          </div>

          {/* Seção Principal de Navegação */}
          <div className="px-3 pt-5">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Comando & Controle</span>
            <nav className="space-y-1">
              <Link href="/" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-medium text-xs shadow-sm transition-all">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                <span>Visão Geral</span>
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              </Link>
              
              <Link href="/catalog" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium text-xs transition-all">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                <span>Catálogo & Provador VTON</span>
              </Link>

              <Link href="/whatsapp-crm" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium text-xs transition-all">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <span>WhatsApp CRM & Pipeline</span>
              </Link>

              <Link href="/orders" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium text-xs transition-all">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                <span>Pedidos & Faturamento</span>
              </Link>
            </nav>
          </div>

          <div className="px-3 pt-6">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Governança & Sistema</span>
            <nav className="space-y-1">
              <Link href="/settings" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium text-xs transition-all">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Motor IA & Regras Comerciais</span>
              </Link>
              <Link href="/maintenance" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-amber-400/90 hover:text-amber-300 hover:bg-amber-950/20 border border-transparent hover:border-amber-500/20 font-medium text-xs transition-all">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
                <span>Manutenção & Telemetria</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* User Card no Rodapé da Sidebar */}
        <div className="p-4 m-3 bg-[#0d1424] border border-slate-800/80 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">Administrador</p>
              <p className="text-[10px] text-slate-500 truncate">admin@mantto.com.br</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></span>
          </div>
        </div>
      </aside>

      {/* Conteúdo Central */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 relative w-full bg-[#070b12]">
        
        {/* Glow Superior Suave (Enterprise Ambient Lighting) */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[250px] bg-gradient-to-b from-cyan-500/5 to-transparent blur-[120px] pointer-events-none"></div>

        {/* Top Header Bar */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/70 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Painel de Operações</h1>
              <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80 text-slate-300">
                Live Enterprise
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-400 mt-1.5 font-normal">
              Supervisão analítica em tempo real de conversões, agentes conversacionais e catálogo VTON.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Seletor de Período Corporativo */}
            <div className="inline-flex p-1 rounded-xl bg-[#0c1222] border border-slate-800 text-xs font-medium">
              {[
                { key: "hoje", label: "Hoje" },
                { key: "7d", label: "7 Dias" },
                { key: "30d", label: "30 Dias" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedRange(tab.key)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedRange === tab.key
                      ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                WhatsApp API v21.0 Ativo
              </div>
            </div>
          </div>
        </header>

        {/* 6 KPIs Executivos com Layout de Alta Densidade e Tipografia Precisa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8 relative z-10">
          {[
            { 
              title: "Faturamento Autônomo", 
              value: "R$ 16.141,50", 
              caption: "85 pedidos via IA", 
              delta: "+24.2%", 
              deltaPositive: true,
              icon: (
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )
            },
            { 
              title: "Velocidade de Resposta", 
              value: "1.4s", 
              caption: "Humano: 14m 20s", 
              delta: "-99.8%", 
              deltaPositive: true,
              icon: (
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              )
            },
            { 
              title: "Sessões Ativas Hoje", 
              value: "342", 
              caption: "48 em tempo real", 
              delta: "+12.0%", 
              deltaPositive: true,
              icon: (
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
              )
            },
            { 
              title: "Provadores VTON Gerados", 
              value: "128", 
              caption: "38.2% taxa de compra", 
              delta: "+34.5%", 
              deltaPositive: true,
              icon: (
                <svg className="w-4 h-4 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              )
            },
            { 
              title: "Recuperação de Carrinho", 
              value: "R$ 3.840,00", 
              caption: "21 carrinhos salvos", 
              delta: "+19.1%", 
              deltaPositive: true,
              icon: (
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              )
            },
            { 
              title: "Ticket Médio", 
              value: "R$ 189,90", 
              caption: "1.8 camisas/pedido", 
              delta: "+7.8%", 
              deltaPositive: true,
              icon: (
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              )
            },
          ].map((kpi, idx) => (
            <div 
              key={idx} 
              className="p-5 rounded-2xl bg-gradient-to-b from-[#0f172a]/90 to-[#0b1120]/90 border border-slate-800/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-slate-400 tracking-tight">{kpi.title}</span>
                <div className="w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center">
                  {kpi.icon}
                </div>
              </div>

              <div>
                <div className="text-xl md:text-2xl font-black text-white tracking-tight">
                  {kpi.value}
                </div>
                
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px]">
                  <span className="text-slate-400 font-medium">{kpi.caption}</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-0.5">
                    {kpi.delta}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grade de Inteligência de Produtos & Ações da IA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          
          {/* Tabela de Uniformes & Eficiência Comercial (7 colunas) */}
          <div className="lg:col-span-7 rounded-2xl bg-gradient-to-b from-[#0f172a]/80 to-[#0b1120]/90 border border-slate-800/80 p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800/80">
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <span>⚡</span> Uniformes de Maior Liquidez
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Demanda de provador e taxa de fechamento por SKU</p>
                </div>
                <Link href="/catalog" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <span>Ver Catálogo</span>
                  <span>&rarr;</span>
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  { 
                    name: "Camisa Flamengo 2026 Titular", 
                    sku: "FLA-26-TIT", 
                    volume: "142 consultas", 
                    stock: 28, 
                    stockStatus: "normal",
                    vton: "94 fotos provadas", 
                    conversion: "41.5%" 
                  },
                  { 
                    name: "Camisa Real Madrid 24/25 Especial", 
                    sku: "RMA-25-ESP", 
                    volume: "98 consultas", 
                    stock: 12, 
                    stockStatus: "low",
                    vton: "61 fotos provadas", 
                    conversion: "36.8%" 
                  },
                  { 
                    name: "Camisa Brasil Canarinho Ouro", 
                    sku: "BRA-26-OUR", 
                    volume: "74 consultas", 
                    stock: 4, 
                    stockStatus: "critical",
                    vton: "52 fotos provadas", 
                    conversion: "48.2%" 
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#090e1c] border border-slate-800/80 hover:border-slate-700/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-cyan-400 text-base font-bold">
                        👕
                      </div>
                      <div>
                        <div className="font-semibold text-slate-100 text-sm">{item.name}</div>
                        <div className="flex items-center gap-2.5 mt-0.5">
                          <span className="text-[11px] font-mono text-slate-400">SKU: {item.sku}</span>
                          <span className="text-[11px] font-medium text-fuchsia-400">✨ {item.vton}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/60">
                      <div className="text-left sm:text-right">
                        <div className="text-xs font-bold text-slate-200">{item.volume}</div>
                        <div className="text-[11px] font-medium text-emerald-400">Conv. {item.conversion}</div>
                      </div>

                      <div className="text-right">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          item.stockStatus === 'critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                          item.stockStatus === 'low' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {item.stock} un
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
              <span>Atualizado a cada 30 segundos via WebSocket</span>
              <span className="text-cyan-400 font-semibold cursor-pointer hover:underline">Exportar CSV</span>
            </div>
          </div>

          {/* Radar & Recomendações Táticas do Modelo de IA (5 colunas) */}
          <div className="lg:col-span-5 rounded-2xl bg-gradient-to-b from-[#0f172a]/80 to-[#0b1120]/90 border border-slate-800/80 p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800/80">
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    Radar Tático do Administrador
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Ações proativas sugeridas pelo modelo neural</p>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  IA Ativa
                </span>
              </div>

              <div className="space-y-4">
                {/* Card 1: Alerta Estoque */}
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="flex items-center gap-2 font-bold text-xs text-amber-300 mb-1">
                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>Preservação de Margem em Estoque Crítico</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    A <strong>Camisa Brasil Ouro</strong> possui apenas 4 unidades e 12 carrinhos abertos. O modelo recomenda suspender a oferta de desconto automático de 5% para proteger a margem líquida.
                  </p>
                  <div className="mt-3">
                    <Link href="/settings" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs border border-amber-500/30 transition-all">
                      <span>Ajustar Teto de Desconto</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>

                {/* Card 2: Impacto VTON */}
                <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                  <div className="flex items-center gap-2 font-bold text-xs text-cyan-300 mb-1">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Provador Virtual impulsionou fechamentos</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    O envio de fotos de torcedores vestindo o manto no WhatsApp aumentou a conversão em <strong>+28%</strong>. 18 clientes efetuaram pagamento via PIX imediato após visualizar o resultado.
                  </p>
                  <div className="mt-3">
                    <Link href="/whatsapp-crm" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold text-xs border border-cyan-500/30 transition-all">
                      <span>Acessar WhatsApp CRM</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
              <span>Motor de decisão autônomo v2.4</span>
              <Link href="/maintenance" className="text-slate-400 hover:text-white transition-colors">Configurar Gatilhos</Link>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
