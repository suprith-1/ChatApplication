import React, { useEffect, useState } from 'react'
import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
} from '@livekit/components-react';
import '@livekit/components-styles';
import {Room,Track} from 'livekit-client'
import { useStore } from '../store/user';

const lkServerUrl = 'wss://videostream-5v0zcm2r.livekit.cloud';

const VideoCallPage = () => {
    const {lkToken} = useStore();
    const [room] = useState(()=>new Room({adaptiveStream:true,dynacast:true}));
    useEffect(()=>{
        console.log(lkToken);
        const connect = async()=>{
            const token = lkToken;
            await room.connect(lkServerUrl,token,{
                autoSubscribe: true,
            });
        }
        if(lkToken){
            connect();
        }
        return () => {
            if(room?.state === 'connected') {
                room.disconnect();
            }
        }
    })
  return (
    <RoomContext.Provider value={room}>
        <div data-lk-theme="default" className="flex flex-col items-center justify-center w-full h-full">
            <div className="w-[80%] h-[80%]">
            <MyVideoConference />
            </div>
            <RoomAudioRenderer />
            <ControlBar variation="minimal"/>
            <style>
                {`
                    .lk-disconnect-button {
                    display: none !important;
                    }
                `}
            </style>
        </div>
    </RoomContext.Provider>
  )
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}

export default VideoCallPage
