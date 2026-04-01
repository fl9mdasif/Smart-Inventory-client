// import {
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   FormHelperText,
//   SxProps,
//   Box,
// } from "@mui/material";
// import { Controller, useFormContext } from "react-hook-form";

// type TOption = {
//   value: string | number;
//   label: string;
// };

// type TSelectProps = {
//   name: string;
//   label?: string;
//   size?: "small" | "medium";
//   fullWidth?: boolean;
//   sx?: SxProps;
//   placeholder?: string;
//   required?: boolean;
//   options: TOption[];
// };

// const RSelect = ({
//   name,
//   label,
//   size = "small",
//   fullWidth,
//   sx,
//   required,
//   options,
// }: TSelectProps) => {
//   const { control } = useFormContext();

//   return (
//     <Controller
//       control={control}
//       name={name}
//       render={({ field, fieldState: { error } }) => (
//         <FormControl sx={{ ...sx }} fullWidth={fullWidth} error={!!error}>
//           {label && (
//             <InputLabel id={label} shrink={true}>
//               {label}
//             </InputLabel>
//           )}
//           <Box minWidth={200}>
//             {" "}
//             {/* Set a minimum width, adjust as needed */}
//             <Select {...field} label={label} size={size} required={required}>
//               {options.map((option) => (
//                 <MenuItem key={option.value} value={option.value}>
//                   {option.label}
//                 </MenuItem>
//               ))}
//             </Select>
//           </Box>
//           {error && <FormHelperText>{error.message}</FormHelperText>}
//         </FormControl>
//       )}
//     />
//   );
// };

// export default RSelect;
