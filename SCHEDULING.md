# Post Scheduling Implementation

This document describes the post scheduling functionality implemented in the SaaS Auto Poster application.

## Overview

The scheduling system allows users to schedule posts for automatic publication at their preferred times. The system uses:

- **User Preferences**: Stored in the `user_preferences` table
- **Scheduled Posts**: Stored in the `scheduled_posts` table
- **Background Processing**: Vercel Cron Jobs for automatic publication
- **Custom Time Selection**: Advanced date/time picker for precise scheduling

## Database Schema

### User Preferences Table

```sql
CREATE TABLE user_preferences (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) UNIQUE,
  preferred_posting_time TEXT DEFAULT '9am',
  content_tone TEXT DEFAULT 'professional',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);
```

### Scheduled Posts Table

```sql
CREATE TABLE scheduled_posts (
  id TEXT PRIMARY KEY,
  post_id TEXT REFERENCES posts(id),
  user_id TEXT REFERENCES users(id),
  schedule_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);
```

## API Endpoints

### User Preferences

- `GET /api/user-preferences` - Get user preferences
- `PUT /api/user-preferences` - Update user preferences

### Post Scheduling

- `POST /api/posts/schedule` - Schedule a post (supports custom time)
- `GET /api/posts/schedule` - Get all scheduled posts for user

### Cron Job

- `GET /api/cron/process-scheduled-posts` - Process scheduled posts (called by Vercel Cron)

## Scheduling Logic

### Preferred Posting Times

Users can choose from:

- 8:00 AM (`8am`)
- 9:00 AM (`9am`)
- 10:00 AM (`10am`)
- 11:00 AM (`11am`)
- 12:00 PM (`12pm`)
- 1:00 PM (`1pm`)
- 2:00 PM (`2pm`)
- 3:00 PM (`3pm`)
- 4:00 PM (`4pm`)
- 5:00 PM (`5pm`)
- 6:00 PM (`6pm`)
- 7:00 PM (`7pm`)

### Schedule Calculation

When a user schedules a post:

1. **Custom Time**: If a custom time is provided, use that exact date/time
2. **Default Time**: Get user's preferred posting time from preferences
3. **Next Occurrence**: Calculate the next occurrence of that time
4. **Future Date**: If the time has already passed today, schedule for tomorrow
5. **Create Entry**: Create a scheduled post entry with the calculated time

### Background Processing

The cron job runs every minute and:

1. Finds all scheduled posts where `schedule_time <= now` and `is_published = false`
2. Updates the scheduled post as published
3. Updates the main post status to "published"
4. Logs the successful publication

## User Interface Components

### ScheduleTimePicker Component

A comprehensive date/time selection component that provides:

- **Quick Schedule Options**: Pre-defined times for tomorrow (8 AM, 9 AM, 12 PM, 3 PM, 5 PM, 6 PM)
- **Custom Date Picker**: HTML5 date input with calendar icon
- **Custom Time Picker**: HTML5 time input with clock icon
- **Live Preview**: Shows the selected date/time in a user-friendly format
- **Validation**: Ensures selected time is in the future

### Settings Page

- Users can set their preferred posting time from 12 available options
- Changes are saved to the database immediately
- Provides helpful description of how the preference is used

### Schedule Page

- Shows all scheduled posts with formatted dates
- Displays relative time (Today, Tomorrow, specific date)
- Shows publication status (Scheduled/Published)
- Allows viewing and editing scheduled posts

## Usage Flow

1. **Set Preferences**: User goes to `/settings` and sets preferred posting time
2. **Create Post**: User creates content using the AI generator
3. **Schedule Post**: User clicks "Schedule Post" button
4. **Select Time**: User chooses from quick options or custom date/time
5. **Confirm Schedule**: User confirms the schedule time
6. **Automatic Processing**: Cron job processes scheduled posts every minute
7. **Publication**: Posts are automatically published at the scheduled time

## API Request Examples

### Schedule a Post with Custom Time

```javascript
POST /api/posts/schedule
{
  "postId": "post_123",
  "customTime": "2024-01-15T14:30:00"
}
```

### Schedule a Post with Default Time

```javascript
POST /api/posts/schedule
{
  "postId": "post_123"
}
```

### Update User Preferences

```javascript
PUT /api/user-preferences
{
  "preferredPostingTime": "3pm",
  "contentTone": "professional"
}
```

## Environment Variables

Add to your `.env.local`:

```
CRON_SECRET=your-secret-key-here
```

This secret is used to authenticate cron job requests.

## Vercel Configuration

The `vercel.json` file configures the cron job to run every minute:

```json
{
  "crons": [
    {
      "path": "/api/cron/process-scheduled-posts",
      "schedule": "* * * * *"
    }
  ]
}
```

## Security

- Cron job endpoint is protected with `CRON_SECRET` environment variable
- All API endpoints require user authentication via Clerk
- Users can only access their own posts and preferences
- Date/time validation ensures posts can only be scheduled in the future

## Monitoring

The cron job logs:

- Number of posts found for processing
- Successfully published posts with content preview
- Any errors during processing

Check Vercel function logs to monitor the cron job execution.

## Testing

To test the scheduling functionality:

1. **Create a post** and schedule it for a few minutes in the future
2. **Check the schedule page** to see the scheduled post
3. **Wait for the scheduled time** and check if the post status changes to "published"
4. **Verify the cron job logs** in Vercel dashboard

## Future Enhancements

- **Recurring Posts**: Schedule posts to repeat daily, weekly, or monthly
- **Time Zone Support**: Allow users to set their timezone
- **Bulk Scheduling**: Schedule multiple posts at once
- **Analytics**: Track best posting times based on engagement
- **Queue Management**: Allow users to reorder or cancel scheduled posts
