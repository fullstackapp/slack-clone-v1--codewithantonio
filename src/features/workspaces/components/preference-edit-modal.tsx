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

interface PreferenceEditModal {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  disabled: boolean;
  handleEdit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const PreferenceEditModal = ({
  open,
  setOpen,
  disabled,
  value,
  setValue,
  handleEdit,
}: PreferenceEditModal) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit workspace name</DialogTitle>
        </DialogHeader>
        <form className='space-y-4' onSubmit={handleEdit}>
          <Input
            value={value}
            disabled={disabled}
            onChange={(e) => setValue(e.target.value)}
            required
            placeholder='Workspace name e.g. "Work", "Home", "Personal"'
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

export default PreferenceEditModal;
