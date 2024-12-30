import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { generateCode } from '../src/lib/utils';
import { mutation, query } from './_generated/server';

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated');
    }

    const members = await ctx.db
      .query('members')
      .withIndex('by_user_id', (q) => q.eq('userId', userId))
      .collect();
    const workspaceIds = members.map((member) => member.workspaceId);
    const workspaces = [];

    for (const workspaceId of workspaceIds) {
      const workspace = await ctx.db.get(workspaceId);
      if (workspace !== null) {
        workspaces.push(workspace);
      }
    }
    return workspaces;
  },
});

export const getById = query({
  args: { id: v.id('workspaces') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated');
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_and_user_id', (q) =>
        q.eq('workspaceId', args.id).eq('userId', userId)
      )
      .unique();

    if (member === null) {
      return null;
    }

    const workspace = await ctx.db.get(args.id);

    return workspace;
  },
});

export const getInfoById = query({
  args: { id: v.id('workspaces') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated');
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_and_user_id', (q) =>
        q.eq('workspaceId', args.id).eq('userId', userId)
      )
      .unique();

    const workspace = await ctx.db.get(args.id);

    return { name: workspace?.name, isMember: member !== null };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated');
    }
    const joinCode = generateCode();
    const workspaceId = await ctx.db.insert('workspaces', {
      name: args.name,
      userId,
      joinCode,
    });

    await ctx.db.insert('members', { workspaceId, userId, role: 'admin' });
    await ctx.db.insert('channels', { workspaceId, name: 'general' });

    return workspaceId;
  },
});

export const update = mutation({
  args: {
    id: v.id('workspaces'),
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
        q.eq('workspaceId', args.id).eq('userId', userId)
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
    id: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated');
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_and_user_id', (q) =>
        q.eq('workspaceId', args.id).eq('userId', userId)
      )
      .unique();

    if (member === null || member.role !== 'admin') {
      throw new Error('Unathorized');
    }

    const members = await ctx.db
      .query('members')
      .withIndex('by_workspace_id', (q) => q.eq('workspaceId', args.id))
      .collect();

    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});

export const newJoinCode = mutation({
  args: {
    id: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated');
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_and_user_id', (q) =>
        q.eq('workspaceId', args.id).eq('userId', userId)
      )
      .unique();

    if (member === null || member.role !== 'admin') {
      throw new Error('Unathorized');
    }

    const joinCode = generateCode();

    await ctx.db.patch(args.id, { joinCode });

    return args.id;
  },
});

export const join = mutation({
  args: {
    id: v.id('workspaces'),
    joinCode: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error('Client is not authenticated');
    }

    const workspace = await ctx.db.get(args.id);

    if (workspace === null) {
      throw new Error('Workspace not found');
    }

    if (workspace.joinCode !== args.joinCode.toLowerCase()) {
      throw new Error('Invalid join code');
    }

    const existingMember = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_and_user_id', (q) =>
        q.eq('workspaceId', args.id).eq('userId', userId)
      )
      .unique();

    if (existingMember) {
      throw new Error('Already a member of this workspace');
    }

    await ctx.db.insert('members', {
      workspaceId: args.id,
      userId,
      role: 'member',
    });

    return args.id;
  },
});
