import React from "react";
import { useParams } from "react-router-dom";
import EngineerForm from "@/components/engineerForm/EngineerForm";
import { useGetUserByIdQuery } from "@/api-service/user/user.api";

export default function HREngineerProfile() {
  const { id } = useParams<{ id: string }>();

  const {
    data: engineerData,
    isLoading,
    error,
  } = useGetUserByIdQuery(id!, {
    skip: !id, // Skip the query if no id is provided
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading engineer data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Engineer Data
          </h2>
          <p className="text-gray-600 mb-4">
            Unable to load engineer information. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!engineerData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-yellow-500 text-xl mb-2">📋</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Engineer Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The engineer with ID "{id}" could not be found.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <EngineerForm mode="edit" initialData={engineerData} />
    </>
  );
}
