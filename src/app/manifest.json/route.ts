/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    short_name: 'Goalkeeper',
    name: 'Goalkeeper',
    icons: [
      {
        src: '/android/mipmap-mdpi/ic_launcher.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: '/android/mipmap-hdpi/ic_launcher.png',
        sizes: '72x72',
        type: 'image/png',
      },
      {
        src: '/android/mipmap-xhdpi/ic_launcher.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/android/mipmap-xxhdpi/ic_launcher.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: '/android/mipmap-xxxhdpi/ic_launcher.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
    start_url: '/',
    scope: '/',
  });
}
