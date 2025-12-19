import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function Home() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to lovstudio Tauri Boilerplate</h1>

      <div className="flex items-center gap-4 mb-8">
        <img src="/lovpen-logo.svg" className="h-24" alt="Lovstudio" />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
        className="flex gap-2 mb-4"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name..."
          className="px-4 py-2 border rounded-md"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
        >
          Greet
        </button>
      </form>

      {greetMsg && <p className="text-lg">{greetMsg}</p>}
    </div>
  );
}
