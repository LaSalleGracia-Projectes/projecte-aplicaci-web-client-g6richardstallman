import Header from "../components/layout/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Bienvenido a Eventflix</h1>
      </main>
    </>
  );
}