export default function ProfilePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-8">
      <header>
        <h1 className="text-4xl font-semibold">Your Profile</h1>
        <p className="text-lg text-muted-foreground">
          Manage account details and personal preferences here.
        </p>
      </header>
      <section className="rounded-lg border border-border p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Profile fields will show up here once connected to the backend.
        </p>
      </section>
    </main>
  );
}
