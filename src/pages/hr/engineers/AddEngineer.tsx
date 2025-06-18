import React, { useState } from "react";
import { ArrowLeft, Save, UserPlus, ChevronRight } from "lucide-react";
import EngineerForm from "@/components/engineerForm/EngineerForm";

const AddEngineer = () => {
  return (
    <EngineerForm
      mode="add"
      onSubmit={(data, action) => {
        // Handle submission
        // action can be "save" or "saveAndAdd"
      }}
      onCancel={() => {
        // Handle cancel
      }}
    />

    // <EngineerForm
    //   mode="edit"
    //   onSubmit={(data, action) => {
    //     // Handle submission
    //     // action can be "save" or "saveAndAdd"
    //   }}
    //   onCancel={() => {
    //     // Handle cancel
    //   }}
    // />
  );
};

export default AddEngineer;
