import {Multiselect} from 'multiselect-react-dropdown'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Controller } from 'react-hook-form';


export default function SelectTest() {
  const tests = [
    { name: "Full Blood Count (FBC)", price: 50 }, // Implicit conversion to string
    { name: "Urinalysis", price: 30 },
    { name: "Blood Sugar (RBS)", price: 20 },
    { name: "Malaria Parasite Test", price: 25 },
    { name: "Rapid HIV Test", price: 40 },
    { name: "VDRL Test (Syphilis)", price: 35 },
    { name: "Electrolytes Panel", price: 60 },
    { name: "Kidney Function Test (KFT)", price: 70 },
    { name: "Liver Function Test (LFT)", price: 80 },
    { name: "Lipid Profile", price: 100 },
    { name: "Thyroid Function Test", price: 90 },
    { name: "Uric Acid Test", price: 45 },
    { name: "Pregnancy Test", price: 30 },
    { name: "Widal Test (Typhoid)", price: 40 },
    { name: "Stool Microscopic Examination", price: 50 },
    { name: "Blood Culture", price: 120 },
    { name: "Urine Culture", price: 100 },
    { name: "Chest X-ray", price: 150 },
    { name: "Electrocardiogram (ECG)", price: 80 },
  ];
const {register,handleSubmit,control}= useForm();
  const [options]= useState(tests);
  const onSubmit = (data) => {
    console.log(data);
  }
  return (
    <div>
      <Controller
        name="tests"
        control={control}
        defaultValue={[]}
        render={({ field: { value, onChange } }) => (
          <Multiselect
            options={options}
            showArrow
            placeholder="add test"
            selectedValues={value}
            showCheckbox
            displayValue="name"
            onSelect={(selectedList) => onChange(selectedList)}
            onRemove={(selectedList) => onChange(selectedList)}
            className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 text-gray-900 focus-within:border-cyan-500 focus-within:ring-cyan-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus-within:border-cyan-500 dark:focus-within:ring-cyan-500 text-sm rounded-lg"
          />
        )}
      />

      <button
        type="submit"
        className="w-full py-2 mt-2 text-white bg-cyan-500 rounded-lg hover:bg-cyan-600"
        onClick={handleSubmit(onSubmit)}
      >
        submit
      </button>
    </div>
  );
}
