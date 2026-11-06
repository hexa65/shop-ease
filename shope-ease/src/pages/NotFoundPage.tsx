import { Link } from "react-router";

function NotFoundPage() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-6xl font-extrabold tracking-tight text-indigo-600 sm:text-8xl">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-3 text-slate-600">
        Sorry, we could not find the page you are looking for. It may have been
        moved or the address may be wrong.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
      >
        Back to home
      </Link>
    </section>
  );
}

export default NotFoundPage;