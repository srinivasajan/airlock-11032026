"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import {
  Search,
  UserPlus,
  Upload,
  MoreHorizontal,
  Shield,
  Trash2,
  Mail,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Separator } from "@/components/ui/separator";
import { cn, getInitials, formatDate } from "@/lib/utils";

type Member = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "invited" | "suspended";
  integrations: string[];
  joinedAt: Date;
  lastActive: Date;
};

const INTEGRATIONS = ["GitHub", "Slack", "Google Workspace", "Notion", "Figma"];
const ROLES = ["Admin", "Developer", "Designer", "Marketing", "Operations", "Finance", "HR"];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [inviteEmails, setInviteEmails] = useState("");
  const [inviteRole, setInviteRole] = useState("Developer");
  const [inviteIntegrations, setInviteIntegrations] = useState<string[]>(["Slack"]);

  const filtered = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const allSelected = filtered.length > 0 && filtered.every((m) => selected.includes(m.id));
  const someSelected = selected.length > 0;

  function toggleAll() {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(filtered.map((m) => m.id));
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleRemoveSelected() {
    setMembers((prev) => prev.filter((m) => !selected.includes(m.id)));
    setSelected([]);
    setRemoveDialogOpen(false);
  }

  function handleInvite() {
    const emails = inviteEmails.split(/[\n,;]/).map((e) => e.trim()).filter(Boolean);
    const newMembers: Member[] = emails.map((email, i) => ({
      id: `new-${Date.now()}-${i}`,
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role: inviteRole,
      status: "invited" as const,
      integrations: inviteIntegrations,
      joinedAt: new Date(),
      lastActive: new Date(),
    }));
    setMembers((prev) => [...prev, ...newMembers]);
    setInviteOpen(false);
    setInviteEmails("");
  }

  const activeCount = members.filter((m) => m.status === "active").length;
  const invitedCount = members.filter((m) => m.status === "invited").length;

  return (
    <>
      <DashboardHeader
        title="Members"
        description={`${members.length} total members`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Upload className="h-4 w-4" />
              Bulk Import
            </Button>
            <Button size="sm" className="gap-1.5" onClick={() => setInviteOpen(true)}>
              <UserPlus className="h-4 w-4" />
              Invite Members
            </Button>
          </div>
        }
      />

      <div className="flex-1 p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Active", value: activeCount, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Invited", value: invitedCount, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
            { label: "Suspended", value: members.filter((m) => m.status === "suspended").length, icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
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

        {/* Filters & Bulk Actions */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-8 h-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="invited">Invited</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {someSelected && (
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5">
              <span className="text-xs font-medium text-primary">{selected.length} selected</span>
              <Separator orientation="vertical" className="h-4" />
              <Button variant="ghost" size="sm" className="h-6 text-xs px-2 gap-1 text-primary hover:text-primary">
                <Shield className="h-3 w-3" />
                Edit Access
              </Button>
              <Button variant="ghost" size="sm" className="h-6 text-xs px-2 gap-1 text-destructive hover:text-destructive" onClick={() => setRemoveDialogOpen(true)}>
                <Trash2 className="h-3 w-3" />
                Remove
              </Button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Integrations</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((member) => (
                <TableRow key={member.id} className={cn(selected.includes(member.id) && "bg-primary/5")}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(member.id)}
                      onCheckedChange={() => toggleOne(member.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{member.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        member.status === "active" ? "success" :
                        member.status === "invited" ? "warning" :
                        "destructive"
                      }
                      className="text-xs capitalize"
                    >
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {member.integrations.length > 0 ? (
                      <div className="flex items-center gap-1 flex-wrap">
                        {member.integrations.slice(0, 3).map((int) => (
                          <span key={int} className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                            {int}
                          </span>
                        ))}
                        {member.integrations.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{member.integrations.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">None yet</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">{formatDate(member.joinedAt)}</span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2">
                          <Shield className="h-3.5 w-3.5" /> Manage Access
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Mail className="h-3.5 w-3.5" /> Resend Invite
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <RefreshCw className="h-3.5 w-3.5" /> Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Trash2 className="h-3.5 w-3.5" /> Remove Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                    <Users className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-medium">
                      {search || statusFilter !== "all" ? "No members match your filters" : "No members yet"}
                    </p>
                    <p className="text-xs mt-1 text-muted-foreground/70">
                      {search || statusFilter !== "all"
                        ? "Try adjusting your search or filters."
                        : "Invite your team to get started. Add them individually or upload a CSV."}
                    </p>
                    {!search && statusFilter === "all" && (
                      <button
                        onClick={() => setInviteOpen(true)}
                        className="mt-4 text-xs text-primary hover:underline font-medium"
                      >
                        Invite your first member →
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Team Members</DialogTitle>
            <DialogDescription>
              Add members to your organization. They&apos;ll get access to the selected integrations.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="invite-emails">Email Addresses</Label>
              <Textarea
                id="invite-emails"
                placeholder="Enter one or more email addresses, separated by commas or new lines&#10;&#10;e.g.&#10;alice@company.com&#10;bob@company.com, charlie@company.com"
                rows={4}
                value={inviteEmails}
                onChange={(e) => setInviteEmails(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Separate emails with comma, semicolon, or new line</p>
            </div>

            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Grant Access To</Label>
              <div className="space-y-2">
                {INTEGRATIONS.map((int) => (
                  <div key={int} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <span className="text-sm">{int}</span>
                    <Switch
                      checked={inviteIntegrations.includes(int)}
                      onCheckedChange={(checked) =>
                        setInviteIntegrations((prev) =>
                          checked ? [...prev, int] : prev.filter((i) => i !== int)
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={handleInvite} disabled={!inviteEmails.trim()}>
              <UserPlus className="h-4 w-4" />
              Send Invites
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation */}
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {selected.length} member{selected.length > 1 ? "s" : ""}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove their access to all connected integrations and revoke their membership.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveSelected}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Remove {selected.length} member{selected.length > 1 ? "s" : ""}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
