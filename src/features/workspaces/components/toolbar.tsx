import { Info, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useGetWorkspace } from '../api/use-get-workspace';

const Toolbar = () => {
  const { data: workspace } = useGetWorkspace();

  return (
    <div className='flex items-center justify-between bg-[#481349] p-1.5'>
      <div className='flex-1' />
      <div className='min-w-[280px] max-w-[642px] flex-1'>
        <Button className='h-7 w-full justify-start bg-accent/25 px-2 hover:bg-accent/25'>
          <Search className='mr-2 size-4 text-white' />
          <span className='text-xs text-white'>
            Search in {workspace?.name.toLowerCase()}
          </span>
        </Button>
      </div>
      <div className='flex flex-1 items-center justify-end'>
        <Button variant={'transparent'} size={'iconSm'}>
          <Info className='size-5 text-white' />
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
