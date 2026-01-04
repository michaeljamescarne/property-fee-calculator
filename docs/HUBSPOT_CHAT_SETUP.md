# HubSpot Live Chat Setup Guide

## ✅ What's Already Done

The HubSpot tracking code is already installed and configured in your Next.js application:

- **Component**: `components/analytics/HubSpotTracking.tsx`
- **Location**: Loaded in `app/[locale]/layout.tsx` (before `</body>` tag)
- **HubSpot ID**: `442487843` (configured via `NEXT_PUBLIC_HUBSPOT_ID`)
- **Status**: ✅ Tracking code is active and will automatically load the chat widget once configured

## 📋 What You Need to Do in HubSpot

Follow these steps to configure the live chat channel in your HubSpot account:

### Step 1: Access HubSpot Inbox Settings

1. Log into your HubSpot account: https://app.hubspot.com
2. Click the **Settings** icon (⚙️) in the top navigation bar
3. In the left sidebar, navigate to **Inbox & Help Desk** → **Inboxes**
4. If you have multiple inboxes, use the **Current view** dropdown to select the inbox you want to connect

### Step 2: Connect Chat Channel

1. Click **Connect a channel**
2. Select **Chat**
3. Select **Web** (for website chat widget)
4. Click **Next**

### Step 3: Customize Chat Widget Appearance

1. **Color**: 
   - Default colors are based on your account branding
   - You can customize by selecting preset colors or entering a hex value
   - Or use the color picker

2. **Font**: 
   - Click the **Font** dropdown and select your preferred font
   - This affects the chat widget text

3. Click **Next**

### Step 4: Set Availability

Choose when your team should appear available:

- **Based on user availability**: Chat appears when at least one team member is available
- **Based on chat operating hours**: Set specific days and times
- **Chat is available 24/7**: Always show chat widget

Configure the availability behavior:
- **Available tab**: Set typical reply time message
- **Away tab**: Configure away message behavior
- **Outside working hours tab**: Set offline behavior (show return time, away message, or hide widget)

Click **Next**

### Step 5: Configure Welcome Message & Assignment

1. **Chat heading**: Select name and avatar to display
2. **Welcome message**: Enter the message visitors see when they open chat
3. **Assignment**: Toggle **Assign incoming conversations** ON
   - Choose routing: **Specific users and teams** or **Contact owner**
   - Select which users/teams should receive chats

4. **Pop open welcome message**: Optionally show welcome message as a prompt above the widget

5. Click **Next**

### Step 6: Preview & Publish

1. Preview how the chat widget will appear on different devices
2. Click **Publish**

**Note**: Since your website is already using the HubSpot tracking code, the chat widget will automatically appear once you publish the chat channel configuration. No additional code changes are needed!

## 🔍 Verifying the Chat Widget

### Method 1: Check Your Website

1. Visit your website: https://propertycosts.com.au
2. Look for the chat widget in the bottom-right (or bottom-left, depending on your settings)
3. The widget should appear automatically if:
   - Chat channel is published in HubSpot
   - Your team is available (or you've set it to 24/7)
   - The tracking code is loaded (check browser console)

### Method 2: Browser Developer Tools

1. Open your website in a browser
2. Open Developer Tools (F12 or Right-click → Inspect)
3. Go to the **Console** tab
4. Type: `window._hsq`
5. You should see an array (this confirms HubSpot is loaded)
6. Go to the **Network** tab
7. Filter by "hs-scripts" or "hubspot"
8. You should see requests to HubSpot's tracking scripts

### Method 3: Check HubSpot Dashboard

1. In HubSpot, go to **Conversations** → **Inbox**
2. You should see the chat channel listed
3. Test by opening your website and starting a chat
4. The conversation should appear in your HubSpot inbox

## 🎨 Customizing Chat Widget (After Setup)

Once the chat is working, you can further customize it:

1. In HubSpot, go to **Settings** → **Inbox & Help Desk** → **Inboxes**
2. Hover over the chat channel and click **Edit**
3. Customize:
   - **Display tab**: Colors, fonts, positioning (left/right)
   - **Availability tab**: Hours, away messages, offline behavior
   - **Triggers tab**: When to show chat (scroll, time on page, device type)
   - **Web chat tab**: Widget placement, movement settings

## 🐛 Troubleshooting

### Chat Widget Not Appearing

1. **Check HubSpot Configuration**:
   - Verify chat channel is published
   - Check availability settings (might be hidden if team is offline)
   - Ensure chat is set to 24/7 or current time is within operating hours

2. **Check Tracking Code**:
   - Verify `NEXT_PUBLIC_HUBSPOT_ID=442487843` is set in your environment
   - Check browser console for errors
   - Verify script loads: `document.getElementById('hs-script-loader')`

3. **Check Domain Settings**:
   - In HubSpot: **Settings** → **Tracking & Analytics** → **Tracking code**
   - Ensure your domain (`propertycosts.com.au`) is added to allowed domains

4. **Browser Issues**:
   - Try incognito/private mode (ad blockers can interfere)
   - Clear browser cache
   - Check if ad blocker is blocking HubSpot scripts

### Chat Widget Appears But Doesn't Work

1. **Check Assignment Rules**:
   - Ensure users/teams are assigned to receive chats
   - Verify users have Sales Hub or Service Hub seats (required for routing)

2. **Check Bot Configuration** (if using a bot):
   - Ensure bot is enabled and configured
   - Check bot availability matches chat availability

3. **Test in Different Browsers**:
   - Some browsers may have compatibility issues
   - Test in Chrome, Firefox, Safari

## 📚 Additional Resources

- [HubSpot Chat Channel Documentation](https://knowledge.hubspot.com/inbox/connect-and-customize-a-chat-channel-in-the-conversations-inbox)
- [HubSpot Tracking Code Documentation](https://knowledge.hubspot.com/reports/install-the-hubspot-tracking-code)
- [HubSpot Chat Widget SDK](https://developers.hubspot.com/docs/api/conversations/chat-widget-sdk) (for advanced customization)

## ✅ Checklist

- [ ] Chat channel created in HubSpot
- [ ] Chat widget appearance customized
- [ ] Availability hours configured
- [ ] Welcome message set
- [ ] Assignment rules configured
- [ ] Chat channel published
- [ ] Chat widget appears on website
- [ ] Test chat conversation received in HubSpot inbox

---

**Current Status**: 
- ✅ Tracking code installed
- ⏳ Chat channel configuration (do this in HubSpot)
- ⏳ Testing and verification

Once you complete the HubSpot configuration, the chat widget will automatically appear on your website! 🎉






