import { ImageResponse } from 'next/og';
import DiscoFavicon from "@/components/DiscoFavicon";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/svg+xml';

export default function Icon() {
  return new ImageResponse(
    (
      <DiscoFavicon />
    ),
    {
      ...size
    }
  );
}
