// Home component for the main page


/*
<div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
    </div>
*/
export default function Home() {
  return (
    <section className="flex flex-col items-center justify-top text-center min-h-screen px-4 sm:px-20 gap-6">
      <h1 className="text-4xl font-bold text-primary mb-4">Welcome to Jam Session</h1>
      <p className="text-lg">
        Connect with fellow musicians, share your audio clips, and find the perfect bandmates for your next jam session!
      </p>

    </section>
  );
}
