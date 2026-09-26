import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Copy,
  ExternalLink,
  CheckCircle2,
  Check,
  BookOpen,
  Sparkles,
  Smartphone,
  Lock
} from 'lucide-react';

export default function CartPage({
  cartItems = [],
  onRemoveItem,
  onClearCart,
  onBack,
  onOpenBook,
  currentLang = 'en',
  t,
  addToast,
}) {
  const [showPaymentQR, setShowPaymentQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  // Shankar Suthar Google Pay UPI credentials
  const payeeName = 'shankar suthar';
  const upiId = 'ss2137789@okhdfcbank';

  // Subtotal & Final Total calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);
  const finalTotal = subtotal;

  const upiDeepLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    payeeName
  )}&am=${finalTotal}&cu=INR&tn=STAX%20EBooks%20Order`;

  const handleCopyUPI = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleConfirmPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPaymentSuccess(true);
      if (addToast) {
        addToast(
          currentLang === 'hi'
            ? '🎉 भुगतान सफल! सभी ई-बुक्स डाउनलोड के लिए उपलब्ध हैं।'
            : '🎉 Payment Successful! All digital e-books are ready for download.',
          'success'
        );
      }
      if (onClearCart) {
        onClearCart();
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-24 pt-4 sm:pt-6">
      {/* ─── Top Sticky Nav Bar ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 sticky top-14 sm:top-16 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-xs sm:text-sm transition-colors cursor-pointer group"
            id="cart-back-to-browse-btn"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>{currentLang === 'hi' ? 'लाइब्रेरी पर वापस जाएँ' : 'Continue Shopping'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-slate-900">
              {currentLang === 'hi' ? 'शॉपिंग कार्ट' : 'Shopping Cart'}
            </span>
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              {cartItems.length} {currentLang === 'hi' ? 'किताबें' : 'items'}
            </span>
          </div>

          {cartItems.length > 0 && !isPaymentSuccess && (
            <button
              onClick={onClearCart}
              className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            >
              {currentLang === 'hi' ? 'कार्ट खाली करें' : 'Clear All'}
            </button>
          )}
        </div>
      </div>

      {/* ─── Main Container ─────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
        {/* Page Heading */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {currentLang === 'hi' ? 'आपकी शॉपिंग कार्ट' : 'Your Shopping Cart'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {currentLang === 'hi'
              ? 'डिजिटल ई-बुक्स का त्वरित चेकआउट व सीधा PDF डाउनलोड'
              : 'Fast digital checkout with instant lifetime PDF downloads'}
          </p>
        </div>

        {/* ─── Payment Success State ───────────────────────────────────── */}
        {isPaymentSuccess ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center max-w-lg mx-auto shadow-sm space-y-4 animate-in fade-in duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 size={44} />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {currentLang === 'hi' ? 'भुगतान सफल रहा!' : 'Payment Received Successfully!'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {currentLang === 'hi'
                ? `धन्यवाद! Shankar Suthar (UPI ID: ${upiId}) को भुगतान प्राप्त हो गया है। आपकी ई-बुक्स तुरंत डाउनलोड के लिए तैयार हैं।`
                : `Thank you! Payment received for Shankar Suthar. Your selected e-books are now unlocked for instant PDF download.`}
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onBack}
                className="bg-slate-900 hover:bg-black text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
              >
                {currentLang === 'hi' ? 'लाइब्रेरी में और किताबें देखें' : 'Browse More Books'}
              </button>
            </div>
          </div>
        ) : cartItems.length > 0 ? (
          /* ─── Two-Column Responsive Layout ──────────────────────────── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* ─── Column 1: Cart Items List (7 cols) ──────────────────── */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs divide-y divide-slate-100">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 flex items-start sm:items-center gap-3.5 sm:gap-5 hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Cover Thumbnail */}
                    <div
                      onClick={() => onOpenBook && onOpenBook(item)}
                      className="w-16 sm:w-20 aspect-[3/4.2] rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200 shadow-2xs cursor-pointer hover:opacity-95 transition-opacity"
                    >
                      <img
                        src={item.coverImage || item.coverUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Book Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {item.category || 'E-Book PDF'}
                        </span>
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                          Instant PDF
                        </span>
                      </div>

                      <h3
                        onClick={() => onOpenBook && onOpenBook(item)}
                        className="text-sm sm:text-base font-bold text-slate-900 truncate cursor-pointer hover:text-blue-600 transition-colors"
                        title={item.title}
                      >
                        {currentLang === 'en' ? (item.titleEn || item.title) : item.title}
                      </h3>

                      <p className="text-xs text-slate-500 truncate mb-2">
                        {currentLang === 'en' ? (item.authorEn || item.author) : item.author}
                      </p>

                      <div className="flex items-baseline gap-2.5">
                        <span className="text-base sm:text-lg font-black text-slate-950 font-sans">
                          ₹{item.price}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{item.originalPrice}
                          </span>
                        )}
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            ₹{item.originalPrice - item.price} {currentLang === 'hi' ? 'छूट' : 'off'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Remove Action Button */}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex-shrink-0"
                      title={currentLang === 'hi' ? 'हटाएँ' : 'Remove from cart'}
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Secure Checkout Guarantee Box */}
              <div className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/80 flex items-center gap-3">
                <ShieldCheck size={24} className="text-emerald-600 flex-shrink-0" />
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-slate-800 block">
                    {currentLang === 'hi' ? '100% सुरक्षित भुगतान व आजीवन डाउनलोड' : '100% Secure Checkout & Lifetime Access'}
                  </span>
                  <span>
                    {currentLang === 'hi'
                      ? 'UPI भुगतान के तुरंत बाद आपको डिजिटल PDF डाउनलोड प्राप्त होगा।'
                      : 'You will receive your DRM-free PDF download link immediately after UPI payment.'}
                  </span>
                </div>
              </div>
            </div>

            {/* ─── Column 2: Order Summary & QR Payment Card (5 cols) ──── */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
                  {currentLang === 'hi' ? 'ऑर्डर सारांश' : 'Order Summary'}
                </h2>

                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>{currentLang === 'hi' ? 'कुल किताबें:' : 'Items in Cart:'}</span>
                    <span className="font-bold text-slate-900">{cartItems.length}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>{currentLang === 'hi' ? 'उप-योग:' : 'Subtotal:'}</span>
                    <span className="font-bold text-slate-900 font-sans">₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>{currentLang === 'hi' ? 'डिजिटल PDF डिलीवरी:' : 'Digital PDF Delivery:'}</span>
                    <span className="font-bold text-emerald-600">{currentLang === 'hi' ? 'मुफ्त' : 'FREE'}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm sm:text-base font-bold text-slate-900 block">
                        {currentLang === 'hi' ? 'कुल देय राशि:' : 'Total Payable:'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {currentLang === 'hi' ? 'सभी टैक्स सम्मिलित' : 'Inclusive of all digital taxes'}
                      </span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-blue-700 font-sans">
                      ₹{finalTotal}
                    </span>
                  </div>
                </div>

                {/* ─── The Shankar Suthar UPI QR Code Payment View ───────── */}
                {!showPaymentQR ? (
                  /* Pay Button that immediately opens QR */
                  <button
                    id="fullpage-pay-button"
                    onClick={() => setShowPaymentQR(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white font-bold py-3.5 px-5 rounded-2xl text-sm shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer select-none"
                  >
                    <QrCode size={20} />
                    <span>
                      {currentLang === 'hi'
                        ? `₹${finalTotal} का भुगतान करें (QR कोड दिखाएँ)`
                        : `Pay ₹${finalTotal} — Show UPI QR Code`}
                    </span>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  /* The Shankar Suthar QR Code displayed prominently on the page */
                  <div className="pt-3 border-t border-slate-200 flex flex-col items-center animate-in fade-in duration-200">
                    <div className="w-full bg-blue-50 border border-blue-200 rounded-2xl p-3 flex items-center justify-between mb-3.5">
                      <span className="text-xs font-bold text-blue-900">
                        {currentLang === 'hi' ? 'UPI से स्कैन करके भुगतान करें' : 'Scan to Pay via UPI'}
                      </span>
                      <span className="text-lg font-black text-blue-700 font-sans">₹{finalTotal}</span>
                    </div>

                    {/* The Shankar Suthar Google Pay UPI QR Image */}
                    <div className="relative p-3 rounded-2xl bg-white border border-slate-200 shadow-md flex flex-col items-center">
                      <div className="w-60 h-60 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-100">
                        <img
                          src="/upi-qr.jpg"
                          alt="Shankar Suthar UPI QR Code - Scan to pay"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="mt-2 text-xs font-bold text-slate-800">
                        shankar suthar
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Google Pay · PhonePe · Paytm · BHIM
                      </p>
                    </div>

                    {/* Payee Details & Copy Button */}
                    <div className="w-full mt-3.5 bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">
                          {currentLang === 'hi' ? 'खाताधारक:' : 'Payee Name:'}
                        </span>
                        <span className="font-bold text-slate-900 capitalize">{payeeName}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                        <span className="text-slate-500 font-medium">UPI ID:</span>
                        <div className="flex items-center gap-1.5">
                          <code className="font-mono font-bold text-slate-800 text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200">
                            {upiId}
                          </code>
                          <button
                            onClick={handleCopyUPI}
                            className="p-1 rounded text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                            title="Copy UPI ID"
                          >
                            {copied ? (
                              <span className="text-emerald-600 flex items-center gap-0.5">
                                <Check size={12} /> Copied!
                              </span>
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Open in Mobile UPI App Direct Link */}
                    <a
                      href={upiDeepLink}
                      className="w-full mt-3 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl border border-blue-200 transition-colors"
                    >
                      <span>{currentLang === 'hi' ? 'मोबाइल UPI ऐप में खोलें' : 'Open in Phone UPI App'}</span>
                      <ExternalLink size={13} />
                    </a>

                    {/* Payment Confirmation Button */}
                    <button
                      onClick={handleConfirmPayment}
                      disabled={isProcessingPayment}
                      className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isProcessingPayment ? (
                        <span>{currentLang === 'hi' ? 'सत्यापित हो रहा है...' : 'Verifying Payment...'}</span>
                      ) : (
                        <>
                          <CheckCircle2 size={18} />
                          <span>{currentLang === 'hi' ? 'मैंने भुगतान कर दिया है' : 'I Have Completed Payment'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setShowPaymentQR(false)}
                      className="mt-2.5 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      {currentLang === 'hi' ? 'QR कोड छुपाएँ' : 'Hide QR Code'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ─── Empty Cart State ───────────────────────────────────────── */
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-slate-200 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingBag size={28} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
                {currentLang === 'hi' ? 'आपकी कार्ट खाली है' : 'Your Cart is Empty'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {currentLang === 'hi'
                  ? 'हमारी डिजिटल लाइब्रेरी से अपनी पसंदीदा क्लासिक हिन्दी किताबें चुनें।'
                  : 'Explore our rich collection of timeless Hindi classics, poetry, and literature.'}
              </p>
            </div>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <BookOpen size={16} />
              <span>{currentLang === 'hi' ? 'हिन्दी ई-बुक्स देखें' : 'Browse Hindi E-Books'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
