'use client';

import { useEffect } from 'react';

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { common, createLowlight } from 'lowlight';

// create a lowlight instance
const lowlight = createLowlight(common);

// you can also register individual languages
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('js', js);
lowlight.register('ts', ts);

interface PreviewProps {
  value: string;
}

const Preview = ({ value }: PreviewProps) => {
  const editor = useEditor({
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'text-sm outline-none cursor-auto',
      },
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
    ],
  });

  useEffect(() => {
    if (value) {
      editor?.commands.setContent(JSON.parse(value));
    }
  }, [value, editor]);

  if (!editor || !value) {
    return null;
  }

  return <EditorContent editor={editor} />;
};

export default Preview;
