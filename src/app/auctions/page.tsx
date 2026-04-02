"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/api";
import { Gavel, Clock, CheckCircle2, CalendarDays } from "lucide-react";

interface Auction {
  id: string;
  title: string;
  description: string;
  status: string;
  image?: string;
  start_date?: string;
  start_at?: string;
  end_date?: string;
  end_at?: string;
  lot_count?: number;
  total_bids?: number;
  [key: string]: any;
}

function AuctionCard({ auction }: { auction: Auction }) {
  const statusBadge: Record<string, React.ReactNode> = {
    active: (
      <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px] font-bold animate-pulse">
        LIVE
      </Badge>
    ),
    upcoming: (
      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px] font-bold">
        UPCOMING
      </Badge>
    ),
    scheduled: (
      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px] font-bold">
        UPCOMING
      </Badge>
    ),
    completed: (
      <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-[10px] font-medium">
        COMPLETED
      </Badge>
    ),
  };

  const formatDate = (d: string | undefined) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";

  return (
    <Link
      href={`/auctions/${auction.id}`}
      data-testid={`auction-card-${auction.id}`}
      className={`block rounded-xl overflow-hidden border ${
        auction.status === "active"
          ? "border-[#F59E0B] shadow-md"
          : "border-gray-200"
      } hover:shadow-lg transition-shadow duration-300 bg-white`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            auction.image ||
            "https://images.unsplash.com/photo-1568680870491-590cd4e224ab?w=600"
          }
          alt={auction.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2 mb-1">
            {statusBadge[auction.status] || null}
          </div>
          <h3
            className="text-lg font-bold text-white"
            style={{ fontFamily: "Manrope" }}
          >
            {auction.title}
          </h3>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {auction.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Gavel size={12} />
              {auction.lot_count || 0} Lots
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays size={12} />
              {formatDate(auction.start_at || auction.start_date)}
            </span>
          </div>
          <span className="flex items-center gap-1 text-[#1B4D3E] font-medium">
            {auction.total_bids || 0} bids
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api
      .get("/auctions")
      .then((data: any) => setAuctions(Array.isArray(data) ? data : data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const active = auctions.filter((a) => a.status === "active");
  const upcoming = auctions.filter(
    (a) => a.status === "upcoming" || a.status === "scheduled"
  );
  const completed = auctions.filter((a) => a.status === "completed");

  if (loading) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse"
        data-testid="auctions-loading"
      >
        <div className="h-8 bg-gray-200 rounded w-64 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-96 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      data-testid="auctions-page"
    >
      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold text-gray-900 mb-1"
          style={{ fontFamily: "Manrope" }}
        >
          Online Auctions
        </h1>
        <p className="text-sm text-gray-500">
          Bid on quality equipment from verified sellers
        </p>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="bg-gray-100 mb-6">
          <TabsTrigger value="active" data-testid="tab-active">
            Live ({active.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" data-testid="tab-upcoming">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="completed" data-testid="tab-completed">
            Completed ({completed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {active.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Gavel size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No live auctions right now</p>
              <p className="text-sm mt-1">
                Check back soon or browse upcoming auctions
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {active.map((a) => (
                <AuctionCard key={a.id} auction={a} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="upcoming">
          {upcoming.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <CalendarDays size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No upcoming auctions</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((a) => (
                <AuctionCard key={a.id} auction={a} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="completed">
          {completed.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <CheckCircle2
                size={40}
                className="mx-auto mb-3 text-gray-300"
              />
              <p className="font-medium">No completed auctions</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completed.map((a) => (
                <AuctionCard key={a.id} auction={a} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
