import { useState } from 'react';

import { Pencil } from 'lucide-react';

import Hint from '@/components/hint';
import { Button } from '@/components/ui/button';

import ChannelModal from './channel-modal';

interface ChannelHeaderProps {
  title: string;
  isAdmin: boolean;
}

const ChannelHeader = ({ title, isAdmin }: ChannelHeaderProps) => {
  const [channelModalOpen, setChannelModalOpen] = useState(false);

  return (
    <>
      <ChannelModal
        open={channelModalOpen}
        setOpen={setChannelModalOpen}
        initialValue={title}
      />
      <div className='mb-4 flex h-[49px] shrink-0 items-center gap-x-2 border-b bg-white px-4'>
        <h2 className='flex items-center overflow-hidden text-lg font-semibold'>
          <span className='truncate'># {title}</span>
        </h2>

        {isAdmin && (
          <Hint label={'Edit channel'} side={'bottom'} align={'center'}>
            <Button
              onClick={() => setChannelModalOpen(true)}
              variant={'ghost'}
              size={'iconSm'}
              className='shrink-0 text-muted-foreground'>
              <Pencil className='size-4' />
            </Button>
          </Hint>
        )}
      </div>
    </>
  );
};

export default ChannelHeader;
