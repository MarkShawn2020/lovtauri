export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">About</h1>
      <p className="text-muted-foreground max-w-2xl text-center">
        This is a Tauri + React + TypeScript boilerplate by lovstudio. It includes React Router,
        shadcn/ui, Tailwind CSS, and Zustand for state management.
      </p>
    </div>
  );
}
