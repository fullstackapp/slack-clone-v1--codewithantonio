import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useChannelId } from '@/hooks/use-channel-id';
import useConfirm from '@/hooks/use-confirm';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { useRemoveChannel } from '../api/use-remove-channel';
import { useUpdateChannel } from '../api/use-update-channel';
import ChannelEditModal from './channel-edit-modal';

interface ChannelModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}

const ChannelModal = ({ open, setOpen, initialValue }: ChannelModalProps) => {
  const [value, setValue] = useState(initialValue);
  const [channelEditModalOpen, setChannelEditModalOpen] = useState(false);

  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const router = useRouter();
  const [ConfirmDialog, confirm] = useConfirm(
    'Delete channel',
    'Are you sure?'
  );

  const { mutate: updateChannel, isPending: updateChannelIsPending } =
    useUpdateChannel();

  const { mutate: removeChannel, isPending: removeChannelIsPending } =
    useRemoveChannel();

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateChannel(
      { id: channelId, name: value },
      {
        onSuccess: () => {
          toast.success('Channel updated');
          setChannelEditModalOpen(false);
        },
        onError: () => {
          toast.error('Failed to update channel');
        },
      }
    );
  };

  const handleRemove = async () => {
    const isConfirmed = await confirm();
    if (!isConfirmed) {
      return;
    }

    removeChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success('Channel deleted');
          setOpen(false);
          router.replace(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error('Failed to delete channel');
        },
      }
    );
  };

  return (
    <>
      <ChannelEditModal
        value={value}
        setValue={setValue}
        disabled={false}
        open={channelEditModalOpen}
        setOpen={setChannelEditModalOpen}
        handleEdit={handleEdit}
      />
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='overflow-hidden bg-gray-50 p-0'>
          <DialogHeader className='border-b bg-white p-4'>
            <DialogTitle>Channel settings</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col gap-y-2 px-4 pb-4'>
            <div className='rounded-lg border bg-white px-5 py-4'>
              <div className='flex items-center justify-between'>
                <p className='text-sm font-semibold'>Channel name</p>
                <button
                  className='text-sm font-semibold text-[#1264a3] hover:underline'
                  onClick={() => setChannelEditModalOpen(true)}
                  disabled={updateChannelIsPending || removeChannelIsPending}>
                  Edit
                </button>
              </div>
              <p className='text-sm'># {value}</p>
            </div>
            <button
              disabled={removeChannelIsPending}
              onClick={handleRemove}
              className='flex cursor-pointer items-center gap-x-2 rounded-lg border bg-white px-5 py-4 text-rose-600 hover:bg-gray-50'>
              <TrashIcon className='size-4' />
              <p className='text-sm font-semibold'>Delete channel</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChannelModal;
