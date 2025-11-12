type RecommendationsQuizCardProps = {
  onStart?: () => void;
};

export function RecommendationsQuizCard({ onStart }: RecommendationsQuizCardProps) {
  return (
    <section className="rounded-3xl p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex-1">
          
          <h2 className="mt-3 text-lg font-semibold text-white">
            Take our Recommendations Quiz
          </h2>
          <p className="mt-2 text-sm text-blue-100">
            Get personalized financial advice tailored to your goals.
          </p>
          <button
            type="button"
            onClick={onStart}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </section>
  );
}
