"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { MapPin, Calendar, Shield, CheckCircle2, Star } from "lucide-react";

const VERIFICATION_BADGES: Record<string, { bg: string; text: string; label: string }> = {
  premium: { bg: "bg-purple-100", text: "text-purple-700", label: "Premium Dealer" },
  verified: { bg: "bg-green-100", text: "text-green-700", label: "Verified Seller" },
  basic: { bg: "bg-gray-100", text: "text-gray-600", label: "Basic" },
};

export default function SellerProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api
        .get(`/users/${id}/profile`)
        .then(setProfile)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4D3E]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Manrope" }}>
            Seller Not Found
          </h2>
          <p className="text-sm text-gray-500">This seller profile does not exist.</p>
        </div>
      </div>
    );
  }

  const vLevel = profile.verification_level || "basic";
  const vBadge = VERIFICATION_BADGES[vLevel] || VERIFICATION_BADGES.basic;
  const listings = profile.listings ?? [];
  const initials = (profile.name || "?")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#1B4D3E] to-[#2C7A63]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold shrink-0 border-4 border-white/30">
              {initials}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
                <h1
                  className="text-2xl md:text-3xl font-bold text-white"
                  style={{ fontFamily: "Manrope" }}
                >
                  {profile.name}
                </h1>
                <Badge className={`${vBadge.bg} ${vBadge.text} border-0 text-xs`}>
                  {vLevel === "premium" && <Star size={12} className="mr-1" />}
                  {vLevel === "verified" && <CheckCircle2 size={12} className="mr-1" />}
                  {vBadge.label}
                </Badge>
              </div>
              {profile.business_name && (
                <p className="text-sm text-white/80 mb-2">
                  <Shield size={13} className="inline mr-1" />
                  {profile.business_name}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-white/70">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={13} /> {profile.location}
                  </span>
                )}
                {profile.created_at && (
                  <span className="flex items-center gap-1">
                    <Calendar size={13} /> Member since{" "}
                    {new Date(profile.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
                <span className="capitalize">
                  {profile.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: "Manrope" }}
          >
            Active Listings ({listings.length})
          </h2>
        </div>
        {listings.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500">This seller has no active listings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {listings.map((listing: any) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
