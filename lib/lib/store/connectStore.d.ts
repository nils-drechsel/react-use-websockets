import React, { ClassAttributes, ComponentClass, ComponentType, Dispatch, MutableRefObject, ReactElement, SetStateAction } from 'react';
export type Matching<InjectedProps, DecorationTargetProps> = {
    [P in keyof DecorationTargetProps]: P extends keyof InjectedProps ? InjectedProps[P] extends DecorationTargetProps[P] ? DecorationTargetProps[P] : InjectedProps[P] : DecorationTargetProps[P];
};
export type GetProps<C> = C extends ComponentType<infer P> ? C extends ComponentClass<P> ? ClassAttributes<InstanceType<C>> & P : P : never;
export type ConnectionState = Map<string, boolean>;
export type ConnectionStateSetter = Dispatch<SetStateAction<ConnectionState>>;
export type ConnectionStateRef = MutableRefObject<ConnectionState>;
export declare const connectStore: <MappedProps, OwnProps>(useMapStores: (ownProps: OwnProps, connectionStateRef: ConnectionStateRef, setConnectionState: ConnectionStateSetter) => MappedProps, showElementWhileConnecting?: ReactElement | null) => <C extends React.ComponentType<Matching<MappedProps, GetProps<C>>>>(WrappedComponent: C) => React.ComponentType<JSX.LibraryManagedAttributes<C, Omit<GetProps<C>, keyof MappedProps>>>;
