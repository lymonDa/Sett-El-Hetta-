# Sett El-Hetta Digital Platform (منصة ست الحتة الرقمية)

![Sett El-Hetta](https://img.shields.io/badge/Status-In%20Development-yellow)
![Platform](https://img.shields.io/badge/Platform-Web%20%28Mobile--First%29-blue)
![Language](https://img.shields.io/badge/Language-Arabic%20%28RTL%29-success)

## 📖 Overview | نظرة عامة
**Sett El-Hetta** is a digital portfolio and e-commerce platform for handcrafted jewelry and accessories from Khan El Khalili, Cairo. 

The platform is designed to provide an elegant, mobile-first, Arabic-first shopping experience that highlights the craftsmanship of the products while providing an easy-to-use Admin console for managing the catalog, inventory, and orders.

## ✨ Key Features | المميزات الرئيسية
The platform consists of three main components:
1. **Customer Portfolio & Storefront:** A public-facing storefront combining brand storytelling with product discovery, cart, and a manual checkout process (Cash on Delivery / Vodafone Cash).
2. **Admin & Operations Console:** A role-based back office for the business owner to manage products, inventory, pricing, promotions, and manually verify orders.
3. **Marketing & Communications:** WhatsApp click-to-chat, social media linking, and customer inquiry channels.

## 🛠️ Technology Stack | التقنيات المستخدمة
- **Frontend Framework:** React 18+ (TypeScript) + Vite
- **Styling:** CSS / Tailwind CSS (Optional) / Framer Motion for Animations
- **Backend/Database:** Supabase
- **Internationalization:** i18next (Arabic / English)
- **Routing:** React Router

## 📂 Documentation | التوثيق المستندي
Comprehensive project documentation, plans, and specifications can be found in the `/files` directory:

- **Product Requirements (PRD):** [`Sett_El-Hetta_PRD.md`](./files/Sett_El-Hetta_PRD.md)
- **Software Requirements Specification (SRS):** [`Sett El-Hetta - Software Requirements Specification.md`](./files/Sett%20El-Hetta%20-%20Software%20Requirements%20Specification.md)
- **Frontend Plan:** [`Sett_El-Hetta_Frontend_Implementation_Plan.md`](./files/Sett_El-Hetta_Frontend_Implementation_Plan.md)
- **Backend Plan:** [`Sett_El-Hetta_Backend_Implementation_Plan.md`](./files/Sett_El-Hetta_Backend_Implementation_Plan.md)
- **Design System:** [`Sett_El-Hetta_Design_System_UI_Specification.md`](./files/Sett_El-Hetta_Design_System_UI_Specification.md)
- **Feature Plan:** [`Sett_El-Hetta_Feature_Plan.md`](./files/Sett_El-Hetta_Feature_Plan.md)
- **Test Plan:** [`Sett_El-Hetta_QA_Test_Plan.md`](./files/Sett_El-Hetta_QA_Test_Plan.md)

## 🚀 Getting Started | البداية

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Set up your `.env` file based on `.env.example` with your Supabase credentials:
   ```env
   VITE_PUBLIC_SUPABASE_URL=your-project-url
   VITE_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---
*Created for Sett El-Hetta, Cairo, Egypt.*
