import React, { ClassAttributes, ComponentClass, ComponentType, MutableRefObject, ReactElement } from 'react'; // importing FunctionComponent
import { useStateVariable } from 'react-use-variable';
import { StoreConnectionState, StoreMeta } from './RemoteStore';

// from redux
export type Matching<InjectedProps, DecorationTargetProps> = {
    [P in keyof DecorationTargetProps]: P extends keyof InjectedProps
        ? InjectedProps[P] extends DecorationTargetProps[P]
            ? DecorationTargetProps[P]
            : InjectedProps[P]
        : DecorationTargetProps[P];
};

// from redux
export type GetProps<C> = C extends ComponentType<infer P>
    ? C extends ComponentClass<P> ? ClassAttributes<InstanceType<C>> & P : P
    : never;


export type ConnectionMeta = Map<string, StoreMeta>

export interface ConnectionMetaSetter {
    (fn: ConnectionMetaSetterInside): void;
}

export interface ConnectionMetaSetterInside {
    (metas: Map<string, StoreMeta>): Map<string, StoreMeta>;
}

export type ConnectionMetaRef = MutableRefObject<ConnectionMeta>;

export const connectStore = <MappedProps, OwnProps>(
    useMapStores: (ownProps: OwnProps, connectionStateRef: ConnectionMetaRef, setConnectionState: ConnectionMetaSetter) => MappedProps,
    showElementWhileConnecting?: ReactElement | null,
    showElementOnError?: (errors: Array<string>) => ReactElement | null
) => <C extends ComponentType<Matching<MappedProps, GetProps<C>>>>(
    WrappedComponent: C
): ComponentType<JSX.LibraryManagedAttributes<C, Omit<GetProps<C>, keyof MappedProps>>> => {
    return (props: any) => {

        const [connectionState, connectionStateRef, setConnectionState] = useStateVariable(new Map() as ConnectionMeta);

        const newProps = useMapStores(props, connectionStateRef, setConnectionState)

        const storeMetas: Array<StoreMeta> = Array.from(connectionState.values());

        if (storeMetas.some(meta => meta.state === StoreConnectionState.ERROR || (meta.state === StoreConnectionState.ACCESS_DENIED && !meta.optional))) {
            const errors: Array<string> =
                storeMetas
                    .filter(meta => meta.state === StoreConnectionState.ERROR || meta.state === StoreConnectionState.ACCESS_DENIED)
                    .filter(meta => !!meta.errors)
                    .map(meta => meta.errors as Array<string>)
                    .reduce((a,b) => a.concat(b), []);

            return showElementOnError ? showElementOnError(errors) : <div>{errors.join(";")}</div>
        }
        
        if (storeMetas.some(meta => meta.state !== StoreConnectionState.READY)) {
            return (showElementWhileConnecting as any) || null;
        }
        return <WrappedComponent {...props} {...newProps} />
    }
}
    

