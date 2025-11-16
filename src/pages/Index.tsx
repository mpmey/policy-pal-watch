import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Bell, TrendingUp, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            Your Policy Change Guardian
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Stay Ahead of Policy Changes
            <span className="block text-primary mt-2">Without the Overwhelm</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A calm, friendly early-warning system that translates complex tariffs and policy changes 
            into clear business impacts—so you can focus on what you do best.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              onClick={() => navigate("/setup")}
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              View Demo Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Bell className="w-8 h-8 text-primary" />}
            title="Real-Time Alerts"
            description="Get notified instantly when policies affecting your business change—explained in plain language."
          />
          <FeatureCard
            icon={<Calculator className="w-8 h-8 text-primary" />}
            title="Tariff Calculator"
            description="See exactly how tariff changes impact your costs and margins with our simple calculator."
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8 text-primary" />}
            title="Scenario Analysis"
            description="Visual what-if scenarios show you the business impact of different policy outcomes."
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-primary" />}
            title="Smart Strategies"
            description="Get practical, high-level mitigation strategies tailored to your business situation."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            How It Works
          </h2>
          
          <div className="space-y-8">
            <Step
              number="1"
              title="Tell Us About Your Business"
              description="Share basic details: what you import/export, your HS codes, and key product categories."
            />
            <Step
              number="2"
              title="We Monitor For You"
              description="Our system watches U.S. and Canadian policy changes 24/7, focusing on what matters to your business."
            />
            <Step
              number="3"
              title="Get Clear Alerts"
              description="Receive timely notifications in plain language, with visual impact analyses and actionable next steps."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-12 text-center shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Take Control?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join small business owners who sleep better knowing they're prepared.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="shadow-lg"
            onClick={() => navigate("/setup")}
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-card)] border border-border hover:shadow-[var(--shadow-md)] transition-shadow">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-semibold mb-2 text-card-foreground">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

const Step = ({ number, title, description }: { number: string; title: string; description: string }) => (
  <div className="flex gap-6 items-start">
    <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold shadow-md">
      {number}
    </div>
    <div className="flex-1">
      <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default Index;
