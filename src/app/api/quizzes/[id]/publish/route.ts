import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const quiz = await prisma.quiz.findUnique({ where: { id: params.id } });
  if (!quiz) return new Response("Not found", { status: 404 });
  const slug = nanoid(8);
  await prisma.quiz.update({ where: { id: params.id }, data: { publicSlug: slug, isPublished: true } });
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/q/${slug}`;
  return new Response(JSON.stringify({ url }), { status: 200 });
}
