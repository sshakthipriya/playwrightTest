"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Scale, Users } from "lucide-react";

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

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Trust First",
      description:
        "Every seller is verified. Every transaction is transparent. We built this marketplace on the foundation that trust is earned through accountability and verification.",
    },
    {
      icon: Scale,
      title: "Fair Market",
      description:
        "Our auction system ensures fair pricing through competitive bidding. No hidden fees, no backroom deals. The market sets the price, and everyone plays by the same rules.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "We serve the agricultural and construction equipment community. Our tools, features, and support are designed specifically for the people who build and feed our world.",
    },
  ];

  return (
    <div>
      <PageHeader
        title="About FieldExchange"
        subtitle="The premier marketplace for agricultural and construction equipment. Built by industry professionals, for industry professionals."
      />

      {/* Mission */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "Manrope" }}
            >
              Our Mission
            </h2>
            <p className="text-base text-gray-600 leading-relaxed mb-4">
              FieldExchange was founded with a simple mission: make buying and selling heavy equipment
              as trustworthy and transparent as possible. We believe that the equipment industry
              deserves a modern marketplace that prioritizes verified sellers, fair pricing, and
              secure transactions.
            </p>
            <p className="text-base text-gray-600 leading-relaxed">
              Whether you are a farmer looking for a reliable tractor, a contractor sourcing
              excavators, or a dealer managing inventory, FieldExchange provides the tools you need
              to transact with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10"
            style={{ fontFamily: "Manrope" }}
          >
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-[#1B4D3E]/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon size={24} className="text-[#1B4D3E]" />
                </div>
                <h3
                  className="text-lg font-semibold text-gray-900 mb-2"
                  style={{ fontFamily: "Manrope" }}
                >
                  {v.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
            style={{ fontFamily: "Manrope" }}
          >
            Ready to Join?
          </h2>
          <p className="text-base text-gray-500 mb-8 max-w-md mx-auto">
            Create a free account and start buying or selling equipment today.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register">
              <Button className="bg-[#1B4D3E] hover:bg-[#163f33] text-white font-bold h-12 px-8">
                Create Account
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" className="font-semibold h-12 px-8">
                Browse Equipment
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
