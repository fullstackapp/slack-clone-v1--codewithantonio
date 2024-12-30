'use client';

import Image from 'next/image';
import { ChangeEvent, MutableRefObject, useEffect, useState } from 'react';

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import {
  Content,
  EditorContent,
  Editor as EditorType,
  useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { common, createLowlight } from 'lowlight';
import { ImageIcon, Smile, XIcon } from 'lucide-react';
import { MdSend } from 'react-icons/md';
import { PiTextAa } from 'react-icons/pi';

import { cn } from '@/lib/utils';

import EditorToolbar from './editor-toolbar';
import EmojiPopover from './emoji-popover';
import Hint from './hint';
import { Button } from './ui/button';

// create a lowlight instance
const lowlight = createLowlight(common);

// you can also register individual languages
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('js', js);
lowlight.register('ts', ts);

type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  image: File | null;
  onDeleteImage?: () => void;
  onUploadImage?: (e: ChangeEvent<HTMLInputElement>) => void;
  defaultValue: Content;
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: 'create' | 'update';
  editorRef?: MutableRefObject<EditorType | null>;
  imageRef?: MutableRefObject<HTMLInputElement | null>;
}

const Editor = ({
  variant = 'create',
  onSubmit,
  onCancel,
  editorRef,
  placeholder = 'Write a message...',
  disabled = false,
  defaultValue,
  image,
  onDeleteImage,
  onUploadImage,
  imageRef,
}: EditorProps) => {
  const [plainText, setPlainText] = useState('');
  const [jsonData, setJsonData] = useState<Content>(defaultValue);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  const editor = useEditor({
    content: jsonData,
    editable: !disabled,
    autofocus: 'end',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'flex flex-col h-full w-full px-4 py-2 text-sm text-[15px] focus-visible:outline-none placeholder:text-muted-foreground',
      },
      handleKeyDown: (view, event) => {
        // Check for Enter with Shift
        if (event.key === 'Enter' && event.shiftKey) {
          event.preventDefault();

          if (!isEmpty) {
            handleSubmit();
            setPlainText('');
          }
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const text = editor.getText().replace(/\n/g, '').trim();

      setJsonData(json);
      setPlainText(text);
    },
    extensions: [
      StarterKit.configure({
        blockquote: {
          HTMLAttributes: {
            class: 'p-4 my-4 border-l-4 border-gray-300 bg-gray-50',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'pl-4 list-disc',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'pl-4 list-decimal',
          },
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-[#0d0d0d;] font-mono px-3 py-4 rounded-lg text-white',
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
    ],
  });

  useEffect(() => {
    if (editorRef) {
      editorRef.current = editor;
    }

    return () => {
      if (editorRef) {
        editorRef.current = null;
      }
    };
  }, [editor, editorRef]);

  if (!editor) {
    return null;
  }

  const isEmpty = plainText.length === 0 && !image;

  const handleEmojiSelect = (emoji: string) => {
    editor.commands.insertContent(emoji);
    editor.commands.focus();
  };

  const handleSubmit = () => {
    if (plainText.length === 0) {
      onSubmit({ body: '', image });
    } else {
      onSubmit({ body: JSON.stringify(jsonData), image });
    }
    setPlainText('');
  };

  return (
    <div className='flex flex-col'>
      <div className='flex max-h-[28rem] flex-col rounded-md border border-slate-200 bg-white transition focus-within:border-slate-400 focus-within:shadow-sm'>
        {isToolbarVisible && (
          <EditorToolbar editor={editor} disabled={disabled} />
        )}
        <div className='messages-scrollbar overflow-y-auto'>
          <EditorContent editor={editor} />
        </div>
        <input
          type='file'
          accept='image/*'
          ref={imageRef}
          hidden
          onChange={onUploadImage}
        />
        {!!image && (
          <div className='p-2'>
            <div className='group/image relative flex size-[62px] items-center justify-center'>
              <button
                className='absolute -right-2.5 -top-2.5 z-10 hidden size-6 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black group-hover/image:flex'
                onClick={onDeleteImage}>
                <XIcon className='size-3.5' />
              </button>
              <Image
                src={URL.createObjectURL(image)}
                alt='Uploaded image'
                className='overflow-hidden rounded-xl border object-cover'
                fill
              />
            </div>
          </div>
        )}
        <div className='flex w-full flex-wrap items-center justify-start gap-1 p-2'>
          <Hint
            label={isToolbarVisible ? 'Hide formatting' : 'Show formatting'}>
            <Button
              disabled={disabled}
              size={'sm'}
              variant={'ghost'}
              onClick={() => setIsToolbarVisible(!isToolbarVisible)}>
              <PiTextAa className='size-4' />
            </Button>
          </Hint>
          <EmojiPopover label='Emoji' onEmojiSelect={handleEmojiSelect}>
            <Button disabled={disabled} size={'sm'} variant={'ghost'}>
              <Smile className='size-4' />
            </Button>
          </EmojiPopover>
          {variant === 'create' && (
            <Hint label='Image'>
              <Button
                disabled={disabled}
                size={'sm'}
                variant={'ghost'}
                onClick={() => imageRef?.current?.click()}>
                <ImageIcon className='size-4' />
              </Button>
            </Hint>
          )}
          {variant === 'create' && (
            <Button
              disabled={isEmpty || disabled}
              className={cn(
                'ml-auto',
                isEmpty || disabled
                  ? 'bg-white text-muted-foreground hover:bg-white'
                  : 'bg-[#007a5a] text-white hover:bg-[#007a5a]/80'
              )}
              size={'sm'}
              onClick={handleSubmit}>
              <MdSend className='size-4' />
            </Button>
          )}
          {variant === 'update' && (
            <div className='ml-auto flex items-center gap-x-2'>
              <Button
                disabled={disabled}
                size={'sm'}
                onClick={onCancel}
                variant={'outline'}>
                Cancel
              </Button>
              <Button
                disabled={isEmpty || disabled}
                className='bg-[#007a5a] text-white hover:bg-[#007a5a]/80 hover:text-white'
                size={'sm'}
                onClick={handleSubmit}
                variant={'outline'}>
                Save
              </Button>
            </div>
          )}
        </div>
      </div>

      {variant === 'create' && (
        <p
          className={cn(
            'flex justify-end p-2 text-[10px] text-muted-foreground opacity-0 transition',
            !isEmpty && 'opacity-100'
          )}>
          <strong>Shift + Enter&nbsp;</strong> to send a message
        </p>
      )}
    </div>
  );
};

export default Editor;
