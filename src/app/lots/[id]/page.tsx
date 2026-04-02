"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import {
  ChevronLeft,
  Gavel,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Shield,
  Eye,
  Users,
  Gauge,
  CalendarDays,
  Hash,
  Wrench,
} from "lucide-react";

// 6-state countdown timer
interface CountdownState {
  display: string;
  phase: string;
  label: string;
  color: string;
}

function useCountdown(
  targetDate: string | undefined,
  lotStatus: string | undefined,
  reserveMet: boolean | undefined
): CountdownState {
  const [state, setState] = useState<CountdownState>({
    display: "",
    phase: "normal",
    label: "",
    color: "",
  });

  useEffect(() => {
    const calc = () => {
      if (lotStatus === "sold") {
        setState({
          display: "SOLD",
          phase: "sold",
          label: "Auction Complete",
          color: "bg-[#1B4D3E] text-white",
        });
        return;
      }
      if (lotStatus === "cancelled") {
        setState({
          display: "Cancelled",
          phase: "cancelled",
          label: "Lot Withdrawn",
          color: "bg-gray-200 text-gray-600",
        });
        return;
      }
      if (lotStatus === "ended") {
        setState({
          display: "Ended",
          phase: "ended",
          label: "Auction Ended",
          color: "bg-gray-200 text-gray-600",
        });
        return;
      }
      if (lotStatus === "upcoming") {
        setState({
          display: "Not Started",
          phase: "upcoming",
          label: "Bidding Opens Soon",
          color: "bg-blue-50 text-blue-700",
        });
        return;
      }

      if (!targetDate) {
        setState({
          display: "",
          phase: "normal",
          label: "",
          color: "",
        });
        return;
      }

      const now = new Date();
      const target = new Date(targetDate);
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setState({
          display: "Ended",
          phase: "ended",
          label: reserveMet
            ? "Closing - Reserve Met"
            : "Ended - Reserve Not Met",
          color: reserveMet
            ? "bg-green-50 text-green-700"
            : "bg-red-50 text-red-700",
        });
        return;
      }

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const display =
        d > 0
          ? `${d}d ${h}h ${m}m ${s}s`
          : h > 0
          ? `${h}h ${m}m ${s}s`
          : `${m}m ${s}s`;

      if (lotStatus === "soft_close") {
        setState({
          display,
          phase: "soft_close",
          label: "Soft Close - Time extends with bids",
          color: "bg-red-50 text-red-600 border-red-200",
        });
      } else if (diff < 300000) {
        // < 5 min
        setState({
          display,
          phase: "final",
          label: "Final Moments",
          color: "bg-red-100 text-red-700 border-red-300 animate-pulse",
        });
      } else if (diff < 3600000) {
        // < 1 hour
        setState({
          display,
          phase: "urgent",
          label: "Closing Soon",
          color: "bg-amber-50 text-amber-700 border-amber-200",
        });
      } else {
        const label = !reserveMet ? "Reserve Not Yet Met" : "Active Bidding";
        const color = !reserveMet
          ? "bg-amber-50 text-amber-700"
          : "bg-green-50 text-green-700";
        setState({ display, phase: "normal", label, color });
      }
    };

    calc();
    const iv = setInterval(calc, 1000);
    return () => clearInterval(iv);
  }, [targetDate, lotStatus, reserveMet]);

  return state;
}

const CONDITION_STYLES: Record<string, string> = {
  "Field-Ready Premium": "bg-emerald-100 text-emerald-800",
  "Field-Ready": "bg-green-100 text-green-800",
  "Working Order": "bg-blue-100 text-blue-700",
  "Needs Service": "bg-amber-100 text-amber-800",
  "Parts Only": "bg-red-100 text-red-700",
};

interface Bid {
  id: string;
  bidder_name: string;
  amount: number;
  placed_at: string;
  is_proxy?: boolean;
  [key: string]: any;
}

interface LotData {
  id: string;
  title: string;
  description?: string;
  lot_number: number;
  images?: string[];
  brand_name?: string;
  brand?: string;
  model?: string;
  year?: number;
  hours?: number;
  location?: string;
  condition?: string;
  category?: string;
  status: string;
  current_bid: number | null;
  starting_bid?: number;
  start_bid?: number;
  bid_increment: number;
  bid_count: number;
  reserve_price?: number;
  reserve_met?: boolean;
  close_at?: string;
  bids?: Bid[];
  auction?: {
    id: string;
    title: string;
    [key: string]: any;
  };
  winning_bid?: number;
  seller_id?: string;
  [key: string]: any;
}

export default function LotDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [lot, setLot] = useState<LotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [bidding, setBidding] = useState(false);
  const countdown = useCountdown(lot?.close_at, lot?.status, lot?.reserve_met);

  const fetchLot = useCallback(() => {
    api
      .get(`/lots/${id}`)
      .then((data: any) => {
        const lotData = data.data || data;
        setLot(lotData);
        const minBid =
          lotData.bids?.length > 0
            ? (lotData.current_bid || 0) + (lotData.bid_increment || 0)
            : lotData.starting_bid || lotData.start_bid || 0;
        setBidAmount(String(minBid));
      })
      .catch(() => toast.error("Lot not found"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchLot();
  }, [fetchLot]);

  useEffect(() => {
    if (
      !lot ||
      lot.status === "sold" ||
      lot.status === "cancelled" ||
      lot.status === "ended"
    )
      return;
    const iv = setInterval(fetchLot, 10000);
    return () => clearInterval(iv);
  }, [lot?.id, lot?.status, fetchLot]);

  const placeBid = async () => {
    if (!isAuthenticated) {
      toast.error("Sign in to place a bid on this lot");
      return;
    }
    const amount = parseFloat(bidAmount);
    if (isNaN(amount)) {
      toast.error("Enter a valid bid amount");
      return;
    }
    setBidding(true);
    try {
      await api.post(`/lots/${id}/bid`, { amount, is_proxy: false });
      toast.success(`Bid of $${amount.toLocaleString()} placed successfully!`);
      fetchLot();
    } catch (e: any) {
      toast.error(
        e.response?.data?.detail ||
          e.response?.data?.error ||
          "Unable to place bid. Please try again."
      );
    } finally {
      setBidding(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="aspect-[16/9] bg-gray-200 rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!lot) {
    return (
      <div className="text-center py-20 text-gray-500">Lot not found</div>
    );
  }

  const minBid =
    lot.bids && lot.bids.length > 0
      ? (lot.current_bid || 0) + (lot.bid_increment || 0)
      : lot.starting_bid || lot.start_bid || 0;
  const reserveMet = lot.reserve_met;
  const isActive = lot.status === "active" || lot.status === "soft_close";
  const condStyle =
    CONDITION_STYLES[lot.condition || ""] || "bg-gray-100 text-gray-700";

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      data-testid="lot-detail-page"
    >
      {/* Zone 1: Breadcrumb */}
      {lot.auction && (
        <Link
          href={`/auctions/${lot.auction.id}`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#1B4D3E] mb-4"
          data-testid="back-to-auction"
        >
          <ChevronLeft size={16} /> Back to {lot.auction.title}
        </Link>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Zone 2: Hero Image */}
          <div
            className="relative rounded-lg overflow-hidden bg-gray-100 aspect-[16/9]"
            data-testid="lot-hero-image"
          >
            {lot.images?.[0] ? (
              <img
                src={lot.images[0]}
                alt={lot.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                No Image
              </div>
            )}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <Badge className="bg-white/90 text-gray-900 font-bold text-sm border-0">
                Lot #{lot.lot_number}
              </Badge>
              {lot.status === "soft_close" && (
                <Badge className="bg-red-500 text-white border-0 text-xs animate-pulse">
                  SOFT CLOSE
                </Badge>
              )}
            </div>
            {lot.condition && (
              <Badge
                className={`absolute top-3 right-3 ${condStyle} border-0 text-xs font-medium`}
              >
                {lot.condition}
              </Badge>
            )}
          </div>

          {/* Zone 3: Title + Quick Stats */}
          <div>
            <h1
              className="text-xl md:text-2xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "Manrope" }}
              data-testid="lot-title"
            >
              {lot.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {(lot.brand_name || lot.brand) && (
                <span className="flex items-center gap-1.5">
                  <Wrench size={14} className="text-gray-400" />{" "}
                  {lot.brand_name || lot.brand}
                </span>
              )}
              {lot.year && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={14} className="text-gray-400" />{" "}
                  {lot.year}
                </span>
              )}
              {lot.hours != null && lot.hours > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-gray-400" />{" "}
                  {lot.hours.toLocaleString()} hrs
                </span>
              )}
              {lot.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-gray-400" /> {lot.location}
                </span>
              )}
            </div>
          </div>

          {/* Zone 4: Trust Badges */}
          <div className="flex flex-wrap gap-3" data-testid="trust-badges">
            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 rounded-full px-3 py-1.5 border border-gray-100">
              <Shield size={12} className="text-green-600" /> Lien Disclosure on
              File
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 rounded-full px-3 py-1.5 border border-gray-100">
              <CheckCircle2 size={12} className="text-green-600" /> Verified
              Seller
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 rounded-full px-3 py-1.5 border border-gray-100">
              <Eye size={12} className="text-blue-600" /> Soft-Close Protected
            </div>
          </div>

          {/* Zone 5-8: Tabbed Content */}
          <Tabs defaultValue="details">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="details">Description</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="bids">
                Bid History ({lot.bid_count})
              </TabsTrigger>
              <TabsTrigger value="disclosure">Disclosures</TabsTrigger>
            </TabsList>

            {/* Zone 5: Description */}
            <TabsContent value="details" className="mt-4">
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {lot.description}
              </p>
            </TabsContent>

            {/* Zone 6: Specs */}
            <TabsContent value="specs" className="mt-4">
              <div className="bg-white rounded-lg border">
                <table className="w-full text-sm" data-testid="lot-specs-table">
                  <tbody>
                    {(
                      [
                        ["Brand", lot.brand_name || lot.brand],
                        ["Model", lot.model],
                        ["Year", lot.year],
                        ["Hours", lot.hours?.toLocaleString()],
                        ["Condition", lot.condition],
                        ["Category", lot.category],
                        ["Location", lot.location],
                      ] as [string, any][]
                    )
                      .filter(([, v]) => v)
                      .map(([k, v], i) => (
                        <tr
                          key={k}
                          className={
                            i % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }
                        >
                          <td className="py-2.5 px-4 font-medium text-gray-700 w-36">
                            {k}
                          </td>
                          <td className="py-2.5 px-4 text-gray-600">{v}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Zone 7: Bid History */}
            <TabsContent value="bids" className="mt-4">
              <div className="space-y-2" data-testid="bid-history">
                {!lot.bids || lot.bids.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">
                    No bids yet. Be the first to bid on this lot!
                  </p>
                ) : (
                  lot.bids.map((b, i) => (
                    <div
                      key={b.id}
                      className={`flex items-center justify-between py-2.5 px-4 rounded ${
                        i === 0
                          ? "bg-green-50 border border-green-200"
                          : "bg-white border border-gray-100"
                      }`}
                      data-testid={`bid-${b.id}`}
                    >
                      <div className="flex items-center gap-2">
                        {i === 0 && (
                          <TrendingUp size={14} className="text-green-600" />
                        )}
                        <span className="text-sm font-medium text-gray-700">
                          {b.bidder_name}
                        </span>
                        {b.is_proxy && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5"
                          >
                            Proxy
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900 countdown-digit">
                          ${b.amount.toLocaleString()}
                        </span>
                        <p className="text-[10px] text-gray-400">
                          {new Date(b.placed_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Zone 8: Disclosures */}
            <TabsContent value="disclosure" className="mt-4">
              <div className="space-y-3">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle
                    size={14}
                    className="text-amber-600 shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-xs font-semibold text-amber-800 mb-0.5">
                      Lien Disclosure
                    </p>
                    <p className="text-xs text-amber-700">
                      Buyer is responsible for independent lien verification
                      prior to purchase. Equipment sold as-is unless otherwise
                      noted.
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                  <Shield
                    size={14}
                    className="text-blue-600 shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-xs font-semibold text-blue-800 mb-0.5">
                      Buyer Protection
                    </p>
                    <p className="text-xs text-blue-700">
                      All auction transactions are covered by FieldExchange's
                      buyer protection policy. Dispute resolution available
                      within 5 business days of delivery.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Bid Panel */}
        <div>
          <div
            className={`rounded-lg border-2 p-5 sticky top-20 ${
              isActive ? "border-[#F59E0B] bid-pulse" : "border-gray-200"
            }`}
            data-testid="bid-panel"
          >
            {/* Zone 9: Countdown Timer with 6 states */}
            <div
              className={`rounded-lg p-4 mb-4 text-center border ${countdown.color}`}
              data-testid="countdown-zone"
            >
              <p className="text-[10px] uppercase tracking-wider font-semibold mb-1 opacity-80">
                {countdown.label}
              </p>
              <p
                className="text-2xl font-bold countdown-digit"
                style={{ fontFamily: "Manrope" }}
                data-testid="countdown-timer"
              >
                {countdown.display}
              </p>
              {countdown.phase === "soft_close" && (
                <p className="text-[10px] mt-1 font-medium opacity-80">
                  New bids extend closing time by 5 minutes
                </p>
              )}
              {countdown.phase === "final" && (
                <p className="text-[10px] mt-1 font-medium opacity-80">
                  Last chance to bid!
                </p>
              )}
            </div>

            {/* Zone 10: Current Bid */}
            <div className="text-center mb-4" data-testid="current-bid-zone">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Current Bid
              </p>
              <p
                className="text-3xl font-bold text-[#1B4D3E] countdown-digit"
                style={{ fontFamily: "Manrope" }}
                data-testid="current-bid"
              >
                ${lot.current_bid?.toLocaleString()}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                {reserveMet ? (
                  <span
                    className="flex items-center gap-1 text-xs text-green-600 font-medium"
                    data-testid="reserve-met"
                  >
                    <CheckCircle2 size={12} /> Reserve Met
                  </span>
                ) : (
                  <span
                    className="flex items-center gap-1 text-xs text-amber-600 font-medium"
                    data-testid="reserve-not-met"
                  >
                    <AlertTriangle size={12} /> Reserve Not Met
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  &middot; {lot.bid_count} bid
                  {lot.bid_count !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Zone 11: Bid Input */}
            {isActive ? (
              <div data-testid="bid-form">
                <p className="text-xs text-gray-500 mb-2">
                  Minimum:{" "}
                  <span className="font-semibold text-gray-700">
                    ${minBid.toLocaleString()}
                  </span>
                  <span className="text-gray-400 ml-1">
                    (+${lot.bid_increment.toLocaleString()} increment)
                  </span>
                </p>
                <div className="flex gap-2 mb-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                      $
                    </span>
                    <Input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="pl-7 text-lg font-bold h-12 countdown-digit"
                      data-testid="bid-input"
                    />
                  </div>
                </div>
                <Button
                  onClick={placeBid}
                  disabled={bidding}
                  className="w-full bg-[#F59E0B] hover:bg-[#d97706] text-white font-bold h-12 text-base"
                  data-testid="place-bid-btn"
                >
                  <Gavel size={18} className="mr-2" />{" "}
                  {bidding ? "Placing Bid..." : "Place Bid"}
                </Button>
                <p className="text-[10px] text-gray-400 text-center mt-2">
                  By bidding, you agree to the auction terms and buyer&apos;s
                  premium
                </p>
              </div>
            ) : (
              <div className="text-center py-4" data-testid="lot-ended">
                {lot.status === "sold" ? (
                  <>
                    <p className="text-sm text-gray-500">
                      This lot has been sold
                    </p>
                    <p className="text-lg font-bold text-[#1B4D3E] mt-1">
                      Hammer Price: $
                      {(lot.winning_bid || lot.current_bid)?.toLocaleString()}
                    </p>
                  </>
                ) : lot.status === "upcoming" ? (
                  <p className="text-sm text-blue-600 font-medium">
                    Bidding has not started yet
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">This lot has ended</p>
                )}
              </div>
            )}

            <Separator className="my-4" />
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div>
                <p className="text-gray-400">Start Bid</p>
                <p className="font-semibold text-gray-700">
                  $
                  {(
                    lot.starting_bid ||
                    lot.start_bid ||
                    0
                  ).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Increment</p>
                <p className="font-semibold text-gray-700">
                  ${lot.bid_increment?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Total Bids</p>
                <p className="font-semibold text-gray-700">{lot.bid_count}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
