"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { 
  TrendingUp, 
  Loader2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  Wallet
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface ProjectionPoint {
  date: string;
  balance: number;
  type: string;
}

export default function ProjectionsPage() {
  const router = useRouter();
  const [data, setData] = useState<ProjectionPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/");
      return;
    }

    const fetchProjections = async () => {
      try {
        const { data } = await api.get("/projections/30days");
        setData(data);
      } catch (err) {
        console.error("Projection fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjections();
  }, [router]);

  const currentBalance = data[0]?.balance || 0;
  const finalBalance = data[data.length - 1]?.balance || 0;
  const change = finalBalance - currentBalance;
  const isPositive = change >= 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-semibold text-slate-900">NakitTakip</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">Dashboard</a>
            <a href="/invoices" className="text-sm text-slate-600 hover:text-slate-900">Faturalar</a>
            <a href="/projections" className="text-sm font-medium text-slate-900">Projeksiyon</a>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
              Nakit Akışı Projeksiyonu
            </h1>
            <p className="text-slate-500 mt-1">Gelecek 30 günlük tahmini finansal durumunuz</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium text-slate-600">
            <Calendar className="w-4 h-4" />
            30 Günlük Görünüm
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-400" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <p className="text-sm font-medium text-slate-500 uppercase">Mevcut Bakiye</p>
                <div className="text-3xl font-bold text-slate-900 mt-1">
                  {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(currentBalance)}
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <p className="text-sm font-medium text-slate-500 uppercase">30 Gün Sonraki Tahmin</p>
                <div className="flex items-end gap-3 mt-1">
                  <div className="text-3xl font-bold text-slate-900">
                    {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(finalBalance)}
                  </div>
                  <div className={`flex items-center text-sm font-medium mb-1 ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
                    {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(Math.abs(change))}
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-8 rounded-xl border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Günlük Bakiye Değişimi
              </h3>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#64748b', fontSize: 11}} 
                      tickFormatter={(val) => new Date(val).toLocaleDateString("tr-TR", { day: 'numeric', month: 'short' })}
                      dy={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#64748b', fontSize: 11}} 
                      tickFormatter={(val) => `${(val/1000).toFixed(0)}k`}
                      dx={-10} 
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelFormatter={(val) => new Date(val).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long' })}
                      formatter={(val: number) => [new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(val), "Tahmini Bakiye"]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="balance" 
                      stroke="#10b981" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorBalance)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Recharts logic uses Activity icon from lucide-react
import { Activity } from "lucide-react";
