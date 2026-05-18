import { ValidationError } from 'class-validator';
import { TErrorSource } from '../middlewares/globalErrors.filter';

export function handleClassValidatorErrors(errors: ValidationError[]): {
  message: string;
  errorSources: TErrorSource[];
} {
  const errorSources: TErrorSource[] = [];

  const extract = (errs: ValidationError[], parentPath = '') => {
    for (const err of errs) {
      const path = parentPath ? `${parentPath}.${err.property}` : err.property;
      if (err.constraints) {
        Object.values(err.constraints).forEach((msg) =>
          errorSources.push({ path, message: msg }),
        );
      }
      if (err.children?.length) extract(err.children, path);
    }
  };

  extract(errors);
  return { message: 'Validation Error', errorSources };
}
