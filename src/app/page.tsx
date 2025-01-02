'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal';

export default function Home() {
  const { data: workspaces, isPending: isPendingWorkspaces } =
    useGetWorkspaces();
  const [open, setOpen] = useCreateWorkspaceModal();

  const router = useRouter();

  const worspaceId = workspaces?.[0]?._id;

  useEffect(() => {
    if (isPendingWorkspaces) return;

    if (worspaceId) {
      router.replace(`/workspace/${worspaceId}`);
    } else {
      setOpen(true);
    }
  }, [worspaceId, isPendingWorkspaces, setOpen, open, router]);

  return (
    <main className='flex h-screen items-center justify-center'>Main Page</main>
  );
}
