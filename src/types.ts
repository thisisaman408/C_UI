export interface Feature {
    name: string;
    question: string;
    numCategories: number;
  }
  
  export interface Ratings {
    [key: string]: number;
  }
  
  export interface MappedInputs {
    [key: string]: number;
  }
  
  export interface PredictionResponse {
    prediction: number;
  }