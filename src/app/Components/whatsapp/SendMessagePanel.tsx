import { useState } from "react";
import { useSendMessage } from "./useSendMessage";

type SendMessagePanelProps = {
  turmaNome?: string;
  turmaId?: string;
  alunoNome?: string;
  alunoId?: number;
};

function SendMessagePanel({
  turmaNome,
  turmaId,
  alunoNome,
  alunoId,
}: SendMessagePanelProps) {
  const [text, setText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  return (
    <div>
      <div><div></div></div>
    </div>
  );
}
