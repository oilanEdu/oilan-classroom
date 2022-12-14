import React from "react";
import VideoTile from "../videoTile/videoTile";
import {
  useHMSStore,
  selectLocalPeer,
  selectPeers
} from "@100mslive/hms-video-react";
import ControlBar from "../ControlBar/ControlBar";

const Conference = () => {
  const localPeer = useHMSStore(selectLocalPeer);
  const peers = useHMSStore(selectPeers);
  return (
    <div className="flex flex-col">
      <div className="flex bg-gray-900 w-screen min-h-screen p-2 flex-wrap">
        {localPeer && <videoTile peer={localPeer} isLocal={true} />}
        {peers &&
          peers
            .filter((peer) => !peer.isLocal)
            .map((peer) => {
              return (    
                  <videoTile isLocal={false} peer={peer} />
              );
            })}
      </div>
      <ControlBar />
    </div>
 );
};

export default Conference;