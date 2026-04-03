import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

interface FilteredNotesPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

const FilteredNotesPage = async ({ params }: FilteredNotesPageProps) => {
  const resolvedParams = await params;
  const slugParam = resolvedParams.slug?.[0] || "all";
  const filterTag = slugParam === "all" ? undefined : slugParam;

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
