import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [{ title: "Ashveil — A Text Adventure" }];

export default function Index() {
  return (
    <main>
      <h1>Ashveil</h1>
      <p>A text adventure powered by AI. Your choices shape the story.</p>
      <form method="post" action="/api/session">
        <button type="submit">Begin Adventure</button>
      </form>
    </main>
  );
}
