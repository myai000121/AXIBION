import React from 'react';
import { Shield, Truck, Lock, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenFAQ: () => void;
  onOpenPolicy: (tab: 'privacy' | 'terms' | 'refund') => void;
  onOpenTrack: () => void;
  onOpenAdmin: () => void;
  onSelectCategory: (categoryName: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAbout,
  onOpenContact,
  onOpenFAQ,
  onOpenPolicy,
  onOpenTrack,
  onOpenAdmin,
  onSelectCategory,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#030304] border-t border-[#1a1e27] text-slate-400 text-xs">
      {/* Reassurance Bar */}
      <div className="border-b border-[#1a1e27] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#087BFF]/10 border border-[#087BFF]/30 flex items-center justify-center text-[#00D9FF] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Cash on Delivery</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Pay upon delivery with zero prepayment required</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Verified Tech Marketplace</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Specialized in legitimate electronics & ethical cyber tools</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Google Protected Auth</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Safe order history & verified customer records</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <img
            src="/assets/aistudio/file_000000006df48211a08a0073fab6ae4d_fd38b12d.png"
            alt="AXIBION"
            className="h-9 w-auto object-contain"
          />
          <p className="text-slate-300 font-semibold text-xs tracking-wide">
            A World of Technology.
          </p>
          <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
            AXIBION is a dedicated marketplace for electronics, digital devices, mobile technologies, and legitimate cybersecurity research dev boards.
          </p>
          <p className="text-[11px] text-slate-500">
            Compliant with ethical computing practices and free-tier infrastructure.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Key Sectors</h5>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onSelectCategory('Hacking & Cybersecurity Gadgets')}
                className="hover:text-[#00D9FF] transition-colors cursor-pointer text-left"
              >
                Ethical Cyber Gadgets
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory('Mobile Phones')}
                className="hover:text-[#00D9FF] transition-colors cursor-pointer text-left"
              >
                Mobile Phones
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory('Computers & Laptops')}
                className="hover:text-[#00D9FF] transition-colors cursor-pointer text-left"
              >
                Computers & Laptops
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory('Arduino & Raspberry Pi')}
                className="hover:text-[#00D9FF] transition-colors cursor-pointer text-left"
              >
                Arduino & Raspberry Pi
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory('Wi-Fi & Router Devices')}
                className="hover:text-[#00D9FF] transition-colors cursor-pointer text-left"
              >
                Wi-Fi & Router Devices
              </button>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div className="space-y-3">
          <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Customer Care</h5>
          <ul className="space-y-2">
            <li>
              <button onClick={onOpenTrack} className="hover:text-[#00D9FF] transition-colors cursor-pointer">
                Track Order
              </button>
            </li>
            <li>
              <button onClick={onOpenContact} className="hover:text-[#00D9FF] transition-colors cursor-pointer">
                Contact Technical Support
              </button>
            </li>
            <li>
              <button onClick={onOpenFAQ} className="hover:text-[#00D9FF] transition-colors cursor-pointer">
                FAQ & Help Desk
              </button>
            </li>
            <li>
              <button onClick={onOpenAbout} className="hover:text-[#00D9FF] transition-colors cursor-pointer">
                About AXIBION
              </button>
            </li>
          </ul>
        </div>

        {/* Legal & Policies */}
        <div className="space-y-3">
          <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Policies & Access</h5>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onOpenPolicy('privacy')} className="hover:text-[#00D9FF] transition-colors cursor-pointer">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => onOpenPolicy('terms')} className="hover:text-[#00D9FF] transition-colors cursor-pointer">
                Terms & Conditions
              </button>
            </li>
            <li>
              <button onClick={() => onOpenPolicy('refund')} className="hover:text-[#00D9FF] transition-colors cursor-pointer">
                Return & Refund Policy
              </button>
            </li>
            <li className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="text-[#00D9FF] hover:underline font-bold text-[11px] cursor-pointer"
              >
                Admin Control Portal →
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Absolute Bottom Credits & Copyright */}
      <div className="border-t border-[#1a1e27] py-8 bg-[#020203]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-slate-500">
              © AXIBION. A World of Technology. All rights reserved.
            </p>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="pt-6 border-t border-[#12151d] grid grid-cols-1 sm:grid-cols-2 gap-4 text-center sm:text-left">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Founder & Creator</p>
              <p className="text-white font-semibold text-sm tracking-wide mt-1">Mustafa Faysal Mustaki</p>
            </div>
            <div className="sm:text-right">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Developer</p>
              <p className="text-[#00D9FF] font-semibold text-sm tracking-wide mt-1">MFM Studio</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
