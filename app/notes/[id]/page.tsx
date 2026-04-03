import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NotesClient from "../Notes.client";
import NotePreview from "./NotePreview.client";

interface NoteDetailsPageProps {
  params: {
    id: string;
  };
}

const NoteDetailsPage = async ({ params }: NoteDetailsPageProps) => {
  const { id } = params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <NotesClient />
        <NotePreview />
      </div>
    </HydrationBoundary>
  );
};

export default NoteDetailsPage;
