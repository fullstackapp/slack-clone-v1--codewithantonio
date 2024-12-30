'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { convexQuery } from '@convex-dev/react-query';
import { useQuery } from '@tanstack/react-query';

import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal';

import { api } from '../../convex/_generated/api';

export default function Home() {
  const { data, isPending } = useQuery(convexQuery(api.workspaces.get, {}));
  const [open, setOpen] = useCreateWorkspaceModal();

  const router = useRouter();

  const worspaceId = data?.[0]?._id;

  useEffect(() => {
    if (isPending) return;

    if (worspaceId) {
      router.replace(`/workspace/${worspaceId}`);
    } else {
      setOpen(true);
    }
  }, [worspaceId, isPending, setOpen, open, router]);

  return (
    <main className='flex h-screen items-center justify-center'>Main Page</main>
  );
}
