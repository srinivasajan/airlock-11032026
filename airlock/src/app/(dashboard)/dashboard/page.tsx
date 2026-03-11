"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import {
  Users,
  Puzzle,
  Clock,
  Activity,
  ArrowRight,
  UserPlus,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSession, type AirlockSession } from "@/lib/session";

const SETUP_STEPS = [
  {
    step: 1,
    title: "Connect your first integration",
    description: "Link GitHub, Slack, Google Workspace, or any tool your team uses.",
    cta: "Go to Integrations",
    href: "/integrations",
    icon: Puzzle,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    step: 2,
    title: "Invite your team members",
    description: "Add people to your organization and provision their access instantly.",
    cta: "Go to Members",
    href: "/members",
    icon: UserPlus,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    step: 3,
    title: "Set up access policies",
    description: "Define which tools each role can access — and automate it going forward.",
    cta: "Go to Access Control",
    href: "/access",
    icon: ShieldCheck,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
];

export default function DashboardPage() {
  const [session] = useState<AirlockSession | null>(() => {
    if (typeof window === "undefined") return null;
    return getSession();
  });

  const firstName = session?.firstName ?? "there";

  return (
    <>
      <DashboardHeader
        title="Dashboard"
        description={`Welcome, ${firstName}. Let's get your workspace set up.`}
        actions={
          <Button size="sm" asChild>
            <Link href="/members">
              <UserPlus className="h-4 w-4" />
              Invite Members
            </Link>
          </Button>
        }
      />

      <div className="flex-1 p-6 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { title: "Total Members", value: "0", sub: "Invite your first member", icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
            { title: "Active Integrations", value: "0", sub: "Connect a tool to get started", icon: Puzzle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { title: "Pending Invites", value: "0", sub: "No pending invitations", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
            { title: "Activity Events", value: "0", sub: "No activity yet", icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold mb-0.5">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.title}</div>
                  <div className="text-[11px] mt-1 text-muted-foreground/70">{stat.sub}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div>
          <div className="mb-4">
            <h2 className="text-base font-semibold">Get started with AirLock</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Complete these three steps to unlock the full power of your workspace.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SETUP_STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.step} className="group hover:border-primary/40 transition-colors">
                  <CardContent className="p-6 flex flex-col gap-4 h-full">
                    <div className="flex items-start justify-between">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.bg}`}>
                        <Icon className={`h-5 w-5 ${s.color}`} />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                        Step {s.step}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1.5 w-full group-hover:border-primary/40" asChild>
                      <Link href={s.href}>
                        {s.cta}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <CardDescription className="text-xs">Access changes in your organization</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/activity" className="gap-1 text-xs">
                View all
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Activity className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No activity yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Activity will appear here as your team starts using AirLock.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
