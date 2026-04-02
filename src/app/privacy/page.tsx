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
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us, including your name, email address, phone number, business name, and payment information when you create an account or complete a transaction. We also collect information automatically when you use the Service, including your IP address, browser type, device information, and usage data such as pages viewed, listings browsed, and search queries. For sellers, we collect additional verification documents including government-issued identification and business licenses.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information we collect to provide and improve the Service, process transactions, verify user identities, communicate with you about your account and transactions, send marketing communications (with your consent), detect and prevent fraud, and comply with legal obligations. We may use aggregated, anonymized data for analytics and to improve our platform. We do not sell your personal information to third parties for their marketing purposes.`,
  },
  {
    title: "3. Information Sharing",
    content: `We share your information only in the following circumstances: with other users as necessary to facilitate transactions (e.g., sharing seller contact information with buyers); with service providers who assist us in operating the platform (payment processors, email services, hosting providers); when required by law, subpoena, or legal process; to protect the rights, property, or safety of FieldExchange, our users, or the public; and in connection with a merger, acquisition, or sale of assets, with appropriate notice to users.`,
  },
  {
    title: "4. Data Security and Your Rights",
    content: `We implement industry-standard security measures to protect your personal information, including encryption in transit and at rest, secure authentication, and regular security audits. You have the right to access, correct, or delete your personal information at any time through your account settings or by contacting our support team. You may also opt out of marketing communications at any time. We retain your information for as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce our agreements. If you have questions about this policy, contact us at privacy@fieldexchange.com.`,
  },
];

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader
        title="Privacy Policy"
        subtitle="Your privacy matters to us. Learn how we collect, use, and protect your information."
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
