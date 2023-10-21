import { faceitOpenClient } from "src/faceit/api";
import { FaceitLeaderboard } from "src/types/faceit/leaderboards";

export async function findLeaderboardsHub(
  limit = 20,
  offset = 0
): Promise<FaceitLeaderboard> {
  const response = await faceitOpenClient.get(
    `/leaderboards/hubs/${process.env.HUB_ID}`,
    { params: { limit, offset } }
  );

  return response.data;
}
