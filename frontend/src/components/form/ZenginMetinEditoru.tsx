import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEffect } from 'react';

interface ZenginMetinEditoruProps {
  deger: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarBtn({
  aktif,
  onClick,
  children,
  title,
}: {
  aktif?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded px-2 py-1 text-sm transition ${
        aktif ? 'bg-blue-600 text-white' : 'hover:bg-[var(--ap-hover)]'
      }`}
    >
      {children}
    </button>
  );
}

export function ZenginMetinEditoru({ deger, onChange, placeholder }: ZenginMetinEditoruProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: deger || '',
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
    editorProps: {
      attributes: {
        class: 'ap-zengin-editor-icerik min-h-[200px] px-3 py-2 focus:outline-none',
        'data-placeholder': placeholder ?? 'İçeriğinizi yazın...',
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== deger) {
      editor.commands.setContent(deger || '', { emitUpdate: false });
    }
  }, [deger, editor]);

  if (!editor) return null;

  const linkEkle = () => {
    const url = window.prompt('Link URL');
    if (!url) return;
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="ap-zengin-editor overflow-hidden rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)]">
      <div className="flex flex-wrap gap-1 border-b border-[var(--ap-border)] bg-[var(--ap-surface-2)] p-2">
        <ToolbarBtn aktif={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Kalın">
          <strong>B</strong>
        </ToolbarBtn>
        <ToolbarBtn aktif={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="İtalik">
          <em>I</em>
        </ToolbarBtn>
        <ToolbarBtn aktif={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Altı çizili">
          <u>U</u>
        </ToolbarBtn>
        <span className="mx-1 w-px bg-[var(--ap-border)]" />
        <ToolbarBtn aktif={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Başlık 1">
          H1
        </ToolbarBtn>
        <ToolbarBtn aktif={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Başlık 2">
          H2
        </ToolbarBtn>
        <ToolbarBtn aktif={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Başlık 3">
          H3
        </ToolbarBtn>
        <span className="mx-1 w-px bg-[var(--ap-border)]" />
        <ToolbarBtn aktif={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Madde işaretli liste">
          •
        </ToolbarBtn>
        <ToolbarBtn aktif={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numaralı liste">
          1.
        </ToolbarBtn>
        <span className="mx-1 w-px bg-[var(--ap-border)]" />
        <ToolbarBtn aktif={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Sola hizala">
          ≡
        </ToolbarBtn>
        <ToolbarBtn aktif={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Ortala">
          ≡
        </ToolbarBtn>
        <ToolbarBtn aktif={editor.isActive('link')} onClick={linkEkle} title="Link ekle">
          🔗
        </ToolbarBtn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
