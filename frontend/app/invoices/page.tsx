"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Upload, FileText, Trash2, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface Invoice {
  id: number;
  vendor_name: string | null;
  amount: string;
  currency: string;
  due_date: string;
  type: "income" | "expense";
  status: string;
  extracted_data: any;
  created_at: string;
}

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/invoices/");
      setInvoices(data);
    } catch {
      setError("Faturalar yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/");
      return;
    }
    fetchInvoices();
  }, [router, fetchInvoices]);

  const handleUpload = async (file: File) => {
    if (!file) return;
    
    const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setError("Sadece PDF, JPG veya PNG dosyaları yükleyebilirsiniz");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await api.post("/invoices/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      if (data.success) {
        setInvoices((prev) => [data.invoice, ...prev]);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Yükleme başarısız");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu faturayı silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/invoices/${id}`);
      setInvoices((prev) => prev.filter((i) => i.id !== id));
    } catch {
      setError("Silme işlemi başarısız");
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      const { data } = await api.patch(`/invoices/${id}/status`, { status: newStatus });
      setInvoices((prev) => prev.map((inv) => inv.id === id ? data : inv));
    } catch {
      setError("Durum güncelleme başarısız");
    }
  };

  const formatAmount = (amount: string, currency: string) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: currency,
    }).format(parseFloat(amount));
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-amber-100 text-amber-700",
      paid: "bg-emerald-100 text-emerald-700",
      overdue: "bg-red-100 text-red-700",
      risk: "bg-orange-100 text-orange-700",
    };
    const labels: Record<string, string> = {
      pending: "Bekliyor",
      paid: "Ödendi",
      overdue: "Gecikmiş",
      risk: "Risk",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-slate-100 text-slate-600"}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    return type === "income" 
      ? <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-700">Gelir</span>
      : <span className="px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-700">Gider</span>;
  };

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
            <a href="/invoices" className="text-sm font-medium text-slate-900">Faturalar</a>
            <button
              onClick={() => { localStorage.removeItem("token"); router.push("/"); }}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Çıkış
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Faturalar</h1>
          <p className="text-slate-500 mt-1">Fatura yükleyin, Gemini AI otomatik analiz etsin</p>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center mb-8 transition-colors ${
            dragActive ? "border-slate-900 bg-slate-50" : "border-slate-300 bg-white"
          }`}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-700 font-medium">
              {uploading ? "Analiz ediliyor..." : "Fatura sürükleyin veya tıklayarak yükleyin"}
            </p>
            <p className="text-slate-400 text-sm mt-1">PDF, JPG, PNG (max 10MB)</p>
          </label>
          
          {uploading && (
            <div className="mt-4 flex items-center justify-center gap-2 text-slate-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Gemini AI faturayı analiz ediyor...</span>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {/* Invoices List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Henüz fatura yüklenmemiş</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Firma</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Tutar</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Vade</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Tip</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Durum</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">AI Güven</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{inv.vendor_name || "Bilinmeyen"}</div>
                      <div className="text-xs text-slate-400">#{inv.id}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {formatAmount(inv.amount, inv.currency)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {new Date(inv.due_date).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-4 py-3">{getTypeBadge(inv.type)}</td>
                    <td className="px-4 py-3">{getStatusBadge(inv.status)}</td>
                    <td className="px-4 py-3">
                      {inv.extracted_data?.confidence ? (
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className={`w-4 h-4 ${
                            inv.extracted_data.confidence > 0.8 ? "text-emerald-500" : "text-amber-500"
                          }`} />
                          <span className="text-sm text-slate-600">
                            %{(inv.extracted_data.confidence * 100).toFixed(0)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inv.status === "pending" && (
                          <button
                            onClick={() => handleStatusUpdate(inv.id, "paid")}
                            title="Ödendi olarak işaretle"
                            className="p-1.5 hover:bg-emerald-50 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(inv.id)}
                          title="Sil"
                          className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
