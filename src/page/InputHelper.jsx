import { toast } from "sonner";

class InputHelper {
  constructor(formData, setFormData, validationSchema, onSubmit) {
    this.formData = formData;
    this.setFormData = setFormData;
    this.validationSchema = validationSchema;
    this.onSubmit = onSubmit;
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setFormData({ ...this.formData, [name]: value });
  };

  handleFileChange = (e) => {
    const { name, files } = e.target;
    this.setFormData({ ...this.formData, [name]: files });
  };

  validateForm = () => {
    for (const fieldName in this.validationSchema) {
      const fieldValidation = this.validationSchema[fieldName];
      const fieldValue = this.formData[fieldName];
      const alias = fieldValidation.alias || fieldName;

      if (fieldValidation.required && !fieldValue) {
        toast.error(`${alias} perlu diisi!`);
        return false;
      }

      if (
        fieldValidation.minLength &&
        fieldValue.length < fieldValidation.minLength
      ) {
        toast.error(`${alias} minimal ${fieldValidation.minLength} karakter!`);
        return false;
      }

      if (
        fieldValidation.maxLength &&
        fieldValue.length > fieldValidation.maxLength
      ) {
        toast.error(`${alias} maksimal ${fieldValidation.maxLength} karakter!`);
        return false;
      }

      if (
        fieldValidation.pattern &&
        !fieldValidation.pattern.test(fieldValue)
      ) {
        toast.error(`${alias} tidak valid!`);
        return false;
      }
    }
    return true;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.validateForm()) {
      this.formData = Object.fromEntries(
        Object.entries(this.formData).map(([key, value]) => [key, value])
      );

      this.onSubmit(this.formData);
    }
  };
}

export default InputHelper;
