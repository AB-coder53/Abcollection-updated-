"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { FooterCTA } from "@/components/privilege/FooterCTA";
import { PrivilegeHeader } from "@/components/privilege/Header";
import { OriginSection } from "@/components/privilege/OriginSection";
import { RewardSection } from "@/components/privilege/RewardSection";
import { SocialProofSection } from "@/components/privilege/SocialProofSection";
import { StickyBottomNav } from "@/components/privilege/StickyBottomNav";
import { setIstefadaOfferCookie } from "@/hooks/use-istefada-offer";

export function PrivilegeLanding() {
  const router = useRouter();

  useEffect(() => {
    setIstefadaOfferCookie();
  }, []);

  const goToShop = () => {
    setIstefadaOfferCookie();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-teal selection:text-white relative">
      <PrivilegeHeader />

      <main className="flex-grow pt-16 pb-28">
        <RewardSection onShopNow={goToShop} />
        <OriginSection onExploreArchive={goToShop} />
        <SocialProofSection />
        <FooterCTA onShopNow={goToShop} />
      </main>

      <StickyBottomNav
        onScrollToOffer={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onShopNow={goToShop}
      />
    </div>
  );
}
