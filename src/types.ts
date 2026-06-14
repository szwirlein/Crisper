export type Recipe = {
  id: string;
  name: string;
  ingredients: string[];
  instructions?: string[];
};

export type ShoppingItem = {
  id: string;
  text: string;
  checked: boolean;
};
