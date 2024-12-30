import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import useConfirm from '@/hooks/use-confirm';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { api } from '../../../../convex/_generated/api';
import PreferenceEditModal from './preference-edit-modal';

interface PreferenceModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}

const PreferenceModal = ({
  open,
  setOpen,
  initialValue,
}: PreferenceModalProps) => {
  const [value, setValue] = useState(initialValue);
  const [preferenceEditModalOpen, setPreferenceEditModalOpen] = useState(false);

  const router = useRouter();
  const [ConfirmDialog, confirm] = useConfirm(
    'Delete workspace',
    'Are you sure?'
  );

  const workspaceId = useWorkspaceId();
  const { mutate: updateWorkspace, isPending: updateWorkspaceIsPending } =
    useMutation({
      mutationFn: useConvexMutation(api.workspaces.update),
    });
  const { mutate: removeWorkspace, isPending: removeWorkspaceIsPending } =
    useMutation({
      mutationFn: useConvexMutation(api.workspaces.remove),
    });

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateWorkspace(
      { id: workspaceId, name: value },
      {
        onSuccess: () => {
          toast.success('Workspace updated');
          setPreferenceEditModalOpen(false);
        },
        onError: () => {
          toast.error('Failed to update workspace');
        },
      }
    );
  };

  const handleRemove = async () => {
    const confirmed = await confirm();
    if (!confirmed) {
      return;
    }

    removeWorkspace(
      { id: workspaceId },
      {
        onSuccess: () => {
          toast.success('Workspace deleted');
          setOpen(false);
          router.replace('/');
        },
        onError: () => {
          toast.error('Failed to delete workspace');
        },
      }
    );
  };

  return (
    <>
      <PreferenceEditModal
        value={value}
        setValue={setValue}
        disabled={updateWorkspaceIsPending}
        open={preferenceEditModalOpen}
        setOpen={setPreferenceEditModalOpen}
        handleEdit={handleEdit}
      />
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='overflow-hidden bg-gray-50 p-0'>
          <DialogHeader className='border-b bg-white p-4'>
            <DialogTitle>Workspace settings</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col gap-y-2 px-4 pb-4'>
            <div className='rounded-lg border bg-white px-5 py-4'>
              <div className='flex items-center justify-between'>
                <p className='text-sm font-semibold'>Workspace name</p>
                <button
                  className='text-sm font-semibold text-[#1264a3] hover:underline'
                  onClick={() => setPreferenceEditModalOpen(true)}>
                  Edit
                </button>
              </div>
              <p className='text-sm'>{value}</p>
            </div>
            <button
              disabled={removeWorkspaceIsPending}
              onClick={handleRemove}
              className='flex cursor-pointer items-center gap-x-2 rounded-lg border bg-white px-5 py-4 text-rose-600 hover:bg-gray-50'>
              <TrashIcon className='size-4' />
              <p className='text-sm font-semibold'>Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PreferenceModal;
