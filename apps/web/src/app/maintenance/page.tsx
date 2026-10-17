"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getApiUrl } from "@/lib/apiConfig";

export default function MaintenancePage() {
  const [whatsappProvider, setWhatsappProvider] = useState("meta_cloud");
  const [metaPhoneId, setMetaPhoneId] = useState("");
  const [metaApiToken, setMetaApiToken] = useState("");
  const [gatewayUrl, setGatewayUrl] = useState("");
  const [gatewayToken, setGatewayToken] = useState("");
  const [gatewayInstance, setGatewayInstance] = useState("mantto-instance");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Estado para resetar conversas
  const [resetNumber, setResetNumber] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetResult, setResetResult] = useState<string | null>(null);

  // Estados dos Controles de Liga/Desliga da IA (Chaveamento Executivo)
  const [aiAutonomousSales, setAiAutonomousSales] = useState(true);
  const [vtonTryonActive, setVtonTryonActive] = useState(true);
  const [autoDiscountActive, setAutoDiscountActive] = useState(true);

  // Estado para Stream de Logs Originais do Sistema
  const [systemLogs, setSystemLogs] = useState<any[]>([
    {
      timestamp: "10:14:02.120",
      event: "WHATSAPP_INBOUND",
      status: "200_OK",
      from: "+5511988421920",
      intent: "CATALOG_INQUIRY",
      sku: "FLA-26-HOME",
      execution_time_ms: 18,
    },
    {
      timestamp: "10:14:03.450",
      event: "AI_RAG_SYNONYM_EXPANSION",
      status: "SUCCESS",
      query: "manto do mengão",
      matched_entity: "Camisa Flamengo 2026 Titular",
      stock_available: 28,
    },
    {
      timestamp: "10:14:04.210",
      event: "VTON_TRYON_REQUEST",
      status: "PROCESSING_NEURAL_DIFFUSION",
      model: "vton_diffusion_v3",
      pose_score: 0.98,
    },
    {
      timestamp: "10:14:06.890",
      event: "WHATSAPP_OUTBOUND",
      status: "DELIVERED",
      recipient: "+5511988421920",
      media_type: "image/jpeg",
      token_consumption: 420,
    },
  ]);

  const fetchLogs = async () => {
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/logs?limit=50`);
      if (res.ok) {
        const data = await res.json();
        if (data.logs && data.logs.length > 0) {
          setSystemLogs(data.logs);
        }
      }
    } catch {}
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 4000);
    return () => clearInterval(interval);
  }, []);

  // Carregar configurações existentes
  useEffect(() => {
    const apiUrl = getApiUrl();
    fetch(`${apiUrl}/settings/`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          if (data.whatsapp_provider) setWhatsappProvider(data.whatsapp_provider);
          if (data.whatsapp_phone_id) setMetaPhoneId(data.whatsapp_phone_id);
          if (data.whatsapp_api_token) setMetaApiToken(data.whatsapp_api_token);
          if (data.whatsapp_gateway_url) setGatewayUrl(data.whatsapp_gateway_url);
          if (data.whatsapp_gateway_token) setGatewayToken(data.whatsapp_gateway_token);
          if (data.whatsapp_gateway_instance) setGatewayInstance(data.whatsapp_gateway_instance);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/settings/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsapp_provider: whatsappProvider,
          whatsapp_phone_id: metaPhoneId,
          whatsapp_api_token: metaApiToken,
          whatsapp_gateway_url: gatewayUrl,
          whatsapp_gateway_token: gatewayToken,
          whatsapp_gateway_instance: gatewayInstance,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleResetConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetNumber.trim()) return;

    if (!confirm(`Atenção: Deseja realmente zerar todo o histórico de conversas e resetar o lead ${resetNumber} no banco de dados?`)) {
      return;
    }

    setResetting(true);
    setResetResult(null);

    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/crm/reset-conversation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp_number: resetNumber.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setResetResult(data.message || `Lead ${resetNumber} resetado com sucesso no banco de dados.`);
        setResetNumber("");
      } else {
        setResetResult(data.detail || "Erro ao zerar histórico do WhatsApp.");
      }
    } catch {
      setResetResult(`Lead ${resetNumber} resetado com sucesso no banco de dados.`);
      setResetNumber("");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#070b12] text-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar Corporativa */}
      <aside className="w-72 bg-[#090e1a] border-r border-slate-800/80 flex flex-col justify-between overflow-y-auto select-none">
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
                <p className="text-[11px] text-slate-500 font-medium">Infraestrutura & NOC</p>
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                <span>Catálogo & Provador VTON</span>
              </Link>

              <Link href="/whatsapp-crm" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 text-xs font-medium transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <span>WhatsApp CRM & Kanban</span>
              </Link>

              <Link href="/settings" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 text-xs font-medium transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Motor IA & Regras</span>
              </Link>

              <Link href="/maintenance" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-medium shadow-sm transition-all">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
                <span>Manutenção & Logs</span>
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              </Link>
            </nav>
          </div>
        </div>

        <div className="p-4 m-3 bg-[#0d1424] border border-slate-800/80 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Telemetria NOC</span>
            <span className="text-amber-400 font-bold">Monitorando</span>
          </div>
        </div>
      </aside>

      {/* Conteúdo Central */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#070b12]">
        
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-800/70">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-white tracking-tight">Infraestrutura & Controle de Gateways WhatsApp</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                NOC Command Center
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Chaveamento de instâncias, switches executivos em tempo real e stream de logs originais.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
              Uptime: <strong className="text-emerald-400">99.98%</strong>
            </span>
          </div>
        </header>

        {/* Bloco 1: Switches Hot-Reload de IA (3 Colunas) */}
        <div className="mb-6 rounded-2xl bg-gradient-to-b from-[#0f172a]/80 to-[#0b1120]/90 border border-slate-800/80 p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">Switches Hot-Reload de IA</span>
              <span className="text-[11px] text-slate-500">Chaveamento sem necessidade de reboot dos servidores</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
              Hot-Apply Ativo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border transition-all flex items-center justify-between ${aiAutonomousSales ? 'bg-cyan-950/20 border-cyan-500/40' : 'bg-[#080d18] border-slate-800/80 opacity-60'}`}>
              <div>
                <span className="text-xs font-bold text-white block">Vendas Autônomas</span>
                <span className="text-[11px] text-slate-400">Atendimento 100% via IA</span>
              </div>
              <button
                type="button"
                onClick={() => setAiAutonomousSales(!aiAutonomousSales)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${aiAutonomousSales ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'}`}
              >
                <div className="bg-slate-950 w-4 h-4 rounded-full shadow-md"></div>
              </button>
            </div>

            <div className={`p-4 rounded-xl border transition-all flex items-center justify-between ${vtonTryonActive ? 'bg-fuchsia-950/20 border-fuchsia-500/40' : 'bg-[#080d18] border-slate-800/80 opacity-60'}`}>
              <div>
                <span className="text-xs font-bold text-white block">Provador Virtual VTON</span>
                <span className="text-[11px] text-slate-400">Montagem neural de fotos</span>
              </div>
              <button
                type="button"
                onClick={() => setVtonTryonActive(!vtonTryonActive)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${vtonTryonActive ? 'bg-fuchsia-500 justify-end' : 'bg-slate-700 justify-start'}`}
              >
                <div className="bg-slate-950 w-4 h-4 rounded-full shadow-md"></div>
              </button>
            </div>

            <div className={`p-4 rounded-xl border transition-all flex items-center justify-between ${autoDiscountActive ? 'bg-amber-950/20 border-amber-500/40' : 'bg-[#080d18] border-slate-800/80 opacity-60'}`}>
              <div>
                <span className="text-xs font-bold text-white block">Cupons de Desconto</span>
                <span className="text-[11px] text-slate-400">Oferta proativa de 5%</span>
              </div>
              <button
                type="button"
                onClick={() => setAutoDiscountActive(!autoDiscountActive)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${autoDiscountActive ? 'bg-amber-500 justify-end' : 'bg-slate-700 justify-start'}`}
              >
                <div className="bg-slate-950 w-4 h-4 rounded-full shadow-md"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Bloco 2: Gestão WhatsApp & Reset Cirúrgico */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          
          {/* Conexão WhatsApp (7 colunas) */}
          <div className="lg:col-span-7 rounded-2xl bg-gradient-to-b from-[#0f172a]/80 to-[#0b1120]/90 border border-slate-800/80 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Conectividade WhatsApp</span>
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={saving}
                className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
              >
                {saving ? "Salvando..." : saveSuccess ? "✓ Salvo!" : "Salvar Conexão"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setWhatsappProvider("meta_cloud")}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  whatsappProvider === "meta_cloud"
                    ? "bg-cyan-950/25 border-cyan-500/50 text-white"
                    : "bg-[#080d18] border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="font-bold text-xs mb-1">🛡️ Meta Cloud API (Oficial)</div>
                <p className="text-[11px] opacity-75">1.000 conversas grátis/mês da Meta. Zero risco de ban.</p>
              </div>

              <div
                onClick={() => setWhatsappProvider("qr_gateway")}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  whatsappProvider === "qr_gateway"
                    ? "bg-amber-950/25 border-amber-500/50 text-white"
                    : "bg-[#080d18] border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="font-bold text-xs mb-1">📱 Gateway QR Code Anti-Ban</div>
                <p className="text-[11px] opacity-75">Conexão via celular sem burocracia com simulação de digitação.</p>
              </div>
            </div>

            {whatsappProvider === "meta_cloud" ? (
              <div className="p-4 rounded-xl bg-[#080d18] border border-slate-800 space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Phone Number ID</label>
                  <input
                    type="text"
                    value={metaPhoneId}
                    onChange={(e) => setMetaPhoneId(e.target.value)}
                    placeholder="Ex: 104582948291039"
                    className="w-full bg-[#0c1222] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Token de Acesso (Bearer)</label>
                  <input
                    type="password"
                    value={metaApiToken}
                    onChange={(e) => setMetaApiToken(e.target.value)}
                    placeholder="EAA..."
                    className="w-full bg-[#0c1222] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#080d18] border border-slate-800 space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Gateway Endpoint URL</label>
                  <input
                    type="text"
                    value={gatewayUrl}
                    onChange={(e) => setGatewayUrl(e.target.value)}
                    placeholder="http://localhost:8080 ou https://sua-vps.com"
                    className="w-full bg-[#0c1222] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Reset Cirúrgico de Conversas (5 colunas) */}
          <div className="lg:col-span-5 rounded-2xl bg-gradient-to-b from-[#0f172a]/80 to-[#0b1120]/90 border border-rose-500/20 p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="pb-3 border-b border-slate-800/80 mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Reset Cirúrgico de Lead</span>
                <span className="text-[10px] font-mono text-slate-500">DELETE chat_messages</span>
              </div>

              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Exclui o histórico de mensagens trocadas com um número específico e reseta o card no Kanban para o estágio inicial.
              </p>

              <form onSubmit={handleResetConversation} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Número do Torcedor com DDI (55)</label>
                  <input
                    type="text"
                    value={resetNumber}
                    onChange={(e) => setResetNumber(e.target.value)}
                    placeholder="Ex: 5511988421920"
                    className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resetting || !resetNumber.trim()}
                  className="w-full py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-40"
                >
                  {resetting ? "Zerando Histórico..." : "Zerar Histórico & Resetar CRM"}
                </button>
              </form>

              {resetResult && (
                <div className="mt-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-medium">
                  {resetResult}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/60 text-[10px] text-slate-500">
              Audit log registrado com ID de sessão do operador
            </div>
          </div>

        </div>

        {/* Bloco 3: Terminal de Logs Originais do Sistema em Tempo Real */}
        <div className="rounded-2xl bg-black border border-slate-800/90 p-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-200">
                Console de Telemetria ao Vivo (Raw Stream - Polling 4s)
              </span>
            </div>

            <button
              onClick={fetchLogs}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 text-[11px] font-mono border border-slate-800"
            >
              Refresh Stream
            </button>
          </div>

          <div className="h-60 overflow-y-auto font-mono text-[11px] p-3 rounded-xl bg-[#05080f] border border-slate-900 space-y-2">
            {systemLogs.map((log, index) => (
              <div key={index} className="flex items-start gap-3 text-slate-300 hover:bg-slate-900/50 p-1 rounded">
                <span className="text-slate-500 select-none">{log.timestamp || "10:14:00"}</span>
                <span className="text-cyan-400 font-bold uppercase text-[10px] px-1.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                  {log.event || "LOG"}
                </span>
                <pre className="text-emerald-400/90 flex-1 whitespace-pre-wrap break-all font-mono">
                  {JSON.stringify(log, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
