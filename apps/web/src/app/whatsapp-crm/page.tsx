"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getApiUrl } from "@/lib/apiConfig";

interface Lead {
  id: string;
  whatsapp_number: string;
  stage: string;
  sentiment: string;
  needs_human_intervention: boolean;
  total_value_cents: number;
  last_interaction: string;
  customer_name?: string;
  favorite_club?: string;
  preferred_size?: string;
}

interface PipelineData {
  NOVO: Lead[];
  CATALOGO_VISUALIZADO: Lead[];
  VTON_PROVADO: Lead[];
  CARRINHO_CRIADO: Lead[];
  PAGO: Lead[];
  DESISTENCIA: Lead[];
}

export default function WhatsAppCRMPage() {
  const [pipeline, setPipeline] = useState<PipelineData>({
    NOVO: [
      {
        id: "lead-1",
        whatsapp_number: "+55 11 98842-1920",
        customer_name: "Lucas Ferreira",
        favorite_club: "Flamengo",
        preferred_size: "G",
        stage: "NOVO",
        sentiment: "POSITIVO",
        needs_human_intervention: false,
        total_value_cents: 29990,
        last_interaction: "Há 4 min",
      },
    ],
    CATALOGO_VISUALIZADO: [
      {
        id: "lead-2",
        whatsapp_number: "+55 21 97230-4411",
        customer_name: "Matheus Silva",
        favorite_club: "Real Madrid",
        preferred_size: "M",
        stage: "CATALOGO_VISUALIZADO",
        sentiment: "POSITIVO",
        needs_human_intervention: false,
        total_value_cents: 34990,
        last_interaction: "Há 12 min",
      },
    ],
    VTON_PROVADO: [
      {
        id: "lead-vton-1",
        whatsapp_number: "+55 11 97711-2233",
        customer_name: "Guilherme Costa",
        favorite_club: "Corinthians",
        preferred_size: "GG",
        stage: "VTON_PROVADO",
        sentiment: "POSITIVO",
        needs_human_intervention: false,
        total_value_cents: 28990,
        last_interaction: "Há 8 min",
      },
    ],
    CARRINHO_CRIADO: [
      {
        id: "lead-3",
        whatsapp_number: "+55 31 99182-3301",
        customer_name: "Gabriel Santos",
        favorite_club: "Brasil",
        preferred_size: "G",
        stage: "CARRINHO_CRIADO",
        sentiment: "NEUTRO",
        needs_human_intervention: false,
        total_value_cents: 64980,
        last_interaction: "Há 25 min",
      },
    ],
    PAGO: [
      {
        id: "lead-4",
        whatsapp_number: "+55 41 98450-9900",
        customer_name: "Rafael Oliveira",
        favorite_club: "Flamengo",
        preferred_size: "M",
        stage: "PAGO",
        sentiment: "POSITIVO",
        needs_human_intervention: false,
        total_value_cents: 29990,
        last_interaction: "Há 1h",
      },
    ],
    DESISTENCIA: [
      {
        id: "lead-5",
        whatsapp_number: "+55 81 99321-4455",
        customer_name: "Diego Lima",
        favorite_club: "São Paulo",
        preferred_size: "P",
        stage: "DESISTENCIA",
        sentiment: "FRUSTRADO",
        needs_human_intervention: true,
        total_value_cents: 28990,
        last_interaction: "Há 3h",
      },
    ],
  });

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ sender: "lead" | "agent" | "ia"; text: string; time: string }[]>([]);

  const fetchPipeline = async () => {
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/crm/pipeline`);
      if (res.ok) {
        const data = await res.json();
        if (data.pipeline) {
          setPipeline(data.pipeline);
        }
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchPipeline();
    const interval = setInterval(fetchPipeline, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedLead && pipeline.NOVO.length > 0) {
      handleSelectLead(pipeline.NOVO[0]);
    }
  }, [pipeline]);

  const handleToggleHandoff = async (lead: Lead) => {
    const nextState = !lead.needs_human_intervention;
    try {
      const apiUrl = getApiUrl();
      await fetch(`${apiUrl}/crm/handoff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsapp_number: lead.whatsapp_number,
          take_over: nextState,
        }),
      });
      fetchPipeline();
      if (selectedLead && selectedLead.whatsapp_number === lead.whatsapp_number) {
        setSelectedLead({ ...selectedLead, needs_human_intervention: nextState });
      }
    } catch {
      if (selectedLead) {
        setSelectedLead({ ...selectedLead, needs_human_intervention: nextState });
      }
    }
  };

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setMessages([
      {
        sender: "lead",
        text: `Olá! Vocês têm a Camisa ${lead.favorite_club || "do time"} tamanho ${lead.preferred_size || "M"} disponível?`,
        time: "10:14",
      },
      {
        sender: "ia",
        text: `Fala, ${lead.customer_name || "parceiro"}! Tudo bem? Temos sim a pronta entrega! Acabei de enviar uma simulação no seu tamanho pelo provador virtual. O frete é expresso e se fechar via PIX agora te dou envio prioritário hoje mesmo!`,
        time: "10:14",
      },
      {
        sender: "lead",
        text: `Top demais! Como faço pra pagar no PIX com chave copia e cola?`,
        time: "10:15",
      },
      {
        sender: "ia",
        text: `Aqui está a sua chave PIX: financeiro@mantto.com.br (MANTTO ESPORTES). Assim que fizer o PIX, a IA valida seu comprovante automaticamente e já separa o manto!`,
        time: "10:15",
      },
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "agent",
        text: chatInput,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setChatInput("");
  };

  const stagesMeta: { key: keyof PipelineData; label: string; badge: string }[] = [
    { key: "NOVO", label: "Novo Lead", badge: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
    { key: "CATALOGO_VISUALIZADO", label: "Catálogo", badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" },
    { key: "VTON_PROVADO", label: "VTON Provado", badge: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30" },
    { key: "CARRINHO_CRIADO", label: "Carrinho", badge: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
    { key: "PAGO", label: "PIX Pago", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
    { key: "DESISTENCIA", label: "Resgate", badge: "bg-rose-500/10 text-rose-400 border-rose-500/30" },
  ];

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
                <p className="text-[11px] text-slate-500 font-medium">WhatsApp Enterprise CRM</p>
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
              
              <Link href="/catalog" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 text-xs font-medium transition-all">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                <span>Catálogo & Provador VTON</span>
              </Link>

              <Link href="/whatsapp-crm" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-medium text-xs shadow-sm transition-all">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <span>WhatsApp CRM & Kanban</span>
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
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
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>IA WhatsApp</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              95.4% Autônoma
            </span>
          </div>
        </div>
      </aside>

      {/* Conteúdo Central */}
      <main className="flex-1 overflow-hidden flex flex-col bg-[#070b12]">
        
        {/* Top Header */}
        <header className="px-8 py-5 border-b border-slate-800/80 flex items-center justify-between bg-[#080d19]">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-extrabold text-white tracking-tight">WhatsApp Enterprise CRM & Pipeline</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Live Omni-Channel
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Supervisão de conversas ativas, rastreamento de provadores VTON e intervenção dos administradores em tempo real.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              Taxa de Resolução IA: <strong className="text-emerald-400 font-bold">95.4%</strong>
            </span>
            <button
              onClick={fetchPipeline}
              className="text-xs px-3.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 transition-colors font-semibold"
            >
              Sincronizar
            </button>
          </div>
        </header>

        {/* Layout Dividido: 6 Colunas Kanban + Painel Lateral de Chat ao Vivo */}
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          
          {/* Lado Esquerdo: Kanban Pipeline (8 colunas) */}
          <div className="col-span-8 p-6 overflow-x-auto border-r border-slate-800/80 bg-[#070b12]">
            <div className="grid grid-cols-6 gap-3 h-full items-start min-w-[850px]">
              {stagesMeta.map((col) => {
                const leads = pipeline[col.key] || [];
                return (
                  <div
                    key={col.key}
                    className="bg-[#090e1b] border border-slate-800/90 rounded-2xl p-2.5 flex flex-col h-[calc(100vh-140px)] shadow-lg"
                  >
                    {/* Header da Coluna */}
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800/80">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${col.badge}`}>
                        {col.label}
                      </span>
                      <span className="text-xs font-mono text-slate-400 font-bold">
                        {leads.length}
                      </span>
                    </div>

                    {/* Cards de Leads */}
                    <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                      {leads.length === 0 ? (
                        <div className="text-center py-10 text-[11px] text-slate-600 font-medium italic">Sem leads</div>
                      ) : (
                        leads.map((lead) => {
                          const isSelected = selectedLead?.id === lead.id;
                          return (
                            <div
                              key={lead.id}
                              onClick={() => handleSelectLead(lead)}
                              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-cyan-950/25 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30"
                                  : "bg-[#0c1222] border-slate-800/80 hover:border-slate-700"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-bold text-white tracking-tight truncate max-w-[100px]">{lead.customer_name || "Torcedor"}</span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                  lead.needs_human_intervention ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"
                                }`}>
                                  {lead.needs_human_intervention ? "Humano" : "IA"}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-[10px] text-cyan-400 font-medium mb-1">
                                <span>⚽ {lead.favorite_club || "Geral"}</span>
                                <span className="bg-slate-800 px-1 py-0.5 rounded text-slate-300 font-mono">{lead.preferred_size || "M"}</span>
                              </div>

                              <div className="text-[10px] font-mono text-slate-400 mb-2 truncate">{lead.whatsapp_number}</div>

                              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/60">
                                <span className="font-bold text-emerald-400">
                                  R$ {(lead.total_value_cents / 100).toFixed(2).replace(".", ",")}
                                </span>
                                <span className="text-[10px] text-slate-500">{lead.last_interaction}</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lado Direito: Chat WhatsApp em Tempo Real (4 colunas) */}
          <div className="col-span-4 bg-[#080d19] flex flex-col justify-between overflow-hidden">
            {selectedLead ? (
              <>
                {/* Header do Chat */}
                <div className="p-4 border-b border-slate-800/80 bg-[#090f1d] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-cyan-400">
                      {selectedLead.customer_name?.substring(0, 2).toUpperCase() || "WA"}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        <span>{selectedLead.customer_name || "Cliente WhatsApp"}</span>
                        {selectedLead.favorite_club && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                            {selectedLead.favorite_club}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">{selectedLead.whatsapp_number}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleHandoff(selectedLead)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedLead.needs_human_intervention
                        ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md"
                        : "bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                    }`}
                  >
                    {selectedLead.needs_human_intervention ? "Devolver à IA" : "Assumir Chat"}
                  </button>
                </div>

                {/* Balões de Mensagem */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-[#070b14]/70">
                  {messages.map((m, idx) => {
                    const isUser = m.sender === "lead";
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col ${isUser ? "items-start" : "items-end"}`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                            isUser
                              ? "bg-slate-800 text-slate-200 border border-slate-700/60 rounded-tl-sm"
                              : m.sender === "ia"
                              ? "bg-cyan-950/40 text-cyan-200 border border-cyan-800/40 rounded-tr-sm"
                              : "bg-emerald-950/40 text-emerald-200 border border-emerald-800/40 rounded-tr-sm"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-75 font-bold uppercase">
                            <span>{isUser ? "Cliente" : m.sender === "ia" ? "🤖 Mantto IA" : "👤 Atendente"}</span>
                            <span>{m.time}</span>
                          </div>
                          <p>{m.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input de Envio */}
                <form onSubmit={handleSendMessage} className="p-3.5 border-t border-slate-800/80 bg-[#090f1d] flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Digite uma mensagem ou resposta manual..."
                    className="flex-1 bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    Enviar
                  </button>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center flex-1 text-xs text-slate-500">
                Selecione um lead no Kanban para abrir o chat.
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
