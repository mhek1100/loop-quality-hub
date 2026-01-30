import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Monitor, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const devices = [
  {
    id: 1,
    name: "Chrome on macOS on macOS 14.0",
    lastActive: "01/30/2026, 07:55 PM",
    location: "Sydney, Australia",
    isCurrent: true,
  },
  {
    id: 2,
    name: "Safari on iPhone on iOS 17.0",
    lastActive: "01/30/2026, 06:55 PM",
    location: "Melbourne, Australia",
    isCurrent: false,
  },
  {
    id: 3,
    name: "Firefox on Windows on Windows 11",
    lastActive: "01/29/2026, 07:55 PM",
    location: "Brisbane, Australia",
    isCurrent: false,
  },
];

export default function SettingsSecurity() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdatePassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const handleSignOut = (deviceId: number) => {
    toast({
      title: "Device signed out",
      description: "The device has been signed out successfully.",
    });
  };

  const handleLogoutAll = () => {
    toast({
      title: "All sessions ended",
      description: "You have been logged out of all browser sessions.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Password Update Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Password update</h2>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter your current password"
                  value={passwords.current}
                  onChange={(e) => handlePasswordChange("current", e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={passwords.new}
                  onChange={(e) => handlePasswordChange("new", e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={passwords.confirm}
                  onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button onClick={handleUpdatePassword}>Update password</Button>
              <Button variant="link" className="text-primary">
                Forgot password?
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Login Alerts Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Login alerts</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Login Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when someone logs into your account
                </p>
              </div>
              <Switch checked={loginAlerts} onCheckedChange={setLoginAlerts} />
            </div>

            {/* Browsers and devices */}
            <div className="mt-6 space-y-4">
              <h3 className="font-medium">Browsers and devices</h3>
              <div className="space-y-3">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between py-3 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <Monitor className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{device.name}</span>
                          {device.isCurrent && (
                            <span className="text-xs text-green-600 font-medium">
                              • This device
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Last active: {device.lastActive} ({device.location})
                        </p>
                      </div>
                    </div>
                    {!device.isCurrent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSignOut(device.id)}
                      >
                        Sign out
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                variant="link"
                className="text-destructive p-0 h-auto"
                onClick={handleLogoutAll}
              >
                Log out all browser sessions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
