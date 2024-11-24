import {Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import {Plus, Trash2, Settings } from 'lucide-react';

const FloatingActions = () => (
  <Fab
    mainButtonStyles={{ backgroundColor: '#0070ca' }}
    icon={<Plus />}
    event="click"
    alwaysShowTitle={true}
  >
    <Action
      text="New QR Code"
      onClick={() => {
        /* handle new QR code */
      }}
    >
      <Plus />
    </Action>
    <Action
      text="Clear History"
      onClick={() => {
        /* handle clear history */
      }}
    >
      <Trash2 />
    </Action>
    <Action
      text="Settings"
      onClick={() => {
        /* handle settings */
      }}
    >
      <Settings />
    </Action>
  </Fab>
);

export default FloatingActions;
