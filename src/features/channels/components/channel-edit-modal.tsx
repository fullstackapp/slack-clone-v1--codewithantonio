import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ChannelEditModal {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  disabled: boolean;
  handleEdit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ChannelEditModal = ({
  open,
  setOpen,
  disabled,
  value,
  setValue,
  handleEdit,
}: ChannelEditModal) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\s+/g, '-').toLowerCase();
    setValue(value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit channel name</DialogTitle>
        </DialogHeader>
        <form className='space-y-4' onSubmit={handleEdit}>
          <Input
            value={value}
            disabled={disabled}
            onChange={handleChange}
            required
            placeholder='Channel name e.g. "sales", "marketing", "support"'
            autoFocus
            minLength={3}
            maxLength={20}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={'outline'} disabled={disabled}>
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={disabled}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelEditModal;
