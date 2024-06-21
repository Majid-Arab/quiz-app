import axios from "axios";

export type Question = {
  type: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  answers?: string | null;
};

let cache: Question[] = [];

const fetchQuestion = async (): Promise<Question[]> => {
  if (cache.length > 0) {
    return cache;
  }

  let attempt = 0;
  const maxAttempts = 5;
  const retryDelay = 2000; // 2 seconds

  while (attempt < maxAttempts) {
    try {
      const response = await axios.get(`https://opentdb.com/api.php?amount=10`);
      cache = response.data.results; // Store in cache
      return response.data.results;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        console.warn(
          `Attempt ${attempt + 1} failed with status 429. Retrying...`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * (attempt + 1))
        ); // Exponential backoff
      } else {
        console.error("Error fetching the question:", error);
        throw error;
      }
    }
    attempt++;
  }

  throw new Error("Failed to fetch questions after multiple attempts");
};

export default fetchQuestion;
