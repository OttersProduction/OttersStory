import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Otters Story Washing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Welcome to the washing tools dashboard for the Otters Story project
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Getting Started
            </h2>
            <p className="text-gray-600">
              This is a Next.js application with Tailwind CSS. Start building
              your washing tools here!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
