"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, FileText, BrainCircuit, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/");
    }
  }, [router]);

  const cards = [
    {
      title: "Faturalar",
      desc: "Fatura yükle ve AI ile otomatik analiz et",
      icon: FileText,
      href: "/invoices",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Nakit Projeksiyon",
      desc: "30-60-90 günlük nakit akışı simülasyonu",
      icon: TrendingUp,
      href: "/projections",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "AI Agent'lar",
      desc: "Agent çalışma loglarını ve süreçleri izle",
      icon: BrainCircuit,
      href: "/agents",
      color: "bg-violet-50 text-violet-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-semibold text-slate-900">NakitTakip</span>
          </div>
          <button
            onClick={() => { localStorage.removeItem("token"); router.push("/"); }}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Çıkış
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">KOBİ finans yönetim merkezinize hoş geldiniz</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-4`}>
                <card.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{card.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{card.desc}</p>
              <div className="flex items-center text-sm font-medium text-slate-900 group-hover:translate-x-1 transition-transform">
                Git <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
