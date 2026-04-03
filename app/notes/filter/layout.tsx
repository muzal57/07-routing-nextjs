import css from "./filter.module.css";

type FilterLayoutProps = {
  children:
    | React.ReactNode
    | {
        children?: React.ReactNode;
        sidebar?: React.ReactNode;
      };
};

export default function FilterLayout({ children }: FilterLayoutProps) {
  const slot = (children as any)?.sidebar ?? null;
  const content = (children as any)?.children ?? (children as React.ReactNode);

  return (
    <div className={css.container}>
      <aside className={css.sidebar}>{slot as React.ReactNode}</aside>
      <section className={css.content}>{content as React.ReactNode}</section>
    </div>
  );
}
