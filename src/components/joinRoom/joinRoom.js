import React, { useState } from "react";
import jwt from 'jsonwebtoken';
import uuid4 from 'uuid4';
import axios from 'axios';

const joinRoom = ({ handleSubmit, userName, roomName }) => {
  console.log('USER!!!', userName)
  const app_access_key = '6397f78ad466dc3af17f0ad2';
  const app_secret = 'S1IFrWRERMMot9rtDZvL2oQegp7PFEeSwKvyrUvJTsR1PHSooYn420fpyqb4FMW65Bn5FuYI0C5xp8g2ThDOAE-HLWpJRdy8DMjgVy7X2kWZ6Xl-PIjaXzN9pN0PoexDHJVMbgGp6kATAECxe6CrLs2Mb_F-6WdAsOkBx2X5oZI=';

  const [token, setToken] = useState('')

  const getToken = async () => {
        jwt.sign(
            {
                access_key: app_access_key,
                type: 'management',
                version: 2,
                iat: Math.floor(Date.now() / 1000),
                nbf: Math.floor(Date.now() / 1000)
            },
            app_secret,
            {
                algorithm: 'HS256',
                expiresIn: '24h',
                jwtid: uuid4()
            },
            function (err, token) {
                console.log('TOKEN!', token);
                setToken(token)
            }
        );
  }

  const createRoom = async () => {
    try {
      const response = await axios.post(
        'https://api.100ms.live/v2/rooms',
        {
          name: roomName,
          description: 'This is a sample description for the room',
          template_id: '6397fa2291796006b627f76b',
          region: 'in',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };
  // const [userName, setUserName] = useState("");
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-800">
      <div className="w-64 h-32 p-4 rounded-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            getToken()
            createRoom()
            // handleSubmit(userName);
          }}
        >
          {/*<input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            name="userName"
            className="shadow appearance-none border border-gray-400 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            placeholder="John Doe"
            required
          />*/}
          <button className="px-4 py-2 bg-blue-700 rounded-lg text-white">
            Подключиться к уроку
          </button>
        </form>
      </div>
    </div>
  );
};

export default joinRoom;