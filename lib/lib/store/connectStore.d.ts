import React, { ClassAttributes, ComponentClass, ComponentType, MutableRefObject, ReactElement } from 'react';
import { StoreMeta } from './RemoteStore';
export type Matching<InjectedProps, DecorationTargetProps> = {
    [P in keyof DecorationTargetProps]: P extends keyof InjectedProps ? InjectedProps[P] extends DecorationTargetProps[P] ? DecorationTargetProps[P] : InjectedProps[P] : DecorationTargetProps[P];
};
export type GetProps<C> = C extends ComponentType<infer P> ? C extends ComponentClass<P> ? ClassAttributes<InstanceType<C>> & P : P : never;
export type ConnectionState = Map<string, StoreMeta>;
export interface ConnectionMetaSetter {
    (fn: ConnectionMetaSetterInside): void;
}
export interface ConnectionMetaSetterInside {
    (metas: Map<string, StoreMeta>): Map<string, StoreMeta>;
}
export type ConnectionStateRef = MutableRefObject<ConnectionState>;
export declare const connectStore: <MappedProps, OwnProps>(useMapStores: (ownProps: OwnProps, connectionStateRef: ConnectionStateRef, setConnectionState: ConnectionMetaSetter) => MappedProps, showElementWhileConnecting?: ReactElement | null, showElementOnError?: ((errors: Array<string>) => ReactElement | null) | undefined) => <C extends React.ComponentType<Matching<MappedProps, GetProps<C>>>>(WrappedComponent: C) => React.ComponentType<JSX.LibraryManagedAttributes<C, Omit<GetProps<C>, keyof MappedProps>>>;
