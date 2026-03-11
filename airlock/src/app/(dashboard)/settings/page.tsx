"use client";

import { useState } from "react";
import { getSession, AirlockSession } from "@/lib/session";
import { DashboardHeader } from "@/components/dashboard/header";
import {
  CreditCard,
  Key,
  Save,
  Plus,
  Copy,
  Eye,
  EyeOff,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const API_KEYS: { id: string; name: string; key: string; created: string; lastUsed: string }[] = [];

export default function SettingsPage() {
  const [session] = useState<AirlockSession | null>(() => {
    if (typeof window === "undefined") return null;
    return getSession();
  });
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);

  function copyKey(id: string, key: string) {
    navigator.clipboard.writeText(key);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <>
      <DashboardHeader
        title="Settings"
        description="Manage your organization, team, billing, and security preferences"
      />

      <div className="flex-1 p-6">
        <Tabs defaultValue="organization" className="space-y-4">
          <TabsList>
            <TabsTrigger value="organization">Organization</TabsTrigger>
            <TabsTrigger value="team">Team & Admins</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="security">Security & API</TabsTrigger>
          </TabsList>

          {/* Organization */}
          <TabsContent value="organization" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Organization Profile</CardTitle>
                <CardDescription>Basic information about your organization.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Organization Name</Label>
                    <Input defaultValue={session?.orgName ?? ""} placeholder="Your organization name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Organization Slug</Label>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-3 h-9 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">
                        airlock.app/
                      </span>
                      <Input className="rounded-l-none" defaultValue={session?.orgName?.toLowerCase().replace(/[^a-z0-9]/g, "-") ?? ""} placeholder="your-org" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea
                    defaultValue="We build developer tools for modern engineering teams."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Industry</Label>
                    <Select defaultValue="software">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="software">Software / SaaS</SelectItem>
                        <SelectItem value="fintech">Fintech</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="ecommerce">E-Commerce</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Company Size</Label>
                    <Select defaultValue="51-200">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1–10</SelectItem>
                        <SelectItem value="11-50">11–50</SelectItem>
                        <SelectItem value="51-200">51–200</SelectItem>
                        <SelectItem value="201-500">201–500</SelectItem>
                        <SelectItem value="500+">500+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border pt-4">
                <Button className="gap-2 ml-auto" size="sm">
                  <Save className="h-3.5 w-3.5" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notifications</CardTitle>
                <CardDescription>Configure when AirLock sends alerts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Member invited", description: "When someone is invited to the org", defaultChecked: true },
                  { label: "Member removed", description: "When someone is removed", defaultChecked: true },
                  { label: "Integration disconnected", description: "When an integration is disconnected", defaultChecked: true },
                  { label: "Time-limited access expiring", description: "24 hours before a grant expires", defaultChecked: true },
                  { label: "Suspicious login detected", description: "Login from unrecognized IP", defaultChecked: true },
                  { label: "Bulk access changes", description: "When 5+ members are changed at once", defaultChecked: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                    <Switch defaultChecked={item.defaultChecked} />
                  </div>
                ))}
              </CardContent>
              <CardFooter className="border-t border-border pt-4">
                <Button className="gap-2 ml-auto" size="sm">
                  <Save className="h-3.5 w-3.5" />
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Team & Admins */}
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">Admins</CardTitle>
                  <CardDescription>People who can manage AirLock settings and members.</CardDescription>
                </div>
                <Button size="sm" className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  Invite Admin
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {session ? (
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="text-xs">
                                {session.name.split(" ").map((n: string) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">{session.name}</div>
                              <div className="text-xs text-muted-foreground">{session.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className="text-xs">Owner</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">Just now</TableCell>
                        <TableCell className="text-right" />
                      </TableRow>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-6">
                          Loading...
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing */}
          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Current Plan</div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">Starter</span>
                      <Badge variant="secondary">Free</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Free forever · Up to 10 members</div>
                  </div>
                  <Button variant="outline" size="sm">Manage Plan</Button>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { label: "Members Used", value: "0 / 10" },
                    { label: "Integrations", value: "0 / 8" },
                    { label: "Next Billing", value: "—" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="text-lg font-semibold">{s.value}</div>
                      <div className="text-xs text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-dashed border-border text-muted-foreground">
                  <CreditCard className="h-5 w-5 shrink-0" />
                  <div className="text-sm">No payment method on file — upgrade to add one.</div>
                  <Button variant="outline" size="sm" className="ml-auto text-xs shrink-0">
                    Upgrade Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security & API */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Security Settings</CardTitle>
                <CardDescription>Control authentication policies for your organization.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    label: "Require 2FA for all admins",
                    description: "Admins must have 2FA enabled to access AirLock",
                    defaultChecked: true,
                  },
                  {
                    label: "SSO / SAML",
                    description: "Enforce Single Sign-On using your identity provider",
                    defaultChecked: false,
                  },
                  {
                    label: "IP allowlist",
                    description: "Restrict admin access to specific IP ranges",
                    defaultChecked: false,
                  },
                  {
                    label: "Session timeout (24h)",
                    description: "Automatically sign out inactive sessions after 24 hours",
                    defaultChecked: true,
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                    <Switch defaultChecked={item.defaultChecked} />
                  </div>
                ))}
              </CardContent>
              <CardFooter className="border-t border-border pt-4">
                <Button size="sm" className="gap-2 ml-auto">
                  <Save className="h-3.5 w-3.5" />
                  Save
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">API Keys</CardTitle>
                  <CardDescription>Keys for programmatic access to the AirLock API.</CardDescription>
                </div>
                <Button size="sm" className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  New Key
                </Button>
              </CardHeader>
              <CardContent>
                {API_KEYS.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <Key className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No API keys yet.</p>
                    <p className="text-xs mt-1 opacity-70">Create a key to access the AirLock API programmatically.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {API_KEYS.map((k) => (
                      <div key={k.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                        <Key className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium">{k.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <code className="text-xs font-mono text-muted-foreground">
                              {showKey[k.id] ? k.key : k.key.replace(/[^.]/g, "•").slice(0, 18) + "..."}
                            </code>
                            <button
                              onClick={() => setShowKey((s) => ({ ...s, [k.id]: !s[k.id] }))}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showKey[k.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </button>
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            Created {k.created} · Last used {k.lastUsed}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => copyKey(k.id, k.key)}
                          >
                            {copied === k.id ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-destructive/30 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
                <CardDescription>These actions are irreversible.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-destructive/20">
                  <div>
                    <div className="text-sm font-medium">Delete Organization</div>
                    <div className="text-xs text-muted-foreground">
                      Permanently delete this organization and revoke all access.
                    </div>
                  </div>
                  <Button variant="destructive" size="sm">
                    Delete Org
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
