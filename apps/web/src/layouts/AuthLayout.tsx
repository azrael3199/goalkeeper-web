import { Outlet, Link } from "react-router-dom";
import { Target } from "lucide-react";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 justify-center"
          >
            <div className="w-10 h-10 bg-[#1A3C6E] rounded-xl flex items-center justify-center">
              <Target size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-[#1A3C6E] tracking-tight">
              GoalKeeper
            </h1>
          </Link>
          <p className="text-zinc-500 mt-2 text-sm">
            Turn ambition into achievement — together.
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
