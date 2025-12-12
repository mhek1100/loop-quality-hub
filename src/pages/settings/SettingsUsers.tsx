import Users from "@/pages/Users";

// Re-export Users component for settings context
export default function SettingsUsers() {
  return <Users showHeader={false} />;
}
