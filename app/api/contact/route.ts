import { NextResponse } from "next/server";
import { normalizeContact, validateContact } from "@/lib/contactValidation";

export const runtime = "nodejs";

/**
 * Receives the contact form and forwards it as JSON to CONTACT_SHEET_WEBHOOK_URL
 * — the "Excel page". See README ("Contact form → spreadsheet") for the
 * Google Apps Script that appends each submission as a new row.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field. Pretend success to bots.
  if (body && typeof body === "object" && (body as Record<string, unknown>).website) {
    return NextResponse.json({ ok: true });
  }

  const payload = normalizeContact(body);
  const errors = validateContact(payload);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const webhook =
    process.env.CONTACT_SHEET_WEBHOOK_URL ||
    "https://script.google.com/macros/s/AKfycbzbIKVeg6MW-z0V0FEtdhbR3PMSGONugwdwOgqHBq4L0Vl6S9ly2TIrs9yyTiB734cYPg/exec";
  if (!webhook) {
    console.error("[contact] CONTACT_SHEET_WEBHOOK_URL is not set — submission not stored:", payload);
    return NextResponse.json(
      { ok: false, error: "The contact sheet isn't connected yet. Please try again later." },
      { status: 503 }
    );
  }

  try {
    const workValue = payload.work;
    const priceValue = payload.price;

    const dataToSend = {
      submittedAt: new Date().toISOString(),
      timestamp: new Date().toLocaleString(),
      date: new Date().toLocaleDateString(),
      name: payload.name,
      // Work / message field aliases so any Apps Script naming works
      work: workValue,
      workNeeded: workValue,
      "Work Needed": workValue,
      message: workValue,
      details: workValue,
      project: workValue,
      // Budget / price field aliases
      price: priceValue,
      budget: priceValue,
      "Budget": priceValue,
      // Contact fields
      email: payload.email,
      phone: payload.phone,
    };

    const res = await fetch(webhook, {
      method: "POST",
      // text/plain keeps Google Apps Script happy (no CORS preflight / body parsing quirks)
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(dataToSend),
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`Sheet responded ${res.status}`);
  } catch (err) {
    console.error("[contact] failed to write to sheet:", err);
    return NextResponse.json(
      { ok: false, error: "Couldn't send your message. Please try again in a moment." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
