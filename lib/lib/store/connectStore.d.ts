import React from 'react';
import { Matching, GetProps } from 'react-redux';
export declare const connectStore: <MappedProps, OwnProps>(useMapStores: (ownProps: OwnProps) => MappedProps) => <C extends React.ComponentType<Matching<MappedProps, GetProps<C>>>>(WrappedComponent: C) => React.ComponentType<JSX.LibraryManagedAttributes<C, Pick<GetProps<C>, Exclude<keyof GetProps<C>, keyof MappedProps>>>>;
