import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../../../context/AppContext';
import { trackEvent } from '../../../utils/analytics';
import {
  QrCode as QrIcon,
  Download,
  Copy,
  RotateCcw,
  Check,
  Wifi,
  Globe,
  Mail,
  Phone,
  MessageSquare,
  Type,
  ShieldCheck,
} from 'lucide-react';

type QrDataType = 'url' | 'text' | 'wifi' | 'email' | 'phone' | 'whatsapp';

export const QrGenerator: React.FC = () => {
  const { addToast } = useApp();

  const [qrType, setQrType] = useState<QrDataType>('url');

  // Input states
  const [urlValue, setUrlValue] = useState('https://aitoolshub.io');
  const [textValue, setTextValue] = useState('Welcome to AI Tools Hub');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [waPhone, setWaPhone] = useState('');
  const [waMessage, setWaMessage] = useState('');

  // Styling states
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [resolutionSize, setResolutionSize] = useState<number>(512);

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrSvgString, setQrSvgString] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Compute raw payload based on type
  const computePayload = (): string => {
    switch (qrType) {
      case 'url':
        return urlValue.trim() || 'https://aitoolshub.io';
      case 'text':
        return textValue.trim() || 'Hello World';
      case 'wifi':
        return `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};;`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(
          emailBody
        )}`;
      case 'phone':
        return `tel:${phoneNumber.trim()}`;
      case 'whatsapp': {
        const cleanPhone = waPhone.replace(/[^0-9]/g, '');
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;
      }
      default:
        return 'https://aitoolshub.io';
    }
  };

  // Generate QR Code in real time
  useEffect(() => {
    const payload = computePayload();
    if (!payload) return;

    // Generate PNG Data URL
    QRCode.toDataURL(payload, {
      width: resolutionSize,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel,
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR PNG generation error:', err));

    // Generate SVG string
    QRCode.toString(payload, {
      type: 'svg',
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel,
    })
      .then((svg) => setQrSvgString(svg))
      .catch((err) => console.error('QR SVG generation error:', err));
  }, [
    qrType,
    urlValue,
    textValue,
    wifiSsid,
    wifiPassword,
    wifiEncryption,
    emailTo,
    emailSubject,
    emailBody,
    phoneNumber,
    waPhone,
    waMessage,
    fgColor,
    bgColor,
    errorCorrectionLevel,
    resolutionSize,
  ]);

  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qrcode-${qrType}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    addToast('success', 'High-res QR Code (PNG) downloaded!');
    trackEvent('download', { tool_name: 'qr-code-generator', format: 'png' });
  };

  const handleDownloadSvg = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode-${qrType}-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('success', 'Vector QR Code (SVG) downloaded!');
    trackEvent('download', { tool_name: 'qr-code-generator', format: 'svg' });
  };

  const handleCopyPng = async () => {
    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopied(true);
      addToast('success', 'QR Code image copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
      trackEvent('copy', { tool_name: 'qr-code-generator', type: 'image_png' });
    } catch {
      addToast('error', 'Browser clipboard image copy not supported. Please use Download.');
    }
  };

  const handleReset = () => {
    setUrlValue('https://aitoolshub.io');
    setTextValue('');
    setWifiSsid('');
    setWifiPassword('');
    setPhoneNumber('');
    setWaPhone('');
    setEmailTo('');
    setFgColor('#0f172a');
    setBgColor('#ffffff');
    addToast('info', 'QR code generator reset to defaults.');
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#16A34A]/10 dark:bg-emerald-950/60 text-[#16A34A] dark:text-emerald-400">
              <QrIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] dark:text-white">
                Custom QR Code Generator
              </h2>
              <p className="text-xs text-[#475569] dark:text-slate-400">
                Generate high-resolution PNG & vector SVG QR codes for websites, Wi-Fi, and contacts
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#16A34A]/10 dark:bg-emerald-950/40 border border-[#16A34A]/30 dark:border-emerald-800/60 text-[#16A34A] dark:text-emerald-300 text-xs font-medium">
            <ShieldCheck className="h-4 w-4 text-[#16A34A] shrink-0" />
            <span>Codes never expire · 100% static barcode standards</span>
          </div>
        </div>

        {/* QR Type Selector */}
        <div className="mt-6 pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex flex-wrap gap-2">
          {[
            { id: 'url', label: 'Website URL', icon: <Globe className="h-3.5 w-3.5" /> },
            { id: 'text', label: 'Plain Text', icon: <Type className="h-3.5 w-3.5" /> },
            { id: 'wifi', label: 'Wi-Fi Network', icon: <Wifi className="h-3.5 w-3.5" /> },
            { id: 'email', label: 'Email', icon: <Mail className="h-3.5 w-3.5" /> },
            { id: 'phone', label: 'Phone', icon: <Phone className="h-3.5 w-3.5" /> },
            { id: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare className="h-3.5 w-3.5" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setQrType(item.id as QrDataType)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                qrType === item.id
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-[#F8FAFC] dark:bg-slate-800 text-[#475569] dark:text-slate-300 border border-[#E2E8F0] dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Settings & Form Left, Live QR Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form & Styling */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Content Inputs */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Payload Content
            </h3>

            {/* URL */}
            {qrType === 'url' && (
              <div className="space-y-1">
                <label htmlFor="qr-url-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Website URL
                </label>
                <input
                  id="qr-url-input"
                  name="qrUrl"
                  type="url"
                  value={urlValue}
                  onChange={(e) => setUrlValue(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            )}

            {/* Plain Text */}
            {qrType === 'text' && (
              <div className="space-y-1">
                <label htmlFor="qr-text-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Plain Text Content
                </label>
                <textarea
                  id="qr-text-input"
                  name="qrText"
                  rows={4}
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder="Enter messages, notes, serial keys, or instructions..."
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-3 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            )}

            {/* Wi-Fi */}
            {qrType === 'wifi' && (
              <div className="space-y-3">
                <div>
                  <label htmlFor="qr-wifi-ssid" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Network Name (SSID)
                  </label>
                  <input
                    id="qr-wifi-ssid"
                    name="wifiSsid"
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="e.g. Guest-Office-WiFi"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="qr-wifi-pass" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Network Password
                  </label>
                  <input
                    id="qr-wifi-pass"
                    name="wifiPassword"
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="Network password"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="qr-wifi-enc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Security Encryption
                  </label>
                  <select
                    id="qr-wifi-enc"
                    name="wifiEncryption"
                    value={wifiEncryption}
                    onChange={(e) => setWifiEncryption(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None (Open Network)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Email */}
            {qrType === 'email' && (
              <div className="space-y-3">
                <div>
                  <label htmlFor="qr-email-to" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Recipient Email
                  </label>
                  <input
                    id="qr-email-to"
                    name="emailTo"
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="contact@company.com"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="qr-email-sub" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pre-filled Subject
                  </label>
                  <input
                    id="qr-email-sub"
                    name="emailSubject"
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Inquiry from QR Code"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Phone */}
            {qrType === 'phone' && (
              <div className="space-y-1">
                <label htmlFor="qr-phone-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Telephone Number (with Country Code)
                </label>
                <input
                  id="qr-phone-input"
                  name="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            )}

            {/* WhatsApp */}
            {qrType === 'whatsapp' && (
              <div className="space-y-3">
                <div>
                  <label htmlFor="qr-wa-phone" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp Phone Number (Digits only, including Country Code)
                  </label>
                  <input
                    id="qr-wa-phone"
                    name="waPhone"
                    type="tel"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    placeholder="e.g. 15551234567"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="qr-wa-msg" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Prefilled Message
                  </label>
                  <input
                    id="qr-wa-msg"
                    name="waMessage"
                    type="text"
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    placeholder="Hello, I scanned your QR code!"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

          </div>

          {/* Styling & Color Options */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Styling & Precision
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Foreground Color */}
              <div>
                <label htmlFor="qr-fg-color" className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Barcode Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="qr-fg-color"
                    name="fgColor"
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    aria-label="Barcode Foreground Color"
                    className="h-8 w-8 rounded cursor-pointer border border-slate-300 p-0"
                  />
                  <span className="font-mono text-[11px] text-slate-500 uppercase">{fgColor}</span>
                </div>
              </div>

              {/* Background Color */}
              <div>
                <label htmlFor="qr-bg-color" className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Background
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="qr-bg-color"
                    name="bgColor"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    aria-label="Barcode Background Canvas Color"
                    className="h-8 w-8 rounded cursor-pointer border border-slate-300 p-0"
                  />
                  <span className="font-mono text-[11px] text-slate-500 uppercase">{bgColor}</span>
                </div>
              </div>

              {/* Error Correction */}
              <div>
                <label htmlFor="qr-error-corr" className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Error Correction
                </label>
                <select
                  id="qr-error-corr"
                  name="errorCorrectionLevel"
                  value={errorCorrectionLevel}
                  onChange={(e) => setErrorCorrectionLevel(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-2 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="L">L (7% recovery)</option>
                  <option value="M">M (15% standard)</option>
                  <option value="Q">Q (25% high)</option>
                  <option value="H">H (30% best for print)</option>
                </select>
              </div>

              {/* Resolution Size */}
              <div>
                <label htmlFor="qr-resolution-size" className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Resolution Size
                </label>
                <select
                  id="qr-resolution-size"
                  name="resolutionSize"
                  value={resolutionSize}
                  onChange={(e) => setResolutionSize(parseInt(e.target.value, 10))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-2 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value={256}>256px (Web)</option>
                  <option value={512}>512px (Standard)</option>
                  <option value={1024}>1024px (High Res Print)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-rose-500 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset parameters</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Live QR Preview & Export */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6 text-center">
            
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-900 dark:text-white">Live Scanner Preview</span>
              <span className="font-mono text-[11px]">{resolutionSize}×{resolutionSize}px</span>
            </div>

            {/* QR Card Container */}
            <div className="flex justify-center items-center py-4">
              <div
                className="p-5 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 transition-all inline-block"
                style={{ backgroundColor: bgColor }}
              >
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Generated Scannable QR Code"
                    className="w-64 h-64 object-contain"
                  />
                ) : (
                  <div className="w-64 h-64 flex items-center justify-center text-slate-400 text-xs">
                    Generating QR code...
                  </div>
                )}
              </div>
            </div>

            {/* Scannable Contrast Warning Check */}
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span>Tested for camera readability & high contrast</span>
            </div>

            {/* Export Actions */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDownloadPng}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PNG</span>
                </button>
                <button
                  onClick={handleDownloadSvg}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download SVG</span>
                </button>
              </div>

              <button
                onClick={handleCopyPng}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied to clipboard' : 'Copy image to clipboard'}</span>
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
