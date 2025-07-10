import { makeGetDashboardMetricsUseCase } from "@/use-cases/_factories/make-get-dashboard-metrics";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getDashboardMetrics(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const useCase = makeGetDashboardMetricsUseCase();

  const metrics = await useCase.execute();

  return reply.send(metrics);
}
