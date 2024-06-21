import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { Card } from "./components/Card";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Card />
    </MantineProvider>
  );
}
