"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);
        const { data } = await api.post("/auth/login", formData, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        localStorage.setItem("token", data.access_token);
        window.location.href = "/dashboard";
      } else {
        await api.post("/auth/register", {
          email,
          password,
          company_name: company,
        });
        setIsLogin(true);
        alert("Kayıt başarılı! Giriş yapabilirsiniz.");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">NakitAkıllı</h1>
        <p className="text-slate-500 mb-6 text-sm">KOBİ Agentic Finans Asistanı</p>
        
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              isLogin ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              !isLogin ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            Kayıt Ol
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="ornek@firma.com"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Firma Adı</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="A.Ş. / Ltd. Şti."
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Şifre</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "İşleniyor..." : isLogin ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </form>
      </div>
    </div>
  );
}
