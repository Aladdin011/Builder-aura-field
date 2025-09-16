import { ReactNode } from "react";
import PremiumNavigation from "./PremiumNavigation";
import Footer from "./Footer";
import BackToTop from "@/components/ui/BackToTop";

interface LayoutProps {
  children: ReactNode;
  hideDefaultHeader?: boolean;
}

export default function Layout({
  children,
  hideDefaultHeader = false,
}: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {!hideDefaultHeader && <PremiumNavigation />}
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}
