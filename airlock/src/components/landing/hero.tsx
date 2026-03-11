import Link from "next/link";
import { ArrowRight, Play, Users, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        {/* Badge */}
        <div className="mb-8 flex justify-center">
          <Badge variant="outline" className="gap-1.5 rounded-full px-4 py-1.5 text-xs border-primary/30 text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse inline-block" />
            Now in Early Access — Join the waitlist
          </Badge>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.1]">
          Control Who Gets In,{" "}
          <span className="text-primary">What They Access</span>
          {" "}& When
        </h1>

        {/* Sub-headline */}
        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          AirLock empowers admins to onboard entire teams at scale, connect your existing tools,
          and manage access — all from one powerful dashboard. From hire to offboard.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="xl" asChild className="group">
            <Link href="/sign-up">
              Start For Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button size="xl" variant="outline" asChild className="group">
            <Link href="#how-it-works">
              <Play className="h-4 w-4" />
              See How It Works
            </Link>
          </Button>
        </div>

        {/* Trust signals */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>500+ teams onboarded</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span>Enterprise-grade security</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span>Deploy in under 5 minutes</span>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20 relative mx-auto max-w-5xl">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-xl" />
          <div className="relative rounded-xl border border-border bg-card overflow-hidden shadow-2xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-3 border-b border-border">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/70" />
                <div className="h-3 w-3 rounded-full bg-amber-400/70" />
                <div className="h-3 w-3 rounded-full bg-emerald-400/70" />
              </div>
              <div className="flex-1 mx-4 flex justify-center">
                <div className="bg-background rounded-md px-4 py-1 text-xs text-muted-foreground border border-border w-72 text-center">
                  app.airlock.io/dashboard
                </div>
              </div>
            </div>
            {/* App Preview */}
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="flex h-[420px] bg-background">
      {/* Sidebar */}
      <div className="w-56 border-r border-border bg-sidebar flex flex-col p-3 gap-1">
        <div className="flex items-center gap-2 px-2 py-3 mb-2">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm">AirLock</span>
        </div>
        {["Dashboard", "Members", "Integrations", "Access Control", "Activity", "Settings"].map(
          (item, i) => (
            <div
              key={item}
              className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs ${
                i === 0
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <div className="h-3.5 w-3.5 rounded-sm bg-current opacity-40" />
              {item}
            </div>
          )
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="text-sm font-semibold mb-4">Overview</div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: "Total Members", value: "247", change: "+12 this week" },
            { label: "Active Integrations", value: "8", change: "All healthy" },
            { label: "Pending Invites", value: "34", change: "2 expiring soon" },
            { label: "Access Changes", value: "18", change: "Last 7 days" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-card p-3">
              <div className="text-[10px] text-muted-foreground mb-1">{stat.label}</div>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Table Preview */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="bg-muted/30 px-3 py-2 text-[10px] font-medium text-muted-foreground flex gap-6">
            <span className="w-32">NAME</span>
            <span className="w-32">EMAIL</span>
            <span className="w-20">ROLE</span>
            <span>INTEGRATIONS</span>
          </div>
          {[
            { name: "Sarah Chen", email: "sarah@acme.io", role: "Admin", tools: 8 },
            { name: "James Miller", email: "james@acme.io", role: "Developer", tools: 5 },
            { name: "Priya Sharma", email: "priya@acme.io", role: "Designer", tools: 4 },
            { name: "Tom Williams", email: "tom@acme.io", role: "Marketing", tools: 3 },
          ].map((row) => (
            <div key={row.email} className="flex gap-6 items-center px-3 py-2.5 border-t border-border hover:bg-muted/20 text-[11px]">
              <span className="w-32 font-medium">{row.name}</span>
              <span className="w-32 text-muted-foreground">{row.email}</span>
              <span className="w-20">
                <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px]">{row.role}</span>
              </span>
              <span className="text-muted-foreground">{row.tools} integrations</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
