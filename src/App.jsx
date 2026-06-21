import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const C = {
  bg: '#0B0C0E',
  panel: '#15171A',
  panel2: '#1B1E22',
  border: '#26292E',
  text: '#EDEEF0',
  sub: '#8A8F98',
  accent: '#FF5A3C',
  accent2: '#FF8B6E',
  green: '#3DDC84',
  red: '#FF5A3C',
  blue: '#5B8DEF',
  yellow: '#E8B84B',
};

const fonts = {
  display: "'Space Grotesk', 'Arial', sans-serif",
  body: "'Inter', 'Arial', sans-serif",
  mono: "'JetBrains Mono', 'Courier New', monospace",
};

// ---------- DATA ----------
const monthlySeries = [
  {m:'Jan/22',n:35},{m:'Fev/22',n:29},{m:'Mar/22',n:26},{m:'Abr/22',n:33},{m:'Mai/22',n:31},{m:'Jun/22',n:25},
  {m:'Jul/22',n:23},{m:'Ago/22',n:27},{m:'Set/22',n:23},{m:'Out/22',n:19},{m:'Nov/22',n:19},{m:'Dez/22',n:23},
  {m:'Jan/23',n:23},{m:'Fev/23',n:23},{m:'Mar/23',n:23},{m:'Abr/23',n:27},{m:'Mai/23',n:30},{m:'Jun/23',n:23},
  {m:'Jul/23',n:28},{m:'Ago/23',n:20},{m:'Set/23',n:23},{m:'Out/23',n:33},{m:'Nov/23',n:30},{m:'Dez/23',n:33},
  {m:'Jan/24',n:32},{m:'Fev/24',n:29},{m:'Mar/24',n:39},{m:'Abr/24',n:34},{m:'Mai/24',n:34},{m:'Jun/24',n:26},
  {m:'Jul/24',n:25},{m:'Ago/24',n:33},{m:'Set/24',n:24},{m:'Out/24',n:36},{m:'Nov/24',n:28},{m:'Dez/24',n:31},
];

const yoyData = [
  { ano: '2022', sinistros: 313, indenizado: 4493330.14, premioMedio: 269.83, lossRatio: 4.43, taxaSinistro: 0.90 },
  { ano: '2023', sinistros: 316, indenizado: 4724210.48, premioMedio: 263.45, lossRatio: 4.73, taxaSinistro: 0.91 },
  { ano: '2024', sinistros: 371, indenizado: 5968520.82, premioMedio: 269.01, lossRatio: 4.98, taxaSinistro: 0.94 },
];

const yoyVariacao = [
  { metrica: 'Volume de sinistros', v23: 0.96, v24: 17.41 },
  { metrica: 'Total indenizado', v23: 5.14, v24: 26.34 },
  { metrica: 'Prêmio médio cobrado', v23: -2.36, v24: 2.11 },
  { metrica: 'Loss Ratio (custo vs receita)', v23: 6.66, v24: 5.38 },
];

const ufPremium = [
  {uf:'SC',v:282.28},{uf:'RJ',v:280.32},{uf:'MG',v:274.25},{uf:'PE',v:264.38},
  {uf:'SP',v:263.92},{uf:'RS',v:263.48},{uf:'PR',v:256.69},{uf:'BA',v:247.91},
];

const tipoSinistro = [
  {tipo:'Colisão',n:429},{tipo:'Roubo',n:168},{tipo:'Evento climático',n:154},
  {tipo:'Queda de objeto',n:124},{tipo:'Incêndio',n:39},
];

const logitData = [
  { name: 'Idade do segurado', coef: -0.0010, p: 0.920 },
  { name: 'Sexo (ser homem)', coef: 0.3722, p: 0.105 },
  { name: 'Anos de carteira de motorista', coef: 0.0235, p: 0.163 },
  { name: 'Sinistros no histórico', coef: -0.0559, p: 0.577 },
  { name: 'Multas no histórico', coef: -0.0278, p: 0.828 },
];

const poissonData = [
  { name: 'Idade do segurado', coef: -0.0006, p: 0.797, irr: 0.999 },
  { name: 'Sexo (ser homem)', coef: -0.1038, p: 0.078, irr: 0.901 },
  { name: 'Anos de carteira de motorista', coef: -0.0041, p: 0.283, irr: 0.996 },
  { name: 'Mora em zona rural', coef: -0.0352, p: 0.621, irr: 0.965 },
  { name: 'Multas no histórico', coef: -0.0274, p: 0.406, irr: 0.973 },
];

const mqoData = [
  { name: 'Idade do segurado', coef: 0.6030, p: 0.037 },
  { name: 'Sexo (ser homem)', coef: 5.3503, p: 0.449 },
  { name: 'Anos de carteira de motorista', coef: 0.9268, p: 0.034 },
  { name: 'Valor do veículo', coef: -0.0001, p: 0.737 },
  { name: 'Sinistros no histórico', coef: -3.0154, p: 0.326 },
  { name: 'Multas no histórico', coef: -7.3622, p: 0.055 },
  { name: 'Mora em zona rural', coef: 0.8116, p: 0.922 },
  { name: 'Plano completo (Full)', coef: -2.4467, p: 0.766 },
  { name: 'Plano básico (Terceiros)', coef: -10.7858, p: 0.179 },
];

const tobitData = [
  { name: 'Valor médio-base (intercepto)', coef: 16039.55, p: 0.0001 },
  { name: 'Idade do segurado', coef: -12.45, p: 0.704 },
  { name: 'Sexo (ser homem)', coef: -11.85, p: 0.988 },
  { name: 'Anos de carteira de motorista', coef: 14.76, p: 0.765 },
  { name: 'Valor do veículo', coef: -0.0154, p: 0.474 },
  { name: 'Mora em zona rural', coef: 12.72, p: 0.989 },
];

// ---------- HELPERS ----------
function semaforo(p) {
  if (p < 0.05) return { dot: C.green, label: 'Efeito confirmado', ring: `${C.green}33` };
  if (p < 0.10) return { dot: C.yellow, label: 'Indício fraco', ring: `${C.yellow}33` };
  return { dot: C.sub, label: 'Sem efeito real', ring: `${C.border}` };
}
function sigStars(p) {
  if (p < 0.01) return { s: '★★★', c: C.green };
  if (p < 0.05) return { s: '★★', c: C.green };
  if (p < 0.10) return { s: '★', c: C.yellow };
  return { s: 'Não confirmado', c: C.sub };
}

function Term({ children, simple }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 4 }}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <span style={{ borderBottom: `1px dashed ${C.sub}`, cursor: 'help' }}>{children}</span>
      <span style={{
        width: 14, height: 14, borderRadius: '50%', border: `1px solid ${C.sub}`, color: C.sub,
        fontSize: 9.5, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: fonts.mono, cursor: 'help', flexShrink: 0
      }}>?</span>
      {open && (
        <span style={{
          position: 'absolute', bottom: '125%', left: 0, zIndex: 50, width: 250,
          background: '#0E0F11', border: `1px solid ${C.border}`, borderRadius: 10,
          padding: '10px 12px', fontSize: 12, color: C.text, fontFamily: fonts.body,
          lineHeight: 1.5, boxShadow: '0 8px 24px rgba(0,0,0,0.45)', fontWeight: 400
        }}>{simple}</span>
      )}
    </span>
  );
}

function SemaforoBadge({ p }) {
  const sf = semaforo(p);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: fonts.body, fontSize: 12,
      fontWeight: 600, color: sf.dot === C.sub ? C.sub : C.text, background: `${sf.ring}`,
      padding: '4px 10px', borderRadius: 20, border: `1px solid ${sf.dot}40`, whiteSpace: 'nowrap'
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: sf.dot, flexShrink: 0 }} />
      {sf.label}
    </span>
  );
}

function StarsBadge({ p }) {
  const { s, c } = sigStars(p);
  return (
    <span style={{
      fontFamily: c === C.sub ? fonts.body : fonts.mono, fontSize: c === C.sub ? 11 : 13, fontWeight: 700, color: c,
      background: c === C.sub ? '#22252A' : `${c}1A`, padding: '3px 8px', whiteSpace: 'nowrap',
      borderRadius: 6, border: `1px solid ${c === C.sub ? C.border : c + '40'}`
    }}>{s}</span>
  );
}

// ---------- SHARED UI ----------
function Card({ children, style }) {
  return (
    <div style={{
      background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14,
      padding: '20px 22px', ...style
    }}>{children}</div>
  );
}

function FicticiosBanner() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, background: `${C.blue}12`,
      border: `1px solid ${C.blue}33`, borderRadius: 10, padding: '10px 16px', marginBottom: 22
    }}>
      <span style={{ fontSize: 15 }}>🧪</span>
      <span style={{ color: C.text, fontSize: 12.5, fontFamily: fonts.body, lineHeight: 1.5 }}>
        <b>Dados 100% fictícios</b>, gerados artificialmente para fins de demonstração e portfólio — não representam nenhuma seguradora ou segurado real.
      </span>
    </div>
  );
}

function KPI({ label, value, sub, accent }) {
  return (
    <Card style={{ flex: 1, minWidth: 0 }}>
      <div style={{ color: C.sub, fontSize: 12, fontFamily: fonts.body, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 10 }}>{label}</div>
      <div style={{ color: accent || C.text, fontSize: 30, fontFamily: fonts.display, fontWeight: 700, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ color: C.sub, fontSize: 12.5, marginTop: 8, fontFamily: fonts.body }}>{sub}</div>}
    </Card>
  );
}

function CoefRow({ name, coef, p, fmt, extra }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: extra ? '1.2fr 0.6fr 0.55fr 0.85fr 0.95fr' : '1.4fr 0.7fr 0.85fr 0.95fr',
      alignItems: 'center', padding: '13px 4px', borderBottom: `1px solid ${C.border}`, gap: 8
    }}>
      <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: C.text }}>{name}</div>
      <div style={{ fontFamily: fonts.mono, fontSize: 13.5, color: coef < 0 ? C.accent2 : C.blue, textAlign: 'right' }}>
        {fmt ? fmt(coef) : coef.toFixed(4)}
      </div>
      {extra && <div style={{ fontFamily: fonts.mono, fontSize: 13.5, color: C.sub, textAlign: 'right' }}>{extra(coef)}</div>}
      <div><SemaforoBadge p={p} /></div>
      <div style={{ textAlign: 'right' }}><StarsBadge p={p} /></div>
    </div>
  );
}

function TableHeader({ cols }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: cols.length === 5 ? '1.2fr 0.6fr 0.55fr 0.85fr 0.95fr' : '1.4fr 0.7fr 0.85fr 0.95fr',
      padding: '0 4px 10px', borderBottom: `1px solid ${C.border}`, gap: 8
    }}>
      {cols.map((c, i) => (
        <div key={i} style={{
          color: C.sub, fontSize: 11, fontFamily: fonts.body, textTransform: 'uppercase',
          textAlign: i === 0 ? 'left' : (i === cols.length - 1 ? 'right' : 'left')
        }}>{c}</div>
      ))}
    </div>
  );
}

function SectionLabel({ eyebrow, title, desc }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ color: C.accent, fontFamily: fonts.mono, fontSize: 12.5, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 }}>{eyebrow}</div>
      <div style={{ color: C.text, fontFamily: fonts.display, fontSize: 25, fontWeight: 700, marginBottom: 6 }}>{title}</div>
      {desc && <div style={{ color: C.sub, fontFamily: fonts.body, fontSize: 14, maxWidth: 720, lineHeight: 1.55 }}>{desc}</div>}
    </div>
  );
}

function GlobalStatCard({ label, value, desc, color }) {
  return (
    <Card style={{ flex: 1 }}>
      <div style={{ color: C.sub, fontSize: 11.5, fontFamily: fonts.body, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 8 }}>{label}</div>
      <div style={{ color: color || C.text, fontSize: 24, fontFamily: fonts.mono, fontWeight: 700 }}>{value}</div>
      <div style={{ color: C.sub, fontSize: 11.5, fontFamily: fonts.body, marginTop: 6 }}>{desc}</div>
    </Card>
  );
}

function DiagCard({ title, subtitle, stat, verdict, desc, color }) {
  return (
    <Card style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 13.5 }}>{title}</div>
          <div style={{ color: C.sub, fontFamily: fonts.body, fontSize: 11.5 }}>{subtitle}</div>
        </div>
        <span style={{ fontFamily: fonts.mono, fontSize: 10.5, fontWeight: 700, color, border: `1px solid ${color}55`, borderRadius: 6, padding: '3px 7px' }}>{verdict}</span>
      </div>
      <div style={{ color: C.text, fontFamily: fonts.mono, fontSize: 13, marginBottom: 8 }}>{stat}</div>
      <div style={{ color: C.sub, fontFamily: fonts.body, fontSize: 12, lineHeight: 1.5 }}>{desc}</div>
    </Card>
  );
}

function BigStat({ label, value }) {
  return (
    <div>
      <div style={{ color: C.sub, fontSize: 11.5, fontFamily: fonts.body, marginBottom: 4 }}>{label}</div>
      <div style={{ color: C.text, fontSize: 22, fontFamily: fonts.display, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function StatLine({ label, value, badge }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0' }}>
      <span style={{ color: C.sub, fontSize: 12.5, fontFamily: fonts.body }}>{label}</span>
      <span style={{
        color: badge ? C.sub : C.text, fontFamily: fonts.mono, fontSize: 13.5, fontWeight: 700,
        background: badge ? '#22252A' : 'transparent', padding: badge ? '2px 8px' : 0, borderRadius: 6
      }}>{value}</span>
    </div>
  );
}

function VerdictBanner({ tone, text }) {
  const color = tone === 'positivo' ? C.green : tone === 'atencao' ? C.yellow : C.sub;
  const label = tone === 'positivo' ? 'Conclusão de negócio' : tone === 'atencao' ? 'Ponto de atenção' : 'Conclusão de negócio';
  return (
    <div style={{
      display: 'flex', gap: 14, alignItems: 'flex-start', background: tone === 'positivo' ? `${C.green}0D` : '#1A1C20',
      border: `1px solid ${tone === 'positivo' ? C.green + '33' : C.border}`, borderRadius: 12, padding: '16px 18px', marginTop: 18
    }}>
      <div style={{
        fontFamily: fonts.mono, fontSize: 11, fontWeight: 700, color, border: `1px solid ${color}55`,
        borderRadius: 6, padding: '4px 8px', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 0.5
      }}>{label}</div>
      <div style={{ color: C.text, fontSize: 13.5, fontFamily: fonts.body, lineHeight: 1.6 }}>{text}</div>
    </div>
  );
}

function YoYPill({ value }) {
  const positive = value > 0;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: fonts.mono, fontSize: 12.5, fontWeight: 700,
      color: positive ? C.accent2 : C.green, background: positive ? `${C.accent}15` : `${C.green}15`,
      padding: '3px 8px', borderRadius: 6
    }}>
      {positive ? '↑' : '↓'} {Math.abs(value).toFixed(1)}%
    </span>
  );
}

// ---------- SCREENS ----------
function ScreenOverview() {
  return (
    <div>
      <FicticiosBanner />
      <div style={{ marginBottom: 28 }}>
        <div style={{ color: C.accent, fontFamily: fonts.mono, fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
          Portfólio de Análise de Dados · Seguros Automotivos
        </div>
        <div style={{ color: C.text, fontFamily: fonts.display, fontSize: 38, fontWeight: 700, lineHeight: 1.15, maxWidth: 780 }}>
          A seguradora está cobrando<br />o preço certo pelo risco certo?
        </div>
        <div style={{ color: C.sub, fontFamily: fonts.body, fontSize: 15, lineHeight: 1.7, maxWidth: 680, marginTop: 16 }}>
          Este painel usa estatística aplicada para responder, com dados, perguntas que toda
          seguradora de auto enfrenta: quem realmente é mais arriscado, se o preço cobrado é justo,
          e se o negócio está piorando ou melhorando ano a ano. A base simula 1.000 apólices
          entre 2022 e 2024, e cada tela investiga uma pergunta de negócio diferente.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        <KPI label="Apólices analisadas" value="1.000" sub="Período: Jan/2022 – Dez/2024" />
        <KPI label="Clientes que acionaram o seguro" value="91,4%" sub="Apenas 8,6% não tiveram sinistro" accent={C.accent} />
        <KPI label="Mensalidade média" value="R$ 267,51" sub="Faixa: R$ 80 – R$ 450 / mês" />
        <KPI label="Indenização média paga" value="R$ 16.615" sub="Por sinistro, quando ocorre" accent={C.blue} />
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <Card style={{ flex: 1.4 }}>
          <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Quantos sinistros acontecem por mês</div>
          <div style={{ color: C.sub, fontFamily: fonts.body, fontSize: 12.5, marginBottom: 14 }}>jan/2022 — dez/2024</div>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={monthlySeries} margin={{ left: -20, right: 10 }}>
              <CartesianGrid stroke={C.border} vertical={false} />
              <XAxis dataKey="m" tick={{ fill: C.sub, fontSize: 10, fontFamily: fonts.mono }} interval={3} axisLine={{ stroke: C.border }} tickLine={false} />
              <YAxis tick={{ fill: C.sub, fontSize: 10, fontFamily: fonts.mono }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, fontFamily: fonts.body, fontSize: 12 }} labelStyle={{ color: C.text }} itemStyle={{ color: C.text }} />
              <Line type="monotone" dataKey="n" stroke={C.accent} strokeWidth={2.5} dot={false} name="Sinistros" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 14, marginBottom: 4 }}>O que mais causa sinistro</div>
          <div style={{ color: C.sub, fontFamily: fonts.body, fontSize: 12.5, marginBottom: 14 }}>distribuição entre quem teve sinistro (n=914)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 6 }}>
            {tipoSinistro.map(t => (
              <div key={t.tipo} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 100, fontSize: 12, color: C.sub, fontFamily: fonts.body }}>{t.tipo}</div>
                <div style={{ flex: 1, background: C.panel2, borderRadius: 5, height: 9, overflow: 'hidden' }}>
                  <div style={{ width: `${(t.n / 429) * 100}%`, height: '100%', background: C.accent, borderRadius: 5 }} />
                </div>
                <div style={{ width: 32, textAlign: 'right', fontSize: 12, color: C.text, fontFamily: fonts.mono }}>{t.n}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 11, color: C.sub, fontFamily: fonts.body, lineHeight: 1.4 }}>
            * Os 8,6% sem sinistro (86 apólices) foram removidos deste gráfico, pois não têm um "tipo" de causa.
          </div>
        </Card>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 14 }}>O negócio ano a ano (YoY)</div>
            <div style={{ color: C.sub, fontFamily: fonts.body, fontSize: 12.5, marginTop: 2 }}>Como os números evoluíram de 2022 para 2024</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
          {yoyData.map((y, i) => (
            <div key={y.ano} style={{ flex: 1, background: C.panel2, borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ color: C.sub, fontSize: 11.5, fontFamily: fonts.body, marginBottom: 8 }}>{y.ano}</div>
              <div style={{ color: C.text, fontFamily: fonts.display, fontSize: 20, fontWeight: 700 }}>{y.sinistros} sinistros</div>
              <div style={{ color: C.sub, fontSize: 11.5, fontFamily: fonts.body, marginTop: 6 }}>
                Indenizado: R$ {(y.indenizado/1e6).toFixed(2)}M
              </div>
              {i > 0 && (
                <div style={{ marginTop: 8 }}>
                  <YoYPill value={yoyVariacao[0][i === 1 ? 'v23' : 'v24']} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', padding: '0 4px 10px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ color: C.sub, fontSize: 11, fontFamily: fonts.body, textTransform: 'uppercase' }}>Indicador</div>
            <div style={{ color: C.sub, fontSize: 11, fontFamily: fonts.body, textTransform: 'uppercase', textAlign: 'right' }}>2023 vs 2022</div>
            <div style={{ color: C.sub, fontSize: 11, fontFamily: fonts.body, textTransform: 'uppercase', textAlign: 'right' }}>2024 vs 2023</div>
          </div>
          {yoyVariacao.map((row, i) => (
            <div key={row.metrica} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', padding: '11px 4px', borderBottom: i < yoyVariacao.length - 1 ? `1px solid ${C.border}` : 'none', alignItems: 'center' }}>
              <div style={{ color: C.text, fontSize: 13, fontFamily: fonts.body }}>{row.metrica}</div>
              <div style={{ textAlign: 'right' }}><YoYPill value={row.v23} /></div>
              <div style={{ textAlign: 'right' }}><YoYPill value={row.v24} /></div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, fontSize: 12.5, color: C.sub, fontFamily: fonts.body, lineHeight: 1.6 }}>
          <Term simple="Quanto a seguradora paga em indenizações dividido pelo quanto ela recebe em mensalidades. Acima de 1 significa que ela paga mais do que recebe — prejuízo técnico.">Loss Ratio</Term> subiu nos dois anos:
          o custo com sinistros está crescendo mais rápido que a receita de mensalidades. 2024 chama atenção — o volume de
          sinistros saltou 17,4% e o total indenizado cresceu 26,3%, bem acima do reajuste de apenas 2,1% no preço médio cobrado.
        </div>
      </Card>

      <Card>
        <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 14, marginBottom: 14 }}>O que este painel investiga</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
          {[
            { n: '01', t: 'Perfil de risco', d: 'Existe um tipo de cliente mais propenso a sinistro?' },
            { n: '02', t: 'Frequência', d: 'Quantas vezes um mesmo perfil aciona o seguro?' },
            { n: '03', t: 'Formação de preço', d: 'O que está por trás do valor da mensalidade?' },
            { n: '04', t: 'Custo de indenização', d: 'Quanto a seguradora paga, e para quem?' },
            { n: '05', t: 'Justiça no preço', d: 'Algum grupo paga mais sem ser mais arriscado?' },
            { n: '06', t: 'Tendência do negócio', d: 'O risco está aumentando ao longo do tempo?' },
          ].map(s => (
            <div key={s.n} style={{ borderLeft: `2px solid ${C.accent}`, paddingLeft: 12 }}>
              <div style={{ fontFamily: fonts.mono, color: C.accent, fontSize: 11 }}>{s.n}</div>
              <div style={{ fontFamily: fonts.body, color: C.text, fontSize: 13, fontWeight: 600, marginTop: 4 }}>{s.t}</div>
              <div style={{ fontFamily: fonts.body, color: C.sub, fontSize: 11.5, marginTop: 3, lineHeight: 1.4 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ScreenMetodologia() {
  const testes = [
    {
      num: '01', nome: 'Regressão Logística (Logit)', tela: 'usada na tela "Perfil de Risco"',
      pergunta: 'Existe um perfil de cliente com mais chance de sinistro?',
      como: 'Modelo estatístico para quando a resposta é binária (sim/não). Aqui, a pergunta é "esse cliente teve sinistro?" e o modelo estima a probabilidade disso em função de idade, sexo, experiência etc.',
      uso: 'É a técnica padrão de mercado para scoring de risco e subscrição (decidir se aceita ou não uma apólice, e em que condições).'
    },
    {
      num: '02', nome: 'Regressão de Poisson', tela: 'usada na tela "Frequência"',
      pergunta: 'Quantas vezes um cliente aciona o seguro?',
      como: 'Modelo para variáveis de contagem (0, 1, 2, 3 sinistros...). Diferente do Logit, não pergunta "se" mas "quantas vezes".',
      uso: 'Usada por seguradoras para prever frequência de sinistros e ajustar bônus/malus (desconto por bom histórico).'
    },
    {
      num: '03', nome: 'Regressão Linear Múltipla (MQO)', tela: 'usada na tela "Formação de Preço"',
      pergunta: 'O que explica o valor da mensalidade cobrada?',
      como: 'A técnica estatística mais clássica: encontra a melhor linha/relação entre o preço e várias características do cliente ao mesmo tempo, isolando o efeito de cada uma.',
      uso: 'Base de qualquer modelo de precificação (pricing) — para saber se o preço reflete o risco, ou se está desalinhado.'
    },
    {
      num: '04', nome: 'Modelo Tobit', tela: 'usada na tela "Custo de Indenização"',
      pergunta: 'Quanto a seguradora paga de indenização, e a quem?',
      como: 'Uma variação da regressão linear para quando muitos valores são exatamente zero (aqui, 8,6% dos clientes não têm indenização nenhuma). Tratar esse "zero" corretamente evita conclusões erradas sobre o valor médio pago.',
      uso: 'Essencial em modelos de severidade de sinistro (quanto custa, em média, cada tipo de sinistro).'
    },
    {
      num: '05', nome: 'Teste t e ANOVA', tela: 'usada na tela "Justiça no Preço"',
      pergunta: 'Algum grupo paga mais sem ser mais arriscado?',
      como: 'Testes que comparam médias entre grupos (ex: preço médio de homens vs. mulheres) e avaliam se a diferença observada é real ou só coincidência da amostra.',
      uso: 'Usado em auditorias de compliance e equidade de pricing — para evitar discriminação indevida e risco regulatório.'
    },
    {
      num: '06', nome: 'Análise de Série Temporal + Teste ADF', tela: 'usada na tela "Tendência (YoY)"',
      pergunta: 'O risco está piorando ao longo do tempo?',
      como: 'Organiza os dados em ordem cronológica (mês a mês) e testa se existe uma tendência real de alta/baixa, ou sazonalidade, separando isso do "ruído" normal dos dados.',
      uso: 'Usado em planejamento atuarial e financeiro — para projetar custos futuros e decidir reajustes de preço.'
    },
  ];

  return (
    <div>
      <FicticiosBanner />
      <SectionLabel eyebrow="Metodologia" title="Como cada análise deste painel foi feita"
        desc="Cada tela usa uma técnica estatística (econométrica) específica, com nome técnico próprio. Aqui explicamos, para cada uma, o que ela faz, o que ela responde e onde o mercado de seguros normalmente a usa — sem pular o nome real do teste." />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {testes.map(t => (
          <Card key={t.num}>
            <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
              <div style={{
                fontFamily: fonts.mono, fontSize: 13, fontWeight: 700, color: C.accent,
                border: `1px solid ${C.accent}40`, borderRadius: 8, padding: '6px 10px', flexShrink: 0
              }}>{t.num}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                  <span style={{ fontFamily: fonts.display, fontSize: 17, fontWeight: 700, color: C.text }}>{t.nome}</span>
                  <span style={{ fontFamily: fonts.body, fontSize: 11.5, color: C.sub }}>{t.tela}</span>
                </div>
                <div style={{ fontFamily: fonts.body, fontSize: 14, color: C.accent2, fontWeight: 600, marginBottom: 10 }}>
                  Pergunta de negócio: {t.pergunta}
                </div>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ color: C.sub, fontSize: 11, fontFamily: fonts.body, textTransform: 'uppercase', marginBottom: 4 }}>Como funciona</div>
                    <div style={{ color: C.text, fontSize: 13, fontFamily: fonts.body, lineHeight: 1.55 }}>{t.como}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ color: C.sub, fontSize: 11, fontFamily: fonts.body, textTransform: 'uppercase', marginBottom: 4 }}>Uso no mercado de seguros</div>
                    <div style={{ color: C.text, fontSize: 13, fontFamily: fonts.body, lineHeight: 1.55 }}>{t.uso}</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ marginTop: 16 }}>
        <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 13, marginBottom: 10 }}>Como ler os resultados nas próximas telas</div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ marginBottom: 6 }}><SemaforoBadge p={0.01} /></div>
            <div style={{ color: C.sub, fontSize: 12, fontFamily: fonts.body, lineHeight: 1.5 }}>O efeito é real e confiável — não é coincidência da amostra.</div>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ marginBottom: 6 }}><SemaforoBadge p={0.07} /></div>
            <div style={{ color: C.sub, fontSize: 12, fontFamily: fonts.body, lineHeight: 1.5 }}>Pode haver um efeito, mas a evidência ainda é fraca para apostar nele.</div>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ marginBottom: 6 }}><SemaforoBadge p={0.5} /></div>
            <div style={{ color: C.sub, fontSize: 12, fontFamily: fonts.body, lineHeight: 1.5 }}>Não há evidência de que esse fator realmente importa.</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ScreenLogit() {
  return (
    <div>
      <FicticiosBanner />
      <SectionLabel eyebrow="Análise 01 · Regressão Logística (Logit)" title="Existe um tipo de cliente mais propenso a sofrer sinistro?"
        desc="Cruzamos idade, sexo, experiência de direção e histórico de sinistros/multas para ver se algum desses fatores aumenta de fato a chance de um cliente acionar o seguro." />

      <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
        <GlobalStatCard label={<Term simple="O quanto essas características, juntas, explicam quem tem sinistro e quem não tem. Quanto mais perto de 0, menos elas explicam.">Poder explicativo do modelo</Term>} value="0,9%" desc="muito baixo" />
        <GlobalStatCard label={<Term simple="Testa se essas características, somadas, realmente ajudam a prever sinistro melhor do que chutar aleatoriamente. Se o resultado é 'não', o sinal verde fica desligado.">O modelo, como um todo, funciona?</Term>} value="Não" desc="sem confiança estatística" color={C.sub} />
        <GlobalStatCard label="Clientes analisados" value="1.000" desc="apólices na base" />
      </div>

      <Card>
        <TableHeader cols={[
          'Característica do cliente',
          'Direção do efeito',
          'Veredito',
          <Term simple="Quanto menor essa barra de confiança, mais forte é a evidência estatística — representada aqui pelas estrelinhas (*).">Confiança estatística</Term>
        ]} />
        {logitData.map(d => <CoefRow key={d.name} {...d} fmt={v => v > 0 ? `Aumenta risco` : `Reduz risco`} />)}
        <VerdictBanner tone="neutro" text={
          <>Nenhuma característica analisada — idade, sexo, experiência, sinistros ou multas anteriores — mostrou relação confiável com a chance de sinistro. Para a seguradora, isso significa que <b style={{color:C.text}}>esse conjunto de dados, isoladamente, não identifica bons ou maus pagadores de risco</b>. Seria necessário coletar outras informações (ex: km rodado, horário de uso, telemetria) para segmentar melhor.</>
        } />
      </Card>

      <Card style={{ marginTop: 16 }}>
        <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 13, marginBottom: 10 }}>Observação técnica</div>
        <div style={{ color: C.sub, fontFamily: fonts.body, fontSize: 13, lineHeight: 1.6 }}>
          A variável "mora em zona rural" foi deixada de fora desta análise porque, nesta base, 100% dos clientes rurais tiveram sinistro —
          uma coincidência da amostra que impede o modelo de calcular esse efeito de forma confiável. Em uma base maior, isso tende a se resolver.
        </div>
      </Card>
    </div>
  );
}

function ScreenPoisson() {
  return (
    <div>
      <FicticiosBanner />
      <SectionLabel eyebrow="Análise 02 · Regressão de Poisson" title="Quantas vezes um mesmo cliente aciona o seguro?"
        desc="Diferente da análise anterior (teve ou não teve sinistro), aqui olhamos a quantidade de sinistros acumulados no histórico de cada cliente." />

      <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
        <GlobalStatCard label="Poder explicativo do modelo" value="0,2%" desc="muito baixo" />
        <GlobalStatCard label={<Term simple="Checa se a quantidade de sinistros varia de forma 'normal' (compatível com o modelo usado) ou se há grupos com muito mais variação que outros, o que pediria um modelo diferente.">A técnica usada é confiável aqui?</Term>} value="Sim" desc="comportamento dos dados é regular" color={C.green} />
        <GlobalStatCard label="O modelo, como um todo, funciona?" value="Não" desc="sem confiança estatística" color={C.sub} />
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <Card style={{ flex: 1.3 }}>
          <TableHeader cols={[
            'Característica do cliente',
            'Direção do efeito',
            <Term simple="Quantas vezes mais (ou menos) sinistro esse grupo tem em relação à média. Ex: 0,90 = 10% menos sinistros que a média.">Diferença vs. média</Term>,
            'Veredito',
            'Confiança'
          ]} />
          {poissonData.map(d => <CoefRow key={d.name} {...d} fmt={v => v > 0 ? 'Aumenta' : 'Reduz'} extra={() => `${((d.irr-1)*100).toFixed(1)}%`} />)}
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 13, marginBottom: 6 }}>A base se comporta de forma esperada?</div>
          <div style={{ color: C.sub, fontFamily: fonts.body, fontSize: 12.5, lineHeight: 1.6, marginBottom: 16 }}>
            Quando alguns clientes têm MUITO mais sinistros que outros (mais do que o esperado pelo acaso),
            é sinal de que existem grupos de risco escondidos que o modelo simples não está capturando.
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: fonts.display, fontSize: 32, fontWeight: 700, color: C.green }}>Regular</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: C.green, fontFamily: fonts.body }}>✓ Não há grupos escondidos de altíssimo risco nesta base</div>
        </Card>
      </div>

      <VerdictBanner tone="neutro" text={
        <>O fator mais próximo de ter efeito é o sexo: homens tendem a acumular cerca de 10% menos sinistros no histórico — mas essa diferença ainda não é forte o suficiente para ser tratada como certeza estatística. Na prática, <b style={{color:C.text}}>nenhum perfil se mostrou claramente mais "reincidente"</b> que outro nesta base.</>
      } />
    </div>
  );
}

function ScreenMQO() {
  return (
    <div>
      <FicticiosBanner />
      <SectionLabel eyebrow="Análise 03 · Regressão Linear Múltipla (MQO)" title="O que está por trás do valor da mensalidade?"
        desc="Testamos se idade, sexo, experiência, valor do veículo, histórico de risco, região e tipo de plano explicam por que um cliente paga mais ou menos que outro." />

      <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
        <GlobalStatCard label={<Term simple="De tudo que faz o preço variar entre clientes, quanto dessa variação esses fatores conseguem explicar. Quase 0 significa que o preço varia por outros motivos não capturados aqui.">Quanto isso explica do preço</Term>} value="0,7%" desc="praticamente nada" />
        <GlobalStatCard label="O modelo, como um todo, funciona?" value="Talvez" desc="no limite da confiança (94%)" color={C.yellow} />
        <GlobalStatCard label={<Term simple="Verifica se duas variáveis estão tão parecidas entre si que confundem a análise — por exemplo, se 'valor do carro' e 'marca do carro' contassem basicamente a mesma informação.">Variáveis duplicando informação?</Term>} value="Não" desc="cada fator é independente" color={C.green} />
      </div>

      <Card>
        <TableHeader cols={['Fator analisado', 'Direção do efeito', 'Veredito', 'Confiança']} />
        {mqoData.map(d => <CoefRow key={d.name} {...d} fmt={v => v > 0 ? 'Encarece' : 'Barateia'} />)}
      </Card>

      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        <DiagCard title="Variação do preço é estável?" subtitle="entre perfis de cliente" stat="Sim, dentro do esperado" verdict="OK" desc="O preço não fica artificialmente mais instável para nenhum grupo específico de cliente." color={C.green} />
        <DiagCard title="O preço segue um padrão típico?" subtitle="distribuição dos valores" stat="Não — é mais espalhado" verdict="ATENÇÃO" desc="Esperado: a mensalidade nesta base foi definida quase ao acaso, sem uma régua de preço clara por trás." color={C.accent} />
        <DiagCard title="Fatores se sobrepõem?" subtitle="redundância entre variáveis" stat="Não, tudo independente" verdict="OK" desc="Idade, valor do carro, região etc. não estão 'contando a mesma história' duas vezes." color={C.green} />
      </div>

      <VerdictBanner tone="atencao" text={
        <>Idade e tempo de carteira aparecem como "estatisticamente relevantes" isoladamente, mas isso é enganoso: ao testar 9 fatores ao mesmo tempo, é esperado que 1 ou 2 pareçam relevantes só por acaso. O dado que importa de fato é que, <b style={{color:C.text}}>juntos, esses fatores explicam menos de 1% do preço cobrado</b> — ou seja, a régua de precificação atual não está claramente ligada ao perfil de risco do cliente.</>
      } />
    </div>
  );
}

function ScreenTobit() {
  return (
    <div>
      <FicticiosBanner />
      <SectionLabel eyebrow="Análise 04 · Modelo Tobit" title="Quanto a seguradora paga — e para quem?"
        desc="8,6% dos clientes não acionam o seguro (pagam R$ 0 em indenização). Usamos uma técnica estatística (Tobit) que lida corretamente com essa concentração de clientes 'zerados', evitando distorcer a média." />

      <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
        <GlobalStatCard label="Clientes sem nenhuma indenização" value="8,6%" desc="pagaram mensalidade, não usaram" color={C.blue} />
        <GlobalStatCard label="Indenização típica quando há sinistro" value="≈ R$ 16.040" desc="valor-base estimado pelo modelo" />
        <GlobalStatCard label="Ajuste do modelo" value="Adequado" desc="técnica calibrada corretamente" color={C.sub} />
      </div>

      <Card>
        <TableHeader cols={['Fator analisado', 'Impacto no valor pago (R$)', 'Veredito', 'Confiança']} />
        {tobitData.map(d => <CoefRow key={d.name} {...d} fmt={v => v.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2})} />)}
        <VerdictBanner tone="positivo" text={
          <>O único valor confiável é o "valor-base": em média, quando há sinistro, a seguradora paga em torno de <b style={{color:C.text}}>R$ 16 mil</b>, independente do perfil do cliente. Nenhuma característica analisada (idade, sexo, tempo de carteira, valor do carro, região) altera esse valor de forma confiável — ou seja, hoje a indenização paga não varia por perfil, o que pode ser um ponto de revisão atuarial.</>
        } />
      </Card>
    </div>
  );
}

function ScreenDiscriminacao() {
  return (
    <div>
      <FicticiosBanner />
      <SectionLabel eyebrow="Análise 05 · Teste t e ANOVA" title="Algum grupo paga mais sem ser mais arriscado?"
        desc="Comparamos a mensalidade média entre homens e mulheres, e entre estados, para verificar se existe cobrança diferenciada que não se justifica pelo risco real do cliente." />

      <div style={{ display: 'flex', gap: 16 }}>
        <Card style={{ flex: 1 }}>
          <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 13, marginBottom: 14 }}>Mensalidade média: homens vs. mulheres</div>
          <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
            <BigStat label="Homens" value="R$ 269,54" />
            <BigStat label="Mulheres" value="R$ 263,70" />
          </div>
          <div style={{ marginBottom: 6 }}><SemaforoBadge p={0.409} /></div>
          <div style={{ marginTop: 10, fontSize: 12.5, color: C.sub, fontFamily: fonts.body, lineHeight: 1.55 }}>
            A diferença de R$ 5,84 não é estatisticamente confiável — não há evidência de cobrança diferente por sexo.
          </div>
        </Card>

        <Card style={{ flex: 1.4 }}>
          <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Mensalidade média por estado</div>
          <div style={{ marginBottom: 12 }}><SemaforoBadge p={0.205} /></div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={ufPremium} margin={{ left: -20, right: 10 }}>
              <CartesianGrid stroke={C.border} vertical={false} />
              <XAxis dataKey="uf" tick={{ fill: C.sub, fontSize: 11, fontFamily: fonts.mono }} axisLine={{ stroke: C.border }} tickLine={false} />
              <YAxis tick={{ fill: C.sub, fontSize: 10, fontFamily: fonts.mono }} axisLine={false} tickLine={false} domain={[200, 300]} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, fontFamily: fonts.body, fontSize: 12 }} labelStyle={{ color: C.text }} itemStyle={{ color: C.text }} formatter={(v) => [`R$ ${v}`, 'Mensalidade média']} />
              <Bar dataKey="v" radius={[5, 5, 0, 0]}>
                {ufPremium.map((e, i) => <Cell key={i} fill={i === 0 ? C.accent : C.panel2} stroke={C.border} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 10, fontSize: 12.5, color: C.sub, fontFamily: fonts.body, lineHeight: 1.55 }}>
            Apesar de SC e BA terem uma diferença de R$ 34 na média, essa variação não é grande o suficiente para ser tratada como real — pode ser apenas acaso da amostra.
          </div>
        </Card>
      </div>

      <Card style={{ marginTop: 16 }}>
        <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 13, marginBottom: 10 }}>E se a gente já souber que homens têm mais sinistros no histórico?</div>
        <div style={{ color: C.sub, fontFamily: fonts.body, fontSize: 13, lineHeight: 1.65, marginBottom: 12 }}>
          Mesmo comparando apenas clientes com o mesmo nível de risco (mesmo histórico de sinistros e multas), a diferença
          de preço entre homens e mulheres continua não significativa:
        </div>
        <div style={{ display: 'flex', gap: 28, marginBottom: 6 }}>
          <StatLine label="Diferença de preço (homem vs. mulher)" value="+ R$ 5,43 / mês" />
        </div>
        <SemaforoBadge p={0.441} />
        <VerdictBanner tone="positivo" text={
          <>Não há indício de que a seguradora cobra de forma diferente por sexo, mesmo controlando pelo risco real do cliente. Esse é um <b style={{color:C.text}}>resultado positivo</b> para a política de preços atual — reduz o risco de questionamento regulatório por discriminação de gênero.</>
        } />
      </Card>
    </div>
  );
}

function ScreenSerieTemporal() {
  return (
    <div>
      <FicticiosBanner />
      <SectionLabel eyebrow="Análise 06 · Série Temporal (Teste ADF)" title="O risco está aumentando ao longo do tempo?"
        desc="Olhamos a evolução mês a mês dos sinistros, e a comparação ano contra ano (YoY) de volume, custo e preço, para identificar se há uma tendência de piora ou apenas variação normal." />

      <Card style={{ marginBottom: 16 }}>
        <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Sinistros por mês — Jan/2022 a Dez/2024</div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlySeries} margin={{ left: -20, right: 10, top: 10 }}>
            <CartesianGrid stroke={C.border} vertical={false} />
            <XAxis dataKey="m" tick={{ fill: C.sub, fontSize: 10, fontFamily: fonts.mono }} interval={2} axisLine={{ stroke: C.border }} tickLine={false} />
            <YAxis tick={{ fill: C.sub, fontSize: 10, fontFamily: fonts.mono }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, fontFamily: fonts.body, fontSize: 12 }} labelStyle={{ color: C.text }} itemStyle={{ color: C.text }} />
            <Line type="monotone" dataKey="n" stroke={C.accent} strokeWidth={2.5} dot={{ r: 2.5, fill: C.accent }} name="Sinistros" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Comparativo Ano a Ano (YoY)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', padding: '0 4px 10px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ color: C.sub, fontSize: 11, fontFamily: fonts.body, textTransform: 'uppercase' }}>Indicador</div>
          <div style={{ color: C.sub, fontSize: 11, fontFamily: fonts.body, textTransform: 'uppercase', textAlign: 'right' }}>2022</div>
          <div style={{ color: C.sub, fontSize: 11, fontFamily: fonts.body, textTransform: 'uppercase', textAlign: 'right' }}>2023</div>
          <div style={{ color: C.sub, fontSize: 11, fontFamily: fonts.body, textTransform: 'uppercase', textAlign: 'right' }}>2024</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', padding: '11px 4px', borderBottom: `1px solid ${C.border}`, alignItems: 'center' }}>
          <div style={{ color: C.text, fontSize: 13, fontFamily: fonts.body }}>Sinistros no ano</div>
          <div style={{ textAlign: 'right', fontFamily: fonts.mono, fontSize: 13, color: C.text }}>313</div>
          <div style={{ textAlign: 'right', fontFamily: fonts.mono, fontSize: 13, color: C.text }}>316 <YoYPill value={0.96} /></div>
          <div style={{ textAlign: 'right', fontFamily: fonts.mono, fontSize: 13, color: C.text }}>371 <YoYPill value={17.41} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', padding: '11px 4px', borderBottom: `1px solid ${C.border}`, alignItems: 'center' }}>
          <div style={{ color: C.text, fontSize: 13, fontFamily: fonts.body }}>Total indenizado</div>
          <div style={{ textAlign: 'right', fontFamily: fonts.mono, fontSize: 13, color: C.text }}>R$ 4,49M</div>
          <div style={{ textAlign: 'right', fontFamily: fonts.mono, fontSize: 13, color: C.text }}>R$ 4,72M <YoYPill value={5.14} /></div>
          <div style={{ textAlign: 'right', fontFamily: fonts.mono, fontSize: 13, color: C.text }}>R$ 5,97M <YoYPill value={26.34} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', padding: '11px 4px', alignItems: 'center' }}>
          <div style={{ color: C.text, fontSize: 13, fontFamily: fonts.body }}>
            <Term simple="Quanto a seguradora paga em indenizações para cada R$1 que recebe em mensalidades. 4,98 significa que ela paga quase 5x mais do que recebe — um sinal de alerta para a saúde financeira da operação.">Loss Ratio</Term>
          </div>
          <div style={{ textAlign: 'right', fontFamily: fonts.mono, fontSize: 13, color: C.text }}>4,43</div>
          <div style={{ textAlign: 'right', fontFamily: fonts.mono, fontSize: 13, color: C.text }}>4,73 <YoYPill value={6.66} /></div>
          <div style={{ textAlign: 'right', fontFamily: fonts.mono, fontSize: 13, color: C.text }}>4,98 <YoYPill value={5.38} /></div>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <Card style={{ flex: 1 }}>
          <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 13, marginBottom: 14 }}>Isso é uma tendência real ou só variação aleatória?</div>
          <SemaforoBadge p={0.466} />
          <div style={{ marginTop: 12, fontSize: 12.5, color: C.sub, fontFamily: fonts.body, lineHeight: 1.55 }}>
            O teste estatístico não confirma uma tendência de longo prazo ainda — com 36 meses de histórico, é pouco tempo para ter certeza.
            Mas o salto de 2024 chama atenção e merece acompanhamento nos próximos trimestres.
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 13, marginBottom: 14 }}>Existe sazonalidade (época do ano que piora)?</div>
          <div style={{ color: C.text, fontFamily: fonts.display, fontSize: 22, fontWeight: 700 }}>Moderada</div>
          <div style={{ marginTop: 12, fontSize: 12.5, color: C.sub, fontFamily: fonts.body, lineHeight: 1.55 }}>
            Existe alguma variação ligada à época do ano, mas ela tem peso parecido com o "ruído" natural dos dados — não é o fator dominante.
          </div>
        </Card>
      </div>

      <VerdictBanner tone="atencao" text={
        <>O dado mais relevante para o negócio é o <b style={{color:C.text}}>Loss Ratio subindo nos dois anos</b> (de 4,43 para 4,98) — o custo com indenizações está crescendo mais rápido que a receita de mensalidades. Combinado com o salto de 17,4% no volume de sinistros em 2024, isso é um sinal de alerta que merece investigação, mesmo sem confirmação estatística formal de tendência ainda.</>
      } />
    </div>
  );
}

// ---------- MAIN APP ----------
const SCREENS = [
  { id: 'overview', label: 'Visão Geral', num: '00', comp: ScreenOverview },
  { id: 'logit', label: 'Perfil de Risco', num: '01', comp: ScreenLogit },
  { id: 'poisson', label: 'Frequência', num: '02', comp: ScreenPoisson },
  { id: 'mqo', label: 'Formação de Preço', num: '03', comp: ScreenMQO },
  { id: 'tobit', label: 'Custo de Indenização', num: '04', comp: ScreenTobit },
  { id: 'discriminacao', label: 'Justiça no Preço', num: '05', comp: ScreenDiscriminacao },
  { id: 'serie', label: 'Tendência (YoY)', num: '06', comp: ScreenSerieTemporal },
  { id: 'metodologia', label: 'Metodologia', num: '07', comp: ScreenMetodologia },
];

export default function App() {
  const [active, setActive] = useState('overview');
  const ActiveComp = SCREENS.find(s => s.id === active).comp;

  return (
    <div style={{
      display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: fonts.body,
      color: C.text
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: #2A2D32; border-radius: 4px; }
      `}</style>

      {/* SIDEBAR */}
      <div style={{
        width: 240, background: C.panel, borderRight: `1px solid ${C.border}`,
        padding: '24px 16px', display: 'flex', flexDirection: 'column', flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', marginBottom: 30 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 15, color: '#0B0C0E' }}>β</span>
          </div>
          <div>
            <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 14.5, color: C.text }}>Aline Soares</div>
            <div style={{ fontFamily: fonts.body, fontSize: 10, color: C.sub, lineHeight: 1.3 }}>Análise Econométrica<br/>de Seguros Automotivos</div>
          </div>
        </div>

        <div style={{ color: C.sub, fontSize: 10.5, fontFamily: fonts.body, textTransform: 'uppercase', letterSpacing: 0.6, padding: '0 8px', marginBottom: 10 }}>
          Navegação
        </div>

        {SCREENS.map(s => {
          const isActive = s.id === active;
          return (
            <button key={s.id} onClick={() => setActive(s.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px',
              background: isActive ? C.panel2 : 'transparent', border: 'none',
              borderLeft: isActive ? `2px solid ${C.accent}` : '2px solid transparent',
              borderRadius: 8, cursor: 'pointer', textAlign: 'left', marginBottom: 2, width: '100%'
            }}>
              <span style={{ fontFamily: fonts.mono, fontSize: 11, color: isActive ? C.accent : C.sub, width: 18 }}>{s.num}</span>
              <span style={{ fontFamily: fonts.body, fontSize: 13, fontWeight: isActive ? 600 : 500, color: isActive ? C.text : C.sub }}>{s.label}</span>
            </button>
          );
        })}

        <div style={{ flex: 1 }} />
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, padding: '14px 8px 0' }}>
          <div style={{ color: C.sub, fontSize: 11, fontFamily: fonts.body, lineHeight: 1.6 }}>
            🧪 Base fictícia · 1.000 apólices<br />Período 2022–2024
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: '32px 36px', overflowY: 'auto', maxHeight: '100vh' }}>
        <ActiveComp />
      </div>
    </div>
  );
}
