import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const get = query({
  args: { workspaceId: v.id('workspaces') },
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
      return null;
    }

    const channels = await ctx.db
      .query('channels')
      .withIndex('by_workspace_id', (q) =>
        q.eq('workspaceId', args.workspaceId)
      )
      .collect();

    return channels;
  },
});

export const getById = query({
  args: { id: v.id('channels') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated');
    }

    const channel = await ctx.db.get(args.id);

    if (channel === null) {
      return null;
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_and_user_id', (q) =>
        q.eq('workspaceId', channel?.workspaceId).eq('userId', userId)
      )
      .unique();

    if (member === null) {
      return null;
    }

    return channel;
  },
});

export const create = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    name: v.string(),
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

    if (member === null || member.role !== 'admin') {
      throw new Error('Unathorized');
    }

    const parsedName = args.name.replace(/\s+/g, '-').toLowerCase();
    const channelId = await ctx.db.insert('channels', {
      workspaceId: args.workspaceId,
      name: parsedName,
    });

    return channelId;
  },
});

export const update = mutation({
  args: {
    id: v.id('channels'),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated');
    }

    const channel = await ctx.db.get(args.id);

    if (channel === null) {
      throw new Error('Channel not found');
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_and_user_id', (q) =>
        q.eq('workspaceId', channel.workspaceId).eq('userId', userId)
      )
      .unique();

    if (member === null || member.role !== 'admin') {
      throw new Error('Unathorized');
    }

    await ctx.db.patch(args.id, { name: args.name });

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id('channels'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated');
    }

    const channel = await ctx.db.get(args.id);

    if (channel === null) {
      throw new Error('Channel not found');
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_and_user_id', (q) =>
        q.eq('workspaceId', channel.workspaceId).eq('userId', userId)
      )
      .unique();

    if (member === null || member.role !== 'admin') {
      throw new Error('Unathorized');
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});
