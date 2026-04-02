import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300" data-testid="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-[#1B4D3E] rounded flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">FE</span>
              </div>
              <span className="text-base font-bold text-white" style={{fontFamily:"Manrope"}}>FieldExchange</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              The trusted marketplace for agricultural and construction equipment. Buy and sell with confidence.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3" style={{fontFamily:"Manrope"}}>Marketplace</h4>
            <ul className="space-y-2">
              <li><Link href="/marketplace" className="text-sm text-gray-400 hover:text-white transition-colors">Browse Equipment</Link></li>
              <li><Link href="/auctions" className="text-sm text-gray-400 hover:text-white transition-colors">Live Auctions</Link></li>
              <li><Link href="/marketplace?category=tractors" className="text-sm text-gray-400 hover:text-white transition-colors">Tractors</Link></li>
              <li><Link href="/marketplace?category=excavators" className="text-sm text-gray-400 hover:text-white transition-colors">Excavators</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3" style={{fontFamily:"Manrope"}}>Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/faq" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3" style={{fontFamily:"Manrope"}}>Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <Separator className="bg-gray-800 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">&copy; 2026 FieldExchange. All rights reserved.</p>
          <p className="text-xs text-gray-500">The Equipment Marketplace</p>
        </div>
      </div>
    </footer>
  );
}
