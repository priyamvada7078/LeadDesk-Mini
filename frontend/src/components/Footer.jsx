export default function Footer() {
  return (
    <footer className="mt-auto bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-[#334155] py-3 text-center text-xs text-slate-600 dark:text-[#CBD5E1] transition-colors duration-200 shrink-0">
      <div className="max-w-[96rem] w-full mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        <p className="font-medium text-slate-600 dark:text-[#CBD5E1]">
          Built for{' '}
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold underline underline-offset-4 decoration-blue-300 dark:decoration-blue-500/50 hover:decoration-blue-600 dark:hover:decoration-blue-400 transition-colors"
          >
            Digital Heroes
          </a>{' '}
          Training Task
        </p>
      </div>
    </footer>
  );
}
