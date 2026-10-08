export interface Feedback {
  id: string;
  requestId: string;
  citizenId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  citizen?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateFeedbackPayload {
  rating: number;
  comment: string;
}
