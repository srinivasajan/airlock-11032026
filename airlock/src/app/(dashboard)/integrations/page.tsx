"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import {
  Plus,
  CheckCircle2,
  Settings,
  Users,
  RefreshCw,
  ExternalLink,
  Unlink,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type IntegrationStatus = "connected" | "disconnected" | "error";

type Integration = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  status: IntegrationStatus;
  members?: number;
  lastSync?: string;
  features: string[];
};

const INTEGRATIONS: Integration[] = [
  {
    id: "github",
    name: "GitHub",
    description: "Manage organization membership, team access, and repository permissions.",
    icon: "🐙",
    category: "Development",
    status: "disconnected",
    features: ["Org membership", "Team management", "Repo access", "SSH key provisioning"],
  },
  {
    id: "slack",
    name: "Slack",
    description: "Auto-provision Slack workspace access and manage channel memberships.",
    icon: "💬",
    category: "Communication",
    status: "disconnected",
    features: ["Workspace access", "Channel management", "Guest accounts", "User groups"],
  },
  {
    id: "google",
    name: "Google Workspace",
    description: "Gmail, Drive, Calendar, Meet, and Admin console access management.",
    icon: "🔵",
    category: "Productivity",
    status: "disconnected",
    features: ["Gmail access", "Drive permissions", "Groups management", "Admin console"],
  },
  {
    id: "notion",
    name: "Notion",
    description: "Manage workspace access, page permissions, and team memberships.",
    icon: "📝",
    category: "Productivity",
    status: "disconnected",
    features: ["Workspace access", "Page sharing", "Team spaces", "Guest roles"],
  },
  {
    id: "jira",
    name: "Jira",
    description: "Project access, issue tracking, and board membership management.",
    icon: "🔷",
    category: "Project Management",
    status: "disconnected",
    features: ["Project access", "Board membership", "Issue tracking", "Permission schemes"],
  },
  {
    id: "figma",
    name: "Figma",
    description: "Design team access, file permissions, and project membership.",
    icon: "🎨",
    category: "Design",
    status: "disconnected",
    features: ["Team access", "File permissions", "Project sharing", "Dev mode"],
  },
  {
    id: "aws",
    name: "AWS",
    description: "IAM users, roles, policies, and resource access management.",
    icon: "☁️",
    category: "Cloud",
    status: "disconnected",
    features: ["IAM users/roles", "Policy management", "Console access", "MFA enforcement"],
  },
  {
    id: "linear",
    name: "Linear",
    description: "Issue tracking team membership and project access control.",
    icon: "📐",
    category: "Project Management",
    status: "disconnected",
    features: ["Team memberships", "Project access", "Issue tracking", "Cycles access"],
  },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  const [connectDialogIntegration, setConnectDialogIntegration] = useState<Integration | null>(null);
  const [disconnectIntegration, setDisconnectIntegration] = useState<Integration | null>(null);
  const [connecting, setConnecting] = useState(false);

  const connected = integrations.filter((i) => i.status === "connected");
  const available = integrations.filter((i) => i.status !== "connected");

  async function handleConnect() {
    if (!connectDialogIntegration) return;
    setConnecting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === connectDialogIntegration.id
          ? { ...i, status: "connected", lastSync: "just now" }
          : i
      )
    );
    setConnecting(false);
    setConnectDialogIntegration(null);
  }

  function handleDisconnect() {
    if (!disconnectIntegration) return;
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === disconnectIntegration.id
          ? { ...i, status: "disconnected", members: undefined, lastSync: undefined }
          : i
      )
    );
    setDisconnectIntegration(null);
  }

  return (
    <>
      <DashboardHeader
        title="Integrations"
        description={`${connected.length} connected · ${available.length} available`}
        actions={
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Request Integration
          </Button>
        }
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Connected", value: connected.length, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Available", value: available.length, icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Total Catalog", value: integrations.length, icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${s.bg}`}>
                  <Icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <div>
                  <div className="text-xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <Tabs defaultValue="available">
          <TabsList>
            <TabsTrigger value="connected">Connected ({connected.length})</TabsTrigger>
            <TabsTrigger value="available">Available ({available.length})</TabsTrigger>
          </TabsList>

          {/* Connected Integrations */}
          <TabsContent value="connected" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connected.map((integration) => (
                <Card key={integration.id} className="overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{integration.icon}</div>
                        <div>
                          <div className="font-semibold text-sm">{integration.name}</div>
                          <div className="text-xs text-muted-foreground">{integration.category}</div>
                        </div>
                      </div>
                      <Badge variant="success" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Connected
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground mb-4">{integration.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <RefreshCw className="h-3 w-3" />
                        Synced {integration.lastSync ?? "just now"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Settings className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => setDisconnectIntegration(integration)}
                        >
                          <Unlink className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {connected.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Zap className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No integrations connected yet.</p>
                <p className="text-xs mt-1">Switch to the Available tab to connect your first integration.</p>
              </div>
            )}
          </TabsContent>

          {/* Available Integrations */}
          <TabsContent value="available" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {available.map((integration) => (
                <Card key={integration.id} className="overflow-hidden hover:border-primary/30 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{integration.icon}</div>
                        <div>
                          <div className="font-semibold text-sm">{integration.name}</div>
                          <div className="text-xs text-muted-foreground">{integration.category}</div>
                        </div>
                      </div>
                      <Badge variant="secondary">Not connected</Badge>
                    </div>

                    <p className="text-xs text-muted-foreground mb-4">{integration.description}</p>

                    <div className="mb-4">
                      <div className="text-xs font-medium text-muted-foreground mb-1.5">Features</div>
                      <div className="flex flex-wrap gap-1">
                        {integration.features.map((f) => (
                          <span key={f} className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px]">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full gap-2"
                      size="sm"
                      onClick={() => setConnectDialogIntegration(integration)}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Connect {integration.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Connect Dialog */}
      <Dialog open={!!connectDialogIntegration} onOpenChange={() => setConnectDialogIntegration(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5">
              <span className="text-2xl">{connectDialogIntegration?.icon}</span>
              Connect {connectDialogIntegration?.name}
            </DialogTitle>
            <DialogDescription>
              This will allow AirLock to manage user access in your {connectDialogIntegration?.name} workspace.
              You&apos;ll be redirected to authorize the connection.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <div className="text-xs font-semibold mb-2">AirLock will be able to:</div>
              {connectDialogIntegration?.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConnectDialogIntegration(null)}>
              Cancel
            </Button>
            <Button onClick={handleConnect} disabled={connecting} className="gap-2">
              {connecting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4" />
                  Authorize & Connect
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disconnect Confirmation */}
      <AlertDialog open={!!disconnectIntegration} onOpenChange={() => setDisconnectIntegration(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Disconnect {disconnectIntegration?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              AirLock will no longer be able to manage access to {disconnectIntegration?.name}.
              Existing access will remain until manually removed. This action can be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Connected</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisconnect}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
