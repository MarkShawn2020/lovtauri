export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6 pb-24 sm:pb-6 sm:px-6 md:px-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4">About</h1>
      <div className="bg-muted rounded-xl p-4 sm:p-6 w-full max-w-lg">
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          This is a Tauri + React + TypeScript boilerplate by lovstudio. It includes React Router,
          shadcn/ui, Tailwind CSS, and Zustand for state management.
        </p>
      </div>
    </div>
  );
}
