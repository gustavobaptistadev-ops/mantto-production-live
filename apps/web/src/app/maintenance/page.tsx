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

  // Estado para Stream de Logs Originais do Sistema
  const [systemLogs, setSystemLogs] = useState<any[]>([]);

  const fetchLogs = async () => {
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/logs?limit=50`);
      if (res.ok) {
        const data = await res.json();
        if (data.logs) {
          setSystemLogs(data.logs);
        }
      }
    } catch (e) {
      console.log("Aviso: Polling de logs aguardando conexão.");
    }
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
      .catch((err) => console.log("Aviso: Falha ao carregar configurações de manutenção:", err));
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
    } catch (err) {
      console.error("Erro ao salvar dados de manutenção:", err);
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
        setResetResult(data.message);
        setResetNumber("");
      } else {
        setResetResult(data.detail || "Erro ao zerar histórico do WhatsApp.");
      }
    } catch (err: any) {
      setResetResult(`Erro na requisição: ${err.message}`);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar Global */}
      <header className="border-b border-slate-800 bg-[#0f172a]/70 backdrop-blur-md px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-900 font-black italic shadow-[0_0_15px_rgba(6,182,212,0.3)]">M</div>
            <span className="text-xl font-bold tracking-tight text-white">
              MANTTO <span className="text-cyan-400 font-light">COMMERCE</span>
            </span>
          </div>

          <nav className="flex items-center gap-5 text-sm font-medium">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/catalog" className="text-slate-400 hover:text-white transition-colors">Catálogo & VTON</Link>
            <Link href="/whatsapp-crm" className="text-slate-400 hover:text-white transition-colors">WhatsApp CRM</Link>
            <Link href="/settings" className="text-slate-400 hover:text-white transition-colors">Motor IA & Config</Link>
            <Link href="/maintenance" className="text-amber-400 border-b-2 border-amber-400 pb-1 font-semibold flex items-center gap-1">
              <span>🛠️</span> Manutenção
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Painel de Manutenção
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[1300px] w-full mx-auto p-8 animate-in fade-in duration-500">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>🛠️</span> Manutenção do Sistema & Canais WhatsApp
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Gerencie instâncias de conexão, chaveie entre API Oficial e Gateways QR, e efetue resets cirúrgicos de banco de dados.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Seção 1: Configurações de WhatsApp (7 colunas) */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSaveSettings} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>📡</span> Conectividade do WhatsApp
                  </h2>
                  <p className="text-xs text-slate-400">Escolha o método de envio e recebimento de mensagens da sua loja.</p>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {saving ? "Salvando..." : saveSuccess ? "✓ Salvo!" : "Salvar Conexão"}
                </button>
              </div>

              {/* Seletor de Modo: Meta Oficial vs Gateway QR */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div
                  onClick={() => setWhatsappProvider("meta_cloud")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    whatsappProvider === "meta_cloud"
                      ? "bg-cyan-500/10 border-cyan-500/40 text-white"
                      : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm mb-1">
                    <span>🛡️</span> Meta Cloud API (Oficial)
                  </div>
                  <p className="text-[11px] opacity-80 leading-relaxed">
                    Zero risco de banimento. 1.000 chats grátis/mês da Meta. Recomendado para produção.
                  </p>
                </div>

                <div
                  onClick={() => setWhatsappProvider("qr_gateway")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    whatsappProvider === "qr_gateway"
                      ? "bg-amber-500/10 border-amber-500/40 text-white"
                      : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm mb-1">
                    <span>📱</span> Gateway QR (OpenWA / Evolution)
                  </div>
                  <p className="text-[11px] opacity-80 leading-relaxed">
                    Conexão rápida por QR Code via celular sem burocracia do Facebook. Possui blindagem anti-ban ativa.
                  </p>
                </div>
              </div>

              {/* Formulário Condicional */}
              {whatsappProvider === "meta_cloud" ? (
                <div className="space-y-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Parâmetros Meta Cloud Developers</span>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number ID</label>
                    <input
                      type="text"
                      value={metaPhoneId}
                      onChange={(e) => setMetaPhoneId(e.target.value)}
                      placeholder="Ex: 104582948291039"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Access Token Oficial (Bearer)</label>
                    <input
                      type="password"
                      value={metaApiToken}
                      onChange={(e) => setMetaApiToken(e.target.value)}
                      placeholder="EAA..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl text-xs text-cyan-300">
                    💡 <strong>Webhook Callback URL:</strong> <code className="bg-slate-900 px-1 py-0.5 rounded">https://mantto-commerce-api.onrender.com/whatsapp/webhook</code>
                    <br />Token de verificação: <code className="bg-slate-900 px-1 py-0.5 rounded">mantto_secret_token_123</code>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Parâmetros Gateway QR-Code (OpenWA / Evolution)</span>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Gateway Endpoint URL</label>
                    <input
                      type="text"
                      value={gatewayUrl}
                      onChange={(e) => setGatewayUrl(e.target.value)}
                      placeholder="http://localhost:8080 ou https://sua-vps.com"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">API Key / Token</label>
                      <input
                        type="password"
                        value={gatewayToken}
                        onChange={(e) => setGatewayToken(e.target.value)}
                        placeholder="Chave de autenticação"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Nome da Instância</label>
                      <input
                        type="text"
                        value={gatewayInstance}
                        onChange={(e) => setGatewayInstance(e.target.value)}
                        placeholder="mantto-instance"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Seção 2: Ferramenta Cirúrgica de Reset de Conversas (5 colunas) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/60 border border-rose-500/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                <span>🗑️</span> Resetar Conversas de um Número
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Exclui o histórico de mensagens salvas na tabela <code className="text-rose-400 bg-rose-950/40 px-1 py-0.5 rounded">chat_messages</code> e reseta a sessão do lead no Kanban para o estado inicial (NOVO).
              </p>

              <form onSubmit={handleResetConversation} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Número de WhatsApp do Cliente</label>
                  <input
                    type="text"
                    value={resetNumber}
                    onChange={(e) => setResetNumber(e.target.value)}
                    placeholder="Ex: 5511999998888 ou 5521..."
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Insira o número completo com DDI (55) e DDD.</span>
                </div>

                <button
                  type="submit"
                  disabled={resetting || !resetNumber.trim()}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-[0_0_15px_rgba(225,29,72,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  {resetting ? "Zerando Banco de Dados..." : "Zerar Conversas & Resetar Lead"}
                </button>
              </form>

              {resetResult && (
                <div className="mt-4 p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-emerald-300 animate-in fade-in">
                  {resetResult}
                </div>
              )}

              <div className="mt-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 text-[11px] text-slate-400 space-y-2">
                <p className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">O que esta ação faz:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Limpa as mensagens de IA trocadas com o cliente.</li>
                  <li>Retira o lead do atendimento manual e devolve para a IA.</li>
                  <li>Reseta a contagem de valor e move o card para "Novos Contatos".</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 3: Terminal de Logs Originais do Sistema em Tempo Real */}
        <div className="mt-10 bg-black/80 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              </div>
              <h2 className="text-sm font-bold text-slate-200 font-mono tracking-tight flex items-center gap-2">
                <span>📟</span> Terminal de Logs do Sistema (Stream Original Sem Resumo)
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Ao Vivo (4s polling)
              </span>
              <button
                type="button"
                onClick={fetchLogs}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition-colors"
              >
                Atualizar Agora
              </button>
            </div>
          </div>

          <div className="h-80 overflow-y-auto font-mono text-xs bg-slate-950/90 rounded-xl p-4 space-y-2 border border-slate-900 shadow-inner no-scrollbar">
            {systemLogs.length === 0 ? (
              <div className="text-slate-600 italic py-8 text-center">Nenhum evento registrado ainda. Navegue pelo painel para gerar logs...</div>
            ) : (
              systemLogs.map((log, index) => (
                <div key={index} className="text-slate-300 hover:bg-slate-900/60 p-1.5 rounded transition-colors flex gap-3 items-start border-b border-slate-900/40">
                  <span className="text-slate-500 select-none whitespace-nowrap text-[11px]">{log.timestamp || "—"}</span>
                  <span className="text-cyan-400 font-bold uppercase text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 whitespace-nowrap">
                    {log.event || "LOG"}
                  </span>
                  <pre className="text-emerald-400/90 flex-1 whitespace-pre-wrap break-all text-[11px]">
                    {JSON.stringify(log, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
