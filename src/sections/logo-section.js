import React from 'react';
import { observer } from 'mobx-react-lite';
import { SectionTab } from 'polotno/side-panel';
import QRCode from 'qrcode';
import * as svg from 'polotno/utils/svg';
import logo from '../assets/logo.svg';
import { Button, InputGroup } from '@blueprintjs/core';

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
      <div className='h-[100px] flex'>
        <img src={logo} alt='logo' className='mx-auto my-auto'  />
      </div>
  ),
  // we need observer to update component automatically on any store changes
  Panel: null
};
