"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Components
import { LiquidDropZone } from "@/components/LiquidDropZone";
import { ProcessingWave } from "@/components/ProcessingWave";
import { OptionSelector } from "@/components/OptionSelector";
import { MagicInput } from "@/components/MagicInput";
import { BatchResultGrid, BatchImageItem } from "@/components/BatchResultGrid";
import { TermsGateModal } from "@/components/TermsGateModal";
import { SubscriptionModal } from "@/components/SubscriptionModal";

// Logic
import { uploadImage } from "@/lib/supabase/storage";
import { createBrowserClient } from "@supabase/ssr";
import { PaymentModal } from "@/components/PaymentModal";
import { useToast } from "@/components/Toast";
import { QuickGuide } from "@/components/QuickGuide";

type AppState = "IDLE" | "UPLOADING" | "SELECTION" | "INPUT" | "PROCESSING" | "RESULT";

export default function Home() {
  const [state, setState] = useState<AppState>("IDLE");
  const [items, setItems] = useState<BatchImageItem[]>([]);
  const [selectedMode, setSelectedMode] = useState<"standard" | "magic" | null>(null);

  // New State
  const [showPayment, setShowPayment] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showTermsGate, setShowTermsGate] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[] | null>(null);
  const [user, setUser] = useState<any>(null);
  const { addToast } = useToast();

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Listen for custom events
    const handleOpenSub = () => setShowSubscriptionModal(true);
    const handleReset = () => {
      setState("IDLE");
      setItems([]);
      setSelectedMode(null);
    };

    window.addEventListener('open-subscription', handleOpenSub);
    window.addEventListener('reset-app', handleReset);

    return () => {
      window.removeEventListener('open-subscription', handleOpenSub);
      window.removeEventListener('reset-app', handleReset);
    };
  }, []);

  const processFiles = (files: File[]) => {
    // Limit to 10
    if (files.length > 10) {
      addToast("Maximum 10 images allowed", "error");
      return;
    }

    const newItems = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending' as const
    }));

    setItems(newItems);
    setState("SELECTION");
  };

  const processAppendFiles = (files: File[]) => {
    // Check limit
    if (items.length + files.length > 10) {
      addToast(`Maximum 10 images total. You have ${items.length}, allowing ${10 - items.length} more.`, "error");
      return;
    }

    const newItems = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file), // Local preview immediately
      status: 'pending' as const
    }));

    setItems(prev => [...prev, ...newItems]);
  }

  // 1. Handle File Selection
  const handleFileSelect = async (files: File[]) => {
    if (user) {
      processFiles(files);
      return;
    }

    // Check Local Storage for Guest
    const accepted = localStorage.getItem("propertly_terms_accepted");
    if (accepted === "true") {
      processFiles(files);
    } else {
      setPendingFiles(files);
      setShowTermsGate(true);
    }
  };

  const handleFileAppend = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    if (user) {
      processAppendFiles(files);
      return;
    }

    // Check Local Storage for Guest
    const accepted = localStorage.getItem("propertly_terms_accepted");
    if (accepted === "true") {
      processAppendFiles(files);
    } else {
      // For append, we also show gate if somehow they cleared it, but logically they shouldn't trigger append if not started.
      // But safest to check.
      setPendingFiles(files); // This replaces pending, but Append is usually subsequent.
      // Actually if they are appending, they must have passed selection. 
      // But let's be safe.
      setShowTermsGate(true);
    }
  };

  const handleTermsAccepted = () => {
    setShowTermsGate(false);
    if (pendingFiles) {
      // Decide if it was select or append?
      // Actually pendingFiles covers both if we just route it.
      // But wait, if setItems was empty, it's select. If not, it's append?
      // Simplification: logic above sets items directly.
      // Let's reuse processFiles for simplicity as initial generic flow.

      if (items.length > 0) {
        processAppendFiles(pendingFiles);
      } else {
        processFiles(pendingFiles);
      }
      setPendingFiles(null);
    }
  };


  // 2. Handle Mode Selection
  const handleModeSelect = (mode: "standard" | "magic") => {
    setSelectedMode(mode);
    if (mode === "magic") {
      // Magic needs input prompts
      setState("INPUT");
    } else {
      // Standard automatically starts processing
      handleBatchEnhance("standard", "");
    }
  };

  // 3. Handle Enhancement (Call API)
  const handleBatchEnhance = async (mode: "standard" | "magic", prompt: string) => {
    setState("PROCESSING");

    const promises = items.map(async (item) => {
      // Update status to processing
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'enhancing' } : i));

      try {
        const formData = new FormData();
        formData.append("image", item.file);
        formData.append("mode", mode);
        formData.append("prompt", prompt);

        const res = await fetch("/api/enhance", { method: "POST", body: formData });
        const data = await res.json();

        if (data.success && data.enhancedUrl) {
          setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'complete', enhancedUrl: data.enhancedUrl } : i));
          window.dispatchEvent(new Event('credits-updated'));
        } else {
          if (res.status === 402) {
            setShowSubscriptionModal(true);
          }
          setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'error', error: data.error || "Failed" } : i));
        }
      } catch (e) {
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'error', error: "Network error" } : i));
      }
    });

    await Promise.all(promises);
    setState("RESULT");
  };

  const handleDownload = (item: BatchImageItem) => {
    if (!item.enhancedUrl) return;

    if (user) {
      downloadImage(item.enhancedUrl, `propertly_${item.id}.jpg`);
    } else {
      setShowPayment(true);
    }
  };

  const handleDownloadAll = () => {
    if (user) {
      items.forEach((item, index) => {
        if (item.enhancedUrl) {
          setTimeout(() => {
            downloadImage(item.enhancedUrl!, `propertly_${item.id}.jpg`);
          }, index * 500); // Stagger downloads
        }
      });
      addToast("Starting batch download...", "success");
    } else {
      setShowPayment(true);
    }
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePaymentSuccess = () => {
    // After payment, logic might be complex for batch. 
    // For now, just allow them to click download again.
    addToast("Payment successful! You can now download.", "success");
  };

  const resetFlow = () => {
    setState("IDLE");
    setItems([]);
    setSelectedMode(null);
  };

  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-start pt-20 p-6 bg-background text-foreground overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-foreground/5 via-transparent to-transparent pointer-events-none" />

        <div className="z-10 w-full max-w-5xl space-y-6 text-center">

          {/* Header - Only show in early stages to reduce noise */}
          {(state === "IDLE" || state === "UPLOADING") && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-2 flex flex-col items-center"
            >
              <div className="relative h-48 w-48">
                <Image
                  src="/logo-high-res.jpg"
                  alt="Propertly.ai"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                Turn listing photos into leads. AI-powered enhancement that sells homes faster. <br className="hidden md:block" />
                Declutter, relight, and stage in seconds.
              </p>

              <div className="pt-2">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                  ✨ Sign up to get 3 Free Credits
                </span>
              </div>
            </motion.div>
          )}

          {/* Main Content Area */}
          <motion.div
            layout
            className="w-full flex justify-center min-h-[400px] items-center"
          >
            <AnimatePresence mode="wait">
              {state === "IDLE" && (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <LiquidDropZone
                    onFileSelect={handleFileSelect}
                    isProcessing={false}
                  />
                </motion.div>
              )}

              {state === "UPLOADING" && (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center space-y-4"
                >
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-muted-foreground text-sm">Securely uploading...</p>
                </motion.div>
              )}

              {state === "SELECTION" && (
                <motion.div
                  key="selection"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="w-full"
                >
                  <div className="flex gap-4 mb-8 overflow-x-auto pb-4 justify-center">
                    {items.map(item => (
                      <div key={item.id} className="w-24 h-24 rounded-xl overflow-hidden border border-border shrink-0">
                        <img src={item.preview} className="w-full h-full object-cover" />
                      </div>
                    ))}

                    {/* Add Button */}
                    {items.length < 10 && (
                      <label className="w-24 h-24 rounded-xl border border-border bg-secondary/50 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary transition-colors shrink-0">
                        <span className="text-2xl text-muted-foreground">+</span>
                        <span className="text-[10px] text-muted-foreground font-medium mt-1">Add</span>
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept="image/*"
                          onChange={handleFileAppend}
                        />
                      </label>
                    )}
                  </div>
                  <h2 className="text-2xl font-medium text-foreground mb-8">Choose Enhancement Mode</h2>
                  <OptionSelector onSelect={handleModeSelect} />
                </motion.div>
              )}

              {state === "INPUT" && (
                <motion.div
                  key="input"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="relative w-full max-w-4xl rounded-3xl overflow-hidden bg-card border border-border p-8"
                >
                  <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
                    {items.map(item => (
                      <div key={item.id} className="w-32 h-24 rounded-xl overflow-hidden border border-border shrink-0 relative">
                        <img src={item.preview} className="w-full h-full object-cover opacity-60" />
                      </div>
                    ))}
                  </div>

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-light text-foreground/80">Describe changes for {items.length} images</h3>
                  </div>

                  <MagicInput onSubmit={(prompt) => handleBatchEnhance("magic", prompt)} />
                </motion.div>
              )}

              {state === "PROCESSING" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="w-full max-w-4xl text-center space-y-8"
                >
                  <ProcessingWave imageSrc={items[0]?.preview} />
                  <p className="text-muted-foreground">Processing {items.length} images...</p>
                </motion.div>
              )}

              {state === "RESULT" && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="w-full flex justify-center"
                >
                  <BatchResultGrid
                    items={items}
                    onDownload={handleDownload}
                    onDownloadAll={handleDownloadAll}
                    onReset={resetFlow}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Quick Guide - Only show in IDLE state */}
          {state === "IDLE" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <QuickGuide />
            </motion.div>
          )}
        </div>


      </main>
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
      />
      <TermsGateModal
        isOpen={showTermsGate}
        onAccept={handleTermsAccepted}
        onCancel={() => {
          setShowTermsGate(false);
          setPendingFiles(null);
        }}
      />
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </>
  );
}
