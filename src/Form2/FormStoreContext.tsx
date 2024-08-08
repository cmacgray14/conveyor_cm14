import {
  createContext,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  type FieldValues,
  FormProvider,
  type UseFormReturn,
} from 'react-hook-form';
import { type StoreApi, createStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface FormState<D extends FieldValues> extends UseFormReturn<D> {
  id: string;
}

export const FormStoreContext = createContext<
  StoreApi<FormState<any>> | undefined
>(undefined);

export interface FormStoreProviderProps<D extends FieldValues>
  extends FormState<D> {
  children?: ReactNode;
}

export const FormStoreProvider = <D extends FieldValues>({
  children,
  ...formStateProps
}: FormStoreProviderProps<D>) => {
  const isMounted = useRef(false);
  const [store] = useState(() => createStore(immer(() => formStateProps)));
  /* 
    biome-ignore lint/correctness/useExhaustiveDependencies:
      The reference to tableState does not matter, only the contents.
  */
  useEffect(() => {
    if (isMounted.current) store.setState(() => formStateProps);
    else isMounted.current = true;
  }, [...Object.values(formStateProps), store]);
};
