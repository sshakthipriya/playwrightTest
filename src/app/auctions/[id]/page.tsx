"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";
import { ChevronLeft, Gavel, Clock, MapPin, Timer } from "lucide-react";

interface Lot {
  id: string;
  lot_number: number;
  title: string;
  description?: string;
  images?: string[];
  brand_name?: string;
  year?: number;
  hours?: number;
  current_bid: number | null;
  bid_count: number;
  reserve_price?: number;
  close_at?: string;
  status: string;
  [key: string]: any;
}

interface Auction {
  id: string;
  title: string;
  description: string;
  status: string;
  image?: string;
  start_date?: string;
  end_date?: string;
  end_at?: string;
  lot_count?: number;
  soft_close_minutes?: number;
  lots?: Lot[];
  [key: string]: any;
}

function useCountdown(targetDate: string | undefined) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft("");
      return;
    }

    const calc = () => {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft("Ended");
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${s}s`);
    };
    calc();
    const iv = setInterval(calc, 1000);
    return () => clearInterval(iv);
  }, [targetDate]);

  return timeLeft;
}

function LotRow({ lot }: { lot: Lot }) {
  const timeLeft = useCountdown(lot.close_at);
  const reserveStatus =
    lot.current_bid != null && lot.current_bid >= (lot.reserve_price || 0)
      ? "met"
      : "not_met";

  return (
    <Link
      href={`/lots/${lot.id}`}
      data-testid={`lot-row-${lot.id}`}
      className="grid grid-cols-12 gap-4 items-center py-4 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
    >
      <div className="col-span-1 text-center">
        <span className="text-sm font-bold text-gray-500">
          #{lot.lot_number}
        </span>
      </div>
      <div className="col-span-1">
        <div className="w-14 h-14 rounded overflow-hidden bg-gray-100">
          {lot.images?.[0] ? (
            <img
              src={lot.images[0]}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>
      </div>
      <div className="col-span-4">
        <p
          className="text-sm font-semibold text-gray-900 line-clamp-1"
          style={{ fontFamily: "Manrope" }}
        >
          {lot.title}
        </p>
        <p className="text-xs text-gray-500">
          {lot.brand_name} &middot; {lot.year} &middot;{" "}
          {lot.hours?.toLocaleString()} hrs
        </p>
      </div>
      <div className="col-span-2 text-center">
        <p
          className="text-base font-bold text-[#1B4D3E] countdown-digit"
          style={{ fontFamily: "Manrope" }}
        >
          ${lot.current_bid?.toLocaleString()}
        </p>
        <p className="text-[10px] text-gray-400">{lot.bid_count} bids</p>
      </div>
      <div className="col-span-2 text-center">
        {reserveStatus === "met" ? (
          <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">
            Reserve Met
          </Badge>
        ) : (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">
            Reserve Not Met
          </Badge>
        )}
      </div>
      <div className="col-span-2 text-right">
        <p className="text-sm font-medium text-gray-700 countdown-digit">
          {timeLeft}
        </p>
        {lot.status === "active" && (
          <p className="text-[10px] text-gray-400">Time left</p>
        )}
        {lot.status === "sold" && (
          <Badge className="bg-gray-100 text-gray-600 text-[10px]">SOLD</Badge>
        )}
      </div>
    </Link>
  );
}

export default function AuctionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const endTime = useCountdown(auction?.end_at || auction?.end_date);

  useEffect(() => {
    api
      .get(`/auctions/${id}`)
      .then((data: any) => setAuction(data.data || data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
        <div className="h-48 bg-gray-200 rounded-xl mb-6" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="text-center py-20 text-gray-500">Auction not found</div>
    );
  }

  const statusBadge: Record<string, React.ReactNode> = {
    active: (
      <Badge className="bg-red-100 text-red-700 border-red-200 text-xs font-bold animate-pulse">
        LIVE NOW
      </Badge>
    ),
    upcoming: (
      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs font-bold">
        UPCOMING
      </Badge>
    ),
    scheduled: (
      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs font-bold">
        UPCOMING
      </Badge>
    ),
    completed: (
      <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs">
        COMPLETED
      </Badge>
    ),
  };

  const lotCount = auction.lots?.length || auction.lot_count || 0;

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      data-testid="auction-detail-page"
    >
      <Link
        href="/auctions"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#1B4D3E] mb-4"
      >
        <ChevronLeft size={16} /> All Auctions
      </Link>

      {/* Header */}
      <div className="relative rounded-xl overflow-hidden h-48 md:h-56 mb-6">
        <img
          src={
            auction.image ||
            "https://images.unsplash.com/photo-1568680870491-590cd4e224ab?w=1200"
          }
          alt={auction.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            {statusBadge[auction.status] || null}
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold text-white"
            style={{ fontFamily: "Manrope" }}
          >
            {auction.title}
          </h1>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-white rounded-lg border p-4 mb-6 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <Gavel size={16} className="text-[#1B4D3E]" />
          <span className="text-sm">
            <span className="font-semibold">{lotCount}</span> Lots
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Timer size={16} className="text-[#F59E0B]" />
          <span className="text-sm">
            Ends:{" "}
            <span className="font-semibold countdown-digit">{endTime}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-400" />
          <span className="text-sm text-gray-500">
            Soft close: {auction.soft_close_minutes || 5} min extension
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-6">{auction.description}</p>

      {/* Lots Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b">
          <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-1 text-center">Lot</div>
            <div className="col-span-1"></div>
            <div className="col-span-4">Equipment</div>
            <div className="col-span-2 text-center">Current Bid</div>
            <div className="col-span-2 text-center">Reserve</div>
            <div className="col-span-2 text-right">Time Left</div>
          </div>
        </div>
        {auction.lots?.map((lot) => (
          <LotRow key={lot.id} lot={lot} />
        ))}
        {(!auction.lots || auction.lots.length === 0) && (
          <div className="text-center py-12 text-gray-400">
            <Gavel size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No lots in this auction yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
