import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "@/app/notes/Notes.client";

interface FilteredNotesPageProps {
  params: {
    tag?: string[];
  };
}

const FilteredNotesPage = async ({ params }: FilteredNotesPageProps) => {
  const tagParam = params.tag?.[0] || "all";
  const filterTag = tagParam === "all" ? undefined : tagParam;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1, filterTag ?? "all"],
    queryFn: () => fetchNotes("", 1, 10, filterTag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={filterTag} />
    </HydrationBoundary>
  );
};

export default FilteredNotesPage;
