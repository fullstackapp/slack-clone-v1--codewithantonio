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

import { SignInFlow } from '../lib/types';

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

const SignUpCard = ({ setState }: SignUpCardProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuthActions();

  const onProviderSignUp = (value: 'github' | 'google') => {
    setIsLoading(true);
    signIn(value).finally(() => setIsLoading(false));
  };

  const onPasswordSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmedPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await signIn('password', { name, email, password, flow: 'signUp' });
    } catch {
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='h-full w-full p-8'>
      <CardHeader className='px-0 pt-0'>
        <CardTitle>Sign up to continue</CardTitle>
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
        <form className='space-y-2.5' onSubmit={onPasswordSignUp}>
          <Input
            disabled={isLoading}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder='Name'
            required
          />
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
          <Input
            disabled={isLoading}
            value={confirmedPassword}
            onChange={(event) => setConfirmedPassword(event.target.value)}
            placeholder='Confirm password'
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
            onClick={() => onProviderSignUp('google')}
            variant={'outline'}
            size={'lg'}
            className='relative w-full'>
            <FcGoogle className='absolute left-2.5 size-5' />
            Continue with Google
          </Button>
          <Button
            disabled={isLoading}
            onClick={() => onProviderSignUp('github')}
            variant={'outline'}
            size={'lg'}
            className='relative w-full'>
            <FaGithub className='absolute left-2.5 size-5' />
            Continue with Github
          </Button>
        </div>
        <p className='text-xs text-muted-foreground'>
          Already have an account?
          <span
            className='ml-1 cursor-pointer text-sky-700 hover:underline'
            onClick={() => setState('signIn')}>
            Sign In
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
