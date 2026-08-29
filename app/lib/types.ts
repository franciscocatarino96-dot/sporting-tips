export type Competition = "liga" | "champions";

export type Prediction = {
  id: string;
  userCode: string;
  userName: string;
  gameId: number;
  round: number;
  homeGoals: number;
  awayGoals: number;
  points: number;
  game: any;

  // Liga ou Champions
  // É opcional para manter compatibilidade
  // com os palpites antigos da Liga.
  competition?: Competition;
};