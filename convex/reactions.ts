import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { mutation } from './_generated/server';
import { getMember } from './messages';

export const toggle = mutation({
  args: {
    messageId: v.id('messages'),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new Error('Client is not authenticated');
    }

    const message = await ctx.db.get(args.messageId);

    if (message === null) {
      throw new Error('Message not found');
    }

    const member = await getMember(ctx, message.workspaceId, userId);

    if (member === null) {
      throw new Error('Unathorized');
    }

    const existingReaction = await ctx.db
      .query('reactions')
      .filter((q) =>
        q.and(
          q.eq(q.field('messageId'), args.messageId),
          q.eq(q.field('emoji'), args.emoji),
          q.eq(q.field('memberId'), member._id)
        )
      )
      .first();

    if (existingReaction) {
      await ctx.db.delete(existingReaction._id);
    } else {
      await ctx.db.insert('reactions', {
        messageId: args.messageId,
        emoji: args.emoji,
        memberId: member._id,
        workspaceId: message.workspaceId,
      });
    }

    return args.messageId;
  },
});
