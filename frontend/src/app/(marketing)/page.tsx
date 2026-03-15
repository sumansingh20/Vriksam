import { HeroSection } from '@/components/marketing/hero-section';
import { StatsSection } from '@/components/marketing/stats-section';
import { MissionSection } from '@/components/marketing/mission-section';
import { SolutionsSection } from '@/components/marketing/solutions-section';
import { FeaturesGrid } from '@/components/marketing/features-grid';
import { PricingSection } from '@/components/marketing/pricing-section';
import { TestimonialsSection } from '@/components/marketing/testimonials-section';
import { CTASection } from '@/components/marketing/cta-section';

export default function MarketingPage() {
  return (
    <>
      {/* 1. Cinematic hero — full viewport, 3D scene */}
      <HeroSection />

      {/* 2. Social proof numbers — light, airy */}
      <StatsSection />

      {/* 3. Why Vriksham — bento grid with brand pillars */}
      <MissionSection />

      {/* 4. Solutions — tabbed vertical layout */}
      <SolutionsSection />

      {/* 5. Features — bento grid with varied card sizes */}
      <FeaturesGrid />

      {/* 6. Testimonials — large carousel */}
      <TestimonialsSection />

      {/* 7. Pricing — dark featured card */}
      <PricingSection />

      {/* 8. Final CTA — dark, minimal */}
      <CTASection />
    </>
  );
}
