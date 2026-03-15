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
      <HeroSection />
      <StatsSection />
      <MissionSection />
      <SolutionsSection />
      <FeaturesGrid />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
