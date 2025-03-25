import React from "react";
import { GuideAvatar } from "./GuideAvatar";

function Onboarding() {
  return (
    <div className="p-8">
      <div className="flex items-center space-x-4">
        <GuideAvatar />
        <div>
          <p className="text-xl font-bold">Welcome to the EU AI Act Onboarding Guide!</p>
          <p className="text-gray-600">
            Hi there! I'm Jack, your AI compliance guide. I'll help you navigate through the EU AI Act requirements!
          </p>
        </div>
      </div>
      {/* Rest of the onboarding content */}
    </div>
  );
}

export default Onboarding;


//GuideAvatar.js
import React from 'react';

export const GuideAvatar = () => {
  return (
    <div className="w-24 h-24 bg-yellow-300 rounded-full flex items-center justify-center">
      {/* Replace with actual image rendering logic */}
      <img src="/path/to/jack.jpg" alt="Jack" className="w-full h-full rounded-full object-cover" />
    </div>
  );
};