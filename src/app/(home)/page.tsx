import Link from "next/link";

export default function HomePage() {
  const modules = [
    { name: "Project", href: "/project" },
    { name: "Task", href: "/task" },
    { name: "SCMS", href: "/scms/admin" },
    { name: "Notification", href: "/notification" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h2 className="text-3xl font-bold mb-8">Welcome to Supply Chain Management System</h2>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {modules.map((mod) => (
          <Link
            key={mod.name}
            href={mod.href}
            className="bg-white border border-gray-200 p-6 rounded-2xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold">{mod.name}</h3>
            <p className="text-gray-500 mt-2">Go to {mod.name} module →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
