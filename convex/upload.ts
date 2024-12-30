import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { mutation } from './_generated/server';

export const generateUploadUrl = mutation({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated');
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_and_user_id', (q) =>
        q.eq('workspaceId', args.workspaceId).eq('userId', userId)
      )
      .unique();

    if (member === null) {
      throw new Error('Unathorized');
    }

    const url = await ctx.storage.generateUploadUrl();

    return url;
  },
});
