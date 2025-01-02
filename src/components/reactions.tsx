import { MdOutlineAddReaction } from 'react-icons/md';

import { useCurrentMember } from '@/features/members/api/use-current-member';
import { cn } from '@/lib/utils';

import { Doc, Id } from '../../convex/_generated/dataModel';
import EmojiPopover from './emoji-popover';

interface ReactionsProps {
  reactions: Array<
    Omit<Doc<'reactions'>, 'memberId'> & {
      count: number;
      memberIds: Id<'members'>[];
    }
  >;
  onChange: (emoji: string) => void;
}

export default function Reactions({ reactions, onChange }: ReactionsProps) {
  const { data: currentMember } = useCurrentMember();

  if (reactions.length === 0 || !currentMember) {
    return null;
  }
  return (
    <div className='mb-1 mt-1 flex items-center gap-1'>
      {reactions.map((reaction) => (
        <button
          key={reaction._id}
          onClick={() => onChange(reaction.emoji)}
          className={cn(
            'flex h-6 items-center gap-x-1 rounded-full border border-transparent bg-slate-200/70 px-2 text-slate-800',
            reaction.memberIds.includes(currentMember._id) &&
              'border-blue-500 bg-blue-100/70'
          )}>
          {reaction.emoji}
          <span
            className={cn(
              'text-xs font-semibold text-muted-foreground',
              reaction.memberIds.includes(currentMember._id) && 'text-blue-500'
            )}>
            {reaction.count}
          </span>
        </button>
      ))}
      <EmojiPopover
        label='Add reaction'
        onEmojiSelect={(emoji) => onChange(emoji)}>
        <button className='flex h-7 items-center gap-x-1 rounded-full border border-transparent bg-slate-200/70 px-3 text-slate-800 hover:border-slate-500'>
          <MdOutlineAddReaction className='size-4' />
        </button>
      </EmojiPopover>
    </div>
  );
}
