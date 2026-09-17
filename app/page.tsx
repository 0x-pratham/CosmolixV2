import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import OutcomesSection from "@/components/sections/OutcomesSection";
import EngineeringDepthSection from "@/components/sections/EngineeringDepthSection";
import CosmolixVideoTeaser from "@/components/sections/CosmolixVideoTeaser";

export default function Home() {
  return (
    <div className="bg-cosmo-paper min-h-screen">
      <HeroSection />
      <CosmolixVideoTeaser />
      <ProblemSection />
      <OutcomesSection />
      <EngineeringDepthSection />
    </div>
  );
}