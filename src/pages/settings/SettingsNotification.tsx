import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  email: boolean;
  inApp: boolean;
  teams: boolean;
}

const defaultNotifications: NotificationSetting[] = [
  {
    id: "missed_calls",
    label: "Missed calls",
    description: "Please select the time of day you would like to receive the summary reports",
    enabled: false,
    email: false,
    inApp: false,
    teams: false,
  },
  {
    id: "failed_calls",
    label: "Failed Calls",
    description: "Please select the time of day you would like to receive the summary reports",
    enabled: true,
    email: true,
    inApp: true,
    teams: false,
  },
  {
    id: "answered_calls",
    label: "Answered Calls",
    description: "Choose the time frame during which you prefer to receive updates on answered calls",
    enabled: true,
    email: true,
    inApp: false,
    teams: false,
  },
  {
    id: "qualified_calls",
    label: "Qualified Calls",
    description: "You will",
    enabled: true,
    email: false,
    inApp: true,
    teams: false,
  },
  {
    id: "new_voicemails",
    label: "New voicemails",
    description: "Please select the time of day you would like to receive the summary reports",
    enabled: true,
    email: false,
    inApp: true,
    teams: false,
  },
  {
    id: "new_voicemails_2",
    label: "New voicemails",
    description: "Please select the time of day you would like to receive the summary reports",
    enabled: true,
    email: true,
    inApp: true,
    teams: false,
  },
  {
    id: "new_messages",
    label: "New messages",
    description: "Please select the time of day you would like to receive the summary reports",
    enabled: true,
    email: false,
    inApp: true,
    teams: false,
  },
];

export default function SettingsNotification() {
  const [notifications, setNotifications] = useState<NotificationSetting[]>(defaultNotifications);

  const handleToggle = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

  const handleCheckbox = (id: string, field: "email" | "inApp" | "teams") => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, [field]: !n[field] } : n))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <div className="flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <span className="w-16 text-center">Email</span>
          <span className="w-16 text-center">In app</span>
          <span className="w-16 text-center">Teams</span>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 divide-y">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-4">
                <Switch
                  checked={notification.enabled}
                  onCheckedChange={() => handleToggle(notification.id)}
                />
                <div>
                  <p className="font-medium">{notification.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="w-16 flex justify-center">
                  <Checkbox
                    checked={notification.email}
                    onCheckedChange={() => handleCheckbox(notification.id, "email")}
                  />
                </div>
                <div className="w-16 flex justify-center">
                  <Checkbox
                    checked={notification.inApp}
                    onCheckedChange={() => handleCheckbox(notification.id, "inApp")}
                  />
                </div>
                <div className="w-16 flex justify-center">
                  <Checkbox
                    checked={notification.teams}
                    onCheckedChange={() => handleCheckbox(notification.id, "teams")}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
