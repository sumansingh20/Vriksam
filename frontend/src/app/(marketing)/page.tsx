import { HeroSection } from '@/components/marketing/hero-section';
import { StatsSection } from '@/components/marketing/stats-section';
import { HowItWorksSection } from '@/components/marketing/how-it-works-section';
import { BenefitsSection } from '@/components/marketing/benefits-section';
import { MissionSection } from '@/components/marketing/mission-section';
import { SolutionsSection } from '@/components/marketing/solutions-section';
import { FeaturesGrid } from '@/components/marketing/features-grid';
import { PricingSection } from '@/components/marketing/pricing-section';
import { TestimonialsSection } from '@/components/marketing/testimonials-section';
import { CTASection } from '@/components/marketing/cta-section';

export default function MarketingPage() {
  return (
    <>
      {/* 1. Cinematic hero — full viewport */}
      <HeroSection />

      {/* 2. Social proof numbers */}
      <StatsSection />

      {/* 3. How it works — step-by-step process */}
      <HowItWorksSection />

      {/* 4. Benefits — value propositions with stats */}
      <BenefitsSection />

      {/* 5. Why Vriksham — bento grid with brand pillars */}
      <MissionSection />

      {/* 6. Solutions — tabbed vertical layout */}
      <SolutionsSection />

      {/* 7. Features — bento grid with varied card sizes */}
      <FeaturesGrid />

      {/* 8. Testimonials — large carousel */}
      <TestimonialsSection />

      {/* 9. Pricing — dark featured card */}
      <PricingSection />

      {/* 10. Final CTA — dark, minimal */}
      <CTASection />
    </>
  );
}
