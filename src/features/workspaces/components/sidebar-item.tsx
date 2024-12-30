import Link from 'next/link';

import { VariantProps, cva } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons/lib';

import { Button } from '@/components/ui/button';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  label: string;
  icon: LucideIcon | IconType;
  id: string;
  variant?: VariantProps<typeof sidebarItemVariants>['variant'];
}

const sidebarItemVariants = cva(
  'flex h-7 items-center justify-start gap-1.5 overflow-hidden px-[18px] text-sm font-normal',
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

const SidebarItem = ({ label, icon: Icon, id, variant }: SidebarItemProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <Button
      className={cn(sidebarItemVariants({ variant }))}
      variant={'transparent'}
      size={'sm'}
      asChild>
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className='mr-1 size-3.5 shrink-0' />
        <span className='truncate text-sm'>{label}</span>
      </Link>
    </Button>
  );
};

export default SidebarItem;
