export function ScheduleSkeletonLoading() {
  return (
    <section className="shadow-md rounded-lg bg-slate-100 animate-pulse duration-200 mt-4">
      <div className="flex items-center justify-between">
        <div className={`h-[118px] w-40 bg-slate-200`}></div>

        <div className="space-y-2">
          <div className="w-56 h-5 bg-slate-300 rounded-3xl"></div>
          <div className="w-40 h-5 bg-slate-300 rounded-3xl"></div>
        </div>

        <div className="w-36 h-9 bg-slate-300 rounded-3xl"></div>

        <div className="w-20 h-9 bg-slate-300 rounded-3xl"></div>

        <div className="w-10 h-6 bg-slate-300 rounded-3xl mr-6"></div>
      </div>
    </section>
  );
}
