import React from 'react';
import QRCode from 'qrcode';
import * as svg from 'polotno/utils/svg';
import logo from '../assets/logo.png';

// create svg image for QR code for input text
export async function getQR(text) {
  return new Promise((resolve) => {
    QRCode.toString(
      text || 'no-data',
      {
        type: 'svg',
        color: {
          dark: '#000', // Blue dots
          light: '#fff', // Transparent background
        },
      },
      (err, string) => {
        resolve(svg.svgToURL(string));
      }
    );
  });
}

// define the new custom section
export const LogoSection = {
  name: 'qr',
  Tab: (props) => (
      <div className=' md:py-4 max-md:px-4 flex'>
        <img src={logo} alt='logo' className='mx-auto mt-auto mb-1 md:h-[42px] max-md:h-[36px]'  />
      </div>
  ),
  // we need observer to update component automatically on any store changes
  Panel: null
};
