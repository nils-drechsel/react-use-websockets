import React, { ComponentType } from 'react'; // importing FunctionComponent
import { Matching, GetProps } from 'react-redux'

export const connectStore = <MappedProps, OwnProps>(
    mapProps: (ownProps: OwnProps) => MappedProps
) => <C extends ComponentType<Matching<MappedProps, GetProps<C>>>>(
    WrappedComponent: C
): ComponentType<JSX.LibraryManagedAttributes<C, Omit<GetProps<C>, keyof MappedProps>>> => {
        return (props: any) => {
            const newProps = mapProps(props)
            if (Object.values(newProps).some(v => v === undefined)) return null;
            return <WrappedComponent {...props} {...newProps} />
        }
    }

