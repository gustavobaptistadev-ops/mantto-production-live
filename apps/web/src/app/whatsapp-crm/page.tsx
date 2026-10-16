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
}

interface PipelineData {
  NOVO: Lead[];
  CATALOGO_VISUALIZADO: Lead[];
  CARRINHO_CRIADO: Lead[];
  PAGO: Lead[];
  DESISTENCIA: Lead[];
}

export default function WhatsAppCRMPage() {
  const [pipeline, setPipeline] = useState<PipelineData>({
    NOVO: [],
    CATALOGO_VISUALIZADO: [],
    CARRINHO_CRIADO: [],
    PAGO: [],
    DESISTENCIA: [],
  });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ sender: "lead" | "agent" | "ia"; text: string; time: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar dados reais do backend
  const fetchPipeline = async () => {
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/crm/pipeline`);
      if (res.ok) {
        const data = await res.json();
        setPipeline(data.pipeline);
      }
    } catch (e) {
      console.error("Erro ao buscar pipeline:", e);
    }
  };

  useEffect(() => {
    fetchPipeline();
    const interval = setInterval(fetchPipeline, 10000);
    return () => clearInterval(interval);
  }, []);

  // Assumir ou devolver o atendimento
  const handleToggleHandoff = async (lead: Lead) => {
    const nextState = !lead.needs_human_intervention;
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/crm/handoff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsapp_number: lead.whatsapp_number,
          take_over: nextState,
        }),
      });
      if (res.ok) {
        await fetchPipeline();
        if (selectedLead && selectedLead.whatsapp_number === lead.whatsapp_number) {
          setSelectedLead({ ...selectedLead, needs_human_intervention: nextState });
        }
      }
    } catch (e) {
      console.error("Erro ao alternar atendimento:", e);
    }
  };

  // Mover lead de coluna no Kanban
  const handleMoveStage = async (lead: Lead, newStage: string) => {
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/crm/move-stage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsapp_number: lead.whatsapp_number,
          new_stage: newStage,
        }),
      });
      if (res.ok) {
        fetchPipeline();
      }
    } catch (e) {
      console.error("Erro ao mover lead:", e);
    }
  };

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setMessages([
      {
        sender: "lead",
        text: "Olá! Gostaria de saber mais sobre a Camisa do Flamengo 2026 tamanho G.",
        time: "10:14",
      },
      {
        sender: "ia",
        text: "Fala, tudo bem? Temos a Camisa Oficial do Flamengo 2026 no tamanho G pronta para envio! Deseja que eu calcule o frete ou separe uma unidade para você?",
        time: "10:14",
      },
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedLead) return;

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

  const stagesMeta: { key: keyof PipelineData; label: string; color: string }[] = [
    { key: "NOVO", label: "Novos Contatos", color: "border-sky-500/40 text-sky-400" },
    { key: "CATALOGO_VISUALIZADO", label: "Catálogo Enviado", color: "border-indigo-500/40 text-indigo-400" },
    { key: "CARRINHO_CRIADO", label: "Negociação / Carrinho", color: "border-amber-500/40 text-amber-400" },
    { key: "PAGO", label: "Venda Fechada (Pago)", color: "border-emerald-500/40 text-emerald-400" },
    { key: "DESISTENCIA", label: "Desistência / Repescagem", color: "border-rose-500/40 text-rose-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar Global */}
      <header className="border-b border-slate-800 bg-[#0f172a]/70 backdrop-blur-md px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-900 font-black italic">M</div>
            <span className="text-xl font-bold tracking-tight text-white">
              MANTTO <span className="text-cyan-400 font-light">COMMERCE</span>
            </span>
          </div>

          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/catalog" className="text-slate-400 hover:text-white transition-colors">Catálogo & VTON</Link>
            <Link href="/whatsapp-crm" className="text-cyan-400 border-b-2 border-cyan-400 pb-1">WhatsApp & Kanban</Link>
            <Link href="/settings" className="text-slate-400 hover:text-white transition-colors">Motor IA & Config</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            WhatsApp Bot Conectado
          </span>
        </div>
      </header>

      {/* Main Grid: Kanban + Chat ao Vivo */}
      <div className="flex-1 p-6 grid grid-cols-1 xl:grid-cols-12 gap-6 overflow-hidden">
        {/* Lado Esquerdo: Kanban Pipeline (8 colunas) */}
        <section className="xl:col-span-8 flex flex-col gap-4 overflow-x-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white">Pipeline de Vendas & WhatsApp CRM</h1>
              <p className="text-sm text-slate-400">Arraste ou acompanhe a evolução dos leads atendidos pela IA e pelos vendedores.</p>
            </div>
            <button
              onClick={fetchPipeline}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors text-slate-300"
            >
              Atualizar Cards
            </button>
          </div>

          {/* Colunas do Kanban */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1 items-start">
            {stagesMeta.map((col) => {
              const leadsInCol = pipeline[col.key] || [];
              return (
                <div
                  key={col.key}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 flex flex-col min-h-[500px]"
                >
                  {/* Cabeçalho da Coluna */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                    <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                      {col.label}
                    </span>
                    <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold">
                      {leadsInCol.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                    {leadsInCol.length === 0 ? (
                      <div className="text-center py-8 text-xs text-slate-600 font-medium">Nenhum lead</div>
                    ) : (
                      leadsInCol.map((lead) => (
                        <div
                          key={lead.id}
                          onClick={() => handleSelectLead(lead)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                            selectedLead?.id === lead.id
                              ? "bg-slate-800 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                              : "bg-slate-800/40 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/80"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-white text-sm tracking-tight">{lead.whatsapp_number}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                lead.needs_human_intervention
                                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                                  : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                              }`}
                            >
                              {lead.needs_human_intervention ? "Vendedor" : "IA Atendendo"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
                            <span>Sentimento:</span>
                            <span
                              className={`font-semibold ${
                                lead.sentiment === "FRUSTRADO"
                                  ? "text-rose-400"
                                  : lead.sentiment === "POSITIVO"
                                  ? "text-emerald-400"
                                  : "text-slate-300"
                              }`}
                            >
                              {lead.sentiment}
                            </span>
                          </div>

                          {lead.total_value_cents > 0 && (
                            <div className="text-xs font-black text-emerald-400 mb-2">
                              R$ {(lead.total_value_cents / 100).toFixed(2).replace(".", ",")}
                            </div>
                          )}

                          {/* Ações Rápidas do Card */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 mt-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleHandoff(lead);
                              }}
                              className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                                lead.needs_human_intervention
                                  ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                                  : "bg-amber-600 hover:bg-amber-500 text-white"
                              }`}
                            >
                              {lead.needs_human_intervention ? "Devolver para IA" : "Assumir Chat"}
                            </button>

                            {/* Dropdown de mudar estágio */}
                            <select
                              value={lead.stage}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => handleMoveStage(lead, e.target.value)}
                              className="bg-slate-900 border border-slate-700 text-[10px] text-slate-300 rounded px-1.5 py-0.5"
                            >
                              <option value="NOVO">Novo</option>
                              <option value="CATALOGO_VISUALIZADO">Catálogo</option>
                              <option value="CARRINHO_CRIADO">Carrinho</option>
                              <option value="PAGO">Pago</option>
                              <option value="DESISTENCIA">Desistência</option>
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Lado Direito: Central de Atendimento & Interação WhatsApp (4 colunas) */}
        <section className="xl:col-span-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col h-[750px] overflow-hidden">
          {selectedLead ? (
            <>
              {/* Topo do Chat */}
              <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold">
                    {selectedLead.whatsapp_number.slice(-2)}
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-sm">{selectedLead.whatsapp_number}</h2>
                    <p className="text-xs text-slate-400">
                      Estágio: <span className="text-cyan-400 font-semibold">{selectedLead.stage}</span>
                    </p>
                  </div>
                </div>

                {/* Botão de Controle Principal: Assumir / Devolver */}
                <button
                  onClick={() => handleToggleHandoff(selectedLead)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-md ${
                    selectedLead.needs_human_intervention
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                      : "bg-amber-600 hover:bg-amber-500 text-white"
                  }`}
                >
                  {selectedLead.needs_human_intervention ? "🤖 Devolver para IA" : "👤 Assumir Atendimento"}
                </button>
              </div>

              {/* Status Banner */}
              <div
                className={`px-4 py-2 text-xs font-semibold flex items-center justify-between ${
                  selectedLead.needs_human_intervention
                    ? "bg-amber-500/10 text-amber-300 border-b border-amber-500/20"
                    : "bg-cyan-500/10 text-cyan-300 border-b border-cyan-500/20"
                }`}
              >
                <span>
                  {selectedLead.needs_human_intervention
                    ? "⚠️ Modo Humano Ativo: A IA está em pausa para você falar diretamente."
                    : "✨ Modo IA Ativo: A vendedora autônoma está conduzindo a negociação."}
                </span>
              </div>

              {/* Área de Mensagens */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#080d1a]">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      msg.sender === "lead" ? "items-start" : "items-end"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.sender === "lead"
                          ? "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700"
                          : msg.sender === "ia"
                          ? "bg-cyan-950/80 text-cyan-100 border border-cyan-800/60 rounded-br-none"
                          : "bg-emerald-900 text-white rounded-br-none border border-emerald-700"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold opacity-70 uppercase">
                          {msg.sender === "lead" ? "Cliente" : msg.sender === "ia" ? "🤖 IA Mantto" : "👤 Você (Vendedor)"}
                        </span>
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                      <span className="text-[10px] opacity-50 block text-right mt-1">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Arsenal de Negociação Rápida do Vendedor (Top 10 Toolkit) */}
              <div className="px-3 py-2 bg-slate-900/90 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] font-semibold no-scrollbar">
                <span className="text-slate-500 uppercase tracking-wider text-[9px] font-bold px-1">Negociação:</span>
                <button
                  type="button"
                  onClick={() => setChatInput("🎉 Boas notícias! Consegui liberar um cupom exclusivo de 5% de desconto especial para sua primeira compra agora!")}
                  className="px-2.5 py-1 rounded-lg bg-sky-950/60 border border-sky-800/60 text-sky-300 hover:bg-sky-900/80 transition-all flex items-center gap-1 whitespace-nowrap active:scale-95"
                >
                  <span>🏷️</span> Cupom 1ª Compra (-5%)
                </button>
                <button
                  type="button"
                  onClick={() => setChatInput("🔥 Vi que seu pedido ficou pendente. Consegui autorização da gerência para 10% de desconto imediato se fecharmos hoje via PIX!")}
                  className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-300 hover:bg-amber-900/80 transition-all flex items-center gap-1 whitespace-nowrap active:scale-95"
                >
                  <span>⚡</span> Resgate Carrinho (-10%)
                </button>
                <button
                  type="button"
                  onClick={() => setChatInput("✨ Quer ver como essa peça veste no seu corpo antes de finalizar? Envie uma foto sua de frente que nosso Provador Virtual por IA veste a roupa em você em segundos!")}
                  className="px-2.5 py-1 rounded-lg bg-fuchsia-950/60 border border-fuchsia-800/60 text-fuchsia-300 hover:bg-fuchsia-900/80 transition-all flex items-center gap-1 whitespace-nowrap active:scale-95"
                >
                  <span>🧥</span> Ofertar Provador VTON
                </button>
                <button
                  type="button"
                  onClick={() => setChatInput("💳 Aqui está sua chave PIX Copia-e-Cola para pagamento instantâneo com confirmação em tempo real e separação imediata do pedido!")}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/80 transition-all flex items-center gap-1 whitespace-nowrap active:scale-95"
                >
                  <span>💎</span> Chave PIX Rápida
                </button>
              </div>

              {/* Campo de Envio de Mensagem */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-900 flex gap-2">
                <input
                  type="text"
                  placeholder={
                    selectedLead.needs_human_intervention
                      ? "Digite sua mensagem ou clique num gatilho rápido acima..."
                      : "Assuma o atendimento acima para responder ou usar os atalhos..."
                  }
                  disabled={!selectedLead.needs_human_intervention}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!selectedLead.needs_human_intervention || !chatInput.trim()}
                  className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-colors text-sm"
                >
                  Enviar
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-4 text-cyan-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <h3 className="text-white font-bold mb-1">Nenhum Atendimento Selecionado</h3>
              <p className="text-xs max-w-xs">Clique em qualquer lead no Kanban à esquerda para abrir a conversa do WhatsApp, interagir ou assumir o atendimento da IA.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
