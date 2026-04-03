import { fetchNoteById } from "@/lib/api";
import { notFound } from "next/navigation";

interface ModalNotePageProps {
  params: {
    id: string;
  };
}

export default async function ModalNotePage({ params }: ModalNotePageProps) {
  const note = await fetchNoteById(params.id);

  if (!note) {
    notFound();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <article
        style={{
          background: "white",
          padding: 24,
          borderRadius: 12,
          maxWidth: 560,
          width: "min(100%, 560px)",
        }}
      >
        <h2>{note.title}</h2>
        <p>{note.content}</p>
      </article>
    </div>
  );
}
