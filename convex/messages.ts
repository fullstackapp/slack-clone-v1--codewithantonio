import { getAuthUserId } from '@convex-dev/auth/server';
import { PaginationResult, paginationOptsValidator } from 'convex/server';
import { ConvexError, v } from 'convex/values';

import { Doc, Id } from './_generated/dataModel';
import { QueryCtx, mutation, query } from './_generated/server';

export const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<'workspaces'>,
  userId: Id<'users'>
) => {
  return await ctx.db
    .query('members')
    .withIndex('by_workspace_id_and_user_id', (q) =>
      q.eq('workspaceId', workspaceId).eq('userId', userId)
    )
    .unique();
};

const populateUser = (ctx: QueryCtx, userId: Id<'users'>) => {
  return ctx.db.get(userId);
};

const populateMember = (ctx: QueryCtx, memberId: Id<'members'>) => {
  return ctx.db.get(memberId);
};

const populateReactions = async (ctx: QueryCtx, messadeId: Id<'messages'>) => {
  const reactions = await ctx.db
    .query('reactions')
    .withIndex('by_message_id', (q) => q.eq('messageId', messadeId))
    .collect();

  if (reactions.length === 0) {
    return [];
  }

  // Group reactions by emoji
  const reactionMap = new Map<
    string,
    {
      count: number;
      memberIds: Set<Id<'members'>>;
      base: Omit<Doc<'reactions'>, 'memberId'>;
    }
  >();

  for (const reaction of reactions) {
    const { emoji, memberId, ...rest } = reaction;
    const existing = reactionMap.get(emoji);

    if (existing) {
      existing.count++;
      existing.memberIds.add(memberId);
    } else {
      reactionMap.set(emoji, {
        count: 1,
        memberIds: new Set([memberId]),
        base: { ...rest, emoji },
      });
    }
  }

  // Convert Map to the desired structure
  const reactionsWithCounts = Array.from(reactionMap.values()).map(
    ({ count, memberIds, base }) => ({
      ...base,
      count,
      memberIds: Array.from(memberIds),
    })
  );

  return reactionsWithCounts;
};

const populateThread = async (ctx: QueryCtx, messadeId: Id<'messages'>) => {
  const messages = await ctx.db
    .query('messages')
    .withIndex('by_parent_message_id', (q) =>
      q.eq('parentMessageId', messadeId)
    )
    .collect();

  if (messages.length === 0) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
    };
  }

  const lastMessage = messages[messages.length - 1];
  const lastMessageMember = await populateMember(ctx, lastMessage.memberId);

  if (!lastMessageMember) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
    };
  }

  const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);

  if (!lastMessageUser) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
    };
  }

  return {
    count: messages.length,
    image: lastMessageUser.image,
    timestamp: lastMessage._creationTime,
  };
};

const populateResults = async (
  ctx: QueryCtx,
  results: PaginationResult<Doc<'messages'>>
) => {
  const populatedResults = await Promise.all(
    results.page.map(async (message) => {
      try {
        // Populate member and user
        const member = await populateMember(ctx, message.memberId);
        if (!member) return null;

        const user = await populateUser(ctx, member.userId);
        if (!user) return null;

        // Concurrently fetch related data
        const [reactions, thread, image] = await Promise.all([
          populateReactions(ctx, message._id),
          populateThread(ctx, message._id),
          message.image ? ctx.storage.getUrl(message.image) : undefined,
        ]);

        // Return populated message object
        return {
          ...message,
          member,
          user,
          reactions,
          threadCount: thread.count,
          threadImage: thread.image,
          threadTimestamp: thread.timestamp,
          image,
        };
      } catch {
        return null;
      }
    })
  );

  // Filter out null values
  return populatedResults.filter((message) => message !== null);
};

const populateResult = async (ctx: QueryCtx, message: Doc<'messages'>) => {
  try {
    // Populate member and user
    const member = await populateMember(ctx, message.memberId);
    if (!member) return null;

    const user = await populateUser(ctx, member.userId);
    if (!user) return null;

    // Concurrently fetch related data
    const [reactions, image] = await Promise.all([
      populateReactions(ctx, message._id),
      message.image ? ctx.storage.getUrl(message.image) : undefined,
    ]);

    // Return populated message object
    return {
      ...message,
      member,
      user,
      reactions,
      image,
    };
  } catch {
    return null;
  }
};

export const get = query({
  args: {
    workspaceId: v.id('workspaces'),
    channelId: v.optional(v.id('channels')),
    conversationId: v.optional(v.id('conversations')),
    parentMessageId: v.optional(v.id('messages')),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated');
    }

    // Check if workspace exists
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) {
      throw new ConvexError('Workspace not found');
    }

    let _conversationId = args.conversationId;
    // Only possible if we are replying in a thread in 1:1 conversation
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);

      if (!parentMessage) {
        throw new Error('Parent message not found');
      }

      _conversationId = parentMessage.conversationId;
    }

    const results = await ctx.db
      .query('messages')
      .withIndex('by_channel_id_parent_message_id_conversation_id', (q) =>
        q
          .eq('channelId', args.channelId)
          .eq('parentMessageId', args.parentMessageId)
          .eq('conversationId', _conversationId)
      )
      .order('desc')
      .paginate(args.paginationOpts);

    const populatedResults = await populateResults(ctx, results);

    return { ...results, page: populatedResults };
  },
});

export const getById = query({
  args: {
    id: v.id('messages'),
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated');
    }

    const member = await getMember(ctx, args.workspaceId, userId);

    if (member === null) {
      throw new Error('Unathorized');
    }

    const message = await ctx.db.get(args.id);

    if (message === null) {
      throw new Error('Message not found');
    }

    const populatedMessage = await populateResult(ctx, message);

    return populatedMessage;
  },
});

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id('_storage')),
    workspaceId: v.id('workspaces'),
    channelId: v.optional(v.id('channels')),
    parentMessageId: v.optional(v.id('messages')),
    conversationId: v.optional(v.id('conversations')),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated');
    }

    const member = await getMember(ctx, args.workspaceId, userId);

    if (member === null) {
      throw new Error('Unathorized');
    }

    let _conversationId = args.conversationId;
    // Only possible if we are replying in a thread in 1:1 conversation
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);

      if (!parentMessage) {
        throw new Error('Parent message not found');
      }

      _conversationId = parentMessage.conversationId;
    }

    const messadeId = await ctx.db.insert('messages', {
      body: args.body,
      image: args.image,
      memberId: member._id,
      workspaceId: args.workspaceId,
      channelId: args.channelId,
      parentMessageId: args.parentMessageId,
      conversationId: _conversationId,
    });

    return messadeId;
  },
});

export const update = mutation({
  args: {
    id: v.id('messages'),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated');
    }

    const message = await ctx.db.get(args.id);

    if (message === null) {
      throw new Error('Message not found');
    }

    const member = await getMember(ctx, message.workspaceId, userId);

    if (member === null || member._id !== message.memberId) {
      throw new Error('Unathorized');
    }

    await ctx.db.patch(args.id, { body: args.body, updatedAt: Date.now() });

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id('messages'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated');
    }

    const message = await ctx.db.get(args.id);

    if (message === null) {
      throw new Error('Message not found');
    }

    const member = await getMember(ctx, message.workspaceId, userId);

    if (member === null || member._id !== message.memberId) {
      throw new Error('Unathorized');
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});
