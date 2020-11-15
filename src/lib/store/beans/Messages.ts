// This file is auto-generated. Do not modify

// @ts-ignore: unused
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useListen, useListenEffect, useWebSocket, useServerValidation, useServerValidationEffect, UnsubscribeCallback } from 'react-use-websockets';
// @ts-ignore: unused
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Dispatch, SetStateAction } from 'react';
import { ClientErrorBean, MessageBean } from './Beans';


export const useListenForMessage =  () : (callback: (payload: MessageBean, fromSid?: string | null) => void) => UnsubscribeCallback => {
    return useListen("MESSAGE");
}

export const useListenForMessageEffect = (callback: (payload: MessageBean, fromSid?: string | null) => void): void => {
    useListenEffect("MESSAGE", callback);
}

export const useSendClientError = (): (payload: ClientErrorBean, toSid?: string | null) => void => {
    const { send } = useWebSocket();
    return (payload: ClientErrorBean, toSid?: string | null): void => {
        send("CLIENT_ERROR", payload, toSid);
    }
}

