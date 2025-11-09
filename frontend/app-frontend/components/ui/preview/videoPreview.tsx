'use client';

import { Box, Center, Flex, HStack } from '@chakra-ui/react';
import React, { useRef } from 'react';
import { LuAudioLines } from "react-icons/lu";

interface VideoProps {
    src: string | undefined;
    mediatype: string;
}

export default function VideoOnHover (props:VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current?.play().catch((error) => {
        console.warn('Autoplay prevented:', error);
      });
      videoRef.current.muted = false;
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.muted;
      videoRef.current.currentTime = 0; // Reset to start
    }
  };

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      w={'full'}
      h={'full'}
      overflow={'hidden'}
    >
      {props.mediatype == "video" ? (
        <Flex w='100%' h='100%' justify={'center'} align={'center'}>
          <video
              ref={videoRef}
              src={props.src}
              width="full"
              height="full"
              loop // Loop video while hovering
              preload="auto"
              style={{ objectFit: 'cover' }}
          >
              Your browser does not support the video tag.
        
          </video>
        </Flex>
      ): (
        <>
          <Flex w='100%' h='100%' justify={'center'} align={'center'}>
            <video
                ref={videoRef}
                src={props.src}
                width="full"
                height="full"
                loop // Loop video while hovering
                preload="auto"
                style={{ objectFit: 'cover', position:'absolute'}}
            >
                Your browser does not support the video tag.
          
            </video>
              <Flex pos={'relative'}>
                <LuAudioLines z={4} size={100} style={{ color: 'black' }}/>
              </Flex>
          </Flex>
          </>
      )}
    </Box>
  );
};