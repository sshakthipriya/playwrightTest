"use client";

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

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing and using the FieldExchange platform ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. FieldExchange reserves the right to modify these terms at any time, and your continued use of the Service constitutes acceptance of any changes. We will notify registered users of material changes via email.`,
  },
  {
    title: "2. User Accounts and Responsibilities",
    content: `You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during registration and to update such information as necessary. FieldExchange reserves the right to suspend or terminate accounts that violate these terms, provide false information, or engage in fraudulent activity.`,
  },
  {
    title: "3. Listing and Transaction Policies",
    content: `Sellers are responsible for the accuracy of their listings, including descriptions, condition reports, photos, and pricing. All equipment must be legally owned by the seller, free of undisclosed liens, and accurately represented. Buyers are responsible for conducting their own due diligence before completing a purchase. FieldExchange is a marketplace platform and does not take ownership of listed equipment. A 5% transaction fee is charged to sellers on completed sales. Payment terms, shipping arrangements, and inspection rights should be agreed upon between buyer and seller before completing a transaction.`,
  },
  {
    title: "4. Auction Rules",
    content: `All bids placed in auctions are binding commitments to purchase. The soft-close system extends auction end times when bids are placed in the final minutes to ensure fair bidding. Reserve prices, when set, must be met for a sale to be completed. Bid manipulation, shill bidding, and collusion are strictly prohibited and will result in permanent account suspension. FieldExchange reserves the right to cancel or void any auction where fraud or manipulation is suspected.`,
  },
  {
    title: "5. Limitation of Liability",
    content: `FieldExchange provides the platform as-is and makes no warranties regarding the condition, quality, or legality of listed equipment. We are not responsible for the actions of buyers or sellers, including failure to complete transactions, misrepresentation of equipment, or shipping issues. Our total liability is limited to the fees paid to FieldExchange in connection with the specific transaction in dispute. We strongly recommend that buyers inspect equipment in person and that all parties use our escrow service for high-value transactions.`,
  },
];

export default function TermsPage() {
  return (
    <div>
      <PageHeader
        title="Terms of Service"
        subtitle="Please read these terms carefully before using FieldExchange."
      />

      <section className="py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 mb-8">Last updated: January 15, 2025</p>
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h2
                  className="text-lg font-semibold text-gray-900 mb-3"
                  style={{ fontFamily: "Manrope" }}
                >
                  {section.title}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
