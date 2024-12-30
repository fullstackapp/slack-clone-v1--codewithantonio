import { useState } from 'react';

import { useAuthActions } from '@convex-dev/auth/react';
import { TriangleAlert } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import { SignInFlow } from '../types';

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

const SignInCard = ({ setState }: SignInCardProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuthActions();

  const onProviderSignIn = (value: 'github' | 'google') => {
    setIsLoading(true);
    signIn(value).finally(() => setIsLoading(false));
  };

  const onPasswordSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      await signIn('password', { email, password, flow: 'signIn' });
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='h-full w-full p-8'>
      <CardHeader className='px-0 pt-0'>
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className='mb-6 flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive'>
          <TriangleAlert className='size-4' />
          <p>{error}</p>
        </div>
      )}
      <CardContent className='space-y-5 px-0 pb-0'>
        <form className='space-y-2.5' onSubmit={onPasswordSignIn}>
          <Input
            disabled={isLoading}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder='Email'
            type='email'
            required
          />
          <Input
            disabled={isLoading}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder='Password'
            type='password'
            required
          />
          <Button
            type='submit'
            className='w-full'
            size={'lg'}
            disabled={isLoading}>
            Continue
          </Button>
        </form>
        <Separator />
        <div className='flex flex-col gap-y-2.5'>
          <Button
            disabled={isLoading}
            onClick={() => onProviderSignIn('google')}
            variant={'outline'}
            size={'lg'}
            className='relative w-full'>
            <FcGoogle className='absolute left-2.5 size-5' />
            Continue with Google
          </Button>
          <Button
            disabled={isLoading}
            onClick={() => onProviderSignIn('github')}
            variant={'outline'}
            size={'lg'}
            className='relative w-full'>
            <FaGithub className='absolute left-2.5 size-5' />
            Continue with Github
          </Button>
        </div>
        <p className='text-xs text-muted-foreground'>
          Don&apos;t have an account?
          <span
            className='ml-1 cursor-pointer text-sky-700 hover:underline'
            onClick={() => setState('signUp')}>
            Sign Up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignInCard;
