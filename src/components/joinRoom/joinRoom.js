import React, { useState } from "react";

const joinRoom = ({ handleSubmit, userName }) => {
  console.log('USER!!!', userName);
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-800">
      <div className="w-64 h-32 p-4 rounded-lg">
        <form
          style={{textAlign: "end"}}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(userName);
          }}
        >
          <button 
            style={{
              background: "#007AFF",
              borderRadius: "8px",
              border: "none"
            }}
            className="px-4 py-2 bg-blue-700 rounded-lg text-white"
          >
            <span
              style={{
                background: "url(https://realibi.kz/file/892662.png) no-repeat",
                backgroundPosition: "right",
                backgroundSize: "18px",
                paddingRight: "30px",
              }}
            >
              Подключиться к уроку
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default joinRoom;