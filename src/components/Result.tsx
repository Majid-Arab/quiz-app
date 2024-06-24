import { Text, Paper, Group, Button, Title } from "@mantine/core";
import { Question } from "../store/api";

type ResultProp = {
  questions: Question[];
  answers: string[];
};

function Result({ questions, answers }: ResultProp) {
  return (
    <>
      <Title order={1} mt={90} ta="center">
        Final Result
      </Title>
      <Paper w={500} m={"auto"} radius="md" p="xl" withBorder>
        {/* <Text>{currentQuestion.question}</Text> */}

        {questions.map((question, index) => (
          <Text>
            Question {index + 1}: {answers[index]}
            <Text>{question.question}</Text>
          </Text>
        ))}

        <Group justify="end" mt="xl">
          <Button
            type="submit"
            radius="xl"
            onClick={() => window.location.reload()}
          >
            Take Quiz Again
          </Button>
        </Group>
      </Paper>
    </>
  );
}

export default Result;
