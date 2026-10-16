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
    system_prompt: "Você é uma assistente executiva de vendas da Mantto. Seu objetivo é encantar o cliente, tirar dúvidas e fechar pedidos com agilidade.",
    store_name: "Mantto AI Commerce",
    tone_of_voice: "consultivo",
    pix_key: "",
    pix_beneficiary: "",
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
          }));
        }
      })
      .catch((err) => console.log("Aviso: modo offline ou API subindo", err));
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
    } catch (err) {
      console.error("Falha ao salvar configurações:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar Global Padronizada */}
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
            <Link href="/whatsapp-crm" className="text-slate-400 hover:text-white transition-colors">WhatsApp & Kanban</Link>
            <Link href="/settings" className="text-cyan-400 border-b-2 border-cyan-400 pb-1 font-semibold">Motor IA & Config</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Motor IA Ativo
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Motor de IA & Regras Comerciais</h1>
            <p className="text-slate-400 text-sm mt-1">
              Configure o cérebro da vendedora, teto de descontos dinâmicos e políticas de negociação do WhatsApp.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? "Salvando..." : savedSuccess ? "✓ Salvo com Sucesso!" : "Salvar Configurações"}
          </button>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Coluna Esquerda: Conexão & Cérebro LLM (5 colunas) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <span>🧠</span> Provedor de Inteligência (LLM)
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Compatível com OpenAI, Groq, Anthropic ou FreeAPI local.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Base URL (Endpoint)</label>
                  <input
                    type="text"
                    value={settings.llm_base_url}
                    onChange={(e) => setSettings({ ...settings, llm_base_url: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="https://api.openai.com/v1"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Modelo de IA</label>
                  <input
                    type="text"
                    value={settings.llm_model}
                    onChange={(e) => setSettings({ ...settings, llm_model: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="gpt-4o-mini ou llama3-8b-instruct"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Chave de API (Secret Key)</label>
                  <input
                    type="password"
                    value={settings.llm_api_key}
                    onChange={(e) => setSettings({ ...settings, llm_api_key: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="sk-..."
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Identidade da Loja</label>
                  <input
                    type="text"
                    value={settings.store_name}
                    onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Nome da sua loja"
                  />
                </div>
              </div>
            </div>

            {/* Chaves de Pagamento PIX */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <span>💸</span> Dados do PIX da Loja
              </h2>
              <p className="text-xs text-slate-400 mb-4">A IA usa esses dados para gerar a cobrança oficial no chat.</p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Chave PIX</label>
                  <input
                    type="text"
                    value={settings.pix_key}
                    onChange={(e) => setSettings({ ...settings, pix_key: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="CNPJ, E-mail, Celular ou Chave Aleatória"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Nome do Beneficiário</label>
                  <input
                    type="text"
                    value={settings.pix_beneficiary}
                    onChange={(e) => setSettings({ ...settings, pix_beneficiary: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Razão Social ou Nome do Titular"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Regras de Negociação & Arsenal de Desconto (7 colunas) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🎯</span> Regras Comerciais & Descontos da IA
                </h2>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Top 10 Global Standards
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Controle milimétrico de como a IA negocia, aplica descontos de primeira tentativa e resgata desistências.
              </p>

              {/* Sliders Interativos */}
              <div className="space-y-6">
                {/* 1. Desconto na Primeira Tentativa */}
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-bold text-white">Desconto na 1ª Tentativa (Boas-Vindas)</span>
                      <p className="text-xs text-slate-400">Oferecido caso o cliente hesite ou peça cupom inicial.</p>
                    </div>
                    <span className="text-base font-black text-cyan-400 bg-cyan-500/20 px-3 py-1 rounded-lg">
                      {settings.first_attempt_discount}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={settings.first_attempt_discount}
                    onChange={(e) => setSettings({ ...settings, first_attempt_discount: parseInt(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-semibold">
                    <span>0% (Sem desconto)</span>
                    <span>10% (Padrão)</span>
                    <span>20% (Agressivo)</span>
                  </div>
                </div>

                {/* 2. Margem de Resgate de Carrinho Abandonado */}
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-bold text-white">Margem de Resgate (Carrinho Abandonado)</span>
                      <p className="text-xs text-slate-400">Disparado no fluxo automático para reativar clientes que sumiram.</p>
                    </div>
                    <span className="text-base font-black text-amber-400 bg-amber-500/20 px-3 py-1 rounded-lg">
                      {settings.cart_rescue_discount}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    step="1"
                    value={settings.cart_rescue_discount}
                    onChange={(e) => setSettings({ ...settings, cart_rescue_discount: parseInt(e.target.value) })}
                    className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-semibold">
                    <span>0%</span>
                    <span>12%</span>
                    <span>25% Max</span>
                  </div>
                </div>

                {/* 3. Teto Absoluto de Margem da IA */}
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-bold text-white">Teto Máximo Autorizado pelo Dono</span>
                      <p className="text-xs text-slate-400">A IA é matematicamente bloqueada de conceder descontos acima desse valor.</p>
                    </div>
                    <span className="text-base font-black text-rose-400 bg-rose-500/20 px-3 py-1 rounded-lg">
                      {settings.negotiation_margin}% Max
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    step="1"
                    value={settings.negotiation_margin}
                    onChange={(e) => setSettings({ ...settings, negotiation_margin: parseInt(e.target.value) })}
                    className="w-full accent-rose-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-semibold">
                    <span>5%</span>
                    <span>15% (Recomendado)</span>
                    <span>40% (Alto Risco)</span>
                  </div>
                </div>

                {/* 4. Temperatura (Determinismo vs. Criatividade) */}
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-bold text-white">Controle de Temperatura (Determinismo)</span>
                      <p className="text-xs text-slate-400">0.0 = Precisa e factual; 1.0 = Altamente criativa.</p>
                    </div>
                    <span className="text-sm font-black text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-lg">
                      {settings.llm_temperature.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.llm_temperature}
                    onChange={(e) => setSettings({ ...settings, llm_temperature: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Diretriz do Agente (System Prompt) */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <span>📝</span> Diretriz de Atendimento (System Prompt)
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Personalidade e regras comportamentais da assistente durante os diálogos no WhatsApp.
              </p>
              <textarea
                rows={5}
                value={settings.system_prompt}
                onChange={(e) => setSettings({ ...settings, system_prompt: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors leading-relaxed"
                placeholder="Insira as regras e tom de voz da vendedora..."
              />
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
