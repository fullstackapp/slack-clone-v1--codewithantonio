'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { convexQuery, useConvexMutation } from '@convex-dev/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import VerificationInput from 'react-verification-input';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { api } from '../../../../convex/_generated/api';

const JoinPage = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { data: workspaceInfo, isPending: isPendingWorkspaceInfo } = useQuery(
    convexQuery(api.workspaces.getInfoById, { id: workspaceId })
  );

  const { mutate: join, isPending: isPendingJoin } = useMutation({
    mutationFn: useConvexMutation(api.workspaces.join),
  });

  const isMember = useMemo(() => workspaceInfo?.isMember, [workspaceInfo]);

  useEffect(() => {
    if (isMember) {
      router.replace(`/workspace/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  const hanleComplete = (value: string) => {
    join(
      { id: workspaceId, joinCode: value },
      {
        onSuccess() {
          toast.success('Joined workspace');
          router.replace(`/workspace/${workspaceId}`);
        },
        onError() {
          toast.error('Invalid join code');
        },
      }
    );
  };

  if (isPendingWorkspaceInfo) {
    return (
      <div className='flex h-full flex-col items-center justify-center'>
        <Loader className='size-5 animate-spin text-muted-foreground' />
      </div>
    );
  }

  return (
    <div className='flex h-full flex-col items-center justify-center gap-y-8 bg-white p-8'>
      <Image src='/logo.svg' width={60} height={60} alt='Logo' />
      <div className='flex max-w-md flex-col items-center justify-center gap-y-4'>
        <div className='flex flex-col items-center justify-center gap-y-2'>
          <h1 className='text-2xl font-bold'>Join {workspaceInfo?.name}</h1>
          <p className='text-base text-muted-foreground'>
            Enter the code to join the workspace
          </p>
        </div>
        {isPendingJoin ? (
          <Loader className='size-5 animate-spin text-muted-foreground' />
        ) : (
          <VerificationInput
            onComplete={hanleComplete}
            classNames={{
              container: 'flex gap-x-2',
              character:
                'uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500',
              characterInactive: 'bg-muted',
              characterSelected: 'bg-white',
              characterFilled: 'bg-white text-black',
            }}
            autoFocus
            length={6}
          />
        )}
        <Button variant='outline' size={'lg'} asChild className='m-4'>
          <Link href='/'>Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
