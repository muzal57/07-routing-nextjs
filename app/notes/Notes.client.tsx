"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import NoteForm from "@/components/NoteForm/NoteForm";
import SearchBox from "@/components/SearchBox/SearchBox";
import Modal from "@/components/Modal/Modal";
import Pagination from "@/components/Pagination/Pagination";
import css from "@/app/notes/Notes.module.css";
import { NotesResponse } from "@/lib/api";

interface NotesClientProps {
  tag?: string;
}

const NotesClient = ({ tag }: NotesClientProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce logic for search query
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset page on new search
    }, 500); // 500ms debounce delay

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const { data, isLoading, isError, error } = useQuery<NotesResponse, Error>({
    queryKey: ["notes", debouncedSearchQuery, currentPage, tag ?? "all"],
    queryFn: () => fetchNotes(debouncedSearchQuery, currentPage, 10, tag),
    placeholderData: (previousData) => previousData, // For smooth pagination
  });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleModalOpen = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  if (isError) {
    return <div className={css.error}>Error: {error?.message}</div>;
  }

  return (
    <div className={css.container}>
      <div className={css.header}>
        <h1>Notes {tag ? `filtered by ${tag}` : ""}</h1>
        <button onClick={handleModalOpen} className={css.addButton}>
          Add Note
        </button>
      </div>
      <SearchBox onSearch={handleSearch} />
      {isLoading ? (
        <div className={css.loading}>Loading notes...</div>
      ) : (
        <>
          <NoteList notes={data?.notes || []} />
          <Pagination
            currentPage={currentPage}
            totalPages={data?.totalPages || 1}
            onPageChange={handlePageChange}
          />
        </>
      )}
      {isModalOpen && (
        <Modal title="Add New Note" onClose={handleModalClose}>
          <NoteForm onCancel={handleModalClose} />
        </Modal>
      )}
    </div>
  );
};

export default NotesClient;
