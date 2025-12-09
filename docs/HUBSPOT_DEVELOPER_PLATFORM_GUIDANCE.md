# HubSpot Developer Platform Guidance

## Overview

HubSpot has introduced a new developer platform (version 2025.2) with enhanced features. However, **legacy private apps are still fully supported** and remain the recommended approach for simple REST API integrations.

## Current Status

### Legacy Private Apps (Still Supported ✅)

- **Status**: Fully supported and actively maintained
- **Location**: Settings → Development → Legacy Apps
- **Best For**: Simple REST API integrations, server-side API calls
- **Works With**: Any programming language
- **No Migration Required**: Continue using if it meets your needs

**Reference**: [HubSpot Developer Platform Overview](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/overview)

### New Developer Platform (2025.2) - Recommended for Advanced Use Cases

- **Status**: Recommended for new projects with advanced features
- **Best For**: Full-featured HubSpot apps with UI extensions, app cards, webhooks
- **Requires**: Node.js/JavaScript, HubSpot CLI
- **Migration**: Can migrate existing private apps if needed

## For This Blog Integration

### Recommendation: Continue with Legacy Private App ✅

**Why:**
1. ✅ **Simpler Setup**: Just create private app, get access token, done
2. ✅ **Still Supported**: HubSpot explicitly states legacy apps are fully supported
3. ✅ **Perfect Fit**: Our use case is simple REST API calls (Events, Contacts, Forms APIs)
4. ✅ **No Migration Needed**: Works perfectly as-is
5. ✅ **Language Agnostic**: Works with any backend language

**When to Consider Migrating:**
- If you need advanced features like app cards or webhooks
- If you want to build a full HubSpot app with UI extensions
- If you plan to distribute your app to other HubSpot accounts
- If you want to take advantage of the new file-based build framework

## Migration Path (If Needed Later)

If you decide to migrate to the new platform in the future:

1. **Manual Migration Guide**: 
   - https://developers.hubspot.com/docs/apps/developer-platform/migrate-apps/manual-migration-private-app

2. **What Changes**:
   - App configuration moves to `app-hsmeta.json` file
   - Uses HubSpot CLI for deployment
   - Access tokens work the same way for REST APIs

3. **What Stays the Same**:
   - REST API endpoints (Events, Contacts, Forms)
   - API authentication (access tokens)
   - Our implementation code (no changes needed)

## Key Points

1. **No Immediate Action Required**: Legacy private apps work perfectly for this integration
2. **Future-Proof**: If HubSpot announces deprecation, migration path exists
3. **Simple is Better**: For REST API calls, legacy private apps are simpler
4. **Documentation Updated**: Our setup guide now reflects current HubSpot guidance

## References

- [HubSpot Developer Platform Overview](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/overview)
- [Legacy Apps Access](https://app.hubspot.com) → Settings → Development → Legacy Apps
- [Migration Guides](https://developers.hubspot.com/docs/apps/developer-platform/migrate-apps/manual-migration-private-app)

## Summary

✅ **Continue using legacy private apps for this integration**
✅ **No migration required at this time**
✅ **Fully supported by HubSpot**
✅ **Simplest approach for REST API integrations**

The new developer platform is great for advanced use cases, but for simple API integrations like blog tracking, legacy private apps remain the best choice.




