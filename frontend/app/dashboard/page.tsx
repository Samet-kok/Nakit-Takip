"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  TrendingUp, 
  LogOut, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Wallet
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const mockChartData = [
  { name: 'Ocak', flow: 4000 },
  { name: 'Şubat', flow: 3000 },
  { name: 'Mart', flow: 2000 },
  { name: 'Nisan', flow: 2780 },
  { name: 'Mayıs', flow: 1890 },
  { name: 'Haziran', flow: 2390 },
  { name: 'Temmuz', flow: 3490 },
];

const mockInvoices = [
  { id: "INV001", customer: "Tech Solution A.Ş.", amount: "12.500 ₺", status: "Ödendi", date: "2024-05-10" },
  { id: "INV002", customer: "Global Lojistik", amount: "8.200 ₺", status: "Beklemede", date: "2024-05-12" },
  { id: "INV003", customer: "Yıldız Market", amount: "3.450 ₺", status: "Gecikmiş", date: "2024-05-01" },
  { id: "INV004", customer: "Özkan İnşaat", amount: "45.000 ₺", status: "Ödendi", date: "2024-05-05" },
];

export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!localStorage.getItem("token")) {
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-indigo-600" />
            NakitTakip
          </h2>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-indigo-600 bg-indigo-50 rounded-lg font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Genel Bakış
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <FileText className="w-5 h-5" />
            Faturalar
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <TrendingUp className="w-5 h-5" />
            Projeksiyonlar
          </a>
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Hoş Geldiniz!</h1>
              <p className="text-slate-500">İşletmenizin finansal durumuna göz atın.</p>
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              Yeni Fatura Ekle
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Mevcut Nakit</CardTitle>
                <div className="p-2 bg-green-50 rounded-full">
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">124.500,00 ₺</div>
                <p className="text-xs text-green-600 font-medium mt-1">+12% geçen aydan itibaren</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Bekleyen Ödemeler</CardTitle>
                <div className="p-2 bg-amber-50 rounded-full">
                  <FileText className="w-4 h-4 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">32.800,00 ₺</div>
                <p className="text-xs text-amber-600 font-medium mt-1">5 aktif fatura</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Tahmini Gelecek Nakit</CardTitle>
                <div className="p-2 bg-indigo-50 rounded-full">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">157.300,00 ₺</div>
                <p className="text-xs text-indigo-600 font-medium mt-1">30 günlük projeksiyon</p>
              </CardContent>
            </Card>
          </div>

          {/* Chart Section */}
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg font-semibold text-slate-900">Nakit Akışı Analizi</CardTitle>
            </CardHeader>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="flow" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorFlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Table Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Son Faturalar</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Müşteri / Firma</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Tutar</TableHead>
                    <TableHead>Durum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium text-slate-900">{invoice.customer}</TableCell>
                      <TableCell className="text-slate-500">{invoice.date}</TableCell>
                      <TableCell className="font-semibold text-slate-900">{invoice.amount}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={
                            invoice.status === "Ödendi" ? "bg-green-50 text-green-700 border-green-100" :
                            invoice.status === "Gecikmiş" ? "bg-red-50 text-red-700 border-red-100" :
                            "bg-amber-50 text-amber-700 border-amber-100"
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
