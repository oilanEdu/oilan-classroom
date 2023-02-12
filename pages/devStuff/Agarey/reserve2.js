import {useState, useEffect, useRef} from 'react';
import { useRouter } from "next/router";
import socket from "../../../src/socket/index.js";
import ACTIONS from "../../../src/socket/actions.js";
import {v4} from 'uuid';
import useWebRTC, {LOCAL_VIDEO} from '../../../src/hooks/useWebRTC';

function layout(clientsNumber = 1) {
  const pairs = Array.from({length: clientsNumber})
    .reduce((acc, next, index, arr) => {
      if (index % 2 === 0) {
        acc.push(arr.slice(index, index + 2));
      }
      return acc;
    }, []);
  const rowsNumber = pairs.length;
  const height = 'auto';

  return pairs.map((row, index, arr) => {
    if (index === arr.length - 1 && row.length === 1) {
      return [{
        width: '100%',
        height,
      }];
    }
    return row.map(() => ({
      width: '50%',
      height,
    }));
  }).flat();
}

export default function Room() {
  const router = useRouter();
  const [room, setRoom] = useState('123');
  const [videoState, setVideoState] = useState(true)
  const [audioState, setAudioState] = useState(true)
  
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (router.query.room) {
      setRoom(router.query.room);
    }
  }, [router.query.room]);

  // console.log('CLIENTS', clients)
  console.log('router.query.room', router.query.room)

  const RenderVideo = () => {
    const { clients, provideMediaRef } = useWebRTC(room, videoState, audioState);
    const videoLayout = layout(clients.length);
    console.log('CLIENTS', clients, room)
    useEffect(() => {
      console.log('state changed')
    }, [videoState, audioState])


    return (
      clients.map((clientID, index) => (
        (clientID === LOCAL_VIDEO) ? (
          <div key={clientID} style={videoLayout[index]} id={clientID}>
            <video
              width="100%"
              height="100%"
              ref={instance => {
                provideMediaRef(clientID, instance);
              }}
              autoPlay
              playsInline
              muted={true}
            />
            {/*<button onClick={() => {
              setAudioState(!audioState)
            }}>au</button>
            <button onClick={() => {
              setVideoState(!videoState)
            }}>vi</button>*/}
          </div>
        ) : (
          <div key={clientID} style={videoLayout[index]} id={clientID}>
            <video
              width="100%"
              height="100%"
              ref={instance => {
                provideMediaRef(clientID, instance);
              }}
              autoPlay
              playsInline
              muted={false}
            />
          </div>
        )
      ))
    );
  }
  return (
    <>
      <div>
        <button onClick={() => {
          setConnected(true)
        }}>Connect</button>
        {/*<button onClick={() => {
          setConnected(false)
        }}>Disonnect</button>
        <button onClick={() => {
          setAudioState(!audioState)
        }}>au</button>
        <button onClick={() => {
          setVideoState(!videoState)
        }}>vi</button>*/}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          height: '100vh',
        }}>
          {connected?<RenderVideo/>:null}
        </div>
      </div>
    </>
  );
}