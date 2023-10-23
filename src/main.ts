import { findHubMatches } from "./faceit/matches";
import { findLeaderboardsHub } from "./faceit/leaderboards";
import { HubMatch } from "./types/faceit/hub-matches";
import { Leaderboard } from "./types/faceit/leaderboards";
import { formatEpochDate } from "./utils/date";

interface MatchesByLeaderboard {
  leaderboard: Leaderboard;
  matches: HubMatch[];
  players: Set<string>;
}

async function getHubMatches() {
  const matches = await getAllMatches();
  const leaderboards = await findLeaderboardsHub();

  const matchesByLeaderboards = groupMatchesByLeaderboard(
    matches,
    leaderboards.items
  );

  printLeaderboardMatches(matchesByLeaderboards);
}

function groupMatchesByLeaderboard(
  matches: HubMatch[],
  leaderboards: Leaderboard[]
) {
  const leaderboardsMatches: MatchesByLeaderboard[] = [];

  for (const match of matches) {
    if (match.status !== "FINISHED") continue;

    const leaderboard = leaderboards.find((lb) => {
      const startDate = lb.start_date;
      const endDate = lb.end_date;
      return match.started_at >= startDate && match.started_at <= endDate;
    });

    if (!leaderboard) continue;

    let leaderboardEntry = leaderboardsMatches.find(
      (entry) =>
        entry.leaderboard.leaderboard_name === leaderboard.leaderboard_name
    );

    if (!leaderboardEntry) {
      leaderboardEntry = { leaderboard, matches: [], players: new Set() };
      leaderboardsMatches.push(leaderboardEntry);
    }

    if (
      leaderboardEntry.matches.some((item) => item.match_id === match.match_id)
    ) {
      throw new Error("Match already in a Leaderboard");
    }

    const teams = match.teams.faction1.roster.concat(
      match.teams.faction2.roster
    );
    const players = teams.map((player) => player.nickname);

    for (const player of players) {
      if (!leaderboardEntry.players.has(player)) {
        leaderboardEntry.players.add(player);
      }
    }

    leaderboardEntry.matches.push(match);
  }

  return leaderboardsMatches;
}

function printLeaderboardMatches(matchesByLeaderboard: MatchesByLeaderboard[]) {
  for (const { leaderboard, matches, players } of matchesByLeaderboard) {
    const leaderboardStartDate = formatEpochDate(leaderboard.start_date);

    console.log(
      "-> ",
      leaderboard.leaderboard_name,
      " - ",
      leaderboardStartDate
    );
    console.log("Total de partidas: ", matches.length);
    console.log("Total de jogadoras: ", players?.size);
    
    for (const match of matches) {
      console.log(match.match_id, " - ", formatEpochDate(match.started_at));
    }
  }
}

async function getAllMatches(): Promise<HubMatch[]> {
  const matches: HubMatch[] = [];
  const seenMatchIds = new Set();

  let offset = 0;
  while (true) {
    const { items } = await findHubMatches({ limit: 100, offset });

    if (items.length === 0) break;

    for (const match of items) {
      if (match.status === "FINISHED" && !seenMatchIds.has(match.match_id)) {
        matches.push(match);
        seenMatchIds.add(match.match_id);
      }
    }

    offset += 100;
  }

  console.log("Total de partidas no HUBI -> ", matches.length);

  return matches;
}

getHubMatches();
