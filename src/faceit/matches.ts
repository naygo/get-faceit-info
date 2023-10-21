import { FaceitHubMatches } from "src/types/faceit/hub-matches";
import { faceitOpenClient } from "./api";

export async function findHubMatches({
  limit = 20,
  offset = 0,
}): Promise<FaceitHubMatches> {
  const response = await faceitOpenClient.get(
    `/hubs/${process.env.HUB_ID}/matches`,
    { params: { limit, offset } }
  );

  return response.data;
}
