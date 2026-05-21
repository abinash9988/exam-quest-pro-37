import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { QuestionEditor } from "@/components/admin/QuestionEditor";
import { getQuestion } from "@/lib/adminMock";

export const Route = createFileRoute("/admin/questions/edit/$id")({
  head: ({ params }) => ({ meta: [{ title: `Edit ${params.id} · Admin` }] }),
  loader: ({ params }) => {
    const q = getQuestion(params.id);
    if (!q) throw notFound();
    return q;
  },
  component: EditQuestion,
  notFoundComponent: () => (
    <div className="rounded-2xl border border-border bg-card p-8 text-center">
      <h2 className="text-lg font-bold">Question not found</h2>
      <p className="mt-1 text-sm text-muted-foreground">It may have been deleted or archived.</p>
      <Link to="/admin/questions" className="mt-4 inline-block rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">Back to list</Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="rounded-2xl border border-border bg-card p-8 text-center">
      <h2 className="text-lg font-bold">Couldn't load question</h2>
      <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
      <button onClick={reset} className="mt-4 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">Retry</button>
    </div>
  ),
});

function EditQuestion() {
  const q = Route.useLoaderData();
  return <QuestionEditor initial={q} mode="edit" />;
}
