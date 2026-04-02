"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Users,
  Package,
  Gavel,
  DollarSign,
  Shield,
  Clock,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const CHART_COLORS = ["#1B4D3E", "#F59E0B", "#2563EB", "#DC2626", "#7C3AED", "#059669"];

export default function AdminDashboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [dashData, setDashData] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  // const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || (user && user.role !== "admin"))) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      Promise.all([
        api.get("/dashboard/admin"),
        api.get("/users"),
      ])
        .then(([dash, users]) => {
          setDashData(dash);
          setAllUsers(Array.isArray(users) ? users : []);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, user]);



  const handleUserAction = async (userId: string, action: "suspend" | "activate") => {
    setActionLoading(userId);
    try {
      await api.put(`/users/${userId}`, { status: action === "suspend" ? "suspended" : "active" });
      setAllUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, status: action === "suspend" ? "suspended" : "active" } : u
        )
      );
    } catch (e) {
      console.error(e);
    }
    setActionLoading(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4D3E]" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") return null;

  const kpis = [
    {
      label: "Total Users",
      value: dashData?.total_users ?? 0,
      icon: Users,
      color: "text-[#1B4D3E]",
      bg: "bg-[#1B4D3E]/10",
    },
    {
      label: "Active Listings",
      value: dashData?.active_listings ?? 0,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Active Auctions",
      value: dashData?.active_auctions ?? 0,
      icon: Gavel,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      label: "GMV",
      value: `$${((dashData?.gmv ?? 0) / 1000).toFixed(0)}k`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ];

  const secondaryStats = [
    { label: "Verified Sellers", value: dashData?.sellers ?? 0, icon: Shield },
    { label: "Pending Reviews", value: dashData?.pending_listings ?? 0, icon: Clock },
    { label: "Total Bids", value: dashData?.total_bids ?? 0, icon: BarChart3 },
    { label: "Fees Collected", value: "$42,375", icon: DollarSign },
    { label: "Flagged", value: 2, icon: AlertTriangle },
  ];

  const monthlyRevenue = dashData?.monthly_revenue ?? [];
  const categoryData = (dashData?.listings_by_category ?? []).map((c: any) => ({
    name: c.category || "Other",
    value: c.count,
  }));

  const filteredUsers = allUsers.filter(
    (u) =>
      !userSearch ||
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const taxData = [
    { state: "Texas", transactions: 45, gmv: "$312,000", tax: "$25,480" },
    { state: "Iowa", transactions: 32, gmv: "$198,500", tax: "$13,895" },
    { state: "Illinois", transactions: 28, gmv: "$175,200", tax: "$14,016" },
    { state: "Nebraska", transactions: 18, gmv: "$94,300", tax: "$5,187" },
    { state: "Kansas", transactions: 12, gmv: "$67,500", tax: "$4,388" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-2xl md:text-3xl font-bold text-gray-900"
            style={{ fontFamily: "Manrope" }}
          >
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Platform overview and management tools.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((k) => (
            <div
              key={k.label}
              className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4"
            >
              <div
                className={`w-11 h-11 rounded-lg ${k.bg} flex items-center justify-center shrink-0`}
              >
                <k.icon size={20} className={k.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Manrope" }}>
                  {k.value}
                </p>
                <p className="text-xs text-gray-500">{k.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Revenue */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3
              className="text-sm font-semibold text-gray-900 mb-4"
              style={{ fontFamily: "Manrope" }}
            >
              Monthly Revenue
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#1B4D3E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Listings by Category */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3
              className="text-sm font-semibold text-gray-900 mb-4"
              style={{ fontFamily: "Manrope" }}
            >
              Listings by Category
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {categoryData.map((_: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {secondaryStats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-gray-200 p-4 text-center"
            >
              <s.icon size={18} className="mx-auto text-gray-400 mb-2" />
              <p className="text-xl font-bold text-gray-900" style={{ fontFamily: "Manrope" }}>
                {s.value}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="review">
          <TabsList className="mb-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>


          {/* Users */}
          <TabsContent value="users">
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 border-b border-gray-100">
                <div className="relative max-w-sm">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 focus:border-[#1B4D3E]"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Name</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Email</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Role</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Verification</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u: any) => (
                      <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                        <td className="px-4 py-3 text-gray-500">{u.email}</td>
                        <td className="px-4 py-3">
                          <Badge
                            className={
                              u.role === "admin"
                                ? "bg-purple-100 text-purple-700 border-0"
                                : u.role === "seller"
                                ? "bg-blue-100 text-blue-700 border-0"
                                : "bg-gray-100 text-gray-700 border-0"
                            }
                          >
                            {u.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            className={
                              u.verification_level === "premium"
                                ? "bg-purple-100 text-purple-700 border-0"
                                : u.verification_level === "verified"
                                ? "bg-green-100 text-green-700 border-0"
                                : "bg-gray-100 text-gray-600 border-0"
                            }
                          >
                            {u.verification_level || "basic"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            className={
                              u.status === "active"
                                ? "bg-green-100 text-green-700 border-0"
                                : u.status === "suspended"
                                ? "bg-red-100 text-red-700 border-0"
                                : "bg-gray-100 text-gray-600 border-0"
                            }
                          >
                            {u.status || "active"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {u.role !== "admin" && (
                            <Button
                              size="sm"
                              variant={u.status === "suspended" ? "default" : "destructive"}
                              className="text-xs"
                              disabled={actionLoading === u.id}
                              onClick={() =>
                                handleUserAction(
                                  u.id,
                                  u.status === "suspended" ? "activate" : "suspend"
                                )
                              }
                            >
                              {u.status === "suspended" ? "Activate" : "Suspend"}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Financial */}
          <TabsContent value="financial">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                  <p className="text-3xl font-bold text-[#1B4D3E]" style={{ fontFamily: "Manrope" }}>
                    $847,500
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Gross Merchandise Value</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                  <p className="text-3xl font-bold text-[#1B4D3E]" style={{ fontFamily: "Manrope" }}>
                    $42,375
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Fees Collected (5%)</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                  <p className="text-3xl font-bold text-[#1B4D3E]" style={{ fontFamily: "Manrope" }}>
                    $18,400
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Pending Payouts</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3
                  className="text-sm font-semibold text-gray-900 mb-4"
                  style={{ fontFamily: "Manrope" }}
                >
                  Tax Reporting by State
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">State</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Transactions</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">GMV</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Tax Collected</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taxData.map((row) => (
                        <tr key={row.state} className="border-b border-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{row.state}</td>
                          <td className="px-4 py-3 text-gray-500">{row.transactions}</td>
                          <td className="px-4 py-3 text-gray-500">{row.gmv}</td>
                          <td className="px-4 py-3 text-gray-500">{row.tax}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
