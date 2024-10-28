export interface RouletteItem {
  id: string;
  text: string;
  weight: number;
  color: string;
}

export interface Roulette {
  id: string;
  name: string;
  items: RouletteItem[];
}