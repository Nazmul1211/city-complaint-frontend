import {
  CityServicesSection,
  CtaBannerSection,
  GovernanceAnalyticsSection,
  HeroSection,
  HowItWorks,
  RecentResolvedShowcase,
  StatsCounter,
} from "@/components/modules/home";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <StatsCounter />
      <HowItWorks />
      <RecentResolvedShowcase />
      <CityServicesSection />
      <GovernanceAnalyticsSection />
      <CtaBannerSection />
    </div>
  );
}
