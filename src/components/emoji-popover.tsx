import { useState } from 'react';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

type EmojiObject = {
  native: string;
};

interface EmojiPopoverProps {
  children: React.ReactNode;
  label?: string;
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPopover = ({
  children,
  label,
  onEmojiSelect,
}: EmojiPopoverProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const onSelect = (emoji: EmojiObject) => {
    onEmojiSelect(emoji.native);
    setIsPopoverOpen(false);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <TooltipProvider>
        <Tooltip delayDuration={50}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent className='border border-white/5 bg-black text-white'>
            <p className='text-xs font-medium'>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <PopoverContent className='w-full rounded-[10px] border-none p-0 shadow-none'>
        <Picker data={data} onEmojiSelect={onSelect} />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPopover;
