import React, { useState } from "react";

// Simple, self-contained mock (no backend). Tailwind classes are available in the preview.
// Views: Home (URL input) → Result (mocked analysis)

const MOCK_ANALYSIS = {
  address: "Palermo Soho",
  summary: {
    rooms: 2,
    sqm: 52,
    floor: 9,
    parking: true,
  },
  publishedPrice: 180000,
  estimate: [158000, 166000],
  deltaText: "10–15% por encima del promedio de la zona",
  comparables: [
    { id: 1, title: "Honduras 4700", sqm: 54, price: 163000, url: "#" },
    { id: 2, title: "Cabrera 4800", sqm: 50, price: 159000, url: "#" },
    { id: 3, title: "Gorriti 4600", sqm: 53, price: 161000, url: "#" },
  ],
  explanation:
    "Tu propiedad está 10–15% por encima del promedio en Palermo Soho. La diferencia podría explicarse por el piso alto y amenities del edificio.",
  recommendation: { text: "Negociá un 8–12% respecto del precio publicado.", confidence: 0.73 },
};

export default function App() {
  const [url, setUrl] = useState("");
  const [view, setView] = useState<"home" | "loading" | "result">("home");
  const [report, setReport] = useState<typeof MOCK_ANALYSIS | null>(null);

  function analyze() {
    if (!url.trim()) return;
    setView("loading");
    // Fake latency
    setTimeout(() => {
      setReport(MOCK_ANALYSIS);
      setView("result");
    }, 900);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-24">
        {view === "home" && <Home url={url} setUrl={setUrl} onAnalyze={analyze} />}
        {view === "loading" && <Loading />}
        {view === "result" && report && <Result report={report} onBack={() => setView("home")} />}
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white">🏠</div>
          <span className="text-lg font-semibold">AI PropCheck</span>
        </div>
        <nav className="hidden gap-6 md:flex">
          <a href="#como" className="text-sm text-slate-600 hover:text-slate-900">Cómo funciona</a>
          <a href="#precios" className="text-sm text-slate-600 hover:text-slate-900">Precios</a>
          <a href="#ingresar" className="text-sm text-slate-600 hover:text-slate-900">Ingresar</a>
        </nav>
      </div>
    </header>
  );
}

function Home({ url, setUrl, onAnalyze }: { url: string; setUrl: (v: string) => void; onAnalyze: () => void; }) {
  return (
    <section className="py-14">
      <div className="mx-auto grid max-w-3xl gap-8 text-center">
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">¿Cuánto vale realmente tu propiedad?</h1>
        <p className="text-lg text-slate-600">Pegá el link de tu publicación (Zonaprop, Argenprop o Mercado Libre) y obtené gratis tu análisis inteligente.</p>
        <div className="flex flex-col items-center gap-3 md:flex-row">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.zonaprop.com.ar/..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 md:w-[70%]"
          />
          <button onClick={onAnalyze} className="w-full rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow md:w-auto">Analizar</button>
        </div>
        <p className="text-sm text-slate-500">Incluye <span className="font-semibold">2 análisis gratis</span> por mes. Sin tarjetas, sin compromiso.</p>

        <div id="como" className="mt-10 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-3">
          {["Pegá el link", "Buscamos comparables", "Te damos un rango + PDF"].map((t, i) => (
            <div key={i} className="rounded-xl border border-slate-100 p-4">
              <div className="mb-2 text-2xl">{i === 0 ? "🔗" : i === 1 ? "🧭" : "📄"}</div>
              <p className="font-medium">{t}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Loading() {
  return (
    <section className="grid place-items-center py-24">
      <div className="grid max-w-md gap-4 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
        <p className="text-slate-600">Buscando comparables en tu zona… Puede tardar unos segundos.</p>
      </div>
    </section>
  );
}

function Result({ report, onBack }: { report: typeof MOCK_ANALYSIS; onBack: () => void; }) {
  return (
    <section className="py-10">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-blue-600 hover:underline">← Volver</button>
        <div className="flex items-center gap-2 text-sm text-slate-600">Versión Argentina • Beta</div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left column: Summary */}
        <div className="md:col-span-2 grid gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">{report.address}</h2>
            <p className="mt-1 text-slate-600">
              {report.summary.rooms} ambientes — {report.summary.sqm} m² — {report.summary.floor}° piso — {report.summary.parking ? "cochera" : "sin cochera"}
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Stat label="Precio publicado" value={`US$ ${report.publishedPrice.toLocaleString()}`} />
              <Stat label="Valor estimado AI PropCheck" value={`US$ ${report.estimate[0].toLocaleString()} – ${report.estimate[1].toLocaleString()}`} highlight />
              <Stat label="Diferencia vs. zona" value={report.deltaText} />
            </div>
            <p className="mt-4 text-slate-700">{report.explanation}</p>
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-slate-700">
              <span className="font-medium">Recomendación:</span> {report.recommendation.text} <span className="text-slate-500">(confianza {Math.round(report.recommendation.confidence * 100)}%)</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-xl border border-slate-300 bg-white px-4 py-2">Compartir por WhatsApp</button>
              <button className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white">Descargar informe PDF</button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold">Comparables cercanos</h3>
            <ul className="grid gap-3 md:grid-cols-3">
              {report.comparables.map((c) => (
                <li key={c.id} className="rounded-xl border border-slate-200 p-4">
                  <p className="font-medium">{c.title}</p>
                  <p className="text-sm text-slate-600">{c.sqm} m²</p>
                  <p className="text-sm">US$ {c.price.toLocaleString()}</p>
                  <a href={c.url} className="text-sm text-blue-600 hover:underline">Ver aviso</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right column: Map mock */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold">Mapa (1 km a la redonda)</h3>
          <div className="grid h-64 place-items-center rounded-xl border border-dashed border-slate-300">
            <div className="text-slate-500">🗺️ Mapa de Palermo (mock)</div>
          </div>
          <div className="mt-4 grid gap-2 text-sm text-slate-600">
            <p>Zona: Palermo Soho</p>
            <p>Radio: 1 km</p>
          </div>
        </div>
      </div>

      {/* Pricing / Upsell */}
      <div id="precios" className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Planes</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <PlanCard title="Free" price="$0" features={["2 análisis/mes", "Resultados en la web"]} />
          <PlanCard title="Pro" price="US$ 4.99/mes" badge="Recomendado" features={["20 análisis/mes", "Descarga de PDFs", "Soporte prioritario"]} />
          <PlanCard title="Inmobiliarias" price="US$ 39/mes" features={["100 análisis/mes", "Branding en PDFs", "Multiusuario"]} />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"}`}>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${highlight ? "text-blue-700" : "text-slate-900"}`}>{value}</p>
    </div>
  );
}

function PlanCard({ title, price, features, badge }: { title: string; price: string; features: string[]; badge?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-base font-semibold">{title}</h4>
        {badge && <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">{badge}</span>}
      </div>
      <p className="text-xl font-semibold">{price}</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
        {features.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
      <button className="mt-4 w-full rounded-xl border border-slate-300 bg-white py-2 text-sm hover:bg-slate-50">Elegir</button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500">
        AI PropCheck · Datos públicos y estimaciones orientativas · © {new Date().getFullYear()}
      </div>
    </footer>
  );
}
