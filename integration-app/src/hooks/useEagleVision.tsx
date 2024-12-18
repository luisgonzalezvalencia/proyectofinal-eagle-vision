'use client';
import EagleVisionSdk from 'eagle-vision-sdk';
import { useState } from 'react';

export const useEagleVision = () => {
  const [sdk] = useState(
    // @ts-expect-error: we don't have configured the type for env variables
    () => new EagleVisionSdk(process.env.NEXT_PUBLIC_EAGLE_VISION_TOKEN, process.env.NEXT_PUBLIC_EAGLE_VISION_URL),
  );

  return sdk;
};

