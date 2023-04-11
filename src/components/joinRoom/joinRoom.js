import React, { useEffect, useState } from "react";
import jwt from 'jsonwebtoken';
import uuid4 from 'uuid4';
import axios from 'axios';
import globals from "../../globals";
import styles from "../../../pages/lesson/lesson.module.css"

const joinRoom = ({ handleSubmit, userName, roomName, token, setToken, setIdOfNewRoom, idOfNewRoom }) => {
  console.log('USER!!!', userName);
  const app_access_key = '6397f78ad466dc3af17f0ad2';
  const app_secret = 'S1IFrWRERMMot9rtDZvL2oQegp7PFEeSwKvyrUvJTsR1PHSooYn420fpyqb4FMW65Bn5FuYI0C5xp8g2ThDOAE-HLWpJRdy8DMjgVy7X2kWZ6Xl-PIjaXzN9pN0PoexDHJVMbgGp6kATAECxe6CrLs2Mb_F-6WdAsOkBx2X5oZI=';

  // const [token, setToken] = useState('')
  useEffect(() => {
    if (token.length > 5) {
      createRoom() 
    }
  }, [token])
  useEffect(() => {
    if (idOfNewRoom != undefined) {
      // debugger
      handleSubmit(userName);
    }
  }, [idOfNewRoom])

  const getToken = async () => {
        let serverTime = await axios.get(`${globals.productionServerDomain}/getServerTime`)
        // console.log(new Date(serverTime.data), "serverTime");
        // console.log(new Date(), "computer time");
        await jwt.sign(
            {
                access_key: app_access_key,
                type: 'management',
                version: 2,
                iat: Math.floor(new Date(serverTime.data).getTime() / 1000),
                nbf: Math.floor(new Date(serverTime.data).getTime() / 1000)
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
    // debugger
    console.log('111 IN JOIN ROOM', roomName)
    console.log("111 token", token);
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
      console.log('111 response.data',response.data)
      setIdOfNewRoom(response.data.id)
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className={styles.allReady}>
    {/* <p>Всё готово и настроено</p>
    <button>Присоедениться к уроку</button> */}
    <h1 style={{color: "white", marginBottom: "40px"}}>Всё готово и настроено</h1>
    <form
          style={{textAlign: "end"}}
          onSubmit={(e) => {
            e.preventDefault();
            getToken()
            // createRoom()
            // handleSubmit(userName);
          }}
        >
          <button 
            style={{
              background: "#ffffff",
              borderRadius: "5px",
              border: "none",
              marginBottom: "15%",
              color: "black",
              fontSize: "24px",
              padding: "20px 40px"
            }}
            // className="px-4 py-2 bg-blue-700 rounded-lg text-white"
          >
            <span
              style={{
                // background: "url(https://realibi.kz/file/892662.png) no-repeat",
                // backgroundPosition: "right",
                // backgroundSize: "18px",
                // paddingRight: "30px",
              }}
            >
              Присоедениться к уроку
            </span>
          </button>
        </form>
    </div>
  );
};

export default joinRoom;