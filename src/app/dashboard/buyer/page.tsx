"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ListingCard } from "@/components/ListingCard";
import { Heart, Gavel, Trophy, DollarSign, ArrowRight } from "lucide-react";

export default function BuyerDashboard() {
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
        .get("/dashboard/buyer")
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
      label: "Watchlist",
      value: data?.watchlist_count ?? 0,
      icon: Heart,
      color: "text-pink-600",
      bg: "bg-pink-100",
    },
    {
      label: "Active Bids",
      value: data?.active_bids ?? 0,
      icon: Gavel,
      color: "text-[#1B4D3E]",
      bg: "bg-[#1B4D3E]/10",
    },
    {
      label: "Won Auctions",
      value: data?.won_lots ?? 0,
      icon: Trophy,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      label: "Total Spent",
      value: `$${((data?.won_lot_items ?? []).reduce((s: number, l: any) => s + (l.winning_bid || l.current_bid || 0), 0)).toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ];

  const watchedListings = data?.watched_listings ?? [];
  const activeBids = data?.active_bid_lots ?? [];
  const wonLots = data?.won_lot_items ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-2xl md:text-3xl font-bold text-gray-900"
            style={{ fontFamily: "Manrope" }}
          >
            Welcome back, {user?.name?.split(" ")[0] || "Buyer"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your watchlist, bids, and won auctions.
          </p>
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

        {/* Tabs */}
        <Tabs defaultValue="watchlist">
          <TabsList className="mb-4">
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="bids">Active Bids</TabsTrigger>
            <TabsTrigger value="won">Won Auctions</TabsTrigger>
          </TabsList>

          <TabsContent value="watchlist">
            {watchedListings.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Heart size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 mb-4">Your watchlist is empty.</p>
                <Link href="/marketplace">
                  <Button className="bg-[#1B4D3E] hover:bg-[#163f33] text-white">
                    Browse Equipment <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {watchedListings.map((listing: any) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bids">
            {activeBids.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Gavel size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 mb-4">You have no active bids.</p>
                <Link href="/auctions">
                  <Button className="bg-[#1B4D3E] hover:bg-[#163f33] text-white">
                    Browse Auctions <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activeBids.map((lot: any) => (
                  <Link
                    key={lot.id}
                    href={`/auctions/${lot.auction_id}`}
                    className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow block"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className="text-sm font-semibold text-gray-900 truncate"
                          style={{ fontFamily: "Manrope" }}
                        >
                          {lot.title}
                        </h3>
                        {lot.is_highest_bidder ? (
                          <Badge className="bg-green-100 text-green-700 border-0 text-[10px]">
                            Highest Bidder
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 border-0 text-[10px]">
                            Outbid
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Lot #{lot.lot_number} &middot; {lot.brand_name}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className="text-lg font-bold text-[#1B4D3E]"
                        style={{ fontFamily: "Manrope" }}
                      >
                        ${(lot.current_bid ?? 0).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-gray-400">Current Bid</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="won">
            {wonLots.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Trophy size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 mb-4">You haven&apos;t won any auctions yet.</p>
                <Link href="/auctions">
                  <Button className="bg-[#1B4D3E] hover:bg-[#163f33] text-white">
                    Browse Auctions <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {wonLots.map((lot: any) => (
                  <div
                    key={lot.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className="text-sm font-semibold text-gray-900 truncate"
                          style={{ fontFamily: "Manrope" }}
                        >
                          {lot.title}
                        </h3>
                        <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px]">
                          Won
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        Lot #{lot.lot_number} &middot; {lot.brand_name}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className="text-lg font-bold text-[#1B4D3E]"
                        style={{ fontFamily: "Manrope" }}
                      >
                        ${(lot.winning_bid ?? lot.current_bid ?? 0).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-gray-400">Winning Bid</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
