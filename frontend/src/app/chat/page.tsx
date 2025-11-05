import Link from "next/link";

export default function ChatPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-semibold">Chat with the Assistant</h1>
      <p className="text-center text-lg text-muted-foreground">
        Start a conversation with the AI assistant. This page will stream messages and show responses in real time.
      </p>
      <Link
        href="/"
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground shadow-sm"
      >
        Back to Home
      </Link>
    </main>
  );
}
