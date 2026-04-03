"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import NoteForm from "@/components/NoteForm/NoteForm";
import SearchBox from "@/components/SearchBox/SearchBox"; // Changed from SearchForm
import Modal from "@/components/Modal/Modal";
import Pagination from "@/components/Pagination/Pagination";
import css from "./Notes.module.css";
import { NotesResponse } from "@/lib/api"; // Import NotesResponse from lib/api

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

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  if (isLoading && !data) {
    return <p>Loading notes...</p>;
  }

  if (isError) {
    return <p>Error loading notes: {error.message}</p>;
  }

  return (
    <div className={css.container}>
      <h1 className={css.title}>My Notes</h1>
      <div className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        <button onClick={openModal} className={css.button}>
          Create New Note
        </button>
      </div>
      {notes.length > 0 ? (
        <>
          <NoteList notes={notes} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p>No notes found.</p>
      )}

      {isModalOpen && (
        <Modal title="Create New Note" onClose={closeModal}>
          <NoteForm onCancel={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default NotesClient;
