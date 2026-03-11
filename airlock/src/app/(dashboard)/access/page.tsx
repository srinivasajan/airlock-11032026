"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import {
  Plus,
  Shield,
  Clock,
  Users,
  Unlock,
  Trash2,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type Policy = {
  id: string;
  name: string;
  description: string;
  role: string;
  integrations: string[];
  members: number;
  isDefault: boolean;
};

type TimeLimitedGrant = {
  id: string;
  member: string;
  email: string;
  integration: string;
  role: string;
  expires: string;
  hoursLeft: number;
  grantedBy: string;
};

const POLICIES: Policy[] = [];

const TIME_LIMITED: TimeLimitedGrant[] = [];

const INTEGRATIONS_LIST = ["GitHub", "Slack", "Google Workspace", "Notion", "AWS", "Linear", "Figma", "Jira"];

export default function AccessControlPage() {
  const [policies, setPolicies] = useState<Policy[]>(POLICIES);
  const [grants, setGrants] = useState<TimeLimitedGrant[]>(TIME_LIMITED);
  const [grantDialogOpen, setGrantDialogOpen] = useState(false);
  const [policyDialogOpen, setPolicyDialogOpen] = useState(false);

  function revokeGrant(id: string) {
    setGrants((prev) => prev.filter((g) => g.id !== id));
  }

  return (
    <>
      <DashboardHeader
        title="Access Control"
        description="Manage policies, roles, and time-limited access grants"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setGrantDialogOpen(true)}>
              <Clock className="h-4 w-4" />
              Time-Limited Grant
            </Button>
            <Button size="sm" className="gap-1.5" onClick={() => setPolicyDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              New Policy
            </Button>
          </div>
        }
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Active Policies", value: policies.length, icon: Shield, color: "text-indigo-500", bg: "bg-indigo-500/10" },
            { label: "Time-Limited Grants", value: grants.length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
            { label: "Members Covered", value: "0", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Expiring Today", value: grants.filter((g) => g.hoursLeft <= 12).length, icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" },
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

        <Tabs defaultValue="policies">
          <TabsList>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="time-limited">
              Time-Limited
              {grants.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-[10px]">
                  {grants.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Policies Tab */}
          <TabsContent value="policies" className="mt-4 space-y-3">
            {policies.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Shield className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">No access policies yet</p>
                <p className="text-xs mt-1 text-muted-foreground/70">Create a policy to define which integrations each role can access.</p>
                <button
                  onClick={() => setPolicyDialogOpen(true)}
                  className="mt-4 text-xs text-primary hover:underline font-medium"
                >
                  Create your first policy →
                </button>
              </div>
            ) : (
              policies.map((policy) => (
              <div
                key={policy.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-border/80 transition-colors"
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm">{policy.name}</span>
                    {policy.isDefault && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Default</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{policy.description}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {policy.integrations.slice(0, 3).map((int) => (
                    <Badge key={int} variant="outline" className="text-[10px] px-1.5">
                      {int}
                    </Badge>
                  ))}
                  {policy.integrations.length > 3 && (
                    <Badge variant="outline" className="text-[10px] px-1.5">
                      +{policy.integrations.length - 3}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 w-28">
                  <Users className="h-3 w-3" />
                  {policy.members} members
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Settings className="h-3.5 w-3.5" />
                  </Button>
                  {!policy.isDefault && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => setPolicies((prev) => prev.filter((p) => p.id !== policy.id))}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            )))}
          </TabsContent>
          <TabsContent value="time-limited" className="mt-4">
            {grants.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Clock className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No active time-limited grants.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>Member</TableHead>
                      <TableHead>Integration</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Granted By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grants.map((grant) => (
                      <TableRow key={grant.id}>
                        <TableCell>
                          <div className="font-medium text-sm">{grant.member}</div>
                          <div className="text-xs text-muted-foreground">{grant.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{grant.integration}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{grant.role}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-medium ${
                                grant.hoursLeft <= 12
                                  ? "text-destructive"
                                  : grant.hoursLeft <= 24
                                  ? "text-amber-500"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {grant.expires}
                            </span>
                            {grant.hoursLeft <= 12 && (
                              <AlertTriangle className="h-3 w-3 text-destructive" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{grant.grantedBy}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-destructive hover:text-destructive gap-1"
                            onClick={() => revokeGrant(grant.id)}
                          >
                            <Unlock className="h-3 w-3" />
                            Revoke
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Time-Limited Grant Dialog */}
      <Dialog open={grantDialogOpen} onOpenChange={setGrantDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Time-Limited Grant</DialogTitle>
            <DialogDescription>
              Grant temporary access to an integration that automatically expires.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Member</Label>
              <Input placeholder="Search member by name or email..." />
            </div>
            <div className="space-y-1.5">
              <Label>Integration</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select integration" />
                </SelectTrigger>
                <SelectContent>
                  {INTEGRATIONS_LIST.map((i) => (
                    <SelectItem key={i} value={i.toLowerCase().replace(" ", "-")}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Role / Permission Level</Label>
              <Input placeholder="e.g. Read-only, Developer, Admin" />
            </div>
            <div className="space-y-1.5">
              <Label>Expires</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="4h">4 hours</SelectItem>
                  <SelectItem value="1d">1 day</SelectItem>
                  <SelectItem value="3d">3 days</SelectItem>
                  <SelectItem value="1w">1 week</SelectItem>
                  <SelectItem value="custom">Custom date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setGrantDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setGrantDialogOpen(false)} className="gap-2">
              <Clock className="h-4 w-4" />
              Create Grant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Policy Dialog */}
      <Dialog open={policyDialogOpen} onOpenChange={setPolicyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Access Policy</DialogTitle>
            <DialogDescription>
              Define which integrations a role gets access to. This policy will apply automatically to all members with that role.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Policy Name</Label>
              <Input placeholder="e.g. Engineering Full Access" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input placeholder="Describe what this policy grants..." />
            </div>
            <div className="space-y-1.5">
              <Label>Applies to Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Integrations to grant access</Label>
              {INTEGRATIONS_LIST.map((int) => (
                <div key={int} className="flex items-center justify-between py-1">
                  <span className="text-sm">{int}</span>
                  <Switch />
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPolicyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setPolicyDialogOpen(false)} className="gap-2">
              <Shield className="h-4 w-4" />
              Create Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
