// This file is auto-generated. Do not modify

// @ts-ignore: unused
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useListen, useListenEffect, useWebSocket, useServerValidation, useServerValidationEffect, UnsubscribeCallback } from 'react-use-websockets';
// @ts-ignore: unused
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Dispatch, SetStateAction } from 'react';
import { MessageBean } from './Beans';


export const useListenForMessage =  () : (callback: (payload: MessageBean, fromSid?: string | null) => void) => UnsubscribeCallback => {
    return useListen("MESSAGE");
}

export const useListenForMessageEffect = (callback: (payload: MessageBean, fromSid?: string | null) => void): void => {
    useListenEffect("MESSAGE", callback);
}

