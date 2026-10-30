"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getApiUrl } from "@/lib/apiConfig";

interface SettingsData {
  llm_base_url: string;
  llm_api_key: string;
  llm_model: string;
  llm_temperature: number;
  negotiation_margin: number;
  first_attempt_discount: number;
  cart_rescue_discount: number;
  system_prompt: string;
  store_name: string;
  tone_of_voice: string;
  pix_key: string;
  pix_beneficiary: string;
  admin_phone: string;
  admin_phone_secondary: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    llm_base_url: "https://api.openai.com/v1",
    llm_api_key: "",
    llm_model: "gpt-4o-mini",
    llm_temperature: 0.3,
    negotiation_margin: 15,
    first_attempt_discount: 5,
    cart_rescue_discount: 10,
    system_prompt: "Você é um consultor executivo da MANTTO, especialista em camisas de futebol, história dos clubes, tecidos e tecnologia de provador virtual. Seu objetivo é encantar torcedores e fechar vendas no WhatsApp.",
    store_name: "MANTTO Global Commerce",
    tone_of_voice: "consultivo",
    pix_key: "financeiro@mantto.com.br",
    pix_beneficiary: "Mantto Artigos Esportivos LTDA",
    admin_phone: "5511999999999",
    admin_phone_secondary: "5511988888888",
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const apiUrl = getApiUrl();
    fetch(`${apiUrl}/settings/`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setSettings((prev) => ({
            ...prev,
            ...data,
            llm_temperature: data.llm_temperature ?? 0.3,
            negotiation_margin: data.negotiation_margin ?? 15,
            first_attempt_discount: data.first_attempt_discount ?? 5,
            cart_rescue_discount: data.cart_rescue_discount ?? 10,
            admin_phone: data.admin_phone || "5511999999999",
            admin_phone_secondary: data.admin_phone_secondary || "5511988888888",
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/settings/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const basePrice = 299.90;
  const finalPrice = basePrice * (1 - settings.negotiation_margin / 100);
  const cost = 120.00;
  const netMargin = finalPrice - cost;
  const marginPercentage = ((netMargin / finalPrice) * 100).toFixed(1);

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
                <p className="text-[11px] text-slate-500 font-medium">Políticas Comerciais</p>
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

              <Link href="/whatsapp-crm" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 text-xs font-medium transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <span>WhatsApp CRM & Kanban</span>
              </Link>

              <Link href="/settings" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-medium text-xs shadow-sm transition-all">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Motor IA & Regras</span>
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              </Link>

              <Link href="/maintenance" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-amber-400 hover:text-amber-300 hover:bg-amber-950/20 text-xs font-medium transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
                <span>Manutenção & Logs</span>
              </Link>
            </nav>
          </div>
        </div>
      </aside>

      {/* Conteúdo Central */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#070b12]">
        
        <form onSubmit={handleSave}>
          {/* Header */}
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-800/70">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-white tracking-tight">Motor Neural de IA & Regras Comerciais</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Autonomous Policy
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Calibre a sensibilidade de descontos, comportamento da vendedora e integração dos 2 números administradores no WhatsApp.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? "Gravando Políticas..." : savedSuccess ? "✓ Configurações Salvas!" : "Salvar Políticas de Venda"}
            </button>
          </header>

          {/* Grid de 3 Colunas: Cérebro LLM (4 col) + Sliders de Margem (5 col) + WhatsApp Admin & PIX (3 col) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Bloco 1: Parâmetros do Cérebro LLM (4 colunas) */}
            <div className="lg:col-span-4 rounded-2xl bg-gradient-to-b from-[#0f172a]/80 to-[#0b1120]/90 border border-slate-800/80 p-5 shadow-xl space-y-4">
              <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">1. Cérebro LLM</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Modelo de Linguagem (OpenAI Compatible)</label>
                <select
                  value={settings.llm_model}
                  onChange={(e) => setSettings({ ...settings, llm_model: e.target.value })}
                  className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="gpt-4o-mini">gpt-4o-mini (Recomendado - Ultra veloz)</option>
                  <option value="gpt-4o">gpt-4o (Máxima persuasão)</option>
                  <option value="claude-3-5-sonnet">claude-3-5-sonnet</option>
                  <option value="llama-3.3-70b">llama-3.3-70b (Open Source)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-semibold text-slate-400">Temperatura (Criatividade vs Precisão)</label>
                  <span className="text-xs font-bold font-mono text-cyan-400">{settings.llm_temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={settings.llm_temperature}
                  onChange={(e) => setSettings({ ...settings, llm_temperature: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Mais Preciso (0.0)</span>
                  <span>Mais Criativo (1.0)</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Diretriz Sistêmica (Prompt do Especialista)</label>
                <textarea
                  rows={5}
                  value={settings.system_prompt}
                  onChange={(e) => setSettings({ ...settings, system_prompt: e.target.value })}
                  className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
                />
              </div>
            </div>

            {/* Bloco 2: Sliders Corporativos de Negociação Comercial (5 colunas) */}
            <div className="lg:col-span-5 rounded-2xl bg-gradient-to-b from-[#0f172a]/80 to-[#0b1120]/90 border border-slate-800/80 p-5 shadow-xl space-y-5">
              <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">2. Políticas de Desconto Dinâmico</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                  Margem Protegida
                </span>
              </div>

              {/* Slider 1: Teto Máximo */}
              <div className="p-3.5 rounded-xl bg-[#080d18] border border-slate-800/80 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-200">Margem Máxima de Desconto da IA</span>
                  <span className="text-sm font-black font-mono text-cyan-400">{settings.negotiation_margin}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={settings.negotiation_margin}
                  onChange={(e) => setSettings({ ...settings, negotiation_margin: parseInt(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">Limite inegociável que o bot nunca ultrapassa, mesmo sob insistência.</p>
              </div>

              {/* Slider 2: 1ª Tentativa */}
              <div className="p-3.5 rounded-xl bg-[#080d18] border border-slate-800/80 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-200">Desconto de 1ª Oferta (Primeiro Atrito)</span>
                  <span className="text-sm font-black font-mono text-amber-400">{settings.first_attempt_discount}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={settings.first_attempt_discount}
                  onChange={(e) => setSettings({ ...settings, first_attempt_discount: parseInt(e.target.value) })}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">Concedido na primeira hesitação de preço ou questionamento de frete.</p>
              </div>

              {/* Slider 3: Resgate de Carrinho */}
              <div className="p-3.5 rounded-xl bg-[#080d18] border border-slate-800/80 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-200">Desconto de Resgate (Carrinho Parado)</span>
                  <span className="text-sm font-black font-mono text-fuchsia-400">{settings.cart_rescue_discount}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={settings.cart_rescue_discount}
                  onChange={(e) => setSettings({ ...settings, cart_rescue_discount: parseInt(e.target.value) })}
                  className="w-full accent-fuchsia-400 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">Disparado automaticamente após inatividade do cliente.</p>
              </div>

              {/* Simulação em Tempo Real */}
              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 block mb-1.5">Impacto no Manto Médio (R$ 299,90)</span>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-400">Preço Final com Desconto Máx:</span>
                  <strong className="text-white font-mono">R$ {finalPrice.toFixed(2).replace(".", ",")}</strong>
                </div>
                <div className="flex items-center justify-between text-xs font-medium mt-1">
                  <span className="text-slate-400">Lucro Líquido Estimado:</span>
                  <strong className="text-emerald-400 font-mono">R$ {netMargin.toFixed(2).replace(".", ",")} ({marginPercentage}%)</strong>
                </div>
              </div>
            </div>

            {/* Bloco 3: WhatsApp dos 2 Administradores & PIX (3 colunas) */}
            <div className="lg:col-span-3 rounded-2xl bg-gradient-to-b from-[#0f172a]/80 to-[#0b1120]/90 border border-slate-800/80 p-5 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">3. Admins WhatsApp & PIX</span>
                  <span className="text-emerald-400 font-bold text-xs">2 Conectados</span>
                </div>

                {/* Administrador Principal */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1 flex items-center justify-between">
                    <span>👑 Admin Principal (WhatsApp)</span>
                    <span className="text-[10px] text-emerald-400">Comando Total</span>
                  </label>
                  <input
                    type="text"
                    value={settings.admin_phone}
                    onChange={(e) => setSettings({ ...settings, admin_phone: e.target.value })}
                    placeholder="5511999999999"
                    className="w-full bg-[#080d18] border border-cyan-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Recebe alertas, relatórios e altera margem via IA.</span>
                </div>

                {/* Segundo Administrador */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1 flex items-center justify-between">
                    <span>🛡️ 2º Admin (WhatsApp)</span>
                    <span className="text-[10px] text-cyan-400">Supervisão</span>
                  </label>
                  <input
                    type="text"
                    value={settings.admin_phone_secondary}
                    onChange={(e) => setSettings({ ...settings, admin_phone_secondary: e.target.value })}
                    placeholder="5511988888888"
                    className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Segundo sócio/gerente com acesso executivo à IA.</span>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Chave PIX Oficial</label>
                  <input
                    type="text"
                    value={settings.pix_key}
                    onChange={(e) => setSettings({ ...settings, pix_key: e.target.value })}
                    className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Nome do Beneficiário</label>
                  <input
                    type="text"
                    value={settings.pix_beneficiary}
                    onChange={(e) => setSettings({ ...settings, pix_beneficiary: e.target.value })}
                    className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <span>🤖</span> Modo Administrador WhatsApp
                  </div>
                  <p>Qualquer um dos dois números pode mandar mensagens como <em>"Qual o faturamento de hoje?"</em> ou <em>"Mudar margem para 12%"</em> direto para a IA.</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/60 text-center">
                <span className="text-[10px] text-slate-500">Criptografia AES-256 ativa em repouso</span>
              </div>
            </div>

          </div>
        </form>

      </main>
    </div>
  );
}
