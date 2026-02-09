import type { PersonSelector, SendResponse } from "../../Utils/Types";

const url = import.meta.env.VITE_BACKEND_URL;
const FILE_UPLOAD_ENABLED = import.meta.env.VITE_ENABLE_FILE_UPLOAD !== "false";

type SendMessageParams = {
  alunos?: Array<PersonSelector>;
  turmaId?: number;
  text?: string;
  file?: File;
  caption?: string;
};

export const useSendMessage = async ({
  alunos,
  turmaId,
  text,
  file,
  caption,
}: SendMessageParams): Promise<SendResponse[]> => {
  const hasText = Boolean(text && text.trim());
  const hasFile = Boolean(file);

  const hasAlunos = Boolean(alunos && alunos.length > 0);
  const hasTurmaId = Boolean(turmaId);

  if (hasFile && !FILE_UPLOAD_ENABLED) {
    throw new Error("File upload is currently disabled");
  }

  if (hasText === hasFile) {
    throw new Error("You must provide either text or file, but not both");
  }

  if (hasAlunos === hasTurmaId) {
    throw new Error("You must provide either alunos or turmaId, but not both");
  }

  const payload = buildPayload(alunos, turmaId, text, file, caption);

  const response = await fetch(`${url}/whatsapp/send`, {
    method: "POST",
    credentials: "include",
    body: payload,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to send message");
  }

  return await response.json();
};

const buildPayload = (
  alunos?: Array<PersonSelector>,
  turmaId?: number,
  text?: string,
  file?: File,
  caption?: string,
): FormData => {
  const formdata = new FormData();

  if (alunos) {
    formdata.append("recepients", JSON.stringify(alunos));
  }

  if (text) formdata.append("text", text);

  if (turmaId) formdata.append("turmaId", turmaId.toString());

  if (file) formdata.append("file", file);

  if (caption) formdata.append("caption", caption);

  return formdata;
};
