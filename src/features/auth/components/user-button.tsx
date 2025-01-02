'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { Loader, LogOut } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createInitials } from '@/lib/utils';

import { useCurrentUser } from '../api/use-current-user';

const UserButton = () => {
  const { signOut } = useAuthActions();

  const { data: currentUser, isPending: isPendingCurrentUser } =
    useCurrentUser();

  const onSignOut = async () => {
    await signOut();
  };

  if (isPendingCurrentUser) {
    return <Loader className='size-4 animate-spin text-muted-foreground' />;
  }

  if (!currentUser) {
    return null;
  }

  const { name, image } = currentUser;

  const avatarFallback = createInitials(name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='relative outline-none'>
        <Avatar className='size-10 rounded-md transition hover:opacity-75'>
          <AvatarImage src={image ?? ''} alt={name ?? ''} />
          <AvatarFallback className='rounded-md bg-sky-500 text-white'>
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-60' align='center' side='right'>
        <DropdownMenuItem onClick={onSignOut} className='h-10'>
          <LogOut className='mr-2 size-4' />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
