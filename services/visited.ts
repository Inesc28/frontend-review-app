import { api } from "@/lib/api";
import { placeSchema } from "@/models/Place";

export const getUserVisited = async (userId: number, cursor?: number) => {
  const res = await api.get(
    `/visited/${userId}/${cursor ? "?cursor=" + cursor : ""}`,
  );

  return {
    data: placeSchema.array().parse(
      res.data.data.map((d: any) => ({
        ...d,
        createdAt: d.created_at.slice(0, 27),
        updatedAt: d.updated_at.slice(0, 27),
      })),
    ),
    next: res.data.next_cursor || undefined,
  };
};
