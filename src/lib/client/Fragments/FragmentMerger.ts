import { AbstractStoreBean, FragmentList, FragmentType } from "../../beans/Beans";
import { deserialise } from "../serialisation/Deserialisation";




export const mergeFragments = <BEAN extends AbstractStoreBean>(bean: BEAN | undefined, fragmentList: FragmentList): BEAN | undefined => {

    bean = structuredClone(bean);

    console.log("starting bean", bean);

    fragmentList.fragments.forEach(fragment => {

        let base = bean;

        if (fragment.type === FragmentType.CREATE_BEAN) {
            bean = deserialise(fragment.jsonPayload as string);
            console.log("creating new bean", bean);
            return;
        }

        if (fragment.type === FragmentType.REMOVE_BEAN) {
            bean = undefined;
            console.log("removing bean");
            return;
        }


        fragment.path.forEach((p, index) => {

            if (index === fragment.path.length - 1) {

                if (fragment.type === FragmentType.CREATE_ITEM || fragment.type === FragmentType.MODIFY_ITEM) {

                    if (base instanceof Map) {
                        base.set(p, deserialise(fragment.jsonPayload as string));
                    } else if (Array.isArray(base)) {

                        const i = parseInt(p);

                        if (fragment.type === FragmentType.CREATE_ITEM) {
                            if (i !== base.length) throw new Error("fragment array index " + i + " doesn't match base array");
                            base.push(deserialise(fragment.jsonPayload as string));
                        } else {
                            const i = parseInt(p);

                            if (i >= base.length) throw new Error("fragment array index " + i + " doesn't match base array");
                            base[i] = deserialise(fragment.jsonPayload as string);
                        }

                    } else {
                        (base as any)[p] =  deserialise(fragment.jsonPayload as string) as any;
                    }
    
                } else {

                    if (base instanceof Map) {
                        base.delete(p);
                    } else if(Array.isArray(base)) {
                        base.splice(parseInt(p));
                    } else {
                        delete (base as any)[p];
                    }

                }


            } else {
                if (base instanceof Map) {
                    base = base.get(p);
                } else if (Array.isArray(base)) {
                    base = (base as Array<any>)[parseInt(p)];
                } else {
                    base = (base as any)[p];
                }

            }



        });

    });

    console.log("resulting bean", bean);


    return bean;

}