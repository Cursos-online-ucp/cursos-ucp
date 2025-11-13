export interface Chat {
  id: number;
  name: string;
  type: "chat" | "group" | "forum";
  createdAt: string;
  lastMessage?: string;
}

export async function createChatMock(payload: { name: string; type: Chat["type"] }): Promise<Chat> {
  return new Promise((res) =>
    setTimeout(
      () =>
        res({
          id: Date.now(),
          name: payload.name,
          type: payload.type,
          createdAt: new Date().toISOString(),
        }),
      400
    )
  );
}
