"use client";

import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserTimezone, formatLocalTime } from "@/app/lib/timezone";

interface ScheduleTimePickerProps {
  onSchedule: (dateTime: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
  defaultTime?: string;
  isRescheduling?: boolean;
}

export function ScheduleTimePicker({
  onSchedule,
  onCancel,
  isLoading = false,
  defaultTime,
  isRescheduling = false,
}: ScheduleTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });

  const [selectedTime, setSelectedTime] = useState(defaultTime || "09:00");
  const [userTimezone] = useState(() => getUserTimezone());

  const handleSchedule = () => {
    const dateTime = `${selectedDate}T${selectedTime}`;
    onSchedule(dateTime);
  };

  const getQuickTimeOptions = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return [
      {
        label: "Tomorrow, 8:00 AM",
        date: tomorrow.toISOString().split("T")[0],
        time: "08:00",
      },
      {
        label: "Tomorrow, 9:00 AM",
        date: tomorrow.toISOString().split("T")[0],
        time: "09:00",
      },
      {
        label: "Tomorrow, 12:00 PM",
        date: tomorrow.toISOString().split("T")[0],
        time: "12:00",
      },
      {
        label: "Tomorrow, 3:00 PM",
        date: tomorrow.toISOString().split("T")[0],
        time: "15:00",
      },
      {
        label: "Tomorrow, 5:00 PM",
        date: tomorrow.toISOString().split("T")[0],
        time: "17:00",
      },
      {
        label: "Tomorrow, 6:00 PM",
        date: tomorrow.toISOString().split("T")[0],
        time: "18:00",
      },
    ];
  };

  const handleQuickSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const getPreviewDateTime = () => {
    const dateTime = new Date(`${selectedDate}T${selectedTime}`);
    return formatLocalTime(dateTime, userTimezone);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <span>{isRescheduling ? "Reschedule Post" : "Schedule Post"}</span>
        </CardTitle>
        <CardDescription>
          {isRescheduling
            ? "Choose a new time to publish your post"
            : "Choose when you want your post to be published"}
        </CardDescription>
        <div className="text-xs text-gray-500 mt-1">
          Your timezone: {userTimezone}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Time Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Schedule
          </label>
          <div className="grid grid-cols-3 gap-2">
            {getQuickTimeOptions().map((option, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickSelect(option.date, option.time)}
                className="text-xs h-auto py-2 px-2"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Schedule
          </label>

          {/* Date Picker */}
          <div className="mb-3">
            <label className="block text-xs text-gray-600 mb-1">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {/* Time Picker */}
          <div className="mb-4">
            <label className="block text-xs text-gray-600 mb-1">Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600">
              <strong>Scheduled for:</strong>
            </p>
            <p className="text-sm font-medium text-gray-900">
              {getPreviewDateTime()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={handleSchedule}
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                {isRescheduling ? "Rescheduling..." : "Scheduling..."}
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 mr-2" />
                {isRescheduling ? "Reschedule Post" : "Schedule Post"}
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
