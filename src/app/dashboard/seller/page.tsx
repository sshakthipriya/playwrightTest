"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Package,
  Eye,
  MessageSquare,
  DollarSign,
  Plus,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: "bg-green-100", text: "text-green-700", label: "Active" },
  pending_review: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending Review" },
  pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending Review" },
  rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
  expired: { bg: "bg-gray-100", text: "text-gray-600", label: "Expired" },
  draft: { bg: "bg-blue-100", text: "text-blue-700", label: "Draft" },
  sold: { bg: "bg-green-100", text: "text-green-700", label: "Sold" },
};

export default function SellerDashboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      api
        .get("/dashboard/seller")
        .then(setData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4D3E]" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const stats = [
    {
      label: "Active Listings",
      value: data?.active_listings ?? 0,
      icon: Package,
      color: "text-[#1B4D3E]",
      bg: "bg-[#1B4D3E]/10",
    },
    {
      label: "Total Views",
      value: data?.total_views ?? 0,
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Unread Messages",
      value: 3,
      icon: MessageSquare,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      label: "Total Sales",
      value: data?.sold_listings ?? 0,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ];

  const financials = [
    { label: "Total Sales", value: "$127,500" },
    { label: "Fees Paid", value: "$6,375" },
    { label: "Pending Payouts", value: "$18,400" },
  ];

  const listings = data?.recent_listings ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-2xl md:text-3xl font-bold text-gray-900"
              style={{ fontFamily: "Manrope" }}
            >
              Welcome back, {user?.name?.split(" ")[0] || "Seller"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your listings, track performance, and grow your sales.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4"
            >
              <div
                className={`w-11 h-11 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}
              >
                <s.icon size={20} className={s.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Manrope" }}>
                  {s.value}
                </p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Financial Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2
            className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
            style={{ fontFamily: "Manrope" }}
          >
            <BarChart3 size={18} className="text-[#1B4D3E]" /> Financial Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {financials.map((f) => (
              <div key={f.label} className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-[#1B4D3E]" style={{ fontFamily: "Manrope" }}>
                  {f.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{f.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="listings">
          <TabsList className="mb-4">
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="lots">Auction Lots</TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            {listings.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Package size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">You have no listings yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {listings.map((listing: any) => {
                  const status = STATUS_COLORS[listing.status] || STATUS_COLORS.draft;
                  return (
                    <Link
                      key={listing.id}
                      href={`/listings/${listing.id}`}
                      className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow block"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {listing.images?.[0] ? (
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className="text-sm font-semibold text-gray-900 truncate"
                            style={{ fontFamily: "Manrope" }}
                          >
                            {listing.title}
                          </h3>
                          <Badge className={`${status.bg} ${status.text} border-0 text-[10px] shrink-0`}>
                            {status.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye size={12} /> {listing.views ?? 0} views
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare size={12} /> {listing.inquiries ?? 0} inquiries
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p
                          className="text-lg font-bold text-[#1B4D3E]"
                          style={{ fontFamily: "Manrope" }}
                        >
                          {listing.asking_price
                            ? `$${listing.asking_price.toLocaleString()}`
                            : "Contact"}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="lots">
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Clock size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 mb-2">
                You have {data?.active_lots ?? 0} active auction lot(s).
              </p>
              <p className="text-xs text-gray-400">
                Total bid value: ${(data?.total_bid_value ?? 0).toLocaleString()}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
