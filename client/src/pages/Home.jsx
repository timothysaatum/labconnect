import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";

export default function App() {
  const { register, control, handleSubmit, reset, trigger, setError } = useForm(
    {
      defaultValues: {
        year: 200,
        me
      }
    }
  );
  const { fields, append, remove } = useFieldArray({
    control,
    name: "test",
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <ul>
        {fields.map((item, index) => (
          <li key={item.id}>
            <input {...register(`test.${index}.firstName`)} />
            <Controller
              render={({ field }) => <input {...field} />}
              name={`test.${index}.lastName`}
              control={control}
            />
            <button type="button" onClick={() => remove(index)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => append({ firstName: "bill", lastName: "luo" })}
      >
        append
      </button>
      <input type="submit" />
    </form>
  );
}
