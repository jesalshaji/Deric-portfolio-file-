export interface ContactPayload {
  name: string;
  work: string;
  price: string;
  email: string;
  phone: string;
}

export type ContactErrors = Partial<Record<keyof ContactPayload | "contact", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Trims every field and returns a clean payload (unknown/missing → ""). */
export function normalizeContact(input: unknown): ContactPayload {
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const clean = (key: keyof ContactPayload, max: number) =>
    typeof raw[key] === "string" ? (raw[key] as string).trim().slice(0, max) : "";

  return {
    name: clean("name", 120),
    work: clean("work", 2000),
    price: clean("price", 120),
    email: clean("email", 200),
    phone: clean("phone", 40),
  };
}

/** Shared by the form (instant feedback) and the API route (the real gate). */
export function validateContact(p: ContactPayload): ContactErrors {
  const errors: ContactErrors = {};

  if (!p.name) errors.name = "Please tell me your name.";
  if (!p.work) errors.work = "Tell me a little about the work you need.";
  if (!p.price) errors.price = "Add your budget or price range.";

  // Either email or phone is required — both are fine.
  if (!p.email && !p.phone) {
    errors.contact = "Add an email or a phone number so I can reach you.";
  }
  if (p.email && !EMAIL_RE.test(p.email)) {
    errors.email = "That email doesn't look right.";
  }
  if (p.phone && p.phone.replace(/\D/g, "").length < 7) {
    errors.phone = "That phone number looks too short.";
  }

  return errors;
}
