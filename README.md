# Deric Andrews — Creative Portfolio

A cinematic, motion-driven portfolio website for **Deric Andrews** (Full-Stack Developer & AI Creator), engineered with modern web technologies, smooth scroll dynamics, and real-time contact integration with Google Sheets.

---

## ✨ Features

- **Cinematic Scroll Experience**: Powered by [Lenis](https://lenis.darkroom.engineering/) and [GSAP ScrollTrigger](https://greensock.com/scrolltrigger/) for smooth, responsive pinning and expansion transitions.
- **Interactive Visual Cards**: Expandable quote cards and interactive ID card lanyards showcasing developer identity and creative philosophy.
- **Project Showcases & Case Studies**:
  - **EMMA**: AI Voice Agent built with Python, FastAPI, and Gemini AI.
  - **Cruzz Nexus**: Discord Bot powered by Python, Discord.py, and SQLite.
  - **FindFlex Shopping**: Full-stack e-commerce experience on Shopify.
  - **EcoLearn+**: AI-driven climate education application.
- **Contact Form & Google Sheets Integration**:
  - Modal form triggered directly from the navigation bar and the interactive "CONTACT" watermark.
  - Server-side route handler (`/api/contact`) validating input, filtering bots with honeypots, and streaming submissions directly to a Google Sheet via Google Apps Script.
- **Dark Void Aesthetic**: Tailored color palette featuring `#050505` void black, deep burgundy, crimson red accents (`#d52a2f`), and soft cream typography.
- **Full Responsiveness**: Mobile-first design optimized for all screen sizes, with native horizontal scrollbars cleanly prevented.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16 (Turbopack)](https://nextjs.org) with App Router
- **Library**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Animation**: [GSAP 3](https://greensock.com/gsap/) (`@gsap/react`, ScrollTrigger)
- **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/)
- **Icons**: [Lucide React](https://lucide.dev)
- **Language**: [TypeScript](https://www.typescriptlang.org)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/jesalshaji/Deric-portfolio-file-.git
cd Deric-portfolio-file-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root (see `.env.example`):

```env
CONTACT_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/your-deployment-id/exec
GOOGLE_SCRIPT_ID=your-deployment-id
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 Google Sheets Setup (Contact Form)

Form submissions route through `/api/contact` and forward to your Google Sheet via Google Apps Script:

1. **Create a Google Sheet** with row 1 headers:
   ```text
   Timestamp | Name | Work Needed | Budget | Email | Phone
   ```

2. In the sheet, open **Extensions** → **Apps Script**, and paste:
   ```javascript
   function doPost(e) {
     try {
       const data = JSON.parse(e.postData.contents);
       const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
       
       sheet.appendRow([
         data.submittedAt || new Date().toISOString(),
         data.name || "",
         data.work || "",
         data.price || "",
         data.email || "",
         data.phone || ""
       ]);
       
       return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
         .setMimeType(ContentService.MimeType.JSON);
     } catch (err) {
       return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.message }))
         .setMimeType(ContentService.MimeType.JSON);
     }
   }
   ```

3. Deploy as a **Web App**:
   - **Execute as**: *Me*
   - **Who has access**: *Anyone*
   - Copy the deployed Web App URL into `CONTACT_SHEET_WEBHOOK_URL` in `.env.local`.

---

## 📦 Project Structure

```text
├── app/
│   ├── api/contact/route.ts  # Contact API forwarder to Google Sheets
│   ├── globals.css           # Global theme, tokens & utilities
│   ├── layout.tsx            # Root layout with fonts & metadata
│   └── page.tsx              # Single-page portfolio composition
├── components/
│   ├── about/                # About bio, credentials, lanyard
│   ├── case-study/           # In-depth project case study breakdown
│   ├── contact/              # ContactSection & ContactModal popup
│   ├── expertise/            # Technical skills & disciplines
│   ├── hero/                 # Scroll expansion hero sequence
│   ├── intro/                # Headline intro & narrative
│   ├── layout/               # Navigation, Footer & SmoothScrollProvider
│   ├── more-projects/        # Secondary project showcase
│   ├── projects/             # Horizontal pinning projects gallery
│   └── ui/                   # Reusable interactive & canvas elements
├── data/
│   └── content.ts            # Centralized site text, project metadata & links
├── lib/
│   ├── contactValidation.ts  # Input sanitization and validators
│   ├── gsap.ts               # GSAP instance with plugins registered
│   └── refreshPriority.ts    # ScrollTrigger refresh sequencing
└── public/                   # Images and static assets
```

---

## 🚢 Production Build

```bash
npm run build
npm run start
```

---

## 📄 License

Private & Proprietary © Deric Andrews.
