import NotePreview from "@/app/notes/[id]/NotePreview.client";

interface ModalNotePageProps {
  params: {
    id: string;
  };
}

export default async function ModalNotePage({ params }: ModalNotePageProps) {
  return <NotePreview />;
}
