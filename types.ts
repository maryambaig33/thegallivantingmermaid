export interface Bookstore {
  id: string;
  name: string;
  description: string;
  image: string;
  address: string;
  tags: string[];
  website?: string;
  rating?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  groundingMetadata?: GroundingMetadata;
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  webSearchQueries?: string[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
      }[];
    };
  };
}

export enum ViewState {
  HOME = 'HOME',
  GUIDE = 'GUIDE',
}
