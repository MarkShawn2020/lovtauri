import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function Home() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-6 pb-24 sm:pb-6 sm:px-6 md:px-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 text-center leading-tight">
        Welcome to Lovtauri
      </h1>
      <p className="text-sm text-muted-foreground mb-6 sm:mb-8">An opinionated Tauri starter, crafted by Lovstudio.</p>

      <div className="flex items-center gap-4 mb-6 sm:mb-8">
        <img src="/lovpen-logo.svg" className="h-20 sm:h-24 md:h-28" alt="Lovtauri" />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
        className="flex flex-col gap-3 w-full max-w-sm"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name..."
          className="px-4 py-3 border rounded-xl bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
        />
        <button
          type="submit"
          className="px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium text-base active:scale-[0.98] transition-transform"
        >
          Greet
        </button>
      </form>

      {greetMsg && (
        <div className="mt-6 p-4 bg-muted rounded-xl w-full max-w-sm">
          <p className="text-base text-center">{greetMsg}</p>
        </div>
      )}
    </div>
  );
}
