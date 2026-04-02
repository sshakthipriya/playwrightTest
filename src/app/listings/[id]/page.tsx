"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  MapPin,
  Clock,
  Eye,
  Heart,
  HeartOff,
  Gauge,
  Share2,
  Flag,
  MessageSquare,
  Shield,
  CheckCircle2,
  Star,
  Calendar,
  Truck,
  Cog,
  FileText,
  ChevronLeft,
  Send,
  AlertTriangle,
} from "lucide-react";

const CONDITION_STYLES: Record<string, string> = {
  "Field-Ready Premium": "bg-emerald-100 text-emerald-800 border-emerald-300",
  "Field-Ready": "bg-green-100 text-green-800 border-green-200",
  "Working Order": "bg-blue-100 text-blue-700 border-blue-200",
  "Needs Service": "bg-amber-100 text-amber-800 border-amber-200",
  "Parts Only": "bg-red-100 text-red-700 border-red-200",
};

const VERIFICATION_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  premium: { bg: "bg-purple-100", text: "text-purple-700", label: "Premium Seller" },
  verified: { bg: "bg-green-100", text: "text-green-700", label: "Verified Seller" },
  basic: { bg: "bg-gray-100", text: "text-gray-600", label: "Basic Seller" },
};

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const id = params.id as string;

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [msgOpen, setMsgOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [inWatchlist, setInWatchlist] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [sendingMsg, setSendingMsg] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/listings/${id}`)
      .then((data) => {
        setListing(data);
        if (user?.watchlist?.includes(id)) {
          setInWatchlist(true);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load listing");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user?.watchlist?.includes(id)) {
      setInWatchlist(true);
    }
  }, [user, id]);

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to contact the seller");
      router.push("/login");
      return;
    }
    setMsgOpen(true);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setSendingMsg(true);
    try {
      await api.post("/messages", {
        recipient_id: listing.seller_id,
        listing_id: listing.id,
        subject: `Inquiry about: ${listing.title}`,
        body: message,
      });
      toast.success("Message sent successfully!");
      setMsgOpen(false);
      setMessage("");
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setSendingMsg(false);
    }
  };

  const handleWatchlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to use the watchlist");
      router.push("/login");
      return;
    }
    try {
      const res = await api.post(`/watchlist/${id}`);
      if (res.action === "added") {
        setInWatchlist(true);
        toast.success("Added to watchlist");
      } else {
        setInWatchlist(false);
        toast.success("Removed from watchlist");
      }
    } catch (err) {
      toast.error("Failed to update watchlist");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: listing?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const priceDisplay = listing?.price_type === "asking_price" && listing?.asking_price
    ? `$${listing.asking_price.toLocaleString()}`
    : listing?.price_type === "make_offer"
      ? "Make Offer"
      : "Contact for Price";

  const conditionColor =
    CONDITION_STYLES[listing?.condition] || "bg-gray-100 text-gray-700 border-gray-200";

  const seller = listing?.seller;
  const verificationLevel = seller?.verification_level || "basic";
  const verificationStyle = VERIFICATION_STYLES[verificationLevel] || VERIFICATION_STYLES.basic;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-testid="listing-detail-loading">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="aspect-[16/10] bg-gray-200 rounded-lg" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-20 h-16 bg-gray-200 rounded" />
                ))}
              </div>
              <div className="h-10 bg-gray-200 rounded w-full" />
              <div className="h-64 bg-gray-200 rounded" />
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-2/3" />
              <div className="h-10 bg-gray-200 rounded w-1/2" />
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center" data-testid="listing-not-found">
        <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Manrope" }}>
          Listing Not Found
        </h2>
        <p className="text-gray-500 mb-6">This listing may have been removed or does not exist.</p>
        <Link href="/marketplace">
          <Button className="bg-[#1B4D3E] hover:bg-[#163f33] text-white">Browse Marketplace</Button>
        </Link>
      </div>
    );
  }

  const images = listing.images && listing.images.length > 0 ? listing.images : [];

  const specRows = [
    { label: "Brand", value: listing.brand_name || listing.brand },
    { label: "Model", value: listing.model },
    { label: "Year", value: listing.year },
    { label: "Hours", value: listing.hours != null ? listing.hours.toLocaleString() : "N/A" },
    { label: "Horsepower", value: listing.horsepower ? `${listing.horsepower} HP` : "N/A" },
    { label: "Transmission", value: listing.transmission || "N/A" },
    { label: "Serial Number", value: listing.serial_number || "N/A" },
    { label: "Condition", value: listing.condition },
    { label: "Location", value: listing.location_city && listing.location_state ? `${listing.location_city}, ${listing.location_state}` : listing.location || "N/A" },
  ];

  return (
    <div data-testid="listing-detail-page">
      {/* Back navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          data-testid="back-button"
        >
          <ChevronLeft size={16} /> Back to listings
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 space-y-6" data-testid="listing-left-column">
            {/* Hero Image */}
            <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-gray-100" data-testid="hero-image">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <span className="text-5xl">No Image</span>
                </div>
              )}
              {listing.featured && (
                <span
                  className="absolute top-3 left-3 bg-[#F59E0B] text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider"
                  data-testid="featured-badge"
                >
                  Featured
                </span>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1" data-testid="thumbnail-images">
                {images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-16 rounded overflow-hidden border-2 shrink-0 transition-colors ${
                      i === selectedImage
                        ? "border-[#1B4D3E]"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    data-testid={`thumbnail-${i}`}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Stats Bar */}
            <div
              className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-gray-50 rounded-lg p-4 border border-gray-100"
              data-testid="quick-stats"
            >
              {[
                { label: "Brand", value: listing.brand_name || listing.brand || "N/A", icon: Truck },
                { label: "Year", value: listing.year || "N/A", icon: Calendar },
                { label: "Hours", value: listing.hours != null ? listing.hours.toLocaleString() : "N/A", icon: Clock },
                { label: "HP", value: listing.horsepower ? `${listing.horsepower}` : "N/A", icon: Gauge },
                { label: "Trans", value: listing.transmission || "N/A", icon: Cog },
              ].map((stat) => (
                <div key={stat.label} className="text-center" data-testid={`stat-${stat.label.toLowerCase()}`}>
                  <stat.icon size={16} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: "Manrope" }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="details" data-testid="listing-tabs">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="details" data-testid="tab-details">
                  <FileText size={14} className="mr-1.5" /> Details
                </TabsTrigger>
                <TabsTrigger value="specifications" data-testid="tab-specifications">
                  <Cog size={14} className="mr-1.5" /> Specifications
                </TabsTrigger>
                <TabsTrigger value="disclosures" data-testid="tab-disclosures">
                  <Shield size={14} className="mr-1.5" /> Disclosures
                </TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details" data-testid="tab-content-details">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3
                    className="text-lg font-semibold text-gray-900 mb-4"
                    style={{ fontFamily: "Manrope" }}
                  >
                    Description
                  </h3>
                  <p
                    className="text-sm text-gray-600 leading-relaxed"
                    style={{ whiteSpace: "pre-wrap" }}
                    data-testid="listing-description"
                  >
                    {listing.description || "No description provided."}
                  </p>
                </div>
              </TabsContent>

              {/* Specifications Tab */}
              <TabsContent value="specifications" data-testid="tab-content-specifications">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full" data-testid="specs-table">
                    <tbody>
                      {specRows.map((row, i) => (
                        <tr
                          key={row.label}
                          className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                          data-testid={`spec-row-${row.label.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          <td className="px-6 py-3 text-sm font-medium text-gray-500 w-1/3">
                            {row.label}
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                            {row.value || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              {/* Disclosures Tab */}
              <TabsContent value="disclosures" data-testid="tab-content-disclosures">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3
                    className="text-lg font-semibold text-gray-900 mb-4"
                    style={{ fontFamily: "Manrope" }}
                  >
                    Lien Disclosure
                  </h3>
                  <div
                    className="flex items-start gap-3 p-4 rounded-lg border border-gray-100 bg-gray-50"
                    data-testid="lien-disclosure"
                  >
                    {listing.lien_attestation ? (
                      <>
                        <CheckCircle2 size={20} className="text-green-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Lien-Free Attestation Provided
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            The seller has attested that this equipment is free of any liens or
                            encumbrances.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            No Lien Attestation
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            The seller has not provided a lien-free attestation for this equipment.
                            Buyers are encouraged to conduct their own due diligence.
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {listing.condition_checklist &&
                    Object.keys(listing.condition_checklist).length > 0 && (
                      <div className="mt-6" data-testid="condition-checklist-results">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                          Condition Checklist Responses
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(listing.condition_checklist).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0"
                              >
                                <span className="text-gray-600 capitalize">
                                  {key.replace(/_/g, " ")}
                                </span>
                                <span className="font-medium text-gray-900">
                                  {value as string}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - 1/3 Sticky */}
          <div className="lg:col-span-1" data-testid="listing-right-column">
            <div className="sticky top-24 space-y-4">
              {/* Condition Badge */}
              <Badge
                className={`${conditionColor} text-xs font-medium px-3 py-1 border`}
                data-testid="condition-badge"
              >
                {listing.condition}
              </Badge>

              {/* Title */}
              <h1
                className="text-2xl font-bold text-gray-900 leading-tight"
                style={{ fontFamily: "Manrope" }}
                data-testid="listing-title"
              >
                {listing.title}
              </h1>

              {/* Price Display */}
              <div data-testid="price-display">
                <p
                  className="text-3xl font-bold text-[#1B4D3E]"
                  style={{ fontFamily: "Manrope" }}
                  data-testid="listing-price"
                >
                  {priceDisplay}
                </p>
                {listing.price_type === "asking_price" && (
                  <p className="text-xs text-gray-500 mt-0.5">Asking Price</p>
                )}
              </div>

              {/* Location & Stats */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                {(listing.location_city || listing.location_state) && (
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {listing.location_city}, {listing.location_state}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Eye size={14} /> {listing.views || 0} views
                </span>
                <span className="flex items-center gap-1">
                  <Heart size={14} /> {listing.watchlist_count || 0}
                </span>
              </div>

              {/* Contact Seller Button */}
              <Button
                className="w-full bg-[#1B4D3E] hover:bg-[#163f33] text-white font-bold h-12"
                onClick={handleContactSeller}
                data-testid="contact-seller-btn"
              >
                <MessageSquare size={16} className="mr-2" /> Contact Seller
              </Button>

              {/* Watchlist Button */}
              <Button
                variant="outline"
                className={`w-full font-semibold h-11 ${
                  inWatchlist
                    ? "border-red-300 text-red-600 hover:bg-red-50"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
                onClick={handleWatchlistToggle}
                data-testid="watchlist-btn"
              >
                {inWatchlist ? (
                  <>
                    <HeartOff size={16} className="mr-2" /> Remove from Watchlist
                  </>
                ) : (
                  <>
                    <Heart size={16} className="mr-2" /> Add to Watchlist
                  </>
                )}
              </Button>

              {/* Seller Trust Info Card */}
              {seller && (
                <div
                  className="bg-white rounded-lg border border-gray-200 p-5"
                  data-testid="seller-info-card"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#1B4D3E]/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-[#1B4D3E]">
                        {(seller.name || "S").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p
                        className="text-sm font-semibold text-gray-900"
                        style={{ fontFamily: "Manrope" }}
                        data-testid="seller-name"
                      >
                        {seller.name || seller.business_name || "Seller"}
                      </p>
                      <Badge
                        className={`${verificationStyle.bg} ${verificationStyle.text} border-0 text-[10px] font-medium px-2 py-0`}
                        data-testid="seller-verification-badge"
                      >
                        {verificationLevel === "premium" && <Star size={10} className="mr-1" />}
                        {verificationLevel === "verified" && (
                          <CheckCircle2 size={10} className="mr-1" />
                        )}
                        {verificationStyle.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2.5 text-sm">
                    {seller.member_since && (
                      <div
                        className="flex items-center justify-between"
                        data-testid="seller-member-since"
                      >
                        <span className="text-gray-500">Member since</span>
                        <span className="font-medium text-gray-900">
                          {new Date(seller.member_since || seller.created_at).getFullYear()}
                        </span>
                      </div>
                    )}
                    {seller.total_sales != null && (
                      <div
                        className="flex items-center justify-between"
                        data-testid="seller-total-sales"
                      >
                        <span className="text-gray-500">Total sales</span>
                        <span className="font-medium text-gray-900">{seller.total_sales}</span>
                      </div>
                    )}
                    {seller.avg_response_time && (
                      <div
                        className="flex items-center justify-between"
                        data-testid="seller-response-time"
                      >
                        <span className="text-gray-500">Avg response</span>
                        <span className="font-medium text-gray-900">
                          {seller.avg_response_time}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Share / Report */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-gray-500 hover:text-gray-700"
                  onClick={handleShare}
                  data-testid="share-btn"
                >
                  <Share2 size={14} className="mr-1.5" /> Share
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-gray-500 hover:text-red-600"
                  onClick={() => toast.info("Report functionality coming soon")}
                  data-testid="report-btn"
                >
                  <Flag size={14} className="mr-1.5" /> Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Dialog */}
      <Dialog open={msgOpen} onOpenChange={setMsgOpen}>
        <DialogContent data-testid="message-dialog">
          <DialogHeader>
            <DialogTitle>Contact Seller</DialogTitle>
            <DialogDescription>
              Send a message about &quot;{listing.title}&quot;
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent"
              placeholder="Write your message to the seller..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              data-testid="message-textarea"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMsgOpen(false)}
              data-testid="message-cancel-btn"
            >
              Cancel
            </Button>
            <Button
              className="bg-[#1B4D3E] hover:bg-[#163f33] text-white"
              onClick={handleSendMessage}
              disabled={!message.trim() || sendingMsg}
              data-testid="message-send-btn"
            >
              <Send size={14} className="mr-1.5" />
              {sendingMsg ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
