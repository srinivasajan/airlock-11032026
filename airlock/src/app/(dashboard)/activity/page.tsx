"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import {
  Download,
  Search,
  UserPlus,
  UserMinus,
  Settings,
  Shield,
  Link,
  Unlink,
  Key,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { getInitials, formatRelativeTime } from "@/lib/utils";

type ActivityType =
  | "member_invited"
  | "member_removed"
  | "integration_connected"
  | "integration_disconnected"
  | "access_granted"
  | "access_revoked"
  | "policy_created"
  | "permission_changed"
  | "login"
  | "settings_changed";

type Activity = {
  id: string;
  type: ActivityType;
  actor: string;
  actorEmail: string;
  target: string;
  description: string;
  timestamp: Date;
  integration?: string;
  ipAddress?: string;
};

const ACTIVITY_LOG: Activity[] = [];

const ACTIVITY_CONFIG: Record<
  ActivityType,
  { icon: React.ElementType; label: string; variant: "default" | "success" | "destructive" | "warning" | "info" | "secondary" | "outline" }
> = {
  member_invited: { icon: UserPlus, label: "Member Invited", variant: "success" },
  member_removed: { icon: UserMinus, label: "Member Removed", variant: "destructive" },
  integration_connected: { icon: Link, label: "Integration Connected", variant: "success" },
  integration_disconnected: { icon: Unlink, label: "Integration Disconnected", variant: "warning" },
  access_granted: { icon: Key, label: "Access Granted", variant: "info" },
  access_revoked: { icon: Shield, label: "Access Revoked", variant: "warning" },
  policy_created: { icon: Shield, label: "Policy Created", variant: "default" },
  permission_changed: { icon: Settings, label: "Permission Changed", variant: "secondary" },
  login: { icon: Eye, label: "Login", variant: "secondary" },
  settings_changed: { icon: Settings, label: "Settings Changed", variant: "secondary" },
};

export default function ActivityLogPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = ACTIVITY_LOG.filter((a) => {
    const matchesSearch =
      search === "" ||
      a.actor.toLowerCase().includes(search.toLowerCase()) ||
      a.target.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || a.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <>
      <DashboardHeader
        title="Activity Log"
        description="Full audit trail of all actions in your organization"
        actions={
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      <div className="flex-1 p-6 space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by actor, target, or description..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="member_invited">Member Invited</SelectItem>
              <SelectItem value="member_removed">Member Removed</SelectItem>
              <SelectItem value="access_granted">Access Granted</SelectItem>
              <SelectItem value="access_revoked">Access Revoked</SelectItem>
              <SelectItem value="integration_connected">Integration Connected</SelectItem>
              <SelectItem value="integration_disconnected">Integration Disconnected</SelectItem>
              <SelectItem value="policy_created">Policy Created</SelectItem>
              <SelectItem value="permission_changed">Permission Changed</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="settings_changed">Settings Changed</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-xs text-muted-foreground ml-auto">
            {filtered.length} event{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Log Table */}
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[200px]">Actor</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Integration</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                    No events match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((activity) => {
                  const config = ACTIVITY_CONFIG[activity.type];
                  const Icon = config.icon;
                  return (
                    <TableRow key={activity.id} className="hover:bg-muted/20">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[10px]">
                              {activity.actor === "Auto-Expiry"
                                ? "SYS"
                                : getInitials(activity.actor)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-xs font-medium">{activity.actor}</div>
                            <div className="text-[10px] text-muted-foreground">{activity.actorEmail}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={config.variant} className="gap-1 text-[10px] px-1.5">
                            <Icon className="h-2.5 w-2.5" />
                            {config.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs">{activity.target}</span>
                      </TableCell>
                      <TableCell>
                        {activity.integration ? (
                          <span className="text-xs text-muted-foreground">{activity.integration}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground/40">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-mono text-muted-foreground">
                          {activity.ipAddress ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(activity.timestamp)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
