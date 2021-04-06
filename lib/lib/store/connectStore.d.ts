import React, { ClassAttributes, ComponentClass, ComponentType, Dispatch, MutableRefObject, SetStateAction } from 'react';
export declare type Matching<InjectedProps, DecorationTargetProps> = {
    [P in keyof DecorationTargetProps]: P extends keyof InjectedProps ? InjectedProps[P] extends DecorationTargetProps[P] ? DecorationTargetProps[P] : InjectedProps[P] : DecorationTargetProps[P];
};
export declare type GetProps<C> = C extends ComponentType<infer P> ? C extends ComponentClass<P> ? ClassAttributes<InstanceType<C>> & P : P : never;
export declare type ConnectionState = Map<string, boolean>;
export declare type ConnectionStateSetter = Dispatch<SetStateAction<ConnectionState>>;
export declare type ConnectionStateRef = MutableRefObject<ConnectionState>;
export declare const connectStore: <MappedProps, OwnProps>(useMapStores: (ownProps: OwnProps, connectionStateRef: ConnectionStateRef, setConnectionState: ConnectionStateSetter) => MappedProps, showElementWhileConnecting?: React.ReactElement<any, string | React.JSXElementConstructor<any>> | null | undefined) => <C extends React.ComponentType<Matching<MappedProps, GetProps<C>>>>(WrappedComponent: C) => React.ComponentType<JSX.LibraryManagedAttributes<C, Omit<GetProps<C>, keyof MappedProps>>>;
