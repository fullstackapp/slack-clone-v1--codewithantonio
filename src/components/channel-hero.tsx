import { format } from 'date-fns';

interface ChannelHeroProps {
  name: string;
  creationeTime: number;
}

const ChannelHero = ({ name, creationeTime }: ChannelHeroProps) => {
  return (
    <div className='mx-5 mb-4 mt-[88px]'>
      <p className='mb-2 flex items-center text-2xl font-bold'>
        👋 Welcome to the #{name} channel
      </p>
      <p className='mb-4 font-normal text-slate-800'>
        This channel was created on {format(creationeTime, 'MMMM do, yyyy')}.
        This is the first message in <strong>#{name}</strong>.
      </p>
    </div>
  );
};

export default ChannelHero;
