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
};