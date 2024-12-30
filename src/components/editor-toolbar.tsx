import { type Editor } from '@tiptap/react';
import {
  Bold,
  Code,
  CodeSquare,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Underline,
  Undo,
} from 'lucide-react';

import Hint from './hint';
import { Separator } from './ui/separator';
import { Toggle } from './ui/toggle';

interface EditorToolbarProps {
  editor: Editor;
  disabled?: boolean;
}

const EditorToolbar = ({ editor, disabled }: EditorToolbarProps) => {
  return (
    <div className='flex w-full flex-wrap items-center justify-start gap-1 p-2'>
      <Hint label='Bold'>
        <Toggle
          size='sm'
          disabled={disabled}
          variant={'outline'}
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}>
          <Bold className='h-4 w-4' />
        </Toggle>
      </Hint>

      <Hint label='Italic'>
        <Toggle
          size='sm'
          disabled={disabled}
          variant={'outline'}
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className='h-4 w-4' />
        </Toggle>
      </Hint>

      <Hint label='Underline'>
        <Toggle
          size='sm'
          disabled={disabled}
          variant={'outline'}
          pressed={editor.isActive('underline')}
          onPressedChange={() =>
            editor.chain().focus().toggleUnderline().run()
          }>
          <Underline className='h-4 w-4' />
        </Toggle>
      </Hint>

      <Hint label='Strikethrough'>
        <Toggle
          size='sm'
          disabled={disabled}
          variant={'outline'}
          pressed={editor.isActive('strike')}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className='h-4 w-4' />
        </Toggle>
      </Hint>

      <Separator orientation='vertical' className='mx-1 my-0.5 h-[30px]' />

      <Hint label='Bullet List'>
        <Toggle
          size='sm'
          disabled={disabled}
          variant={'outline'}
          pressed={editor.isActive('bulletList')}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }>
          <List className='h-4 w-4' />
        </Toggle>
      </Hint>

      <Hint label='Ordered List'>
        <Toggle
          size='sm'
          disabled={disabled}
          variant={'outline'}
          pressed={editor.isActive('orderedList')}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }>
          <ListOrdered className='h-4 w-4' />
        </Toggle>
      </Hint>

      <Separator orientation='vertical' className='mx-1 my-0.5 h-[30px]' />

      <Hint label='Blockquote'>
        <Toggle
          size='sm'
          disabled={disabled}
          variant={'outline'}
          pressed={editor.isActive('blockquote')}
          onPressedChange={() =>
            editor.chain().focus().toggleBlockquote().run()
          }>
          <Quote className='h-4 w-4' />
        </Toggle>
      </Hint>

      <Separator orientation='vertical' className='mx-1 my-0.5 h-[30px]' />

      <Hint label='Code'>
        <Toggle
          size='sm'
          disabled={disabled}
          variant={'outline'}
          pressed={editor.isActive('code')}
          onPressedChange={() => editor.chain().focus().toggleCode().run()}>
          <Code className='h-4 w-4' />
        </Toggle>
      </Hint>

      <Hint label='Code Block'>
        <Toggle
          size='sm'
          disabled={disabled}
          variant={'outline'}
          pressed={editor.isActive('codeBlock')}
          onPressedChange={() =>
            editor.chain().focus().toggleCodeBlock().run()
          }>
          <CodeSquare className='h-4 w-4' />
        </Toggle>
      </Hint>

      <Separator orientation='vertical' className='mx-1 my-0.5 h-[30px]' />

      <Hint label='Undo'>
        <Toggle
          size='sm'
          disabled={disabled}
          variant={'outline'}
          pressed={editor.isActive('undo')}
          onPressedChange={() => editor.chain().focus().undo().run()}>
          <Undo className='h-4 w-4' />
        </Toggle>
      </Hint>

      <Hint label='Redo'>
        <Toggle
          size='sm'
          disabled={disabled}
          variant={'outline'}
          pressed={editor.isActive('redo')}
          onPressedChange={() => editor.chain().focus().redo().run()}>
          <Redo className='h-4 w-4' />
        </Toggle>
      </Hint>
    </div>
  );
};

export default EditorToolbar;
