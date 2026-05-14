"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { BrainCircuit, Loader2, Activity, Clock, Database, ChevronRight } from "lucide-react";

interface AgentLog {
  id: number;
  agent_name: str;
  input_snapshot: any;
  output_snapshot: any;
  latency_ms: number;
  created_at: string;
}

export default function AgentsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/");
      return;
    }

    const fetchLogs = async () => {
      try {
        const { data } = await api.get("/agents/logs");
        setLogs(data);
      } catch (err) {
        console.error("Logs fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [router]);

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
            <a href="/agents" className="text-sm font-medium text-slate-900">AI Agent'lar</a>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-violet-600" />
            AI Agent Çalışma Logları
          </h1>
          <p className="text-slate-500 mt-1">Sistemdeki otonom finansal agent'ların aktivitelerini izleyin</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-400" />
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
            <Activity className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500">Henüz bir agent aktivitesi kaydedilmedi.</p>
            <p className="text-sm text-slate-400 mt-1">Fatura yükleyerek Gemini Agent'ını tetikleyebilirsiniz.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-violet-50 rounded-lg">
                      <BrainCircuit className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{log.agent_name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(log.created_at).toLocaleString("tr-TR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Activity className="w-4 h-4 text-slate-400" />
                      {log.latency_ms}ms
                    </div>
                    <div className="flex items-center gap-1">
                      <Database className="w-4 h-4 text-slate-400" />
                      JSON Output
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
