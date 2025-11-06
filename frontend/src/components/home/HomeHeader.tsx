type HomeHeaderProps = {
  balance: string;
};

export function HomeHeader({ balance }: HomeHeaderProps) {
  return (
    <header className="sticky top-0 z-0 bg-[#1c3d8f] text-white shadow-lg">
      <div className="mx-auto w-full max-w-3xl px-6 pb-8 pt-8">
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>

        <div className="mt-8">
          <span className="text-sm uppercase tracking-wide text-blue-100">
            Total Balance
          </span>
          <p className="mt-2 text-4xl font-semibold">{balance}</p>
        </div>
      </div>
    </header>
  );
}
