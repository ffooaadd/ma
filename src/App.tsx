import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <h2 className="text-2xl font-bold text-blue-600">IraqEdu Platform</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 p-8">
        <Content />
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const announcements = useQuery(api.announcements.list);
  const courses = useQuery(api.courses.list);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Unauthenticated>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to IraqEdu Platform</h1>
          <p className="text-xl text-gray-600">Sign in to access your educational resources</p>
          <SignInForm />
        </div>
      </Unauthenticated>
      
      <Authenticated>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Latest Announcements</h2>
            <div className="space-y-4">
              {announcements?.map((announcement) => (
                <div
                  key={announcement._id}
                  className={`p-4 rounded-lg border ${
                    announcement.important ? "bg-red-50 border-red-200" : "bg-white border-gray-200"
                  }`}
                >
                  <h3 className="font-semibold">{announcement.title}</h3>
                  <p className="text-gray-600">{announcement.content}</p>
                  <p className="text-sm text-gray-500 mt-2">By {announcement.authorName}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Available Courses</h2>
            <div className="space-y-4">
              {courses?.map((course) => (
                <div
                  key={course._id}
                  className="p-4 rounded-lg border border-gray-200 bg-white"
                >
                  <h3 className="font-semibold">{course.title}</h3>
                  <p className="text-gray-600">{course.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                      {course.level}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                      {course.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Instructor: {course.instructorName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Authenticated>
    </div>
  );
}
