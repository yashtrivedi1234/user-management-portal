import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserDetails } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const userDetails = useSelector((state) => state.user.userDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!userDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            No user data found
          </h2>
          <p className="text-gray-600 mt-2">Please register first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="flex items-center">
            {userDetails.avatar && (
              <img
                src={userDetails.avatar}
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover"
              />
            )}
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {userDetails.name}!
              </h1>
              <p className="text-gray-600">{userDetails.email}</p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Details
            </h2>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {userDetails.name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Email Address
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {userDetails.email}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Account Created
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date().toLocaleDateString()}
                </dd>
              </div>
            </dl>

            <div className="mt-8">
              <button
                onClick={() => {
                  dispatch(setUserDetails(null));
                  navigate("/");
                }}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
