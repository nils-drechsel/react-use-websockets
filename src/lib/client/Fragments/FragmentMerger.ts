import { AbstractIOBean, FragmentList, FragmentType } from "../../beans/Beans";
import { deserialise } from "../serialisation/Deserialisation";




export const mergeFragments = <BEAN extends AbstractIOBean>(bean: BEAN, fragmentList: FragmentList): BEAN => {

    bean = structuredClone(bean);


    fragmentList.fragments.forEach(fragment => {

        let base = bean;

        fragment.path.forEach((p, index) => {

            if (index === fragment.path.length - 1) {

                if (fragment.type === FragmentType.CREATE || fragment.type === FragmentType.MODIFY) {

                    if (base instanceof Map) {
                        base.set(p, deserialise(fragment.jsonPayload as string));
                    } else if (Array.isArray(base)) {

                        const i = parseInt(p);

                        if (fragment.type === FragmentType.CREATE) {
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

    
    return bean;

}