"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Heart, Gavel, Truck, Package, Camera, DollarSign, CheckCircle2 } from "lucide-react";

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="relative overflow-hidden">
      <div className="hero-gradient">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10 text-center">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "Manrope" }}
          >
            {title}
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  const buyerSteps = [
    {
      icon: Search,
      title: "Browse & Search",
      description:
        "Explore thousands of verified equipment listings. Filter by category, brand, condition, price, and location to find exactly what you need.",
    },
    {
      icon: Heart,
      title: "Save & Compare",
      description:
        "Add listings to your watchlist to compare options. Get notified when prices change or new equipment matching your criteria is listed.",
    },
    {
      icon: Gavel,
      title: "Bid or Buy",
      description:
        "Make an offer on marketplace listings or participate in live online auctions with real-time bidding and soft-close protection.",
    },
    {
      icon: Truck,
      title: "Secure Transaction",
      description:
        "Complete your purchase through our secure payment system. Coordinate shipping or pickup directly with the seller.",
    },
  ];

  const sellerSteps = [
    {
      icon: Package,
      title: "Create Listing",
      description:
        "List your equipment with detailed specifications, condition reports, and service history. Our guided form ensures complete, professional listings.",
    },
    {
      icon: Camera,
      title: "Add Photos & Details",
      description:
        "Upload high-quality photos following our category-specific photo guides. Better photos mean more views and faster sales.",
    },
    {
      icon: DollarSign,
      title: "Set Your Price",
      description:
        "Choose between asking price, make offer, or contact for price. For auctions, set a reserve price and let the market determine fair value.",
    },
    {
      icon: CheckCircle2,
      title: "Close the Deal",
      description:
        "Respond to inquiries, negotiate with buyers, and close the sale. Our platform handles payment processing and provides transaction protection.",
    },
  ];

  return (
    <div>
      <PageHeader
        title="How It Works"
        subtitle="Whether you are buying or selling, FieldExchange makes equipment transactions simple, secure, and transparent."
      />

      {/* Buyer Steps */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-[#1B4D3E] uppercase tracking-wider mb-1">
              For Buyers
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold text-gray-900"
              style={{ fontFamily: "Manrope" }}
            >
              Find Your Equipment
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {buyerSteps.map((step, i) => (
              <div key={step.title} className="relative">
                <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#1B4D3E] text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {i + 1}
                    </div>
                    <step.icon size={20} className="text-[#1B4D3E]" />
                  </div>
                  <h3
                    className="text-base font-semibold text-gray-900 mb-2"
                    style={{ fontFamily: "Manrope" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller Steps */}
      <section className="py-14 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-[#F59E0B] uppercase tracking-wider mb-1">
              For Sellers
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold text-gray-900"
              style={{ fontFamily: "Manrope" }}
            >
              Sell Your Equipment
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sellerSteps.map((step, i) => (
              <div key={step.title} className="relative">
                <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#F59E0B] text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {i + 1}
                    </div>
                    <step.icon size={20} className="text-[#F59E0B]" />
                  </div>
                  <h3
                    className="text-base font-semibold text-gray-900 mb-2"
                    style={{ fontFamily: "Manrope" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-2xl md:text-3xl font-bold text-white mb-3"
            style={{ fontFamily: "Manrope" }}
          >
            Ready to Get Started?
          </h2>
          <p className="text-base text-white/70 mb-8 max-w-md mx-auto">
            Join thousands of buyers and sellers on the most trusted equipment marketplace.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register">
              <Button className="bg-[#F59E0B] hover:bg-[#d97706] text-white font-bold h-12 px-8">
                Create Free Account
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-semibold h-12 px-8 bg-transparent"
              >
                Browse Equipment
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
