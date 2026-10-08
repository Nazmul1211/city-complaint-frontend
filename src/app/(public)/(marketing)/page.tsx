import {
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
    </div>
  );
}
