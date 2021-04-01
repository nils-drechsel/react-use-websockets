import React, { ClassAttributes, ComponentClass, ComponentType, Dispatch, MutableRefObject, ReactElement, SetStateAction } from 'react'; // importing FunctionComponent
import { useStateVariable } from 'react-use-variable';

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


export type ConnectionState = Map<string, boolean>

export type ConnectionStateSetter = Dispatch<SetStateAction<ConnectionState>>;

export type ConnectionStateRef = MutableRefObject<ConnectionState>;

export const connectStore = <MappedProps, OwnProps>(
    useMapStores: (ownProps: OwnProps, connectionStateRef: ConnectionStateRef, setConnectionState: ConnectionStateSetter) => MappedProps,
    showElementWhileConnecting?: ReactElement | null
) => <C extends ComponentType<Matching<MappedProps, GetProps<C>>>>(
    WrappedComponent: C
): ComponentType<JSX.LibraryManagedAttributes<C, Omit<GetProps<C>, keyof MappedProps>>> => {
    return (props: any) => {

        const [connectionState, connectionStateRef, setConnectionState] = useStateVariable(new Map() as ConnectionState);

        const newProps = useMapStores(props, connectionStateRef, setConnectionState)
        if (Object.values(newProps).some(v => v === undefined)) {
            return (showElementWhileConnecting as any) || null;
        }
        if (Array.from(connectionState.values()).some(v => !v)) {
            return (showElementWhileConnecting as any) || null;
        }
        return <WrappedComponent {...props} {...newProps} />
    }
}
    

