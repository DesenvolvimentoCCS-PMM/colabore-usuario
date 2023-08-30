export function SchedulePageSkeletonLoading() {
  return (
    <div>
      <span className="absolute top-28 text-xs bg-slate-200 text-slate-200 animate-pulse">
        /agendamentos
      </span>
      <header className="flex justify-between items-center w-full">
        <div className=" space-y-4 w-full max-w-sm">
          <h1 className="text-slate-200 bg-slate-200 w-48 h-10 animate-pulse">
            Olá,
          </h1>
          <p className="bg-slate-200 text-slate-200 animte-pulse">
            Acompanhe seu histórico e faça um novo agendamento aqui
          </p>
        </div>

        <div className="bg-slate-200 h-10 w-36 rounded-3xl animate-pulse"></div>
      </header>
      <section className="shadow-md rounded-lg bg-slate-100 animate-pulse duration-200 mt-12">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className={`h-[118px] w-full sm:w-40 bg-slate-200`}></div>

          <div className="space-y-2 w-full flex justify-center items-center flex-col sm:w-max sm:items-start">
            <div className="w-56 h-5 bg-slate-300 rounded-3xl"></div>
            <div className="w-40 h-5 bg-slate-300 rounded-3xl"></div>
          </div>

          <div className="flex items-center justify-center w-full gap-4 m-4 sm:w-max ">
            <div className="w-20 h-9 bg-slate-300 rounded-3xl"></div>

            <div className="w-10 h-6 bg-slate-300 rounded-3xl mr-6"></div>
          </div>
        </div>
      </section>

      <section className="shadow-md rounded-lg bg-slate-100 animate-pulse duration-200 mt-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className={`h-[118px] w-full sm:w-40 bg-slate-200`}></div>

          <div className="space-y-2 w-full flex justify-center items-center flex-col sm:w-max sm:items-start">
            <div className="w-56 h-5 bg-slate-300 rounded-3xl"></div>
            <div className="w-40 h-5 bg-slate-300 rounded-3xl"></div>
          </div>

          <div className="flex items-center justify-center w-full gap-4 m-4 sm:w-max ">
            <div className="w-20 h-9 bg-slate-300 rounded-3xl"></div>

            <div className="w-10 h-6 bg-slate-300 rounded-3xl mr-6"></div>
          </div>
        </div>
      </section>

      <section className="shadow-md rounded-lg bg-slate-100 animate-pulse duration-200 mt-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className={`h-[118px] w-full sm:w-40 bg-slate-200`}></div>

          <div className="space-y-2 w-full flex justify-center items-center flex-col sm:w-max sm:items-start">
            <div className="w-56 h-5 bg-slate-300 rounded-3xl"></div>
            <div className="w-40 h-5 bg-slate-300 rounded-3xl"></div>
          </div>

          <div className="flex items-center justify-center w-full gap-4 m-4 sm:w-max ">
            <div className="w-20 h-9 bg-slate-300 rounded-3xl"></div>

            <div className="w-10 h-6 bg-slate-300 rounded-3xl mr-6"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
