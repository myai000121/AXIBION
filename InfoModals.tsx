import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, ShieldCheck, CheckCircle2, HelpCircle, FileText, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
}

// 1. Contact Page Modal
export const ContactModal: React.FC<ModalBaseProps> = ({ isOpen, onClose }) => {
  const { settings } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-xl bg-[#0a0b0e] border border-[#1a1e27] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#1a1e27] pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Contact AXIBION Support</h2>
            <p className="text-xs text-slate-400">We are here to assist with hardware inquiries & order status.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Message Transmitted</h3>
            <p className="text-xs text-slate-300">
              Our hardware specialist team has received your ticket and will respond to {email} within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan V."
                  className="w-full bg-[#11141c] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full bg-[#11141c] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Order question / Hardware inquiry"
                className="w-full bg-[#11141c] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Message</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can our technical dispatch desk help you?"
                className="w-full bg-[#11141c] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="p-3 rounded-lg bg-[#0c0d12] border border-[#1a1e27] text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#00D9FF]" />
                <span>{settings.supportEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#00D9FF]" />
                <span>{settings.supportPhone} (Mon–Fri, 9am–6pm EST)</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0066d6] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#087BFF]/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Support Ticket</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// 2. About Page Modal
export const AboutModal: React.FC<ModalBaseProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-2xl bg-[#0a0b0e] border border-[#1a1e27] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#1a1e27] pb-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#00D9FF]" />
            <h2 className="text-lg font-bold text-white">About AXIBION</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-[#0c0d12] border border-[#1a1e27]">
            <h3 className="text-sm font-bold text-white">A World of Technology.</h3>
            <p className="mt-1 text-slate-400 text-xs">
              AXIBION was founded to provide engineers, cybersecurity professionals, makers, and technology enthusiasts with uncompromised, laboratory-grade hardware, development kits, and flagship computing devices.
            </p>
          </div>

          <h4 className="font-bold text-white uppercase tracking-wider text-xs pt-2">
            Ethical Hacking & Cybersecurity Policy
          </h4>
          <p>
            AXIBION exclusively stocks hardware designed for educational research, defensive security engineering, penetration testing demonstrations, RF diagnostics, and hardware security prototyping.
          </p>
          <p className="text-slate-400">
            We strictly do not facilitate unauthorized interception, malicious surveillance, malware distribution, or unlawful network exploitation. Every development board is intended for licensed security analysts and students operating in controlled, permissioned environments.
          </p>

          <h4 className="font-bold text-white uppercase tracking-wider text-xs pt-2">
            The Cash on Delivery Guarantee
          </h4>
          <p>
            To provide maximum trust and peace of mind, all customer orders placed on AXIBION utilize transparent Cash on Delivery. Customers pay only upon physically inspecting and receiving their packaged shipment from our express courier partners.
          </p>
        </div>

        <div className="pt-4 border-t border-[#1a1e27] text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#087BFF]"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. FAQ Modal
export const FAQModal: React.FC<ModalBaseProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const faqs = [
    {
      q: 'How does Cash on Delivery (COD) work?',
      a: 'When placing an order on AXIBION, you do not pay any upfront fee or credit card deposit. You simply provide your shipping address and contact number. When our courier brings your package, you hand the exact cash amount to the courier upon delivery.',
    },
    {
      q: 'Why is Google Sign-in required for checkout?',
      a: 'Google authentication verifies genuine email addresses, protects against fraudulent orders, and allows you to securely access your personal order history and live dispatch tracking updates.',
    },
    {
      q: 'Are the Hacking & Cybersecurity gadgets legal?',
      a: 'Yes. All equipment listed in our Ethical Tech category (such as wireless packet monitors, SDR receivers, badUSB demonstration units, and dev boards) are legitimate diagnostic tools for ethical security testing, classroom education, and wireless network analysis.',
    },
    {
      q: 'How can I track my package?',
      a: 'You can click "Track Order" in the main navigation or visit your "My Orders" history. Enter your unique Order ID (e.g. AXB-8X9Y2) to view current status from Order Placed to Delivered.',
    },
    {
      q: 'What is your return period?',
      a: 'We offer a 7-day hassle-free return and replacement policy for any technical manufacturing defects.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-2xl bg-[#0a0b0e] border border-[#1a1e27] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#1a1e27] pb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#00D9FF]" />
            <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#0c0d12] border border-[#1a1e27] space-y-1.5">
              <h3 className="text-xs sm:text-sm font-bold text-white">{f.q}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 4. Policy Modal (Privacy, Terms, Returns)
export const PolicyModal: React.FC<ModalBaseProps & { initialTab?: 'privacy' | 'terms' | 'refund' }> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'refund'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-2xl bg-[#0a0b0e] border border-[#1a1e27] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#1a1e27] pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#00D9FF]" />
            <h2 className="text-lg font-bold text-white">AXIBION Legal & Compliance</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-[#1a1e27] pb-3">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              activeTab === 'privacy' ? 'bg-[#087BFF] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              activeTab === 'terms' ? 'bg-[#087BFF] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Terms & Conditions
          </button>
          <button
            onClick={() => setActiveTab('refund')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              activeTab === 'refund' ? 'bg-[#087BFF] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Return & Refund Policy
          </button>
        </div>

        {/* Tab Content */}
        <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
          {activeTab === 'privacy' && (
            <>
              <h3 className="text-sm font-bold text-white">Privacy Policy</h3>
              <p>
                At AXIBION, customer privacy is paramount. When you sign in with Google, we access your name and email address solely to bind your purchase orders and provide real-time dispatch updates.
              </p>
              <p>
                We do not sell, rent, or trade your personal information. Addresses collected at checkout are used exclusively for courier parcel routing under Cash on Delivery arrangements.
              </p>
            </>
          )}

          {activeTab === 'terms' && (
            <>
              <h3 className="text-sm font-bold text-white">Terms & Conditions</h3>
              <p>
                By placing an order on AXIBION, you agree that you are purchasing items for personal or professional evaluation purposes. All purchases of ethical cybersecurity equipment must comply with local telecommunications, wireless spectrum, and computer misuse laws.
              </p>
              <p>
                Customers agree to provide accurate delivery information and agree to pay the delivery courier the stated total Cash on Delivery amount when receiving packages.
              </p>
            </>
          )}

          {activeTab === 'refund' && (
            <>
              <h3 className="text-sm font-bold text-white">Return & Refund Policy</h3>
              <p>
                AXIBION offers a 7-day technical replacement guarantee for hardware exhibiting manufacturing defects. If an item arrives non-functional, contact support@axibion.tech with your Order ID for a swift replacement or store credit.
              </p>
              <p>
                Returned items must include all original packaging, SMA antennas, cables, and development accessories.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
