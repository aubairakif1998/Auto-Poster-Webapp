"use client";

import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";

interface UserPreferences {
  preferredPostingTime: string;
  contentTone: string;
}

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferredPostingTime: "9am",
    contentTone: "professional",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch("/api/user-preferences");
      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const response = await fetch("/api/user-preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreferenceChange = (
    key: keyof UserPreferences,
    value: string
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>LinkedIn Connection</CardTitle>
            <CardDescription>
              Manage your LinkedIn account connection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-500">CEO at TechCorp</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700">Connected</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Posting Preferences</CardTitle>
            <CardDescription>
              Configure your default posting settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Posting Time
              </label>
              <Select
                value={preferences.preferredPostingTime}
                onValueChange={(value) =>
                  handlePreferenceChange("preferredPostingTime", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8am">8:00 AM</SelectItem>
                  <SelectItem value="9am">9:00 AM</SelectItem>
                  <SelectItem value="10am">10:00 AM</SelectItem>
                  <SelectItem value="11am">11:00 AM</SelectItem>
                  <SelectItem value="12pm">12:00 PM</SelectItem>
                  <SelectItem value="1pm">1:00 PM</SelectItem>
                  <SelectItem value="2pm">2:00 PM</SelectItem>
                  <SelectItem value="3pm">3:00 PM</SelectItem>
                  <SelectItem value="4pm">4:00 PM</SelectItem>
                  <SelectItem value="5pm">5:00 PM</SelectItem>
                  <SelectItem value="6pm">6:00 PM</SelectItem>
                  <SelectItem value="7pm">7:00 PM</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                This time will be used as the default when scheduling posts
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Tone
              </label>
              <Select
                value={preferences.contentTone}
                onValueChange={(value) =>
                  handlePreferenceChange("contentTone", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="thought-leader">Thought Leader</SelectItem>
                  <SelectItem value="storytelling">Storytelling</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button
                onClick={savePreferences}
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  "Save Preferences"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
