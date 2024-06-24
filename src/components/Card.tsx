import {
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Checkbox,
  Title,
  Radio,
  Flex,
} from "@mantine/core";
import { useEffect, useState } from "react";
import fetchQuestion, { Question } from "../store/api";
import Result from "./Result";

export function Card(props: PaperProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [question, setQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string[]>([]);
  const [seconds, setSeconds] = useState(30);
  const [questionCount, setQuestionCount] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetchQuestion();
        setQuestions(response);
      } catch (error) {
        console.error("Error Fetching Questions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      handleNextQuestion();
      setSeconds(30);
    }

    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [question, seconds]);

  const handleNextQuestion = () => {
    if (question !== 10) {
      setQuestion((prev) => (prev + 1) % questions.length);
      setQuestionCount((prev) => prev + 1);
      setSeconds(0);
    } else {
      setQuestionCount(10);
      setQuizCompleted;
      setSeconds(0);
    }
  };

  const handleAnswerChange = (answer: string[]) => {
    setSelectedAnswer(answer);
    console.log(answer);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[question];

  if (!currentQuestion) {
    return <div>No questions available.</div>;
  }

  if (quizCompleted) {
    return <Result questions={questions} answers={selectedAnswer} />;
  }

  const options =
    currentQuestion.type === "boolean"
      ? ["True", "False"]
      : [
          currentQuestion.correct_answer,
          ...currentQuestion.incorrect_answers,
        ].sort();

  return (
    <>
      <Title order={1} mt={90} ta="center">
        Trivia Quiz {questionCount}
      </Title>
      <Paper w={500} m={"auto"} radius="md" p="xl" withBorder {...props}>
        <Text>{currentQuestion.question}</Text>

        {currentQuestion.type === "multiple" && (
          <Flex
            pt={40}
            gap="md"
            justify="flex-start"
            align="flex-start"
            direction="column"
            wrap="wrap"
          >
            {options.map((answer, index) => (
              <Checkbox
                key={index}
                label={answer}
                value={answer}
                checked={selectedAnswer === answer}
                onChange={() => handleAnswerChange(answer)}
              />
            ))}
          </Flex>
        )}

        {currentQuestion.type === "boolean" && (
          <Group>
            {options.map((answer, index) => (
              <Radio
                key={index}
                label={answer}
                value={answer}
                checked={selectedAnswer === answer}
                onChange={() => handleAnswerChange(answer)}
              />
            ))}
          </Group>
        )}

        <Group justify="end" mt="xl">
          <Text>{seconds}</Text>
          <Button type="submit" radius="xl" onClick={handleNextQuestion}>
            {question !== 5 ? "Next" : "Submit"}
          </Button>
        </Group>
      </Paper>
    </>
  );
}
