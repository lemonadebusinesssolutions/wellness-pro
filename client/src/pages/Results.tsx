import { useParams } from "wouter";

export default function Results() {
  const { type, resultId } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Results Page</h1>
      <p>Type: {type}</p>
      <p>Result ID: {resultId}</p>
    </div>
  );
}
