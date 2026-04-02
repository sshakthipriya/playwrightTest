"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Eye, Heart, Gauge } from "lucide-react";

const CONDITION_STYLES: Record<string, string> = {
  "Field-Ready Premium": "bg-emerald-100 text-emerald-800 border-emerald-300",
  "Field-Ready": "bg-green-100 text-green-800 border-green-200",
  "Working Order": "bg-blue-100 text-blue-700 border-blue-200",
  "Needs Service": "bg-amber-100 text-amber-800 border-amber-200",
  "Parts Only": "bg-red-100 text-red-700 border-red-200",
};

export function ListingCard({ listing, compact = false }: { listing: any; compact?: boolean }) {
  const priceDisplay = listing.price_type === "asking_price" && listing.asking_price
    ? `$${listing.asking_price.toLocaleString()}`
    : listing.price_type === "make_offer" ? "Make Offer"
    : "Contact for Price";

  const conditionColor = CONDITION_STYLES[listing.condition] || "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <Link href={`/listings/${listing.id}`} data-testid={`listing-card-${listing.id}`}
      className="listing-card bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group block">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        {listing.images?.[0] ? (
          <img src={listing.images[0]} alt={listing.title}
            className="listing-image w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <span className="text-4xl">No Image</span>
          </div>
        )}
        {listing.featured && (
          <span className="absolute top-2.5 left-2.5 bg-[#F59E0B] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            Featured
          </span>
        )}
        <span className={`absolute top-2.5 right-2.5 ${conditionColor} text-[10px] font-medium px-2 py-0.5 rounded-full border`}
          data-testid={`condition-badge-${listing.id}`}>
          {listing.condition}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <p className="text-xs text-gray-500 font-medium">{listing.brand_name} &middot; {listing.year || "N/A"}</p>
          <div className="flex items-center gap-2 shrink-0">
            {listing.hours != null && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock size={11} /> {listing.hours.toLocaleString()} hrs
              </span>
            )}
            {listing.horsepower && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Gauge size={11} /> {listing.horsepower} HP
              </span>
            )}
          </div>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-[#1B4D3E] transition-colors" style={{fontFamily:"Manrope"}}>
          {listing.title}
        </h3>
        <p className="text-lg font-bold text-[#1B4D3E] mb-2" style={{fontFamily:"Manrope"}}>{priceDisplay}</p>
        {!compact && (
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <MapPin size={11} /> {listing.location_city}, {listing.location_state}
            </span>
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1"><Eye size={11} /> {listing.views}</span>
              <span className="flex items-center gap-1"><Heart size={11} /> {listing.watchlist_count}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
