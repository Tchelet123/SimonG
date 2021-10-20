export type Game = {
  id: Date;
  name: string;
  score: number;
};
export type InitialState = {
  games: Game[];
};
export type ActionGame = {
  type: string;
  name: string;
  score: number;
  id: Date;
};

