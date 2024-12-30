import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { api } from '../../../../convex/_generated/api';
import { useCreateChannelModal } from '../store/use-create-channel-modal';

const CreateChannelModal = () => {
  const [open, setOpen] = useCreateChannelModal();
  const [name, setName] = useState('');
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.channels.create),
  });

  const handleClose = () => {
    setOpen(false);
    setName('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\s+/g, '-').toLowerCase();
    setName(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate(
      { name, workspaceId },
      {
        onSuccess(channelId) {
          toast.success('Channel created');
          handleClose();
          router.push(`/workspace/${workspaceId}/channel/${channelId}`);
        },
        onError() {
          toast.error('Failed to create a channel');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new channel</DialogTitle>
        </DialogHeader>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <Input
            value={name}
            onChange={handleChange}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder='e.g. plan-budget'
          />
          <div className='flex justify-end'>
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
