import { prisma } from "../lib/prisma";
import { publishEvents } from "../lib/events";


export async function reviewKyc(docId: string, status: "PENDING" | "SUBMITTED" | "APPROVED" | "REJECTED", decision: string) {
  const doc = await prisma.kycDocument.findUnique({ where: { id: docId } });

  if (!doc) throw new Error("KYC document not found");

  await prisma.kycDocument.update({
    where: { id: docId },
    data: { status },
  });

  await publishEvents("kyc.reviewed", { docId, userId: doc.userId, decision });
}