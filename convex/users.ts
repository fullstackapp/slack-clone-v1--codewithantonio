import { getAuthUserId } from '@convex-dev/auth/server';

import { query } from './_generated/server';

export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated');
    }
    const user = await ctx.db.get(userId);
    if (user === null) {
      throw new Error('User is not found');
    }
    return user;
  },
});
