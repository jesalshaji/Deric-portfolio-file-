"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ArrowUpRight, Check, Loader2, X } from "lucide-react";
import { useLenis } from "@/components/layout/SmoothScrollProvider";
import {
  normalizeContact,
  validateContact,
  type ContactErrors,
  type ContactPayload,
} from "@/lib/contactValidation";

interface ContactModalContextValue {
  openContact: () => void;
}

const ContactModalContext = createContext<ContactModalContextValue>({ openContact: () => {} });

/** Call `openContact()` from any client component to show the contact form. */
export function useContactModal() {
  return useContext(ContactModalContext);
}

const EMPTY: ContactPayload = { name: "", work: "", price: "", email: "", phone: "" };

const inputClass =
  "w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-crimson focus:bg-white/[0.05]";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openContact = useCallback(() => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus?.();
  }, []);

  return (
    <ContactModalContext.Provider value={{ openContact }}>
      {children}
      {open && <ContactModal onClose={close} />}
    </ContactModalContext.Provider>
  );
}

function ContactModal({ onClose }: { onClose: () => void }) {
  const lenisRef = useLenis();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const [values, setValues] = useState<ContactPayload>(EMPTY);
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  // Lock page scroll (Lenis or native) while open, and focus the first field.
  useEffect(() => {
    const lenis = lenisRef.current;
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [lenisRef]);

  // Escape to close + keep Tab focus inside the dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        "button:not([disabled]), input:not([disabled]), textarea:not([disabled])"
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const update = (key: keyof ContactPayload, value: string) => {
    const next = { ...values, [key]: value };
    setValues(next);
    // once they've tried to submit, re-check live so errors clear as they fix them
    if (submitted) setErrors(validateContact(normalizeContact(next)));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    setSubmitted(true);
    setServerError("");
    const payload = normalizeContact(values);
    const found = validateContact(payload);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setServerError("Could not reach the server. Check your connection and try again.");
      setStatus("error");
    }
  };

  const fieldBorder = (key: keyof ContactErrors) =>
    errors[key] ? "border-crimson/70" : "border-white/10";

  const error = (key: keyof ContactErrors) =>
    errors[key] ? (
      <p role="alert" className="mt-1.5 text-xs text-crimson">
        {errors[key]}
      </p>
    ) : null;

  return (
    <div
      className="modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        data-lenis-prevent
        className="modal-panel relative max-h-[92vh] w-full max-w-xl overflow-y-auto overflow-x-hidden no-scrollbar rounded-2xl border border-white/10 bg-[#0a0506] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.9)] sm:p-9"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-crimson-deep/30 blur-[90px]" />
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close contact form"
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-cream/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {status === "sent" ? (
          <div className="relative flex flex-col items-center py-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-crimson/50 bg-crimson/15 text-crimson">
              <Check className="h-6 w-6" />
            </span>
            <h2
              id="contact-title"
              className="mt-6 text-3xl font-black uppercase tracking-tight text-white"
            >
              Message sent
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/60">
              Thanks {values.name.trim().split(" ")[0]} — I&rsquo;ll get back to you soon.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 rounded-full border border-white/20 px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:border-crimson hover:text-crimson"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="relative">
            <p className="label-text text-cream/50">/ Let&rsquo;s Talk</p>
            <h2
              id="contact-title"
              className="mt-3 text-3xl font-black uppercase leading-none tracking-tight text-white sm:text-4xl"
            >
              Start a <span className="text-crimson">project</span>
            </h2>

            <div className="mt-8 space-y-5">
              <div>
                <label htmlFor="cf-name" className="label-text mb-2 block text-cream/60">
                  Name <span className="text-crimson">*</span>
                </label>
                <input
                  ref={firstFieldRef}
                  id="cf-name"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                  className={`${inputClass} ${fieldBorder("name")}`}
                />
                {error("name")}
              </div>

              <div>
                <label htmlFor="cf-work" className="label-text mb-2 block text-cream/60">
                  What work do you need? <span className="text-crimson">*</span>
                </label>
                <textarea
                  id="cf-work"
                  rows={4}
                  value={values.work}
                  onChange={(e) => update("work", e.target.value)}
                  placeholder="e.g. A portfolio site, an AI voice agent, a Shopify store…"
                  aria-invalid={!!errors.work}
                  className={`${inputClass} resize-none ${fieldBorder("work")}`}
                />
                {error("work")}
              </div>

              <div>
                <label htmlFor="cf-price" className="label-text mb-2 block text-cream/60">
                  Budget / price <span className="text-crimson">*</span>
                </label>
                <input
                  id="cf-price"
                  type="text"
                  value={values.price}
                  onChange={(e) => update("price", e.target.value)}
                  placeholder="e.g. €1,000 – €2,000"
                  aria-invalid={!!errors.price}
                  className={`${inputClass} ${fieldBorder("price")}`}
                />
                {error("price")}
              </div>

              <div>
                <p className="label-text mb-2 text-cream/60">
                  How can I reach you? <span className="text-crimson">*</span>
                  <span className="ml-2 normal-case tracking-normal text-cream/35">
                    email or phone — at least one
                  </span>
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="cf-email" className="sr-only">
                      Email
                    </label>
                    <input
                      id="cf-email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="Email"
                      aria-invalid={!!errors.email || !!errors.contact}
                      className={`${inputClass} ${errors.email || errors.contact ? "border-crimson/70" : "border-white/10"}`}
                    />
                    {error("email")}
                  </div>
                  <div>
                    <label htmlFor="cf-phone" className="sr-only">
                      Phone number
                    </label>
                    <input
                      id="cf-phone"
                      type="tel"
                      autoComplete="tel"
                      value={values.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="Phone number"
                      aria-invalid={!!errors.phone || !!errors.contact}
                      className={`${inputClass} ${errors.phone || errors.contact ? "border-crimson/70" : "border-white/10"}`}
                    />
                    {error("phone")}
                  </div>
                </div>
                {error("contact")}
              </div>

              {/* honeypot — hidden from people, bots fill it */}
              <div aria-hidden className="sr-only pointer-events-none opacity-0 h-0 w-0 overflow-hidden">
                <label>
                  Website
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </label>
              </div>
            </div>

            {status === "error" && serverError && (
              <p
                role="alert"
                className="mt-5 rounded-xl border border-crimson/40 bg-crimson/10 px-4 py-3 text-sm text-cream"
              >
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="group mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-crimson px-7 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-crimson-deep disabled:cursor-wait disabled:opacity-70"
            >
              {status === "sending" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  Send message
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
