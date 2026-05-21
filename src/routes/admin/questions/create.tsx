import { createFileRoute } from "@tanstack/react-router";
import { QuestionEditor } from "@/components/admin/QuestionEditor";
import { emptyQuestion } from "@/lib/adminMock";

export const Route = createFileRoute("/admin/questions/create")({
  head: () => ({ meta: [{ title: "Create Question · Admin" }] }),
  component: CreateQuestion,
});

function CreateQuestion() {
  return <QuestionEditor initial={emptyQuestion()} mode="create" />;
}
