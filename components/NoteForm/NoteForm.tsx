"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addNote } from "@/lib/api";
import { NoteFormData } from "@/types/note";
import css from "./NoteForm.module.css";

export interface NoteFormProps {
  onCancel?: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title is too short")
    .required("Title is required"),
  content: Yup.string()
    .max(500, "Content must be less than 500 characters")
    .optional(),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
    .required("Tag is required"),
});

const initialValues: NoteFormData = {
  title: "",
  content: "",
  tag: "",
};

const NoteForm = ({ onCancel }: NoteFormProps) => {
  const queryClient = useQueryClient();

  const addNoteMutation = useMutation({
    mutationFn: addNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel?.();
    },
  });

  const handleSubmit = (values: NoteFormData) => {
    addNoteMutation.mutate(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field name="title" type="text" className={css.input} />
            <ErrorMessage name="title" component="div" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content (optional)</label>
            <Field name="content" as="textarea" className={css.textarea} />
            <ErrorMessage
              name="content"
              component="div"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field name="tag" as="select" className={css.select}>
              <option value="" label="Select a tag" />
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="div" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              onClick={onCancel}
              className={css.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || addNoteMutation.isPending}
              className={css.submitButton}
            >
              {addNoteMutation.isPending ? "Adding..." : "Add Note"}
            </button>
          </div>
          {addNoteMutation.isError && (
            <p className={css.error}>Error: {addNoteMutation.error?.message}</p>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
