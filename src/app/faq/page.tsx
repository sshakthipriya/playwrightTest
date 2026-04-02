"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

const faqs = [
  {
    question: "How do I create an account?",
    answer:
      "Creating an account is free and takes less than a minute. Click the \"Register\" button in the top navigation, fill in your name, email, and password, and choose whether you want to buy or sell. Sellers will need to complete additional verification steps to list equipment.",
  },
  {
    question: "How does seller verification work?",
    answer:
      "All sellers go through a multi-step verification process. Basic verification requires a valid email and phone number. Verified sellers additionally provide a government-issued ID and business license. Premium dealers receive the highest trust level with full business documentation and references.",
  },
  {
    question: "What fees does FieldExchange charge?",
    answer:
      "Browsing and buying is completely free. Sellers pay a 5% transaction fee on completed sales. There are no listing fees, no monthly subscriptions, and no hidden charges. Auction lots may have a separate buyer premium that is clearly displayed before bidding.",
  },
  {
    question: "How do online auctions work?",
    answer:
      "Our online auctions feature real-time bidding with soft-close protection. This means if a bid is placed in the final minutes, the auction is extended to prevent sniping. All bid history is transparent and visible to all participants. You can set maximum bids and receive notifications when you are outbid.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Yes. We use industry-standard encryption and secure payment processing. We never store credit card numbers on our servers. All transactions are protected by our escrow system for high-value purchases, ensuring both buyers and sellers are protected.",
  },
  {
    question: "Can I inspect equipment before purchasing?",
    answer:
      "Absolutely. We encourage buyers to inspect equipment in person whenever possible. Each listing includes the equipment location, and you can message the seller directly to arrange a viewing. For auction lots, preview days are typically scheduled before bidding opens.",
  },
  {
    question: "What happens if there is a dispute?",
    answer:
      "FieldExchange provides a dispute resolution process for all transactions. If you encounter an issue with a purchase, contact our support team within 48 hours. We will work with both parties to reach a fair resolution. For transactions using our escrow service, funds are held until both parties confirm satisfaction.",
  },
  {
    question: "How do I ship large equipment?",
    answer:
      "Shipping arrangements are made between the buyer and seller. Many sellers offer delivery for an additional fee, or you can arrange your own transport. We partner with several heavy equipment transport companies and can provide quotes upon request. Local pickup is also an option for most listings.",
  },
];

export default function FAQPage() {
  return (
    <div>
      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about buying, selling, and using FieldExchange."
      />

      <section className="py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold text-gray-900 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-14 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-xl md:text-2xl font-bold text-gray-900 mb-3"
            style={{ fontFamily: "Manrope" }}
          >
            Still have questions?
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Our support team is here to help. Reach out and we will get back to you within 24 hours.
          </p>
          <a
            href="mailto:support@fieldexchange.com"
            className="inline-flex items-center justify-center bg-[#1B4D3E] hover:bg-[#163f33] text-white font-semibold h-11 px-6 rounded-md text-sm transition-colors"
          >
            Contact Support
          </a>
        </div>
      </section>
    </div>
  );
}
