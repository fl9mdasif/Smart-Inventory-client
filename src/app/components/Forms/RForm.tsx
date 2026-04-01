/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";

type TFormConfig = {
  resolver?: any;
  defaultValues?: Record<string, any>;
};

type TFormProps = {
  children: React.ReactNode;
  onSubmit: SubmitHandler<FieldValues>;
} & TFormConfig;

const RForm = ({ children, onSubmit, resolver, defaultValues }: TFormProps) => {
  const formConfig: TFormConfig = {
    defaultValues: defaultValues || {}, // Ensure defaultValues is always defined
  };

  if (resolver) {
    formConfig["resolver"] = resolver;
  }

  const methods = useForm(formConfig);
  const { handleSubmit, reset } = methods;

  const submit: SubmitHandler<FieldValues> = (data) => {
    // console.log(data);
    onSubmit(data);
    reset(defaultValues || {}); // Reset with defaultValues to maintain controlled state
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submit)}>{children}</form>
    </FormProvider>
  );
};

export default RForm;
