import Link from 'next/link';

import { VariantProps, cva } from 'class-variance-authority';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { cn, createInitials } from '@/lib/utils';

import { Id } from '../../../../convex/_generated/dataModel';

interface UserItemProps {
  id: Id<'members'>;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>['variant'];
}

const userItemVariants = cva(
  'flex h-7 items-center justify-start gap-1.5 overflow-hidden px-4 text-sm font-normal',
  {
    variants: {
      variant: {
        default: 'text-[#f9edffcc]',
        active: 'text-[#481349] bg-white/90 hover:bg-white/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const UserItem = ({ id, label, variant, image }: UserItemProps) => {
  const workspaceId = useWorkspaceId();
  const avatarFallback = createInitials(label);
  return (
    <Button
      className={cn(userItemVariants({ variant }))}
      variant={'transparent'}
      size={'sm'}
      asChild>
      <Link href={`/workspaces/${workspaceId}/members/${id}`}>
        <Avatar className='mr-1 size-5 rounded-md'>
          <AvatarImage src={image ?? ''} alt={label ?? ''} />
          <AvatarFallback className='rounded-md bg-sky-500 text-[10px] text-white'>
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className='truncate text-sm'>{label}</span>
      </Link>
    </Button>
  );
};

export default UserItem;
