import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

const NotesPage = async () => {
  const queryClient = new QueryClient();

  // Попередньо завантажуємо список нотаток (початковий стан: порожній пошук, 1-ша сторінка)
  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1, "all"],
    queryFn: () => fetchNotes("", 1, 10),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
};

export default NotesPage;
