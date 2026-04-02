"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { ListingCard } from "@/components/ListingCard";
import api from "@/lib/api";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";

const STATES = ["Iowa","Missouri","Kansas","Nebraska","Oklahoma","Texas","Minnesota","Illinois","Indiana","Ohio"];
const CONDITIONS = ["Field-Ready Premium","Field-Ready","Working Order","Needs Service","Parts Only"];
const TRANSMISSIONS = ["IVT","CVT","Powershift","Hydrostatic","Manual","Shuttle","Auto Command CVT"];

export default function MarketplacePageWrapper() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><div className="animate-pulse h-8 bg-gray-200 rounded w-64 mb-4" /></div>}>
      <MarketplacePage />
    </Suspense>
  );
}

function MarketplacePage() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [condition, setCondition] = useState("");
  const [state, setState] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [yearRange, setYearRange] = useState([2010, 2026]);
  const [hoursRange, setHoursRange] = useState([0, 10000]);
  const [hpRange, setHpRange] = useState([0, 1000]);
  const [transmission, setTransmission] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    Promise.all([api.get("/categories"), api.get("/brands")]).then(([c, b]) => {
      setCategories(Array.isArray(c) ? c : []);
      setBrands(Array.isArray(b) ? b : []);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: any = { page, limit: 12, sort };
    if (search) params.search = search;
    if (category) params.category = category;
    if (brand) params.brand = brand;
    if (condition) params.condition = condition;
    if (state) params.state = state;
    if (yearRange[0] > 2010) params.min_year = yearRange[0];
    if (yearRange[1] < 2026) params.max_year = yearRange[1];
    if (hoursRange[0] > 0) params.min_hours = hoursRange[0];
    if (hoursRange[1] < 10000) params.max_hours = hoursRange[1];
    if (hpRange[0] > 0) params.min_hp = hpRange[0];
    if (hpRange[1] < 1000) params.max_hp = hpRange[1];
    if (transmission) params.transmission = transmission;
    api.get("/listings", { params }).then((r: any) => {
      setListings(r.listings || []);
      setTotal(r.total || 0);
      setPages(r.pages || 1);
    }).finally(() => setLoading(false));
  }, [search, category, brand, condition, state, sort, page, yearRange, hoursRange, hpRange, transmission]);

  const clearFilters = () => {
    setSearch(""); setCategory(""); setBrand(""); setCondition(""); setState("");
    setYearRange([2010, 2026]); setHoursRange([0, 10000]); setHpRange([0, 1000]);
    setTransmission(""); setPage(1);
  };
  const activeFilters = [category, brand, condition, state, transmission].filter(Boolean).length
    + (yearRange[0] > 2010 || yearRange[1] < 2026 ? 1 : 0)
    + (hoursRange[0] > 0 || hoursRange[1] < 10000 ? 1 : 0)
    + (hpRange[0] > 0 || hpRange[1] < 1000 ? 1 : 0);

  const FilterPanel = () => (
    <div className="space-y-5">
      <div>
        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Category</Label>
        <Select value={category} onValueChange={(v: string) => { setCategory(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger data-testid="filter-category"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Brand</Label>
        <Select value={brand} onValueChange={(v: string) => { setBrand(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger data-testid="filter-brand"><SelectValue placeholder="All Brands" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {brands.map((b: any) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Condition</Label>
        <Select value={condition} onValueChange={(v: string) => { setCondition(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger data-testid="filter-condition"><SelectValue placeholder="Any Condition" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Condition</SelectItem>
            {CONDITIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">State</Label>
        <Select value={state} onValueChange={(v: string) => { setState(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger data-testid="filter-state"><SelectValue placeholder="All States" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <button onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-xs font-semibold text-[#1B4D3E] hover:underline flex items-center gap-1"
        data-testid="toggle-advanced-filters">
        {showAdvanced ? "Hide" : "Show"} Advanced Filters
      </button>

      {showAdvanced && (
        <div className="space-y-5 pt-2 border-t border-gray-100">
          <div>
            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
              Year Range: {yearRange[0]} - {yearRange[1]}
            </Label>
            <Slider min={2010} max={2026} step={1} value={yearRange}
              onValueChange={(v: number[]) => { setYearRange(v); setPage(1); }}
              data-testid="filter-year-range" className="mt-2" />
          </div>
          <div>
            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
              Hours: {hoursRange[0].toLocaleString()} - {hoursRange[1].toLocaleString()}
            </Label>
            <Slider min={0} max={10000} step={100} value={hoursRange}
              onValueChange={(v: number[]) => { setHoursRange(v); setPage(1); }}
              data-testid="filter-hours-range" className="mt-2" />
          </div>
          <div>
            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
              Horsepower: {hpRange[0]} - {hpRange[1]} HP
            </Label>
            <Slider min={0} max={1000} step={10} value={hpRange}
              onValueChange={(v: number[]) => { setHpRange(v); setPage(1); }}
              data-testid="filter-hp-range" className="mt-2" />
          </div>
          <div>
            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Transmission</Label>
            <Select value={transmission} onValueChange={(v: string) => { setTransmission(v === "all" ? "" : v); setPage(1); }}>
              <SelectTrigger data-testid="filter-transmission"><SelectValue placeholder="Any Transmission" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Transmission</SelectItem>
                {TRANSMISSIONS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {activeFilters > 0 && (
        <Button variant="ghost" onClick={clearFilters} className="w-full text-sm text-gray-500" data-testid="clear-filters-btn">
          <X size={14} className="mr-1" /> Clear All Filters ({activeFilters})
        </Button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="marketplace-page">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1" style={{fontFamily:"Manrope"}}>Equipment Marketplace</h1>
        <p className="text-sm text-gray-500">{total} listings available</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input value={search} onChange={(e: any) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by make, model, or keyword..." className="pl-10 h-11"
            data-testid="search-input" />
        </div>
        <div className="flex gap-2">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[160px] h-11" data-testid="sort-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-11 lg:hidden relative" data-testid="mobile-filter-btn">
                <SlidersHorizontal size={16} />
                {activeFilters > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1B4D3E] text-white text-[10px] rounded-full flex items-center justify-center">{activeFilters}</span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4" style={{fontFamily:"Manrope"}}>Filters</h3>
              <FilterPanel />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-20">
            <h3 className="text-sm font-semibold text-gray-900 mb-4" style={{fontFamily:"Manrope"}}>Filters</h3>
            <FilterPanel />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-lg border animate-pulse">
                  <div className="aspect-[16/10] bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20">
              <Search size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No iron matches your search</p>
              <p className="text-sm text-gray-400 mt-1">Try widening your filters or adjusting your search terms</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" data-testid="listings-grid">
                {listings.map((l: any) => <ListingCard key={l.id} listing={l} />)}
              </div>
              {pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)} data-testid="prev-page">
                    <ChevronLeft size={16} />
                  </Button>
                  <span className="text-sm text-gray-500 px-3">Page {page} of {pages}</span>
                  <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage(p => p + 1)} data-testid="next-page">
                    <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
