"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ListingCard } from "@/components/ListingCard";
import api from "@/lib/api";
import { ArrowRight, Shield, Gavel, Search, Truck, Tractor, HardHat, Users, CheckCircle2, Clock, DollarSign, TrendingUp, CalendarDays, Eye } from "lucide-react";

const CATEGORY_IMAGES: Record<string, string> = {
  tractors: "https://images.unsplash.com/photo-1568680870491-590cd4e224ab?w=400&h=300&fit=crop",
  combines: "https://images.unsplash.com/photo-1731361183731-21d1a6458316?w=400&h=300&fit=crop",
  excavators: "https://images.unsplash.com/photo-1761135192805-c0f3fc4afdf4?w=400&h=300&fit=crop",
  trucks: "https://images.unsplash.com/photo-1734903251828-b8d4c0423e56?w=400&h=300&fit=crop",
  "skid-steers": "https://images.unsplash.com/photo-1763516763181-4372f2987360?w=400&h=300&fit=crop",
};

export default function HomePage() {
  const [featuredListings, setFeaturedListings] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [recentResults, setRecentResults] = useState<any[]>([]);
  const [upcomingAuction, setUpcomingAuction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/listings", { params: { featured: true, limit: 4 } }),
      api.get("/categories"),
      api.get("/auctions"),
      api.get("/recent-auction-results"),
    ]).then(([listRes, catRes, aucRes, resultsRes]) => {
      const listings = listRes.listings || listRes || [];
      setFeaturedListings(Array.isArray(listings) ? listings : []);
      setCategories(Array.isArray(catRes) ? catRes : []);
      const allAuctions = Array.isArray(aucRes) ? aucRes : [];
      setAuctions(allAuctions.filter((a: any) => a.status === "active").slice(0, 2));
      setUpcomingAuction(allAuctions.find((a: any) => a.status === "upcoming") || null);
      setRecentResults(Array.isArray(resultsRes) ? resultsRes : []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div data-testid="home-page">
      {/* Hero */}
      <section className="relative overflow-hidden" data-testid="hero-section">
        <div className="hero-gradient">
          <div className="absolute inset-0 opacity-10"
            style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
            <div className="max-w-2xl">
              <Badge className="bg-white/15 text-white border-white/20 mb-4 text-xs font-medium px-3 py-1">
                Trusted Equipment Marketplace
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight" style={{fontFamily:"Manrope"}}>
                Buy & Sell Equipment <span className="text-[#F59E0B]">With Confidence</span>
              </h1>
              <p className="text-base md:text-lg text-white/80 mb-8 leading-relaxed max-w-lg">
                The premier marketplace for agricultural and construction equipment. Verified sellers, transparent auctions, and secure transactions.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/marketplace">
                  <Button className="bg-[#F59E0B] hover:bg-[#d97706] text-white font-bold h-12 px-6 rounded-md shadow-lg hover:shadow-xl transition-shadow" data-testid="hero-browse-btn">
                    <Search size={18} className="mr-2" /> Browse Equipment
                  </Button>
                </Link>
                <Link href="/auctions">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold h-12 px-6 rounded-md bg-transparent" data-testid="hero-auctions-btn">
                    <Gavel size={18} className="mr-2" /> Live Auctions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="bg-white border-b border-gray-100" data-testid="trust-bar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Active Listings", value: "500+", icon: Search },
                { label: "Verified Sellers", value: "200+", icon: Shield },
                { label: "Auctions Completed", value: "45+", icon: Gavel },
                { label: "Satisfied Buyers", value: "1,200+", icon: Users },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3" data-testid={`trust-stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="w-10 h-10 rounded-lg bg-[#1B4D3E]/10 flex items-center justify-center shrink-0">
                    <s.icon size={18} className="text-[#1B4D3E]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900" style={{fontFamily:"Manrope"}}>{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Active Auctions */}
      {auctions.length > 0 && (
        <section className="py-14 md:py-20 bg-gray-50" data-testid="auctions-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold text-[#F59E0B] uppercase tracking-wider mb-1">Live Now</p>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900" style={{fontFamily:"Manrope"}}>Online Auctions</h2>
              </div>
              <Link href="/auctions" className="text-sm font-semibold text-[#1B4D3E] hover:underline flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {auctions.map((a: any) => (
                <Link key={a.id} href={`/auctions/${a.id}`} data-testid={`auction-card-${a.id}`}
                  className="relative rounded-xl overflow-hidden group h-64 block">
                  <img src={a.image || CATEGORY_IMAGES.tractors} alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 auction-overlay" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-red-500/90 text-white border-0 text-[10px] font-bold animate-pulse">LIVE</Badge>
                      <span className="text-white/70 text-xs">{a.lot_count || 0} Lots &middot; {a.total_bids || 0} Bids</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1" style={{fontFamily:"Manrope"}}>{a.title}</h3>
                    <p className="text-sm text-white/70 line-clamp-1">{a.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Auction Spotlight */}
      {upcomingAuction && (
        <section className="py-14 md:py-16" data-testid="upcoming-spotlight">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-[#1B4D3E] to-[#2C7A63] rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <Badge className="bg-white/15 text-white border-white/20 w-fit mb-3 text-[10px] font-bold px-2.5 py-0.5">
                    COMING SOON
                  </Badge>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{fontFamily:"Manrope"}}>{upcomingAuction.title}</h3>
                  <p className="text-sm text-white/70 mb-4 line-clamp-2">{upcomingAuction.description}</p>
                  <div className="flex items-center gap-4 text-sm text-white/80 mb-6">
                    <span className="flex items-center gap-1.5"><CalendarDays size={14} /> Opens {new Date(upcomingAuction.start_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><Eye size={14} /> {upcomingAuction.lot_count || 0} Lots</span>
                  </div>
                  <Link href={`/auctions/${upcomingAuction.id}`}>
                    <Button className="bg-[#F59E0B] hover:bg-[#d97706] text-white font-bold h-11 px-6 w-fit" data-testid="spotlight-preview-btn">
                      Preview Lots <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                </div>
                <div className="relative hidden md:block">
                  <img src={upcomingAuction.image || CATEGORY_IMAGES.tractors} alt={upcomingAuction.title}
                    className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1B4D3E] to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Auction Results */}
      {recentResults.length > 0 && (
        <section className="py-14 md:py-20 bg-gray-50" data-testid="recent-results-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold text-[#1B4D3E] uppercase tracking-wider mb-1">Market Intelligence</p>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900" style={{fontFamily:"Manrope"}}>Recent Auction Results</h2>
              </div>
              <Link href="/auctions" className="text-sm font-semibold text-[#1B4D3E] hover:underline flex items-center gap-1">
                All Results <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentResults.slice(0, 6).map((lot: any) => (
                <div key={lot.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  data-testid={`result-${lot.id}`}>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">SOLD</Badge>
                    <span className="text-[10px] text-gray-400">Lot #{lot.lot_number}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1" style={{fontFamily:"Manrope"}}>
                    {lot.title?.replace(" - SOLD", "")}
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">{lot.brand_name} &middot; {lot.year}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-[#1B4D3E]" style={{fontFamily:"Manrope"}}>
                      ${lot.winning_bid?.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-gray-400">{lot.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-14 md:py-20" data-testid="categories-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-[#1B4D3E] uppercase tracking-wider mb-1">Browse By</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900" style={{fontFamily:"Manrope"}}>Equipment Categories</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.slice(0, 5).map((cat: any) => (
              <Link key={cat.id} href={`/marketplace?category=${cat.id}`} data-testid={`category-${cat.id}`}
                className="category-card relative rounded-lg overflow-hidden h-40 group block">
                <img src={CATEGORY_IMAGES[cat.id] || CATEGORY_IMAGES.tractors} alt={cat.name}
                  className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-semibold text-sm" style={{fontFamily:"Manrope"}}>{cat.name}</p>
                  <p className="text-white/60 text-xs">{cat.count} listings</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-14 md:py-20 bg-gray-50" data-testid="featured-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-[#F59E0B] uppercase tracking-wider mb-1">Featured</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900" style={{fontFamily:"Manrope"}}>Top Listings</h2>
            </div>
            <Link href="/marketplace" className="text-sm font-semibold text-[#1B4D3E] hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
                  <div className="aspect-[16/10] bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredListings.map((l: any) => <ListingCard key={l.id} listing={l} />)}
            </div>
          )}
        </div>
      </section>

      {/* Why FieldExchange */}
      <section className="py-14 md:py-20" data-testid="trust-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3" style={{fontFamily:"Manrope"}}>Why FieldExchange?</h2>
            <p className="text-base text-gray-500 max-w-xl mx-auto">Built for the equipment industry with trust, transparency, and technology at its core.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Verified Sellers", desc: "Every seller goes through identity verification. Government ID, business license, and phone verification ensure you deal with real people." },
              { icon: Gavel, title: "Transparent Auctions", desc: "Real-time bidding with soft-close protection. No sniping, no hidden fees. Full bid history visible on every lot." },
              { icon: CheckCircle2, title: "Secure Transactions", desc: "Lien disclosure attestations, secure payment processing, and escrow protection for high-value equipment purchases." },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-lg bg-[#1B4D3E]/10 flex items-center justify-center mb-4">
                  <item.icon size={20} className="text-[#1B4D3E]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{fontFamily:"Manrope"}}>{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20 hero-gradient" data-testid="cta-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{fontFamily:"Manrope"}}>Ready to Get Started?</h2>
          <p className="text-base text-white/70 mb-8 max-w-md mx-auto">Join thousands of buyers and sellers on the most trusted equipment marketplace.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register">
              <Button className="bg-[#F59E0B] hover:bg-[#d97706] text-white font-bold h-12 px-8 rounded-md" data-testid="cta-register-btn">
                Create Free Account
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold h-12 px-8 rounded-md bg-transparent" data-testid="cta-browse-btn">
                Browse Equipment
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
